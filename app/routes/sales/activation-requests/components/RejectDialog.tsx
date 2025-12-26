import { useState } from "react";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { XCircle } from "lucide-react";
import { useTranslation } from "~/hooks";
import type { ActivationRequest } from "~/types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ActivationRequest;
}

export function RejectDialog({ open, onOpenChange, request }: RejectDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [error, setError] = useState("");

  const isSubmitting = fetcher.state === "submitting";

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

    fetcher.submit(formData, { method: 'post' });
    onOpenChange(false);
    setRejectionReason("");
    setAdminNotes("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">{t.activationRequests.reject.title}</DialogTitle>
              <DialogDescription>
                {t.activationRequests.reject.request} #{request.id} - {request.customer?.full_name || 'Client'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Informations de la requête */}
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t.activationRequests.table.simNumber}:</span>
                  <p className="font-mono font-semibold">{request.sim_number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.activationRequests.table.iccid}:</span>
                  <p className="font-mono text-xs font-semibold">{request.iccid}</p>
                </div>
              </div>
            </div>

            {/* Raison du rejet */}
            <div className="space-y-2">
              <Label htmlFor="rejectionReason" className="text-red-600">
                {t.activationRequests.reject.reason} *
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder={t.activationRequests.reject.reasonPlaceholder}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (error) setError("");
                }}
                rows={3}
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
            </div>

            {/* Notes administrateur */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes">{t.activationRequests.reject.notes}</Label>
              <Textarea
                id="adminNotes"
                placeholder={t.activationRequests.reject.notesPlaceholder}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setError("");
              }}
              disabled={isSubmitting}
            >
              {t.activationRequests.reject.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="destructive"
            >
              {isSubmitting ? t.activationRequests.reject.processing : t.activationRequests.reject.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

