import { useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { useTranslation } from "~/hooks";
import { useState, useEffect } from "react";

export function FiltersSection() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search); else params.delete('search');
    if (status !== 'all') params.set('status', status); else params.delete('status');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearch('');
    setStatus('all');
    setSearchParams({});
  };

  return (
    <div className="flex flex-col lg:flex-row items-end gap-4 mb-6 p-4 bg-muted/30 rounded-xl border border-border/40">
      <div className="w-full lg:w-1/3">
        <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
          {t.actions.search}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, Téléphone, Pièce..."
            className="pl-10 rounded-lg"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/4">
        <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
          Statut
        </label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">{t.identifications.status.pending}</SelectItem>
            <SelectItem value="approved">{t.identifications.status.approved}</SelectItem>
            <SelectItem value="rejected">{t.identifications.status.rejected}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 min-w-max">
        <Button onClick={handleApply} className="rounded-lg gap-2">
          <Filter className="h-4 w-4" />
          {t.actions.filter}
        </Button>
        <Button variant="outline" onClick={handleClear} className="rounded-lg gap-2">
          <X className="h-4 w-4" />
          {t.actions.cancel}
        </Button>
      </div>
    </div>
  );
}
