import { Button } from "~/components";
import { Loader2, MessageSquare, RefreshCcw } from "lucide-react";

interface SupportHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function SupportHeader({ onRefresh, isRefreshing }: SupportHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-r from-babana-cyan/20 via-babana-blue/20 to-babana-cyan/20 blur-3xl rounded-3xl" />
      <div className="relative bg-card/80 dark:bg-card/90 backdrop-blur-xl border-2 border-babana-cyan/20 dark:border-babana-cyan/10 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-babana-cyan rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative p-4 bg-linear-to-br from-babana-cyan to-babana-blue rounded-2xl shadow-2xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-babana-cyan via-babana-blue to-babana-cyan bg-clip-text text-transparent">
                Gestion du Support
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Gérez et répondez aux tickets de support
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-2 border-babana-cyan/30 hover:border-babana-cyan hover:bg-babana-cyan/10 transition-all duration-300"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Actualiser
          </Button>
        </div>
      </div>
    </div>
  );
}

