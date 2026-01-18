import { useMemo } from "react";

interface StatusDistributionChartProps {
  data: {
    total: number;
    pending: number;
    processing: number;
    activated: number;
    rejected: number;
    cancelled: number;
  };
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const chartData = useMemo(() => {
    const items = [
      { label: "Activées", value: data.activated, color: "from-green-500 to-emerald-600", fromColor: "#22c55e", toColor: "#16a34a" },
      { label: "En attente", value: data.pending, color: "from-amber-500 to-orange-600", fromColor: "#f59e0b", toColor: "#ea580c" },
      { label: "En traitement", value: data.processing, color: "from-purple-500 to-pink-600", fromColor: "#a855f7", toColor: "#db2777" },
      { label: "Rejetées", value: data.rejected, color: "from-red-500 to-rose-600", fromColor: "#ef4444", toColor: "#e11d48" },
      { label: "Annulées", value: data.cancelled, color: "from-slate-500 to-gray-600", fromColor: "#64748b", toColor: "#475569" },
    ].filter((item) => item.value > 0);

    const total = items.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = -90; // Start from top
    const segments = items.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
      };
    });

    return { segments, total };
  }, [data]);

  const size = 200;
  const radius = size / 2 - 10;
  const center = size / 2;

  const getPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      center,
      center,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
        {/* Pie Chart SVG */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {chartData.segments.map((segment, index) => (
              <path
                key={index}
                d={getPath(segment.startAngle, segment.endAngle)}
                fill={`url(#gradient-${index})`}
                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
              />
            ))}
            <defs>
              {chartData.segments.map((segment, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={segment.fromColor} />
                  <stop offset="100%" stopColor={segment.toColor} />
                </linearGradient>
              ))}
            </defs>
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{chartData.total}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 sm:space-y-3 min-w-[200px]">
          {chartData.segments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className={`w-4 h-4 rounded bg-linear-to-r ${segment.color} shrink-0`}
                />
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {segment.label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {segment.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

