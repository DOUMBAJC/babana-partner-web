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
import { ArrowLeft, Copy, Eye, Key, Loader2, Plus, RefreshCcw, Search, Shield, Slash, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
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

function extractPaginationMeta(payload: any): {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
} {
  // Support multiple API response formats
  const meta = 
    payload?.meta ?? 
    payload?.data?.meta ?? 
    payload?.pagination ?? 
    payload?.data?.pagination ?? 
    {};
  
  const currentPage = Number(meta?.current_page ?? meta?.currentPage ?? meta?.page ?? 1);
  const perPage = Number(meta?.per_page ?? meta?.perPage ?? meta?.limit ?? meta?.pageSize ?? 15);
  const total = Number(meta?.total ?? meta?.totalItems ?? meta?.count ?? 0);
  const totalPages = Number(meta?.last_page ?? meta?.lastPage ?? meta?.totalPages ?? Math.ceil(total / perPage));
  
  return {
    currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : 15,
    total: Number.isFinite(total) && total >= 0 ? total : 0,
    totalPages: Number.isFinite(totalPages) && totalPages >= 0 ? totalPages : 0,
  };
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
    // Backend (controller): owner_name, value, camtel_created_at, users_count
    value:
      input?.value ??
      input?.login ??
      input?.username ??
      input?.identifier ??
      input?.camtel_login ??
      input?.camtelLogin ??
      null,
    owner_name: input?.owner_name ?? input?.ownerName ?? input?.label ?? input?.name ?? null,
    camtel_created_at: input?.camtel_created_at ?? input?.camtelCreatedAt ?? null,
    users_count: typeof input?.users_count === "number" ? input.users_count : null,
    users: Array.isArray(input?.users) ? input.users : null,
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
    const page = Math.max(1, asNumber(url.searchParams.get("page")) || 1);
    const perPage = Math.max(1, Math.min(100, asNumber(url.searchParams.get("perPage")) || 15));

    if (!user) {
      return data<LoaderData>({
        user: null,
        hasAccess: false,
        error: null,
        q,
        selectedLoginId,
        logins: [],
        selectedLogin: null,
        pagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
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
        pagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
      });
    }

    const api = await createAuthenticatedApi(request);
    
    // Build query parameters
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    if (q) params.set("search", q);
    
    const listRes = await api.get(`/admin/camtel-logins?${params.toString()}`);
    const logins = normalizeCamtelLoginsFromApi(unwrapList<CamtelLogin>(listRes.data));
    const pagination = extractPaginationMeta(listRes.data);

    let selectedLogin: CamtelLogin | null = null;
    if (selectedLoginId) {
      try {
        const detailsRes = await api.get(`/admin/camtel-logins/${selectedLoginId}`, {
          params: { include_users: true },
        });
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
      pagination,
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
      pagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const actionType = formData.get("actionType") as ActionType | null;
  const loginId = asNumber(formData.get("loginId") as string | null);

  // Backend controller fields: owner_name, value, camtel_created_at, password
  // On garde compat avec l'ancien form (login/label/notes).
  const valueRaw = (formData.get("value") as string | null) ?? (formData.get("login") as string | null);
  const ownerNameRaw =
    (formData.get("ownerName") as string | null) ?? (formData.get("owner_name") as string | null) ?? (formData.get("label") as string | null);
  const camtelCreatedAtRaw =
    (formData.get("camtelCreatedAt") as string | null) ??
    (formData.get("camtel_created_at") as string | null) ??
    (formData.get("notes") as string | null);

  const value = valueRaw?.trim() || null;
  const owner_name = ownerNameRaw?.trim() || null;
  const camtel_created_at = camtelCreatedAtRaw?.trim() || null;

  const password = (formData.get("password") as string | null) || null;

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
        if (!owner_name) {
          return data<ActionData>(
            { success: false, actionType, error: t.adminCamtelLogins.errors.missingOwnerName },
            { status: 400 }
          );
        }
        if (!value || !password) {
          return data<ActionData>(
            { success: false, actionType, error: t.adminCamtelLogins.errors.missingCreateFields },
            { status: 400 }
          );
        }
        const payload: Record<string, any> = {
          owner_name,
          value: normalizeValue(value),
          password,
          ...(camtel_created_at ? { camtel_created_at } : {}),
        };
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
        if (!value && !password && !owner_name && camtel_created_at == null) {
          return data<ActionData>(
            { success: false, actionType, loginId, error: t.adminCamtelLogins.errors.nothingToUpdate },
            { status: 400 }
          );
        }
        const payload: Record<string, any> = {};
        if (value) payload.value = normalizeValue(value);
        if (password) payload.password = password;
        if (owner_name) payload.owner_name = owner_name;
        if (camtel_created_at != null) payload.camtel_created_at = camtel_created_at || null;

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
    
    // Reset to page 1 when changing filters (except for page parameter itself)
    if (key !== "page" && key !== "perPage") {
      url.searchParams.delete("page");
    }
    
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  };

  const setPage = (page: number) => {
    setParam("page", String(page));
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

  // Plus besoin de filtrer côté client car le serveur gère tout
  const filtered = useMemo(() => {
    // Le serveur applique déjà les filtres, on retourne directement la liste
    return loaderData.logins || [];
  }, [loaderData.logins]);

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
      login: (l.value as any) || "",
      password: "",
      label: (l.owner_name as any) || "",
      notes: (l.camtel_created_at as any) || "",
    });

  const submitCreateOrUpdate = () => {
    const errs: Record<string, string> = {};
    const owner = formDialog.label.trim();
    const value = normalizeValue(formDialog.login.trim());
    const camtelDate = formDialog.notes.trim();

    if (!owner) errs.owner_name = t.adminCamtelLogins.errors.missingOwnerName;
    if (!value) errs.value = t.adminCamtelLogins.errors.missingCreateFields;
    if (value && !/^BA_[a-z0-9]+$/.test(value)) errs.value = t.adminCamtelLogins.form.loginHelp;
    if (formDialog.mode === "create" && !formDialog.password) errs.password = t.adminCamtelLogins.errors.missingCreateFields;
    if (camtelDate && Number.isNaN(new Date(camtelDate).getTime())) errs.camtel_created_at = t.forms?.required || "Date invalide";

    setFormErrors(errs);
    if (Object.keys(errs).length) return;

    const fd = new FormData();
    fd.set("actionType", formDialog.mode === "create" ? "create" : "update");
    if (formDialog.mode === "edit" && formDialog.loginId) fd.set("loginId", String(formDialog.loginId));
    if (value) fd.set("value", value);
    if (formDialog.password) fd.set("password", formDialog.password);
    fd.set("ownerName", owner);
    fd.set("camtelCreatedAt", camtelDate);
    setFormDialog((p) => ({ ...p, open: false }));
    submit(fd, { method: "post" });
  };

  const askDelete = (l: CamtelLogin) => {
    const label = (l.value || l.owner_name || `#${l.id}`) as string;
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
                          {t.adminCamtelLogins.stats.total}: <span className="font-semibold ml-1">{loaderData.pagination.total}</span>
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
                    
                    {loaderData.pagination.totalPages > 1 && (
                      <PaginationControls
                        currentPage={loaderData.pagination.currentPage}
                        totalPages={loaderData.pagination.totalPages}
                        total={loaderData.pagination.total}
                        perPage={loaderData.pagination.perPage}
                        onPageChange={setPage}
                      />
                    )}
                  </CardContent>
                </div>
              </Card>

              <Dialog open={isDrawerOpen} onOpenChange={(open) => (!open ? closeLogin() : null)}>
                <DialogContent className="fixed left-auto right-0 top-0 translate-x-0 translate-y-0 h-dvh w-[min(680px,100vw)] max-w-none rounded-none p-0 gap-0 overflow-hidden bg-background text-foreground border-l border-border shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200">
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
                  {isDrawerLoading ? (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/85 dark:bg-slate-900/85 px-5 py-4 shadow-2xl">
                        <Loader2 className="h-5 w-5 animate-spin text-babana-cyan" />
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {t.common.loading}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>

              {/* Create/Edit dialog */}
              <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog((p) => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
                  {/* Header premium (style AcceptDialog/EditDialog) */}
                  <div className="relative bg-linear-to-br from-babana-cyan via-babana-blue to-babana-navy p-8 pb-12">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.18),transparent_45%)]" />
                    <div className="relative flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                          <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                            <Key className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 pt-2">
                        <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
                          {formDialog.mode === "create" ? t.adminCamtelLogins.form.createTitle : t.adminCamtelLogins.form.editTitle}
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-lg font-medium">
                          {t.adminCamtelLogins.form.subtitle}
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitCreateOrUpdate();
                    }}
                    className="bg-white dark:bg-slate-900"
                  >
                    <div className="p-8 space-y-6">
                      {/* Bloc identité */}
                      <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="owner_name" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                              <div className="w-1 h-4 bg-babana-cyan rounded-full" />
                              {t.adminCamtelLogins.fields.label}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="owner_name"
                              value={formDialog.label}
                              onChange={(e) => {
                                setFormErrors((p) => ({ ...p, owner_name: "" }));
                                setFormDialog((p) => ({ ...p, label: e.target.value }));
                              }}
                              placeholder={t.adminCamtelLogins.form.labelPlaceholder}
                              className={`h-14 text-base bg-white dark:bg-slate-900 border-2 rounded-xl transition-all duration-200 ${
                                formErrors.owner_name
                                  ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                                  : "border-slate-200 dark:border-slate-700 focus:border-babana-cyan focus:ring-4 focus:ring-babana-cyan/20"
                              }`}
                              disabled={navigation.state !== "idle"}
                            />
                            {formErrors.owner_name ? (
                              <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg border border-red-200/60 dark:border-red-900/40">
                                {formErrors.owner_name}
                              </div>
                            ) : null}
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="value" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                              <div className="w-1 h-4 bg-babana-blue rounded-full" />
                              {t.adminCamtelLogins.fields.login}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="value"
                              value={formDialog.login}
                              onChange={(e) => {
                                setFormErrors((p) => ({ ...p, value: "" }));
                                setFormDialog((p) => ({ ...p, login: normalizeValue(e.target.value) }));
                              }}
                              placeholder={t.adminCamtelLogins.form.loginPlaceholder}
                              className={`h-14 text-lg font-mono bg-white dark:bg-slate-900 border-2 rounded-xl transition-all duration-200 ${
                                formErrors.value
                                  ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                                  : "border-slate-200 dark:border-slate-700 focus:border-babana-blue focus:ring-4 focus:ring-babana-blue/20"
                              }`}
                              disabled={navigation.state !== "idle"}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.adminCamtelLogins.form.loginHelp}</p>
                            {formErrors.value ? (
                              <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg border border-red-200/60 dark:border-red-900/40">
                                {formErrors.value}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                              <div className="w-1 h-4 bg-babana-navy rounded-full" />
                              {t.adminCamtelLogins.fields.password}
                              {formDialog.mode === "create" ? <span className="text-red-500">*</span> : null}
                              {formDialog.mode === "edit" ? (
                                <span className="text-slate-400 text-xs normal-case">({t.adminCamtelLogins.form.passwordOptional})</span>
                              ) : null}
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              value={formDialog.password}
                              onChange={(e) => {
                                setFormErrors((p) => ({ ...p, password: "" }));
                                setFormDialog((p) => ({ ...p, password: e.target.value }));
                              }}
                              placeholder={t.adminCamtelLogins.form.passwordPlaceholder}
                              className={`h-14 text-base bg-white dark:bg-slate-900 border-2 rounded-xl transition-all duration-200 ${
                                formErrors.password
                                  ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                                  : "border-slate-200 dark:border-slate-700 focus:border-babana-navy focus:ring-4 focus:ring-babana-navy/20"
                              }`}
                              disabled={navigation.state !== "idle"}
                            />
                            {formErrors.password ? (
                              <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg border border-red-200/60 dark:border-red-900/40">
                                {formErrors.password}
                              </div>
                            ) : null}
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="camtel_created_at" className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                              {t.adminCamtelLogins.fields.camtelCreatedAt}
                              <span className="text-slate-400 text-xs normal-case">({t.common?.optional || "optionnel"})</span>
                            </Label>
                            <Input
                              id="camtel_created_at"
                              type="date"
                              value={formDialog.notes}
                              onChange={(e) => {
                                setFormErrors((p) => ({ ...p, camtel_created_at: "" }));
                                setFormDialog((p) => ({ ...p, notes: e.target.value }));
                              }}
                              placeholder={t.adminCamtelLogins.form.camtelCreatedAtPlaceholder}
                              className={`h-14 text-base bg-white dark:bg-slate-900 border-2 rounded-xl transition-all duration-200 ${
                                formErrors.camtel_created_at
                                  ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                                  : "border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                              }`}
                              disabled={navigation.state !== "idle"}
                            />
                            {formErrors.camtel_created_at ? (
                              <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg border border-red-200/60 dark:border-red-900/40">
                                {formErrors.camtel_created_at}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer premium */}
                    <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormErrors({});
                          setFormDialog((p) => ({ ...p, open: false }));
                        }}
                        disabled={navigation.state !== "idle"}
                        className="h-12 px-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
                      >
                        {t.actions.cancel}
                      </Button>
                      <Button
                        type="submit"
                        disabled={navigation.state !== "idle"}
                        className="h-12 px-8 bg-linear-to-r from-babana-cyan via-babana-blue to-babana-navy hover:opacity-95 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {navigation.state !== "idle" && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        {formDialog.mode === "create" ? t.adminCamtelLogins.form.createCta : t.adminCamtelLogins.form.saveCta}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Delete confirm */}
              <Dialog
                open={confirmDelete.open}
                onOpenChange={(open) =>
                  setConfirmDelete((p) => (open ? { ...p, open } : { open: false, loginId: null, loginLabel: "" }))
                }
              >
                <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
                  {/* Header premium (danger) */}
                  <div className="relative bg-linear-to-br from-red-600 via-rose-600 to-orange-500 p-8 pb-12">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.18),transparent_45%)]" />
                    <div className="relative flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                          <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                            <Trash2 className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 pt-2">
                        <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
                          {t.adminCamtelLogins.confirm.deleteTitle}
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-lg font-medium">
                          {t.adminCamtelLogins.confirm.deleteDescription}{" "}
                          <span className="font-black text-white">{confirmDelete.loginLabel}</span>
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900">
                    <div className="p-8">
                      <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                        <div className="text-sm text-slate-700 dark:text-slate-200">
                          {t.adminCamtelLogins.confirm.deleteDescription}{" "}
                          <span className="font-semibold">{confirmDelete.loginLabel}</span>
                        </div>
                        <div className="text-xs mt-2 text-slate-500 dark:text-slate-400">{t.adminCamtelLogins.confirm.deleteHint}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        variant="outline"
                        onClick={() => setConfirmDelete({ open: false, loginId: null, loginLabel: "" })}
                        className="h-12 px-6 rounded-xl border-2 font-semibold"
                      >
                        {t.actions.cancel}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={submitDelete}
                        className="h-12 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        {t.actions.delete}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Password dialog */}
              <Dialog open={passwordDialog.open} onOpenChange={(open) => setPasswordDialog((p) => ({ ...p, open }))}>
                <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
                  {/* Header premium */}
                  <div className="relative bg-linear-to-br from-babana-navy via-babana-blue to-babana-cyan p-8 pb-12">
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/30 blur-xl rounded-full"></div>
                          <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                            <Copy className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 pt-2">
                        <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
                          {t.adminCamtelLogins.password.title}
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-lg font-medium">
                          {t.adminCamtelLogins.password.subtitle}
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900">
                    <div className="p-8 space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-3">
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {t.adminCamtelLogins.fields.password}
                        </div>
                        <div className="flex items-center gap-3">
                          <Input readOnly value={passwordDialog.password ?? "—"} className="h-12 font-mono" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => (passwordDialog.password ? copyPassword(passwordDialog.password) : null)}
                            disabled={!passwordDialog.password}
                            className="h-12 px-5 rounded-xl border-2"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            {t.adminCamtelLogins.password.copy}
                          </Button>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{t.adminCamtelLogins.password.notice}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        variant="outline"
                        onClick={() => setPasswordDialog({ open: false, loginId: null, password: null })}
                        className="h-12 px-6 rounded-xl border-2 font-semibold"
                      >
                        {t.actions.close}
                      </Button>
                    </div>
                  </div>
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
              const loginValue = (l.value || (l as any)?.login || (l as any)?.username || "—") as string;
              const labelValue = (l.owner_name || (l as any)?.label || (l as any)?.name || "—") as string;

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

function PaginationControls({
  currentPage,
  totalPages,
  total,
  perPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Nombre maximum de boutons de page visibles
    
    if (totalPages <= maxVisible) {
      // Si peu de pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher: 1 ... n-1 n n+1 ... last
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }
      
      // Pages autour de la page actuelle
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      {/* Info sur les résultats */}
      <div className="text-sm text-muted-foreground">
        Affichage <span className="font-medium">{startItem}</span> à{" "}
        <span className="font-medium">{endItem}</span> sur{" "}
        <span className="font-medium">{total}</span> résultats
      </div>
      
      {/* Contrôles de pagination */}
      <div className="flex items-center gap-2">
        {/* Première page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        {/* Page précédente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Numéros de page */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }
            
            const pageNum = page as number;
            const isActive = pageNum === currentPage;
            
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-9 w-9 p-0 ${
                  isActive 
                    ? "bg-babana-cyan hover:bg-babana-cyan-dark text-babana-navy" 
                    : ""
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        {/* Page suivante */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Dernière page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function normalizeValue(value: string): string {
  const v = (value || "").trim();
  if (!v) return v;
  const upper = v.toUpperCase();
  if (upper.startsWith("BA_")) {
    return "BA_" + v.slice(3).toLowerCase();
  }
  return v;
}


