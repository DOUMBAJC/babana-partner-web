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
  Search,
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
import { Input } from "~/components/ui/input";
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
  availableCamtelLogins,
  canManageRoles,
  onAssignRole,
  onRemoveRole,
  onAssignCamtelLogin,
  onRemoveCamtelLogin,
  drawerTab,
  setDrawerTab,
}: {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  onClose: () => void;
  onAction: (action: ActionType, user: User) => void;
  availableRoles: Array<{ slug: string; name?: string; description?: string }>;
  availableCamtelLogins: Array<{ id: string; value?: string | null; owner_name?: string | null }>;
  canManageRoles: boolean;
  onAssignRole: (roleSlug: string) => void;
  onRemoveRole: (roleSlug: string) => void;
  onAssignCamtelLogin: (camtelLoginId: string) => void;
  onRemoveCamtelLogin: () => void;
  drawerTab: UserDetailsTab;
  setDrawerTab: (tab: UserDetailsTab) => void;
}) {
  const { t, language } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [roleToAssign, setRoleToAssign] = useState<string>("");
  const [roleSearch, setRoleSearch] = useState("");
  const [camtelLoginToAssign, setCamtelLoginToAssign] = useState<string>("");
  const [camtelLoginSearch, setCamtelLoginSearch] = useState("");

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
  const filteredRolesToAdd = roleSearch.trim()
    ? rolesToAdd.filter((r) => {
        const q = roleSearch.trim().toLowerCase();
        const label = (t.roles?.[r.slug]?.name || r.name || r.slug || "").toLowerCase();
        const desc = (t.roles?.[r.slug]?.description || r.description || "").toLowerCase();
        return `${label} ${desc} ${r.slug}`.includes(q);
      })
    : rolesToAdd;
  const availableRoleNameBySlug = (availableRoles || []).reduce<Record<string, string>>((acc, r) => {
    acc[r.slug] = r.name || r.slug;
    return acc;
  }, {});

  // Le backend peut exposer le login CAMTEL sous plusieurs formes:
  // - `camtelLogin`: objet relationnel
  // - `camtel_login`: parfois string, parfois objet (selon serializer)
  const camtelObj =
    (user?.camtelLogin && typeof user.camtelLogin === "object" ? user.camtelLogin : null) ||
    ((user as any)?.camtel_login && typeof (user as any).camtel_login === "object" ? ((user as any).camtel_login as any) : null);

  const currentCamtelLoginId =
    (camtelObj?.id ? String(camtelObj.id) : null) ?? user?.camtel_login_id ?? null;

  const currentCamtelValue =
    (typeof camtelObj?.value === "string" ? camtelObj.value : null) ||
    (typeof camtelObj?.login === "string" ? camtelObj.login : null) ||
    (typeof user?.camtel_login === "string" ? user.camtel_login : null) ||
    null;

  const currentCamtelOwner =
    (typeof camtelObj?.owner_name === "string" ? camtelObj.owner_name : null) ||
    (typeof camtelObj?.ownerName === "string" ? camtelObj.ownerName : null) ||
    null;
  const camtelLoginsToAdd = (availableCamtelLogins || []).filter((l) => l.id && l.id !== currentCamtelLoginId);
  const filteredCamtelLoginsToAdd = camtelLoginSearch.trim()
    ? camtelLoginsToAdd.filter((l) => {
        const q = camtelLoginSearch.trim().toLowerCase();
        const hay = `${l.value ?? ""} ${l.owner_name ?? ""} ${l.id}`.toLowerCase();
        return hay.includes(q);
      })
    : camtelLoginsToAdd;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* Header (style AcceptDialog) */}
      <div className="relative shrink-0 bg-linear-to-br from-babana-cyan via-emerald-600 to-babana-navy p-8 pb-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-3 rounded-2xl bg-white/15 hover:bg-white/25 border-2 border-white/20 backdrop-blur-sm transition-all duration-200"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="relative flex items-start gap-4">
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
              <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 pt-2 min-w-0">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-8 w-64 rounded-lg bg-white/20 animate-pulse" />
                <div className="h-5 w-80 rounded bg-white/15 animate-pulse" />
              </div>
            ) : !user ? (
              <div>
                <div className="text-2xl font-black text-white tracking-tight">{t.adminUsers.panel.unavailableTitle}</div>
                <div className="text-emerald-100 text-sm font-medium mt-1">{t.adminUsers.panel.unavailableMessage}</div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-3xl font-black text-white tracking-tight truncate">{user.name}</h2>
                  <Badge className="rounded-xl bg-white/15 text-white border-2 border-white/20 font-mono">
                    #{userId ?? user.id}
                  </Badge>
                </div>
                <p className="text-emerald-100 text-lg font-medium truncate">{user.email}</p>
              </>
            )}
          </div>

          <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
        </div>

        {/* Status + Tabs */}
        {user && currentStatus ? (
          <div className="relative mt-6 rounded-2xl bg-white/10 border-2 border-white/15 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{t.adminUsers.status[user.account_status]}</div>
                <div className="text-xs text-emerald-100 truncate">{t.adminUsers.statusDescriptions[user.account_status]}</div>
              </div>
            </div>
          </div>
        ) : null}

        {user ? (
          <div className="relative mt-5">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/10 border-2 border-white/15 backdrop-blur-sm">
              {[
                { id: "profile" as const, label: t.adminUsers.drawer.tabs.profile, icon: Eye },
                { id: "roles" as const, label: t.adminUsers.drawer.tabs.roles, icon: Key },
                { id: "actions" as const, label: t.adminUsers.drawer.tabs.actions, icon: Zap },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDrawerTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    drawerTab === tab.id ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Contenu scrollable */}
      <ScrollArea className="flex-1">
        <div className="px-8 py-6">
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
                          value={currentCamtelValue || t.adminUsers.fields.notProvided}
                          copiable={!!currentCamtelValue}
                          onCopy={(v) => copyToClipboard(v, "camtel")}
                          copied={copiedField === "camtel"}
                        />
                      </div>
                    </DetailSection>

                    {/* Gestion CAMTEL login (assign / remove) */}
                    {(canManageRoles || currentCamtelValue) && (
                      <DetailSection title="CAMTEL" icon={Key}>
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <DetailRow
                              icon={IdCard}
                              label={t.adminUsers.fields.camtelLogin}
                              value={currentCamtelValue || t.adminUsers.fields.notProvided}
                              copiable={!!currentCamtelValue}
                              onCopy={(v) => copyToClipboard(v, "camtel2")}
                              copied={copiedField === "camtel2"}
                            />
                            <DetailRow
                              icon={Users}
                              label="Propriétaire"
                              value={currentCamtelOwner || "—"}
                              copiable={!!currentCamtelOwner}
                              onCopy={(v) => copyToClipboard(v, "camtelOwner")}
                              copied={copiedField === "camtelOwner"}
                            />
                          </div>

                          {canManageRoles ? (
                            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
                              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Assigner un login CAMTEL
                              </div>
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-1">
                                  <Select
                                    value={camtelLoginToAssign}
                                    onValueChange={setCamtelLoginToAssign}
                                    onOpenChange={(open) => {
                                      if (!open) setCamtelLoginSearch("");
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choisir un login…" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                      {/* Recherche locale (sans appel API) */}
                                      <div className="sticky top-0 z-10 -mx-2 -mt-2 mb-2 p-2 bg-popover/95 backdrop-blur-xl border-b border-border/60">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input
                                            value={camtelLoginSearch}
                                            onChange={(e) => setCamtelLoginSearch(e.target.value)}
                                            placeholder="Rechercher un login…"
                                            className="h-10 pl-9"
                                            onKeyDown={(e) => e.stopPropagation()}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      </div>

                                      {filteredCamtelLoginsToAdd.length ? (
                                        filteredCamtelLoginsToAdd.map((l) => (
                                          <SelectItem key={l.id} value={String(l.id)}>
                                            {l.value || `#${l.id}`} {l.owner_name ? `• ${l.owner_name}` : ""}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem value="__none__" disabled>
                                          Aucun résultat
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  type="button"
                                  className="bg-babana-cyan hover:bg-babana-cyan-dark text-babana-navy"
                                  disabled={
                                    !user || !camtelLoginToAssign || camtelLoginToAssign === "__none__" || isLoading
                                  }
                                  onClick={() => {
                                    if (!camtelLoginToAssign || camtelLoginToAssign === "__none__") return;
                                    onAssignCamtelLogin(camtelLoginToAssign);
                                    setCamtelLoginToAssign("");
                                  }}
                                >
                                  {t.adminUsers.roles.assignButton}
                                </Button>
                              </div>

                              <div className="flex items-center justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={!user || !currentCamtelLoginId || isLoading}
                                  onClick={() => onRemoveCamtelLogin()}
                                >
                                  {t.adminUsers.roles.removeButton}
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </DetailSection>
                    )}

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
                            <Select
                              value={roleToAssign}
                              onValueChange={setRoleToAssign}
                              onOpenChange={(open) => {
                                if (!open) setRoleSearch("");
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t.adminUsers.roles.choosePlaceholder} />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {/* Recherche locale (sans appel API) */}
                                <div className="sticky top-0 z-10 -mx-2 -mt-2 mb-2 p-2 bg-popover/95 backdrop-blur-xl border-b border-border/60">
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      value={roleSearch}
                                      onChange={(e) => setRoleSearch(e.target.value)}
                                      placeholder="Rechercher un rôle…"
                                      className="h-10 pl-9"
                                      onKeyDown={(e) => e.stopPropagation()}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>

                                {filteredRolesToAdd.length ? (
                                  filteredRolesToAdd.map((r) => (
                                    <SelectItem key={r.slug} value={r.slug}>
                                      {t.roles?.[r.slug]?.name || r.name || r.slug}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="__none__" disabled>
                                    {roleSearch.trim() ? "Aucun résultat" : t.adminUsers.roles.noRoleAvailable}
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

      {/* Footer (style AcceptDialog) */}
      <div className="shrink-0 flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-12 px-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
        >
          {t.actions.cancel}
        </Button>
      </div>
    </div>
  );
}


