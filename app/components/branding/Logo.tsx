import { cn } from "~/lib/utils";

interface LogoProps {
  logoUrl: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function Logo({ logoUrl, className, size = "md" }: LogoProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src={logoUrl}
        alt="BABANA Logo"
        className={cn(
          "object-contain transition-transform hover:scale-105",
          sizeClasses[size]
        )}
      />
    </div>
  );
}