/**
 * Service de messagerie interne – chat en temps réel.
 *
 * Toutes les requêtes passent par l'instance axios authentifiée (`api`)
 * et ciblent le préfixe `/conversations` de l'API Laravel.
 */

import { api } from "./axios";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatUser {
  id: string;
  name: string;
  is_online?: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  status: "sent" | "delivered" | "read";
  attachments: string[];
  is_mine: boolean;
  created_at: string;
  sender: ChatUser & { name: string };
}

export interface ChatConversation {
  id: string;
  type: "direct" | "group" | "admin_support";
  label: string | null;
  description: string | null;
  is_group: boolean;
  is_admin_support: boolean;
  created_by: string | null;
  creator: { id: string; name: string } | null;
  /** Utilisé uniquement pour les conversations directes (type=direct) */
  participant: ChatUser | null;
  /** Utilisé pour les groupes et le support admin */
  participants: ChatUser[];
  last_message: {
    content: string;
    created_at: string;
    is_mine: boolean;
    sender: string | null;
  } | null;
  unread_count: number;
  last_message_at: string | null;
}

export interface ChatContact {
  id: string;
  name: string;
  roles: string[];
  role_slug: string | null;
  is_online: boolean;
  is_admin: boolean;
}

export interface PaginatedMessages {
  data: ChatMessage[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface CreateGroupPayload {
  label: string;
  description?: string;
  member_ids: string[];
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const messageService = {
  /**
   * Récupère toutes les conversations de l'utilisateur courant.
   */
  getConversations: async (): Promise<ChatConversation[]> => {
    const res = await api.get<{ success: boolean; data: ChatConversation[] }>(
      "/conversations"
    );
    return res.data;
  },

  /**
   * Obtient ou crée une conversation directe avec un utilisateur.
   */
  getOrCreateConversation: async (userId: string): Promise<ChatConversation> => {
    const res = await api.post<{ success: boolean; data: ChatConversation }>(
      "/conversations/get-or-create",
      { user_id: userId }
    );
    return res.data;
  },

  /**
   * Crée un nouveau groupe de discussion.
   */
  createGroup: async (payload: CreateGroupPayload): Promise<ChatConversation> => {
    const res = await api.post<{ success: boolean; data: ChatConversation }>(
      "/conversations/groups",
      payload
    );
    return res.data;
  },

  /**
   * Met à jour les informations d'un groupe (label, description).
   */
  updateGroup: async (
    conversationId: string,
    updates: { label?: string; description?: string }
  ): Promise<ChatConversation> => {
    const res = await api.put<{ success: boolean; data: ChatConversation }>(
      `/conversations/groups/${conversationId}`,
      updates
    );
    return res.data;
  },

  /**
   * Ajoute des membres à un groupe existant.
   */
  addGroupMembers: async (
    conversationId: string,
    memberIds: string[]
  ): Promise<ChatConversation> => {
    const res = await api.post<{ success: boolean; data: ChatConversation }>(
      `/conversations/groups/${conversationId}/members`,
      { member_ids: memberIds }
    );
    return res.data;
  },

  /**
   * Retire un membre d'un groupe.
   */
  removeGroupMember: async (
    conversationId: string,
    memberId: string
  ): Promise<void> => {
    await api.delete(
      `/conversations/groups/${conversationId}/members/${memberId}`
    );
  },

  /**
   * Crée ou récupère le canal de contact admin de l'utilisateur courant.
   */
  contactAdmin: async (): Promise<ChatConversation> => {
    const res = await api.post<{ success: boolean; data: ChatConversation }>(
      "/conversations/contact-admin"
    );
    return res.data;
  },

  /**
   * Récupère la liste des contacts disponibles pour le chat.
   */
  getContacts: async (): Promise<ChatContact[]> => {
    const res = await api.get<{ success: boolean; data: ChatContact[] }>(
      "/conversations/contacts"
    );
    return res.data;
  },

  /**
   * Récupère l'historique paginé des messages d'une conversation.
   */
  getMessages: async (
    conversationId: string,
    page = 1,
    perPage = 50
  ): Promise<PaginatedMessages> => {
    const res = await api.get<{ success: boolean } & PaginatedMessages>(
      `/conversations/${conversationId}/messages`,
      { params: { page, per_page: perPage } }
    );
    return { data: res.data, meta: res.meta! };
  },

  /**
   * Envoie un message dans une conversation.
   */
  sendMessage: async (
    conversationId: string,
    content: string
  ): Promise<ChatMessage> => {
    const res = await api.post<{ success: boolean; data: ChatMessage }>(
      `/conversations/${conversationId}/messages`,
      { content }
    );
    return res.data;
  },

  /**
   * Marque tous les messages d'une conversation comme lus.
   */
  markAsRead: async (conversationId: string): Promise<void> => {
    await api.post(`/conversations/${conversationId}/mark-as-read`);
  },
};
