import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Filter, Calendar, X } from "lucide-react";
import { useTranslation } from "~/hooks";

interface ReportsFiltersProps {
  dateFrom: string | null;
  dateTo: string | null;
}

export function ReportsFilters({ dateFrom, dateTo }: ReportsFiltersProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom || "");
  const [localDateTo, setLocalDateTo] = useState(dateTo || "");

  const handleApplyFilters = () => {
    const params = new URLSearchParams(location.search);
    
    if (localDateFrom) {
      params.set("dateFrom", localDateFrom);
    } else {
      params.delete("dateFrom");
    }
    
    if (localDateTo) {
      params.set("dateTo", localDateTo);
    } else {
      params.delete("dateTo");
    }

    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setLocalDateFrom("");
    setLocalDateTo("");
    navigate(location.pathname);
  };

  const hasActiveFilters = localDateFrom || localDateTo;

  return (
    <Card className="border-orange-500/15 bg-linear-to-br from-orange-500/5 to-amber-500/5">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">{t.reports.filters.title}</h3>
          {hasActiveFilters && (
            <Badge variant="outline" className="ml-auto text-xs">
              {t.reports.filters.active}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom" className="text-xs sm:text-sm flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {t.reports.filters.startDate}
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={localDateFrom}
              onChange={(e) => setLocalDateFrom(e.target.value)}
              className="text-xs sm:text-sm h-9 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo" className="text-xs sm:text-sm flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {t.reports.filters.endDate}
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={localDateTo}
              onChange={(e) => setLocalDateTo(e.target.value)}
              className="text-xs sm:text-sm h-9 sm:h-10"
              min={localDateFrom || undefined}
            />
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-9 sm:h-10 text-xs sm:text-sm"
            >
              {t.reports.filters.apply}
            </Button>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                {t.reports.filters.reset}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

