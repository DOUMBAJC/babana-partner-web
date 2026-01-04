import { Badge } from '~/components/ui/badge';
import { Shield, Key, Lock, Crown } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { Permission, RoleSlug } from '~/types/auth.types';

interface PermissionBadgeProps {
  permission?: Permission;
  role?: RoleSlug;
  variant?: 'default' | 'compact';
  showIcon?: boolean;
}

/**
 * Badge pour afficher une permission ou un rôle avec un style cohérent
 */
export function PermissionBadge({
  permission,
  role,
  variant = 'default',
  showIcon = true,
}: PermissionBadgeProps) {
  const isCompact = variant === 'compact';

  // Configuration des icônes et couleurs par rôle
  const getRoleConfig = (roleSlug: RoleSlug) => {
    const configs: Record<string, { icon: typeof Shield; color: string; label: string }> = {
      'super_admin': { icon: Crown, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700', label: 'Super Admin' },
      'admin': { icon: Shield, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700', label: 'Admin' },
      'activateur': { icon: Key, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700', label: 'Activateur' },
      'ba': { icon: Shield, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700', label: 'BA' },
      'dsm': { icon: Shield, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700', label: 'DSM' },
      'pos': { icon: Shield, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700', label: 'POS' },
      'vendeur': { icon: Shield, color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700', label: 'Vendeur' },
      'client': { icon: Shield, color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700', label: 'Client' },
      'autre': { icon: Shield, color: 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700', label: 'Autre' },
    };
    
    return configs[roleSlug] || { 
      icon: Lock, 
      color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700', 
      label: roleSlug 
    };
  };

  if (role) {
    const config = getRoleConfig(role);
    const Icon = config.icon;

    return (
      <Badge 
        variant="outline" 
        className={cn(
          "font-medium flex items-center gap-1",
          isCompact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
          config.color
        )}
      >
        {showIcon && <Icon className={cn(isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />}
        <span>{config.label}</span>
      </Badge>
    );
  }

  if (permission) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "font-medium flex items-center gap-1",
          isCompact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1",
          "bg-babana-cyan/10 dark:bg-babana-cyan/20 text-babana-cyan border-babana-cyan/30"
        )}
      >
        {showIcon && <Key className={cn(isCompact ? "w-2.5 h-2.5" : "w-3 h-3")} />}
        <span>{permission}</span>
      </Badge>
    );
  }

  return null;
}

