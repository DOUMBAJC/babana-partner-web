import { useState } from "react";
import { useNavigate, useSearchParams, useFetcher } from "react-router";
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
import type { ActivationRequest, PaginationMeta } from "~/types";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useTranslation, useLanguage } from "~/hooks";
import { AcceptDialog } from "./AcceptDialog";
import { RejectDialog } from "./RejectDialog";

interface RequestsTableProps {
  requests: ActivationRequest[];
  pagination: PaginationMeta | null;
  userRole?: string;
}

export function RequestsTable({ requests, pagination, userRole }: RequestsTableProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();

  const [selectedRequest, setSelectedRequest] = useState<ActivationRequest | null>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // S'assurer que requests est toujours un tableau
  const safeRequests = Array.isArray(requests) ? requests : [];

  const currentPage = pagination?.currentPage || 1;
  const lastPage = pagination?.lastPage || 1;
  const total = pagination?.total || 0;
  const perPage = pagination?.perPage || 10;
  const from = pagination?.from || 0;
  const to = pagination?.to || 0;

  // Vérifier s'il y a au moins une demande avec des informations BA
  const hasBaInfo = safeRequests.some(request => request.ba?.name);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: t.activationRequests.status.pending, variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      processing: { label: t.activationRequests.status.processing, variant: "default" as const, className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      activated: { label: t.activationRequests.status.activated, variant: "default" as const, className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      rejected: { label: t.activationRequests.status.rejected, variant: "destructive" as const, className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      cancelled: { label: t.activationRequests.status.cancelled, variant: "outline" as const, className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
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
    params.set('page', '1'); // Reset à la première page
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleAccept = (request: ActivationRequest) => {
    setSelectedRequest(request);
    setShowAcceptDialog(true);
  };

  const handleReject = (request: ActivationRequest) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const canProcessRequest = (request: ActivationRequest) => {
    return (userRole === 'activateur' || userRole === 'admin' || userRole === 'super_admin') &&
           request.status === 'pending';
  };

  if (safeRequests.length === 0) {
    return (
      <Card className="p-12 text-center shadow-sm border-border/40 bg-linear-to-b from-background to-muted/20">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-muted/50 p-6">
            <Clock className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {t.activationRequests.table.noResults}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {t.activationRequests.table.noResultsMessage}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden shadow-sm border-border/40">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-border">
                <TableHead className="font-semibold text-foreground py-4">{t.activationRequests.table.id}</TableHead>
                <TableHead className="font-semibold text-foreground">{t.activationRequests.table.customer}</TableHead>
                <TableHead className="font-semibold text-foreground">{t.activationRequests.table.simNumber}</TableHead>
                <TableHead className="font-semibold text-foreground">{t.activationRequests.table.iccid}</TableHead>
                {hasBaInfo && (
                  <TableHead className="font-semibold text-foreground">{t.activationRequests.table.ba}</TableHead>
                )}
                <TableHead className="font-semibold text-foreground">{t.activationRequests.table.status}</TableHead>
                <TableHead className="font-semibold text-foreground">{t.activationRequests.table.date}</TableHead>
                <TableHead className="font-semibold text-foreground text-right">{t.activationRequests.table.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeRequests.map((request) => (
                <TableRow 
                  key={request.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer border-b border-border/50"
                  onClick={() => navigate(`/sales/activation-requests/${request.id}`)}
                >
                  <TableCell className="font-medium text-primary py-4">
                    <span className="inline-flex items-center gap-1">
                      #{request.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {request.customer?.full_name || 'N/A'}
                      </span>
                      {request.customer?.phone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          📞 {request.customer.phone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm bg-muted/20 font-medium">
                    {request.sim_number}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {request.iccid}
                  </TableCell>
                  {hasBaInfo && (
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm">
                        {request.ba?.name || '-'}
                      </span>
                    </TableCell>
                  )}
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(request.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                          {t.activationRequests.table.actions}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/sales/activation-requests/${request.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t.activationRequests.table.viewDetails}
                        </DropdownMenuItem>
                        {canProcessRequest(request) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleAccept(request)}
                              className="text-green-600 dark:text-green-400 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t.activationRequests.table.accept}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleReject(request)}
                              className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t.activationRequests.table.reject}
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border/40 bg-muted/10">
          {/* Informations de pagination et sélecteur par page */}
          <div className="flex items-center gap-6">
            <div className="text-sm font-medium text-muted-foreground">
              {total > 0 ? (
                <>
                  Affichage <span className="text-foreground font-semibold">{from}</span>-<span className="text-foreground font-semibold">{to}</span> sur <span className="text-foreground font-semibold">{total}</span> résultat{total > 1 ? 's' : ''}
                </>
              ) : (
                <span>Aucun résultat</span>
              )}
            </div>
            {total > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Par page:</span>
                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Contrôles de navigation */}
          {lastPage > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all h-8 w-8 p-0"
                title="Première page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t.activationRequests.table.previous}
              </Button>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md border border-primary/20">
                <span className="text-sm font-semibold text-primary">
                  {currentPage}
                </span>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {lastPage}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all"
              >
                {t.activationRequests.table.next}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(lastPage)}
                disabled={currentPage === lastPage}
                className="hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all h-8 w-8 p-0"
                title="Dernière page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Dialogues */}
      {selectedRequest && (
        <>
          <AcceptDialog
            open={showAcceptDialog}
            onOpenChange={setShowAcceptDialog}
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

