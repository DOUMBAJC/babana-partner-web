import { useState } from 'react';
import { Form, useSubmit, useNavigation } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Loader2, Clock } from 'lucide-react';
import type { ActivationRequest } from '~/types';
import { useTranslation } from '~/hooks';

interface ProcessingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ActivationRequest;
  action: string;
}

export function ProcessingDialog({ open, onOpenChange, request, action }: ProcessingDialogProps) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const [notes, setNotes] = useState('');
  const isSubmitting = navigation.state === 'submitting';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('actionType', 'process');
    formData.append('requestId', request.id);
    if (notes.trim()) {
      formData.append('adminNotes', notes.trim());
    }

    submit(formData, { method: 'post', action });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Marquer en cours de traitement
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Requête #{request.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>ℹ️ Information :</strong> Cette requête sera marquée comme étant en cours de traitement par vous.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Client :</strong> {request.customer?.full_name}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>SIM :</strong> {request.sim_number}
              </p>
            </div>

            <Form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Notes (optionnel)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur le traitement..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Marquer en traitement
                </Button>
              </DialogFooter>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

