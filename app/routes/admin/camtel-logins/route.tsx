import { data, useLocation, useNavigate, useNavigation, useRevalidator, useSubmit } from "react-router";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/route";

import type { User } from "~/types/auth.types";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { isAdmin } from "~/lib/permissions";
import { Layout, ProtectedRoute } from "~/components";
import { usePageTitle, useTranslation } from "~/hooks";
import { getTranslations, type Language } from "~/lib/translations";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components";
import { toast } from "sonner";
import { ArrowLeft, Copy, Eye, Key, Loader2, Plus, RefreshCcw, Search, Shield, Slash } from "lucide-react";

import type { CamtelLogin } from "./types";
import { CamtelLoginDetailsPanel, type CamtelLoginDetailsTab } from "./components/CamtelLoginDetailsPanel";
import { formatDate, getInitials, type ActionType } from "./utils";

type LoaderData = {
  user: User | null;
  hasAccess: boolean;
  error: string | null;
  q: string;
  selectedLoginId: number | null;
  logins: CamtelLogin[];
  selectedLogin: CamtelLogin | null;
};

type ActionData = {
  success: boolean;
  message?: string | null;
  error?: string | null;
  actionType?: ActionType;
  loginId?: number;
  password?: string | null;
};

function asNumber(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function unwrapList<T = any>(payload: any): T[] {
  if (!payload) return [];
  const root = payload.data ?? payload;
  if (Array.isArray(root)) return root as T[];
  if (Array.isArray(root?.data)) return root.data as T[];
  if (Array.isArray(root?.data?.data)) return root.data.data as T[];
  if (Array.isArray(payload?.data?.data)) return payload.data.data as T[];
  return [];
}

function unwrapOne(payload: any): any | null {
  if (!payload) return null;
  const root = payload.data ?? payload;
  // On supporte quelques formats classiques Laravel: { data: { camtelLogin: ... } } ou { data: ... }
  return root?.camtelLogin ?? root?.camtel_login ?? root?.login ?? root?.data?.camtelLogin ?? root?.data?.camtel_login ?? root;
}

function normalizeCamtelLoginFromApi(input: any): CamtelLogin {
  const id = Number(input?.id);
  return {
    id: Number.isFinite(id) ? id : 0,
    login:
      input?.login ??
      input?.username ??
      input?.identifier ??
      input?.camtel_login ??
      input?.camtelLogin ??
      null,
    label: input?.label ?? input?.name ?? input?.title ?? null,
    notes: input?.notes ?? input?.description ?? input?.comment ?? null,
    created_at: input?.created_at ?? input?.createdAt ?? null,
    updated_at: input?.updated_at ?? input?.updatedAt ?? null,
  };
}

function normalizeCamtelLoginsFromApi(list: any[]): CamtelLogin[] {
  return (list || [])
    .map((x) => normalizeCamtelLoginFromApi(x))
    .filter((x) => x.id);
}

function unwrapPassword(payload: any): string | null {
  if (!payload) return null;
  const root = payload.data ?? payload;
  const p = root?.password ?? root?.data?.password ?? root?.data?.data?.password ?? root?.plain_password ?? root?.data?.plain_password;
  if (typeof p === "string") return p;
  if (typeof root === "string") return root;
  return null;
}

export async function loader({ request }: Route.LoaderArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  try {
    const user = await getCurrentUser(request);

    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const selectedLoginId = asNumber(url.searchParams.get("loginId"));

    if (!user) {
      return data<LoaderData>({
        user: null,
        hasAccess: false,
        error: null,
        q,
        selectedLoginId,
        logins: [],
        selectedLogin: null,
      });
    }

    if (!isAdmin(user)) {
      return data<LoaderData>({
        user,
        hasAccess: false,
        error: null,
        q,
        selectedLoginId,
        logins: [],
        selectedLogin: null,
      });
    }

    const api = await createAuthenticatedApi(request);
    const listRes = await api.get("/admin/camtel-logins");
    const logins = normalizeCamtelLoginsFromApi(unwrapList<CamtelLogin>(listRes.data));

    let selectedLogin: CamtelLogin | null = null;
    if (selectedLoginId) {
      try {
        const detailsRes = await api.get(`/admin/camtel-logins/${selectedLoginId}`);
        const raw = unwrapOne(detailsRes.data);
        selectedLogin = raw ? normalizeCamtelLoginFromApi(raw) : null;
      } catch {
        selectedLogin = null;
      }
    }

    return data<LoaderData>({
      user,
      hasAccess: true,
      error: null,
      q,
      selectedLoginId,
      logins,
      selectedLogin,
    });
  } catch (error: any) {
    return data<LoaderData>({
      user: null,
      hasAccess: false,
      error: error?.response?.data?.message || error?.message || t.adminCamtelLogins.errors.loadError,
      q: "",
      selectedLoginId: null,
      logins: [],
      selectedLogin: null,
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const actionType = formData.get("actionType") as ActionType | null;
  const loginId = asNumber(formData.get("loginId") as string | null);

  const login = (formData.get("login") as string | null)?.trim() || null;
  const password = (formData.get("password") as string | null) || null;
  // label/notes: on garde la possibilité de "vider" la valeur (string vide) lors d'un update.
  const labelRaw = formData.get("label");
  const notesRaw = formData.get("notes");
  const label = typeof labelRaw === "string" ? labelRaw.trim() : undefined;
  const notes = typeof notesRaw === "string" ? notesRaw.trim() : undefined;

  if (!actionType) {
    return data<ActionData>({ success: false, error: t.adminCamtelLogins.errors.missingParams }, { status: 400 });
  }

  try {
    const user = await getCurrentUser(request);
    if (!isAdmin(user)) {
      return data<ActionData>({ success: false, error: t.adminCamtelLogins.errors.unauthorized }, { status: 403 });
    }

    const api = await createAuthenticatedApi(request);

    switch (actionType) {
      case "create": {
        if (!login || !password) {
          return data<ActionData>(
            { success: false, actionType, error: t.adminCamtelLogins.errors.missingCreateFields },
            { status: 400 }
          );
        }
        const payload: Record<string, any> = {
          login,
          // compat si le backend attend un autre nom de champ
          username: login,
          camtel_login: login,
          password,
        };
        if (label) {
          payload.label = label;
          payload.name = label;
        }
        if (notes) {
          payload.notes = notes;
          payload.description = notes;
        }
        const res = await api.post("/admin/camtel-logins", {
          ...payload,
        });
        return data<ActionData>({
          success: true,
          actionType,
          message: res.data?.message || t.adminCamtelLogins.toasts.created,
        });
      }
      case "update": {
        if (!loginId) {
          return data<ActionData>(
            { success: false, actionType, error: t.adminCamtelLogins.errors.missingParams },
            { status: 400 }
          );
        }
        if (!login && !password && label === undefined && notes === undefined) {
          return data<ActionData>(
            { success: false, actionType, loginId, error: t.adminCamtelLogins.errors.nothingToUpdate },
            { status: 400 }
          );
        }
        const payload: Record<string, any> = {};
        if (login) {
          payload.login = login;
          payload.username = login;
          payload.camtel_login = login;
        }
        if (password) payload.password = password;
        if (label !== undefined) {
          payload.label = label;
          payload.name = label;
        }
        if (notes !== undefined) {
          payload.notes = notes;
          payload.description = notes;
        }

        const res = await api.put(`/admin/camtel-logins/${loginId}`, payload);
        return data<ActionData>({
          success: true,
          actionType,
          loginId,
          message: res.data?.message || t.adminCamtelLogins.toasts.updated,
        });
      }
      case "delete": {
        if (!loginId) {
          return data<ActionData>(
            { success: false, actionType, error: t.adminCamtelLogins.errors.missingParams },
            { status: 400 }
          );
        }
        const res = await api.delete(`/admin/camtel-logins/${loginId}`);
        return data<ActionData>({
          success: true,
          actionType,
          loginId,
          message: res.data?.message || t.adminCamtelLogins.toasts.deleted,
        });
      }
      case "reveal_password": {
        if (!loginId) {
          return data<ActionData>(
            { success: false, actionType, error: t.adminCamtelLogins.errors.missingParams },
            { status: 400 }
          );
        }
        const res = await api.get(`/admin/camtel-logins/${loginId}/password`);
        const pwd = unwrapPassword(res.data);
        return data<ActionData>({
          success: true,
          actionType,
          loginId,
          password: pwd,
          message: res.data?.message || t.adminCamtelLogins.toasts.passwordRevealed,
        });
      }
    }
  } catch (error: any) {
    return data<ActionData>(
      {
        success: false,
        actionType,
        loginId: loginId ?? undefined,
        error: error?.response?.data?.message || error?.message || t.adminCamtelLogins.errors.genericError,
      },
      { status: 500 }
    );
  }
}

export default function AdminCamtelLoginsPage({ loaderData, actionData }: Route.ComponentProps) {
  const { t, language } = useTranslation();
  usePageTitle(t.pages.adminCamtelLogins.title);
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const submit = useSubmit();
  const isRefreshing = revalidator.state === "loading";

  const [qInput, setQInput] = useState(loaderData.q);
  const [drawerTab, setDrawerTab] = useState<CamtelLoginDetailsTab>("details");

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    mode: "create" | "edit";
    loginId: number | null;
    login: string;
    password: string;
    label: string;
    notes: string;
  }>({ open: false, mode: "create", loginId: null, login: "", password: "", label: "", notes: "" });

  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; loginId: number | null; loginLabel: string }>({
    open: false,
    loginId: null,
    loginLabel: "",
  });

  const [passwordDialog, setPasswordDialog] = useState<{ open: boolean; loginId: number | null; password: string | null }>({
    open: false,
    loginId: null,
    password: null,
  });

  useEffect(() => setQInput(loaderData.q), [loaderData.q]);

  const setParam = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value === null || value === "") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (qInput !== loaderData.q) setParam("q", qInput);
    }, 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  const desiredLoginId = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return asNumber(sp.get("loginId"));
  }, [location.search]);

  const isDrawerOpen = desiredLoginId != null;
  const selected =
    desiredLoginId != null && loaderData.selectedLogin?.id === desiredLoginId ? loaderData.selectedLogin : null;

  const isDrawerLoading =
    isDrawerOpen &&
    (navigation.state === "loading" ||
      revalidator.state === "loading" ||
      loaderData.selectedLoginId !== desiredLoginId);

  useEffect(() => {
    if (desiredLoginId != null) setDrawerTab("details");
  }, [desiredLoginId]);

  const filtered = useMemo(() => {
    const q = qInput.trim().toLowerCase();
    return (loaderData.logins || [])
      .filter((l) => {
        if (!q) return true;
        const hay = `${l.login || ""} ${l.label || ""} ${l.notes || ""}`.toLowerCase().trim();
        return hay.includes(q);
      })
      .sort((a, b) => {
        const ad = new Date(a.created_at || "").getTime();
        const bd = new Date(b.created_at || "").getTime();
        return (Number.isFinite(bd) ? bd : 0) - (Number.isFinite(ad) ? ad : 0);
      });
  }, [loaderData.logins, qInput]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData.success) {
      if (actionData.actionType === "reveal_password") {
        setPasswordDialog({ open: true, loginId: actionData.loginId ?? null, password: actionData.password ?? null });
      }
      toast.success(actionData.message || t.adminCamtelLogins.toasts.actionDone);
      // Sync list + drawer
      revalidator.revalidate();
      if (actionData.actionType === "delete" && actionData.loginId) {
        // fermer le panneau si on supprime l’élément affiché
        if (desiredLoginId === actionData.loginId) setParam("loginId", null);
      }
    } else if (actionData.error) {
      toast.error(actionData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  const openLogin = (id: number) => setParam("loginId", String(id));
  const closeLogin = () => setParam("loginId", null);

  const openCreate = () =>
    setFormDialog({ open: true, mode: "create", loginId: null, login: "", password: "", label: "", notes: "" });

  const openEdit = (l: CamtelLogin) =>
    setFormDialog({
      open: true,
      mode: "edit",
      loginId: l.id,
      login: (l.login as any) || "",
      password: "",
      label: (l.label as any) || "",
      notes: (l.notes as any) || "",
    });

  const submitCreateOrUpdate = () => {
    const fd = new FormData();
    fd.set("actionType", formDialog.mode === "create" ? "create" : "update");
    if (formDialog.mode === "edit" && formDialog.loginId) fd.set("loginId", String(formDialog.loginId));
    if (formDialog.login.trim()) fd.set("login", formDialog.login.trim());
    if (formDialog.password) fd.set("password", formDialog.password);
    fd.set("label", formDialog.label);
    fd.set("notes", formDialog.notes);
    setFormDialog((p) => ({ ...p, open: false }));
    submit(fd, { method: "post" });
  };

  const askDelete = (l: CamtelLogin) => {
    const label = (l.login || l.label || `#${l.id}`) as string;
    setConfirmDelete({ open: true, loginId: l.id, loginLabel: label });
  };

  const submitDelete = () => {
    if (!confirmDelete.loginId) return;
    const fd = new FormData();
    fd.set("actionType", "delete");
    fd.set("loginId", String(confirmDelete.loginId));
    setConfirmDelete({ open: false, loginId: null, loginLabel: "" });
    submit(fd, { method: "post" });
  };

  const revealPassword = (id: number) => {
    const fd = new FormData();
    fd.set("actionType", "reveal_password");
    fd.set("loginId", String(id));
    submit(fd, { method: "post" });
  };

  const copyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    toast.success(t.adminCamtelLogins.toasts.copied);
  };

  return (
    <Layout>
      <Toaster />
      <ProtectedRoute role={["admin", "super_admin"]} mode="any">
        <div className="container mx-auto space-y-6 py-8 px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">{t.adminCamtelLogins.breadcrumb.admin}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t.adminCamtelLogins.breadcrumb.camtelLogins}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-babana-cyan/30 to-babana-navy/30 blur-xl" />
                  <div className="relative rounded-2xl border border-babana-cyan/20 bg-card p-3 shadow-sm">
                    <Shield className="h-7 w-7 text-babana-cyan" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.adminCamtelLogins.header.title}</h1>
                  <p className="text-muted-foreground">{t.adminCamtelLogins.header.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.actions.back}
              </Button>
              <Button
                variant="outline"
                onClick={openCreate}
                className="border-babana-cyan/25 hover:border-babana-cyan/45"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.adminCamtelLogins.actions.createButton}
              </Button>
              <Button
                variant="default"
                className="bg-babana-cyan hover:bg-babana-cyan-dark text-babana-navy active:scale-[0.98] transition-transform"
                onClick={() => revalidator.revalidate()}
                disabled={isRefreshing}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? t.common.loading : t.actions.refresh}
              </Button>
            </div>
          </div>

          {loaderData.error && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Slash className="h-5 w-5" />
                  {t.common.error}
                </CardTitle>
                <CardDescription>{loaderData.error}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {!loaderData.hasAccess ? (
            <Card className="border-babana-cyan/20">
              <CardHeader>
                <CardTitle>{t.adminCamtelLogins.accessDenied.title}</CardTitle>
                <CardDescription>{t.adminCamtelLogins.accessDenied.message}</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <>
              <Card className="border-babana-cyan/15 overflow-hidden">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-babana-cyan/10 via-transparent to-babana-navy/10" />
                  <CardContent className="relative p-4 md:p-5 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {t.adminCamtelLogins.stats.total}: <span className="font-semibold ml-1">{loaderData.logins.length}</span>
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-[420px]">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder={t.adminCamtelLogins.search.placeholder}
                            value={qInput}
                            onChange={(e) => setQInput(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <CamtelLoginsTable
                      logins={filtered}
                      selectedLoginId={desiredLoginId}
                      onOpenLogin={openLogin}
                    />
                  </CardContent>
                </div>
              </Card>

              <Dialog open={isDrawerOpen} onOpenChange={(open) => (!open ? closeLogin() : null)}>
                <DialogContent className="left-auto right-0 top-0 translate-x-0 translate-y-0 h-dvh w-[min(680px,100vw)] max-w-none rounded-none p-0 gap-0 overflow-hidden bg-background text-foreground border-l border-border shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200">
                  <CamtelLoginDetailsPanel
                    login={selected}
                    loginId={desiredLoginId}
                    isLoading={isDrawerLoading}
                    onClose={closeLogin}
                    onRevealPassword={() => (desiredLoginId ? revealPassword(desiredLoginId) : null)}
                    onEdit={() => (selected ? openEdit(selected) : null)}
                    onDelete={() => (selected ? askDelete(selected) : null)}
                    drawerTab={drawerTab}
                    setDrawerTab={setDrawerTab}
                  />
                </DialogContent>
              </Dialog>

              {/* Create/Edit dialog */}
              <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog((p) => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-[560px]">
                  <DialogHeader>
                    <DialogTitle>
                      {formDialog.mode === "create" ? t.adminCamtelLogins.form.createTitle : t.adminCamtelLogins.form.editTitle}
                    </DialogTitle>
                    <DialogDescription>{t.adminCamtelLogins.form.subtitle}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login">{t.adminCamtelLogins.fields.login}</Label>
                      <Input
                        id="login"
                        value={formDialog.login}
                        onChange={(e) => setFormDialog((p) => ({ ...p, login: e.target.value }))}
                        placeholder={t.adminCamtelLogins.form.loginPlaceholder}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {t.adminCamtelLogins.fields.password}{" "}
                        {formDialog.mode === "edit" ? (
                          <span className="text-xs text-muted-foreground">({t.adminCamtelLogins.form.passwordOptional})</span>
                        ) : null}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formDialog.password}
                        onChange={(e) => setFormDialog((p) => ({ ...p, password: e.target.value }))}
                        placeholder={t.adminCamtelLogins.form.passwordPlaceholder}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="label">{t.adminCamtelLogins.fields.label}</Label>
                        <Input
                          id="label"
                          value={formDialog.label}
                          onChange={(e) => setFormDialog((p) => ({ ...p, label: e.target.value }))}
                          placeholder={t.adminCamtelLogins.form.labelPlaceholder}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">{t.adminCamtelLogins.fields.notes}</Label>
                        <Textarea
                          id="notes"
                          value={formDialog.notes}
                          onChange={(e) => setFormDialog((p) => ({ ...p, notes: e.target.value }))}
                          placeholder={t.adminCamtelLogins.form.notesPlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setFormDialog((p) => ({ ...p, open: false }))}>
                      {t.actions.cancel}
                    </Button>
                    <Button
                      variant="default"
                      className="bg-babana-cyan hover:bg-babana-cyan-dark text-babana-navy"
                      onClick={submitCreateOrUpdate}
                      disabled={navigation.state !== "idle"}
                    >
                      {navigation.state !== "idle" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                      {formDialog.mode === "create" ? t.adminCamtelLogins.form.createCta : t.adminCamtelLogins.form.saveCta}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete confirm */}
              <Dialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete((p) => ({ ...p, open }))}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.adminCamtelLogins.confirm.deleteTitle}</DialogTitle>
                    <DialogDescription>
                      {t.adminCamtelLogins.confirm.deleteDescription}{" "}
                      <span className="font-medium">{confirmDelete.loginLabel}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setConfirmDelete({ open: false, loginId: null, loginLabel: "" })}>
                      {t.actions.cancel}
                    </Button>
                    <Button variant="destructive" onClick={submitDelete}>
                      {t.actions.delete}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Password dialog */}
              <Dialog open={passwordDialog.open} onOpenChange={(open) => setPasswordDialog((p) => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-[560px]">
                  <DialogHeader>
                    <DialogTitle>{t.adminCamtelLogins.password.title}</DialogTitle>
                    <DialogDescription>{t.adminCamtelLogins.password.subtitle}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3">
                    <div className="rounded-xl border bg-muted/20 p-4">
                      <div className="text-xs text-muted-foreground mb-2">{t.adminCamtelLogins.fields.password}</div>
                      <div className="flex items-center gap-2">
                        <Input readOnly value={passwordDialog.password ?? "—"} />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => (passwordDialog.password ? copyPassword(passwordDialog.password) : null)}
                          disabled={!passwordDialog.password}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {t.adminCamtelLogins.password.copy}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{t.adminCamtelLogins.password.notice}</div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPasswordDialog({ open: false, loginId: null, password: null })}>
                      {t.actions.close}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

function CamtelLoginsTable({
  logins,
  selectedLoginId,
  onOpenLogin,
}: {
  logins: CamtelLogin[];
  selectedLoginId: number | null;
  onOpenLogin: (id: number) => void;
}) {
  const { t, language } = useTranslation();
  const navigation = useNavigation();
  const isDetailsLoading = navigation.state === "loading";

  return (
    <div className="mt-4">
      <div className="rounded-xl border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.adminCamtelLogins.table.login}</TableHead>
              <TableHead>{t.adminCamtelLogins.table.label}</TableHead>
              <TableHead>{t.adminCamtelLogins.table.created}</TableHead>
              <TableHead className="text-right">{t.adminCamtelLogins.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logins.map((l) => {
              const isSelected = selectedLoginId === l.id;
              const isRowLoading = isSelected && isDetailsLoading;
              const loginValue = (l.login || (l as any)?.username || (l as any)?.identifier || "—") as string;
              const labelValue = (l.label || (l as any)?.name || "—") as string;

              return (
                <TableRow
                  key={l.id}
                  data-state={isSelected ? "selected" : undefined}
                  className={`cursor-pointer transition-colors hover:bg-muted/30 ${isRowLoading ? "animate-pulse" : ""}`}
                  onClick={() => onOpenLogin(l.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-babana-cyan/15">
                        <AvatarFallback className="bg-babana-cyan/10 text-babana-navy dark:text-babana-cyan">
                          {getInitials(loginValue)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium leading-tight truncate">{loginValue}</div>
                        <div className="text-sm text-muted-foreground truncate">{labelValue}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[280px]">
                    {labelValue}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate((l.created_at as any) || null, language)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLogin(l.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            {t.adminCamtelLogins.table.view}
                            {isRowLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t.adminCamtelLogins.table.openTooltip}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}

            {!logins.length ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  <div className="mx-auto max-w-md space-y-2">
                    <div className="text-base font-semibold">{t.adminCamtelLogins.table.emptyTitle}</div>
                    <div className="text-sm text-muted-foreground">{t.adminCamtelLogins.table.emptyMessage}</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


