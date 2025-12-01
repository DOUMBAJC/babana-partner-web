# 🎨 Guide shadcn/ui - Babana Partner Web

Bienvenue dans votre projet équipé de **shadcn/ui** ! Ce guide vous aidera à utiliser efficacement les composants.

## 📦 Composants Installés

Votre projet inclut actuellement **20 composants shadcn/ui** :

### Formulaires
- ✅ **Button** - Boutons avec 6 variantes (default, secondary, outline, ghost, destructive, link)
- ✅ **Input** - Champs de saisie
- ✅ **Label** - Labels de formulaire
- ✅ **Textarea** - Zone de texte multiligne
- ✅ **Checkbox** - Cases à cocher
- ✅ **Radio Group** - Groupes de boutons radio
- ✅ **Switch** - Interrupteur toggle
- ✅ **Select** - Menu déroulant

### UI & Affichage
- ✅ **Card** - Conteneur de contenu
- ✅ **Badge** - Étiquettes de statut
- ✅ **Alert** - Messages d'alerte
- ✅ **Avatar** - Images de profil
- ✅ **Separator** - Séparateur visuel
- ✅ **Table** - Tableaux de données

### Navigation & Interaction
- ✅ **Dialog** - Fenêtre modale
- ✅ **Tabs** - Onglets de navigation
- ✅ **Tooltip** - Info-bulles
- ✅ **Breadcrumb** - Fil d'Ariane
- ✅ **Dropdown Menu** - Menu déroulant
- ✅ **Popover** - Fenêtre contextuelle

## 🚀 Utilisation

### Import Simple

Tous les composants sont exportés depuis `~/components` :

```tsx
import { 
  Button, 
  Input, 
  Card, 
  Dialog 
} from '~/components';
```

### Exemples Rapides

#### Formulaire Simple

```tsx
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '~/components';

function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### Dialog (Modal)

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  Button 
} from '~/components';

function DeleteConfirmation() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Supprimer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Êtes-vous sûr ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline">Annuler</Button>
          <Button variant="destructive">Confirmer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### Select avec Options

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Label 
} from '~/components';

function CountrySelector() {
  return (
    <div className="space-y-2">
      <Label>Pays</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez un pays" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="us">États-Unis</SelectItem>
          <SelectItem value="uk">Royaume-Uni</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components';

function Settings() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Compte</TabsTrigger>
        <TabsTrigger value="password">Mot de passe</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Contenu du compte
      </TabsContent>
      <TabsContent value="password">
        Contenu mot de passe
      </TabsContent>
      <TabsContent value="settings">
        Contenu paramètres
      </TabsContent>
    </Tabs>
  );
}
```

#### Tooltip

```tsx
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger,
  Button 
} from '~/components';

function WithTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Survolez-moi</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Information utile ici</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

## 🎨 Personnalisation avec les Couleurs Babana

Les composants shadcn/ui sont configurés pour utiliser vos couleurs personnalisées :

```tsx
// Les couleurs Babana sont automatiquement appliquées
<Button>Utilise babana-cyan comme couleur primaire</Button>

// Vous pouvez aussi utiliser vos couleurs personnalisées
<div className="bg-babana-cyan text-white p-4 rounded-lg">
  Contenu avec couleur Babana
</div>

<div className="bg-babana-navy text-babana-cyan p-4 rounded-lg">
  Fond navy avec texte cyan
</div>
```

## 📍 Page de Démo

Visitez **`/demo`** pour voir tous les composants en action avec des exemples interactifs !

## ➕ Ajouter Plus de Composants

Pour ajouter de nouveaux composants shadcn/ui :

```bash
npx shadcn@latest add [nom-du-composant]
```

Exemples :
```bash
npx shadcn@latest add calendar
npx shadcn@latest add date-picker
npx shadcn@latest add command
npx shadcn@latest add slider
npx shadcn@latest add progress
```

Liste complète : https://ui.shadcn.com/docs/components

## 🔧 Utilitaires

### Fonction `cn()`

Utilisez la fonction `cn()` pour combiner des classes Tailwind :

```tsx
import { cn } from '~/lib/utils';

<div className={cn(
  "base-class",
  condition && "conditional-class",
  "another-class"
)}>
  Contenu
</div>
```

## 📖 Documentation Complète

- **shadcn/ui Docs** : https://ui.shadcn.com
- **Radix UI** : https://www.radix-ui.com
- **Tailwind CSS** : https://tailwindcss.com

## 🎯 Bonnes Pratiques

1. **Utilisez `asChild`** avec les triggers de Dialog, Tooltip, etc.
   ```tsx
   <DialogTrigger asChild>
     <Button>Ouvrir</Button>
   </DialogTrigger>
   ```

2. **Toujours wrapper Tooltip avec TooltipProvider**
   ```tsx
   <TooltipProvider>
     <Tooltip>...</Tooltip>
   </TooltipProvider>
   ```

3. **Utilisez Label avec les inputs** pour l'accessibilité
   ```tsx
   <Label htmlFor="email">Email</Label>
   <Input id="email" />
   ```

4. **Composez les composants Card correctement**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Titre</CardTitle>
       <CardDescription>Description</CardDescription>
     </CardHeader>
     <CardContent>Contenu</CardContent>
     <CardFooter>Actions</CardFooter>
   </Card>
   ```

## 🌓 Mode Sombre

Le mode sombre est automatiquement supporté ! Ajoutez simplement la classe `dark` à votre élément `<html>` :

```tsx
// Dans votre root.tsx ou layout
<html className="dark">
```

## 🚀 Prêt à Utiliser !

Tous les composants sont installés et configurés. Visitez `/demo` pour commencer à explorer !

```tsx
import { Button, Card, Input } from '~/components';
// Et commencez à construire ! 🎉
```

---

**Ressources Utiles** :
- 📘 [Documentation shadcn/ui](https://ui.shadcn.com)
- 🎨 [Personnaliser les thèmes](https://ui.shadcn.com/themes)
- 🔧 [CLI shadcn/ui](https://ui.shadcn.com/docs/cli)

