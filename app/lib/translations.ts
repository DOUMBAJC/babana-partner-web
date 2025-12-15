// Système de traductions pour l'application BABANA Partner

export type Language = "fr" | "en";

export interface Translations {
  // Auth
  auth: {
    login: {
      title: string;
      subtitle: string;
    };
    register: {
      title: string;
      subtitle: string;
    };
  };
  // Navigation
  nav: {
    home: string;
    dashboard: string;
    partners: string;
    transactions: string;
    help: string;
  };
  // Actions
  actions: {
    login: string;
    signup: string;
    logout: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
  };
  // Commun
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    noData: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    serverError: string;
    networkError: string;
    validationError: string;
    sessionExpired: string;
    accessDenied: string;
    resourceNotFound: string;
    invalidData: string;
    tooManyRequests: string;
    unableToContactServer: string;
    errorPreparingRequest: string;
  };
  // Header
  header: {
    menuAriaLabel: string;
    changeLanguage: string;
    changeTheme: string;
    userMenu: string;
  };
  // Footer
  footer: {
    copyright: string;
    allRightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
    contact: string;
  };
  // Home
  home: {
    title: string;
    subtitle: string;
    welcomeMessage: string;
    getStarted: string;
    learnMore: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    overview: string;
    statistics: string;
    recentActivity: string;
    quickActions: string;
  };
  // Partners
  partners: {
    title: string;
    addPartner: string;
    editPartner: string;
    deletePartner: string;
    partnerDetails: string;
    noPartners: string;
    searchPartners: string;
  };
  // Transactions
  transactions: {
    title: string;
    newTransaction: string;
    transactionDetails: string;
    status: {
      pending: string;
      completed: string;
      failed: string;
      cancelled: string;
    };
    noTransactions: string;
    amount: string;
    date: string;
    reference: string;
  };
  // Forms
  forms: {
    required: string;
    invalidEmail: string;
    invalidPhone: string;
    passwordTooShort: string;
    passwordMismatch: string;
    fieldRequired: string;
  };
  // Languages
  languages: {
    french: string;
    english: string;
  };
  // Theme
  theme: {
    light: string;
    dark: string;
    system: string;
  };
  // 404 Page
  notFound: {
    title: string;
    errorCode: string;
    description: string;
    message: string;
    goBack: string;
    goHome: string;
    suggestions: {
      title: string;
      checkUrl: string;
      useNavigation: string;
      contact: string;
    };
  };
  // Pages Metadata
  pages: {
    home: {
      title: string;
      description: string;
    };
    login: {
      title: string;
      description: string;
    };
    register: {
      title: string;
      description: string;
    };
    forgotPassword: {
      title: string;
      description: string;
    };
    resetPassword: {
      title: string;
      description: string;
    };
    admin: {
      title: string;
      description: string;
    };
    notFound: {
      title: string;
      description: string;
    };
    unauthorized: {
      title: string;
      description: string;
    };
    rolesMatrix: {
      title: string;
      description: string;
    };
    customers: {
      search: {
        title: string;
        description: string;
      };
      create: {
        title: string;
        description: string;
      };
    };
    sales: {
      activation: {
        title: string;
        description: string;
      };
    };
  };
  // Rôles
  roles: Record<string, {
    name: string;
    description: string;
  }>;
  // Permissions
  permissionGroups: Record<string, string>;
  permissions: Record<string, {
    name: string;
    description: string;
  }>;
  // Matrix Page specific
  matrix: {
    title: string;
    subtitle: string;
    systemDocs: string;
    accessLevel: {
      unlimited: string;
      limited: string;
    };
    manageRole: string;
    status: string;
    keyPoints: string;
    active: string;
  };
  // Customer Search
  customerSearch: {
    title: string;
    subtitle: string;
    securePortal: string;
    searchCriteria: string;
    fillFields: string;
    advancedSearch: string;
    standardSearch: string;
    fields: {
      idCard: string;
      idCardPlaceholder: string;
      name: string;
      namePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
    };
    searchButton: string;
    searching: string;
    accessDenied: {
      title: string;
      message: string;
      backHome: string;
    };
    results: {
      notFound: string;
      notFoundMessage: string;
      createCustomer: string;
      cancel: string;
      found: string;
      foundMessage: string;
      sellSim: string;
      newSearch: string;
    };
  };
  // Customer Create
  customerCreate: {
    title: string;
    subtitle: string;
    personalInfo: string;
    contactInfo: string;
    fields: {
      firstName: string;
      lastName: string;
      idCard: string;
      phone: string;
      email: string;
      address: string;
    };
    success: string;
    save: string;
  };
  // SIM Activation
  simActivation: {
    title: string;
    subtitle: string;
    customerInfo: string;
    simInfo: string;
    fields: {
      simNumber: string;
      simNumberPlaceholder: string;
      iccid: string;
      iccidPlaceholder: string;
      imei: string;
      imeiPlaceholder: string;
      notes: string;
      notesPlaceholder: string;
    };
    errors: {
      simNumber: string;
      iccid: string;
      imei: string;
      required: string;
    };
    activate: string;
    success: string;
    backToSearch: string;
  };
};

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      home: "Accueil",
      dashboard: "Tableau de bord",
      partners: "Partenaires",
      transactions: "Transactions",
      help: "Aide",
    },
    actions: {
      login: "Connexion",
      signup: "Inscription",
      logout: "Déconnexion",
      save: "Enregistrer",
      cancel: "Annuler",
      edit: "Modifier",
      delete: "Supprimer",
      confirm: "Confirmer",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      export: "Exporter",
      import: "Importer",
      refresh: "Actualiser",
    },
    auth: {
      login: {
        title: "Connexion",
        subtitle: "Connectez-vous à votre compte",
      },
      register: {
        title: "Créer un compte",
        subtitle: "Inscrivez-vous pour accéder à BABANA Partner",
      },
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      warning: "Attention",
      info: "Information",
      noData: "Aucune donnée disponible",
      notFound: "Non trouvé",
      unauthorized: "Non autorisé",
      forbidden: "Accès refusé",
      serverError: "Erreur serveur",
      networkError: "Erreur réseau",
      validationError: "Erreur de validation",
      sessionExpired: "Session expirée, veuillez vous reconnecter",
      accessDenied: "Accès refusé",
      resourceNotFound: "Ressource introuvable",
      invalidData: "Données invalides",
      tooManyRequests: "Trop de requêtes, veuillez réessayer plus tard",
      unableToContactServer: "Impossible de contacter le serveur",
      errorPreparingRequest: "Erreur lors de la préparation de la requête",
    },
    header: {
      menuAriaLabel: "Menu de navigation",
      changeLanguage: "Changer de langue",
      changeTheme: "Changer le thème",
      userMenu: "Menu utilisateur",
    },
    footer: {
      copyright: "© {year} BABANA.",
      allRightsReserved: "Tous droits réservés.",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions d'utilisation",
      contact: "Contact",
    },
    home: {
      title: "Bienvenue sur BABANA Mobile",
      subtitle: "Gérez vos ventes de SIM en toute simplicité",
      welcomeMessage: "Bienvenue sur votre espace vente de SIM BABANA Mobile",
      getStarted: "Commencer",
      learnMore: "En savoir plus",
    },
    dashboard: {
      title: "Tableau de bord",
      overview: "Vue d'ensemble",
      statistics: "Statistiques",
      recentActivity: "Activité récente",
      quickActions: "Actions rapides",
    },
    partners: {
      title: "Partenaires",
      addPartner: "Ajouter un partenaire",
      editPartner: "Modifier le partenaire",
      deletePartner: "Supprimer le partenaire",
      partnerDetails: "Détails du partenaire",
      noPartners: "Aucun partenaire",
      searchPartners: "Rechercher un partenaire",
    },
    transactions: {
      title: "Transactions",
      newTransaction: "Nouvelle transaction",
      transactionDetails: "Détails de la transaction",
      status: {
        pending: "En attente",
        completed: "Terminée",
        failed: "Échouée",
        cancelled: "Annulée",
      },
      noTransactions: "Aucune transaction",
      amount: "Montant",
      date: "Date",
      reference: "Référence",
    },
    forms: {
      required: "Ce champ est requis",
      invalidEmail: "Adresse e-mail invalide",
      invalidPhone: "Numéro de téléphone invalide",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      fieldRequired: "Champ requis",
    },
    languages: {
      french: "Français",
      english: "English",
    },
    theme: {
      light: "Clair",
      dark: "Sombre",
      system: "Système",
    },
    notFound: {
      title: "Page introuvable",
      errorCode: "Erreur 404",
      description: "Oups ! La page que vous recherchez semble avoir disparu dans l'espace numérique.",
      message: "Il semble que cette page n'existe pas ou a été déplacée.",
      goBack: "Retour",
      goHome: "Retour à l'accueil",
      suggestions: {
        title: "Que pouvez-vous faire ?",
        checkUrl: "Vérifiez l'URL pour détecter les erreurs de frappe",
        useNavigation: "Utilisez la navigation pour trouver ce que vous cherchez",
        contact: "Contactez-nous si vous pensez qu'il s'agit d'une erreur",
      },
    },
    pages: {
      home: {
        title: "BABANA - Plateforme Partenaire",
        description: "Plateforme partenaire BABANA ETS DAIROU pour une gestion moderne et efficace de vos ventes SIM et partenaires",
      },
      login: {
        title: "Connexion - BABANA Partner",
        description: "Connectez-vous à votre espace partenaire BABANA pour gérer vos activités",
      },
      register: {
        title: "Inscription - BABANA Partner",
        description: "Créez votre compte partenaire BABANA et commencez à gérer vos ventes",
      },
      forgotPassword: {
        title: "Mot de passe oublié - BABANA Partner",
        description: "Réinitialisez votre mot de passe BABANA Partner",
      },
      resetPassword: {
        title: "Réinitialisation - BABANA Partner",
        description: "Définissez votre nouveau mot de passe BABANA Partner",
      },
      admin: {
        title: "Administration - BABANA Partner",
        description: "Panneau d'administration de la plateforme BABANA Partner",
      },
      notFound: {
        title: "Page introuvable - BABANA Partner",
        description: "La page que vous recherchez n'existe pas",
      },
      unauthorized: {
        title: "Accès refusé - BABANA Partner",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
      },
      rolesMatrix: {
        title: "Matrice des Rôles - BABANA Partner",
        description: "Matrice détaillée des rôles et permissions de la plateforme",
      },
      customers: {
        search: {
          title: "Recherche de Clients - BABANA Partner",
          description: "Recherchez des clients dans la plateforme BABANA Partner",
        },
        create: {
          title: "Création de Client - BABANA Partner",
          description: "Créez un nouveau client dans la plateforme BABANA Partner",
        },
      },
      sales: {
        activation: {
          title: "Activation - BABANA Partner",
          description: "Activez un client dans la plateforme BABANA Partner",
        },
      },
    },
    roles: {
      super_admin: { name: "Super Administrateur", description: "Accès complet à toutes les fonctionnalités de la plateforme" },
      admin: { name: "Administrateur", description: "Accès à la plupart des fonctionnalités administratives" },
      ba: { name: "Brand Ambassador (BA)", description: "Ambassadeur de marque avec accès aux fonctionnalités de base" },
      activateur: { name: "Activateur", description: "Gère et traite les requêtes des BA" },
      pos: { name: "Point de Vente (POS)", description: "Point de vente avec les droits des BA et des droits supplémentaires" },
      dsm: { name: "District Sales Manager (DSM)", description: "Gère les points de vente (POS)" },
      vendeur: { name: "Vendeur", description: "Vend les produits aux BA" },
      customer: { name: "Client", description: "Client de la plateforme" },
      autre: { name: "Autre", description: "Utilisateur avec accès limité à la gestion de leurs tâches" },
    },
    permissionGroups: {
      users: "Utilisateurs",
      products: "Produits",
      orders: "Commandes",
      requests: "Requêtes & Demandes",
      inventory: "Stocks & Inventaire",
      reports: "Rapports & Analytics",
      sales: "Ventes",
      pos: "Points de Vente",
      tasks: "Tâches",
      system: "Administration Système",
    },
    permissions: {
      "view-users": { name: "Voir les utilisateurs", description: "Permet de voir la liste des utilisateurs" },
      "create-users": { name: "Créer des utilisateurs", description: "Permet de créer de nouveaux utilisateurs" },
      "edit-users": { name: "Modifier des utilisateurs", description: "Permet de modifier les informations des utilisateurs" },
      "delete-users": { name: "Supprimer des utilisateurs", description: "Permet de supprimer des utilisateurs" },
      "view-products": { name: "Voir les produits", description: "Permet de voir la liste des produits" },
      "create-products": { name: "Créer des produits", description: "Permet de créer de nouveaux produits" },
      "edit-products": { name: "Modifier des produits", description: "Permet de modifier les produits" },
      "delete-products": { name: "Supprimer des produits", description: "Permet de supprimer des produits" },
      "view-orders": { name: "Voir les commandes", description: "Permet de voir les commandes" },
      "create-orders": { name: "Créer des commandes", description: "Permet de créer des commandes" },
      "edit-orders": { name: "Modifier des commandes", description: "Permet de modifier des commandes" },
      "delete-orders": { name: "Supprimer des commandes", description: "Permet de supprimer des commandes" },
      "approve-orders": { name: "Valider des commandes", description: "Permet de valider des commandes" },
      "view-requests": { name: "Voir les requêtes", description: "Permet de voir les requêtes des BA" },
      "create-requests": { name: "Créer des requêtes", description: "Permet de créer des requêtes" },
      "process-requests": { name: "Traiter des requêtes", description: "Permet de traiter les requêtes des BA" },
      "approve-requests": { name: "Approuver des requêtes", description: "Permet d'approuver des requêtes" },
      "reject-requests": { name: "Rejeter des requêtes", description: "Permet de rejeter des requêtes" },
      "view-inventory": { name: "Voir les stocks", description: "Permet de voir l'état des stocks" },
      "manage-inventory": { name: "Gérer les stocks", description: "Permet de gérer les stocks" },
      "view-reports": { name: "Voir les rapports", description: "Permet de voir les rapports" },
      "create-reports": { name: "Créer des rapports", description: "Permet de créer des rapports" },
      "export-reports": { name: "Exporter des rapports", description: "Permet d'exporter des rapports" },
      "view-sales": { name: "Voir les ventes", description: "Permet de voir les ventes" },
      "create-sales": { name: "Créer des ventes", description: "Permet de créer des ventes" },
      "edit-sales": { name: "Modifier des ventes", description: "Permet de modifier des ventes" },
      "manage-pos": { name: "Gérer les POS", description: "Permet de gérer les points de vente" },
      "view-pos": { name: "Voir les POS", description: "Permet de voir les points de vente" },
      "view-own-tasks": { name: "Voir ses tâches", description: "Permet de voir ses propres tâches" },
      "manage-own-tasks": { name: "Gérer ses tâches", description: "Permet de gérer ses propres tâches" },
      "view-all-tasks": { name: "Voir toutes les tâches", description: "Permet de voir toutes les tâches" },
      "assign-tasks": { name: "Assigner des tâches", description: "Permet d'assigner des tâches" },
      "manage-roles": { name: "Gérer les rôles", description: "Permet de gérer les rôles et permissions" },
      "manage-settings": { name: "Gérer les paramètres", description: "Permet de gérer les paramètres système" },
      "admin-access": { name: "Accès administrateur", description: "Accès complet à l'administration" },
    },
    matrix: {
      title: "Rôles & Permissions",
      subtitle: "Matrice détaillée des droits d'accès pour chaque rôle de la plateforme Babana.",
      systemDocs: "Documentation Système",
      status: "Statut",
      accessLevel: {
        unlimited: "Accès Illimité",
        limited: "{count} Permissions Actives",
      },
      manageRole: "Gérer ce rôle (Admin)",
      keyPoints: "Points Clés",
      active: "Active",
    },
    customerSearch: {
      title: "Recherche Client",
      subtitle: "Accédez rapidement aux informations clients pour faciliter vos opérations.",
      securePortal: "Portail Partenaire Sécurisé",
      searchCriteria: "Critères de Recherche",
      fillFields: "Utilisez les filtres ci-dessous pour trouver un client.",
      advancedSearch: "Recherche Avancée",
      standardSearch: "Recherche Standard",
      fields: {
        idCard: "Numéro CNI / Identifiant",
        idCardPlaceholder: "Ex: AA233445566",
        name: "Nom Complet",
        namePlaceholder: "Nom du client",
        phone: "Téléphone",
        phonePlaceholder: "Ex: 622037000",
      },
      searchButton: "Lancer la recherche",
      searching: "Recherche en cours...",
      accessDenied: {
        title: "Accès Refusé",
        message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        backHome: "Retour à l'accueil",
      },
      results: {
        notFound: "Client non trouvé",
        notFoundMessage: "Aucun client ne correspond à ces critères.",
        createCustomer: "Créer un nouveau client",
        cancel: "Annuler",
        found: "Client Vérifié",
        foundMessage: "Ce client est enregistré dans la base de données.",
        sellSim: "Vendre une SIM",
        newSearch: "Nouvelle Recherche",
      }
    },
    customerCreate: {
      title: "Nouveau Client",
      subtitle: "Enregistrez un nouveau client pour effectuer des opérations.",
      personalInfo: "Informations Personnelles",
      contactInfo: "Coordonnées",
      fields: {
        firstName: "Prénom",
        lastName: "Nom",
        idCard: "Numéro CNI",
        phone: "Téléphone",
        email: "Email (Optionnel)",
        address: "Adresse (Optionnel)",
      },
      success: "Client créé avec succès !",
      save: "Enregistrer Client",
    },
    simActivation: {
      title: "Activation SIM",
      subtitle: "Remplissez le formulaire pour activer une nouvelle carte SIM",
      customerInfo: "Informations Client",
      simInfo: "Informations SIM",
      fields: {
        simNumber: "Numéro SIM",
        simNumberPlaceholder: "9 chiffres commençant par 62...",
        iccid: "ICCID",
        iccidPlaceholder: "19 chiffres commençant par 6240501000...",
        imei: "IMEI",
        imeiPlaceholder: "15 chiffres...",
        notes: "Notes (Optionnel)",
        notesPlaceholder: "Ajouter des notes pertinentes ici...",
      },
      errors: {
        simNumber: "Doit contenir 9 chiffres et commencer par 62",
        iccid: "Doit contenir 19 chiffres et commencer par 6240501000",
        imei: "Doit contenir exactement 15 chiffres",
        required: "Ce champ est requis",
      },
      activate: "Activer la SIM",
      success: "Demande d'activation SIM soumise avec succès !",
      backToSearch: "Retour à la recherche client",
    },
  },
  en: {
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      partners: "Partners",
      transactions: "Transactions",
      help: "Help",
    },
    actions: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      export: "Export",
      import: "Import",
      refresh: "Refresh",
    },
    auth: {
      login: {
        title: "Login",
        subtitle: "Sign in to your account",
      },
      register: {
        title: "Create an account",
        subtitle: "Sign up to access BABANA Partner",
      },
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information",
      noData: "No data available",
      notFound: "Not found",
      unauthorized: "Unauthorized",
      forbidden: "Access denied",
      serverError: "Server error",
      networkError: "Network error",
      validationError: "Validation error",
      sessionExpired: "Session expired, please reconnect",
      accessDenied: "Access denied",
      resourceNotFound: "Resource not found",
      invalidData: "Invalid data",
      tooManyRequests: "Too many requests, please try again later",
      unableToContactServer: "Unable to contact the server",
      errorPreparingRequest: "Error preparing request",
    },
    header: {
      menuAriaLabel: "Navigation menu",
      changeLanguage: "Change language",
      changeTheme: "Change theme",
      userMenu: "User menu",
    },
    footer: {
      copyright: "© {year} BABANA.",
      allRightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      contact: "Contact",
    },
    home: {
      title: "Welcome to BABANA Mobile",
      subtitle: "Manage your SIM sales with ease",
      welcomeMessage: "Welcome to your BABANA Mobile sales space",
      getStarted: "Get Started",
      learnMore: "Learn More",
    },
    dashboard: {
      title: "Dashboard",
      overview: "Overview",
      statistics: "Statistics",
      recentActivity: "Recent Activity",
      quickActions: "Quick Actions",
    },
    partners: {
      title: "Partners",
      addPartner: "Add Partner",
      editPartner: "Edit Partner",
      deletePartner: "Delete Partner",
      partnerDetails: "Partner Details",
      noPartners: "No partners",
      searchPartners: "Search partners",
    },
    transactions: {
      title: "Transactions",
      newTransaction: "New Transaction",
      transactionDetails: "Transaction Details",
      status: {
        pending: "Pending",
        completed: "Completed",
        failed: "Failed",
        cancelled: "Cancelled",
      },
      noTransactions: "No transactions",
      amount: "Amount",
      date: "Date",
      reference: "Reference",
    },
    forms: {
      required: "This field is required",
      invalidEmail: "Invalid email address",
      invalidPhone: "Invalid phone number",
      passwordTooShort: "Password must be at least 8 characters",
      passwordMismatch: "Passwords do not match",
      fieldRequired: "Required field",
    },
    languages: {
      french: "Français",
      english: "English",
    },
    theme: {
      light: "Light",
      dark: "Dark",
      system: "System",
    },
    notFound: {
      title: "Page not found",
      errorCode: "Error 404",
      description: "Oops! The page you're looking for seems to have disappeared into digital space.",
      message: "It seems this page doesn't exist or has been moved.",
      goBack: "Go back",
      goHome: "Back to home",
      suggestions: {
        title: "What can you do?",
        checkUrl: "Check the URL for typos",
        useNavigation: "Use the navigation to find what you're looking for",
        contact: "Contact us if you think this is an error",
      },
    },
    pages: {
      home: {
        title: "BABANA - Partner Platform",
        description: "BABANA ETS DAIROU partner platform for modern and efficient management of your SIM sales and partners",
      },
      login: {
        title: "Login - BABANA Partner",
        description: "Sign in to your BABANA partner area to manage your activities",
      },
      register: {
        title: "Sign Up - BABANA Partner",
        description: "Create your BABANA partner account and start managing your sales",
      },
      forgotPassword: {
        title: "Forgot Password - BABANA Partner",
        description: "Reset your BABANA Partner password",
      },
      resetPassword: {
        title: "Reset Password - BABANA Partner",
        description: "Set your new BABANA Partner password",
      },
      admin: {
        title: "Administration - BABANA Partner",
        description: "BABANA Partner platform administration panel",
      },
      notFound: {
        title: "Page Not Found - BABANA Partner",
        description: "The page you are looking for does not exist",
      },
      unauthorized: {
        title: "Access Denied - BABANA Partner",
        description: "You do not have the necessary permissions to access this page",
      },
      rolesMatrix: {
        title: "Roles Matrix - BABANA Partner",
        description: "Detailed matrix of platform roles and permissions",
      },
      customers: {
        search: {
          title: "Search Customers - BABANA Partner",
          description: "Search for customers in the BABANA partner platform",
        },
        create: {
          title: "Create Customer - BABANA Partner",
          description: "Create a new customer in the BABANA partner platform",
        },
      },
      sales: {
        activation: {
          title: "Activation - BABANA Partner",
          description: "Activate a customer in the BABANA partner platform",
        },
      },
    },
    roles: {
      super_admin: { name: "Super Administrator", description: "Full access to all platform features" },
      admin: { name: "Administrator", description: "Access to most administrative features" },
      ba: { name: "Brand Ambassador (BA)", description: "Brand Ambassador with basic feature access" },
      activateur: { name: "Activator", description: "Manages and processes BA requests" },
      pos: { name: "Point of Sale (POS)", description: "Point of sale with BA rights and additional rights" },
      dsm: { name: "District Sales Manager (DSM)", description: "Manages Points of Sale (POS)" },
      vendeur: { name: "Vendor", description: "Sells products to BAs" },
      customer: { name: "Client", description: "Platform client" },
      autre: { name: "Other", description: "User with limited access to manage their tasks" },
    },
    permissionGroups: {
      users: "Users",
      products: "Products",
      orders: "Orders",
      requests: "Requests & Inquiries",
      inventory: "Inventory & Stock",
      reports: "Reports & Analytics",
      sales: "Sales",
      pos: "Points of Sale",
      tasks: "Tasks",
      system: "System Administration",
    },
    permissions: {
      "view-users": { name: "View users", description: "Allows viewing the user list" },
      "create-users": { name: "Create users", description: "Allows creating new users" },
      "edit-users": { name: "Edit users", description: "Allows editing user information" },
      "delete-users": { name: "Delete users", description: "Allows deleting users" },
      "view-products": { name: "View products", description: "Allows viewing the product list" },
      "create-products": { name: "Create products", description: "Allows creating new products" },
      "edit-products": { name: "Edit products", description: "Allows editing products" },
      "delete-products": { name: "Delete products", description: "Allows deleting products" },
      "view-orders": { name: "View orders", description: "Allows viewing orders" },
      "create-orders": { name: "Create orders", description: "Allows creating orders" },
      "edit-orders": { name: "Edit orders", description: "Allows editing orders" },
      "delete-orders": { name: "Delete orders", description: "Allows deleting orders" },
      "approve-orders": { name: "Approve orders", description: "Allows approving orders" },
      "view-requests": { name: "View requests", description: "Allows viewing BA requests" },
      "create-requests": { name: "Create requests", description: "Allows creating requests" },
      "process-requests": { name: "Process requests", description: "Allows processing BA requests" },
      "approve-requests": { name: "Approve requests", description: "Allows approving requests" },
      "reject-requests": { name: "Reject requests", description: "Allows rejecting requests" },
      "view-inventory": { name: "View inventory", description: "Allows viewing stock status" },
      "manage-inventory": { name: "Manage inventory", description: "Allows managing stock" },
      "view-reports": { name: "View reports", description: "Allows viewing reports" },
      "create-reports": { name: "Create reports", description: "Allows creating reports" },
      "export-reports": { name: "Export reports", description: "Allows exporting reports" },
      "view-sales": { name: "View sales", description: "Allows viewing sales" },
      "create-sales": { name: "Create sales", description: "Allows creating sales" },
      "edit-sales": { name: "Edit sales", description: "Allows editing sales" },
      "manage-pos": { name: "Manage POS", description: "Allows managing points of sale" },
      "view-pos": { name: "View POS", description: "Allows viewing points of sale" },
      "view-own-tasks": { name: "View own tasks", description: "Allows viewing own tasks" },
      "manage-own-tasks": { name: "Manage own tasks", description: "Allows managing own tasks" },
      "view-all-tasks": { name: "View all tasks", description: "Allows viewing all tasks" },
      "assign-tasks": { name: "Assign tasks", description: "Allows assigning tasks" },
      "manage-roles": { name: "Manage roles", description: "Allows managing roles and permissions" },
      "manage-settings": { name: "Manage settings", description: "Allows managing system settings" },
      "admin-access": { name: "Admin access", description: "Full administration access" },
    },
    matrix: {
      title: "Roles & Permissions",
      subtitle: "Detailed matrix of access rights for each role on the Babana platform.",
      systemDocs: "System Documentation",
      status: "Status",
      accessLevel: {
        unlimited: "Unlimited Access",
        limited: "{count} Active Permissions",
      },
      manageRole: "Manage this role (Admin)",
      keyPoints: "Key Points",
      active: "Active",
    },
    customerSearch: {
      title: "Customer Search",
      subtitle: "Quickly access customer information to facilitate your operations.",
      securePortal: "Secure Partner Portal",
      searchCriteria: "Search Criteria",
      fillFields: "Use the filters below to find a customer.",
      advancedSearch: "Advanced Search",
      standardSearch: "Standard Search",
      fields: {
        idCard: "ID Card Number / Identifier",
        idCardPlaceholder: "Ex: 112233445566",
        name: "Full Name",
        namePlaceholder: "Customer Name",
        phone: "Phone",
        phonePlaceholder: "Ex: 612345678",
      },
      searchButton: "Start Search",
      searching: "Searching...",
      accessDenied: {
        title: "Access Denied",
        message: "You do not have the necessary permissions to access this page.",
        backHome: "Back to Home",
      },
      results: {
        notFound: "Customer Not Found",
        notFoundMessage: "No customer matches these criteria.",
        createCustomer: "Create New Customer",
        cancel: "Cancel",
        found: "Customer Verified",
        foundMessage: "This customer is registered in the database.",
        sellSim: "Sell SIM",
        newSearch: "New Search",
      }
    },
    customerCreate: {
      title: "New Customer",
      subtitle: "Register a new customer to perform operations.",
      personalInfo: "Personal Information",
      contactInfo: "Contact Details",
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        idCard: "ID Card Number",
        phone: "Phone",
        email: "Email (Optional)",
        address: "Address (Optional)",
      },
      success: "Customer created successfully!",
      save: "Save Customer",
    },
    simActivation: {
      title: "SIM Activation",
      subtitle: "Complete the form to activate a new SIM card",
      customerInfo: "Customer Information",
      simInfo: "SIM Information",
      fields: {
        simNumber: "SIM Number",
        simNumberPlaceholder: "9 digits starting with 62...",
        iccid: "ICCID",
        iccidPlaceholder: "19 digits starting with 6240501000...",
        imei: "IMEI",
        imeiPlaceholder: "15 digits...",
        notes: "Notes (Optional)",
        notesPlaceholder: "Add any relevant notes here...",
      },
      errors: {
        simNumber: "Must be 9 digits and start with 62",
        iccid: "Must be 19 digits and start with 6240501000",
        imei: "Must be exactly 15 digits",
        required: "This field is required",
      },
      activate: "Activate SIM",
      success: "SIM Activation Request Submitted Successfully!",
      backToSearch: "Back to Customer Search",
    },
  },
};

// Helper function pour interpoler des variables dans les traductions
export function interpolate(
  text: string,
  params: Record<string, string | number>
): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() || "";
  });
}

