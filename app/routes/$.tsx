import { NotFound } from '~/components/NotFound';
import { useTranslation, usePageTitle } from '~/hooks';

/**
 * Route catch-all - Gère toutes les routes non définies
 * Le symbole $ en React Router capture toutes les URLs qui ne correspondent à aucune autre route
 */
export default function CatchAllRoute() {
  const { t } = useTranslation();
  usePageTitle(t.pages.notFound.title);

  return <NotFound />;
}
