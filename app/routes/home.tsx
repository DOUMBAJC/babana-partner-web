import type { Route } from "./+types/home";
import { Layout, Welcome } from "~/components";
import { useTranslation, usePageTitle } from "~/hooks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BABANA - Plateforme Partenaire" },
    { name: "description", content: "Plateforme partenaire BABANA ETS DAIROU pour une gestion moderne et efficace" },
  ];
}

export default function Home() {
  const { t } = useTranslation();
  usePageTitle(t.pages.home.title);

  return (
    <Layout>
      <Welcome />
    </Layout>
  );
}
