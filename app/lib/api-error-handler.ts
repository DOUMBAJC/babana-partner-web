/**
 * Public API (compat): gestion d'erreurs API.
 * Point d'entrée stable `~/lib/api-error-handler`.
 */

export {
  handleAxiosError,
  setErrorLanguage,
  getErrorLanguage,
  logRequest,
  logResponse,
} from "./http/api-error-handler";

export type { ApiError } from "./http/api-error-handler";
