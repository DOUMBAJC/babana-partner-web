/**
 * Utilité pour gérer les téléchargements de fichiers côté client
 */

/**
 * Déclenche le téléchargement d'un Blob dans le navigateur
 * @param blob Le contenu du fichier
 * @param defaultFilename Nom de fichier par défaut
 * @param response Les en-têtes de réponse pour extraire le nom du fichier si possible
 */
export function downloadFile(blob: Blob, defaultFilename: string, contentDisposition?: string | null) {
  let filename = defaultFilename;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, "");
    }
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Tente d'extraire un message d'erreur d'un Blob qui était censé être un fichier
 * Utile quand le serveur retourne du JSON d'erreur avec un Content-Type de fichier ou si Axios force le type blob
 */
export async function parseErrorFromBlob(blob: Blob): Promise<string | null> {
  try {
    const text = await blob.text();
    const data = JSON.parse(text);
    return data.message || data.error || null;
  } catch (e) {
    return null;
  }
}
