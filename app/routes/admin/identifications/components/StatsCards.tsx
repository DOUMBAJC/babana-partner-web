import { Card } from "~/components/ui/card";
import { CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { useTranslation } from '~/hooks';

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      title: "Total",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: t.identifications.status.pending,
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      title: t.identifications.status.approved,
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: t.identifications.status.rejected,
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="p-6 border-border/40 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
