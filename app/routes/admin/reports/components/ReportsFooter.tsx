/**
 * Composant Footer pour la page des rapports
 */

import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Clock } from "lucide-react";
import { formatDate } from "date-fns";
import type { ReportsStats } from "../types";

interface ReportsFooterProps {
  stats: ReportsStats;
}

export function ReportsFooter({ stats }: ReportsFooterProps) {
  return (
    <Card className="border-orange-500/10 bg-muted/30">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>
              Dernière mise à jour :{" "}
              {stats.generated_at
                ? formatDate(new Date(stats.generated_at), "PPpp")
                : "N/A"}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {stats.overview.total} requête
            {stats.overview.total > 1 ? "s" : ""} au total
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

