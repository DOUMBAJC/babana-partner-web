import { useRef } from "react";
import { useFetcher } from "react-router";
import { useTranslation } from "~/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeletePosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posId: string;
  posName: string;
  posNumber: string;
  onSuccess?: () => void;
}

export function DeletePosModal({
  open,
  onOpenChange,
  posId,
  posName,
  posNumber,
  onSuccess,
}: DeletePosModalProps) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const isDeleting = fetcher.state !== "idle";

  const handleDelete = () => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("pos_id", posId);
    formData.append("deletion_note", noteRef.current?.value || "");
    fetcher.submit(formData, { method: "post" });
  };

  // Fermer après succès
  if (fetcher.data && (fetcher.data as any).success && open) {
    onOpenChange(false);
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
        {/* Danger header */}
        <DialogHeader className="px-6 pt-6 pb-4 bg-rose-500/5 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-rose-500/10 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </span>
            <div>
              <DialogTitle className="text-lg font-semibold text-rose-700 dark:text-rose-400">
                {t.pages.sales.pos.deleteModal.title}
              </DialogTitle>
              <DialogDescription className="text-sm mt-0.5">
                {t.pages.sales.pos.deleteModal.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* POS info */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              {posName || posNumber}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              POS #{posNumber}
            </span>
          </div>

          {/* Warning text */}
          <p className="text-sm text-muted-foreground">
            {t.pages.sales.pos.deleteModal.warning}
          </p>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="deletion_note" className="text-sm font-medium">
              {t.pages.sales.pos.deleteModal.noteLabel}
              <span className="text-muted-foreground font-normal ml-1">({t.pages.sales.pos.deleteModal.optional})</span>
            </Label>
            <Textarea
              id="deletion_note"
              ref={noteRef}
              placeholder={t.pages.sales.pos.deleteModal.notePlaceholder}
              className="resize-none h-24 bg-background/50"
              disabled={isDeleting}
            />
          </div>

          {/* Error */}
          {fetcher.data && !(fetcher.data as any).success && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {(fetcher.data as any).error || "Une erreur s'est produite."}
            </p>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/10 flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1"
          >
            {t.pages.sales.pos.deleteModal.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.pages.sales.pos.deleteModal.deleting}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t.pages.sales.pos.deleteModal.confirm}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
