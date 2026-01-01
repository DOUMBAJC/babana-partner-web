import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Calendar,
  Copy,
  Eye,
  Fingerprint,
  Key,
  Shield,
  Trash2,
  User,
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
  loginId: number | null;
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
    const v = (login?.login || "").trim();
    if (v) return v;
    // fallback “robuste” si l’API renvoie un champ différent
    const anyLogin = (login as any)?.username || (login as any)?.identifier || (login as any)?.camtel_login;
    return (typeof anyLogin === "string" && anyLogin.trim()) || "—";
  }, [login]);

  const displayLabel = useMemo(() => {
    const v = (login?.label || "").trim();
    if (v) return v;
    const anyLabel = (login as any)?.name || (login as any)?.title;
    return (typeof anyLabel === "string" && anyLabel.trim()) || "—";
  }, [login]);

  const displayNotes = useMemo(() => {
    const v = (login?.notes || "").trim();
    if (v) return v;
    const anyNotes = (login as any)?.description || (login as any)?.comment;
    return (typeof anyNotes === "string" && anyNotes.trim()) || "—";
  }, [login]);

  const createdAt = (login?.created_at as string | null | undefined) ?? (login as any)?.createdAt ?? null;
  const updatedAt = (login?.updated_at as string | null | undefined) ?? (login as any)?.updatedAt ?? null;

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(t.adminCamtelLogins.toasts.copied);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-babana-cyan/60 via-babana-cyan/20 to-babana-navy/40" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-babana-cyan/8 via-babana-cyan/3 to-transparent dark:from-babana-cyan/12 dark:via-babana-cyan/4 pointer-events-none" />
      <div className="absolute top-20 right-10 w-32 h-32 bg-babana-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-24 h-24 bg-babana-navy/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="relative shrink-0 px-6 pt-6 pb-4">
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
          ) : !login ? (
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{t.adminCamtelLogins.panel.unavailableTitle}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{t.adminCamtelLogins.panel.unavailableMessage}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-babana-cyan/20 via-babana-cyan/5 to-transparent blur-xl scale-110" />
                <div className="relative h-20 w-20 rounded-2xl bg-linear-to-br from-babana-cyan to-babana-navy flex items-center justify-center ring-2 ring-babana-cyan/30 shadow-lg">
                  <span className="text-2xl font-bold text-white">{getInitials(displayLogin)}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground truncate">{displayLogin}</h2>
                  <Badge variant="outline" className="rounded-lg bg-muted/40 border-border/50 text-xs font-mono">
                    #{loginId ?? login.id}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span className="text-sm truncate">{displayLabel}</span>
                  {displayLabel !== "—" ? (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(displayLabel, "label")}
                      className="p-1 hover:bg-muted/50 rounded transition-colors"
                    >
                      <Copy className={`h-3 w-3 ${copiedField === "label" ? "text-emerald-500" : ""}`} />
                    </button>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  <Badge className="rounded-lg bg-babana-cyan/10 dark:bg-babana-cyan/15 text-babana-navy dark:text-babana-cyan border-babana-cyan/20 hover:bg-babana-cyan/20 transition-colors">
                    <Shield className="h-3 w-3 mr-1" />
                    {t.adminCamtelLogins.badges.camtel}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {login && (
            <div className="mt-5">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/40">
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
                      </div>
                    </DetailSection>

                    <DetailSection title={t.adminCamtelLogins.panel.sections.notes} icon={Eye}>
                      <div className="space-y-3">
                        <DetailRow
                          icon={Eye}
                          label={t.adminCamtelLogins.fields.notes}
                          value={displayNotes}
                          copiable={displayNotes !== "—"}
                          onCopy={(v) => copyToClipboard(v, "notes")}
                          copied={copiedField === "notes"}
                        />
                      </div>
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


