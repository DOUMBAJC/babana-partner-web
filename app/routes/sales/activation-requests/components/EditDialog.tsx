import { useState, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Loader2, Edit, Sparkles, AlertTriangle } from 'lucide-react';
import type { ActivationRequest } from '~/types';
import { useTranslation } from '~/hooks';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ActivationRequest;
  /**
   * Optionnel: URL d'action à cibler.
   * Utile quand le dialog est rendu sur une route qui n'a pas d'action (ex: page détail).
   */
  action?: string;
}

export function EditDialog({ open, onOpenChange, request, action }: EditDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const lastProcessedData = useRef<any>(null);
  
  const [formData, setFormData] = useState({
    sim_number: request.sim_number,
    iccid: request.iccid,
    imei: request.imei || '',
    baNotes: request.ba_notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isSubmitting = fetcher.state === 'submitting';

  // Toasts + fermeture après réponse backend
  useEffect(() => {
    const data = fetcher.data as any;
    if (!data || data === lastProcessedData.current) return;

    lastProcessedData.current = data;

    if (data.success) {
      const message = data.message || t.activationRequests.toast?.updateSuccess || '✨ Requête modifiée avec succès !';
      toast.success(message);
      onOpenChange(false);
      setErrors({});
    } else if (data.error || data.success === false) {
      // Afficher le message d'erreur principal dans le toast
      const errorMessage = data.error || t.activationRequests.toast?.updateError || 'Impossible de modifier la requête';
      toast.error(errorMessage);

      // Extraire et afficher les erreurs de validation sur les champs
      if (data.errors && typeof data.errors === 'object') {
        const validationErrors: Record<string, string> = {};
        Object.keys(data.errors).forEach((field) => {
          const fieldErrors = data.errors[field];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            // Mapper les noms de champs de l'API vers les noms du formulaire
            let formField = field;
            if (field === 'sim_number') formField = 'sim_number';
            else if (field === 'iccid') formField = 'iccid';
            else if (field === 'imei') formField = 'imei';
            else if (field === 'ba_notes' || field === 'baNotes') formField = 'baNotes';
            
            validationErrors[formField] = fieldErrors[0]; // Prendre le premier message
          }
        });
        setErrors(validationErrors);
      }
    }
  }, [fetcher.data, onOpenChange, t]);

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation SIM Number
    if (!formData.sim_number) {
      newErrors.sim_number = t.simActivation?.errors?.simNumber || 'Le numéro SIM est requis';
    } else if (!/^62\d{7}$/.test(formData.sim_number)) {
      newErrors.sim_number = t.simActivation?.errors?.simNumberFormat || 'Format invalide (ex: 62XXXXXXX)';
    }

    // Validation ICCID
    if (!formData.iccid) {
      newErrors.iccid = t.simActivation?.errors?.iccid || 'L\'ICCID est requis';
    } else if (!/^62405010000\d{9}$/.test(formData.iccid)) {
      newErrors.iccid = t.simActivation?.errors?.iccidFormat || 'Format invalide (ex: 62405010000XXXXXXXXX)';
    }

    // Validation IMEI (optionnel mais si présent doit être valide)
    if (formData.imei && !/^\d{15}$/.test(formData.imei)) {
      newErrors.imei = t.simActivation?.errors?.imeiFormat || 'Format invalide (15 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('actionType', 'update');
    formDataToSubmit.append('requestId', request.id);
    formDataToSubmit.append('sim_number', formData.sim_number);
    formDataToSubmit.append('iccid', formData.iccid);
    if (formData.imei) {
      formDataToSubmit.append('imei', formData.imei);
    }
    if (formData.baNotes) {
      formDataToSubmit.append('baNotes', formData.baNotes);
    }

    fetcher.submit(formDataToSubmit, {
      method: 'post',
      action: action || '/sales/activation-requests',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
        {/* Header spectaculaire avec gradient animé */}
        <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 p-8 pb-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative flex items-start gap-4">
            <div className="shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                  <Edit className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 pt-2">
              <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
                {t.activationRequests.edit?.title || 'Modifier la requête'}
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-lg font-medium">
                Requête #{request.id} • {request.customer?.full_name || 'Client'}
              </DialogDescription>
            </div>

            <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
          </div>
        </div>

        {/* Contenu du formulaire */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900">
          <div className="p-8 space-y-6">
            {/* SIM Number - Design moderne */}
            <div className="group space-y-3">
              <Label htmlFor="sim_number" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                {t.simActivation?.fields?.simNumber || 'Numéro SIM'} 
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="sim_number"
                  name="sim_number"
                  value={formData.sim_number}
                  onChange={(e) => setFormData({ ...formData, sim_number: e.target.value })}
                  placeholder="Ex: 62XXXXXXX"
                  className={`h-14 text-lg font-mono bg-slate-50 dark:bg-slate-800 border-2 rounded-xl transition-all duration-200 ${
                    errors.sim_number 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.sim_number && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.sim_number}
                </div>
              )}
            </div>

            {/* ICCID - Design moderne */}
            <div className="group space-y-3">
              <Label htmlFor="iccid" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                ICCID 
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="iccid"
                  name="iccid"
                  value={formData.iccid}
                  onChange={(e) => setFormData({ ...formData, iccid: e.target.value })}
                  placeholder="Ex: 6240501000XXXXXXXXX"
                  className={`h-14 text-lg font-mono bg-slate-50 dark:bg-slate-800 border-2 rounded-xl transition-all duration-200 ${
                    errors.iccid 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.iccid && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.iccid}
                </div>
              )}
            </div>

            {/* IMEI - Design moderne */}
            <div className="group space-y-3">
              <Label htmlFor="imei" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
                IMEI 
                <span className="text-slate-400 text-xs normal-case">({t.common?.optional || 'optionnel'})</span>
              </Label>
              <div className="relative">
                <Input
                  id="imei"
                  name="imei"
                  value={formData.imei}
                  onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                  placeholder="Ex: 123456789012345 (15 chiffres)"
                  className={`h-14 text-lg font-mono bg-slate-50 dark:bg-slate-800 border-2 rounded-xl transition-all duration-200 ${
                    errors.imei 
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.imei && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.imei}
                </div>
              )}
            </div>

            {/* Notes BA - Design moderne */}
            <div className="group space-y-3">
              <Label htmlFor="baNotes" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                {t.activationRequests.details?.baNotes || 'Notes BA'}
              </Label>
              <Textarea
                id="baNotes"
                name="baNotes"
                value={formData.baNotes}
                onChange={(e) => setFormData({ ...formData, baNotes: e.target.value })}
                placeholder={t.activationRequests.accept?.notesPlaceholder || 'Notes ou commentaires additionnels...'}
                rows={4}
                disabled={isSubmitting}
                className="text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 resize-none"
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
              className="h-12 px-8 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Enregistrement
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t.activationRequests.edit?.save || 'Enregistrer les modifications'}
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
