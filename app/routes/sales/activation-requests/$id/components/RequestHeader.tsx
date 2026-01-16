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
    <div className="mb-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-accent/50 border border-border/50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {translations.details.backToList}
      </Button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                {translations.details.title}{' '}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-md cursor-help hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                        #{formatRequestId(request.id)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono text-xs">ID complet: {request.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Sparkles className="h-7 w-7 text-amber-500 animate-pulse" />
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {translations.details.createdOn} {formatDate(request.created_at, language)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <StatusBadge status={request.status} translations={translations.status} />
            {request.processed_at && (
              <Badge variant="outline" className="px-3 py-1 border-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                {translations.details.processedOn} {formatDate(request.processed_at, language)}
              </Badge>
            )}
          </div>
        </div>

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
  );
}

