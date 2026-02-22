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

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IdentificationRequest;
}

export function ApproveDialog({ open, onOpenChange, request }: ApproveDialogProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const [adminNotes, setAdminNotes] = useState("");

  const handleApprove = () => {
    fetcher.submit(
      { actionType: 'approve', requestId: request.id, adminNotes },
      { method: 'post' }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.identifications.actions.approve}</DialogTitle>
          <DialogDescription>
            Confirmez-vous la validité des documents pour {request.customer?.full_name} ?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">Notes administratives (optionnel)</label>
          <Textarea 
            value={adminNotes} 
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Notes internes..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">Approuver</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
