import { useEffect, useState, useRef } from 'react';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Loader2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';
import type { ActivationRequest } from '~/types';
import { useTranslation } from '~/hooks';

interface CancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ActivationRequest;
  /**
   * Optionnel: URL d'action à cibler.
   * Utile quand le dialog est rendu sur une route qui n'a pas d'action (ex: page détail).
   */
  action?: string;
}

export function CancelDialog({ open, onOpenChange, request, action }: CancelDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const lastProcessedData = useRef<any>(null);
  
  const [cancelReason, setCancelReason] = useState('');
  const isSubmitting = fetcher.state === 'submitting';

  // Toasts + fermeture après réponse backend
  useEffect(() => {
    const data = fetcher.data as any;
    if (!data || data === lastProcessedData.current) return;

    lastProcessedData.current = data;

    if (data.success) {
      toast.success(t.activationRequests.toast?.cancelSuccess || 'Requête annulée avec succès');
      onOpenChange(false);
      setCancelReason('');
    } else if (data.error) {
      toast.error(data.error || t.activationRequests.toast?.cancelError || 'Impossible d\'annuler la requête');
    } else if (data.success === false) {
      toast.error(t.activationRequests.toast?.cancelError || 'Impossible d\'annuler la requête');
    }
  }, [fetcher.data, onOpenChange, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_action', 'cancel');
    formData.append('requestId', request.id.toString());
    if (cancelReason.trim()) {
      formData.append('cancelReason', cancelReason.trim());
    }

    fetcher.submit(formData, {
      method: 'post',
      action: action || '/sales/activation-requests',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
        {/* Header spectaculaire avec gradient rouge/orange */}
        <div className="relative bg-linear-to-br from-red-600 via-orange-600 to-pink-600 p-8 pb-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative flex items-start gap-4">
            <div className="shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-full animate-pulse"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                  <XCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 pt-2">
              <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
                {t.activationRequests.cancel?.title || 'Annuler la requête'}
              </DialogTitle>
              <DialogDescription className="text-orange-100 text-lg font-medium">
                Requête #{request.id} • {request.customer?.full_name || 'Client'}
              </DialogDescription>
            </div>

            <AlertTriangle className="h-6 w-6 text-yellow-300 animate-bounce" />
          </div>
        </div>

        {/* Contenu du formulaire */}
        <fetcher.Form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900">
          <div className="p-8 space-y-6">
            {/* Avertissement spectaculaire */}
            <div className="relative overflow-hidden bg-linear-to-br from-red-50 via-orange-50 to-pink-50 dark:from-red-950/30 dark:via-orange-950/30 dark:to-pink-950/30 border-2 border-red-300 dark:border-red-700 rounded-2xl p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/20 dark:bg-red-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="relative flex gap-4">
                <div className="shrink-0">
                  <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div>
                  <p className="font-black text-red-900 dark:text-red-200 text-lg mb-2">
                    ⚠️ {t.activationRequests.cancel?.warning || 'Attention - Action Irréversible'}
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                    {t.activationRequests.cancel?.warningMessage || 'Cette requête sera définitivement annulée et ne pourra plus être traitée. Cette action ne peut pas être annulée.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations de la requête - Design moderne */}
            <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {t.activationRequests.details?.customerInfo || 'Client'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{request.customer?.full_name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {t.activationRequests.table?.simNumber || 'Numéro SIM'}
                    </span>
                  </div>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{request.sim_number}</p>
                </div>
              </div>
            </div>

            {/* Raison de l'annulation - Design moderne */}
            <div className="space-y-3">
              <Label htmlFor="cancelReason" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                {t.activationRequests.cancel?.reason || 'Raison de l\'annulation'} 
                <span className="text-slate-400 text-xs normal-case">({t.common?.optional || 'optionnel'})</span>
              </Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={t.activationRequests.cancel?.reasonPlaceholder || 'Expliquez pourquoi vous annulez cette requête...'}
                rows={4}
                disabled={isSubmitting}
                className="text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          {/* Footer avec design moderne */}
          <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-12 px-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
            >
              {t.common?.cancel || 'Annuler'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 bg-linear-to-r from-red-600 via-orange-600 to-pink-600 hover:from-red-700 hover:via-orange-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Annulation
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {t.activationRequests.cancel?.confirm || 'Confirmer l\'annulation'}
                </span>
              )}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
