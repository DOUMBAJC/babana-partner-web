import { useEffect, useState, useRef } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useTranslation } from "~/hooks";
import type { ActivationRequest } from "~/types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ActivationRequest;
  /**
   * Optionnel: URL d'action Remix à cibler.
   * Utile quand le dialog est rendu sur une route qui n'a pas d'action (ex: page détail).
   */
  action?: string;
}

export function RejectDialog({ open, onOpenChange, request, action }: RejectDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const lastProcessedData = useRef<any>(null);

  const isSubmitting = fetcher.state === "submitting";

  // Toasts + fermeture après réponse backend
  useEffect(() => {
    const data = fetcher.data as any;
    if (!data || data === lastProcessedData.current) return;

    lastProcessedData.current = data;

    if (data.success) {
      const message = data.message || t.activationRequests.toast.rejectSuccess;
      toast.success(message);
      onOpenChange(false);
      setRejectionReason("");
      setAdminNotes("");
      setError("");
      setErrors({});
    } else if (data.error || data.success === false) {
      // Afficher le message d'erreur principal dans le toast
      const errorMessage = data.error || t.activationRequests.toast.rejectError;
      toast.error(errorMessage);

      // Extraire et afficher les erreurs de validation
      if (data.errors && typeof data.errors === 'object') {
        const validationErrors: Record<string, string> = {};
        Object.keys(data.errors).forEach((field) => {
          const fieldErrors = data.errors[field];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            // Mapper les noms de champs de l'API vers les noms du formulaire
            let formField = field;
            if (field === 'rejection_reason' || field === 'rejectionReason') formField = 'rejectionReason';
            else if (field === 'admin_notes' || field === 'adminNotes') formField = 'adminNotes';
            
            validationErrors[formField] = fieldErrors[0]; // Prendre le premier message
          }
        });
        setErrors(validationErrors);
        
        // Si on a une erreur sur rejectionReason, l'afficher aussi dans error
        if (validationErrors.rejectionReason) {
          setError(validationErrors.rejectionReason);
        }
      }
    }
  }, [fetcher.data, onOpenChange, t.activationRequests.toast.rejectError, t.activationRequests.toast.rejectSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rejectionReason.trim()) {
      setError(t.activationRequests.reject.reasonRequired);
      return;
    }

    const formData = new FormData();
    formData.append('actionType', 'reject');
    formData.append('requestId', request.id.toString());
    formData.append('rejectionReason', rejectionReason);
    if (adminNotes) {
      formData.append('adminNotes', adminNotes);
    }

    fetcher.submit(formData, { method: 'post', action });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
        {/* Header spectaculaire avec gradient rouge/rose */}
        <div className="relative bg-linear-to-br from-red-600 via-rose-600 to-pink-600 p-8 pb-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative flex items-start gap-4">
            <div className="shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 pt-2">
              <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
                {t.activationRequests.reject.title}
              </DialogTitle>
              <DialogDescription className="text-rose-100 text-lg font-medium">
                {t.activationRequests.reject.request} #{request.id} • {request.customer?.full_name || 'Client'}
              </DialogDescription>
            </div>

            <AlertTriangle className="h-6 w-6 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Contenu du formulaire */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900">
          <div className="p-8 space-y-6">
            {/* Informations de la requête - Design moderne */}
            <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {t.activationRequests.table.simNumber}
                    </span>
                  </div>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{request.sim_number}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {t.activationRequests.table.iccid}
                    </span>
                  </div>
                  <p className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{request.iccid}</p>
                </div>
              </div>
            </div>

            {/* Raison du rejet - Design moderne avec erreur */}
            <div className="space-y-3">
              <Label htmlFor="rejectionReason" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                {t.activationRequests.reject.reason} 
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder={t.activationRequests.reject.reasonPlaceholder}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (error) setError("");
                  if (errors.rejectionReason) {
                    setErrors((prev) => ({ ...prev, rejectionReason: '' }));
                  }
                }}
                rows={3}
                disabled={isSubmitting}
                className={`text-base bg-slate-50 dark:bg-slate-800 border-2 rounded-xl transition-all duration-200 resize-none ${
                  error 
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                    : 'border-slate-200 dark:border-slate-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                }`}
              />
              {(error || errors.rejectionReason) && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.rejectionReason || error}
                </div>
              )}
            </div>

            {/* Notes administrateur - Design moderne */}
            <div className="space-y-3">
              <Label htmlFor="adminNotes" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
                {t.activationRequests.reject.notes}
              </Label>
              <Textarea
                id="adminNotes"
                placeholder={t.activationRequests.reject.notesPlaceholder}
                value={adminNotes}
                onChange={(e) => {
                  setAdminNotes(e.target.value);
                  if (errors.adminNotes) {
                    setErrors((prev) => ({ ...prev, adminNotes: '' }));
                  }
                }}
                rows={3}
                disabled={isSubmitting}
                className={`text-base bg-slate-50 dark:bg-slate-800 border-2 rounded-xl transition-all duration-200 resize-none ${
                  errors.adminNotes 
                    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                    : 'border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20'
                }`}
              />
              {errors.adminNotes && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.adminNotes}
                </div>
              )}
            </div>
          </div>

          {/* Footer avec design moderne */}
          <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setError("");
                setErrors({});
              }}
              disabled={isSubmitting}
              className="h-12 px-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
            >
              {t.activationRequests.reject.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 bg-linear-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:via-rose-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  {t.activationRequests.reject.processing}
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {t.activationRequests.reject.confirm}
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
