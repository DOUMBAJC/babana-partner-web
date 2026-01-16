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
  return (
    <div className="flex flex-wrap gap-3">
      {canProcessRequest(request, user) && (
        <>
          <Button
            onClick={onAccept}
            size="lg"
            className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Accepter
          </Button>
          <Button
            onClick={onReject}
            size="lg"
            className="bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <XCircle className="h-5 w-5 mr-2" />
            Rejeter
          </Button>
        </>
      )}
      
      {canEditRequest(request, user) && (
        <Button
          onClick={onEdit}
          size="lg"
          variant="outline"
          className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Edit className="h-5 w-5 mr-2" />
          Modifier
        </Button>
      )}
      
      {canCancelRequest(request, user) && (
        <Button
          onClick={onCancel}
          size="lg"
          className="bg-linear-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Ban className="h-5 w-5 mr-2" />
          Annuler la requête
        </Button>
      )}
    </div>
  );
}

