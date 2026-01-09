import { History, Clock } from "lucide-react";
import { InfoCard } from "../../components/CopyButton";
import { formatDate } from "../utils/formatters";
import type { ActivationRequest } from "~/types";

interface HistorySectionProps {
  request: ActivationRequest;
  language: 'fr' | 'en';
}

export function HistorySection({ request, language }: HistorySectionProps) {
  if (!request.history || request.history.length === 0) {
    return null;
  }

  return (
    <InfoCard
      icon={<History className="h-6 w-6" />}
      title="Historique des modifications"
      gradient="from-indigo-500 via-purple-500 to-pink-500"
      className="animate-fade-in"
    >
      <div className="space-y-4">
        {request.history.map((entry: any, index: number) => (
          <div key={entry.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              {index < request.history!.length - 1 && (
                <div className="w-0.5 flex-1 bg-linear-to-b from-purple-500 to-pink-600 mt-2 rounded-full" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="bg-accent/50 p-4 rounded-xl border-2 border-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{entry.action}</p>
                    {entry.user && (
                      <p className="text-sm text-muted-foreground mt-1">
                        par <span className="font-semibold text-primary">{entry.user.name}</span>
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap bg-accent px-3 py-1 rounded-full font-mono">
                    {formatDate(entry.createdAt, language)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

