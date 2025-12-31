import type { Route } from "./+types/route";
import { Layout, Welcome } from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";
import { getSession, commitSession } from "~/services/session.server";
import { data, useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Plateforme Partenaire" },
    { name: "description", content: "Plateforme partenaire BABANA ETS DAIROU pour une gestion moderne et efficace" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
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
  
  return { welcomeMessage: null };
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
