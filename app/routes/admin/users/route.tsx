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
  RefreshCcw,
  Search,
  Shield,
  Slash,
  UserCheck,
  UserX,
  Users,
  PauseCircle,
  PlayCircle,
  Mail,
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
  selectedUserId: number | null;
  users: User[];
  pendingUsers: User[];
  selectedUser: User | null;
  availableRoles: Array<{ slug: string; name?: string; description?: string }>;
};

type ActionData = {
  success: boolean;
  message?: string | null;
  error?: string | null;
  actionType?: ActionType;
  userId?: number;
  roleSlug?: string;
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
    const selectedUserId = asNumber(url.searchParams.get("userId"));

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
      });
    }

    const api = await createAuthenticatedApi(request);

    const [usersRes, pendingRes, rolesRes] = await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/users/pending"),
      api.get("/admin/roles"),
    ]);

    const users = normalizeUsersFromApi(unwrapList<User>(usersRes.data));
    const pendingUsers = normalizeUsersFromApi(unwrapList<User>(pendingRes.data));
    const availableRoles = unwrapRoles(rolesRes.data);

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
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const language = (await getLanguage(request)) as Language;
  const t = getTranslations(language);

  const formData = await request.formData();
  const actionType = formData.get("actionType") as ActionType | null;
  const userId = asNumber(formData.get("userId") as string | null);
  const rejectionReason = (formData.get("rejectionReason") as string | null)?.trim() || null;
  const roleSlug = (formData.get("roleSlug") as string | null)?.trim() || null;

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

  const filtered = useMemo(() => {
    const q = qInput.trim().toLowerCase();
    return baseList
      .filter((u) => {
        if (loaderData.status !== "all" && u.account_status !== loaderData.status) return false;
        if (loaderData.role !== "all" && !(u.roles || []).includes(loaderData.role)) return false;
        if (!q) return true;
        const hay = `${u.name || ""} ${u.email || ""} ${u.personal_phone || ""} ${u.camtel_login || ""}`
          .toLowerCase()
          .trim();
        return hay.includes(q);
      })
      .sort((a, b) => {
        // Tri par défaut: récent
        const ad = new Date(a.created_at).getTime();
        const bd = new Date(b.created_at).getTime();
        return bd - ad;
      });
  }, [baseList, qInput, loaderData.status, loaderData.role]);

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
    return asNumber(sp.get("userId"));
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
    navigate(`${url.pathname}?${url.searchParams.toString()}`);
  };

  const openUser = (id: number) => setParam("userId", String(id));
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
                className="bg-babana-cyan hover:bg-babana-cyan-dark text-babana-navy"
                onClick={() => revalidator.revalidate()}
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                {t.actions.refresh}
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
                  </TabsContent>
                  <TabsContent value="pending">
                    <UsersTable
                      users={filtered}
                      onOpenUser={openUser}
                      selectedUserId={desiredUserId}
                      roleNameBySlug={roleNameBySlug}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </Card>

          {/* User details panel - Premium design */}
          <Dialog open={isDrawerOpen} onOpenChange={(open) => (!open ? closeUser() : null)}>
            <DialogContent className="left-auto right-0 top-0 translate-x-0 translate-y-0 h-dvh w-[min(680px,100vw)] max-w-none rounded-none p-0 gap-0 overflow-hidden bg-background text-foreground border-l border-border shadow-2xl">
              <UserDetailsPanel
                user={selected}
                userId={desiredUserId}
                isLoading={isDrawerLoading}
                onClose={closeUser}
                onAction={openConfirm}
                availableRoles={loaderData.availableRoles}
                canManageRoles={loaderData.canManageRoles}
                onAssignRole={(roleSlug: string) => (selected ? assignRole(selected, roleSlug) : null)}
                onRemoveRole={(roleSlug: string) => (selected ? removeRole(selected, roleSlug) : null)}
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {confirm.actionType === "activate"
                    ? t.adminUsers.confirm.activateTitle
                    : confirm.actionType === "suspend"
                      ? t.adminUsers.confirm.suspendTitle
                      : confirm.actionType === "reactivate"
                        ? t.adminUsers.confirm.reactivateTitle
                        : t.adminUsers.confirm.rejectTitle}
                </DialogTitle>
                <DialogDescription>
                  {confirm.user ? (
                    <>
                      {t.adminUsers.confirm.actionOn} <span className="font-medium">{confirm.user.name}</span> (
                      {confirm.user.email}).
                    </>
                  ) : null}
                </DialogDescription>
              </DialogHeader>

              {confirm.actionType === "reject" ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">{t.adminUsers.confirm.reasonOptionalLabel}</div>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder={t.adminUsers.confirm.reasonPlaceholder}
                  />
                </div>
              ) : null}

              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirm({ open: false, actionType: null, user: null })}>
                  {t.actions.cancel}
                </Button>
                <Button
                  variant={confirm.actionType === "reject" || confirm.actionType === "suspend" ? "destructive" : "default"}
                  onClick={submitAction}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t.actions.confirm}
                </Button>
              </DialogFooter>
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
  onOpenUser: (id: number) => void;
  selectedUserId: number | null;
  roleNameBySlug: Record<string, string>;
}) {
  const { t, language } = useTranslation();
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
              return (
                <TableRow
                  key={u.id}
                  data-state={isSelected ? "selected" : undefined}
                  className="cursor-pointer"
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

