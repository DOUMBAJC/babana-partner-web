import { CreditCard, Zap, Shield } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { InfoCard, CopyableValue } from "../../components/CopyButton";
import type { ActivationRequest } from "~/types";
import { useTranslation } from "~/hooks";

interface SimInfoCardProps {
  request: ActivationRequest;
}

export function SimInfoCard({ request }: SimInfoCardProps) {
  const { t } = useTranslation();
  
  return (
    <InfoCard
      icon={<CreditCard className="h-6 w-6" />}
      title={t.activationRequests.details.simInfo}
      gradient="bg-linear-to-r from-purple-500 via-pink-500 to-rose-500"
    >
      <CopyableValue
        label={t.activationRequests.details.simNumber}
        value={request.sim_number}
        highlight
        mono
        icon={<Zap className="h-4 w-4" />}
      />
      <Separator className="my-3" />
      <CopyableValue
        label={t.activationRequests.details.iccid}
        value={request.iccid}
        mono
        icon={<CreditCard className="h-4 w-4" />}
      />
      <Separator className="my-3" />
      {request.imei ? (
        <CopyableValue
          label={t.activationRequests.details.imei}
          value={request.imei}
          mono
          icon={<Shield className="h-4 w-4" />}
        />
      ) : (
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.activationRequests.details.imei}</p>
          <p className="text-sm text-muted-foreground italic mt-2">{t.activationRequests.details.notProvided}</p>
        </div>
      )}
    </InfoCard>
  );
}

