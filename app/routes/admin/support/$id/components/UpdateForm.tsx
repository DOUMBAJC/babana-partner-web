import { useState, useEffect } from "react";
import { useSubmit } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "~/components";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { ActionData } from "../types";
import type { SupportTicket } from "~/lib/services/support.service";

interface UpdateFormProps {
  ticket: SupportTicket;
  actionData?: ActionData;
  onSuccess?: () => void;
}

export function UpdateForm({ ticket, actionData, onSuccess }: UpdateFormProps) {
  const submit = useSubmit();
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [updateErrors, setUpdateErrors] = useState<{ status?: string; priority?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setPriority(ticket.priority);
    }
  }, [ticket]);

  useEffect(() => {
    if (actionData) {
      setIsSubmitting(false);
      
      if (actionData.success && actionData.intent === "update") {
        toast.success(actionData.message || "Opération réussie");
        setUpdateErrors({});
        onSuccess?.();
      } else if (!actionData.success && actionData.intent === "update") {
        if (actionData.errors) {
          setUpdateErrors(actionData.errors);
        }
        if (actionData.error) {
          toast.error(actionData.error);
        }
      }
    }
  }, [actionData, onSuccess]);

  const handleUpdate = () => {
    // Validation côté client
    const errors: { status?: string; priority?: string } = {};
    
    if (!status) {
      errors.status = "Le statut est requis";
    }
    
    if (!priority) {
      errors.priority = "La priorité est requise";
    }
    
    if (Object.keys(errors).length > 0) {
      setUpdateErrors(errors);
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }
    
    setUpdateErrors({});
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("intent", "update");
    formData.append("status", status);
    formData.append("priority", priority);
    submit(formData, { method: "POST" });
  };

  const hasError = actionData && !actionData.success && actionData.intent === "update";
  const errorMessage = hasError ? actionData.error : null;
  const fieldErrors = actionData?.errors || {};

  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          Actions
        </CardTitle>
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
          <Label htmlFor="status" className="text-sm font-semibold">
            Statut
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={status} 
            onValueChange={(value) => {
              setStatus(value as typeof status);
              if (updateErrors.status) {
                setUpdateErrors({ ...updateErrors, status: undefined });
              }
            }}
          >
            <SelectTrigger 
              id="status"
              className={`border-2 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 hover:border-babana-cyan/50 ${
                updateErrors.status || fieldErrors.status
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-input/50 focus:border-babana-cyan focus:ring-babana-cyan/20"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-xl border-2 border-border/80">
              <SelectItem value="open">Ouvert</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="resolved">Résolu</SelectItem>
              <SelectItem value="closed">Fermé</SelectItem>
            </SelectContent>
          </Select>
          {(updateErrors.status || fieldErrors.status) && (
            <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">{updateErrors.status || fieldErrors.status}</p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-semibold">
            Priorité
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select 
            value={priority} 
            onValueChange={(value) => {
              setPriority(value as typeof priority);
              if (updateErrors.priority) {
                setUpdateErrors({ ...updateErrors, priority: undefined });
              }
            }}
          >
            <SelectTrigger 
              id="priority"
              className={`border-2 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 hover:border-babana-cyan/50 ${
                updateErrors.priority || fieldErrors.priority
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-input/50 focus:border-babana-cyan focus:ring-babana-cyan/20"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-xl border-2 border-border/80">
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="normal">Normale</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
          {(updateErrors.priority || fieldErrors.priority) && (
            <div className="flex items-start gap-2 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-sm">{updateErrors.priority || fieldErrors.priority}</p>
            </div>
          )}
        </div>
        <Button 
          onClick={handleUpdate}
          disabled={isSubmitting}
          className="w-full bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-size-[200%_auto] hover:opacity-90 text-white shadow-lg hover:shadow-2xl hover:shadow-babana-cyan/50 transition-all duration-500 h-12 text-base font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Mettre à jour
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

