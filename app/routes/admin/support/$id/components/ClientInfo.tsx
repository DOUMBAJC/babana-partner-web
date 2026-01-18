import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
} from "~/components";
import { User as UserIcon, Mail } from "lucide-react";
import type { SupportTicket } from "~/lib/services/support.service";

interface ClientInfoProps {
  ticket: SupportTicket;
}

export function ClientInfo({ ticket }: ClientInfoProps) {
  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
            <UserIcon className="h-5 w-5" />
          </div>
          Informations client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
            <UserIcon className="h-4 w-4 text-babana-cyan" />
            Nom
          </Label>
          <p className="font-medium">{ticket.full_name}</p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-babana-cyan" />
            Email
          </Label>
          <a 
            href={`mailto:${ticket.email}`} 
            className="text-babana-cyan hover:underline font-medium transition-all duration-200"
          >
            {ticket.email}
          </a>
        </div>
        {ticket.user && (
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <Label className="text-sm font-semibold text-muted-foreground mb-2">
              Utilisateur connecté
            </Label>
            <p className="text-sm font-medium">{ticket.user.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

