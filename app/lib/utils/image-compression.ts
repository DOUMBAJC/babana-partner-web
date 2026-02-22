/**
 * Utilitaire pour compresser les images côté client avant upload.
 * Réduit drastiquement le poids des fichiers sans perte de qualité significative.
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1200, // Largeur max suffisante pour une CNI
    maxHeight = 1200,
    quality = 0.7    // Bon compromis poids/visibilité
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Calculer les nouvelles dimensions tout en conservant le ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Créer un canvas pour le redimensionnement et la compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible d\'obtenir le contexte 2D du canvas'));
          return;
        }

        // Dessiner l'image redimensionnée sur le canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir le canvas en Blob (format JPEG pour une meilleure compression)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erreur lors de la création du blob d\'image'));
              return;
            }

            // Créer un nouveau fichier à partir du blob
            const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], fileName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            console.log(`[ImageCompression] ${file.name} compressé: ${(file.size / 1024).toFixed(1)}KB -> ${(compressedFile.size / 1024).toFixed(1)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}
