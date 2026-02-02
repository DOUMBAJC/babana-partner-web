import type { LucideIcon } from 'lucide-react';
import type { Permission, RoleSlug } from '~/types/auth.types';
import { 
  UserPlus, 
  Search, 
  Sparkles, 
  Zap, 
  ClipboardList,
  Settings,
  KeyRound,
  CreditCard,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  videoId?: string; // Identifiant de la vidéo (sera mappé à l'URL via l'API)
  code?: string;
  tips?: string[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  category: 'getting-started' | 'customers' | 'sales' | 'admin' | 'advanced';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoId?: string; // Identifiant de la vidéo principale (sera mappé à l'URL via l'API)
  steps: TutorialStep[];
  prerequisites?: string[];
  requiredPermission?: Permission;
  requiredRole?: RoleSlug;
  public?: boolean; // Si true, accessible à tous même non connectés
}

/**
 * Interface pour les liens vidéo récupérés depuis le serveur
 */
export interface TutorialVideoLinks {
  [tutorialId: string]: {
    main: string | null; // URL de la vidéo principale
    steps: {
      [stepId: string]: string | null; // URLs des vidéos par étape
    };
  };
}

export const tutorials: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Bien démarrer avec la plateforme',
    description: 'Découvrez les bases de la plateforme et apprenez à naviguer efficacement',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    category: 'getting-started',
    duration: '10 min',
    difficulty: 'beginner',
    public: true, // Accessible à tous
    steps: [
      {
        id: 1,
        title: 'Créer votre compte',
        description: 'Inscrivez-vous sur la plateforme en remplissant le formulaire d\'inscription avec vos informations personnelles.',
        videoId: 'signup',
        tips: [
          'Assurez-vous d\'utiliser une adresse email valide',
          'Choisissez un mot de passe sécurisé',
          'Vérifiez votre email après l\'inscription'
        ]
      },
      {
        id: 2,
        title: 'Comprendre le tableau de bord',
        description: 'Explorez les différentes sections du tableau de bord et familiarisez-vous avec l\'interface.',
        tips: [
          'Le menu de navigation se trouve en haut de la page',
          'Les fonctionnalités disponibles dépendent de vos permissions',
          'Utilisez la barre de recherche pour trouver rapidement ce que vous cherchez'
        ]
      },
      {
        id: 3,
        title: 'Configurer votre profil',
        description: 'Complétez votre profil avec vos informations et préférences pour une meilleure expérience.',
        tips: [
          'Ajoutez une photo de profil pour personnaliser votre compte',
          'Configurez vos notifications selon vos préférences',
          'Vérifiez régulièrement vos paramètres de sécurité'
        ]
      }
    ]
  },
  {
    id: 'create-customer',
    title: 'Créer un nouveau client',
    description: 'Enregistrez un nouveau client dans la plateforme (sans upload de documents ni utilisation de crédits)',
    icon: UserPlus,
    color: 'from-emerald-500 to-teal-500',
    category: 'customers',
    duration: '10 min',
    difficulty: 'beginner',
    requiredPermission: 'create-orders',
    steps: [
      {
        id: 1,
        title: 'Accéder au formulaire de création',
        description: 'Cliquez sur "Nouveau client" dans le menu ou sur la carte correspondante du tableau de bord.',
        tips: [
          'Cette méthode ne nécessite pas de crédits',
          'Aucun document n\'est requis pour cette création simple',
          'Pour une création complète avec documents, utilisez "Identifier un client"'
        ]
      },
      {
        id: 2,
        title: 'Remplir les informations du client',
        description: 'Complétez tous les champs obligatoires avec les informations du client : nom, prénom, numéro de pièce, type de pièce, téléphone, adresse, etc.',
        tips: [
          'Les champs marqués d\'un astérisque (*) sont obligatoires',
          'Vérifiez l\'exactitude des informations avant de soumettre',
          'Le numéro de téléphone doit être au format valide'
        ]
      },
      {
        id: 3,
        title: 'Vérifier et valider',
        description: 'Revoyez toutes les informations saisies et cliquez sur "Créer" pour enregistrer le client.',
        tips: [
          'Prenez le temps de vérifier toutes les informations',
          'Note : La modification d\'un client n\'est possible que par les administrateurs',
          'Une fois créé, vous pourrez créer des demandes d\'activation pour ce client'
        ]
      }
    ]
  },
  {
    id: 'search-customer',
    title: 'Rechercher un client',
    description: 'Recherchez un client par son numéro de pièce d\'identité et son type de pièce',
    icon: Search,
    color: 'from-blue-500 to-indigo-500',
    category: 'customers',
    duration: '8 min',
    difficulty: 'beginner',
    requiredPermission: 'view-orders',
    steps: [
      {
        id: 1,
        title: 'Accéder à la recherche',
        description: 'Cliquez sur "Recherche Client" dans le menu ou sur la carte correspondante du tableau de bord.',
        tips: [
          'La recherche se fait uniquement par pièce d\'identité',
          'Assurez-vous d\'avoir le numéro et le type de pièce du client'
        ]
      },
      {
        id: 2,
        title: 'Saisir les informations de la pièce',
        description: 'Sélectionnez le type de pièce d\'identité (CNI, Passeport, etc.) et entrez le numéro de la pièce du client.',
        tips: [
          'Le type de pièce est obligatoire',
          'Vérifiez que le numéro de pièce est correct avant de rechercher',
          'Le format du numéro dépend du type de pièce sélectionné'
        ]
      },
      {
        id: 3,
        title: 'Consulter le résultat et continuer',
        description: 'Si le client est trouvé, vous verrez ses informations. Vous pouvez ensuite continuer avec une demande d\'activation de SIM si le client n\'a pas atteint son quota maximum de 3 SIM.',
        tips: [
          'Un client peut avoir un maximum de 3 SIM',
          'Si le quota est atteint, vous ne pourrez pas créer de nouvelle demande d\'activation',
          'Si le client n\'est pas trouvé, vous pouvez le créer via "Identifier un client"'
        ]
      }
    ]
  },
  {
    id: 'identify-customer',
    title: 'Identifier un client',
    description: 'Créez un nouveau client avec upload de documents (pièces d\'identité, portrait, plan de localisation) en utilisant vos crédits',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
    category: 'customers',
    duration: '15 min',
    difficulty: 'intermediate',
    requiredPermission: 'create-orders',
    prerequisites: ['Avoir des crédits disponibles'],
    steps: [
      {
        id: 1,
        title: 'Vérifier vos crédits',
        description: 'Assurez-vous d\'avoir au moins 1 crédit disponible dans votre portefeuille. Chaque identification consomme 1 crédit.',
        tips: [
          'Vérifiez votre solde dans la section "Crédits"',
          'Rechargez votre compte si nécessaire',
          'L\'identification ne peut pas être effectuée sans crédits'
        ]
      },
      {
        id: 2,
        title: 'Remplir les informations du client',
        description: 'Complétez le formulaire avec les informations du client : nom, prénom, numéro de pièce d\'identité, type de pièce, téléphone, adresse, etc.',
        tips: [
          'Tous les champs marqués d\'un astérisque (*) sont obligatoires',
          'Vérifiez l\'exactitude du numéro de pièce selon le type sélectionné',
          'L\'email est optionnel mais recommandé'
        ]
      },
      {
        id: 3,
        title: 'Uploader les documents requis',
        description: 'Téléchargez les 4 documents obligatoires : recto de la pièce d\'identité, verso de la pièce d\'identité, photo portrait du client, et plan de localisation.',
        tips: [
          'Les fichiers doivent être au format image (JPG, PNG)',
          'Assurez-vous que les documents sont lisibles et de bonne qualité',
          'Le plan de localisation doit montrer l\'emplacement précis du client'
        ]
      },
      {
        id: 4,
        title: 'Valider et confirmer',
        description: 'Revoyez toutes les informations et documents, puis cliquez sur "Identifier" pour créer le client. Le crédit sera débité automatiquement.',
        tips: [
          'Vérifiez que tous les documents sont bien uploadés',
          'Une fois validé, le client sera créé et vous pourrez créer une demande d\'activation',
          'Vous recevrez une confirmation de la création du client'
        ]
      }
    ]
  },
  {
    id: 'sim-activation',
    title: 'Gérer les activations de SIM',
    description: 'Gérez vos requêtes d\'activation de SIM : modifiez, rejetez ou annulez les demandes selon les besoins',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    category: 'sales',
    duration: '20 min',
    difficulty: 'intermediate',
    videoId: 'vente-sim',
    requiredRole: 'ba',
    steps: [
      {
        id: 1,
        title: 'Accéder à vos requêtes d\'activation',
        description: 'Ouvrez la section "Activation SIM" ou "Requêtes" pour voir toutes vos demandes d\'activation de SIM.',
        tips: [
          'Seuls les BA (Brand Ambassadors) et utilisateurs avec ce rôle peuvent gérer leurs requêtes',
          'Vous verrez uniquement les requêtes que vous avez créées'
        ]
      },
      {
        id: 2,
        title: 'Consulter les détails d\'une requête',
        description: 'Cliquez sur une requête pour voir tous ses détails : informations du client, numéro de SIM, statut, date de création, etc.',
        tips: [
          'Les requêtes peuvent avoir différents statuts : en attente, approuvée, rejetée, annulée',
          'Vérifiez les informations avant de prendre une action'
        ]
      },
      {
        id: 3,
        title: 'Modifier une requête',
        description: 'Si vous devez corriger des informations, utilisez l\'option "Modifier" pour mettre à jour les détails de la requête.',
        tips: [
          'Vous pouvez modifier une requête tant qu\'elle n\'est pas encore traitée',
          'Vérifiez l\'exactitude des nouvelles informations avant de sauvegarder'
        ]
      },
      {
        id: 4,
        title: 'Rejeter ou annuler une requête',
        description: 'Si le client et vous n\'êtes plus d\'accord sur la vente ou pour toute autre raison, vous pouvez rejeter ou annuler la requête.',
        tips: [
          'L\'annulation peut être nécessaire si le client change d\'avis',
          'La rejet peut être utilisé si les informations sont incorrectes',
          'Ces actions libèrent le quota du client pour de nouvelles demandes'
        ]
      }
    ]
  },
  {
    id: 'manage-activations',
    title: 'Traiter les demandes d\'activation',
    description: 'Découvrez comment traiter et approuver les demandes d\'activation en attente',
    icon: ClipboardList,
    color: 'from-purple-500 to-violet-500',
    category: 'sales',
    duration: '15 min',
    difficulty: 'intermediate',
    requiredPermission: 'process-requests',
    prerequisites: ['Permission de traitement des demandes'],
    steps: [
      {
        id: 1,
        title: 'Accéder aux demandes en attente',
        description: 'Ouvrez la liste des demandes d\'activation et filtrez pour voir celles en attente.',
        tips: [
          'Utilisez les filtres pour trouver rapidement les demandes à traiter',
          'Les demandes sont triées par date de création'
        ]
      },
      {
        id: 2,
        title: 'Examiner les détails de la demande',
        description: 'Cliquez sur une demande pour voir tous ses détails et vérifier les informations.',
        tips: [
          'Vérifiez toutes les informations avant d\'approuver',
          'Contactez le client si des informations sont manquantes ou incorrectes'
        ]
      },
      {
        id: 3,
        title: 'Approuver ou rejeter la demande',
        description: 'Après vérification, approuvez la demande si tout est correct, ou rejetez-la avec un commentaire si nécessaire.',
        tips: [
          'Ajoutez un commentaire si vous rejetez une demande',
          'Les demandes approuvées sont automatiquement traitées'
        ]
      }
    ]
  },
  {
    id: 'manage-credits',
    title: 'Gérer vos crédits',
    description: 'Apprenez à recharger votre compte et à suivre vos dépenses de crédits',
    icon: CreditCard,
    color: 'from-green-500 to-emerald-500',
    category: 'getting-started',
    duration: '10 min',
    difficulty: 'beginner',
    public: true, // Accessible à tous les utilisateurs connectés
    steps: [
      {
        id: 1,
        title: 'Accéder à votre portefeuille',
        description: 'Ouvrez la section "Crédits" depuis le menu pour voir votre solde actuel.',
        tips: [
          'Votre solde s\'affiche en temps réel',
          'Vous pouvez voir l\'historique de vos transactions'
        ]
      },
      {
        id: 2,
        title: 'Recharger votre compte',
        description: 'Cliquez sur "Recharger" et suivez les instructions pour ajouter des crédits à votre compte.',
        tips: [
          'Plusieurs méthodes de paiement sont disponibles',
          'La recharge est instantanée après validation du paiement'
        ]
      },
      {
        id: 3,
        title: 'Consulter l\'historique',
        description: 'Parcourez votre historique de transactions pour suivre vos dépenses et recharges.',
        tips: [
          'Vous pouvez filtrer par type de transaction',
          'Exportez vos relevés si nécessaire'
        ]
      }
    ]
  },
  {
    id: 'support-tickets',
    title: 'Créer un ticket de support',
    description: 'Apprenez à créer et suivre vos tickets de support pour obtenir de l\'aide',
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-500',
    category: 'getting-started',
    duration: '8 min',
    difficulty: 'beginner',
    public: true, // Accessible à tous les utilisateurs connectés
    steps: [
      {
        id: 1,
        title: 'Accéder au support',
        description: 'Cliquez sur "Support" dans le menu pour accéder à la section d\'aide.',
        tips: [
          'Vous pouvez également accéder au support depuis le tableau de bord',
          'Consultez d\'abord la FAQ pour des réponses rapides'
        ]
      },
      {
        id: 2,
        title: 'Créer un nouveau ticket',
        description: 'Cliquez sur "Nouveau ticket" et remplissez le formulaire avec votre question ou problème.',
        tips: [
          'Soyez précis dans votre description',
          'Ajoutez des captures d\'écran si nécessaire',
          'Sélectionnez la catégorie appropriée'
        ]
      },
      {
        id: 3,
        title: 'Suivre votre ticket',
        description: 'Consultez la liste de vos tickets pour voir les réponses et mettre à jour votre demande si besoin.',
        tips: [
          'Vous recevrez une notification lorsqu\'une réponse est ajoutée',
          'Vous pouvez répondre aux messages pour continuer la conversation'
        ]
      }
    ]
  },
  {
    id: 'admin-settings',
    title: 'Paramètres administrateur',
    description: 'Guide complet pour gérer les paramètres système en tant qu\'administrateur',
    icon: Settings,
    color: 'from-slate-700 to-gray-800',
    category: 'admin',
    duration: '25 min',
    difficulty: 'advanced',
    requiredPermission: 'admin-access',
    prerequisites: ['Accès administrateur'],
    steps: [
      {
        id: 1,
        title: 'Accéder aux paramètres',
        description: 'Ouvrez la section "Administration" puis "Paramètres" pour accéder aux configurations système.',
        tips: [
          'Seuls les administrateurs peuvent accéder à cette section',
          'Faites attention aux modifications que vous effectuez'
        ]
      },
      {
        id: 2,
        title: 'Configurer les paramètres généraux',
        description: 'Modifiez les paramètres généraux de la plateforme selon vos besoins.',
        tips: [
          'Sauvegardez régulièrement vos modifications',
          'Testez les changements avant de les appliquer en production'
        ]
      },
      {
        id: 3,
        title: 'Gérer les utilisateurs et permissions',
        description: 'Configurez les rôles et permissions des utilisateurs de la plateforme.',
        tips: [
          'Vérifiez les permissions avant de les attribuer',
          'Documentez les changements de permissions importants'
        ]
      }
    ]
  },
  {
    id: 'reports-analytics',
    title: 'Générer des rapports',
    description: 'Apprenez à créer et exporter des rapports pour analyser vos données',
    icon: BarChart3,
    color: 'from-indigo-500 to-purple-500',
    category: 'advanced',
    duration: '18 min',
    difficulty: 'intermediate',
    requiredPermission: 'view-reports',
    steps: [
      {
        id: 1,
        title: 'Accéder aux rapports',
        description: 'Ouvrez la section "Rapports" depuis le menu administrateur.',
        tips: [
          'Les rapports peuvent prendre du temps à générer',
          'Vous pouvez filtrer les données selon vos besoins'
        ]
      },
      {
        id: 2,
        title: 'Sélectionner le type de rapport',
        description: 'Choisissez le type de rapport que vous souhaitez générer (ventes, clients, activations, etc.).',
        tips: [
          'Chaque type de rapport affiche des données différentes',
          'Vous pouvez personnaliser les colonnes affichées'
        ]
      },
      {
        id: 3,
        title: 'Exporter le rapport',
        description: 'Une fois le rapport généré, exportez-le au format souhaité (PDF, Excel, CSV).',
        tips: [
          'Les rapports exportés contiennent toutes les données filtrées',
          'Vous pouvez programmer des rapports automatiques'
        ]
      }
    ]
  },
  {
    id: 'manage-account',
    title: 'Gérer votre compte',
    description: 'Apprenez à gérer vos informations personnelles, sécurité, sessions et préférences de compte',
    icon: Settings,
    color: 'from-violet-500 to-purple-500',
    category: 'getting-started',
    duration: '12 min',
    difficulty: 'beginner',
    public: true, // Accessible à tous les utilisateurs connectés
    steps: [
      {
        id: 1,
        title: 'Accéder à votre profil',
        description: 'Cliquez sur votre nom dans le menu en haut à droite, puis sélectionnez "Mon Profil" pour accéder à la gestion de votre compte.',
        tips: [
          'Vous pouvez également accéder au profil via l\'icône utilisateur',
          'Toutes les sections de gestion sont accessibles depuis cette page'
        ]
      },
      {
        id: 2,
        title: 'Modifier vos informations générales',
        description: 'Dans l\'onglet "Général", modifiez vos informations personnelles : nom, prénom, email, téléphone, photo de profil, etc.',
        tips: [
          'Votre photo de profil permet de personnaliser votre compte',
          'Assurez-vous que votre email est valide pour recevoir les notifications',
          'Sauvegardez vos modifications après chaque changement'
        ]
      },
      {
        id: 3,
        title: 'Gérer votre sécurité',
        description: 'Dans l\'onglet "Sécurité", modifiez votre mot de passe, activez l\'authentification à deux facteurs si disponible, et consultez vos sessions actives.',
        videoId: 'reset-password',
        tips: [
          'Choisissez un mot de passe fort et unique',
          'Vous pouvez révoquer les sessions actives sur d\'autres appareils',
          'Changez régulièrement votre mot de passe pour plus de sécurité'
        ]
      },
      {
        id: 4,
        title: 'Configurer vos préférences',
        description: 'Dans l\'onglet "Préférences", configurez votre langue préférée, votre thème (clair/sombre), et vos paramètres de notifications.',
        tips: [
          'La langue choisie s\'applique à toute l\'interface',
          'Le thème sombre réduit la fatigue oculaire',
          'Configurez les notifications selon vos besoins'
        ]
      },
      {
        id: 5,
        title: 'Gérer vos sessions',
        description: 'Consultez toutes vos sessions actives, voyez où et quand vous êtes connecté, et révoquez les sessions suspectes ou non désirées.',
        tips: [
          'Vérifiez régulièrement vos sessions actives',
          'Révoquez immédiatement toute session suspecte',
          'Déconnectez-vous toujours sur les appareils partagés'
        ]
      }
    ]
  }
];

import type { Translations } from '~/lib/i18n/translations';

/**
 * Traduit un tutoriel selon la langue
 */
export function translateTutorial(tutorial: Tutorial, t: Translations['pages']['tutorials']): Tutorial {
  const tutorialData = t.items[tutorial.id];
  if (!tutorialData) {
    return tutorial; // Retourne le tutoriel original si pas de traduction
  }

  return {
    ...tutorial,
    title: tutorialData.title,
    description: tutorialData.description,
    prerequisites: tutorialData.prerequisites,
    steps: tutorial.steps.map(step => {
      const stepData = tutorialData.steps[step.id];
      if (!stepData) return step;
      return {
        ...step,
        title: stepData.title,
        description: stepData.description,
        tips: stepData.tips || step.tips,
      };
    }),
  };
}

/**
 * Traduit une liste de tutoriels
 */
export function translateTutorials(tutorialsList: Tutorial[], t: Translations['pages']['tutorials']): Tutorial[] {
  return tutorialsList.map(tutorial => translateTutorial(tutorial, t));
}

export function getTutorialById(id: string): Tutorial | undefined {
  return tutorials.find(t => t.id === id);
}

export function getTutorialsByCategory(category: Tutorial['category']): Tutorial[] {
  return tutorials.filter(t => t.category === category);
}

/**
 * Filtre les tutoriels selon les permissions de l'utilisateur
 */
export function getAccessibleTutorials(
  user: { roles?: string[] } | null,
  hasPermission: (permission: Permission) => boolean,
  isAdmin: () => boolean
): Tutorial[] {
  return tutorials.filter(tutorial => {
    // Tutoriels publics accessibles à tous
    if (tutorial.public) {
      return true;
    }

    // Si pas d'utilisateur connecté, seulement les tutoriels publics
    if (!user) {
      return false;
    }

    // Si tutoriel nécessite un rôle spécifique
    if (tutorial.requiredRole) {
      return user.roles?.includes(tutorial.requiredRole) ?? false;
    }

    // Si tutoriel nécessite une permission spécifique
    if (tutorial.requiredPermission) {
      // Les admins ont accès à tout sauf si spécifiquement restreint
      if (tutorial.requiredPermission === 'admin-access') {
        return isAdmin();
      }
      return hasPermission(tutorial.requiredPermission);
    }

    // Par défaut, accessible si connecté
    return true;
  });
}

