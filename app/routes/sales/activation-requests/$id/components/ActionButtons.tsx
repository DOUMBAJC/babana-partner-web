import { Button } from "~/components/ui/button";
import { CheckCircle, XCircle, Edit, Ban } from "lucide-react";
import type { ActivationRequest } from "~/types";
import { canProcessRequest, canEditRequest, canCancelRequest } from "../utils/permissions";
import type { User } from "../utils/permissions";

interface ActionButtonsProps {
  request: ActivationRequest;
  user: User | null;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function ActionButtons({
  request,
  user,
  onAccept,
  onReject,
  onEdit,
  onCancel,
}: ActionButtonsProps) {
  const canEdit = canEditRequest(request, user);
  const canCancel = canCancelRequest(request, user);
  const canProcess = canProcessRequest(request, user);
  
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {canProcess && (
        <>
          <Button
            onClick={onAccept}
            size="default"
            className="text-sm sm:text-base sm:size-lg bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex-1 sm:flex-initial min-w-[120px] sm:min-w-0"
          >
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 shrink-0" />
            <span className="truncate">Accepter</span>
          </Button>
          <Button
            onClick={onReject}
            size="default"
            className="text-sm sm:text-base sm:size-lg bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex-1 sm:flex-initial min-w-[120px] sm:min-w-0"
          >
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 shrink-0" />
            <span className="truncate">Rejeter</span>
          </Button>
        </>
      )}
      
      {canEdit && (
        <Button
          onClick={onEdit}
          size="default"
          variant="outline"
          className="text-sm sm:text-base sm:size-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold shadow-md hover:shadow-lg transition-all flex-1 sm:flex-initial min-w-[120px] sm:min-w-0"
        >
          <Edit className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 shrink-0" />
          <span className="truncate">Modifier</span>
        </Button>
      )}
      
      {canCancel && (
        <Button
          onClick={onCancel}
          size="default"
          className="text-sm sm:text-base sm:size-lg bg-linear-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto sm:flex-initial"
        >
          <Ban className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 shrink-0" />
          <span className="truncate">Annuler la requête</span>
        </Button>
      )}
    </div>
  );
}

