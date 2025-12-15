import axios, { type AxiosError } from "axios";
import { getUserToken, logout } from "./session.server";
import type { User } from "~/types/auth.types"; // Assuming User type is here

export const createApi = (token?: string | null) => {
  const baseURL = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:8000/api";

  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "X-API-Key": import.meta.env.VITE_APP_API_KEY || "",
    },
  });

  return api;
};

export const createAuthenticatedApi = async (request: Request) => {
  const token = await getUserToken(request);
  const api = createApi(token);

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        throw await logout(request);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export async function getCurrentUser(request: Request): Promise<User | null> {
  const token = await getUserToken(request);
  if (!token) return null;

  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/auth/user");
    return response.data; // Assuming API returns the User object directly or data.user
  } catch (error) {
    return null; 
  }
}
