import { useState, useEffect, useRef } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/route";
import { getCurrentUser } from "~/services/api.server";
import { useAuth, useTranslation, usePageTitle } from "~/hooks";
import { Layout } from "~/components/Layout";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  User,
  Trash2
} from "lucide-react";
import { cn } from "~/lib/utils";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// --- Types ---

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  status: "sent" | "delivered" | "read";
  is_mine: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  is_online: boolean;
  last_seen?: string;
  unread_count: number;
  last_message?: {
    content: string;
    created_at: string;
  };
}

// --- Types Fix ---
declare global {
  interface Window {
    Pusher: any;
  }
}

// --- Mock Data ---

const MOCK_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "Support Admin",
    role: "Super Admin",
    is_online: true,
    unread_count: 2,
    last_message: {
      content: "Bonjour, comment puis-je vous aider ?",
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  },
  {
    id: "2",
    name: "Jean Activateur",
    role: "Activateur",
    is_online: false,
    last_seen: "Il y a 2h",
    unread_count: 0,
    last_message: {
      content: "Le client a validé son compte.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  },
  {
    id: "3",
    name: "Marie Gestion",
    role: "Admin",
    is_online: true,
    unread_count: 0,
    last_message: {
      content: "Merci pour votre rapport.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender_id: "1",
      content: "Bonjour, comment puis-je vous aider ?",
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: "read",
      is_mine: false,
    },
  ],
  "2": [
    {
      id: "2",
      sender_id: "999", // User
      content: "J'ai activé le client #12345",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      status: "read",
      is_mine: true,
    },
    {
      id: "3",
      sender_id: "2",
      content: "Le client a validé son compte.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "delivered",
      is_mine: false,
    },
  ],
};

// --- Loader ---

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return { user };
}

// --- Component ---

export default function MessagesPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  usePageTitle("Messages");
  
  // State
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter contacts
  const filteredContacts = MOCK_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load messages when active contact changes
  useEffect(() => {
    if (activeContact) {
      setMessages(MOCK_MESSAGES[activeContact.id] || []);
    }
  }, [activeContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeContact]);

  // Echo Setup
  useEffect(() => {
    // Basic check for required env vars to avoid crashing if not set
    const appKey = import.meta.env.VITE_PUSHER_APP_KEY;
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

    if (!appKey || !cluster) {
      console.warn("Laravel Echo: Missing VITE_PUSHER_APP_KEY or VITE_PUSHER_APP_CLUSTER. Real-time features disabled.");
      return;
    }

    // Configure Pusher
    window.Pusher = Pusher;
    
    const echo = new Echo({
      broadcaster: 'pusher',
      key: appKey,
      cluster: cluster,
      wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${cluster}.pusher.com`,
      wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
      wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
      forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
    });

    if (user?.id) {
      // Listen to private channel for new messages
      // Channel naming convention: chat.{userId} is a common pattern, adjust if backend differs
      echo.private(`chat.${user.id}`)
        .listen('.MessageSent', (e: any) => { // often Laravel events are namespaced, or use dot prefix
          console.log('Message received via broadcast:', e);
          
          // Here we would typically transform the event data to match our Message interface
          // and add it to the state.
          // For now, we'll just log it as the backend event structure is unknown.
          
          /* Example implementation:
          const incomingMessage: Message = {
            id: e.message.id,
            sender_id: e.message.sender_id,
            content: e.message.content,
            created_at: new Date().toISOString(),
            status: "delivered",
            is_mine: false
          };
          setMessages(prev => [...prev, incomingMessage]);
          */
        });
    }

    return () => {
      echo.disconnect();
    };
  }, [user]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || "",
      content: inputText,
      created_at: new Date().toISOString(),
      status: "sent",
      is_mine: true,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    
    // Simulate API call here
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-[1600px] mx-auto p-0 md:p-6 lg:px-8">
        <Card className="h-full border-0 md:border md:shadow-sm overflow-hidden bg-white dark:bg-zinc-950 flex flex-col md:flex-row">
          
          {/* Sidebar */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50 h-full transition-all duration-300 ease-in-out",
             activeContact ? "hidden md:flex" : "flex"
          )}>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold mb-4 px-2">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-sm">
                    Aucun contact trouvé
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => setActiveContact(contact)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl transition-all",
                        activeContact?.id === contact.id
                          ? "bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-zinc-200 dark:border-zinc-700">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className={cn(
                             "text-sm font-bold",
                             activeContact?.id === contact.id 
                              ? "bg-babana-cyan text-white" 
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                          )}>
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        {contact.is_online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className={cn(
                            "font-semibold truncate text-sm md:text-base",
                            activeContact?.id === contact.id ? "text-babana-blue" : "text-zinc-900 dark:text-zinc-100"
                          )}>
                            {contact.name}
                          </span>
                          {contact.last_message && (
                            <span className="text-[10px] md:text-xs text-zinc-400 whitespace-nowrap ml-2">
                              {formatTime(contact.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 truncate pr-2">
                            {contact.last_message?.content || <span className="italic opacity-50">Aucun message</span>}
                          </p>
                          {contact.unread_count > 0 && (
                            <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center bg-babana-cyan hover:bg-babana-cyan text-[10px]">
                              {contact.unread_count}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Main Chat Area */}
          {activeContact ? (
            <div className={cn(
              "flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 relative",
              "flex" // Always flex, but controlled by parent container's conditional rendering on mobile
            )}>
              {/* Header */}
              <div className="h-16 md:h-20 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden -ml-2 text-zinc-500"
                    onClick={() => setActiveContact(null)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <div className="relative">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={activeContact.avatar} />
                      <AvatarFallback className="bg-babana-blue/10 text-babana-blue text-sm font-bold">
                        {getInitials(activeContact.name)}
                      </AvatarFallback>
                    </Avatar>
                    {activeContact.is_online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm md:text-base">
                      {activeContact.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-babana-cyan font-medium hidden md:inline-block px-1.5 py-0.5 bg-babana-cyan/10 rounded-full">
                        {activeContact.role}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {activeContact.is_online ? "En ligne" : activeContact.last_seen || "Hors ligne"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-950">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toast.info("Fonctionnalité à venir : Recherche")} className="md:hidden">
                        <Search className="mr-2 h-4 w-4" />
                        <span>Rechercher dans la conversation</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toast.error("Action irréversible : Supprimer")} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Supprimer la conversation</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages List */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-zinc-50/30 dark:bg-zinc-900/10 scroll-smooth"
              >
                {/* Date separator example */}
                <div className="flex justify-center my-4">
                  <span className="text-[10px] uppercase font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    Aujourd'hui
                  </span>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-full max-w-[85%] md:max-w-[70%] lg:max-w-[60%]",
                      message.is_mine ? "ml-auto justify-end" : "mr-auto justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex flex-col gap-1",
                      message.is_mine ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "px-4 py-2.5 md:py-3 md:px-5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed wrap-break-word relative group",
                        message.is_mine 
                          ? "bg-linear-to-br from-babana-blue to-babana-cyan text-white rounded-tr-none" 
                          : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-700"
                      )}>
                        {message.content}
                      </div>
                      
                      <div className="flex items-center gap-1.5 px-1">
                         <span className="text-[10px] text-zinc-400">
                          {formatTime(message.created_at)}
                        </span>
                        {message.is_mine && (
                          <span className={cn(
                            "flex items-center",
                            message.status === "read" ? "text-babana-cyan" : "text-zinc-300"
                          )}>
                            {message.status === "sent" && <Check className="h-3 w-3" />}
                            {message.status === "delivered" && <CheckCheck className="h-3 w-3" />}
                            {message.status === "read" && <CheckCheck className="h-3 w-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-900 p-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-babana-cyan/20 focus-within:border-babana-cyan transition-all shadow-xs"
                >
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full text-zinc-400 hover:text-babana-cyan hover:bg-babana-cyan/10 shrink-0"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 min-h-[44px] py-3 text-base"
                    autoComplete="off"
                  />
                  
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10 shrink-0 hidden sm:flex"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>

                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!inputText.trim()}
                    className={cn(
                      "h-10 w-10 rounded-full shrink-0 transition-all duration-200",
                      inputText.trim() 
                        ? "bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-md shadow-babana-cyan/20" 
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    )}
                  >
                    <Send className="h-5 w-5 ml-0.5" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/30 text-center">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-xs mb-6 animate-in zoom-in-50 duration-500">
                <div className="w-20 h-20 bg-linear-to-br from-babana-cyan/20 to-babana-blue/20 rounded-2xl flex items-center justify-center mb-0">
                  <Send className="w-10 h-10 text-babana-cyan" />
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 mb-2">
                Vos messages
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Sélectionnez une conversation pour commencer à discuter avec les administrateurs et les activateurs.
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
