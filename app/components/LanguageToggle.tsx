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
        <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:text-accent-foreground">
          <Languages className="h-[1.2rem] w-[1.2rem] text-foreground" />
          <span className="sr-only">{t.header.changeLanguage}</span>
          <span className="absolute -top-1 -right-1 text-[10px] font-bold uppercase bg-babana-cyan text-white px-1 rounded">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border">
        <DropdownMenuItem
          onClick={() => setLanguage("fr")}
          className={language === "fr" ? "bg-accent text-accent-foreground cursor-pointer" : "hover:bg-accent hover:text-accent-foreground cursor-pointer"}
        >
          🇫🇷 {t.languages.french}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={language === "en" ? "bg-accent text-accent-foreground cursor-pointer" : "hover:bg-accent hover:text-accent-foreground cursor-pointer"}
        >
          🇬🇧 {t.languages.english}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

