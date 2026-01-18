import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { ArrowLeft, Shield, Sparkles, Calendar, CheckCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import { formatDate, formatRequestId } from "../utils/formatters";
import type { ActivationRequest } from "~/types";
import type { Translations } from "~/lib/i18n/translations";
import type { User } from "../utils/permissions";

interface RequestHeaderProps {
  request: ActivationRequest;
  user: User | null;
  language: 'fr' | 'en';
  translations: Translations['activationRequests'];
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onBack: () => void;
}

export function RequestHeader({
  request,
  user,
  language,
  translations,
  onAccept,
  onReject,
  onEdit,
  onCancel,
  onBack,
}: RequestHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 sm:mb-6 hover:bg-accent/50 border border-border/50 text-sm sm:text-base"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {translations.details.backToList}
      </Button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shrink-0">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="wrap-break-word">{translations.details.title}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md cursor-help hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-xs sm:text-sm shrink-0">
                        #{formatRequestId(request.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono text-xs">ID complet: {request.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-amber-500 animate-pulse shrink-0" />
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 flex-wrap">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground wrap-break-word">
                  {translations.details.createdOn} {formatDate(request.created_at, language)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <StatusBadge status={request.status} translations={translations.status} />
            {request.processed_at && (
              <Badge variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 border-2 text-xs sm:text-sm">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
                <span className="wrap-break-word">
                  {translations.details.processedOn} {formatDate(request.processed_at, language)}
                </span>
              </Badge>
            )}
          </div>
        </div>

        <div className="w-full lg:w-auto shrink-0">
          <ActionButtons
            request={request}
            user={user}
            onAccept={onAccept}
            onReject={onReject}
            onEdit={onEdit}
            onCancel={onCancel}
          />
        </div>
      </div>
    </div>
  );
}

