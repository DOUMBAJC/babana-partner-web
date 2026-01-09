import { FileText, Sparkles, Shield, XCircle, CheckCircle, User } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { InfoCard } from "../../components/CopyButton";
import type { ActivationRequest } from "~/types";
import { useTranslation } from "~/hooks";

interface NotesInfoCardProps {
  request: ActivationRequest;
}

export function NotesInfoCard({ request }: NotesInfoCardProps) {
  const { t } = useTranslation();
  
  return (
    <InfoCard
      icon={<FileText className="h-6 w-6" />}
      title={t.activationRequests.details.notesDetails}
      gradient="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500"
    >
      {request.ba_notes && request.ba_notes.length > 0 ? (
        <>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-amber-500" />
              {t.activationRequests.details.baNotes}
            </p>
            <p className="text-sm bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 font-medium">
              {request.ba_notes}
            </p>
          </div>
          <Separator className="my-3" />
        </>
      ) : null}
      
      {request.admin_notes && request.admin_notes.length > 0 ? (
        <>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
              <Shield className="h-3 w-3 text-blue-500" />
              {t.activationRequests.details.adminNotes}
            </p>
            <p className="text-sm bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 rounded-xl border-2 border-blue-300 dark:border-blue-700 font-medium">
              {request.admin_notes}
            </p>
          </div>
          <Separator className="my-3" />
        </>
      ) : null}
      
      {request.rejection_reason && request.rejection_reason.length > 0 ? (
        <>
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
              <XCircle className="h-3 w-3" />
              {t.activationRequests.details.rejectionReason}
            </p>
            <p className="text-sm bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 p-4 rounded-xl border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 font-medium">
              {request.rejection_reason}
            </p>
          </div>
          <Separator className="my-3" />
        </>
      ) : null}
      
      {request.processor ? (
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {t.activationRequests.details.processedBy}
          </p>
          <div className="flex items-center gap-3 p-3 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">{request.processor.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{request.processor.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic text-center py-4">
          {t.activationRequests.details.noNotesAvailable}
        </p>
      )}
    </InfoCard>
  );
}

