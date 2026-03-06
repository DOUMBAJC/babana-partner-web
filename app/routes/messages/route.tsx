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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
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
  WifiOff,
  RefreshCw,
  Plus,
  ShieldAlert,
  UserPlus,
  UsersRound,
  X,
  Crown,
  Building2,
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
import type { ChatConversation, ChatContact, ChatMessage, ChatUser } from "~/lib/services/message.service";
import type { Translations } from "~/lib/translations";

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  if (!user) throw redirect("/login");

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

function formatConversationDate(
  dateString: string | null,
  t: Translations,
  language: string,
  interpolate: (text: string, params: Record<string, string | number>) => string
): string {
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

// --- Badge connexion WebSocket ---
function ConnectionBadge({ status }: { status: string }) {
  const { t } = useTranslation();
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

// --- Bulle de message ---
function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={cn(
      "flex w-full max-w-[85%] md:max-w-[70%] lg:max-w-[60%]",
      message.is_mine ? "ml-auto justify-end" : "mr-auto justify-start"
    )}>
      {!message.is_mine && (
        <Avatar className="h-7 w-7 mr-2 shrink-0 self-end mb-5">
          <AvatarFallback className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
            {getInitials(message.sender.name)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col gap-1", message.is_mine ? "items-end" : "items-start")}>
        {!message.is_mine && (
          <span className="text-[10px] text-zinc-500 px-1 font-medium">{message.sender.name}</span>
        )}
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
            <span className={cn("flex items-center", message.status === "read" ? "text-babana-cyan" : "text-zinc-300 dark:text-zinc-600")}>
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

// --- Badge de type de conversation ---
function ConvTypeBadge({ conversation }: { conversation: ChatConversation }) {
  const { t } = useTranslation();
  if (conversation.is_admin_support) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
        <ShieldAlert className="h-2.5 w-2.5" />
        {t.chat.adminChatBadge}
      </span>
    );
  }
  if (conversation.is_group) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
        <UsersRound className="h-2.5 w-2.5" />
        {t.chat.groupBadge}
      </span>
    );
  }
  return null;
}

// --- Item de conversation dans la sidebar ---
function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: ChatConversation;
  isActive:     boolean;
  onClick:      () => void;
}) {
  const { t, language, interpolate } = useTranslation();

  // Nom affiché selon le type
  const displayName = conversation.is_group || conversation.is_admin_support
    ? (conversation.label ?? t.chat.conversation)
    : (conversation.participant?.name ?? conversation.label ?? t.chat.conversation);

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
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700">
          <AvatarFallback className={cn(
            "text-sm font-bold",
            conversation.is_admin_support
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              : conversation.is_group
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              : isActive
              ? "bg-babana-cyan text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          )}>
            {conversation.is_admin_support
              ? <ShieldAlert className="h-5 w-5" />
              : conversation.is_group
              ? <UsersRound className="h-5 w-5" />
              : getInitials(displayName)
            }
          </AvatarFallback>
        </Avatar>
        {/* Pastille online pour les conversations directes */}
        {!conversation.is_group && !conversation.is_admin_support && conversation.participant?.is_online && (
          <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-zinc-50 dark:ring-zinc-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn(
              "font-semibold truncate text-sm",
              isActive ? "text-babana-blue" : "text-zinc-900 dark:text-zinc-100"
            )}>
              {displayName}
            </span>
            <ConvTypeBadge conversation={conversation} />
          </div>
          <span className="text-[10px] text-zinc-400 whitespace-nowrap shrink-0">
            {formatConversationDate(conversation.last_message_at, t, language, interpolate)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate pr-2">
            {conversation.is_group && conversation.last_message && !conversation.last_message.is_mine && conversation.last_message.sender && (
              <span className="text-zinc-600 dark:text-zinc-300 font-medium mr-1">
                {conversation.last_message.sender.split(" ")[0]}:
              </span>
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

// --- Item de contact ---
function ContactItem({
  contact,
  onClick,
}: {
  contact: ChatContact;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all text-left"
    >
      <div className="relative shrink-0">
        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
          <AvatarFallback className={cn(
            "text-xs font-bold",
            contact.is_admin
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          )}>
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        {contact.is_online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</p>
          {contact.is_admin && (
            <Crown className="h-3 w-3 text-orange-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-zinc-500 truncate">
          {contact.roles[0] ?? "Utilisateur"}
          {contact.is_online && <span className="ml-2 text-green-500">· {t.chat.online}</span>}
        </p>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Modal Créer un groupe
// ---------------------------------------------------------------------------

function CreateGroupModal({
  open,
  onClose,
  contacts,
  onCreateGroup,
}: {
  open:          boolean;
  onClose:       () => void;
  contacts:      ChatContact[];
  onCreateGroup: (payload: { label: string; description?: string; member_ids: string[] }) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [label,        setLabel]        = useState("");
  const [description,  setDescription]  = useState("");
  const [search,       setSearch]       = useState("");
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");

  // Reset au changement d'ouverture
  useEffect(() => {
    if (open) {
      setLabel(""); setDescription(""); setSearch(""); setSelectedIds(new Set()); setError("");
    }
  }, [open]);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.roles.some((r) => r.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!label.trim()) { setError("Le nom du groupe est requis."); return; }
    if (selectedIds.size === 0) { setError(t.chat.groupMembersRequired); return; }
    setIsSubmitting(true);
    await onCreateGroup({
      label:       label.trim(),
      description: description.trim() || undefined,
      member_ids:  Array.from(selectedIds),
    });
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <UsersRound className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            {t.chat.createGroupTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Nom du groupe */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {t.chat.groupName} <span className="text-red-500">*</span>
            </label>
            <Input
              value={label}
              onChange={(e) => { setLabel(e.target.value); setError(""); }}
              placeholder={t.chat.groupNamePlaceholder}
              className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {t.chat.groupDescription}
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.chat.groupDescriptionPlaceholder}
              className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            />
          </div>

          {/* Membres */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {t.chat.groupMembers} {selectedIds.size > 0 && (
                <span className="text-babana-cyan ml-1">({selectedIds.size})</span>
              )}
            </label>

            {/* Membres sélectionnés */}
            {selectedIds.size > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {Array.from(selectedIds).map((id) => {
                  const contact = contacts.find((c) => c.id === id);
                  if (!contact) return null;
                  return (
                    <span key={id} className="flex items-center gap-1 text-xs bg-babana-cyan/10 text-babana-cyan px-2 py-1 rounded-full font-medium">
                      {contact.name.split(" ")[0]}
                      <button onClick={() => toggleMember(id)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.chat.groupMembersPlaceholder}
                className="pl-8 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm"
              />
            </div>

            {/* Liste des contacts */}
            <ScrollArea className="h-36 border border-zinc-100 dark:border-zinc-800 rounded-lg">
              <div className="p-1 space-y-0.5">
                {filtered.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4">{t.chat.noContactsFound}</p>
                ) : (
                  filtered.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => toggleMember(contact.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left text-sm",
                        selectedIds.has(contact.id)
                          ? "bg-babana-cyan/10 text-babana-cyan"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      )}
                    >
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-700">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-xs">{contact.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{contact.roles[0] ?? ""}</p>
                      </div>
                      {selectedIds.has(contact.id) && (
                        <Check className="h-3.5 w-3.5 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t.actions.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !label.trim() || selectedIds.size === 0}
            className="bg-babana-cyan hover:bg-babana-cyan/90 text-white"
          >
            {isSubmitting
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <UsersRound className="h-4 w-4 mr-1.5" />
            }
            {t.chat.createGroup}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const { user, token } = useLoaderData<typeof loader>();
  const { t, interpolate } = useTranslation();
  usePageTitle(t.chat.messages);

  // Rôle de l'utilisateur courant
  const isAdmin = user?.roles?.some((r) =>
    r === "admin" || r === "super_admin"
  ) ?? false;

  const chat = useChat({ userId: user?.id, userName: user?.name, token });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab,   setActiveTab]   = useState<"conversations" | "contacts">("conversations");
  const scrollRef                     = useRef<HTMLDivElement>(null);

  // Scroller vers le bas à chaque nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, chat.activeConversation]);

  // Filtres sidebar
  const filteredConversations = chat.conversations.filter((c) => {
    const name = c.is_group || c.is_admin_support
      ? (c.label ?? "")
      : (c.participant?.name ?? c.label ?? "");
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredContacts = chat.contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Nom/titre de la conversation active
  const activeConv = chat.activeConversation;
  const participantName =
    activeConv?.is_group || activeConv?.is_admin_support
      ? (activeConv.label ?? t.chat.conversation)
      : (activeConv?.participant?.name ?? activeConv?.label ?? t.chat.conversation);

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
              SIDEBAR
          ================================================================ */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50 h-full transition-all duration-300",
            chat.activeConversation ? "hidden md:flex" : "flex"
          )}>
            {/* Header sidebar */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.chat.messages}</h2>
                <div className="flex items-center gap-1.5">
                  <ConnectionBadge status={chat.connectionStatus} />
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    onClick={chat.refreshConversations}
                    title={t.chat.refresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2">
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5 text-xs border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={chat.openGroupModal}
                  >
                    <UsersRound className="h-3.5 w-3.5" />
                    {t.chat.newGroup}
                  </Button>
                )}
                {!isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5 text-xs border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    onClick={chat.contactAdmin}
                    disabled={chat.isContactAdminLoading}
                  >
                    {chat.isContactAdminLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <ShieldAlert className="h-3.5 w-3.5" />
                    }
                    {t.chat.contactAdmin}
                  </Button>
                )}
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
                {/* Conversations */}
                {activeTab === "conversations" && (
                  <>
                    {chat.isLoadingConversations ? (
                      <div className="flex justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="text-center py-10 space-y-3">
                        <MessageSquarePlus className="h-8 w-8 mx-auto text-zinc-300" />
                        <p className="text-sm text-zinc-500">{t.chat.noConversations}</p>
                        <p className="text-xs text-zinc-400">{t.chat.noConversationsSub}</p>
                        <div className="flex flex-col gap-2 mt-2">
                          {isAdmin && (
                            <Button
                              size="sm" variant="outline"
                              className="gap-1.5 mx-auto text-xs border-purple-200 text-purple-600"
                              onClick={chat.openGroupModal}
                            >
                              <UsersRound className="h-3 w-3" /> {t.chat.newGroup}
                            </Button>
                          )}
                          {!isAdmin && (
                            <Button
                              size="sm" variant="outline"
                              className="gap-1.5 mx-auto text-xs border-orange-200 text-orange-600"
                              onClick={chat.contactAdmin}
                            >
                              <ShieldAlert className="h-3 w-3" /> {t.chat.contactAdmin}
                            </Button>
                          )}
                        </div>
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

                {/* Contacts */}
                {activeTab === "contacts" && (
                  <>
                    {/* Actions rapides dans l'onglet contacts */}
                    <div className="mb-3 space-y-1.5">
                      {isAdmin && (
                        <button
                          onClick={chat.openGroupModal}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left"
                        >
                          <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                            <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">{t.chat.createGroup}</p>
                            <p className="text-xs text-zinc-400">Réunissez plusieurs personnes</p>
                          </div>
                        </button>
                      )}

                      {!isAdmin && (
                        <button
                          onClick={chat.contactAdmin}
                          disabled={chat.isContactAdminLoading}
                          className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-left"
                        >
                          <div className="h-9 w-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                            {chat.isContactAdminLoading
                              ? <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                              : <ShieldAlert className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            }
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">{t.chat.contactAdmin}</p>
                            <p className="text-xs text-zinc-400">{t.chat.contactAdminDesc}</p>
                          </div>
                        </button>
                      )}

                      <div className="pt-1 pb-0.5">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 px-2">{t.chat.contactsTab}</p>
                      </div>
                    </div>

                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-6">
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
                    variant="ghost" size="icon"
                    className="md:hidden -ml-2 text-zinc-500"
                    onClick={() => chat.selectConversation(null)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <div className="relative">
                    <Avatar className="h-9 w-9 md:h-10 md:w-10">
                      <AvatarFallback className={cn(
                        "text-sm font-bold",
                        activeConv?.is_admin_support
                          ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                          : activeConv?.is_group
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                          : "bg-babana-blue/10 text-babana-blue"
                      )}>
                        {activeConv?.is_admin_support
                          ? <ShieldAlert className="h-5 w-5" />
                          : activeConv?.is_group
                          ? <UsersRound className="h-5 w-5" />
                          : getInitials(participantName)
                        }
                      </AvatarFallback>
                    </Avatar>
                    {!activeConv?.is_group && !activeConv?.is_admin_support && activeConv?.participant?.is_online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm md:text-base leading-tight">
                        {participantName}
                      </h3>
                      <ConvTypeBadge conversation={activeConv!} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {activeConv?.is_group && (
                        <span className="flex items-center gap-1 text-xs text-zinc-400">
                          <UserPlus className="h-3 w-3" />
                          {interpolate(t.chat.membersCount, { n: activeConv.participants.length })}
                        </span>
                      )}
                      {activeConv?.is_admin_support && (
                        <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {t.chat.adminChatTitle}
                        </span>
                      )}
                      {!activeConv?.is_group && !activeConv?.is_admin_support && (
                        activeConv?.participant?.is_online ? (
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
                        )
                      )}
                      {chat.connectionStatus === "connected" && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-800">|</span>
                          <span className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                            {t.chat.realTime}
                          </span>
                        </>
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
                    {activeConv?.is_group && (
                      <>
                        <DropdownMenuItem onClick={() => toast.info("Fonctionnalité à venir")}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>{t.chat.addMembers}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toast.info("Fonctionnalité à venir")}
                          className="text-red-500 focus:text-red-500"
                        >
                          <X className="mr-2 h-4 w-4" />
                          <span>{t.chat.leaveGroup}</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    {!activeConv?.is_group && !activeConv?.is_admin_support && (
                      <DropdownMenuItem onClick={() => toast.info("Fonctionnalité à venir")}>
                        <Search className="mr-2 h-4 w-4" />
                        <span>Rechercher dans la conversation</span>
                      </DropdownMenuItem>
                    )}
                    {activeConv?.is_admin_support && (
                      <DropdownMenuItem disabled>
                        <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">{t.chat.adminChatDesc}</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Bandeau info pour le support admin */}
              {activeConv?.is_admin_support && (
                <div className="bg-orange-50 dark:bg-orange-900/10 border-b border-orange-100 dark:border-orange-900/30 px-5 py-2.5 flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4 text-orange-500 shrink-0" />
                  <p className="text-xs text-orange-700 dark:text-orange-300">{t.chat.adminChatDesc}</p>
                </div>
              )}

              {/* Bandeau membres pour les groupes */}
              {activeConv?.is_group && activeConv.participants.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30 px-5 py-2 flex items-center gap-2 overflow-x-auto">
                  <UsersRound className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                  <div className="flex items-center gap-1.5">
                    {activeConv.participants.slice(0, 8).map((p: ChatUser) => (
                      <span key={p.id} className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        {(p.name ?? "").split(" ")[0]}
                        {p.is_online && <span className="ml-1 text-green-500">●</span>}
                      </span>
                    ))}
                    {activeConv.participants.length > 8 && (
                      <span className="text-[10px] text-purple-500">+{activeConv.participants.length - 8}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
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
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "300ms" }} />
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
                    type="button" size="icon" variant="ghost"
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
                    placeholder={chat.activeConversation?.is_admin_support
                      ? t.chat.adminChatDesc.split(".")[0] + "..."
                      : t.chat.inputPlaceholder
                    }
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 min-h-[44px] py-3 text-base"
                    autoComplete="off"
                    disabled={chat.isSending}
                  />

                  <Button
                    type="button" size="icon" variant="ghost"
                    className="h-10 w-10 rounded-full text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10 shrink-0 hidden sm:flex"
                    onClick={() => toast.info(t.chat.emojis)}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>

                  <Button
                    type="button" size="icon"
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
            /* Empty state */
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/30 text-center">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xs mb-6 animate-in zoom-in-50 duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-babana-cyan/20 to-babana-blue/20 rounded-2xl flex items-center justify-center">
                  <MessageSquarePlus className="w-10 h-10 text-babana-cyan" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 mb-2">
                {t.chat.emptyStateTitle}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
                {t.chat.emptyStateDesc}
              </p>

              {/* Actions rapides sur l'empty state */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                {isAdmin && (
                  <Button
                    variant="outline"
                    className="gap-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={chat.openGroupModal}
                  >
                    <UsersRound className="h-4 w-4" />
                    {t.chat.createGroup}
                  </Button>
                )}
                {!isAdmin && (
                  <Button
                    variant="outline"
                    className="gap-2 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    onClick={chat.contactAdmin}
                    disabled={chat.isContactAdminLoading}
                  >
                    {chat.isContactAdminLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <ShieldAlert className="h-4 w-4" />
                    }
                    {t.chat.contactAdmin}
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <ConnectionBadge status={chat.connectionStatus} />
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modal de création de groupe */}
      <CreateGroupModal
        open={chat.isGroupModalOpen}
        onClose={chat.closeGroupModal}
        contacts={chat.contacts}
        onCreateGroup={chat.createGroup}
      />
    </Layout>
  );
}
