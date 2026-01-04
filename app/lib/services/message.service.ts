/**
 * Service de gestion des messages/chat
 * Permet aux utilisateurs de contacter les admins et activateurs
 */

import { api, type ApiError } from "./axios";
import type { User } from "~/types/auth.types";

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: number;
  participant_one_id: number;
  participant_two_id: number;
  last_message_id: number | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  participant?: User;
  last_message?: Message;
  unread_count?: number;
}

export interface SendMessageData {
  receiver_id: number;
  content: string;
}

export interface ConversationsResponse {
  data: Conversation[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface MessagesResponse {
  data: Message[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Service de gestion des messages
 */
export const messageService = {
  /**
   * Récupère la liste des conversations de l'utilisateur
   */
  getConversations: async (): Promise<ConversationsResponse> => {
    try {
      return await api.get<ConversationsResponse>("/messages/conversations");
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère les messages d'une conversation
   */
  getMessages: async (
    conversationId: number,
    page: number = 1,
    perPage: number = 50
  ): Promise<MessagesResponse> => {
    try {
      return await api.get<MessagesResponse>(`/messages/conversations/${conversationId}/messages`, {
        params: {
          page,
          per_page: perPage,
        },
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Envoie un message
   */
  sendMessage: async (data: SendMessageData): Promise<Message> => {
    try {
      const response = await api.post<{ data: Message }>("/messages", data);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Marque les messages d'une conversation comme lus
   */
  markAsRead: async (conversationId: number): Promise<void> => {
    try {
      await api.post(`/messages/conversations/${conversationId}/mark-as-read`);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère la liste des utilisateurs disponibles pour le chat (admins et activateurs)
   */
  getAvailableContacts: async (): Promise<{ data: User[] }> => {
    try {
      return await api.get<{ data: User[] }>("/messages/contacts");
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Crée ou récupère une conversation avec un utilisateur
   */
  getOrCreateConversation: async (userId: number): Promise<Conversation> => {
    try {
      const response = await api.post<{ data: Conversation }>(
        `/messages/conversations/get-or-create`,
        { user_id: userId }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

