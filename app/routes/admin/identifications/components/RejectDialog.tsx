import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useFetcher } from "react-router";
import { useTranslation } from "~/hooks";
import { useState } from "react";
import type { IdentificationRequest } from "~/types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IdentificationRequest;
}

export function RejectDialog({ open, onOpenChange, request }: RejectDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const handleReject = () => {
    fetcher.submit(
      { actionType: 'reject', requestId: request.id, reason, adminNotes },
      { method: 'post' }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.identifications.actions.reject}</DialogTitle>
          <DialogDescription>
            Veuillez indiquer le motif du rejet pour {request.customer?.full_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Raison du rejet (transmise au BA) *</label>
            <Textarea 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Document illisible, Photo floue..."
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Notes administratives (optionnel)</label>
            <Textarea 
              value={adminNotes} 
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notes internes..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleReject} 
            variant="destructive"
            disabled={!reason.trim()}
          >
            Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
