/**
 * Compat helper for services layer.
 *
 * Historiquement, les services importaient `./axios`.
 * On centralise maintenant l'axios client dans `~/lib/axios`.
 */

export { api } from "~/lib/axios";
export type { ApiError } from "~/lib/axios";


