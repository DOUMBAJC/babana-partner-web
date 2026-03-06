/**
 * Hook useChat – gestion complète de la messagerie en temps réel.
 *
 * Fonctionnalités :
 *  - Chargement des conversations et contacts depuis l'API
 *  - Connexion WebSocket via Laravel Echo + Reverb
 *  - Réception en temps réel des messages entrants (direct, groupes, support admin)
 *  - Envoi de messages avec optimistic update
 *  - Marquage automatique comme lu lors de l'ouverture d'une conversation
 *  - Canal de présence pour le statut en ligne
 *  - Création de groupes de discussion
 *  - Contact admin (canal de support dédié)
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
  type CreateGroupPayload,
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

  if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
  }

  (window as any).Pusher = Pusher;

  const apiUrl = import.meta.env.VITE_APP_API_URL ?? "http://localhost:8000/api";

  return new Echo({
    broadcaster:       "reverb",
    key:               appKey,
    wsHost:            host,
    wsPort:            port,
    wssPort:           port,
    forceTLS:          scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint:      `${apiUrl}/broadcasting/auth`,
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
  userId:   string | undefined;
  userName: string | undefined;
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
  typingUsers:            string[];
  // Modal state
  isGroupModalOpen:       boolean;
  isContactAdminLoading:  boolean;
  // Actions
  setInputText:           (text: string) => void;
  selectConversation:     (conversation: ChatConversation | null) => void;
  startConversationWith:  (contact: ChatContact) => Promise<void>;
  sendMessage:            () => Promise<void>;
  refreshConversations:   () => Promise<void>;
  isUserOnline:           (id: string) => boolean;
  sendTypingEvent:        () => void;
  openGroupModal:         () => void;
  closeGroupModal:        () => void;
  createGroup:            (payload: CreateGroupPayload) => Promise<void>;
  contactAdmin:           () => Promise<void>;
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
  const [isGroupModalOpen,        setIsGroupModalOpen]        = useState(false);
  const [isContactAdminLoading,   setIsContactAdminLoading]   = useState(false);
  const lastTypingTimeRef                                     = useRef<number>(0);

  if (token) {
    setApiToken(token);
  }

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

    // Canal privé : messages entrants (fonctionne pour direct, groupes et admin_support
    // car le serveur broadcast sur le canal de chaque participant)
    echo
      .private(`chat.${userId}`)
      .listen(".MessageSent", (event: { message: any }) => {
        const msg = event.message;
        const incomingMsg: ChatMessage = { ...msg, is_mine: false };

        setConversations((prev) => {
          const exists = prev.some((c) => c.id === incomingMsg.conversation_id);

          if (exists) {
            return prev.map((conv) =>
              conv.id === incomingMsg.conversation_id
                ? {
                    ...conv,
                    last_message: {
                      content:    incomingMsg.content,
                      created_at: incomingMsg.created_at,
                      is_mine:    false,
                      sender:     incomingMsg.sender.name,
                    },
                    unread_count:    activeConvRef.current?.id === incomingMsg.conversation_id ? 0 : (conv.unread_count || 0) + 1,
                    last_message_at: incomingMsg.created_at,
                  }
                : conv
            ).sort((a, b) =>
              new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime()
            );
          } else {
            // Nouvelle conversation reçue via WS → recharger pour avoir les infos complètes
            loadConversations();
            return prev;
          }
        });

        if (activeConvRef.current?.id === incomingMsg.conversation_id) {
          setMessages((prev) => {
            if (prev.some(m => m.id === incomingMsg.id)) return prev;
            return [...prev, incomingMsg];
          });
          messageService.markAsRead(incomingMsg.conversation_id).catch(console.warn);
        }
      })
      .error(() => setConnectionStatus("error"));

    // Canal de présence global
    echo
      .join("babana-chat")
      .here((members: any[]) => {
        const ids = new Set(members.map((m) => String(m.id)));
        setOnlineUserIds(ids);
      })
      .joining((member: any) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.add(String(member.id));
          return next;
        });
      })
      .leaving((member: any) => {
        setOnlineUserIds((prev) => {
          const next = new Set(prev);
          next.delete(String(member.id));
          return next;
        });
      })
      .error((err: any) => console.error("[useChat] Erreur canal présence:", err));

    setConnectionStatus("connected");

    return () => {
      echo.leave("babana-chat");
      echo.leave(`chat.${userId}`);
      echo.disconnect();
      echoRef.current = null;
      setConnectionStatus("idle");
    };
  }, [userId, token, loadConversations]);

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

    echo.join(channelName)
      .here(() => {})
      .listenForWhisper("typing", (e: { name: string; typing: boolean }) => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (e.typing) next.add(e.name);
          else next.delete(e.name);
          return next;
        });
      });

    return () => {
      echo.leave(channelName);
      setTypingUsers(new Set());
    };
  }, [activeConversation?.id, userId]);

  // -------------------------------------------------------------------------
  // Actions – Messages
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

  const selectConversation = useCallback((conversation: ChatConversation | null) => {
    setActiveConversation(conversation);
    setInputText("");
    if (conversation) loadMessages(conversation.id);
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
      setMessages((prev) => prev.map((m) => m.id === optimisticId ? { ...sent, is_mine: true } : m));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, last_message: { content, created_at: sent.created_at, is_mine: true, sender: null }, last_message_at: sent.created_at }
            : c
        ).sort((a, b) => new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime())
      );
    } catch {
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
    if (now - lastTypingTimeRef.current < 2000) return;
    lastTypingTimeRef.current = now;

    echoRef.current
      .join(`conversation.${activeConversation.id}`)
      .whisper("typing", { name: userName || "L'interlocuteur", typing: true });

    setTimeout(() => {
      if (Date.now() - lastTypingTimeRef.current >= 3000) {
        echoRef.current
          ?.join(`conversation.${activeConversation.id}`)
          .whisper("typing", { name: userName || "L'interlocuteur", typing: false });
      }
    }, 3000);
  }, [activeConversation, userName]);

  // -------------------------------------------------------------------------
  // Actions – Groupes
  // -------------------------------------------------------------------------

  const openGroupModal  = useCallback(() => setIsGroupModalOpen(true), []);
  const closeGroupModal = useCallback(() => setIsGroupModalOpen(false), []);

  const createGroup = useCallback(async (payload: CreateGroupPayload) => {
    try {
      const conv = await messageService.createGroup(payload);
      setConversations((prev) => [conv, ...prev]);
      selectConversation(conv);
      closeGroupModal();
      toast.success(`Groupe "${payload.label}" créé avec succès !`);
    } catch {
      toast.error("Impossible de créer le groupe.");
    }
  }, [selectConversation, closeGroupModal]);

  // -------------------------------------------------------------------------
  // Actions – Contact Admin
  // -------------------------------------------------------------------------

  const contactAdmin = useCallback(async () => {
    setIsContactAdminLoading(true);
    try {
      const conv = await messageService.contactAdmin();
      // Vérifier si la conv existe déjà dans la liste
      setConversations((prev) =>
        prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]
      );
      selectConversation(conv);
    } catch {
      toast.error("Impossible de contacter l'administration.");
    } finally {
      setIsContactAdminLoading(false);
    }
  }, [selectConversation]);

  // -------------------------------------------------------------------------
  // Enrichissement online status
  // -------------------------------------------------------------------------

  const contactsWithOnlineStatus = contacts.map((c) => ({
    ...c,
    is_online: onlineUserIds.has(c.id),
  }));

  const conversationsWithOnlineStatus = conversations.map((conv) => ({
    ...conv,
    participant: conv.participant ? {
      ...conv.participant,
      is_online: onlineUserIds.has(conv.participant.id),
    } : null,
    participants: conv.participants.map((p) => ({
      ...p,
      is_online: onlineUserIds.has(p.id),
    })),
  }));

  return {
    conversations:         conversationsWithOnlineStatus,
    contacts:              contactsWithOnlineStatus,
    activeConversation:    activeConversation
      ? conversationsWithOnlineStatus.find(c => c.id === activeConversation.id) || null
      : null,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    connectionStatus,
    inputText,
    typingUsers:           Array.from(typingUsers),
    isGroupModalOpen,
    isContactAdminLoading,
    setInputText,
    selectConversation,
    startConversationWith,
    sendMessage,
    refreshConversations:  loadConversations,
    isUserOnline:          (id: string) => onlineUserIds.has(id),
    sendTypingEvent,
    openGroupModal,
    closeGroupModal,
    createGroup,
    contactAdmin,
  };
}
