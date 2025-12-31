import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useTheme, useTranslation } from "~/hooks";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 hover:text-babana-cyan dark:hover:text-babana-cyan transition-all duration-300 group"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-400 group-hover:text-babana-cyan" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-400 dark:text-gray-300 dark:group-hover:text-babana-cyan" />
          <span className="sr-only">{t.header.changeTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl min-w-[160px]"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className={`cursor-pointer transition-colors ${
            theme === "light" 
              ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20 dark:text-babana-cyan" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>{t.theme.light}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className={`cursor-pointer transition-colors ${
            theme === "dark" 
              ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20 dark:text-babana-cyan" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>{t.theme.dark}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className={`cursor-pointer transition-colors ${
            theme === "system" 
              ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20 dark:text-babana-cyan" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>{t.theme.system}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


