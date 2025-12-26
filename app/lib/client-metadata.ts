/**
 * Module de détection et gestion des métadonnées du client
 * Gère la détection du navigateur, OS, et autres informations client
 */

export interface ClientMetadata {
  os: string;
  browser: string;
  browserVersion: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  language: string;
  userAgent: string;
}

/**
 * Détecte le système d'exploitation à partir du user agent
 */
export const detectOS = (): string => {
  if (typeof window === "undefined") return "Unknown";

  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    return "iOS";

  return platform || "Unknown";
};

/**
 * Détecte le navigateur et sa version à partir du user agent
 */
export const detectBrowser = (): { name: string; version: string } => {
  if (typeof window === "undefined")
    return { name: "Unknown", version: "0.0" };

  const userAgent = window.navigator.userAgent;
  let name = "Unknown";
  let version = "0.0";

  // Edge
  if (userAgent.includes("Edg/")) {
    name = "Edge";
    version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || "0.0";
  }
  // Chrome
  else if (userAgent.includes("Chrome/") && !userAgent.includes("Edg/")) {
    name = "Chrome";
    version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || "0.0";
  }
  // Safari
  else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    name = "Safari";
    version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || "0.0";
  }
  // Firefox
  else if (userAgent.includes("Firefox/")) {
    name = "Firefox";
    version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || "0.0";
  }
  // Opera
  else if (userAgent.includes("OPR/")) {
    name = "Opera";
    version = userAgent.match(/OPR\/(\d+\.\d+)/)?.[1] || "0.0";
  }

  return { name, version };
};

/**
 * Collecte toutes les métadonnées du client
 */
export const getClientMetadata = (): ClientMetadata => {
  if (typeof window === "undefined") {
    return {
      os: "Unknown",
      browser: "Unknown",
      browserVersion: "0.0",
      platform: "Unknown",
      screenResolution: "0x0",
      timezone: "UTC",
      language: "en",
      userAgent: "Server-Side-Rendering",
    };
  }

  const browser = detectBrowser();
  const os = detectOS();
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = window.navigator.language || "en";
  const userAgent = window.navigator.userAgent;

  return {
    os,
    browser: browser.name,
    browserVersion: browser.version,
    platform: window.navigator.platform,
    screenResolution,
    timezone,
    language,
    userAgent,
  };
};

/**
 * Génère un User-Agent personnalisé pour l'application
 */
export const generateCustomUserAgent = (): string => {
  const metadata = getClientMetadata();
  return `BabanaPartner/${metadata.browser}/${metadata.browserVersion} (${metadata.os}; ${metadata.platform})`;
};

/**
 * Ajoute les métadonnées du client aux headers d'une requête
 */
export const addClientMetadataToHeaders = (
  headers: Record<string, string>
): Record<string, string> => {
  if (typeof window === "undefined") {
    return headers;
  }

  const metadata = getClientMetadata();

  return {
    ...headers,
    "User-Agent": generateCustomUserAgent(),
    "X-Client-OS": metadata.os,
    "X-Client-Browser": metadata.browser,
    "X-Client-Browser-Version": metadata.browserVersion,
    "X-Client-Platform": metadata.platform,
    "X-Client-Screen-Resolution": metadata.screenResolution,
    "X-Client-Timezone": metadata.timezone,
    "X-Client-Language": metadata.language,
  };
};

