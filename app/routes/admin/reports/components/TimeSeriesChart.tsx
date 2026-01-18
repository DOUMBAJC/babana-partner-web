import { useMemo } from "react";

interface TimeSeriesChartProps {
  data: {
    today: { total: number; activated: number; rejected: number };
    this_week: { total: number; activated: number; rejected: number };
    this_month: { total: number; activated: number; rejected: number };
  };
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const chartData = useMemo(() => {
    return [
      { label: "Aujourd'hui", total: data.today.total, activated: data.today.activated, rejected: data.today.rejected },
      { label: "Cette semaine", total: data.this_week.total, activated: data.this_week.activated, rejected: data.this_week.rejected },
      { label: "Ce mois", total: data.this_month.total, activated: data.this_month.activated, rejected: data.this_month.rejected },
    ];
  }, [data]);

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.total, d.activated, d.rejected)),
    1
  );

  const height = 200;
  const width = 100;
  const padding = 20;

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 sm:gap-4 h-[200px] sm:h-[250px] mb-4">
        {chartData.map((item, index) => {
          const totalHeight = (item.total / maxValue) * (height - padding * 2);
          const activatedHeight = (item.activated / maxValue) * (height - padding * 2);
          const rejectedHeight = (item.rejected / maxValue) * (height - padding * 2);

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 h-full">
              <div className="flex flex-col items-center justify-end h-full w-full gap-0.5 sm:gap-1">
                {/* Stacked bars */}
                <div className="w-full flex flex-col-reverse gap-0.5 sm:gap-1" style={{ height: `${totalHeight}px` }}>
                  {rejectedHeight > 2 && (
                    <div
                      className="bg-linear-to-t from-red-500 to-red-600 rounded-t transition-all duration-500 hover:opacity-80"
                      style={{ height: `${(rejectedHeight / totalHeight) * 100}%` }}
                      title={`Rejetées: ${item.rejected}`}
                    />
                  )}
                  {activatedHeight > 2 && (
                    <div
                      className="bg-linear-to-t from-green-500 to-emerald-600 rounded-t transition-all duration-500 hover:opacity-80"
                      style={{ height: `${(activatedHeight / totalHeight) * 100}%` }}
                      title={`Activées: ${item.activated}`}
                    />
                )}
                </div>
              </div>
              
              {/* Labels */}
              <div className="text-center mt-2">
                <p className="text-xs sm:text-sm font-semibold text-foreground">{item.total}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 wrap-break-word">
                  {item.label.split(" ").map((word, i) => (
                    <span key={i}>
                      {word}
                      {i < item.label.split(" ").length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-linear-to-r from-green-500 to-emerald-600" />
          <span className="text-xs sm:text-sm text-muted-foreground">Activées</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-linear-to-r from-red-500 to-red-600" />
          <span className="text-xs sm:text-sm text-muted-foreground">Rejetées</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-linear-to-r from-blue-500 to-cyan-600" />
          <span className="text-xs sm:text-sm text-muted-foreground">Total</span>
        </div>
      </div>
    </div>
  );
}

