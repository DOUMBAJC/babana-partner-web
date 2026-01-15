import { data, useLocation, useNavigate, useNavigation, useRevalidator, useSubmit } from "react-router";
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import type { Route } from "./+types/route";
import type { AccountStatus, ApiRole, ApiUser, RoleSlug, User } from "~/types/auth.types";
import { createAuthenticatedApi, getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { hasPermission } from "~/lib/permissions";
import { Layout, ProtectedRoute } from "~/components";
import { usePageTitle, useTranslation } from "~/hooks";
import { getTranslations, type Language } from "~/lib/translations";
import {
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toaster,
  Avatar,
  AvatarFallback,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components";
import { UserDetailsPanel } from "./components/UserDetailsPanel";
import { formatDate, getInitials } from "./utils";
import type { ActionType } from "./utils";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  RefreshCcw,
  Search,
  Shield,
  Slash,
  Sparkles,
  UserCheck,
  UserX,
  Users,
  PauseCircle,
  PlayCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";

type TabValue = "all" | "pending";

type LoaderData = {
  user: User | null;
  hasAccess: boolean;
  canManageRoles: boolean;
  error: string | null;
  tab: TabValue;
  q: string;
  status: AccountStatus | "all";
  role: RoleSlug | "all";
  selectedUserId: string | null;
  users: User[];
  pendingUsers: User[];
  selectedUser: User | null;
  availableRoles: Array<{ slug: string; name?: string; description?: string }>;
  availableCamtelLogins: Array<{ id: string; value?: string | null; owner_name?: string | null }>;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  pendingPagination: {
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
  userId?: string;
  roleSlug?: string;
  camtelLoginId?: string;
};

function asNumber(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asString(value: string | null): string | null {
  return value || null;
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

function unwrapRoles(payload: any): Array<{ slug: string; name?: string; description?: string }> {
  // On supporte plusieurs formats possibles, mais on reste minimal.
  const root = payload?.data ?? payload;
  const list =
    root?.data?.roles ??
    root?.roles ??
    root?.data?.data ??
    root?.data ??
    root;

  if (!Array.isArray(list)) return [];
  return list
    .filter((r) => r && typeof r === "object" && typeof r.slug === "string")
    .map((r) => ({ slug: r.slug as string, name: r.name as any, description: r.description as any }));
}

function normalizeCamtelLoginOptionFromApi(input: any): { id: string; value?: string | null; owner_name?: string | null } {
  const id = input?.id;
  return {
    id: id ? String(id) : '',
    value:
      input?.value ??
      input?.login ??
      input?.username ??
      input?.identifier ??
      input?.camtel_login ??
      input?.camtelLogin ??
      null,
    owner_name: input?.owner_name ?? input?.ownerName ?? input?.label ?? input?.name ?? null,
  };
}

function normalizeCamtelLoginOptionsFromApi(
  list: any[]
): Array<{ id: string; value?: string | null; owner_name?: string | null }> {
  return (list || [])
    .map((x) => normalizeCamtelLoginOptionFromApi(x))
    .filter((x) => x.id);
}

function statusBadgeVariant(
  status: AccountStatus
): React.ComponentProps<typeof Badge>["variant"] {
  switch (status) {
    case "active":
      return "default";
    case "verified":
      return "secondary";
    case "pending_verification":
      return "outline";
    case "suspended":
      return "destructive";
    case "rejected":
      return "destructive";
  }
}

function StatusBadge({ status }: { status: AccountStatus }) {
  const { t } = useTranslation();
  const Icon =
    status === "active"
      ? UserCheck
      : status === "verified"
        ? Clock
        : status === "pending_verification"
          ? Mail
          : status === "suspended"
            ? PauseCircle
            : UserX;

  return (
    <Badge variant={statusBadgeVariant(status)} className="gap-1">
      <Icon className="h-3.5 w-3.5" />
      {t.adminUsers.status[status]}
    </Badge>
  );
}


function normalizeRoleSlugs(input: unknown): RoleSlug[] {
  const roles = Array.isArray(input) ? (input as Array<RoleSlug | ApiRole | string>) : [];
  const slugs = roles
    .map((r) => {
      if (typeof r === "string") return r;
      if (r && typeof r === "object" && typeof (r as ApiRole).slug === "string") {
        return (r as ApiRole).slug as string;
      }
      return null;
    })
    .filter((v): v is string => !!v);

  // Dédup + cast (on reste permissif si le backend renvoie un slug non prévu)
  return Array.from(new Set(slugs)) as RoleSlug[];
}

function extractRoleDetails(input: unknown): ApiRole[] {
  const roles = Array.isArray(input) ? (input as Array<ApiRole | any>) : [];
  return roles
    .filter((r) => r && typeof r === "object" && typeof r.slug === "string")
    .map((r) => r as ApiRole);
}

function normalizeUserFromApi(input: ApiUser | any): User {
  const roles_details = extractRoleDetails(input?.roles);
  return {
    ...input,
    roles: normalizeRoleSlugs(input?.roles),
    roles_details: roles_details.length ? roles_details : undefined,
  } as User;
}

function normalizeUsersFromApi(list: any[]): User[] {
  return (list || []).map((u) => normalizeUserFromApi(u));
}


export async function loader({ request }: Route.LoaderArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return data<LoaderData>({
        user: null,
        hasAccess: false,
        canManageRoles: false,
        error: null,
        tab: "all",
        q: "",
        status: "all",
        role: "all",
        selectedUserId: null,
        users: [],
        pendingUsers: [],
        selectedUser: null,
        availableRoles: [],
        availableCamtelLogins: [],
        pagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
        pendingPagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
      });
    }

    // Permission "view-users" est donnée à plusieurs rôles (admin, activateur, dsm, vendeur, etc.)
    const canViewUsers = hasPermission(user, "view-users");
    const canManageRoles = hasPermission(user, "edit-users") || hasPermission(user, "admin-access");

    const url = new URL(request.url);
    const tab = (url.searchParams.get("tab") as TabValue) || "all";
    const q = url.searchParams.get("q") || "";
    const status = (url.searchParams.get("status") as AccountStatus | "all") || "all";
    const role = (url.searchParams.get("role") as RoleSlug | "all") || "all";
    const selectedUserId = asString(url.searchParams.get("userId"));
    const page = Math.max(1, asNumber(url.searchParams.get("page")) || 1);
    const perPage = Math.max(1, Math.min(100, asNumber(url.searchParams.get("perPage")) || 15));
    const pendingPage = Math.max(1, asNumber(url.searchParams.get("pendingPage")) || 1);
    const pendingPerPage = Math.max(1, Math.min(100, asNumber(url.searchParams.get("pendingPerPage")) || 15));

    if (!canViewUsers) {
      return data<LoaderData>({
        user,
        hasAccess: false,
        canManageRoles,
        error: null,
        tab,
        q,
        status,
        role,
        selectedUserId,
        users: [],
        pendingUsers: [],
        selectedUser: null,
        availableRoles: [],
        availableCamtelLogins: [],
        pagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
        pendingPagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
      });
    }

    const api = await createAuthenticatedApi(request);

    // Build query parameters for the main users list
    const usersParams = new URLSearchParams();
    usersParams.set("page", String(page));
    usersParams.set("per_page", String(perPage));
    if (q) usersParams.set("search", q);
    if (status !== "all") usersParams.set("status", status);
    if (role !== "all") usersParams.set("role", role);

    // Build query parameters for pending users
    const pendingParams = new URLSearchParams();
    pendingParams.set("page", String(pendingPage));
    pendingParams.set("per_page", String(pendingPerPage));
    if (q) pendingParams.set("search", q);

    const [usersRes, pendingRes, rolesRes, camtelLoginsRes] = await Promise.all([
      api.get(`/admin/users?${usersParams.toString()}`),
      api.get(`/admin/users/pending?${pendingParams.toString()}`),
      api.get("/admin/roles"),
      // Optionnel: certains rôles peuvent voir les users sans avoir accès aux logins CAMTEL
      canManageRoles ? api.get("/admin/camtel-logins") : Promise.resolve({ data: null }),
    ]);

    const users = normalizeUsersFromApi(unwrapList<User>(usersRes.data));
    const pendingUsers = normalizeUsersFromApi(unwrapList<User>(pendingRes.data));
    const pagination = extractPaginationMeta(usersRes.data);
    const pendingPagination = extractPaginationMeta(pendingRes.data);
    const availableRoles = unwrapRoles(rolesRes.data);
    const availableCamtelLogins = canManageRoles
      ? normalizeCamtelLoginOptionsFromApi(unwrapList<any>(camtelLoginsRes?.data))
      : [];

    let selectedUser: User | null = null;
    if (selectedUserId) {
      try {
        const detailsRes = await api.get(`/admin/users/${selectedUserId}`);
        // Backend: { success: true, data: { user: ... } }
        const raw = detailsRes.data?.data?.user ?? null;
        selectedUser = raw ? normalizeUserFromApi(raw) : null;
      } catch {
        selectedUser = null;
      }
    }

    return data<LoaderData>({
      user,
      hasAccess: canViewUsers,
      canManageRoles,
      error: null,
      tab,
      q,
      status,
      role,
      selectedUserId,
      users,
      pendingUsers,
      selectedUser,
      availableRoles,
      availableCamtelLogins,
      pagination,
      pendingPagination,
    });
  } catch (error: any) {
    return data<LoaderData>({
      user: null,
      hasAccess: false,
      canManageRoles: false,
      error: error?.response?.data?.message || error?.message || t.adminUsers.errors.loadError,
      tab: "all",
      q: "",
      status: "all",
      role: "all",
      selectedUserId: null,
      users: [],
      pendingUsers: [],
      selectedUser: null,
      availableRoles: [],
      availableCamtelLogins: [],
      pagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
      pendingPagination: { currentPage: 1, perPage: 15, total: 0, totalPages: 0 },
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const actionType = formData.get("actionType") as ActionType | null;
  const userId = asString(formData.get("userId") as string | null);
  const rejectionReason = (formData.get("rejectionReason") as string | null)?.trim() || null;
  const roleSlug = (formData.get("roleSlug") as string | null)?.trim() || null;
    const camtelLoginId = asString(formData.get("camtelLoginId") as string | null);

  if (!actionType || !userId) {
    return data<ActionData>(
      { success: false, error: t.adminUsers.errors.missingParams },
      { status: 400 }
    );
  }

  try {
    const api = await createAuthenticatedApi(request);

    switch (actionType) {
      case "assign_role": {
        if (!roleSlug) {
          return data<ActionData>(
            { success: false, actionType, userId, error: t.adminUsers.errors.missingRole },
            { status: 400 }
          );
        }
        const res = await api.post(`/admin/roles/assign`, {
          user_id: userId,
          role_slug: roleSlug,
          // compat éventuelle
          userId,
          roleSlug,
        });
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          roleSlug,
          message: res.data?.message || t.adminUsers.roles.assignButton,
        });
      }
      case "remove_role": {
        if (!roleSlug) {
          return data<ActionData>(
            { success: false, actionType, userId, error: t.adminUsers.errors.missingRole },
            { status: 400 }
          );
        }
        const res = await api.post(`/admin/roles/remove`, {
          user_id: userId,
          role_slug: roleSlug,
          userId,
          roleSlug,
        });
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          roleSlug,
          message: res.data?.message || t.adminUsers.roles.removeButton,
        });
      }
      case "assign_camtel_login": {
        if (!camtelLoginId) {
          return data<ActionData>(
            { success: false, actionType, userId, error: t.adminUsers.errors.missingParams },
            { status: 400 }
          );
        }
        const res = await api.post(`/admin/users/${userId}/camtel-login`, {
          camtel_login_id: camtelLoginId,
          camtelLoginId,
        });
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          camtelLoginId,
          message: res.data?.message || t.adminUsers.roles.assignButton,
        });
      }
      case "remove_camtel_login": {
        const res = await api.delete(`/admin/users/${userId}/camtel-login`);
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          message: res.data?.message || t.adminUsers.roles.removeButton,
        });
      }
      case "activate": {
        const res = await api.post(`/admin/users/${userId}/activate`, {});
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          message: res.data?.message || t.adminUsers.actions.activateTitle,
        });
      }
      case "suspend": {
        const res = await api.post(`/admin/users/${userId}/suspend`, {});
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          message: res.data?.message || t.adminUsers.actions.suspendTitle,
        });
      }
      case "reactivate": {
        const res = await api.post(`/admin/users/${userId}/reactivate`, {});
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          message: res.data?.message || t.adminUsers.actions.reactivateTitle,
        });
      }
      case "reject": {
        // Si le backend exige une raison, on l'envoie. Sinon, ça reste compatible.
        const res = await api.post(`/admin/users/${userId}/reject`, {
          ...(rejectionReason ? { rejection_reason: rejectionReason } : {}),
        });
        return data<ActionData>({
          success: true,
          actionType,
          userId,
          message: res.data?.message || t.adminUsers.actions.rejectTitle,
        });
      }
    }
  } catch (error: any) {
    return data<ActionData>(
      {
        success: false,
        actionType,
        userId,
        error: error?.response?.data?.message || error?.message || t.adminUsers.errors.genericError,
      },
      { status: 500 }
    );
  }
}

export default function AdminUsersPage({ loaderData, actionData }: Route.ComponentProps) {
  const { t } = useTranslation();
  usePageTitle(t.pages.adminUsers.title);
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const submit = useSubmit();
  const isRefreshing = revalidator.state === "loading";
  const [drawerTab, setDrawerTab] = useState<"profile" | "roles" | "actions">("profile");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    actionType: ActionType | null;
    user: User | null;
  }>({ open: false, actionType: null, user: null });
  const [rejectionReason, setRejectionReason] = useState("");
  const [qInput, setQInput] = useState(loaderData.q);

  useEffect(() => {
    setQInput(loaderData.q);
  }, [loaderData.q]);
  
  useEffect(() => {
    // Synchronise doucement la recherche dans l'URL (partageable) sans recharger à chaque frappe.
    const t = window.setTimeout(() => {
      if (qInput !== loaderData.q) setParam("q", qInput);
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData.success) {
      toast.success(actionData.message || t.adminUsers.toasts.actionDone);
      // Garder l'UI (liste + panneau) synchronisée après modification (statut ou rôles)
      revalidator.revalidate();
    } else if (actionData.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const baseList = loaderData.tab === "pending" ? loaderData.pendingUsers : loaderData.users;
  const currentPagination = loaderData.tab === "pending" ? loaderData.pendingPagination : loaderData.pagination;

  // Plus besoin de filtrer côté client car le serveur gère tout
  const filtered = useMemo(() => {
    // Le serveur applique déjà les filtres, on retourne directement la liste
    return baseList;
  }, [baseList]);

  const roleNameBySlug = useMemo(() => {
    const m: Record<string, string> = {};
    for (const r of loaderData.availableRoles || []) {
      m[r.slug] = r.name || r.slug;
    }
    return m;
  }, [loaderData.availableRoles]);

  const stats = useMemo(() => {
    const all = loaderData.users || [];
    const total = all.length;
    const active = all.filter((u) => u.account_status === "active").length;
    const suspended = all.filter((u) => u.account_status === "suspended").length;
    const rejected = all.filter((u) => u.account_status === "rejected").length;
    const pending = loaderData.pendingUsers?.length || all.filter((u) => u.account_status === "verified").length;
    return { total, active, pending, suspended, rejected };
  }, [loaderData.users, loaderData.pendingUsers]);

  const desiredUserId = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return asString(sp.get("userId"));
  }, [location.search]);

  const isDrawerOpen = desiredUserId != null;
  const selected =
    desiredUserId != null && loaderData.selectedUser?.id === desiredUserId
      ? loaderData.selectedUser
      : null;
  const isDrawerLoading =
    isDrawerOpen &&
    (navigation.state === "loading" ||
      revalidator.state === "loading" ||
      loaderData.selectedUserId !== desiredUserId);

  useEffect(() => {
    if (desiredUserId != null) setDrawerTab("profile");
  }, [desiredUserId]);

  const setParam = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value === null || value === "" || value === "all") url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    
    // Reset to page 1 when changing filters (except for page parameter itself)
    if (key !== "page" && key !== "pendingPage" && key !== "perPage" && key !== "pendingPerPage") {
      if (loaderData.tab === "pending") {
        url.searchParams.delete("pendingPage");
      } else {
        url.searchParams.delete("page");
      }
    }
    
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  };

  const setPage = (page: number) => {
    const paramKey = loaderData.tab === "pending" ? "pendingPage" : "page";
    setParam(paramKey, String(page));
  };

  const openUser = (id: string) => setParam("userId", id);
  const closeUser = () => setParam("userId", null);

  const openConfirm = (actionType: ActionType, user: User) => {
    setRejectionReason("");
    setConfirm({ open: true, actionType, user });
  };

  const assignRole = (user: User, roleSlug: string) => {
    const fd = new FormData();
    fd.set("actionType", "assign_role");
    fd.set("userId", String(user.id));
    fd.set("roleSlug", roleSlug);
    submit(fd, { method: "post" });
  };

  const removeRole = (user: User, roleSlug: string) => {
    const fd = new FormData();
    fd.set("actionType", "remove_role");
    fd.set("userId", String(user.id));
    fd.set("roleSlug", roleSlug);
    submit(fd, { method: "post" });
  };

  const assignCamtelLogin = (user: User, camtelLoginId: string) => {
    const fd = new FormData();
    fd.set("actionType", "assign_camtel_login");
    fd.set("userId", String(user.id));
    fd.set("camtelLoginId", camtelLoginId);
    submit(fd, { method: "post" });
  };

  const removeCamtelLogin = (user: User) => {
    const fd = new FormData();
    fd.set("actionType", "remove_camtel_login");
    fd.set("userId", String(user.id));
    submit(fd, { method: "post" });
  };

  const submitAction = () => {
    if (!confirm.user || !confirm.actionType) return;
    const fd = new FormData();
    fd.set("actionType", confirm.actionType);
    fd.set("userId", String(confirm.user.id));
    if (confirm.actionType === "reject") {
      fd.set("rejectionReason", rejectionReason);
    }
    setConfirm({ open: false, actionType: null, user: null });
    submit(fd, { method: "post" });
  };

  return (
    <Layout>
      <Toaster />
      <ProtectedRoute permission="view-users">
        <div className="container mx-auto space-y-6 py-8 px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">{t.adminUsers.breadcrumb.admin}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t.adminUsers.breadcrumb.users}</BreadcrumbPage>
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
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {t.adminUsers.header.title}
                  </h1>
                  <p className="text-muted-foreground">
                    {t.adminUsers.header.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.actions.back}
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

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard title={t.adminUsers.stats.total} value={stats.total} icon={Users} tone="cyan" />
            <StatCard title={t.adminUsers.stats.active} value={stats.active} icon={UserCheck} tone="green" />
            <StatCard title={t.adminUsers.stats.pending} value={stats.pending} icon={Clock} tone="amber" />
            <StatCard title={t.adminUsers.stats.suspended} value={stats.suspended} icon={PauseCircle} tone="red" />
            <StatCard title={t.adminUsers.stats.rejected} value={stats.rejected} icon={UserX} tone="slate" />
          </div>

          {/* Controls */}
          <Card className="border-babana-cyan/15 overflow-hidden">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-babana-cyan/10 via-transparent to-babana-navy/10" />
              <CardContent className="relative p-4 md:p-5 space-y-4">
                <Tabs
                  value={loaderData.tab}
                  onValueChange={(v) => setParam("tab", v as TabValue)}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <TabsList className="w-fit">
                      <TabsTrigger value="all" className="gap-2">
                        {t.adminUsers.tabs.all}
                        <Badge variant="outline" className="ml-1">
                          {loaderData.users.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="gap-2">
                        {t.adminUsers.tabs.pending}
                        <Badge variant="outline" className="ml-1">
                          {loaderData.pendingUsers.length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                      <div className="relative w-full md:w-[360px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder={t.adminUsers.search.placeholder}
                          value={qInput}
                          onChange={(e) => setQInput(e.target.value)}
                        />
                      </div>

                      <Select
                        value={loaderData.status}
                        onValueChange={(v) => setParam("status", v)}
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder={t.adminUsers.filters.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.adminUsers.filters.allStatuses}</SelectItem>
                          <SelectItem value="active">{t.adminUsers.status.active}</SelectItem>
                          <SelectItem value="verified">{t.adminUsers.status.verified}</SelectItem>
                          <SelectItem value="pending_verification">
                            {t.adminUsers.status.pending_verification}
                          </SelectItem>
                          <SelectItem value="suspended">{t.adminUsers.status.suspended}</SelectItem>
                          <SelectItem value="rejected">{t.adminUsers.status.rejected}</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={loaderData.role} onValueChange={(v) => setParam("role", v)}>
                        <SelectTrigger className="w-[170px]">
                          <SelectValue placeholder={t.adminUsers.filters.role} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t.adminUsers.filters.allRoles}</SelectItem>
                          {(loaderData.availableRoles || []).map((r) => (
                            <SelectItem key={r.slug} value={r.slug}>
                              {t.roles?.[r.slug]?.name || r.name || r.slug}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="all">
                    <UsersTable
                      users={filtered}
                      onOpenUser={openUser}
                      selectedUserId={desiredUserId}
                      roleNameBySlug={roleNameBySlug}
                    />
                    {currentPagination.totalPages > 1 && (
                      <PaginationControls
                        currentPage={currentPagination.currentPage}
                        totalPages={currentPagination.totalPages}
                        total={currentPagination.total}
                        perPage={currentPagination.perPage}
                        onPageChange={setPage}
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="pending">
                    <UsersTable
                      users={filtered}
                      onOpenUser={openUser}
                      selectedUserId={desiredUserId}
                      roleNameBySlug={roleNameBySlug}
                    />
                    {currentPagination.totalPages > 1 && (
                      <PaginationControls
                        currentPage={currentPagination.currentPage}
                        totalPages={currentPagination.totalPages}
                        total={currentPagination.total}
                        perPage={currentPagination.perPage}
                        onPageChange={setPage}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </Card>

          {/* User details panel - Premium design */}
          <Dialog open={isDrawerOpen} onOpenChange={(open) => (!open ? closeUser() : null)}>
            <DialogContent className="left-auto right-0 top-0 translate-x-0 translate-y-0 h-dvh w-[min(720px,100vw)] max-w-none rounded-none sm:rounded-l-3xl p-0 gap-0 overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-200">
              <UserDetailsPanel
                user={selected}
                userId={desiredUserId}
                isLoading={isDrawerLoading}
                onClose={closeUser}
                onAction={openConfirm}
                availableRoles={loaderData.availableRoles}
                availableCamtelLogins={loaderData.availableCamtelLogins}
                canManageRoles={loaderData.canManageRoles}
                onAssignRole={(roleSlug: string) => (selected ? assignRole(selected, roleSlug) : null)}
                onRemoveRole={(roleSlug: string) => (selected ? removeRole(selected, roleSlug) : null)}
                onAssignCamtelLogin={(camtelLoginId: string) => (selected ? assignCamtelLogin(selected, camtelLoginId) : null)}
                onRemoveCamtelLogin={() => (selected ? removeCamtelLogin(selected) : null)}
                drawerTab={drawerTab}
                setDrawerTab={setDrawerTab}
              />
            </DialogContent>
          </Dialog>

          {/* Confirm dialog */}
          <Dialog
            open={confirm.open}
            onOpenChange={(open) =>
              setConfirm((prev) => ({ ...prev, open, ...(open ? {} : { actionType: null, user: null }) }))
            }
          >
            <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-0 shadow-2xl rounded-3xl p-0 overflow-hidden">
              {/* Header spectaculaire (style AcceptDialog) */}
              <div
                className={`relative bg-linear-to-br p-8 pb-12 ${
                  confirm.actionType === "activate" || confirm.actionType === "reactivate"
                    ? "from-green-600 via-emerald-600 to-teal-600"
                    : confirm.actionType === "suspend"
                      ? "from-amber-600 via-orange-600 to-rose-600"
                      : confirm.actionType === "reject"
                        ? "from-rose-600 via-red-600 to-slate-700"
                        : "from-babana-cyan via-emerald-600 to-babana-navy"
                }`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

                <div className="relative flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                      <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/30 shadow-xl">
                        {confirm.actionType === "activate" ? (
                          <PlayCircle className="h-8 w-8 text-white" />
                        ) : confirm.actionType === "reactivate" ? (
                          <UserCheck className="h-8 w-8 text-white" />
                        ) : confirm.actionType === "suspend" ? (
                          <PauseCircle className="h-8 w-8 text-white" />
                        ) : (
                          <UserX className="h-8 w-8 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="text-3xl font-black text-white mb-2 tracking-tight">
                      {confirm.actionType === "activate"
                        ? t.adminUsers.confirm.activateTitle
                        : confirm.actionType === "suspend"
                          ? t.adminUsers.confirm.suspendTitle
                          : confirm.actionType === "reactivate"
                            ? t.adminUsers.confirm.reactivateTitle
                            : t.adminUsers.confirm.rejectTitle}
                    </div>
                    <div className="text-emerald-100 text-lg font-medium">
                      {confirm.user ? (
                        <>
                          {t.adminUsers.confirm.actionOn} <span className="font-semibold">{confirm.user.name}</span> •{" "}
                          {confirm.user.email}
                        </>
                      ) : null}
                    </div>
                  </div>

                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8 space-y-6">
                {confirm.actionType === "reject" ? (
                  <div className="space-y-3">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-1 h-4 bg-rose-500 rounded-full" />
                      {t.adminUsers.confirm.reasonOptionalLabel}
                    </div>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={t.adminUsers.confirm.reasonPlaceholder}
                      className="text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition-all duration-200 resize-none"
                      rows={4}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {t.actions.confirm}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {confirm.actionType === "suspend"
                            ? t.adminUsers.statusDescriptions.suspended
                            : t.adminUsers.statusDescriptions.active}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer (style AcceptDialog) */}
              <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirm({ open: false, actionType: null, user: null })}
                  className="h-12 px-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
                >
                  {t.actions.cancel}
                </Button>
                <Button
                  type="button"
                  onClick={submitAction}
                  className={`h-12 px-8 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    confirm.actionType === "activate" || confirm.actionType === "reactivate"
                      ? "bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700"
                      : confirm.actionType === "suspend"
                        ? "bg-linear-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:via-orange-700 hover:to-rose-700"
                        : "bg-linear-to-r from-rose-600 via-red-600 to-slate-700 hover:from-rose-700 hover:via-red-700 hover:to-slate-800"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t.actions.confirm}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "cyan" | "green" | "amber" | "red" | "slate";
}) {
  const toneStyles =
    tone === "cyan"
      ? "from-babana-cyan/20 to-transparent border-babana-cyan/20"
      : tone === "green"
        ? "from-emerald-500/15 to-transparent border-emerald-500/20"
        : tone === "amber"
          ? "from-amber-500/15 to-transparent border-amber-500/20"
          : tone === "red"
            ? "from-rose-500/15 to-transparent border-rose-500/20"
            : "from-slate-500/10 to-transparent border-slate-500/20";

  return (
    <Card className={`border ${toneStyles} bg-linear-to-br`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          <div className="rounded-xl border bg-background/60 p-2.5">
            <Icon className="h-5 w-5 text-foreground/80" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UsersTable({
  users,
  onOpenUser,
  selectedUserId,
  roleNameBySlug,
}: {
  users: User[];
  onOpenUser: (id: string) => void;
  selectedUserId: string | null;
  roleNameBySlug: Record<string, string>;
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
              <TableHead>{t.adminUsers.table.user}</TableHead>
              <TableHead>{t.adminUsers.table.status}</TableHead>
              <TableHead>{t.adminUsers.table.roles}</TableHead>
              <TableHead>{t.adminUsers.table.created}</TableHead>
              <TableHead className="text-right">{t.adminUsers.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isSelected = selectedUserId === u.id;
              const isRowLoading = isSelected && isDetailsLoading;
              return (
                <TableRow
                  key={u.id}
                  data-state={isSelected ? "selected" : undefined}
                  className={`cursor-pointer transition-colors hover:bg-muted/30 ${isRowLoading ? "animate-pulse" : ""}`}
                  onClick={() => onOpenUser(u.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-babana-cyan/15">
                        <AvatarFallback className="bg-babana-cyan/10 text-babana-navy dark:text-babana-cyan">
                          {u.name ? getInitials(u.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium leading-tight truncate">{u.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={u.account_status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {(u.roles || []).slice(0, 2).map((r) => (
                        <Badge key={r} variant="outline" className="text-xs">
                          {t.roles?.[r]?.name || roleNameBySlug[r] || r}
                        </Badge>
                      ))}
                      {(u.roles || []).length > 2 ? (
                        <Badge variant="outline" className="text-xs">
                          +{(u.roles || []).length - 2}
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(u.created_at, language)}
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
                              onOpenUser(u.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            {t.adminUsers.table.view}
                            {isRowLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t.adminUsers.table.openTooltip}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}

            {!users.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <div className="mx-auto max-w-md space-y-2">
                    <div className="text-base font-semibold">{t.adminUsers.table.emptyTitle}</div>
                    <div className="text-sm text-muted-foreground">{t.adminUsers.table.emptyMessage}</div>
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

