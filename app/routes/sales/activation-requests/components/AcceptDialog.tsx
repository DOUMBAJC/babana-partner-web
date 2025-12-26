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
import { CheckCircle } from "lucide-react";
import { useTranslation } from "~/hooks";
import type { ActivationRequest } from "~/types";

interface AcceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ActivationRequest;
}

export function AcceptDialog({ open, onOpenChange, request }: AcceptDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [adminNotes, setAdminNotes] = useState("");

  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('actionType', 'accept');
    formData.append('requestId', request.id.toString());
    if (adminNotes) {
      formData.append('adminNotes', adminNotes);
    }

    fetcher.submit(formData, { method: 'post' });
    onOpenChange(false);
    setAdminNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">{t.activationRequests.accept.title}</DialogTitle>
              <DialogDescription>
                {t.activationRequests.accept.request} #{request.id} - {request.customer?.full_name || 'Client'}
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

            {/* Notes administrateur */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes">{t.activationRequests.accept.notes}</Label>
              <Textarea
                id="adminNotes"
                placeholder={t.activationRequests.accept.notesPlaceholder}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {t.activationRequests.accept.notesHelp}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.activationRequests.accept.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? t.activationRequests.accept.processing : t.activationRequests.accept.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

