import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Separator,
} from "~/components";
import { FileText, MessageSquare, Calendar, Clock } from "lucide-react";
import { PriorityBadge, StatusBadge } from "../../components";
import type { SupportTicket } from "~/lib/services/support.service";

interface TicketDetailsProps {
  ticket: SupportTicket;
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
            <FileText className="h-5 w-5" />
          </div>
          Détails du ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-babana-cyan" />
            Sujet
          </Label>
          <p className="font-medium text-lg">{ticket.subject}</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-babana-cyan" />
            Message
          </Label>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{ticket.message}</p>
          </div>
        </div>
        <Separator className="bg-border/50" />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <Label className="text-sm font-semibold text-muted-foreground">Priorité</Label>
            <div className="mt-2">
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <Label className="text-sm font-semibold text-muted-foreground">Statut</Label>
            <div className="mt-2">
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-babana-cyan" />
              Créé le
            </Label>
            <p className="text-sm mt-2 font-medium">
              {new Date(ticket.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-babana-cyan" />
              Modifié le
            </Label>
            <p className="text-sm mt-2 font-medium">
              {new Date(ticket.updated_at).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

