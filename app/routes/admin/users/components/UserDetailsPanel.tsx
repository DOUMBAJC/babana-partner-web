import { useState } from "react";
import type React from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Fingerprint,
  IdCard,
  Key,
  Mail,
  PauseCircle,
  Phone,
  PlayCircle,
  Shield,
  Sparkles,
  UserCheck,
  UserX,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "~/components";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components";
import { useTranslation } from "~/hooks";
import type { RoleSlug, User } from "~/types/auth.types";

import { ActionCard } from "./ActionCard";
import { DetailRow } from "./DetailRow";
import { DetailSection } from "./DetailSection";
import { TimelineItem } from "./TimelineItem";
import {
  formatDate,
  type ActionType,
  getAvailableActions,
  getInitials,
} from "../utils";

export type UserDetailsTab = "profile" | "roles" | "actions";

export function UserDetailsPanel({
  user,
  userId,
  isLoading,
  onClose,
  onAction,
  availableRoles,
  canManageRoles,
  onAssignRole,
  onRemoveRole,
  drawerTab,
  setDrawerTab,
}: {
  user: User | null;
  userId: number | null;
  isLoading: boolean;
  onClose: () => void;
  onAction: (action: ActionType, user: User) => void;
  availableRoles: Array<{ slug: string; name?: string; description?: string }>;
  canManageRoles: boolean;
  onAssignRole: (roleSlug: string) => void;
  onRemoveRole: (roleSlug: string) => void;
  drawerTab: UserDetailsTab;
  setDrawerTab: (tab: UserDetailsTab) => void;
}) {
  const { t, language } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [roleToAssign, setRoleToAssign] = useState<string>("");

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(t.adminUsers.toasts.copied);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const statusConfig: Record<
    NonNullable<User["account_status"]>,
    {
      gradient: string;
      iconBg: string;
      iconColor: string;
      ringColor: string;
    }
  > = {
    active: {
      gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/15 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      ringColor: "ring-emerald-500/30",
    },
    verified: {
      gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
      iconBg: "bg-amber-500/15 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      ringColor: "ring-amber-500/30",
    },
    pending_verification: {
      gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
      iconBg: "bg-blue-500/15 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      ringColor: "ring-blue-500/30",
    },
    suspended: {
      gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
      iconBg: "bg-rose-500/15 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      ringColor: "ring-rose-500/30",
    },
    rejected: {
      gradient: "from-slate-500/20 via-slate-500/5 to-transparent",
      iconBg: "bg-slate-500/15 dark:bg-slate-500/20",
      iconColor: "text-slate-600 dark:text-slate-400",
      ringColor: "ring-slate-500/30",
    },
  };

  const currentStatus = user?.account_status ? statusConfig[user.account_status] : null;
  const availableActions = user ? getAvailableActions(user.account_status) : [];
  const assignedSlugs = new Set<string>(
    (user?.roles_details?.map((r) => r.slug) ?? user?.roles ?? []).filter(Boolean) as string[]
  );
  const rolesToAdd = (availableRoles || []).filter((r) => !assignedSlugs.has(r.slug));
  const availableRoleNameBySlug = (availableRoles || []).reduce<Record<string, string>>((acc, r) => {
    acc[r.slug] = r.name || r.slug;
    return acc;
  }, {});

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Background avec effet glassmorphism */}
      <div className="absolute inset-0 bg-background" />

      {/* Bordure gauche stylisée */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-babana-cyan/60 via-babana-cyan/20 to-babana-navy/40" />

      {/* Gradient décoratif en haut */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-babana-cyan/8 via-babana-cyan/3 to-transparent dark:from-babana-cyan/12 dark:via-babana-cyan/4 pointer-events-none" />

      {/* Orbes décoratifs */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-babana-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-babana-navy/10 rounded-full blur-2xl pointer-events-none" />

      {/* Contenu principal */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Header Premium */}
        <div className="relative shrink-0 px-6 pt-6 pb-4">
          {/* Bouton fermer */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all duration-200 group"
          >
            <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="flex items-start gap-5">
                <div className="h-20 w-20 rounded-2xl bg-muted/40" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-48 rounded-lg bg-muted/40" />
                  <div className="h-4 w-64 rounded bg-muted/40" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-muted/40" />
                    <div className="h-6 w-16 rounded-full bg-muted/40" />
                  </div>
                </div>
              </div>
            </div>
          ) : !user ? (
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{t.adminUsers.panel.unavailableTitle}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {t.adminUsers.panel.unavailableMessage}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-5">
              {/* Avatar avec effet glow */}
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-2xl bg-linear-to-br ${
                    currentStatus?.gradient || "from-babana-cyan/20"
                  } blur-xl scale-110`}
                />
                <div
                  className={`relative h-20 w-20 rounded-2xl bg-linear-to-br from-babana-cyan to-babana-navy flex items-center justify-center ring-2 ${
                    currentStatus?.ringColor || "ring-babana-cyan/30"
                  } shadow-lg`}
                >
                  <span className="text-2xl font-bold text-white">{getInitials(user.name)}</span>
                  {/* Indicateur de statut */}
                  <div
                    className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg ${
                      currentStatus?.iconBg || "bg-muted"
                    } ring-2 ring-background`}
                  >
                    {user.account_status === "active" ? (
                      <CheckCircle2 className={`h-3.5 w-3.5 ${currentStatus?.iconColor}`} />
                    ) : user.account_status === "verified" ? (
                      <Clock className={`h-3.5 w-3.5 ${currentStatus?.iconColor}`} />
                    ) : user.account_status === "pending_verification" ? (
                      <Mail className={`h-3.5 w-3.5 ${currentStatus?.iconColor}`} />
                    ) : user.account_status === "suspended" ? (
                      <PauseCircle className={`h-3.5 w-3.5 ${currentStatus?.iconColor}`} />
                    ) : (
                      <UserX className={`h-3.5 w-3.5 ${currentStatus?.iconColor}`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Infos principales */}
              <div className="flex-1 min-w-0 pr-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground truncate">{user.name}</h2>
                  <Badge variant="outline" className="rounded-lg bg-muted/40 border-border/50 text-xs font-mono">
                    #{userId ?? user.id}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-sm truncate">{user.email}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user.email, "email")}
                    className="p-1 hover:bg-muted/50 rounded transition-colors"
                  >
                    <Copy className={`h-3 w-3 ${copiedField === "email" ? "text-emerald-500" : ""}`} />
                  </button>
                </div>

                {/* Rôles */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(user.roles || []).map((role) => (
                    <Badge
                      key={role}
                      className="rounded-lg bg-babana-cyan/10 dark:bg-babana-cyan/15 text-babana-navy dark:text-babana-cyan border-babana-cyan/20 hover:bg-babana-cyan/20 transition-colors"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {t.roles?.[role]?.name || availableRoleNameBySlug[role] || role}
                    </Badge>
                  ))}
                  {!(user.roles || []).length && (
                    <span className="text-xs text-muted-foreground italic">{t.adminUsers.roles.noneAssigned}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Banner */}
          {user && currentStatus && (
            <div
              className={`mt-5 p-4 rounded-2xl bg-linear-to-r ${currentStatus.gradient} border border-current/10 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
              <div className="relative flex items-center gap-3">
                <div className={`p-2 rounded-xl ${currentStatus.iconBg}`}>
                  <Activity className={`h-4 w-4 ${currentStatus.iconColor}`} />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${currentStatus.iconColor}`}>
                    {t.adminUsers.status[user.account_status]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.adminUsers.statusDescriptions[user.account_status]}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          {user && (
            <div className="mt-5">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/40">
                {[
                  { id: "profile" as const, label: t.adminUsers.drawer.tabs.profile, icon: Eye },
                  { id: "roles" as const, label: t.adminUsers.drawer.tabs.roles, icon: Key },
                  { id: "actions" as const, label: t.adminUsers.drawer.tabs.actions, icon: Zap },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDrawerTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      drawerTab === tab.id
                        ? "bg-background text-foreground shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contenu scrollable */}
        <ScrollArea className="flex-1">
          <div className="px-6 pb-6">
            {isLoading ? (
              <div className="space-y-4 animate-pulse mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-2xl border border-border/40 bg-card/50">
                    <div className="h-5 w-32 bg-muted/40 rounded mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted/40 rounded" />
                      <div className="h-4 w-3/4 bg-muted/40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : user ? (
              <div className="space-y-5 mt-2">
                {/* Tab: Profil */}
                {drawerTab === "profile" && (
                  <div className="space-y-4">
                    <DetailSection title={t.adminUsers.panel.sections.contact} icon={Mail}>
                      <div className="space-y-3">
                        <DetailRow
                          icon={Mail}
                          label={t.adminUsers.fields.email}
                          value={user.email}
                          copiable
                          onCopy={(v) => copyToClipboard(v, "email2")}
                          copied={copiedField === "email2"}
                        />
                        <DetailRow
                          icon={Phone}
                          label={t.adminUsers.fields.phone}
                          value={user.personal_phone || t.adminUsers.fields.notProvided}
                          copiable={!!user.personal_phone}
                          onCopy={(v) => copyToClipboard(v, "phone")}
                          copied={copiedField === "phone"}
                        />
                        <DetailRow
                          icon={IdCard}
                          label={t.adminUsers.fields.camtelLogin}
                          value={user.camtel_login || t.adminUsers.fields.notProvided}
                          copiable={!!user.camtel_login}
                          onCopy={(v) => copyToClipboard(v, "camtel")}
                          copied={copiedField === "camtel"}
                        />
                      </div>
                    </DetailSection>

                    <DetailSection title={t.adminUsers.panel.sections.account} icon={Fingerprint}>
                      <div className="space-y-3">
                        <DetailRow
                          icon={Calendar}
                          label={t.adminUsers.fields.createdAt}
                          value={formatDate(user.created_at, language)}
                        />
                        <DetailRow
                          icon={BadgeCheck}
                          label={t.adminUsers.fields.emailVerified}
                          value={
                            user.email_verified_at
                              ? formatDate(user.email_verified_at, language)
                              : t.adminUsers.fields.notVerified
                          }
                          valueClassName={!user.email_verified_at ? "text-amber-600 dark:text-amber-400" : ""}
                        />
                        {user.activated_at && (
                          <DetailRow
                            icon={CheckCircle2}
                            label={t.adminUsers.fields.activatedAt}
                            value={formatDate(user.activated_at, language)}
                          />
                        )}
                        {user.activator && (
                          <DetailRow icon={UserCheck} label={t.adminUsers.fields.activatedBy} value={user.activator.name} />
                        )}
                      </div>
                    </DetailSection>

                    <DetailSection title={t.adminUsers.panel.sections.history} icon={Activity}>
                      <div className="relative pl-4">
                        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-linear-to-b from-babana-cyan/40 via-babana-cyan/20 to-transparent rounded-full" />
                        <div className="space-y-4">
                          <TimelineItem
                            date={user.created_at}
                            title={t.adminUsers.history.accountCreated}
                            description={t.adminUsers.history.accountCreatedDesc}
                            variant="cyan"
                          />
                          {user.email_verified_at && (
                            <TimelineItem
                              date={user.email_verified_at}
                              title={t.adminUsers.history.emailVerified}
                              description={t.adminUsers.history.emailVerifiedDesc}
                              variant="green"
                            />
                          )}
                          {user.activated_at && (
                            <TimelineItem
                              date={user.activated_at}
                              title={t.adminUsers.history.accountActivated}
                              description={
                                user.activator
                                  ? `${t.adminUsers.history.by} ${user.activator.name}`
                                  : t.adminUsers.history.byAdmin
                              }
                              variant="emerald"
                            />
                          )}
                          {user.account_status === "suspended" && (
                            <TimelineItem
                              date={user.updated_at}
                              title={t.adminUsers.history.accountSuspended}
                              description={t.adminUsers.history.accountSuspendedDesc}
                              variant="red"
                            />
                          )}
                          {user.account_status === "rejected" && (
                            <TimelineItem
                              date={user.updated_at}
                              title={t.adminUsers.history.accountRejected}
                              description={user.rejection_reason || t.adminUsers.history.accountRejectedDesc}
                              variant="slate"
                            />
                          )}
                        </div>
                      </div>
                    </DetailSection>
                  </div>
                )}

                {/* Tab: Rôles & Permissions */}
                {drawerTab === "roles" && (
                  <div className="space-y-4">
                    {canManageRoles ? (
                      <DetailSection title={t.adminUsers.roles.manageTitle} icon={Key}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground mb-2">{t.adminUsers.roles.assignLabel}</div>
                            <Select value={roleToAssign} onValueChange={setRoleToAssign}>
                              <SelectTrigger>
                                <SelectValue placeholder={t.adminUsers.roles.choosePlaceholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {rolesToAdd.length ? (
                                  rolesToAdd.map((r) => (
                                    <SelectItem key={r.slug} value={r.slug}>
                                      {t.roles?.[r.slug]?.name || r.name || r.slug}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="__none__" disabled>
                                    {t.adminUsers.roles.noRoleAvailable}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            className="bg-babana-cyan hover:bg-babana-cyan-dark text-babana-navy"
                            disabled={!user || !roleToAssign || roleToAssign === "__none__"}
                            onClick={() => {
                              if (!roleToAssign || roleToAssign === "__none__") return;
                              onAssignRole(roleToAssign);
                              setRoleToAssign("");
                            }}
                          >
                            {t.adminUsers.roles.assignButton}
                          </Button>
                        </div>
                      </DetailSection>
                    ) : null}

                    <DetailSection title={t.adminUsers.roles.assignedTitle} icon={Shield}>
                      {(user.roles_details?.length || user.roles?.length || 0) > 0 ? (
                        <div className="grid gap-3">
                          {(user.roles_details?.length ? user.roles_details : user.roles).map((role: any) => (
                            <div
                              key={typeof role === "string" ? role : role.slug}
                              className="group flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-babana-cyan/5 to-transparent border border-babana-cyan/15 hover:border-babana-cyan/30 hover:from-babana-cyan/10 transition-all duration-200"
                            >
                              <div className="p-3 rounded-xl bg-babana-cyan/10 dark:bg-babana-cyan/15 group-hover:bg-babana-cyan/20 transition-colors">
                                <Shield className="h-5 w-5 text-babana-cyan" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-foreground">
                                  {typeof role === "string"
                                    ? t.roles?.[role]?.name || role
                                    : t.roles?.[role.slug]?.name || role.name || role.slug}
                                </div>
                                <div className="text-sm text-muted-foreground mt-0.5">
                                  {typeof role === "string"
                                    ? t.roles?.[role]?.description || ""
                                    : t.roles?.[role.slug]?.description || role.description || ""}
                                </div>
                              </div>
                              {canManageRoles ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="shrink-0"
                                  onClick={() => onRemoveRole(typeof role === "string" ? role : role.slug)}
                                >
                                  {t.adminUsers.roles.removeButton}
                                </Button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-6 rounded-xl border border-dashed border-border/60 bg-muted/10">
                          <div className="p-3 rounded-xl bg-muted/30">
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{t.adminUsers.roles.noneTitle}</div>
                            <div className="text-sm text-muted-foreground">{t.adminUsers.roles.noneDesc}</div>
                          </div>
                        </div>
                      )}
                    </DetailSection>

                    {user.permissions && user.permissions.length > 0 && (
                      <DetailSection title="Permissions directes" icon={Key}>
                        <div className="flex flex-wrap gap-2">
                          {user.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="rounded-lg bg-muted/30 border-border/50">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </DetailSection>
                    )}
                  </div>
                )}

                {/* Tab: Actions */}
                {drawerTab === "actions" && (
                  <div className="space-y-4">
                    <DetailSection title={t.adminUsers.panel.sections.actions} icon={Zap}>
                      {availableActions.length > 0 ? (
                        <div className="grid gap-3">
                          {availableActions.includes("activate") && (
                            <ActionCard
                              icon={PlayCircle}
                              title={t.adminUsers.actions.activateTitle}
                              description={t.adminUsers.actions.activateDesc}
                              variant="success"
                              onClick={() => onAction("activate", user)}
                            />
                          )}
                          {availableActions.includes("reactivate") && (
                            <ActionCard
                              icon={UserCheck}
                              title={t.adminUsers.actions.reactivateTitle}
                              description={t.adminUsers.actions.reactivateDesc}
                              variant="cyan"
                              onClick={() => onAction("reactivate", user)}
                            />
                          )}
                          {availableActions.includes("suspend") && (
                            <ActionCard
                              icon={PauseCircle}
                              title={t.adminUsers.actions.suspendTitle}
                              description={t.adminUsers.actions.suspendDesc}
                              variant="warning"
                              onClick={() => onAction("suspend", user)}
                            />
                          )}
                          {availableActions.includes("reject") && (
                            <ActionCard
                              icon={UserX}
                              title={t.adminUsers.actions.rejectTitle}
                              description={t.adminUsers.actions.rejectDesc}
                              variant="danger"
                              onClick={() => onAction("reject", user)}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-6 rounded-xl border border-dashed border-border/60 bg-muted/10">
                          <div className="p-3 rounded-xl bg-muted/30">
                            <Sparkles className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{t.adminUsers.actions.noneTitle}</div>
                            <div className="text-sm text-muted-foreground">{t.adminUsers.actions.noneDesc}</div>
                          </div>
                        </div>
                      )}
                    </DetailSection>

                    {user.rejection_reason && (
                      <DetailSection title={t.adminUsers.actions.rejectionReasonTitle} icon={AlertCircle}>
                        <div className="p-4 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                            <div className="text-sm text-foreground">{user.rejection_reason}</div>
                          </div>
                        </div>
                      </DetailSection>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}


