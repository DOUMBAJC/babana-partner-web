# Guide d'utilisation de l'API - BABANA Partner Web

## 📋 Table des matières

1. [Configuration](#configuration)
2. [Architecture](#architecture)
3. [Utilisation de base](#utilisation-de-base)
4. [Gestion de la langue](#gestion-de-la-langue)
5. [Authentification](#authentification)
6. [Gestion des erreurs](#gestion-des-erreurs)
7. [Créer un service](#créer-un-service)
8. [Exemples pratiques](#exemples-pratiques)

---

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet (voir `.env.example`) :

```env
# Configuration de l'API
VITE_API_BASE_URL=https://api.babana.com
VITE_API_TIMEOUT=30000
VITE_API_KEY=your_api_key_here

# Autres configurations
VITE_APP_NAME=BABANA Partner
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

### Configuration axios

La configuration axios se trouve dans `app/lib/axios.ts` et inclut :

- **Base URL** : Définie par `VITE_API_BASE_URL`
- **Timeout** : Défini par `VITE_API_TIMEOUT` (défaut : 30 secondes)
- **Headers par défaut** : `Content-Type: application/json`
- **Intercepteurs** : Requêtes et réponses

---

## Architecture

```
app/
├── lib/
│   ├── axios.ts                    # Configuration axios + intercepteurs
│   ├── index.ts                    # Exports centralisés
│   └── services/
│       └── example.service.ts      # Services API (exemples)
├── hooks/
│   ├── useLanguage.tsx             # Hook pour gérer la langue
│   └── index.ts
└── components/
    ├── LanguageSync.tsx            # Synchronisation langue <-> axios
    └── LanguageToggle.tsx          # Composant pour changer de langue
```

---

## Utilisation de base

### Import

```tsx
import { api } from '~/lib/axios';
// ou
import { api } from '~/lib';
```

### Méthodes disponibles

```tsx
// GET
const data = await api.get('/users');
const user = await api.get('/users/123');

// POST
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// PUT
const updatedUser = await api.put('/users/123', { name: 'John Doe' });

// PATCH
const patchedUser = await api.patch('/users/123', { email: 'new@example.com' });

// DELETE
await api.delete('/users/123');
```

### Avec configuration supplémentaire

```tsx
// Headers personnalisés
const data = await api.get('/users', {
  headers: {
    'X-Custom-Header': 'value',
  },
});

// Paramètres de requête
const data = await api.get('/users', {
  params: {
    page: 1,
    limit: 20,
    search: 'john',
  },
});

// Timeout personnalisé
const data = await api.get('/users', {
  timeout: 5000, // 5 secondes
});
```

---

## Gestion de la langue

### Contexte de langue

Le hook `useLanguage` permet de gérer la langue de l'utilisateur :

```tsx
import { useLanguage } from '~/hooks';

function MyComponent() {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <p>Langue actuelle : {language}</p>
      <button onClick={() => setLanguage('fr')}>Français</button>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

### Header Accept-Language

Le header `Accept-Language` est automatiquement ajouté à toutes les requêtes axios grâce au composant `LanguageSync` monté dans `root.tsx`.

```tsx
// La requête inclut automatiquement :
// headers: { 'Accept-Language': 'fr' } ou 'en' selon la langue de l'utilisateur

const data = await api.get('/users');
```

### Composant LanguageToggle

Un composant prêt à l'emploi pour changer de langue :

```tsx
import { LanguageToggle } from '~/components';

function Header() {
  return (
    <header>
      {/* ... */}
      <LanguageToggle />
    </header>
  );
}
```

---

## Authentification

### Connexion

```tsx
import { authService } from '~/lib/services/example.service';

try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123',
  });

  console.log('Token:', response.token);
  console.log('User:', response.user);
  // Le token est automatiquement sauvegardé dans localStorage
} catch (error) {
  console.error('Erreur de connexion:', error.message);
}
```

### Token d'authentification

Le token est automatiquement :
- Sauvegardé dans `localStorage` lors de la connexion
- Ajouté au header `Authorization: Bearer {token}` pour chaque requête
- Supprimé lors de la déconnexion ou d'une erreur 401

### Déconnexion

```tsx
import { authService } from '~/lib/services/example.service';

try {
  await authService.logout();
  // Le token est automatiquement supprimé de localStorage
  // Redirigez l'utilisateur vers la page de connexion
} catch (error) {
  console.error('Erreur de déconnexion:', error.message);
}
```

---

## Gestion des erreurs

### Structure ApiError

```tsx
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
```

### Gestion des erreurs dans un composant

```tsx
import { api, ApiError } from '~/lib';
import { useState } from 'react';

function MyComponent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/users');
      console.log(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      
      // Gérer les cas spécifiques
      if (apiError.status === 401) {
        // Rediriger vers la page de connexion
      } else if (apiError.status === 403) {
        // Afficher un message d'accès refusé
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={fetchData}>Charger les données</button>
    </div>
  );
}
```

### Codes d'erreur gérés automatiquement

- **401** : Session expirée → Token supprimé
- **403** : Accès refusé
- **404** : Ressource introuvable
- **422** : Données invalides
- **429** : Trop de requêtes
- **500-504** : Erreur serveur

---

## Créer un service

### Structure d'un service

```tsx
// app/lib/services/products.service.ts
import { api, ApiError } from '../axios';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  description?: string;
}

// Service
export const productService = {
  /**
   * Récupérer tous les produits
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      return await api.get<Product[]>('/products');
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupérer un produit par ID
   */
  getProductById: async (id: string): Promise<Product> => {
    try {
      return await api.get<Product>(`/products/${id}`);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Créer un produit
   */
  createProduct: async (data: CreateProductDto): Promise<Product> => {
    try {
      return await api.post<Product>('/products', data);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Mettre à jour un produit
   */
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    try {
      return await api.patch<Product>(`/products/${id}`, data);
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Supprimer un produit
   */
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error as ApiError;
    }
  },
};
```

### Export du service

```tsx
// app/lib/index.ts
export * from './services/products.service';
```

---

## Exemples pratiques

### Exemple 1 : Liste de produits avec pagination

```tsx
import { useState, useEffect } from 'react';
import { api, ApiError } from '~/lib';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface PaginatedResponse {
  data: Product[];
  page: number;
  totalPages: number;
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<PaginatedResponse>('/products', {
          params: { page, limit: 20 },
        });
        setProducts(response.data);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}€
          </li>
        ))}
      </ul>
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
```

### Exemple 2 : Formulaire de création avec react-hook-form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, ApiError } from '~/lib';
import { Button, Input, Label } from '~/components';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      await api.post('/auth/register', data);
      setSuccess(true);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    }
  };

  if (success) {
    return <div className="text-green-500">Inscription réussie !</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Inscription...' : "S'inscrire"}
      </Button>
    </form>
  );
}
```

### Exemple 3 : Upload de fichier

```tsx
import { useState } from 'react';
import { api, ApiError } from '~/lib';
import { Button } from '~/components';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setError(null);

      // Pour un upload de fichier, on utilise directement l'instance axios
      // car FormData nécessite un Content-Type spécifique (multipart/form-data)
      const response = await api.post<{ url: string }>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedUrl(response.url);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      
      <Button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Upload en cours...' : 'Uploader'}
      </Button>

      {error && <p className="text-red-500">{error}</p>}
      {uploadedUrl && (
        <p className="text-green-500">Fichier uploadé : {uploadedUrl}</p>
      )}
    </div>
  );
}
```

---

## 🎯 Bonnes pratiques

1. **Toujours typer les réponses API** avec TypeScript
2. **Gérer les erreurs** dans chaque composant qui fait des requêtes
3. **Créer des services** pour organiser les appels API par domaine
4. **Utiliser le loading state** pour améliorer l'UX
5. **Éviter les appels API multiples** en utilisant des états globaux ou du cache
6. **Tester les erreurs** en mode développement (401, 403, 404, etc.)

---

## 📝 Notes importantes

- Le header `Accept-Language` est automatiquement ajouté selon la langue de l'utilisateur
- Le token d'authentification est automatiquement ajouté si présent dans `localStorage`
- Les logs de développement apparaissent dans la console en mode `DEV`
- Les erreurs 401 suppriment automatiquement le token
- Toutes les requêtes ont un timeout par défaut de 30 secondes

---

## 🔗 Ressources

- [Documentation Axios](https://axios-http.com/)
- [React Router 7](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

