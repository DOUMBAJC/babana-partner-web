import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  BadgeCheck,
  Calendar,
  Copy,
  Eye,
  Fingerprint,
  Key,
  Shield,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";

import { Badge, Button } from "~/components";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useTranslation } from "~/hooks";

import type { CamtelLogin } from "../types";
import { formatDate, getInitials } from "../utils";
import { ActionCard } from "./ActionCard";
import { DetailRow } from "./DetailRow";
import { DetailSection } from "./DetailSection";
import { TimelineItem } from "./TimelineItem";

export type CamtelLoginDetailsTab = "details" | "actions";

export function CamtelLoginDetailsPanel({
  login,
  loginId,
  isLoading,
  onClose,
  onRevealPassword,
  onEdit,
  onDelete,
  drawerTab,
  setDrawerTab,
}: {
  login: CamtelLogin | null;
  loginId: string | null;
  isLoading: boolean;
  onClose: () => void;
  onRevealPassword: () => void;
  onEdit: () => void;
  onDelete: () => void;
  drawerTab: CamtelLoginDetailsTab;
  setDrawerTab: (tab: CamtelLoginDetailsTab) => void;
}) {
  const { t, language } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const displayLogin = useMemo(() => {
    const v = (login?.value || "").trim();
    if (v) return v;
    const anyLogin = (login as any)?.login || (login as any)?.username || (login as any)?.identifier || (login as any)?.camtel_login;
    return (typeof anyLogin === "string" && anyLogin.trim()) || "—";
  }, [login]);

  const displayLabel = useMemo(() => {
    const v = (login?.owner_name || "").trim();
    if (v) return v;
    const anyLabel = (login as any)?.label || (login as any)?.name || (login as any)?.title;
    return (typeof anyLabel === "string" && anyLabel.trim()) || "—";
  }, [login]);

  const camtelCreatedAt =
    (login?.camtel_created_at as string | null | undefined) ?? (login as any)?.camtelCreatedAt ?? null;

  const createdAt = (login?.created_at as string | null | undefined) ?? (login as any)?.createdAt ?? null;
  const updatedAt = (login?.updated_at as string | null | undefined) ?? (login as any)?.updatedAt ?? null;
  const usersCount =
    typeof login?.users_count === "number"
      ? login.users_count
      : typeof (login as any)?.users_count === "number"
        ? (login as any).users_count
        : null;
  const users = (login?.users as any) || null;

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(t.adminCamtelLogins.toasts.copied);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Header premium (même vibe que AcceptDialog/EditDialog) */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-babana-cyan via-babana-blue to-babana-navy" />
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>

          <div className="relative px-6 pt-6 pb-8">
            <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all duration-200 group backdrop-blur-sm"
            >
              <X className="h-4 w-4 text-white/90 group-hover:text-white transition-colors" />
            </button>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="flex items-start gap-5">
                <div className="h-20 w-20 rounded-2xl bg-white/20" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-48 rounded-lg bg-white/20" />
                  <div className="h-4 w-64 rounded bg-white/15" />
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-white/15" />
                    <div className="h-6 w-16 rounded-full bg-white/15" />
                  </div>
                </div>
              </div>
            </div>
          ) : !login ? (
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm">
              <div className="p-3 rounded-xl bg-white/15 border border-white/20">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">{t.adminCamtelLogins.panel.unavailableTitle}</div>
                <div className="text-sm text-white/80 mt-0.5">{t.adminCamtelLogins.panel.unavailableMessage}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-5">
              <div className="shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
                  <div className="relative h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-sm border-2 border-white/30 shadow-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{getInitials(displayLogin)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-black text-white truncate">{displayLogin}</h2>
                  <Badge variant="outline" className="rounded-lg bg-white/10 border-white/25 text-xs font-mono text-white">
                    #{loginId ?? login.id}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-2 text-white/90">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium truncate">{displayLabel}</span>
                  {displayLabel !== "—" ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(displayLabel, "label")}
                      className="p-1 hover:bg-white/15 rounded transition-colors"
                    >
                      <Copy className={`h-3.5 w-3.5 ${copiedField === "label" ? "text-emerald-200" : "text-white/80"}`} />
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge className="rounded-lg bg-white/15 text-white border-white/20 hover:bg-white/20 transition-colors">
                    <Shield className="h-3 w-3 mr-1" />
                    {t.adminCamtelLogins.badges.camtel}
                  </Badge>
                  {typeof usersCount === "number" ? (
                    <Badge variant="outline" className="rounded-lg bg-white/10 border-white/25 text-xs text-white">
                      <Users className="h-3 w-3 mr-1" />
                      {t.adminCamtelLogins.badges.usersCount.replace("{count}", String(usersCount))}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {login && (
            <div className="mt-5">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                {[
                  { id: "details" as const, label: t.adminCamtelLogins.drawer.tabs.details, icon: Eye },
                  { id: "actions" as const, label: t.adminCamtelLogins.drawer.tabs.actions, icon: Key },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDrawerTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      drawerTab === tab.id
                        ? "bg-white/20 text-white shadow-sm border border-white/25"
                        : "text-white/80 hover:text-white hover:bg-white/15"
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
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 pb-6 pt-6 bg-white dark:bg-slate-900">
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
            ) : login ? (
              <div className="space-y-5 mt-2">
                {drawerTab === "details" && (
                  <div className="space-y-4">
                    <DetailSection title={t.adminCamtelLogins.panel.sections.main} icon={Fingerprint}>
                      <div className="space-y-3">
                        <DetailRow
                          icon={Fingerprint}
                          label={t.adminCamtelLogins.fields.login}
                          value={displayLogin}
                          copiable={displayLogin !== "—"}
                          onCopy={(v) => copyToClipboard(v, "login")}
                          copied={copiedField === "login"}
                        />
                        <DetailRow
                          icon={User}
                          label={t.adminCamtelLogins.fields.label}
                          value={displayLabel}
                          copiable={displayLabel !== "—"}
                          onCopy={(v) => copyToClipboard(v, "label2")}
                          copied={copiedField === "label2"}
                        />
                        <DetailRow
                          icon={BadgeCheck}
                          label={t.adminCamtelLogins.fields.camtelCreatedAt}
                          value={camtelCreatedAt ? formatDate(camtelCreatedAt, language) : "—"}
                        />
                      </div>
                    </DetailSection>

                    <DetailSection title={t.adminCamtelLogins.panel.sections.users} icon={Users}>
                      {Array.isArray(users) && users.length ? (
                        <div className="space-y-2">
                          {users.map((u: any) => (
                            <div
                              key={u.id}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/40"
                            >
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">{u.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                              </div>
                              <Badge variant="outline" className="text-xs font-mono">
                                #{u.id}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">{t.adminCamtelLogins.users.empty}</div>
                      )}
                    </DetailSection>

                    <DetailSection title={t.adminCamtelLogins.panel.sections.history} icon={Calendar}>
                      <div className="relative pl-4">
                        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-linear-to-b from-babana-cyan/40 via-babana-cyan/20 to-transparent rounded-full" />
                        <div className="space-y-4">
                          {createdAt ? (
                            <TimelineItem
                              date={createdAt}
                              title={t.adminCamtelLogins.history.created}
                              description={t.adminCamtelLogins.history.createdDesc}
                              variant="cyan"
                            />
                          ) : null}
                          {updatedAt ? (
                            <TimelineItem
                              date={updatedAt}
                              title={t.adminCamtelLogins.history.updated}
                              description={t.adminCamtelLogins.history.updatedDesc}
                              variant="emerald"
                            />
                          ) : null}
                          {!createdAt && !updatedAt ? (
                            <div className="text-sm text-muted-foreground">{t.adminCamtelLogins.history.noData}</div>
                          ) : null}
                        </div>
                      </div>
                    </DetailSection>

                    <DetailSection title={t.adminCamtelLogins.panel.sections.meta} icon={Calendar}>
                      <div className="space-y-3">
                        <DetailRow
                          icon={Calendar}
                          label={t.adminCamtelLogins.fields.createdAt}
                          value={createdAt ? formatDate(createdAt, language) : "—"}
                        />
                        <DetailRow
                          icon={Calendar}
                          label={t.adminCamtelLogins.fields.updatedAt}
                          value={updatedAt ? formatDate(updatedAt, language) : "—"}
                        />
                      </div>
                    </DetailSection>
                  </div>
                )}

                {drawerTab === "actions" && (
                  <div className="space-y-4">
                    <DetailSection title={t.adminCamtelLogins.panel.sections.actions} icon={Key}>
                      <div className="grid gap-3">
                        <ActionCard
                          icon={Eye}
                          title={t.adminCamtelLogins.actions.revealPasswordTitle}
                          description={t.adminCamtelLogins.actions.revealPasswordDesc}
                          variant="cyan"
                          onClick={onRevealPassword}
                        />
                        <ActionCard
                          icon={Key}
                          title={t.adminCamtelLogins.actions.editTitle}
                          description={t.adminCamtelLogins.actions.editDesc}
                          variant="success"
                          onClick={onEdit}
                        />
                        <ActionCard
                          icon={Trash2}
                          title={t.adminCamtelLogins.actions.deleteTitle}
                          description={t.adminCamtelLogins.actions.deleteDesc}
                          variant="danger"
                          onClick={onDelete}
                        />
                      </div>
                    </DetailSection>
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


