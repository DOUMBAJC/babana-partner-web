/**
 * Public API (compat): métadonnées client.
 * Point d'entrée stable `~/lib/client-metadata`.
 */

export {
  getClientMetadata,
  generateCustomUserAgent,
  detectOS,
  detectBrowser,
  addClientMetadataToHeaders,
} from "./client/client-metadata";

export type { ClientMetadata } from "./client/client-metadata";


