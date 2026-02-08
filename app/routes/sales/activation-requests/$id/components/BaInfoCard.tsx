import { User, FileText, Shield } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { InfoCard, CopyableValue } from "../../components/CopyButton";
import type { ActivationRequest } from "~/types";
import { useTranslation } from "~/hooks";

interface BaInfoCardProps {
  request: ActivationRequest;
}

export function BaInfoCard({ request }: BaInfoCardProps) {
  const { t } = useTranslation();
  
  const formatPhoneForWhatsApp = (phone: string): string => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned;
  };

  const whatsAppUrl = request.ba?.personal_phone 
    ? `https://wa.me/${formatPhoneForWhatsApp(request.ba.personal_phone)}`
    : null;
  
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
      {request.ba?.personal_phone && whatsAppUrl && (
        <>
          <Separator className="my-3" />
          <div className="flex items-center justify-center">
            <Button
              asChild
              className="group relative overflow-hidden w-full bg-linear-to-r from-[#25D366] via-[#20BA5A] to-[#128C7E] hover:from-[#20BA5A] hover:via-[#25D366] hover:to-[#20BA5A] text-white shadow-lg hover:shadow-xl hover:shadow-[#25D366]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-3 px-4"
              >
                {/* WhatsApp Icon with animation */}
                <svg
                  className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.089c0 1.847.485 3.58 1.335 5.081L0 24l8.986-2.301a11.807 11.807 0 003.063.395h.004c5.554 0 10.089-4.534 10.089-10.088 0-2.724-1.087-5.202-2.856-7.02z" />
                </svg>
                <span className="font-semibold text-base relative z-10">
                  Contacter sur WhatsApp
                </span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </a>
            </Button>
          </div>
        </>
      )}
    </InfoCard>
  );
}

