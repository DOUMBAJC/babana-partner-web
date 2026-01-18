import type { User } from "~/types/auth.types";
import type { SupportTicket } from "~/lib/services/support.service";

export type LoaderData = {
  user: User | null;
  hasAccess: boolean;
  error: string | null;
  ticket: SupportTicket | null;
};

export type ActionData = {
  success: boolean;
  message?: string | null;
  error?: string | null;
  errors?: {
    message?: string;
    status?: string;
    priority?: string;
    is_public?: string;
    attachment?: string;
  };
  intent?: string;
};

