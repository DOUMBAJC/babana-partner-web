import { Button } from "~/components";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import type { SupportTicket } from "~/lib/services/support.service";

interface TicketHeaderProps {
  ticket: SupportTicket;
}

export function TicketHeader({ ticket }: TicketHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/20 via-babana-blue/20 to-babana-cyan/20 blur-3xl rounded-3xl" />
      <div className="relative bg-card/80 dark:bg-card/90 backdrop-blur-xl border-2 border-babana-cyan/20 dark:border-babana-cyan/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/admin/support")}
              className="hover:bg-babana-cyan/10 hover:text-babana-cyan transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="relative">
              <div className="absolute inset-0 bg-babana-cyan rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative p-3 bg-linear-to-br from-babana-cyan to-babana-blue rounded-2xl shadow-2xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-clip-text text-transparent">
                Ticket #{ticket.id.substring(0, 8)}
              </h1>
              <p className="text-muted-foreground mt-1">{ticket.subject}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

