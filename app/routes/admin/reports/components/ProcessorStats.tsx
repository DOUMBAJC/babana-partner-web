import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { ShieldCheck, TrendingUp, TrendingDown, Users } from "lucide-react";

interface ProcessorStatsProps {
  data: Array<{
    processor_id: string;
    processor_name: string;
    total: number;
    processor_role?: string;
    activated: number;
    rejected: number;
  }>;
}

export function ProcessorStats({ data }: ProcessorStatsProps) {
  return (
    <Card className="border-orange-500/15 overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-orange-500" />
          Performance des Activateurs
        </CardTitle>
        <CardDescription>
          Nombre de requêtes traitées par chaque activateur/admin
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="text-xs font-bold px-4 py-3">Activateur</TableHead>
                <TableHead className="text-xs font-bold px-4 py-3 hidden md:table-cell">Rôle</TableHead>
                <TableHead className="text-xs font-bold text-center px-4 py-3">Total Traité</TableHead>
                <TableHead className="text-xs font-bold text-center px-4 py-3 hidden sm:table-cell">Activations</TableHead>
                <TableHead className="text-xs font-bold text-center px-4 py-3 hidden sm:table-cell">Rejets</TableHead>
                <TableHead className="text-xs font-bold text-center px-4 py-3">Efficacité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                    <div className="flex flex-col items-center gap-2">
                       <Users className="h-10 w-10 opacity-20" />
                       <p>Aucun activateur répertorié pour cette période</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((p) => {
                  const efficiency = p.total > 0 ? ((p.activated / p.total) * 100).toFixed(1) : "0";
                  
                  const roleConfig: Record<string, { label: string; color: string }> = {
                    super_admin: { label: "Super Admin", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
                    admin: { label: "Admin", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
                    activateur: { label: "Activateur", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
                  };

                  const config = roleConfig[p.processor_role || "activateur"] || roleConfig.activateur;

                  return (
                    <TableRow key={p.processor_id} className="hover:bg-muted/40 transition-colors border-b last:border-0">
                      <TableCell className="px-4 py-3">
                        <span className="font-semibold text-sm">{p.processor_name}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 hidden md:table-cell">
                        <Badge 
                           variant="outline" 
                           className={`text-[10px] uppercase tracking-wider font-bold ${config.color}`}
                        >
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center px-4 py-3">
                        <Badge variant="secondary" className="font-bold">
                          {p.total}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1.5 text-green-600 font-medium text-sm">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {p.activated}
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1.5 text-red-600 font-medium text-sm">
                          <TrendingDown className="h-3.5 w-3.5" />
                          {p.rejected}
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-4 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold">{efficiency}%</span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 rounded-full" 
                              style={{ width: `${efficiency}%` }}
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
      </CardContent>
    </Card>
  );
}
