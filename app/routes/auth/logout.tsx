import type { Route } from "./+types/logout";
import { logout } from "~/services/session.server";

/**
 * Route de déconnexion
 * Détruit la session et redirige vers la page de login
 */
export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

// Loader pour gérer les requêtes GET (au cas où)
export async function loader({ request }: Route.LoaderArgs) {
  return logout(request);
}

