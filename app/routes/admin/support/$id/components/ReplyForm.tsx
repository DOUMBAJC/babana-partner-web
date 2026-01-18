import { useState, useEffect } from "react";
import { useSubmit } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
  Button,
  Toaster,
} from "~/components";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { ImageUpload } from "~/components/forms/ImageUpload";
import { toast } from "sonner";
import { useTranslation } from "~/hooks";
import type { ActionData } from "../types";

interface ReplyFormProps {
  actionData?: ActionData;
  onSuccess?: () => void;
}

export function ReplyForm({ actionData, onSuccess }: ReplyFormProps) {
  const { language } = useTranslation();
  const submit = useSubmit();
  const [replyMessage, setReplyMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isInternal, setIsInternal] = useState(false);
  const [replyAttachment, setReplyAttachment] = useState<File | null>(null);
  const [replyErrors, setReplyErrors] = useState<{ message?: string; attachment?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (actionData) {
      setIsSubmitting(false);
      
      if (actionData.success && actionData.intent === "reply") {
        toast.success(actionData.message || "Opération réussie");
        setReplyMessage("");
        setReplyErrors({});
        setReplyAttachment(null);
        onSuccess?.();
      } else if (!actionData.success && actionData.intent === "reply") {
        if (actionData.errors) {
          setReplyErrors(actionData.errors);
        }
        if (actionData.error) {
          toast.error(actionData.error);
        }
      }
    }
  }, [actionData, onSuccess]);

  const handleReply = () => {
    // Validation côté client
    const errors: { message?: string; attachment?: string } = {};
    const trimmedMessage = replyMessage.trim();
    
    if (!trimmedMessage) {
      errors.message = "Le message est requis";
    } else if (trimmedMessage.length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères";
    } else if (trimmedMessage.length > 2000) {
      errors.message = "Le message ne peut pas dépasser 2000 caractères";
    }

    // Validation du fichier (optionnel)
    if (replyAttachment) {
      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!allowedTypes.includes(replyAttachment.type)) {
        errors.attachment = `Type de fichier non supporté: ${replyAttachment.name}. Types acceptés: JPEG, JPG, PNG, GIF, WEBP`;
      } else if (replyAttachment.size > maxSizeBytes) {
        errors.attachment = `Le fichier ${replyAttachment.name} est trop volumineux. Taille maximale: 2MB`;
      }
    }
    
    if (Object.keys(errors).length > 0) {
      setReplyErrors(errors);
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }
    
    setReplyErrors({});
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("intent", "reply");
    formData.append("message", trimmedMessage);
    formData.append("is_public", isPublic ? "true" : "false");
    formData.append("is_internal", isInternal ? "true" : "false");
    
    // Ajouter le fichier d'attachement s'il existe
    if (replyAttachment) {
      formData.append('attachment', replyAttachment, replyAttachment.name);
    }
    
    submit(formData, { method: "POST", encType: 'multipart/form-data' });
  };

  const hasError = actionData && !actionData.success && actionData.intent === "reply";
  const errorMessage = hasError ? actionData.error : null;
  const fieldErrors = actionData?.errors || {};

  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
            <Send className="h-5 w-5" />
          </div>
          Répondre au ticket
        </CardTitle>
        <CardDescription>Envoyez une réponse au client</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message d'erreur général */}
        {errorMessage && (
          <div className="bg-red-500/10 border-2 border-red-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-400 font-medium text-sm">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="reply-message" className="text-sm font-semibold">
            Message
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-0 rounded-md bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 opacity-0 blur-xl transition-opacity duration-300" />
            <Textarea
              id="reply-message"
              value={replyMessage}
              onChange={(e) => {
                setReplyMessage(e.target.value);
                if (replyErrors.message) {
                  setReplyErrors({});
                }
              }}
              placeholder="Votre réponse..."
              rows={6}
              className={`relative border-2 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:bg-background hover:border-babana-cyan/50 resize-none ${
                replyErrors.message || fieldErrors.message
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-input/50 focus:border-babana-cyan focus:ring-babana-cyan/20"
              }`}
            />
          </div>
          {(replyErrors.message || fieldErrors.message) && (
            <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">{replyErrors.message || fieldErrors.message}</p>
            </div>
          )}
          {!replyErrors.message && !fieldErrors.message && (
            <p className="text-xs text-muted-foreground">
              {replyMessage.length} / 2000 caractères (minimum 10 requis)
            </p>
          )}
        </div>

        {/* Upload d'image */}
        <ImageUpload
          name="reply_attachment"
          label={language === 'fr' ? 'Pièce jointe (optionnel)' : 'Attachment (optional)'}
          onChange={setReplyAttachment}
          error={replyErrors.attachment || fieldErrors.attachment}
          helperText={language === 'fr' ? 'JPEG, PNG, GIF, WEBP (max. 2MB)' : 'JPEG, PNG, GIF, WEBP (max. 2MB)'}
          texts={{
            change: language === 'fr' ? "Changer l'image" : "Change image",
            dragDrop: language === 'fr' ? "Cliquez ou glissez une image" : "Click or drag an image",
            fileType: "JPEG, PNG, GIF, WEBP (max. 2MB)"
          }}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
            <input
              type="checkbox"
              id="is-public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-2 border-babana-cyan/30 focus:ring-2 focus:ring-babana-cyan/20"
            />
            <Label htmlFor="is-public" className="cursor-pointer text-sm font-medium">
              Message visible par le client
            </Label>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
            <input
              type="checkbox"
              id="is-internal"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-2 border-babana-cyan/30 focus:ring-2 focus:ring-babana-cyan/20"
            />
            <Label htmlFor="is-internal" className="cursor-pointer text-sm font-medium">
              Message interne uniquement
            </Label>
          </div>
        </div>
        <Button 
          onClick={handleReply}
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-size-[200%_auto] hover:opacity-90 text-white shadow-lg hover:shadow-2xl hover:shadow-babana-cyan/50 transition-all duration-500 h-12 text-base font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                Envoyer la réponse
              </>
            )}
          </span>
          {!isSubmitting && (
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

