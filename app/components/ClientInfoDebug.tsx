/**
 * Composant de débogage pour afficher les métadonnées du client
 * Utile en développement ou dans une page d'administration
 */

import { useState, useEffect } from "react";
import { getClientInfo, requestGeolocationWithConsent, clearGeolocation, hasGeolocationConsent } from "~/lib/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useConsent } from "~/hooks/useConsent";

export function ClientInfoDebug() {
  const [clientInfo, setClientInfo] = useState<ReturnType<typeof getClientInfo>>();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const { consent } = useConsent();

  const refreshInfo = () => {
    setClientInfo(getClientInfo());
  };

  const handleRequestGeolocation = async () => {
    // Vérifier le consentement d'abord
    if (!consent.geolocation) {
      alert('Veuillez d\'abord accepter la géolocalisation dans les paramètres de consentement.');
      return;
    }

    setIsRequestingLocation(true);
    try {
      const geolocation = await requestGeolocationWithConsent();
      if (geolocation) {
        refreshInfo();
      }
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleClearGeolocation = () => {
    clearGeolocation();
    refreshInfo();
  };

  useEffect(() => {
    refreshInfo();
  }, []);

  if (!clientInfo) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🔍 Informations du Client</CardTitle>
        <CardDescription>
          Métadonnées collectées et envoyées avec chaque requête API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Système et Navigateur */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Système et Navigateur</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">OS :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.os}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Plateforme :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.platform}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Navigateur :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.browser}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Version :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.browserVersion}</Badge>
            </div>
          </div>
        </div>

        {/* Affichage et Localisation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Affichage et Localisation</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Résolution :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.screenResolution}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Langue :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.language}</Badge>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Fuseau horaire :</span>
              <Badge variant="secondary" className="ml-2">{clientInfo.timezone}</Badge>
            </div>
          </div>
        </div>

        {/* User-Agent personnalisé */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">User-Agent personnalisé</h3>
          <code className="block text-xs bg-muted p-2 rounded break-all">
            {clientInfo.customUserAgent}
          </code>
        </div>

        {/* Géolocalisation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Géolocalisation (Optionnelle)</h3>
          {clientInfo.geolocation ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Latitude :</span>
                  <Badge variant="secondary" className="ml-2">
                    {clientInfo.geolocation.latitude.toFixed(4)}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Longitude :</span>
                  <Badge variant="secondary" className="ml-2">
                    {clientInfo.geolocation.longitude.toFixed(4)}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Précision :</span>
                  <Badge variant="secondary" className="ml-2">
                    ±{Math.round(clientInfo.geolocation.accuracy)}m
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={handleClearGeolocation}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Effacer la géolocalisation
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                La géolocalisation n'est pas activée. Cliquez ci-dessous pour demander l'autorisation.
              </p>
              <Button 
                onClick={handleRequestGeolocation}
                disabled={isRequestingLocation}
                variant="default"
                size="sm"
                className="w-full"
              >
                {isRequestingLocation ? "Demande en cours..." : "📍 Activer la géolocalisation"}
              </Button>
            </div>
          )}
        </div>

        {/* En-têtes HTTP envoyés */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">En-têtes HTTP envoyés</h3>
          <div className="text-xs space-y-1 font-mono bg-muted p-2 rounded">
            <div><span className="text-blue-600">User-Agent:</span> {clientInfo.customUserAgent}</div>
            <div><span className="text-blue-600">X-Client-OS:</span> {clientInfo.os}</div>
            <div><span className="text-blue-600">X-Client-Browser:</span> {clientInfo.browser}</div>
            <div><span className="text-blue-600">X-Client-Browser-Version:</span> {clientInfo.browserVersion}</div>
            <div><span className="text-blue-600">X-Client-Platform:</span> {clientInfo.platform}</div>
            <div><span className="text-blue-600">X-Client-Screen-Resolution:</span> {clientInfo.screenResolution}</div>
            <div><span className="text-blue-600">X-Client-Timezone:</span> {clientInfo.timezone}</div>
            <div><span className="text-blue-600">X-Client-Language:</span> {clientInfo.language}</div>
            {clientInfo.geolocation && (
              <>
                <div><span className="text-blue-600">X-Client-Latitude:</span> {clientInfo.geolocation.latitude}</div>
                <div><span className="text-blue-600">X-Client-Longitude:</span> {clientInfo.geolocation.longitude}</div>
                <div><span className="text-blue-600">X-Client-Location-Accuracy:</span> {clientInfo.geolocation.accuracy}</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



