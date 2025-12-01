# 🌍 Guide des Traductions - BABANA Partner

Guide complet du système de traductions bilingue (Français 🇫🇷 / English 🇬🇧).

## 📦 Installation

Le système est déjà configuré et prêt à l'emploi !

## 🎯 Utilisation

### 1️⃣ Importer le hook

```tsx
import { useTranslation } from '~/hooks';
```

### 2️⃣ Utiliser dans le composant

```tsx
function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t.nav.home}</h1>
      <button>{t.actions.save}</button>
    </div>
  );
}
```

L'interface change automatiquement selon la langue sélectionnée par l'utilisateur.

## 🔑 Traductions disponibles

### Navigation
```tsx
t.nav.home           // "Accueil" / "Home"
t.nav.dashboard      // "Tableau de bord" / "Dashboard"
t.nav.partners       // "Partenaires" / "Partners"
t.nav.transactions   // "Transactions" / "Transactions"
t.nav.help           // "Aide" / "Help"
```

### Actions
```tsx
t.actions.login      // "Connexion" / "Login"
t.actions.signup     // "Inscription" / "Sign Up"
t.actions.save       // "Enregistrer" / "Save"
t.actions.cancel     // "Annuler" / "Cancel"
t.actions.edit       // "Modifier" / "Edit"
t.actions.delete     // "Supprimer" / "Delete"
```

### Messages communs
```tsx
t.common.loading     // "Chargement..." / "Loading..."
t.common.error       // "Erreur" / "Error"
t.common.success     // "Succès" / "Success"
t.common.noData      // "Aucune donnée" / "No data"
```

### Formulaires
```tsx
t.forms.required          // "Ce champ est requis" / "This field is required"
t.forms.invalidEmail      // "Email invalide" / "Invalid email"
t.forms.passwordTooShort  // "Mot de passe trop court" / "Password too short"
```

## 💡 Exemples courants

### Bouton simple
```tsx
<Button>{t.actions.save}</Button>
```

### Titre de page
```tsx
<h1>{t.dashboard.title}</h1>
```

### Message d'erreur
```tsx
{error && <p className="text-red-600">{t.common.error}</p>}
```

### Placeholder de formulaire
```tsx
<Input placeholder={t.partners.searchPartners} />
```

### Navigation
```tsx
<Link to="/dashboard">{t.nav.dashboard}</Link>
```

### Statuts de transaction
```tsx
<Badge>{t.transactions.status.pending}</Badge>
<Badge>{t.transactions.status.completed}</Badge>
<Badge>{t.transactions.status.failed}</Badge>
```

## 🔄 Changer la langue

### Interface utilisateur
Cliquez sur l'icône 🌐 dans le header.

### Programmatiquement
```tsx
import { useLanguage } from '~/hooks';

function LanguageButton() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}>
      Changer de langue
    </button>
  );
}
```

## 🧪 Tester le système

1. Lancer l'application : `npm run dev`
2. Cliquer sur l'icône 🌐 dans le header
3. Choisir une langue (Français / English)
4. Observer les changements en temps réel

## ➕ Ajouter de nouvelles traductions

Éditez le fichier `app/lib/translations.ts` :

```typescript
export interface Translations {
  // ... autres sections
  
  // Nouvelle section
  profile: {
    title: string;
    editProfile: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    // ...
    profile: {
      title: "Profil",
      editProfile: "Modifier le profil",
    },
  },
  en: {
    // ...
    profile: {
      title: "Profile",
      editProfile: "Edit Profile",
    },
  },
};
```

Puis utilisez les nouvelles traductions :

```tsx
const { t } = useTranslation();
<h1>{t.profile.title}</h1>
<Button>{t.profile.editProfile}</Button>
```

## 💪 Bonnes pratiques

### ✅ À FAIRE
```tsx
// Bon
const { t } = useTranslation();
<button>{t.actions.save}</button>
```

### ❌ À ÉVITER
```tsx
// Mauvais
<button>Enregistrer</button>
```

## 🔧 Architecture

### Fichiers principaux

```
app/
├── lib/
│   └── translations.ts              # Toutes les traductions
├── hooks/
│   ├── useLanguage.tsx              # Gestion de la langue
│   └── useTranslation.tsx           # Accès aux traductions
└── components/
    ├── LanguageToggle.tsx           # Sélecteur de langue
    └── LanguageSync.tsx             # Sync avec axios
```

### Fonctionnalités

✅ **Détection automatique** de la langue du navigateur  
✅ **Persistance** dans localStorage  
✅ **Synchronisation** avec l'attribut HTML `lang`  
✅ **Header HTTP** `Accept-Language` automatique  
✅ **TypeScript** avec autocomplétion complète  
✅ **Interpolation** de variables dynamiques

## 🆘 Dépannage

**Les traductions ne s'affichent pas**  
→ Vérifier que le `LanguageProvider` enveloppe l'app dans `root.tsx`

**Erreur TypeScript**  
→ Vérifier que la clé existe dans `app/lib/translations.ts` pour les deux langues

**L'autocomplétion ne fonctionne pas**  
→ Redémarrer TypeScript : `Cmd/Ctrl + Shift + P` → "Restart TS Server"

---

**💡 Astuce :** Utilisez l'autocomplétion TypeScript (`t.`) pour découvrir toutes les traductions disponibles !

