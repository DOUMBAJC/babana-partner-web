// Système de traductions pour l'application BABANA Partner

export type Language = "fr" | "en";

/**
 * Obtenir les traductions pour une langue donnée
 * Utilisable côté serveur et côté client
 */
export function getTranslations(language: Language = "fr"): Translations {
  return translations[language];
}

export interface Translations {
  // Auth
  auth: {
    login: {
      title: string;
      subtitle: string;
      errors: {
        emailPasswordRequired: string;
        loginFailed: string;
      };
    };
    register: {
      title: string;
      subtitle: string;
      labels: {
        firstName: string;
        lastName: string;
        email: string;
        personalPhone: string;
        password: string;
        confirmPassword: string;
        passwordStrength: string;
      };
      placeholders: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
      validation: {
        firstNameRequired: string;
        firstNameTooShort: string;
        lastNameRequired: string;
        lastNameTooShort: string;
        emailRequired: string;
        invalidEmail: string;
        phoneRequired: string;
        invalidPhone: string;
        passwordRequired: string;
        passwordTooShort: string;
        passwordWeak: string;
        confirmPasswordRequired: string;
        passwordMismatch: string;
      };
      strength: {
        weak: string;
        medium: string;
        strong: string;
      };
      buttons: {
        signUp: string;
        signingUp: string;
      };
      messages: {
        alreadyHaveAccount: string;
        signIn: string;
        bySigningUp: string;
        termsOfService: string;
        and: string;
        privacyPolicy: string;
        registrationError: string;
      };
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      description: string;
      labels: {
        email: string;
      };
      placeholders: {
        email: string;
      };
      validation: {
        emailRequired: string;
        invalidEmail: string;
      };
      buttons: {
        sendLink: string;
        sending: string;
        backToSignIn: string;
        resend: string;
      };
      success: {
        title: string;
        subtitle: string;
        emailSent: string;
        sentTo: string;
        nextSteps: string;
        step1: string;
        step2: string;
        step3: string;
        didntReceive: string;
      };
      messages: {
        needHelp: string;
        contactSupport: string;
      };
    };
    resetPassword: {
      title: string;
      subtitle: string;
      labels: {
        newPassword: string;
        confirmPassword: string;
        passwordStrength: string;
      };
      validation: {
        passwordRequired: string;
        passwordTooShort: string;
        passwordWeak: string;
        confirmPasswordRequired: string;
        passwordMismatch: string;
        invalidLink: string;
      };
      strength: {
        weak: string;
        medium: string;
        strong: string;
      };
      tips: {
        title: string;
        minLength: string;
        uppercase: string;
        lowercase: string;
        number: string;
      };
      buttons: {
        resetPassword: string;
        resetting: string;
        requestNewLink: string;
      };
      invalid: {
        title: string;
        subtitle: string;
        message: string;
      };
      messages: {
        rememberPassword: string;
        signIn: string;
      };
    };
    verifyEmail: {
      verifying: {
        title: string;
        subtitle: string;
        message: string;
      };
      success: {
        title: string;
        subtitle: string;
        message: string;
        accountActive: string;
        feature1: string;
        feature2: string;
        feature3: string;
        signInNow: string;
      };
      expired: {
        title: string;
        subtitle: string;
        message: string;
        email: string;
        resendButton: string;
      };
      error: {
        title: string;
        subtitle: string;
        message: string;
        whatToDo: string;
        tip1: string;
        tip2: string;
        tip3: string;
        resendButton: string;
        backToSignIn: string;
      };
      buttons: {
        sending: string;
      };
      messages: {
        needHelp: string;
        contactSupport: string;
      };
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
        errors: {
          emailPasswordRequired: "Email et mot de passe requis",
          loginFailed: "Une erreur est survenue lors de la connexion",
        },
      },
      register: {
        title: "Créer un compte",
        subtitle: "Inscrivez-vous pour accéder à BABANA Partner",
        labels: {
          firstName: "Prénom",
          lastName: "Nom",
          email: "Adresse email",
          personalPhone: "Téléphone personnel",
          password: "Mot de passe",
          confirmPassword: "Confirmer le mot de passe",
          passwordStrength: "Force du mot de passe",
        },
        placeholders: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "votre.email@example.com",
          phone: "692129212",
        },
        validation: {
          firstNameRequired: "Le prénom est requis",
          firstNameTooShort: "Le prénom doit contenir au moins 2 caractères",
          lastNameRequired: "Le nom est requis",
          lastNameTooShort: "Le nom doit contenir au moins 2 caractères",
          emailRequired: "L'email est requis",
          invalidEmail: "Email invalide",
          phoneRequired: "Le numéro de téléphone est requis",
          invalidPhone: "Veuillez entrer un numéro valide (Blue, MTN ou Orange)",
          passwordRequired: "Le mot de passe est requis",
          passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
          passwordWeak: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
          confirmPasswordRequired: "La confirmation du mot de passe est requise",
          passwordMismatch: "Les mots de passe ne correspondent pas",
        },
        strength: {
          weak: "Faible",
          medium: "Moyen",
          strong: "Fort",
        },
        buttons: {
          signUp: "S'inscrire",
          signingUp: "Inscription en cours...",
        },
        messages: {
          alreadyHaveAccount: "Vous avez déjà un compte ?",
          signIn: "Se connecter",
          bySigningUp: "En vous inscrivant, vous acceptez nos",
          termsOfService: "Conditions d'utilisation",
          and: "et notre",
          privacyPolicy: "Politique de confidentialité",
          registrationError: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        },
      },
      forgotPassword: {
        title: "Mot de passe oublié ?",
        subtitle: "Entrez votre email pour recevoir un lien de réinitialisation",
        description: "Nous vous enverrons un lien pour réinitialiser votre mot de passe.",
        labels: {
          email: "Adresse email",
        },
        placeholders: {
          email: "votre.email@example.com",
        },
        validation: {
          emailRequired: "L'email est requis",
          invalidEmail: "Email invalide",
        },
        buttons: {
          sendLink: "Envoyer le lien",
          sending: "Envoi en cours...",
          backToSignIn: "Retour à la connexion",
          resend: "Renvoyer",
        },
        success: {
          title: "Email envoyé !",
          subtitle: "Consultez votre boîte de réception",
          emailSent: "Email de réinitialisation envoyé",
          sentTo: "Nous avons envoyé un lien de réinitialisation à",
          nextSteps: "Prochaines étapes :",
          step1: "Vérifiez votre boîte de réception (et le dossier spam)",
          step2: "Cliquez sur le lien dans l'email reçu",
          step3: "Créez votre nouveau mot de passe",
          didntReceive: "Vous n'avez pas reçu l'email ?",
        },
        messages: {
          needHelp: "Besoin d'aide ?",
          contactSupport: "Contactez le support",
        },
      },
      resetPassword: {
        title: "Nouveau mot de passe",
        subtitle: "Créez un nouveau mot de passe sécurisé",
        labels: {
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmer le mot de passe",
          passwordStrength: "Force du mot de passe",
        },
        validation: {
          passwordRequired: "Le mot de passe est requis",
          passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
          passwordWeak: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
          confirmPasswordRequired: "La confirmation du mot de passe est requise",
          passwordMismatch: "Les mots de passe ne correspondent pas",
          invalidLink: "Lien de réinitialisation invalide ou expiré",
        },
        strength: {
          weak: "Faible",
          medium: "Moyen",
          strong: "Fort",
        },
        tips: {
          title: "Conseils pour un mot de passe sûr",
          minLength: "Au moins 8 caractères",
          uppercase: "Une lettre majuscule",
          lowercase: "Une lettre minuscule",
          number: "Un chiffre",
        },
        buttons: {
          resetPassword: "Réinitialiser le mot de passe",
          resetting: "Réinitialisation...",
          requestNewLink: "Demander un nouveau lien",
        },
        invalid: {
          title: "Lien invalide",
          subtitle: "Ce lien de réinitialisation est invalide",
          message: "Ce lien est invalide ou a expiré. Veuillez demander un nouveau lien.",
        },
        messages: {
          rememberPassword: "Vous vous souvenez de votre mot de passe ?",
          signIn: "Se connecter",
        },
      },
      verifyEmail: {
        verifying: {
          title: "Vérification en cours...",
          subtitle: "Veuillez patienter pendant que nous vérifions votre email",
          message: "Cela ne prendra que quelques secondes...",
        },
        success: {
          title: "Email vérifié !",
          subtitle: "Votre compte a été activé avec succès",
          message: "Votre adresse email a été vérifiée. Vous allez être redirigé vers la page de connexion...",
          accountActive: "Votre compte est maintenant actif !",
          feature1: "Accès complet à toutes les fonctionnalités",
          feature2: "Sécurité renforcée de votre compte",
          feature3: "Notifications importantes par email",
          signInNow: "Se connecter maintenant",
        },
        expired: {
          title: "Lien expiré",
          subtitle: "Ce lien de vérification a expiré",
          message: "Ce lien de vérification a expiré pour des raisons de sécurité. Demandez un nouveau lien pour vérifier votre email.",
          email: "Email :",
          resendButton: "Renvoyer l'email de vérification",
        },
        error: {
          title: "Erreur de vérification",
          subtitle: "Impossible de vérifier votre email",
          message: "Le lien de vérification est invalide ou a déjà été utilisé.",
          whatToDo: "Que faire maintenant ?",
          tip1: "Vérifiez que vous avez cliqué sur le bon lien dans l'email",
          tip2: "Demandez un nouveau lien de vérification",
          tip3: "Contactez notre support si le problème persiste",
          resendButton: "Renvoyer l'email",
          backToSignIn: "Retour à la connexion",
        },
        buttons: {
          sending: "Envoi en cours...",
        },
        messages: {
          needHelp: "Besoin d'aide ?",
          contactSupport: "Contactez le support",
        },
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
        errors: {
          emailPasswordRequired: "Email and password required",
          loginFailed: "An error occurred during login",
        },
      },
      register: {
        title: "Create an account",
        subtitle: "Sign up to access BABANA Partner",
        labels: {
          firstName: "First name",
          lastName: "Last name",
          email: "Email address",
          personalPhone: "Personal phone",
          password: "Password",
          confirmPassword: "Confirm password",
          passwordStrength: "Password strength",
        },
        placeholders: {
          firstName: "John",
          lastName: "Doe",
          email: "your.email@example.com",
          phone: "622037000",
        },
        validation: {
          firstNameRequired: "First name is required",
          firstNameTooShort: "First name must be at least 2 characters",
          lastNameRequired: "Last name is required",
          lastNameTooShort: "Last name must be at least 2 characters",
          emailRequired: "Email is required",
          invalidEmail: "Invalid email address",
          phoneRequired: "Phone number is required",
          invalidPhone: "Please enter a valid number (Blue, MTN or Orange)",
          passwordRequired: "Password is required",
          passwordTooShort: "Password must be at least 8 characters",
          passwordWeak: "Password must contain at least one uppercase, one lowercase and one number",
          confirmPasswordRequired: "Password confirmation is required",
          passwordMismatch: "Passwords do not match",
        },
        strength: {
          weak: "Weak",
          medium: "Medium",
          strong: "Strong",
        },
        buttons: {
          signUp: "Sign Up",
          signingUp: "Signing up...",
        },
        messages: {
          alreadyHaveAccount: "Already have an account?",
          signIn: "Sign in",
          bySigningUp: "By signing up, you agree to our",
          termsOfService: "Terms of Service",
          and: "and our",
          privacyPolicy: "Privacy Policy",
          registrationError: "An error occurred during registration. Please try again.",
        },
      },
      forgotPassword: {
        title: "Forgot password?",
        subtitle: "Enter your email to receive a reset link",
        description: "We'll send you a link to reset your password.",
        labels: {
          email: "Email address",
        },
        placeholders: {
          email: "your.email@example.com",
        },
        validation: {
          emailRequired: "Email is required",
          invalidEmail: "Invalid email address",
        },
        buttons: {
          sendLink: "Send reset link",
          sending: "Sending...",
          backToSignIn: "Back to sign in",
          resend: "Resend",
        },
        success: {
          title: "Email sent!",
          subtitle: "Check your inbox",
          emailSent: "Reset email sent",
          sentTo: "We have sent a reset link to",
          nextSteps: "Next steps:",
          step1: "Check your inbox (and spam folder)",
          step2: "Click the link in the email",
          step3: "Create your new password",
          didntReceive: "Didn't receive the email?",
        },
        messages: {
          needHelp: "Need help?",
          contactSupport: "Contact support",
        },
      },
      resetPassword: {
        title: "New password",
        subtitle: "Create a new secure password",
        labels: {
          newPassword: "New password",
          confirmPassword: "Confirm password",
          passwordStrength: "Password strength",
        },
        validation: {
          passwordRequired: "Password is required",
          passwordTooShort: "Password must be at least 8 characters",
          passwordWeak: "Password must contain at least one uppercase, one lowercase and one number",
          confirmPasswordRequired: "Password confirmation is required",
          passwordMismatch: "Passwords do not match",
          invalidLink: "Invalid or expired reset link",
        },
        strength: {
          weak: "Weak",
          medium: "Medium",
          strong: "Strong",
        },
        tips: {
          title: "Tips for a secure password",
          minLength: "At least 8 characters",
          uppercase: "One uppercase letter",
          lowercase: "One lowercase letter",
          number: "One number",
        },
        buttons: {
          resetPassword: "Reset password",
          resetting: "Resetting...",
          requestNewLink: "Request new link",
        },
        invalid: {
          title: "Invalid link",
          subtitle: "This reset link is invalid",
          message: "This link is invalid or has expired. Please request a new link.",
        },
        messages: {
          rememberPassword: "Remember your password?",
          signIn: "Sign in",
        },
      },
      verifyEmail: {
        verifying: {
          title: "Verifying...",
          subtitle: "Please wait while we verify your email",
          message: "This will only take a few seconds...",
        },
        success: {
          title: "Email verified!",
          subtitle: "Your account has been activated successfully",
          message: "Your email address has been verified. You will be redirected to the sign in page...",
          accountActive: "Your account is now active!",
          feature1: "Full access to all features",
          feature2: "Enhanced account security",
          feature3: "Important email notifications",
          signInNow: "Sign in now",
        },
        expired: {
          title: "Link expired",
          subtitle: "This verification link has expired",
          message: "This verification link has expired for security reasons. Request a new link to verify your email.",
          email: "Email:",
          resendButton: "Resend verification email",
        },
        error: {
          title: "Verification error",
          subtitle: "Unable to verify your email",
          message: "The verification link is invalid or has already been used.",
          whatToDo: "What to do now?",
          tip1: "Check that you clicked the correct link in the email",
          tip2: "Request a new verification link",
          tip3: "Contact our support if the problem persists",
          resendButton: "Resend email",
          backToSignIn: "Back to sign in",
        },
        buttons: {
          sending: "Sending...",
        },
        messages: {
          needHelp: "Need help?",
          contactSupport: "Contact support",
        },
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
      vendeur: { name: "Seller", description: "Sells products to BAs" },
      customer: { name: "Customer", description: "Platform customer" },
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

