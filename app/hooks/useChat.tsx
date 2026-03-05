/**
 * Hook useChat – gestion complète de la messagerie en temps réel.
 *
 * Fonctionnalités :
 *  - Chargement des conversations et contacts depuis l'API
 *  - Connexion WebSocket via Laravel Echo + Reverb
 *  - Réception en temps réel des messages entrants
 *  - Envoi de messages avec optimistic update
 *  - Marquage automatique comme lu lors de l'ouverture d'une conversation
 *  - Canal de présence pour le statut en ligne
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { setApiToken } from "~/lib";
import {
  messageService,
  type ChatConversation,
  type ChatMessage,
  type ChatContact,
} from "~/lib/services/message.service";

// ---------------------------------------------------------------------------
// Echo factory
// ---------------------------------------------------------------------------

function createEchoInstance(token: string): Echo<any> | null {
  const appKey = import.meta.env.VITE_REVERB_APP_KEY;
  const host   = import.meta.env.VITE_REVERB_HOST    ?? "localhost";
  const port   = Number(import.meta.env.VITE_REVERB_PORT   ?? 8080);
  const scheme = import.meta.env.VITE_REVERB_SCHEME  ?? "http";

  if (!appKey) {
    console.warn("[Echo] VITE_REVERB_APP_KEY manquant – temps réel désactivé.");
    return null;
  }

  // Activer les logs Pusher pour le débogage en développement
  if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
  }
  
  (window as any).Pusher = Pusher;

  const apiUrl = import.meta.env.VITE_APP_API_URL ?? "http://localhost:8000/api";

  console.log("[Echo] Tentative de connexion à Reverb:", { host, port, scheme, apiUrl });

  return new Echo({
    broadcaster:       "reverb",
    key:               appKey,
    wsHost:            host,
    wsPort:            port,
    wssPort:           port,
    forceTLS:          scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint:      `${apiUrl}/broadcasting/auth`, // Changé : utilise le préfixe /api
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Key":   import.meta.env.VITE_APP_API_KEY ?? "",
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface UseChatOptions {
  /** ID de l'utilisateur connecté */
  userId:   string | undefined;
  /** Nom de l'utilisateur connecté */
  userName: string | undefined;
  /** Token Sanctum fourni par le loader (server-side) */
  token:    string | undefined;
}

export interface UseChat {
  // State
  conversations:          ChatConversation[];
  contacts:               ChatContact[];
  activeConversation:     ChatConversation | null;
  messages:               ChatMessage[];
  isLoadingConversations: boolean;
  isLoadingMessages:      boolean;
  isSending:              boolean;
  connectionStatus:       ConnectionStatus;
  inputText:              string;
  // Actions
  setInputText:           (text: string) => void;
  selectConversation:     (conversation: ChatConversation) => void;
  startConversationWith:  (contact: ChatContact) => Promise<void>;
  sendMessage:            () => Promise<void>;
  refreshConversations:   () => Promise<void>;
  isUserOnline:           (id: string) => boolean;
  sendTypingEvent:        () => void;
  typingUsers:            string[]; // Noms des utilisateurs qui écrivent dans la conv active
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useChat({ userId, userName, token }: UseChatOptions): UseChat {
  const [conversations,           setConversations]           = useState<ChatConversation[]>([]);
  const [contacts,                setContacts]                = useState<ChatContact[]>([]);
  const [activeConversation,      setActiveConversation]      = useState<ChatConversation | null>(null);
  const [messages,                setMessages]                = useState<ChatMessage[]>([]);
  const [isLoadingConversations,  setIsLoadingConversations]  = useState(false);
  const [isLoadingMessages,       setIsLoadingMessages]       = useState(false);
  const [isSending,               setIsSending]               = useState(false);
  const [connectionStatus,        setConnectionStatus]        = useState<ConnectionStatus>("idle");
  const [inputText,               setInputText]               = useState("");
  const [onlineUserIds,           setOnlineUserIds]           = useState<Set<string>>(new Set());
  const [typingUsers,             setTypingUsers]             = useState<Set<string>>(new Set());
  const lastTypingTimeRef                                     = useRef<number>(0);

  // Configurer le token API global immédiatement si présent
  // Cela garantit que les appels messageService dans les useEffect auront le token
  if (token) {
    setApiToken(token);
  }

  // Refs pour garder les valeurs à jour dans les closures Echo
  const echoRef       = useRef<Echo<any> | null>(null);
  const activeConvRef = useRef<ChatConversation | null>(null);
  activeConvRef.current = activeConversation;

  // -------------------------------------------------------------------------
  // Chargement initial
  // -------------------------------------------------------------------------

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch {
      toast.error("Impossible de charger les conversations.");
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      const data = await messageService.getContacts();
      setContacts(data);
    } catch {
      console.warn("[useChat] Contacts inaccessibles.");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadConversations();
    loadContacts();
  }, [userId, loadConversations, loadContacts]);

  // -------------------------------------------------------------------------
  // WebSocket – canal privé et canal de présence
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!userId || !token) return;

    setConnectionStatus("connecting");
    const echo = createEchoInstance(token);
    if (!echo) {
      setConnectionStatus("error");
      return;
    }

    echoRef.current = echo;

    // 1. Rejoindre le canal privé pour les messages
    echo
      .private(`chat.${userId}`)
      .listen(".MessageSent", (event: { message: any }) => {
        const msg = event.message;
        console.log("[useChat] Message reçu en temps réel:", msg);
        
        const incomingMsg: ChatMessage = { ...msg, is_mine: false };

        setConversations((prev) => {
          const exists = prev.some((c) => c.id === incomingMsg.conversation_id);
          
          if (exists) {
            // Mise à jour d'une conversation existante
            return prev.map((conv) =>
              conv.id === incomingMsg.conversation_id
                ? {
                    ...conv,
                    last_message:    { content: incomingMsg.content, created_at: incomingMsg.created_at, is_mine: false },
                    unread_count:    activeConvRef.current?.id === incomingMsg.conversation_id ? 0 : (conv.unread_count || 0) + 1,
                    last_message_at: incomingMsg.created_at,
                  }
                : conv
            ).sort((a, b) =>
              new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime()
            );
          } else {
            // Nouvelle conversation – on l'ajoute à la liste
            console.log("[useChat] Nouvelle conversation détectée:", incomingMsg.conversation_id);
            const newConv: ChatConversation = {
              id: incomingMsg.conversation_id,
              label: null,
              participant: {
                id:   incomingMsg.sender.id,
                name: incomingMsg.sender.name,
              },
              last_message: {
                content:    incomingMsg.content,
                created_at: incomingMsg.created_at,
                is_mine:    false,
              },
              unread_count:    activeConvRef.current?.id === incomingMsg.conversation_id ? 0 : 1,
              last_message_at: incomingMsg.created_at,
            };
            return [newConv, ...prev].sort((a, b) =>
              new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime()
            );
          }
        });

        if (activeConvRef.current?.id === incomingMsg.conversation_id) {
          setMessages((prev) => {
            // Éviter les doublons si le message a déjà été ajouté (cas rare)
            if (prev.some(m => m.id === incomingMsg.id)) return prev;
            return [...prev, incomingMsg];
          });
          messageService.markAsRead(incomingMsg.conversation_id).catch(console.warn);
        }
      })
      .error(() => setConnectionStatus("error"));

    // 2. Rejoindre le canal de présence global pour le statut en ligne
    echo
      .join("babana-chat")
      .here((members: any[]) => {
        console.log("[useChat] Présence – utilisateurs ici:", members);
        const ids = new Set(members.map((m) => String(m.id)));
        setOnlineUserIds(ids);
      })
      .joining((member: any) => {
        console.log("[useChat] Présence – rejoint:", member);
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.add(String(member.id));
          return next;
        });
      })
      .leaving((member: any) => {
        console.log("[useChat] Présence – quitte:", member);
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(String(member.id));
          return next;
        });
      })
      .error((err: any) => {
        console.error("[useChat] Erreur canal présence:", err);
      });

    setConnectionStatus("connected");

    return () => {
      console.log("[useChat] Déconnexion WebSocket...");
      echo.leave("babana-chat");
      echo.leave(`chat.${userId}`);
      echo.disconnect();
      echoRef.current = null;
      setConnectionStatus("idle");
    };
  }, [userId, token]);

  // -------------------------------------------------------------------------
  // WebSocket – Typing indicator per conversation
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!activeConversation || !echoRef.current || !userId) {
      setTypingUsers(new Set());
      return;
    }

    const channelName = `conversation.${activeConversation.id}`;
    const echo = echoRef.current;

    const channel = echo.join(channelName)
      .here((members: any[]) => {
        // Optionnel : on pourrait aussi utiliser ce canal pour le online status précis
      })
      .listenForWhisper("typing", (e: { name: string; typing: boolean }) => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (e.typing) {
            next.add(e.name);
          } else {
            next.delete(e.name);
          }
          return next;
        });
      });

    return () => {
      echo.leave(channelName);
      setTypingUsers(new Set());
    };
  }, [activeConversation?.id, userId]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    setMessages([]);
    try {
      const { data } = await messageService.getMessages(conversationId);
      setMessages(data);
      await messageService.markAsRead(conversationId);
      setConversations((prev) =>
        prev.map((c) => c.id === conversationId ? { ...c, unread_count: 0 } : c)
      );
    } catch {
      toast.error("Impossible de charger les messages.");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const selectConversation = useCallback((conversation: ChatConversation) => {
    setActiveConversation(conversation);
    setInputText("");
    loadMessages(conversation.id);
  }, [loadMessages]);

  const startConversationWith = useCallback(async (contact: ChatContact) => {
    try {
      const conv = await messageService.getOrCreateConversation(contact.id);
      setConversations((prev) =>
        prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]
      );
      selectConversation(conv);
    } catch {
      toast.error("Impossible d'ouvrir la conversation.");
    }
  }, [selectConversation]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || !activeConversation || isSending) return;

    const content        = inputText.trim();
    const conversationId = activeConversation.id;
    const optimisticId   = `optimistic-${Date.now()}`;

    setInputText("");

    // Optimistic update
    const optimisticMsg: ChatMessage = {
      id:              optimisticId,
      conversation_id: conversationId,
      sender_id:       userId ?? "",
      content,
      status:          "sent",
      attachments:     [],
      is_mine:         true,
      created_at:      new Date().toISOString(),
      sender:          { id: userId ?? "", name: "Vous" },
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    setIsSending(true);
    try {
      const sent = await messageService.sendMessage(conversationId, content);

      // Remplacer le message optimiste
      setMessages((prev) => prev.map((m) => m.id === optimisticId ? { ...sent, is_mine: true } : m));

      // Mettre à jour last_message de la conversation
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, last_message: { content, created_at: sent.created_at, is_mine: true }, last_message_at: sent.created_at }
            : c
        ).sort((a, b) => new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime())
      );
    } catch {
      // Rollback
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setInputText(content);
      toast.error("Échec de l'envoi du message.");
    } finally {
      setIsSending(false);
    }
  }, [inputText, activeConversation, userId, isSending]);

  const sendTypingEvent = useCallback(() => {
    if (!activeConversation || !echoRef.current) return;

    const now = Date.now();
    if (now - lastTypingTimeRef.current < 2000) return; // Throttle 2s

    lastTypingTimeRef.current = now;
    
    echoRef.current
      .join(`conversation.${activeConversation.id}`)
      .whisper("typing", {
        name:   userName || "L'interlocuteur",
        typing: true,
      });

    // Arrêter l'indicateur après 3 secondes d'inactivité
    setTimeout(() => {
      if (Date.now() - lastTypingTimeRef.current >= 3000) {
        echoRef.current
          ?.join(`conversation.${activeConversation.id}`)
          .whisper("typing", {
            name:   userName || "L'interlocuteur",
            typing: false,
          });
      }
    }, 3000);
  }, [activeConversation, userName]);

  const contactsWithOnlineStatus = contacts.map((c) => ({
    ...c,
    is_online: onlineUserIds.has(c.id),
  }));

  const conversationsWithOnlineStatus = conversations.map((conv) => ({
    ...conv,
    participant: conv.participant ? {
      ...conv.participant,
      is_online: onlineUserIds.has(conv.participant.id)
    } : null,
  }));

  return {
    conversations: conversationsWithOnlineStatus,
    contacts: contactsWithOnlineStatus,
    activeConversation: activeConversation ? conversationsWithOnlineStatus.find(c => c.id === activeConversation.id) || null : null,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    connectionStatus,
    inputText,
    setInputText,
    selectConversation,
    startConversationWith,
    sendMessage,
    refreshConversations: loadConversations,
    isUserOnline: (id: string) => onlineUserIds.has(id),
    sendTypingEvent,
    typingUsers: Array.from(typingUsers),
  };
}
