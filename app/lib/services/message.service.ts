/**
 * Service de messagerie interne – chat en temps réel.
 *
 * Toutes les requêtes passent par l'instance axios authentifiée (`api`)
 * et ciblent le préfixe `/conversations` de l'API Laravel.
 */

import { api, type ApiError } from "./axios";

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
  sender: ChatUser;
}

export interface ChatConversation {
  id: string;
  label: string | null;
  participant: ChatUser | null;
  last_message: {
    content: string;
    created_at: string;
    is_mine: boolean;
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
