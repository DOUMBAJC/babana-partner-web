import { useNavigate } from "react-router";
import { Layout } from "~/components";
import { Button } from "~/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Toaster } from "~/components/ui/toaster";

interface NotFoundViewProps {
  error?: string;
}

export function NotFoundView({ error }: NotFoundViewProps) {
  const navigate = useNavigate();

  return (
    <Layout>
      <Toaster />
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-linear-to-br from-red-500 to-pink-600 mx-auto flex items-center justify-center shadow-2xl">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Requête introuvable
            </h1>
            <p className="text-muted-foreground text-lg">
              {error || "La requête d'activation demandée n'existe pas ou vous n'avez pas accès à celle-ci."}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/sales/activation-requests')}
            className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    </Layout>
  );
}

