import { Languages } from "lucide-react";
import { useLanguage, useTranslation } from "~/hooks";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 hover:text-babana-cyan dark:hover:text-babana-cyan transition-all duration-300 group"
        >
          <Languages className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-babana-cyan dark:group-hover:text-babana-cyan transition-colors" />
          <span className="sr-only">{t.header.changeLanguage}</span>
          <span className="absolute -top-1 -right-1 text-[9px] font-bold uppercase bg-linear-to-r from-babana-cyan to-babana-blue text-white px-1.5 py-0.5 rounded shadow-sm">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl min-w-[160px]"
      >
        <DropdownMenuItem
          onClick={() => setLanguage("fr")}
          className={`cursor-pointer transition-colors ${
            language === "fr" 
              ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20 dark:text-babana-cyan" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <span className="mr-2">🇫🇷</span>
          {t.languages.french}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer transition-colors ${
            language === "en" 
              ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20 dark:text-babana-cyan" 
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          <span className="mr-2">🇬🇧</span>
          {t.languages.english}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


