import { Button } from "~/components";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface SupportPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SupportPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SupportPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="text-sm font-medium text-muted-foreground">
        Page {currentPage} sur {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="border-2 hover:border-babana-cyan hover:bg-babana-cyan/10 transition-all duration-200"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-2 hover:border-babana-cyan hover:bg-babana-cyan/10 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-2 hover:border-babana-cyan hover:bg-babana-cyan/10 transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="border-2 hover:border-babana-cyan hover:bg-babana-cyan/10 transition-all duration-200"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

