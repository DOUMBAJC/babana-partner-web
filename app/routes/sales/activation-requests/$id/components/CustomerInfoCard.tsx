import { User, Phone, CreditCard, Shield } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { InfoCard, CopyableValue } from "../../components/CopyButton";
import type { ActivationRequest } from "~/types";
import { useTranslation } from "~/hooks";

interface CustomerInfoCardProps {
  request: ActivationRequest;
}

export function CustomerInfoCard({ request }: CustomerInfoCardProps) {
  const { t } = useTranslation();
  
  return (
    <InfoCard
      icon={<User className="h-6 w-6" />}
      title={t.activationRequests.details.customerInfo}
      gradient="bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500"
    >
      <CopyableValue
        label={t.activationRequests.details.fullName}
        value={request.customer?.full_name?.toUpperCase() || '-'}
        highlight
        icon={<User className="h-4 w-4" />}
      />
      <Separator className="my-3" />
      <CopyableValue
        label={t.activationRequests.details.phone}
        value={request.customer?.phone || '-'}
        mono
        icon={<Phone className="h-4 w-4" />}
      />
      <Separator className="my-3" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-primary">
            <CreditCard className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            {t.activationRequests.details.cardTypePiece}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 group">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground group-hover:text-primary break-all transition-all duration-200">
              {request.customer?.id_card_type?.name || '-'}
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-3" />
      <CopyableValue
        label={t.activationRequests.details.cardNumber}
        value={request.customer?.id_card_number || '-'}
        mono
        icon={<Shield className="h-4 w-4" />}
      />
      <Separator className="my-3" />
      <CopyableValue
        label={t.activationRequests.details.address}
        value={request.customer?.address || '-'}
        mono
        icon={<Shield className="h-4 w-4" />}
      />
    </InfoCard>
  );
}

