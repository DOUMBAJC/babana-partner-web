import type { Language } from "~/lib/translations";

export function validateReplyMessage(message: string, language: Language = 'fr') {
  const trimmedMessage = message.trim();
  
  if (!trimmedMessage) {
    return language === 'fr'
      ? "Le message est requis"
      : "Message is required";
  }
  
  if (trimmedMessage.length < 10) {
    return language === 'fr'
      ? "Le message doit contenir au moins 10 caractères"
      : "Message must be at least 10 characters";
  }
  
  if (trimmedMessage.length > 2000) {
    return language === 'fr'
      ? "Le message ne peut pas dépasser 2000 caractères"
      : "Message cannot exceed 2000 characters";
  }
  
  return null;
}

export function validateAttachment(attachment: File, language: Language = 'fr') {
  const maxSizeBytes = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(attachment.type)) {
    return language === 'fr'
      ? `Type de fichier non supporté: ${attachment.name}. Types acceptés: JPEG, JPG, PNG, GIF, WEBP`
      : `File type not supported: ${attachment.name}. Accepted types: JPEG, JPG, PNG, GIF, WEBP`;
  }
  
  if (attachment.size > maxSizeBytes) {
    return language === 'fr'
      ? `Le fichier ${attachment.name} est trop volumineux. Taille maximale: 2MB`
      : `File ${attachment.name} is too large. Maximum size: 2MB`;
  }
  
  return null;
}

