import { useState, useEffect, useRef } from "react";
import { redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/route";
import { getCurrentUser } from "~/services/api.server";
import { getUserToken } from "~/services/session.server";
import { usePageTitle, useTranslation } from "~/hooks";
import { useChat } from "~/hooks/useChat";
import { Layout } from "~/components/Layout";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import {
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  ChevronLeft,
  MessageSquarePlus,
  Users,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { ChatConversation, ChatContact, ChatMessage } from "~/lib/services/message.service";


// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  if (!user) throw redirect("/login");

  // Le token Sanctum est nécessaire côté client pour authentifier le canal
  // Reverb (WebSocket), qui passe par le endpoint /broadcasting/auth.
  const token = await getUserToken(request);

  return { user, token };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour:   "2-digit",
    minute: "2-digit",
  });
}

function formatConversationDate(dateString: string | null, t: any, language: string, interpolate: any): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now  = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60_000)       return t.chat.justNow;
  if (diff < 3_600_000)    return interpolate(t.chat.minutesAgo, { n: Math.floor(diff / 60_000) });
  if (diff < 86_400_000)   return formatTime(dateString);
  return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", { day: "2-digit", month: "short" });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// --- Indicateur de statut de connexion WebSocket ---
function ConnectionBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  
  // On peut choisir d'afficher ou non le badge quand on est connecté. 
  // Ici on le garde pour retour visuel (optionnel).
  
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium",
      status === "connecting" && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
      status === "error"      && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      status === "connected"  && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      status === "idle"       && "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
    )}>
      {status === "connecting" && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === "connected"  && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
      {status === "error"      && <WifiOff className="h-3 w-3" />}
      {status === "idle"       && <WifiOff className="h-3 w-3" />}
      <span>
        {status === "connecting" && t.chat.connectionStatus.connecting}
        {status === "connected"  && t.chat.connectionStatus.connected}
        {status === "error"      && t.chat.connectionStatus.disconnected}
        {status === "idle"       && t.chat.connectionStatus.offline}
      </span>
    </div>
  );
}

// --- Bulles de message ---
function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={cn(
      "flex w-full max-w-[85%] md:max-w-[70%] lg:max-w-[60%]",
      message.is_mine ? "ml-auto justify-end" : "mr-auto justify-start"
    )}>
      <div className={cn("flex flex-col gap-1", message.is_mine ? "items-end" : "items-start")}>
        <div className={cn(
          "px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed break-words",
          message.is_mine
            ? "bg-gradient-to-br from-babana-blue to-babana-cyan text-white rounded-tr-none"
            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-700"
        )}>
          {message.content}
        </div>

        <div className="flex items-center gap-1.5 px-1">
          <span className="text-[10px] text-zinc-400">{formatTime(message.created_at)}</span>
          {message.is_mine && (
            <span className={cn(
              "flex items-center",
              message.status === "read" ? "text-babana-cyan" : "text-zinc-300 dark:text-zinc-600"
            )}>
              {message.status === "sent"      && <Check className="h-3 w-3" />}
              {message.status === "delivered" && <CheckCheck className="h-3 w-3" />}
              {message.status === "read"      && <CheckCheck className="h-3 w-3" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Item de conversation dans la sidebar ---
function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation:  ChatConversation;
  isActive:      boolean;
  onClick:       () => void;
}) {
  const { t, language, interpolate } = useTranslation();
  const participantName = conversation.participant?.name ?? conversation.label ?? t.chat.conversation;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left",
        isActive
          ? "bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
          <AvatarFallback className={cn(
            "text-sm font-bold",
            isActive ? "bg-babana-cyan text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          )}>
            {getInitials(participantName)}
          </AvatarFallback>
        </Avatar>
        {conversation.participant?.is_online && (
          <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-zinc-50 dark:ring-zinc-900 shadow-sm" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className={cn(
            "font-semibold truncate text-sm",
            isActive ? "text-babana-blue" : "text-zinc-900 dark:text-zinc-100"
          )}>
            {participantName}
          </span>
          <span className="text-[10px] text-zinc-400 whitespace-nowrap ml-2 shrink-0">
            {formatConversationDate(conversation.last_message_at, t, language, interpolate)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate pr-2">
            {conversation.participant?.is_online && (
              <span className="text-green-500 mr-1.5 font-bold">●</span>
            )}
            {conversation.last_message
              ? (conversation.last_message.is_mine ? `${t.chat.you} : ` : "") + conversation.last_message.content
              : <span className="italic opacity-50">{t.chat.noMessage}</span>
            }
          </p>
          {conversation.unread_count > 0 && (
            <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center bg-babana-cyan hover:bg-babana-cyan text-[10px] shrink-0">
              {conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// --- Item de contact dans la liste de contacts ---
function ContactItem({
  contact,
  onClick,
}: {
  contact: ChatContact;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all text-left"
    >
      <div className="relative shrink-0">
        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
          <AvatarFallback className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        {contact.is_online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</p>
        <p className="text-xs text-zinc-500 truncate">
          {contact.roles[0] ?? "Utilisateur"}
          {contact.is_online && <span className="ml-2 text-green-500">· En ligne</span>}
        </p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const { user, token } = useLoaderData<typeof loader>();
  const { t, interpolate } = useTranslation();
  usePageTitle(t.chat.messages);

  const chat = useChat({ userId: user?.id, userName: user?.name, token });

  const [searchQuery,   setSearchQuery]   = useState("");
  const [activeTab,     setActiveTab]     = useState<"conversations" | "contacts">("conversations");
  const scrollRef                         = useRef<HTMLDivElement>(null);

  // Scroller vers le bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, chat.activeConversation]);

  // Filtres
  const filteredConversations = chat.conversations.filter((c) => {
    const name = c.participant?.name ?? c.label ?? "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredContacts = chat.contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const participantName =
    chat.activeConversation?.participant?.name ??
    chat.activeConversation?.label ??
    "Conversation";

  // Touche Entrée pour envoyer
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chat.sendMessage();
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-[1600px] mx-auto p-0 md:p-6 lg:px-8">
        <Card className="h-full border-0 md:border md:shadow-sm overflow-hidden bg-white dark:bg-zinc-950 flex flex-col md:flex-row">

          {/* ================================================================
              SIDEBAR – Conversations + Contacts
          ================================================================ */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50 h-full transition-all duration-300",
            chat.activeConversation ? "hidden md:flex" : "flex"
          )}>
            {/* Header sidebar */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.chat.messages}</h2>
                <div className="flex items-center gap-2">
                  <ConnectionBadge status={chat.connectionStatus} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    onClick={chat.refreshConversations}
                    title={t.chat.refresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder={t.chat.searchPlaceholder}
                  className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("conversations")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    activeTab === "conversations"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  {t.chat.conversationsTab}
                  {chat.conversations.some((c) => c.unread_count > 0) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-babana-cyan" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    activeTab === "contacts"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  {t.chat.contactsTab}
                </button>
              </div>
            </div>

            {/* Liste */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-1">

                {/* Tab: Conversations */}
                {activeTab === "conversations" && (
                  <>
                    {chat.isLoadingConversations ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="text-center py-10 space-y-2">
                        <MessageSquarePlus className="h-8 w-8 mx-auto text-zinc-300" />
                        <p className="text-sm text-zinc-500">{t.chat.noConversations}</p>
                        <p className="text-xs text-zinc-400">
                          {t.chat.noConversationsSub}
                        </p>
                      </div>
                    ) : (
                      filteredConversations.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isActive={chat.activeConversation?.id === conv.id}
                          onClick={() => chat.selectConversation(conv)}
                        />
                      ))
                    )}
                  </>
                )}

                {/* Tab: Contacts */}
                {activeTab === "contacts" && (
                  <>
                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-sm text-zinc-500">{t.chat.noContactsFound}</p>
                      </div>
                    ) : (
                      filteredContacts.map((contact) => (
                        <ContactItem
                          key={contact.id}
                          contact={contact}
                          onClick={() => chat.startConversationWith(contact)}
                        />
                      ))
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* ================================================================
              ZONE PRINCIPALE – Chat
          ================================================================ */}
          {chat.activeConversation ? (
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950">

              {/* Header chat */}
              <div className="h-16 md:h-20 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden -ml-2 text-zinc-500"
                    onClick={() => chat.selectConversation(null as any)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <div className="relative">
                    <Avatar className="h-9 w-9 md:h-10 md:w-10">
                      <AvatarFallback className="bg-babana-blue/10 text-babana-blue text-sm font-bold">
                        {getInitials(participantName)}
                      </AvatarFallback>
                    </Avatar>
                    {chat.activeConversation?.participant?.is_online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm md:text-base leading-tight">
                      {participantName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {chat.activeConversation?.participant?.is_online ? (
                        <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          {t.chat.online}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-zinc-400 italic">
                          <span>●</span> {t.chat.offline}
                        </span>
                      )}
                      
                      <span className="text-zinc-300 dark:text-zinc-800">|</span>
                      
                      {chat.connectionStatus === "connected" && (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                          {t.chat.realTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-950">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.info("Fonctionnalité à venir")}>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Rechercher dans la conversation</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Container des messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-5 bg-zinc-50/30 dark:bg-zinc-900/10 scroll-smooth"
              >
                {chat.isLoadingMessages ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : chat.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 bg-babana-cyan/10 rounded-2xl flex items-center justify-center mb-4">
                      <MessageSquarePlus className="h-8 w-8 text-babana-cyan" />
                    </div>
                    <p className="text-zinc-500 text-sm">{t.chat.noMessage}</p>
                    <p className="text-zinc-400 text-xs mt-1">{t.chat.startChat}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-2">
                      <span className="text-[10px] uppercase font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                        {t.chat.conversation}
                      </span>
                    </div>
                    {chat.messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    {chat.typingUsers.length > 0 && (
                      <div className="flex items-center gap-2 text-zinc-400 animate-pulse pb-2">
                        <div className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce duration-700" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce duration-700" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce duration-700" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs italic">
                          {chat.typingUsers.join(", ")} {chat.typingUsers.length > 1 ? t.chat.typingMultiple : t.chat.typing}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Zone de saisie */}
              <div className="p-3 md:p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-end gap-2 max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-900 p-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-babana-cyan/20 focus-within:border-babana-cyan transition-all shadow-xs">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full text-zinc-400 hover:text-babana-cyan hover:bg-babana-cyan/10 shrink-0"
                    onClick={() => toast.info(t.chat.attachments)}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Input
                    value={chat.inputText}
                    onChange={(e) => {
                      chat.setInputText(e.target.value);
                      chat.sendTypingEvent();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={t.chat.inputPlaceholder}
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 min-h-[44px] py-3 text-base"
                    autoComplete="off"
                    disabled={chat.isSending}
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10 shrink-0 hidden sm:flex"
                    onClick={() => toast.info(t.chat.emojis)}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    onClick={chat.sendMessage}
                    disabled={!chat.inputText.trim() || chat.isSending}
                    className={cn(
                      "h-10 w-10 rounded-full shrink-0 transition-all duration-200",
                      chat.inputText.trim() && !chat.isSending
                        ? "bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-md shadow-babana-cyan/20"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                  >
                    {chat.isSending
                      ? <Loader2 className="h-5 w-5 animate-spin" />
                      : <Send className="h-5 w-5 ml-0.5" />
                    }
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* ================================================
               Empty state
            ================================================ */
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/30 text-center">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xs mb-6 animate-in zoom-in-50 duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-babana-cyan/20 to-babana-blue/20 rounded-2xl flex items-center justify-center">
                  <MessageSquarePlus className="w-10 h-10 text-babana-cyan" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 mb-2">
                {t.chat.emptyStateTitle}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                {t.chat.emptyStateDesc}
              </p>
              <div className="mt-6">
                <ConnectionBadge status={chat.connectionStatus} />
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
