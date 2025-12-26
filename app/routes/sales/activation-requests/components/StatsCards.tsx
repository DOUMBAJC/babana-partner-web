import { Card } from "~/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, Ban, TrendingUp } from "lucide-react";
import { useTranslation } from "~/hooks";
import type { ActivationRequestStats } from "~/types";

interface StatsCardsProps {
  stats: ActivationRequestStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t.activationRequests.stats.total,
      value: stats.total,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      description: t.activationRequests.stats.totalDesc,
    },
    {
      title: t.activationRequests.stats.pending,
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      description: t.activationRequests.stats.pendingDesc,
    },
    {
      title: t.activationRequests.stats.processing,
      value: stats.processing,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      description: t.activationRequests.stats.processingDesc,
    },
    {
      title: t.activationRequests.stats.activated,
      value: stats.activated,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      description: t.activationRequests.stats.activatedDesc,
    },
    {
      title: t.activationRequests.stats.rejected,
      value: stats.rejected,
      icon: Ban,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      description: t.activationRequests.stats.rejectedDesc,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

