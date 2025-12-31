import { LogOut, User as UserIcon, Shield, LogIn } from 'lucide-react';
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
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-babana-cyan text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-popover text-popover-foreground border-border" align="end" forceMount>
        <DropdownMenuLabel className="font-normal text-foreground">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {user.roles.join(', ')}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <UserIcon className="mr-2 h-4 w-4" />
          <span>{t.profile.title}</span>
        </DropdownMenuItem>

        {permissions.isAdmin() && (
          <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>{t.nav.admin}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-accent hover:text-red-600 dark:hover:text-red-400 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.actions.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


