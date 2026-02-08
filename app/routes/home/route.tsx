import type { Route } from "./+types/route";
import { Layout, Welcome } from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";
import { data, useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Plateforme Partenaire Officielle" },
    {
      name: "description",
      content:
        "Accédez à la plateforme partenaire BABANA pour gérer vos activités, suivre vos performances et développer votre business avec ETS DAIROU.",
    },
    { property: "og:title", content: "BABANA - Plateforme Partenaire Officielle" },
    {
      property: "og:description",
      content:
        "Gérez vos activités et suivez vos performances sur la plateforme partenaire BABANA.",
    },
  ];
}

/**
 * Loader de la page d'accueil
 * - Lit le message de bienvenue flash dans la session
 * - Le renvoie une seule fois puis le supprime (flash)
 * - En cas de problème, retourne simplement null sans casser la page
 */
export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Import dynamique pour garder ce code 100% côté serveur
    const { getSession, commitSession } = await import(
      "~/services/session.server"
    );

    const session = await getSession(request.headers.get("Cookie"));
    const welcomeMessage = session.get("welcome");

    if (welcomeMessage) {
      return data(
        { welcomeMessage },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    }

    return data({ welcomeMessage: null });
  } catch (error) {
    console.error("Erreur dans le loader de la page d'accueil:", error);
    return data({ welcomeMessage: null });
  }
}

export default function Home() {
  const { t } = useTranslation();
  const { welcomeMessage } = useLoaderData<typeof loader>();
  usePageTitle(t.pages.home.title);

  return (
    <Layout>
      <Welcome welcomeMessage={welcomeMessage} />
    </Layout>
  );
}
