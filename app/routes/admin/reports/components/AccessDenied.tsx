/**
 * Composant pour afficher les messages d'accès refusé ou d'erreur
 */

import { Layout } from "~/components";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface AccessDeniedProps {
  title: string;
  message: string;
}

export function AccessDenied({ title, message }: AccessDeniedProps) {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </Layout>
  );
}

