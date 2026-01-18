import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "~/components";
import { MessageSquare, User as UserIcon } from "lucide-react";
import type { SupportTicket } from "~/lib/services/support.service";

interface TicketMessagesProps {
  messages: SupportTicket["messages"];
}

export function TicketMessages({ messages }: TicketMessagesProps) {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
            <MessageSquare className="h-5 w-5" />
          </div>
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className="border-2 border-border/50 rounded-xl p-5 space-y-3 bg-card/50 backdrop-blur-sm hover:border-babana-cyan/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-babana-cyan/10">
                  <UserIcon className="h-4 w-4 text-babana-cyan" />
                </div>
                <span className="font-semibold">
                  {message.user?.name || "Support"}
                </span>
                {!message.is_public && (
                  <Badge variant="outline" className="text-xs border-babana-cyan/30">
                    Interne
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {new Date(message.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="pl-11">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

