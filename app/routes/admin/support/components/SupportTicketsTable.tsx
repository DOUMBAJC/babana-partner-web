import { useNavigate } from "react-router";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components";
import { MessageSquare, Eye } from "lucide-react";
import type { SupportTicket } from "~/lib/services/support.service";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  totalTickets: number;
}

export function SupportTicketsTable({ tickets, totalTickets }: SupportTicketsTableProps) {
  const navigate = useNavigate();

  if (tickets.length === 0) {
    return (
      <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
        <CardContent>
          <div className="text-center py-16">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-babana-cyan/20 rounded-full blur-2xl" />
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground relative" />
            </div>
            <p className="text-muted-foreground text-lg">Aucun ticket trouvé</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              Tickets de Support
            </CardTitle>
            <CardDescription className="mt-2">
              {totalTickets} ticket(s) au total
            </CardDescription>
          </div>
        </div>
      </CardHeader>
              <CardContent>
                <div className="rounded-xl border-2 border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Sujet</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Priorité</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          className="hover:bg-babana-cyan/5 dark:hover:bg-babana-cyan/10 transition-colors duration-200 cursor-pointer"
                          onClick={() => navigate(`/admin/support/${ticket.id}`)}
                        >
                          <TableCell className="font-mono text-xs">
                            <span className="px-2 py-1 rounded-md bg-muted/50">
                              {ticket.id.substring(0, 8)}...
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${ticket.email}`}
                              className="text-babana-cyan hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {ticket.email}
                            </a>
                          </TableCell>
                          <TableCell>
                            <PriorityBadge priority={ticket.priority} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={ticket.status} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(ticket.created_at).toLocaleDateString("fr-FR")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/support/${ticket.id}`);
                              }}
                              className="hover:bg-babana-cyan/10 hover:text-babana-cyan transition-all duration-200"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
    </Card>
  );
}

