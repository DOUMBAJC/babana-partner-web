import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Eye,
  Clock,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { IdentificationRequest, PaginationMeta } from "~/types";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useTranslation, useLanguage } from "~/hooks";
import { ApproveDialog } from "./ApproveDialog";
import { RejectDialog } from "./RejectDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

interface IdentificationsTableProps {
  requests: IdentificationRequest[];
  pagination: PaginationMeta | null;
  userRole?: string;
}

export function IdentificationsTable({ requests, pagination, userRole }: IdentificationsTableProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [selectedRequest, setSelectedRequest] = useState<IdentificationRequest | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const safeRequests = Array.isArray(requests) ? requests : [];

  const currentPage = pagination?.currentPage || 1;
  const lastPage = pagination?.lastPage || 1;
  const total = pagination?.total || 0;
  const perPage = pagination?.perPage || 10;
  const from = pagination?.from || 0;
  const to = pagination?.to || 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: t.identifications.status.pending, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      approved: { label: t.identifications.status.approved, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      rejected: { label: t.identifications.status.rejected, className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      verified: { label: t.identifications.status.verified, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    try {
      const dateLocale = language === 'fr' ? fr : enUS;
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: dateLocale });
    } catch {
      return date;
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handlePerPageChange = (newPerPage: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('perPage', newPerPage);
    params.set('page', '1');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const canProcess = (request: IdentificationRequest) => {
    return request.status === 'pending' && 
           ['admin', 'super_admin', 'activateur', 'identificateur'].includes(userRole || '');
  };

  if (safeRequests.length === 0) {
    return (
      <Card className="p-12 text-center shadow-sm border-border/40">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Aucune demande trouvée</h3>
        <p className="text-muted-foreground">Les demandes d'identification apparaîtront ici.</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden shadow-sm border-border/40">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>{t.identifications.labels.submittedAt}</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>{t.identifications.labels.ba}</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="text-sm font-medium">
                    {formatDate(request.submitted_at || request.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{request.customer?.full_name}</span>
                      <span className="text-xs text-muted-foreground">{request.customer?.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{request.ba?.name}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/customers/identify?id=${request.customer_id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t.identifications.actions.viewDetails}
                        </DropdownMenuItem>
                        {canProcess(request) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => { setSelectedRequest(request); setShowApproveDialog(true); }}
                              className="text-green-600 focus:text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t.identifications.actions.approve}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => { setSelectedRequest(request); setShowRejectDialog(true); }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t.identifications.actions.reject}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination logic here similar to original */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40">
           <div className="text-sm text-muted-foreground">
             Affichage {from}-{to} sur {total}
           </div>
           {lastPage > 1 && (
             <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                 <ChevronLeft className="h-4 w-4" />
               </Button>
               <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>
                 <ChevronRight className="h-4 w-4" />
               </Button>
             </div>
           )}
        </div>
      </Card>

      {selectedRequest && (
        <>
          <ApproveDialog 
            open={showApproveDialog} 
            onOpenChange={setShowApproveDialog} 
            request={selectedRequest} 
          />
          <RejectDialog 
            open={showRejectDialog} 
            onOpenChange={setShowRejectDialog} 
            request={selectedRequest} 
          />
        </>
      )}
    </>
  );
}
