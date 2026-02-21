import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { TrendingUp, TrendingDown, Ban } from "lucide-react";

interface BusinessAdvisorTableProps {
  data: Array<{
    ba_id: string;
    ba_name: string;
    total: number;
    activated: number;
    rejected: number;
    pending: number;
    cancelled?: number;
    rank?: number;
  }>;
}

export function BusinessAdvisorTable({ data }: BusinessAdvisorTableProps) {
  // Trier par nombre d'activations pour le classement, puis par total s'il y a égalité
  const sortedData = [...data].sort((a, b) => {
    if (b.activated !== a.activated) return b.activated - a.activated;
    return b.total - a.total;
  });

  return (
    <div className="rounded-lg border overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs sm:text-sm font-bold w-12 text-center">Rang</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold">Conseiller</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold text-center">Total</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold text-center hidden sm:table-cell">Activées</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold text-center hidden md:table-cell">Rejetées</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold text-center hidden lg:table-cell">En attente</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold text-center hidden xl:table-cell">Annulées</TableHead>
            <TableHead className="text-xs sm:text-sm font-bold text-center">Taux de succès</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Aucune donnée disponible
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((ba) => {
              const displayRank = ba.rank;
              const successRate = ba.total > 0 ? ((ba.activated / ba.total) * 100).toFixed(1) : "0";
              const isPositive = parseFloat(successRate) >= 70;

              return (
                <TableRow key={ba.ba_id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-center">
                    {displayRank === 1 ? (
                      <span className="text-xl">🥇</span>
                    ) : displayRank === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : displayRank === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">#{displayRank}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-xs sm:text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold">{ba.ba_name || "N/A"}</span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {ba.activated} activées • {ba.rejected} rejetées{ba.cancelled ? ` • ${ba.cancelled} annulées` : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs sm:text-sm font-bold">
                      {ba.total}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                        {ba.activated}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">
                        {ba.rejected}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {ba.pending}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center hidden xl:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <Ban className="h-3 w-3 text-slate-600" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {ba.cancelled || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge
                        variant={isPositive ? "default" : "destructive"}
                        className={`text-xs sm:text-sm font-bold ${
                          isPositive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {successRate}%
                      </Badge>
                      <div className="w-16 sm:w-24 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isPositive
                              ? "bg-linear-to-r from-green-500 to-emerald-600"
                              : "bg-linear-to-r from-red-500 to-rose-600"
                          }`}
                          style={{ width: `${successRate}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

