import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { Filter, Search } from "lucide-react";

interface SupportFiltersProps {
  searchValue: string;
  statusValue: string;
  priorityValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export function SupportFilters({
  searchValue,
  statusValue,
  priorityValue,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: SupportFiltersProps) {
  return (
    <Card className="border-2 border-babana-cyan/20 dark:border-babana-cyan/10 shadow-2xl backdrop-blur-sm bg-card/80 dark:bg-card/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-linear-to-br from-babana-cyan to-babana-blue text-white">
            <Filter className="h-5 w-5" />
          </div>
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-babana-cyan" />
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par sujet, email..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 border-2 border-input/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-babana-cyan focus:ring-2 focus:ring-babana-cyan/20 hover:border-babana-cyan/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Statut</label>
            <Select value={statusValue} onValueChange={onStatusChange}>
              <SelectTrigger className="border-2 border-input/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-babana-cyan focus:ring-2 focus:ring-babana-cyan/20 hover:border-babana-cyan/50">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-xl border-2 border-border/80">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="closed">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Priorité</label>
            <Select value={priorityValue} onValueChange={onPriorityChange}>
              <SelectTrigger className="border-2 border-input/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-babana-cyan focus:ring-2 focus:ring-babana-cyan/20 hover:border-babana-cyan/50">
                <SelectValue placeholder="Toutes les priorités" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-xl border-2 border-border/80">
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

