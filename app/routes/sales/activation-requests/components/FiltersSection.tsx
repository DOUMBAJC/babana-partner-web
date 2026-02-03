import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useNavigation } from "react-router";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Search, X, Filter, Loader2 } from "lucide-react";
import { useLanguage, useTranslation, useAuth } from "~/hooks";
import { ExportButtons } from "./ExportButtons";


export function FiltersSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();

  // Initialiser les filtres depuis l'URL au montage
  const [localFilters, setLocalFilters] = useState(() => ({
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    mine: searchParams.get('mine') === '1',
  }));

  // Déterminer si on est en train de charger
  const isLoading = navigation.state === 'loading';

  // Synchroniser les filtres locaux avec les URL params
  useEffect(() => {
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const mine = searchParams.get('mine') === '1';
    
    setLocalFilters({ status, search, dateFrom, dateTo, mine });
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setLocalFilters({ ...localFilters, search: value });
  };

  const handleStatusChange = (value: string) => {
    setLocalFilters({ ...localFilters, status: value });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, dateFrom: e.target.value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({ ...localFilters, dateTo: e.target.value });
  };





  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (localFilters.status) {
      params.set('status', localFilters.status);
    } else {
      params.delete('status');
    }
    
    if (localFilters.search) {
      params.set('search', localFilters.search);
    } else {
      params.delete('search');
    }

    if (localFilters.dateFrom) {
      params.set('dateFrom', localFilters.dateFrom);
    } else {
      params.delete('dateFrom');
    }

    if (localFilters.dateTo) {
      params.set('dateTo', localFilters.dateTo);
    } else {
      params.delete('dateTo');
    }

    if (localFilters.mine) {
      params.set('mine', '1');
    } else {
      params.delete('mine');
    }

    
    params.set('page', '1'); // Reset à la première page
    
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleClearFilters = () => {
    const clearedFilters = { status: '', search: '', dateFrom: '', dateTo: '', mine: false };
    setLocalFilters(clearedFilters);
    navigate('?page=1', { replace: true });
  };


  const hasActiveFilters = localFilters.status || localFilters.search || localFilters.dateFrom || localFilters.dateTo || localFilters.mine;

  return (
    <Card className="p-6 mb-6 shadow-sm border-border/40 bg-linear-to-br from-background to-muted/20">
      <div className="flex items-center gap-2 mb-6">
        <div className="rounded-lg bg-primary/10 p-2">
          <Filter className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{t.activationRequests.filters.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Recherche */}
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="search" className="text-sm font-medium">{t.activationRequests.filters.search}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder={t.activationRequests.filters.searchPlaceholder}
              value={localFilters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-background"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyFilters();
                }
              }}
            />
          </div>
        </div>

        {/* Statut */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">{t.activationRequests.filters.status}</Label>
          <Select
            value={localFilters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status" className="bg-background">
              <SelectValue placeholder={t.activationRequests.filters.allStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.activationRequests.status.all}</SelectItem>
              <SelectItem value="pending">{t.activationRequests.status.pending}</SelectItem>
              <SelectItem value="processing">{t.activationRequests.status.processing}</SelectItem>
              <SelectItem value="activated">{t.activationRequests.status.activated}</SelectItem>
              <SelectItem value="rejected">{t.activationRequests.status.rejected}</SelectItem>
              <SelectItem value="cancelled">{t.activationRequests.status.cancelled}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date de début */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom" className="text-sm font-medium">{t.activationRequests.filters.dateFrom}</Label>
          <Input
            id="dateFrom"
            type="date"
            value={localFilters.dateFrom || ""}
            onChange={handleDateFromChange}
            className="bg-background"
          />
        </div>

        {/* Date de fin */}
        <div className="space-y-2">
          <Label htmlFor="dateTo" className="text-sm font-medium">{t.activationRequests.filters.dateTo}</Label>
          <Input
            id="dateTo"
            type="date"
            value={localFilters.dateTo || ""}
            onChange={handleDateToChange}
            className="bg-background"
          />
        </div>
      </div>


      {/* Boutons d'action */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
        <div className="flex items-center gap-2">
          <ExportButtons />
        </div>
        
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-2"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              {t.activationRequests.filters.clear}
            </Button>
          )}
          <Button
            onClick={handleApplyFilters}
            className="gap-2 min-w-[120px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                {t.activationRequests.filters.apply}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

