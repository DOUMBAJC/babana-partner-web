import { LogOut, User as UserIcon, Shield, LogIn, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router';
import { useAuth, usePermissions, useTranslation } from '~/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from '~/components';

/**
 * Menu utilisateur avec avatar et dropdown
 * Affiche les informations de l'utilisateur connecté et les actions disponibles
 */
export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const permissions = usePermissions();
  const { t } = useTranslation();

  if (!isAuthenticated || !user) {
    return (
      <Button onClick={() => navigate('/login')} variant="default" size="sm">
        <LogIn className="mr-2 h-4 w-4" />
        {t.actions.login}
      </Button>
    );
  }

  const handleLogout = () => {
    return logout();
  };

  const getInitials = (name: string) => {
    const safe = (name ?? "").trim();
    if (!safe) return "??";
    return safe
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`
            h-10 px-2.5 rounded-full
            flex items-center gap-2
            bg-white/40 dark:bg-gray-900/40
            hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15
            ring-1 ring-babana-cyan/15 hover:ring-babana-cyan/30
            transition-all
            text-slate-900 dark:text-slate-100
          `}
        >
          <Avatar className="h-8 w-8 ring-2 ring-babana-cyan/15">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-linear-to-br from-babana-cyan to-babana-blue text-white font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start leading-tight min-w-0">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
              {user.name}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
              {user.roles?.[0] ?? ""}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 rounded-2xl p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 border border-babana-cyan/20 shadow-2xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 ring-2 ring-babana-cyan/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-linear-to-br from-babana-cyan to-babana-blue text-white font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">{Array.isArray(user.roles) ? user.roles.join(", ") : ""}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-200/70 dark:bg-slate-700/70" />

        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:bg-babana-cyan/10 focus:text-babana-cyan"
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span className="flex-1">{t.pages.profile.title}</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </DropdownMenuItem>

        {permissions.isAdmin() && (
          <DropdownMenuItem
            onClick={() => navigate("/admin")}
            className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:bg-babana-cyan/10 focus:text-babana-cyan"
          >
            <Shield className="mr-2 h-4 w-4" />
            <span>{t.nav.admin}</span>
            <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-slate-200/70 dark:bg-slate-700/70" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-700 dark:focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.actions.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


