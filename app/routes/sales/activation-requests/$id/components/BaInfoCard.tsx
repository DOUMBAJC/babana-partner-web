import { User, FileText, Shield } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { InfoCard, CopyableValue } from "../../components/CopyButton";
import type { ActivationRequest } from "~/types";
import { useTranslation } from "~/hooks";

interface BaInfoCardProps {
  request: ActivationRequest;
}

export function BaInfoCard({ request }: BaInfoCardProps) {
  const { t } = useTranslation();
  
  return (
    <InfoCard
      icon={<User className="h-6 w-6" />}
      title={t.activationRequests.details.brandAmbassador}
      gradient="from-orange-500 via-amber-500 to-yellow-500"
    >
      <CopyableValue
        label={t.activationRequests.details.name}
        value={request.ba?.name || '-'}
        icon={<User className="h-4 w-4" />}
      />
      <Separator className="my-3" />
      <CopyableValue
        label={t.activationRequests.details.email}
        value={request.ba?.email || '-'}
        mono
        icon={<FileText className="h-4 w-4" />}
      />
      {request.ba?.camtelLogin && (
        <>
          <Separator className="my-3" />
          <CopyableValue
            label={t.activationRequests.details.camtelLogin}
            value={request.ba.camtelLogin}
            mono
            icon={<Shield className="h-4 w-4" />}
          />
        </>
      )}
      <Separator className="my-3" />
      {
        request.ba?.personal_phone ? 'hallo we have personal phone' : ' no personal phone'
      }
    </InfoCard>
  );
}

