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
    searchCustomer: string;
    newCustomer: string;
    simActivation: string;
    activationRequests: string;
    admin: string;
    camtelLogins: string;
    identificationManagement: string;
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
    optional: string;
    cancel: string;
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
  // Server Error Page
  serverError: {
    title: string;
    description: string;
    details: string;
    buttons: {
      reload: string;
      home: string;
    };
    dev: {
      showStack: string;
      hideStack: string;
    };
  };
  // Connection Alert
  connection: {
    title: string;
    offline: string;
    offlineSub: string;
    timeout: string;
    serverError: string;
    networkError: string;
    retry: string;
    retrySub: string;
    checking: string;
    restored: string;
    restoredSub: string;
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
    adminUsers: {
      title: string;
      description: string;
    };
    adminCamtelLogins: {
      title: string;
      description: string;
    };
    profile: {
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
      identify: {
        title: string;
        description: string;
      };
    };
    sales: {
      activation: {
        title: string;
        description: string;
      };
      activationRequests: {
        title: string;
        description: string;
      };
      adminReports: {
        title: string;
        description: string;
      };
    };
    support: {
      title: string;
      description: string;
      badge: string;
      form: {
        title: string;
        subtitle: string;
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        subject: string;
        subjectPlaceholder: string;
        priority: string;
        priorities: {
          low: string;
          normal: string;
          high: string;
          urgent: string;
        };
        message: string;
        messagePlaceholder: string;
        submit: string;
        sending: string;
        success: {
          title: string;
          message: string;
        };
        errors: {
          requiredFields: string;
          invalidEmail: string;
          invalidPriority: string;
          submitFailed: string;
        };
      };
      contact: {
        title: string;
        emailLabel: string;
        email: string;
        phoneLabel: string;
        phone: string;
        hoursLabel: string;
        hours: string;
      };
      response: {
        title: string;
        urgent: string;
        high: string;
        normal: string;
        low: string;
      };
      faq: {
        title: string;
        description: string;
        button: string;
      };
      security: {
        title: string;
        description: string;
      };
      stats: {
        availability: string;
        averageResponse: string;
        satisfaction: string;
      };
      errors: {
        fetchFailed: string;
        updateFailed: string;
        replyFailed: string;
        statsFailed: string;
      };
      messages: {
        updated: string;
        replied: string;
      };
    };
    tutorials: {
      title: string;
      description: string;
      center: string;
      subtitle: string;
      searchPlaceholder: string;
      all: string;
      categories: {
        gettingStarted: string;
        customers: string;
        sales: string;
        admin: string;
        advanced: string;
      };
      difficulty: {
        beginner: string;
        intermediate: string;
        advanced: string;
      };
      meta: {
        steps: string;
        duration: string;
        prerequisites: string;
      };
      actions: {
        start: string;
        back: string;
        viewAll: string;
        previous: string;
        next: string;
      };
      empty: {
        title: string;
        message: string;
      };
      detail: {
        stepsTitle: string;
        practicalTips: string;
      };
      items: {
        [key: string]: {
          title: string;
          description: string;
          steps: {
            [key: number]: {
              title: string;
              description: string;
              tips: string[];
            };
          };
          prerequisites?: string[];
        };
      };
    };
  };
  // Profile Page
  profile: {
    title: string;
    subtitle: string;
    tabs: {
      general: string;
      security: string;
      sessions: string;
      preferences: string;
      notifications: string;
    };
    general: {
      title: string;
      subtitle: string;
      avatar: string;
      changeAvatar: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      roles: string;
      accountStatus: string;
      memberSince: string;
      lastLogin: string;
      saveChanges: string;
      saving: string;
    };
    security: {
      title: string;
      subtitle: string;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
      changePassword: string;
      changing: string;
      twoFactor: {
        title: string;
        description: string;
        enable: string;
        disable: string;
        enabled: string;
        disabled: string;
      };
      loginHistory: {
        title: string;
        device: string;
        location: string;
        date: string;
        current: string;
      };
    };
    sessions: {
      title: string;
      subtitle: string;
      active: string;
      device: string;
      location: string;
      lastActive: string;
      current: string;
      revoke: string;
      revokeAll: string;
      revoking: string;
    };
    preferences: {
      title: string;
      subtitle: string;
      language: {
        title: string;
        description: string;
      };
      theme: {
        title: string;
        description: string;
      };
      timezone: {
        title: string;
        description: string;
      };
      dateFormat: {
        title: string;
        description: string;
      };
    };
    notifications: {
      title: string;
      subtitle: string;
      email: {
        title: string;
        marketing: string;
        updates: string;
        security: string;
      };
      push: {
        title: string;
        all: string;
        important: string;
        none: string;
      };
    };
    messages: {
      updateSuccess: string;
      updateError: string;
      passwordChanged: string;
      passwordError: string;
      sessionRevoked: string;
      sessionsRevoked: string;
    };
  };

  // Credits
  credits: {
    title: string;
    subtitle: string;
    badge: string;
    balance: {
      title: string;
      subtitle: string;
      current: string;
      readyFor: string;
      activations: string;
      stats: {
        today: string;
        currentMonth: string;
      };
    };
    stats: {
      title: string;
      avgConsumption: string;
      lastRecharge: string;
      estEnd: string;
      unitDay: string;
      unitDays: string;
      yesterday: string;
    };
    recharge: {
      title: string;
      promoCode: string;
      customAmount: string;
      minRequired: string;
      validate: string;
      submit: string;
      bonus: string;
      included: string;
      creditsLabel: string;
      popular: string;
      bestValue: string;
    };
    history: {
      title: string;
      viewAll: string;
      table: {
        type: string;
        details: string;
        date: string;
        credits: string;
      };
      types: {
        recharge: string;
        usage: string;
      };
    };
    payment: {
      secureTitle: string;
      methods: {
        orange: string;
        mtn: string;
      };
    };
  };

  // Rôles
  roles: Record<string, {
    name: string;
    description: string;
  }>;
  // Identification Request Management
  identifications: {
    title: string;
    description: string;
    status: {
      pending: string;
      approved: string;
      rejected: string;
      verified: string;
    };
    labels: {
      ba: string;
      processor: string;
      submittedAt: string;
      processedAt: string;
      reason: string;
    };
    messages: {
      submittedTitle: string;
      submittedSubtitle: string;
      approved: string;
      rejected: string;
    };
    actions: {
      approve: string;
      reject: string;
      viewDetails: string;
    };
  };
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
    searchCriteria: string;
    validFormat: string;
    idCardTab: string;
    simTab: string;
    pleaseWait: string;
    secureConnection: string;
    fields: {
      idCardTypeRequired: string;
      idCardNumberRequired: string;
      idCardNumberPlaceholder: string;
      simNumber: string;
      simNumberPlaceholder: string;
      selectType: string;
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
      createCustomer: string;
      found: string;
      sellSim: string;
      newSearch: string;
      limitReached: string;
    };
    customerInfo: {
      fullName: string;
      phone: string;
      idCardType: string;
      idCardNumber: string;
      address: string;
      notAvailable: string;
    };
    activationStatus: {
      title: string;
      activations: string;
      remaining: string;
      maximum: string;
      canActivate: string;
      limitReachedWarning: string;
    };
    errors: {
      attention: string;
      invalidFormat: string;
      invalidSimNumber: string;
      atLeastOneField: string;
      mustBeAuthenticated: string;
      noPermissions: string;
      validationErrors: string;
      searchError: string;
    };
  };
  // Customer Create
  customerCreate: {
    title: string;
    subtitle: string;
    personalInfo: string;
    contactInfo: string;
    steps: {
      personal: {
        label: string;
        title: string;
      };
      contact: {
        label: string;
        title: string;
      };
    };
    fields: {
      firstName: string;
      lastName: string;
      idCardType: string;
      selectIdCardType: string;
      idCard: string;
      phone: string;
      email: string;
      address: string;
      addressPlaceholder: string;
    };
    success: string;
    save: string;
    saving: string;
    cancel: string;
    errors: {
      createFailed: string;
    };
    validation: {
      required: string;
      invalidPhone: string;
      invalidEmail: string;
      invalidName: string;
      minLength: string;
      maxLength: string;
      personalRequired: string;
      contactRequired: string;
      duplicate: string;
      activateThisCustomer: string;
    };
  };
  // Customer Identify
  customerIdentify: {
    title: string;
    subtitle: string;
    steps: {
      personal: {
        label: string;
        title: string;
      };
      contact: {
        label: string;
        title: string;
      };
      documents: {
        label: string;
        title: string;
      };
    };
    documents: {
      title: string;
      description: string;
      idCardFront: string;
      idCardFrontHelper: string;
      idCardBack: string;
      idCardBackHelper: string;
      portraitPhoto: string;
      portraitPhotoHelper: string;
      locationPlan: string;
      locationPlanHelper: string;
      change: string;
      remove: string;
      dragDrop: string;
      fileType: string;
      optional: string;
    };
    success: string;
    submit: string;
    submitting: string;
    validation: {
      personalRequired: string;
      contactRequired: string;
      documentsRequired: string;
      formError: string;
    };
  };
  // Customer Update
  customerUpdate: {
    title: string;
    subtitle: string;
    success: string;
    updating: string;
    submit: string;
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
      simNumberFormat: string;
      iccid: string;
      iccidFormat: string;
      imei: string;
      imeiFormat: string;
      required: string;
    };
    activate: string;
    success: string;
    backToSearch: string;
  };
  reports: {
    title: string;
    subtitle: string;
    tabs: {
      overview: string;
      performance: string;
      analytics: string;
      export: string;
    };
    filters: {
      title: string;
      active: string;
      startDate: string;
      endDate: string;
      apply: string;
      reset: string;
    };
    stats: {
      total: string;
      totalCard: string;
      pending: string;
      processing: string;
      activated: string;
      rejected: string;
      cancelled: string;
      trends: {
        today: string;
        thisWeek: string;
        thisMonth: string;
        thisMonthTotal: string;
        notAvailable: string;
      };
    };
    analytics: {
      detailedAnalysis: string;
      advancedMetrics: string;
      conversionRate: string;
      avgProcessingTime: string;
      totalProcessed: string;
      trendsTitle: string;
      keyIndicators: string;
      activatedRequests: string;
      rejectedRequests: string;
      percentOfTotal: string;
    };
    export: {
      title: string;
      description: string;
      csv: string;
      csvDesc: string;
      excel: string;
      excelDesc: string;
      pdf: string;
      pdfDesc: string;
      exporting: string;
      secretTitle: string;
      secretTitleUnlocked: string;
      secretDesc: string;
      secretDescUnlocked: string;
      secretPlaceholder: string;
      unlock: string;
      hint: string;
      advancedFeatureNote: string;
      secretExportInProgress: string;
      messages: {
        secretCodeValidated: string;
        secretCodeIncorrect: string;
        preparingSecretExport: string;
        secretExportSuccess: string;
        secretExportError: string;
      };
    };
    actions: {
      back: string;
      refresh: string;
      refreshing: string;
    };
    errors: {
      accessDenied: string;
      accessDeniedTitle: string;
      errorTitle: string;
    };
    footer: {
      lastUpdate: string;
      totalRequests: string;
      request: string;
    };
  };
  // Activation Requests
  activationRequests: {
    title: string;
    subtitle: string;
    stats: {
      total: string;
      totalDesc: string;
      pending: string;
      pendingDesc: string;
      processing: string;
      processingDesc: string;
      activated: string;
      activatedDesc: string;
      rejected: string;
      rejectedDesc: string;
    };
    filters: {
      title: string;
      search: string;
      searchPlaceholder: string;
      status: string;
      allStatuses: string;
      dateFrom: string;
      dateTo: string;
      datePlaceholder: string;
      apply: string;
      clear: string;
      mine: string;
    };
    table: {
      id: string;
      customer: string;
      simNumber: string;
      iccid: string;
      ba: string;
      status: string;
      date: string;
      actions: string;
      viewDetails: string;
      accept: string;
      reject: string;
      noResults: string;
      noResultsMessage: string;
      page: string;
      of: string;
      results: string;
      previous: string;
      next: string;
    };
    status: {
      pending: string;
      processing: string;
      activated: string;
      rejected: string;
      cancelled: string;
      all: string;
    };
    details: {
      title: string;
      backToList: string;
      customerInfo: string;
      simInfo: string;
      baInfo: string;
      notesDetails: string;
      fullName: string;
      phone: string;
      cardType: string;
      cardTypePiece: string;
      cardNumber: string;
      address: string;
      notProvided: string;
      name: string;
      email: string;
      baNotes: string;
      adminNotes: string;
      rejectionReason: string;
      processedBy: string;
      simNumber: string;
      iccid: string;
      imei: string;
      camtelLogin: string;
      brandAmbassador: string;
      noNotesAvailable: string;
      createdOn: string;
      processedOn: string;
    };
    accept: {
      title: string;
      request: string;
      notes: string;
      notesPlaceholder: string;
      notesHelp: string;
      cancel: string;
      confirm: string;
      processing: string;
    };
    reject: {
      title: string;
      request: string;
      reason: string;
      reasonPlaceholder: string;
      reasonRequired: string;
      notes: string;
      notesPlaceholder: string;
      cancel: string;
      confirm: string;
      processing: string;
    };
    edit: {
      title: string;
      request: string;
      save: string;
    };
    cancel: {
      title: string;
      request: string;
      reason: string;
      reasonPlaceholder: string;
      warning: string;
      warningMessage: string;
      confirm: string;
    };
    toast: {
      acceptSuccess: string;
      acceptError: string;
      rejectSuccess: string;
      rejectError: string;
      updateSuccess: string;
      updateError: string;
      cancelSuccess: string;
      cancelError: string;
      copySuccess: string;
      copyError: string;
      copyEmpty: string;
    };
    accessDenied: {
      title: string;
      message: string;
      backHome: string;
    };
    notFound: string;
  };

  // Admin - Users
  adminUsers: {
    breadcrumb: {
      admin: string;
      users: string;
    };
    header: {
      title: string;
      subtitle: string;
    };
    stats: {
      total: string;
      active: string;
      pending: string;
      suspended: string;
      rejected: string;
    };
    tabs: {
      all: string;
      pending: string;
    };
    search: {
      placeholder: string;
    };
    filters: {
      status: string;
      allStatuses: string;
      role: string;
      allRoles: string;
    };
    status: {
      pending_verification: string;
      verified: string;
      active: string;
      suspended: string;
      rejected: string;
    };
    statusDescriptions: {
      pending_verification: string;
      verified: string;
      active: string;
      suspended: string;
      rejected: string;
    };
    table: {
      user: string;
      status: string;
      roles: string;
      created: string;
      actions: string;
      view: string;
      openTooltip: string;
      emptyTitle: string;
      emptyMessage: string;
    };
    drawer: {
      tabs: {
        profile: string;
        roles: string;
        actions: string;
      };
    };
    panel: {
      unavailableTitle: string;
      unavailableMessage: string;
      sections: {
        contact: string;
        account: string;
        history: string;
        actions: string;
      };
    };
    fields: {
      email: string;
      phone: string;
      camtelLogin: string;
      createdAt: string;
      emailVerified: string;
      notVerified: string;
      notProvided: string;
      activatedAt: string;
      activatedBy: string;
    };
    history: {
      accountCreated: string;
      accountCreatedDesc: string;
      emailVerified: string;
      emailVerifiedDesc: string;
      accountActivated: string;
      by: string;
      byAdmin: string;
      accountSuspended: string;
      accountSuspendedDesc: string;
      accountRejected: string;
      accountRejectedDesc: string;
    };
    roles: {
      noneAssigned: string;
      manageTitle: string;
      assignLabel: string;
      choosePlaceholder: string;
      noRoleAvailable: string;
      assignButton: string;
      assignedTitle: string;
      removeButton: string;
      noneTitle: string;
      noneDesc: string;
    };
    actions: {
      activateTitle: string;
      activateDesc: string;
      reactivateTitle: string;
      reactivateDesc: string;
      suspendTitle: string;
      suspendDesc: string;
      rejectTitle: string;
      rejectDesc: string;
      noneTitle: string;
      noneDesc: string;
      rejectionReasonTitle: string;
    };
    confirm: {
      activateTitle: string;
      suspendTitle: string;
      reactivateTitle: string;
      rejectTitle: string;
      actionOn: string;
      reasonOptionalLabel: string;
      reasonPlaceholder: string;
    };
    errors: {
      missingParams: string;
      missingRole: string;
      loadError: string;
      genericError: string;
    };
    toasts: {
      copied: string;
      actionDone: string;
    };
  };

  adminCamtelLogins: {
    breadcrumb: {
      admin: string;
      camtelLogins: string;
    };
    header: {
      title: string;
      subtitle: string;
    };
    stats: {
      total: string;
    };
    search: {
      placeholder: string;
    };
    table: {
      login: string;
      label: string;
      created: string;
      actions: string;
      view: string;
      openTooltip: string;
      emptyTitle: string;
      emptyMessage: string;
    };
    drawer: {
      tabs: {
        details: string;
        actions: string;
      };
    };
    badges: {
      camtel: string;
      usersCount: string;
    };
    accessDenied: {
      title: string;
      message: string;
    };
    panel: {
      unavailableTitle: string;
      unavailableMessage: string;
      sections: {
        main: string;
        users: string;
        history: string;
        meta: string;
        actions: string;
      };
    };
    fields: {
      login: string;
      password: string;
      label: string;
      camtelCreatedAt: string;
      createdAt: string;
      updatedAt: string;
    };
    users: {
      empty: string;
    };
    history: {
      created: string;
      createdDesc: string;
      updated: string;
      updatedDesc: string;
      noData: string;
    };
    actions: {
      createButton: string;
      revealPasswordTitle: string;
      revealPasswordDesc: string;
      editTitle: string;
      editDesc: string;
      deleteTitle: string;
      deleteDesc: string;
    };
    form: {
      createTitle: string;
      editTitle: string;
      subtitle: string;
      loginPlaceholder: string;
      loginHelp: string;
      passwordPlaceholder: string;
      passwordOptional: string;
      labelPlaceholder: string;
      camtelCreatedAtPlaceholder: string;
      createCta: string;
      saveCta: string;
    };
    confirm: {
      deleteTitle: string;
      deleteDescription: string;
      deleteHint: string;
    };
    password: {
      title: string;
      subtitle: string;
      copy: string;
      notice: string;
    };
    errors: {
      missingParams: string;
      unauthorized: string;
      missingCreateFields: string;
      missingOwnerName: string;
      nothingToUpdate: string;
      loadError: string;
      genericError: string;
    };
    pagination: {
      page: string;
      of: string;
      prev: string;
      next: string;
    };
    toasts: {
      copied: string;
      actionDone: string;
      created: string;
      updated: string;
      deleted: string;
      passwordRevealed: string;
    };
  };
  chat: {
    messages: string;
    searchPlaceholder: string;
    conversationsTab: string;
    contactsTab: string;
    noConversations: string;
    noConversationsSub: string;
    noContactsFound: string;
    startDiscussion: string;
    online: string;
    offline: string;
    typing: string;
    typingMultiple: string;
    inputPlaceholder: string;
    attachments: string;
    emojis: string;
    realTime: string;
    emptyStateTitle: string;
    emptyStateDesc: string;
    refresh: string;
    justNow: string;
    minutesAgo: string;
    noMessage: string;
    startChat: string;
    conversation: string;
    you: string;
    connectionStatus: {
      connecting: string;
      disconnected: string;
      offline: string;
      connected: string;
    };
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
      searchCustomer: "Recherche Client",
      newCustomer: "Nouveau Client",
      simActivation: "Activation SIM",
      activationRequests: "Requêtes",
      admin: "Admin",
      camtelLogins: "Logins CAMTEL",
      identificationManagement: "Gestion Identifications",
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
      optional: "optionnel",
      cancel: "Annuler",
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
    serverError: {
      title: "Une erreur est survenue",
      description: "Nous avons rencontré une erreur inattendue. Notre équipe a été notifiée.",
      details: "Détails de l'erreur",
      buttons: {
        reload: "Recharger la page",
        home: "Retour à l'accueil",
      },
      dev: {
        showStack: "Afficher la stack trace",
        hideStack: "Masquer la stack trace",
      },
    },
    connection: {
      title: "Problème de connexion",
      offline: "Vous êtes hors ligne",
      offlineSub: "Vérifiez votre connexion internet",
      timeout: "La connexion prend trop de temps",
      serverError: "Le serveur ne répond pas correctement",
      networkError: "Problème de connexion réseau détecté",
      retry: "Réessayer",
      retrySub: "Veuillez réessayer dans quelques instants",
      checking: "Vérification en cours...",
      restored: "Connexion rétablie",
      restoredSub: "Votre connexion internet est de retour",
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
      adminUsers: {
        title: "Gestion des utilisateurs - BABANA Partner",
        description: "Administration des utilisateurs, rôles et statuts sur BABANA Partner",
      },
      adminCamtelLogins: {
        title: "Gestion des logins CAMTEL - BABANA Partner",
        description: "Gestion sécurisée des identifiants CAMTEL (admins uniquement)",
      },
      profile: {
        title: "Mon Profil - BABANA Partner",
        description: "Gérez vos informations personnelles, sécurité et préférences",
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
        identify: {
          title: "Identification Client - BABANA Partner",
          description: "Identifiez un client existant avec ses documents",
        },
      },
      sales: {
        activation: {
          title: "Activation - BABANA Partner",
          description: "Activez un client dans la plateforme BABANA Partner",
        },
        activationRequests: {
          title: "Requêtes d'Activation - BABANA Partner",
          description: "Gérez et traitez les requêtes d'activation de cartes SIM",
        },
        adminReports: {
          title: "Rapports et Statistiques - BABANA Partner",
          description: "Analyse des performances et rapports détaillés du système",
        },
      },
      support: {
        title: "Support & Assistance",
        description: "Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.",
        badge: "Support Premium",
        form: {
          title: "Envoyez-nous un message",
          subtitle: "Remplissez le formulaire ci-dessous et notre équipe vous répondra rapidement",
          name: "Nom complet",
          namePlaceholder: "Votre nom complet",
          email: "Adresse email",
          emailPlaceholder: "votre@email.com",
          subject: "Sujet",
          subjectPlaceholder: "De quoi s'agit-il ?",
          priority: "Priorité",
          priorities: {
            low: "Basse",
            normal: "Normale",
            high: "Haute",
            urgent: "Urgente",
          },
          message: "Message",
          messagePlaceholder: "Décrivez votre problème ou votre question en détail...",
          submit: "Envoyer le message",
          sending: "Envoi en cours...",
          success: {
            title: "Message envoyé avec succès !",
            message: "Nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.",
          },
          errors: {
            requiredFields: "Tous les champs sont requis",
            invalidEmail: "Email invalide",
            invalidPriority: "Priorité invalide",
            submitFailed: "Erreur lors de l'envoi du message",
          },
        },
        contact: {
          title: "Contactez-nous",
          emailLabel: "Email",
          email: "calvinopro007@gmail.com",
          phoneLabel: "Téléphone",
          phone: "+237 622 037 000",
          hoursLabel: "Heures d'ouverture",
          hours: "Lun - Ven: 8h00 - 18h00",
        },
        response: {
          title: "Temps de réponse",
          urgent: "Urgent",
          high: "Haute",
          normal: "Normale",
          low: "Basse",
        },
        faq: {
          title: "Questions fréquentes",
          description: "Consultez notre FAQ pour trouver des réponses rapides aux questions courantes.",
          button: "Voir la FAQ",
        },
        security: {
          title: "Confidentialité garantie",
          description: "Toutes vos informations sont sécurisées et confidentielles. Nous respectons votre vie privée.",
        },
        stats: {
          availability: "Disponibilité",
          averageResponse: "Temps de réponse moyen",
          satisfaction: "Taux de satisfaction",
        },
        errors: {
          fetchFailed: "Erreur lors de la récupération des données",
          updateFailed: "Erreur lors de la mise à jour du ticket",
          replyFailed: "Erreur lors de l'envoi de la réponse",
          statsFailed: "Erreur lors de la récupération des statistiques",
        },
        messages: {
          updated: "Ticket mis à jour avec succès",
          replied: "Réponse envoyée avec succès",
        },
      },
      tutorials: {
        title: "Tutoriels - BABANA",
        description: "Apprenez à utiliser la plateforme BABANA avec nos guides étape par étape",
        center: "Centre de Tutoriels",
        subtitle: "Apprenez à maîtriser la plateforme avec nos guides étape par étape",
        searchPlaceholder: "Rechercher un tutoriel...",
        all: "Tous",
        categories: {
          gettingStarted: "Démarrage",
          customers: "Clients",
          sales: "Ventes",
          admin: "Administration",
          advanced: "Avancé",
        },
        difficulty: {
          beginner: "Débutant",
          intermediate: "Intermédiaire",
          advanced: "Avancé",
        },
        meta: {
          steps: "étapes",
          duration: "Durée",
          prerequisites: "Prérequis",
        },
        actions: {
          start: "Commencer",
          back: "Retour aux tutoriels",
          viewAll: "Voir tous les tutoriels",
          previous: "Tutoriel précédent",
          next: "Tutoriel suivant",
        },
        empty: {
          title: "Aucun tutoriel trouvé",
          message: "Essayez de modifier vos critères de recherche",
        },
        detail: {
          stepsTitle: "Étapes à suivre",
          practicalTips: "Conseils pratiques",
        },
        items: {
          "getting-started": {
            title: "Bien démarrer avec la plateforme",
            description: "Découvrez les bases de la plateforme et apprenez à naviguer efficacement",
            steps: {
              1: {
                title: "Créer votre compte",
                description: "Inscrivez-vous sur la plateforme en remplissant le formulaire d'inscription avec vos informations personnelles.",
                tips: [
                  "Assurez-vous d'utiliser une adresse email valide",
                  "Choisissez un mot de passe sécurisé",
                  "Vérifiez votre email après l'inscription"
                ]
              },
              2: {
                title: "Comprendre le tableau de bord",
                description: "Explorez les différentes sections du tableau de bord et familiarisez-vous avec l'interface.",
                tips: [
                  "Le menu de navigation se trouve en haut de la page",
                  "Les fonctionnalités disponibles dépendent de vos permissions",
                  "Utilisez la barre de recherche pour trouver rapidement ce que vous cherchez"
                ]
              },
              3: {
                title: "Configurer votre profil",
                description: "Complétez votre profil avec vos informations et préférences pour une meilleure expérience.",
                tips: [
                  "Ajoutez une photo de profil pour personnaliser votre compte",
                  "Configurez vos notifications selon vos préférences",
                  "Vérifiez régulièrement vos paramètres de sécurité"
                ]
              }
            }
          },
          "create-customer": {
            title: "Créer un nouveau client",
            description: "Enregistrez un nouveau client dans la plateforme (sans upload de documents ni utilisation de crédits)",
            steps: {
              1: {
                title: "Accéder au formulaire de création",
                description: "Cliquez sur \"Nouveau client\" dans le menu ou sur la carte correspondante du tableau de bord.",
                tips: [
                  "Cette méthode ne nécessite pas de crédits",
                  "Aucun document n'est requis pour cette création simple",
                  "Pour une création complète avec documents, utilisez \"Identifier un client\""
                ]
              },
              2: {
                title: "Remplir les informations du client",
                description: "Complétez tous les champs obligatoires avec les informations du client : nom, prénom, numéro de pièce, type de pièce, téléphone, adresse, etc.",
                tips: [
                  "Les champs marqués d'un astérisque (*) sont obligatoires",
                  "Vérifiez l'exactitude des informations avant de soumettre",
                  "Le numéro de téléphone doit être au format valide"
                ]
              },
              3: {
                title: "Vérifier et valider",
                description: "Revoyez toutes les informations saisies et cliquez sur \"Créer\" pour enregistrer le client.",
                tips: [
                  "Prenez le temps de vérifier toutes les informations",
                  "Note : La modification d'un client n'est possible que par les administrateurs",
                  "Une fois créé, vous pourrez créer des demandes d'activation pour ce client"
                ]
              }
            }
          },
          "search-customer": {
            title: "Rechercher un client",
            description: "Recherchez un client par son numéro de pièce d'identité et son type de pièce",
            steps: {
              1: {
                title: "Accéder à la recherche",
                description: "Cliquez sur \"Recherche Client\" dans le menu ou sur la carte correspondante du tableau de bord.",
                tips: [
                  "La recherche se fait uniquement par pièce d'identité",
                  "Assurez-vous d'avoir le numéro et le type de pièce du client"
                ]
              },
              2: {
                title: "Saisir les informations de la pièce",
                description: "Sélectionnez le type de pièce d'identité (CNI, Passeport, etc.) et entrez le numéro de la pièce du client.",
                tips: [
                  "Le type de pièce est obligatoire",
                  "Vérifiez que le numéro de pièce est correct avant de rechercher",
                  "Le format du numéro dépend du type de pièce sélectionné"
                ]
              },
              3: {
                title: "Consulter le résultat et continuer",
                description: "Si le client est trouvé, vous verrez ses informations. Vous pouvez ensuite continuer avec une demande d'activation de SIM si le client n'a pas atteint son quota maximum de 3 SIM.",
                tips: [
                  "Un client peut avoir un maximum de 3 SIM",
                  "Si le quota est atteint, vous ne pourrez pas créer de nouvelle demande d'activation",
                  "Si le client n'est pas trouvé, vous pouvez le créer via \"Identifier un client\""
                ]
              }
            }
          },
          "identify-customer": {
            title: "Identifier un client",
            description: "Créez un nouveau client avec upload de documents (pièces d'identité, portrait, plan de localisation) en utilisant vos crédits",
            prerequisites: ["Avoir des crédits disponibles"],
            steps: {
              1: {
                title: "Vérifier vos crédits",
                description: "Assurez-vous d'avoir au moins 1 crédit disponible dans votre portefeuille. Chaque identification consomme 1 crédit.",
                tips: [
                  "Vérifiez votre solde dans la section \"Crédits\"",
                  "Rechargez votre compte si nécessaire",
                  "L'identification ne peut pas être effectuée sans crédits"
                ]
              },
              2: {
                title: "Remplir les informations du client",
                description: "Complétez le formulaire avec les informations du client : nom, prénom, numéro de pièce d'identité, type de pièce, téléphone, adresse, etc.",
                tips: [
                  "Tous les champs marqués d'un astérisque (*) sont obligatoires",
                  "Vérifiez l'exactitude du numéro de pièce selon le type sélectionné",
                  "L'email est optionnel mais recommandé"
                ]
              },
              3: {
                title: "Uploader les documents requis",
                description: "Téléchargez les 4 documents obligatoires : recto de la pièce d'identité, verso de la pièce d'identité, photo portrait du client, et plan de localisation.",
                tips: [
                  "Les fichiers doivent être au format image (JPG, PNG)",
                  "Assurez-vous que les documents sont lisibles et de bonne qualité",
                  "Le plan de localisation doit montrer l'emplacement précis du client"
                ]
              },
              4: {
                title: "Valider et confirmer",
                description: "Revoyez toutes les informations et documents, puis cliquez sur \"Identifier\" pour créer le client. Le crédit sera débité automatiquement.",
                tips: [
                  "Vérifiez que tous les documents sont bien uploadés",
                  "Une fois validé, le client sera créé et vous pourrez créer une demande d'activation",
                  "Vous recevrez une confirmation de la création du client"
                ]
              }
            }
          },
          "sim-activation": {
            title: "Gérer les activations de SIM",
            description: "Gérez vos requêtes d'activation de SIM : modifiez, rejetez ou annulez les demandes selon les besoins",
            steps: {
              1: {
                title: "Accéder à vos requêtes d'activation",
                description: "Ouvrez la section \"Activation SIM\" ou \"Requêtes\" pour voir toutes vos demandes d'activation de SIM.",
                tips: [
                  "Seuls les BA (Brand Ambassadors) et utilisateurs avec ce rôle peuvent gérer leurs requêtes",
                  "Vous verrez uniquement les requêtes que vous avez créées"
                ]
              },
              2: {
                title: "Consulter les détails d'une requête",
                description: "Cliquez sur une requête pour voir tous ses détails : informations du client, numéro de SIM, statut, date de création, etc.",
                tips: [
                  "Les requêtes peuvent avoir différents statuts : en attente, approuvée, rejetée, annulée",
                  "Vérifiez les informations avant de prendre une action"
                ]
              },
              3: {
                title: "Modifier une requête",
                description: "Si vous devez corriger des informations, utilisez l'option \"Modifier\" pour mettre à jour les détails de la requête.",
                tips: [
                  "Vous pouvez modifier une requête tant qu'elle n'est pas encore traitée",
                  "Vérifiez l'exactitude des nouvelles informations avant de sauvegarder"
                ]
              },
              4: {
                title: "Rejeter ou annuler une requête",
                description: "Si le client et vous n'êtes plus d'accord sur la vente ou pour toute autre raison, vous pouvez rejeter ou annuler la requête.",
                tips: [
                  "L'annulation peut être nécessaire si le client change d'avis",
                  "La rejet peut être utilisé si les informations sont incorrectes",
                  "Ces actions libèrent le quota du client pour de nouvelles demandes"
                ]
              }
            }
          },
          "manage-activations": {
            title: "Traiter les demandes d'activation",
            description: "Découvrez comment traiter et approuver les demandes d'activation en attente",
            prerequisites: ["Permission de traitement des demandes"],
            steps: {
              1: {
                title: "Accéder aux demandes en attente",
                description: "Ouvrez la liste des demandes d'activation et filtrez pour voir celles en attente.",
                tips: [
                  "Utilisez les filtres pour trouver rapidement les demandes à traiter",
                  "Les demandes sont triées par date de création"
                ]
              },
              2: {
                title: "Examiner les détails de la demande",
                description: "Cliquez sur une demande pour voir tous ses détails et vérifier les informations.",
                tips: [
                  "Vérifiez toutes les informations avant d'approuver",
                  "Contactez le client si des informations sont manquantes ou incorrectes"
                ]
              },
              3: {
                title: "Approuver ou rejeter la demande",
                description: "Après vérification, approuvez la demande si tout est correct, ou rejetez-la avec un commentaire si nécessaire.",
                tips: [
                  "Ajoutez un commentaire si vous rejetez une demande",
                  "Les demandes approuvées sont automatiquement traitées"
                ]
              }
            }
          },
          "manage-credits": {
            title: "Gérer vos crédits",
            description: "Apprenez à recharger votre compte et à suivre vos dépenses de crédits",
            steps: {
              1: {
                title: "Accéder à votre portefeuille",
                description: "Ouvrez la section \"Crédits\" depuis le menu pour voir votre solde actuel.",
                tips: [
                  "Votre solde s'affiche en temps réel",
                  "Vous pouvez voir l'historique de vos transactions"
                ]
              },
              2: {
                title: "Recharger votre compte",
                description: "Cliquez sur \"Recharger\" et suivez les instructions pour ajouter des crédits à votre compte.",
                tips: [
                  "Plusieurs méthodes de paiement sont disponibles",
                  "La recharge est instantanée après validation du paiement"
                ]
              },
              3: {
                title: "Consulter l'historique",
                description: "Parcourez votre historique de transactions pour suivre vos dépenses et recharges.",
                tips: [
                  "Vous pouvez filtrer par type de transaction",
                  "Exportez vos relevés si nécessaire"
                ]
              }
            }
          },
          "support-tickets": {
            title: "Créer un ticket de support",
            description: "Apprenez à créer et suivre vos tickets de support pour obtenir de l'aide",
            steps: {
              1: {
                title: "Accéder au support",
                description: "Cliquez sur \"Support\" dans le menu pour accéder à la section d'aide.",
                tips: [
                  "Vous pouvez également accéder au support depuis le tableau de bord",
                  "Consultez d'abord la FAQ pour des réponses rapides"
                ]
              },
              2: {
                title: "Créer un nouveau ticket",
                description: "Cliquez sur \"Nouveau ticket\" et remplissez le formulaire avec votre question ou problème.",
                tips: [
                  "Soyez précis dans votre description",
                  "Ajoutez des captures d'écran si nécessaire",
                  "Sélectionnez la catégorie appropriée"
                ]
              },
              3: {
                title: "Suivre votre ticket",
                description: "Consultez la liste de vos tickets pour voir les réponses et mettre à jour votre demande si besoin.",
                tips: [
                  "Vous recevrez une notification lorsqu'une réponse est ajoutée",
                  "Vous pouvez répondre aux messages pour continuer la conversation"
                ]
              }
            }
          },
          "admin-settings": {
            title: "Paramètres administrateur",
            description: "Guide complet pour gérer les paramètres système en tant qu'administrateur",
            prerequisites: ["Accès administrateur"],
            steps: {
              1: {
                title: "Accéder aux paramètres",
                description: "Ouvrez la section \"Administration\" puis \"Paramètres\" pour accéder aux configurations système.",
                tips: [
                  "Seuls les administrateurs peuvent accéder à cette section",
                  "Faites attention aux modifications que vous effectuez"
                ]
              },
              2: {
                title: "Configurer les paramètres généraux",
                description: "Modifiez les paramètres généraux de la plateforme selon vos besoins.",
                tips: [
                  "Sauvegardez régulièrement vos modifications",
                  "Testez les changements avant de les appliquer en production"
                ]
              },
              3: {
                title: "Gérer les utilisateurs et permissions",
                description: "Configurez les rôles et permissions des utilisateurs de la plateforme.",
                tips: [
                  "Vérifiez les permissions avant de les attribuer",
                  "Documentez les changements de permissions importants"
                ]
              }
            }
          },
          "reports-analytics": {
            title: "Générer des rapports",
            description: "Apprenez à créer et exporter des rapports pour analyser vos données",
            steps: {
              1: {
                title: "Accéder aux rapports",
                description: "Ouvrez la section \"Rapports\" depuis le menu administrateur.",
                tips: [
                  "Les rapports peuvent prendre du temps à générer",
                  "Vous pouvez filtrer les données selon vos besoins"
                ]
              },
              2: {
                title: "Sélectionner le type de rapport",
                description: "Choisissez le type de rapport que vous souhaitez générer (ventes, clients, activations, etc.).",
                tips: [
                  "Chaque type de rapport affiche des données différentes",
                  "Vous pouvez personnaliser les colonnes affichées"
                ]
              },
              3: {
                title: "Exporter le rapport",
                description: "Une fois le rapport généré, exportez-le au format souhaité (PDF, Excel, CSV).",
                tips: [
                  "Les rapports exportés contiennent toutes les données filtrées",
                  "Vous pouvez programmer des rapports automatiques"
                ]
              }
            }
          },
          "manage-account": {
            title: "Gérer votre compte",
            description: "Apprenez à gérer vos informations personnelles, sécurité, sessions et préférences de compte",
            steps: {
              1: {
                title: "Accéder à votre profil",
                description: "Cliquez sur votre nom dans le menu en haut à droite, puis sélectionnez \"Mon Profil\" pour accéder à la gestion de votre compte.",
                tips: [
                  "Vous pouvez également accéder au profil via l'icône utilisateur",
                  "Toutes les sections de gestion sont accessibles depuis cette page"
                ]
              },
              2: {
                title: "Modifier vos informations générales",
                description: "Dans l'onglet \"Général\", modifiez vos informations personnelles : nom, prénom, email, téléphone, photo de profil, etc.",
                tips: [
                  "Votre photo de profil permet de personnaliser votre compte",
                  "Assurez-vous que votre email est valide pour recevoir les notifications",
                  "Sauvegardez vos modifications après chaque changement"
                ]
              },
              3: {
                title: "Gérer votre sécurité",
                description: "Dans l'onglet \"Sécurité\", modifiez votre mot de passe, activez l'authentification à deux facteurs si disponible, et consultez vos sessions actives.",
                tips: [
                  "Choisissez un mot de passe fort et unique",
                  "Vous pouvez révoquer les sessions actives sur d'autres appareils",
                  "Changez régulièrement votre mot de passe pour plus de sécurité"
                ]
              },
              4: {
                title: "Configurer vos préférences",
                description: "Dans l'onglet \"Préférences\", configurez votre langue préférée, votre thème (clair/sombre), et vos paramètres de notifications.",
                tips: [
                  "La langue choisie s'applique à toute l'interface",
                  "Le thème sombre réduit la fatigue oculaire",
                  "Configurez les notifications selon vos besoins"
                ]
              },
              5: {
                title: "Gérer vos sessions",
                description: "Consultez toutes vos sessions actives, voyez où et quand vous êtes connecté, et révoquez les sessions suspectes ou non désirées.",
                tips: [
                  "Vérifiez régulièrement vos sessions actives",
                  "Révoquez immédiatement toute session suspecte",
                  "Déconnectez-vous toujours sur les appareils partagés"
                ]
              }
            }
          }
        }
      },
    },
    roles: {
      super_admin: { name: "Super Administrateur", description: "Accès complet à toutes les fonctionnalités de la plateforme" },
      admin: { name: "Administrateur", description: "Accès à la plupart des fonctionnalités administratives" },
      ba: { name: "Brand Ambassador (BA)", description: "Ambassadeur de marque avec accès aux fonctionnalités de base" },
      activateur: { name: "Activateur", description: "Gère et traite les requêtes des BA" },
      identificateur: { name: "Identificateur", description: "Gère et valide les identifications clients (KYC)" },
      pos: { name: "Point de Vente (POS)", description: "Point de vente avec les droits des BA et des droits supplémentaires" },
      dsm: { name: "District Sales Manager (DSM)", description: "Gère les points de vente (POS)" },
      vendeur: { name: "Vendeur", description: "Vend les produits aux BA" },
      customer: { name: "Client", description: "Client de la plateforme" },
      autre: { name: "Autre", description: "Utilisateur avec accès limité à la gestion de leurs tâches" },
    },
    identifications: {
      title: "Gestion des Identifications",
      description: "Vérification des documents d'identité des clients (KYC)",
      status: {
        pending: "En attente",
        approved: "Approuvé",
        rejected: "Rejeté",
        verified: "Vérifié"
      },
      labels: {
        ba: "Chargé d'Affaires",
        processor: "Identificateur",
        submittedAt: "Soumis le",
        processedAt: "Traité le",
        reason: "Raison du rejet"
      },
      messages: {
        submittedTitle: "Identification Soumise",
        submittedSubtitle: "La demande a été envoyée avec succès et est en attente de vérification par un identificateur.",
        approved: "L'identification a été approuvée.",
        rejected: "L'identification a été rejetée."
      },
      actions: {
        approve: "Approuver",
        reject: "Rejeter",
        viewDetails: "Voir Détails"
      }
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
      searchCriteria: "Critères de Recherche",
      validFormat: "Format valide",
      idCardTab: "Carte d'Identité",
      simTab: "Numéro SIM",
      pleaseWait: "Recherche en cours...",
      secureConnection: "Connexion sécurisée",
      fields: {
        idCardTypeRequired: "Type de carte d'identité *",
        idCardNumberRequired: "Numéro de carte d'identité *",
        idCardNumberPlaceholder: "Ex: 123456789",
        simNumber: "Numéro SIM",
        simNumberPlaceholder: "Ex: 621234567",
        selectType: "Sélectionnez un type",
      },
      searchButton: "Rechercher",
      searching: "Recherche en cours...",
      accessDenied: {
        title: "Accès Refusé",
        message: "Vous n'avez pas les permissions nécessaires pour accéder à la recherche de clients.",
        backHome: "Retour à l'accueil",
      },
      results: {
        notFound: "Client non trouvé",
        createCustomer: "Créer un nouveau client",
        found: "Client Vérifié",
        sellSim: "Vendre une carte SIM",
        newSearch: "Nouvelle Recherche",
        limitReached: "Limite atteinte",
      },
      customerInfo: {
        fullName: "Nom complet",
        phone: "Téléphone",
        idCardType: "Type de carte",
        idCardNumber: "Numéro de carte",
        address: "Adresse",
        notAvailable: "N/A",
      },
      activationStatus: {
        title: "Statut d'activation",
        activations: "Activations",
        remaining: "Restantes",
        maximum: "Maximum",
        canActivate: "Peut activer",
        limitReachedWarning: "Ce client a atteint la limite maximale d'activations",
      },
      errors: {
        attention: "Attention",
        invalidFormat: "Format de numéro de carte invalide",
        invalidSimNumber: "Format invalide. Le numéro SIM doit commencer par 62 et contenir 9 chiffres (ex: 621234567)",
        atLeastOneField: "Veuillez remplir au moins le numéro SIM ou les informations de carte d'identité",
        mustBeAuthenticated: "Vous devez être authentifié",
        noPermissions: "Vous n'avez pas les permissions nécessaires",
        validationErrors: "Erreurs de validation",
        searchError: "Une erreur est survenue lors de la recherche",
      },
    },
    customerCreate: {
      title: "Nouveau Client",
      subtitle: "Enregistrez un nouveau client pour effectuer des opérations.",
      personalInfo: "Informations Personnelles",
      contactInfo: "Coordonnées",
      steps: {
        personal: {
          label: "Étape 1",
          title: "Informations",
        },
        contact: {
          label: "Étape 2",
          title: "Contact",
        },
      },
      fields: {
        firstName: "Prénom",
        lastName: "Nom",
        idCardType: "Type de carte d'identité",
        selectIdCardType: "Sélectionnez le type",
        idCard: "Numéro de carte d'identité",
        phone: "Téléphone",
        email: "Email (Optionnel)",
        address: "Adresse",
        addressPlaceholder: "Adresse complète",
      },
      success: "Client créé avec succès !",
      save: "Enregistrer Client",
      saving: "Enregistrement...",
      cancel: "Annuler",
      errors: {
        createFailed: "Erreur lors de la création du client",
      },
      validation: {
        required: "Ce champ est requis",
        invalidPhone: "Numéro invalide. Format: +237 6XX XXX XXX (Orange, MTN, Blue)",
        invalidEmail: "Adresse email invalide",
        invalidName: "Le nom doit contenir au moins 2 caractères (lettres uniquement)",
        minLength: "Minimum {min} caractères requis",
        maxLength: "Maximum {max} caractères autorisés",
        personalRequired: "Veuillez remplir les informations obligatoires",
        contactRequired: "Veuillez remplir les informations de contact",
        duplicate: "Souhaitez-vous l'activer ?",
        activateThisCustomer: "Activer ce client",
      },
    },
    customerIdentify: {
      title: "Identification Client",
      subtitle: "Remplissez le formulaire et ajoutez les documents requis pour identifier le client.",
      steps: {
        personal: {
          label: "Étape 1",
          title: "Informations",
        },
        contact: {
          label: "Étape 2",
          title: "Contact",
        },
        documents: {
          label: "Étape 3",
          title: "Documents",
        },
      },
      documents: {
        title: "Documents & Photos",
        description: "Veuillez fournir les documents d'identification et photos requis.",
        idCardFront: "Carte d'identité (Recto)",
        idCardFrontHelper: "Photo claire du recto de la CNI",
        idCardBack: "Carte d'identité (Verso)",
        idCardBackHelper: "Photo claire du verso de la CNI",
        portraitPhoto: "Photo Portrait",
        portraitPhotoHelper: "Photo du client tenant sa CNI (optionnel)",
        locationPlan: "Plan de localisation",
        locationPlanHelper: "Croquis ou photo du plan de localisation",
        change: "Changer l'image",
        remove: "Supprimer",
        dragDrop: "Cliquez ou glissez une image",
        fileType: "JPG, PNG, GIF (max. 5MB)",
        optional: "Les documents sont optionnels pour la mise à jour",
      },
      success: "Demande d'identification soumise avec succès",
      submit: "Soumettre la demande",
      submitting: "Envoi en cours...",
      validation: {
        personalRequired: "Veuillez remplir les informations obligatoires",
        contactRequired: "Veuillez remplir les informations de contact",
        documentsRequired: "Veuillez ajouter tous les documents requis",
        formError: "Veuillez corriger les erreurs avant de soumettre.",
      },
    },
    customerUpdate: {
      title: "Mise à jour du client",
      subtitle: "Modifiez les informations du client",
      success: "Client mis à jour avec succès",
      updating: "Mise à jour...",
      submit: "Mettre à jour",
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
        simNumberFormat: "Format invalide (ex: 62XXXXXXX)",
        iccid: "Doit contenir 19 chiffres et commencer par 6240501000",
        iccidFormat: "Format invalide (ex: 6240501000XXXXXXXXX)",
        imei: "Doit contenir exactement 15 chiffres",
        imeiFormat: "Format invalide (15 chiffres)",
        required: "Ce champ est requis",
      },
      activate: "Activer la SIM",
      success: "Demande d'activation SIM soumise avec succès !",
      backToSearch: "Retour à la recherche client",
    },
    activationRequests: {
      title: "Requêtes d'Activation",
      subtitle: "Gérez et traitez les demandes d'activation de cartes SIM",
      stats: {
        total: "Total",
        totalDesc: "Toutes les requêtes",
        pending: "En Attente",
        pendingDesc: "À traiter",
        processing: "En Traitement",
        processingDesc: "En cours",
        activated: "Activées",
        activatedDesc: "Complétées",
        rejected: "Rejetées",
        rejectedDesc: "Refusées",
      },
      filters: {
        title: "Filtres",
        search: "Recherche",
        searchPlaceholder: "Numéro SIM, ICCID, client...",
        status: "Statut",
        allStatuses: "Tous les statuts",
        dateFrom: "Date de début",
        dateTo: "Date de fin",
        datePlaceholder: "Sélectionner une date",
        apply: "Filtrer",
        clear: "Effacer",
        mine: "Mes requêtes uniquement",
      },
      table: {
        id: "ID",
        customer: "Client",
        simNumber: "Numéro SIM",
        iccid: "ICCID",
        ba: "BA",
        status: "Statut",
        date: "Date",
        actions: "Actions",
        viewDetails: "Voir détails",
        accept: "Accepter",
        reject: "Rejeter",
        noResults: "Aucune requête trouvée",
        noResultsMessage: "Aucune requête d'activation ne correspond à vos critères de recherche.",
        page: "Page",
        of: "sur",
        results: "résultat",
        previous: "Précédent",
        next: "Suivant",
      },
      status: {
        pending: "En attente",
        processing: "En traitement",
        activated: "Activée",
        rejected: "Rejetée",
        cancelled: "Annulée",
        all: "Tous les statuts",
      },
      details: {
        title: "Requête d'Activation",
        backToList: "Retour à la liste",
        customerInfo: "Informations Client",
        simInfo: "Informations SIM",
        baInfo: "Brand Ambassador",
        notesDetails: "Notes et Commentaires",
        fullName: "Nom complet",
        phone: "Téléphone",
        cardType: "Type de carte",
        cardTypePiece: "Type de pièce",
        cardNumber: "Numéro de pièce",
        address: "Adresse",
        notProvided: "Non fourni",
        name: "Nom",
        email: "Email",
        baNotes: "Notes BA",
        adminNotes: "Notes Admin",
        rejectionReason: "Raison du rejet",
        processedBy: "Traité par",
        simNumber: "Numéro SIM",
        iccid: "ICCID",
        imei: "IMEI",
        camtelLogin: "Login Camtel",
        brandAmbassador: "Ambassadeur",
        noNotesAvailable: "Aucune note disponible",
        createdOn: "Créée le",
        processedOn: "Traitée le",
      },
      accept: {
        title: "Accepter la requête",
        request: "Requête",
        notes: "Notes (Optionnel)",
        notesPlaceholder: "Ajouter des notes sur cette activation...",
        notesHelp: "Ces notes seront visibles dans l'historique de la requête",
        cancel: "Annuler",
        confirm: "Accepter la requête",
        processing: "Traitement...",
      },
      reject: {
        title: "Rejeter la requête",
        request: "Requête",
        reason: "Raison du rejet",
        reasonPlaceholder: "Ex: Document non valide, informations incorrectes...",
        reasonRequired: "La raison du rejet est obligatoire",
        notes: "Notes additionnelles (Optionnel)",
        notesPlaceholder: "Notes internes...",
        cancel: "Annuler",
        confirm: "Rejeter la requête",
        processing: "Traitement...",
      },
      edit: {
        title: "Modifier la requête",
        request: "Requête",
        save: "Enregistrer les modifications",
      },
      cancel: {
        title: "Annuler la requête",
        request: "Requête",
        reason: "Raison de l'annulation",
        reasonPlaceholder: "Expliquez pourquoi vous annulez cette requête...",
        warning: "Attention - Action Irréversible",
        warningMessage: "Cette requête sera définitivement annulée et ne pourra plus être traitée. Cette action ne peut pas être annulée.",
        confirm: "Confirmer l'annulation",
      },
      toast: {
        acceptSuccess: "Requête approuvée avec succès",
        acceptError: "Impossible d'approuver la requête",
        rejectSuccess: "Requête rejetée avec succès",
        rejectError: "Impossible de rejeter la requête",
        updateSuccess: "Requête modifiée avec succès",
        updateError: "Impossible de modifier la requête",
        cancelSuccess: "Requête annulée avec succès",
        cancelError: "Impossible d'annuler la requête",
        copySuccess: "Copié !",
        copyError: "Erreur lors de la copie",
        copyEmpty: "Aucune valeur à copier",
      },
      accessDenied: {
        title: "Accès Refusé",
        message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page. Seuls les Activateurs, Administrateurs et Super Administrateurs peuvent consulter les requêtes d'activation.",
        backHome: "Retour à l'accueil",
      },
      notFound: "Requête introuvable",
    },
    reports: {
      title: "Rapports et Statistiques",
      subtitle: "Analysez les performances et générez des rapports détaillés",
      tabs: {
        overview: "Vue d'ensemble",
        performance: "Performance",
        analytics: "Analytique",
        export: "Export",
      },
      filters: {
        title: "Filtres de période",
        active: "Filtres actifs",
        startDate: "Date de début",
        endDate: "Date de fin",
        apply: "Appliquer",
        reset: "Réinitialiser",
      },
      stats: {
        total: "Total",
        totalCard: "Total",
        pending: "En attente",
        processing: "En traitement",
        activated: "Activées",
        rejected: "Rejetées",
        cancelled: "Annulées",
        trends: {
          today: "Aujourd'hui",
          thisWeek: "Cette semaine",
          thisMonth: "Ce mois",
          thisMonthTotal: "Ce mois (total)",
          notAvailable: "N/A",
        },
      },
      analytics: {
        detailedAnalysis: "Analyse détaillée",
        advancedMetrics: "Métriques avancées et insights",
        conversionRate: "Taux de conversion",
        avgProcessingTime: "Temps moyen de traitement",
        totalProcessed: "Total traité",
        trendsTitle: "Tendances",
        keyIndicators: "Évolution des indicateurs clés",
        activatedRequests: "Requêtes activées",
        rejectedRequests: "Requêtes rejetées",
        percentOfTotal: "{percent}% du total",
      },
      export: {
        title: "Exporter les données",
        description: "Générez des rapports dans différents formats",
        csv: "CSV",
        csvDesc: "Exportez les données brutes au format CSV",
        excel: "Excel",
        excelDesc: "Générez un fichier Excel avec graphiques",
        pdf: "PDF",
        pdfDesc: "Créez un rapport PDF professionnel",
        exporting: "Export en cours...",
        secretTitle: "Exports Secrets",
        secretTitleUnlocked: "Exports Secrets Débloqués",
        secretDesc: "Entrez le code secret pour débloquer les exports avancés",
        secretDescUnlocked: "🎉 Accès aux exports secrets activé !",
        secretPlaceholder: "Entrez le code secret...",
        unlock: "Débloquer",
        hint: "💡 Indice : Le code est lié au nom de l'application...",
        advancedFeatureNote: "Les exports secrets utilisent une fonctionnalité avancée du backend",
        secretExportInProgress: "Export secret en cours...",
        messages: {
          secretCodeValidated: "🎉 Code secret validé ! Les boutons secrets sont maintenant disponibles.",
          secretCodeIncorrect: "❌ Code incorrect. Essayez encore !",
          preparingSecretExport: "Export secret {format} en cours de préparation...",
          secretExportSuccess: "🎉 Export secret {format} téléchargé avec succès !",
          secretExportError: "Erreur lors de l'export secret {format}: {error}",
        },
      },
      actions: {
        back: "Retour",
        refresh: "Actualiser",
        refreshing: "Actualisation...",
      },
      errors: {
        accessDenied: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        accessDeniedTitle: "Accès refusé",
        errorTitle: "Erreur",
      },
      footer: {
        lastUpdate: "Dernière mise à jour : {date}",
        totalRequests: "{count} requête{plural} au total",
        request: "requête",
      },
    },
    adminUsers: {
      breadcrumb: {
        admin: "Administration",
        users: "Utilisateurs",
      },
      header: {
        title: "Gestion des utilisateurs",
        subtitle: "Un cockpit clair pour activer, suspendre et suivre les comptes.",
      },
      stats: {
        total: "Total",
        active: "Actifs",
        pending: "En attente",
        suspended: "Suspendus",
        rejected: "Rejetés",
      },
      tabs: {
        all: "Tous",
        pending: "En attente",
      },
      search: {
        placeholder: "Rechercher (nom, email, téléphone, login...)",
      },
      filters: {
        status: "Statut",
        allStatuses: "Tous les statuts",
        role: "Rôle",
        allRoles: "Tous rôles",
      },
      status: {
        pending_verification: "Email à vérifier",
        verified: "En attente d’activation",
        active: "Actif",
        suspended: "Suspendu",
        rejected: "Rejeté",
      },
      statusDescriptions: {
        pending_verification: "L'utilisateur doit confirmer son adresse email",
        verified: "Email vérifié, en attente de validation par un administrateur",
        active: "L'utilisateur peut accéder à toutes les fonctionnalités",
        suspended: "L'accès au compte a été temporairement désactivé",
        rejected: "La demande de création de compte a été refusée",
      },
      table: {
        user: "Utilisateur",
        status: "Statut",
        roles: "Rôles",
        created: "Créé",
        actions: "Actions",
        view: "Voir",
        openTooltip: "Ouvrir le panneau de détails",
        emptyTitle: "Aucun utilisateur trouvé",
        emptyMessage: "Ajuste la recherche ou les filtres.",
      },
      drawer: {
        tabs: {
          profile: "Profil",
          roles: "Rôles & Permissions",
          actions: "Actions",
        },
      },
      panel: {
        unavailableTitle: "Détails indisponibles",
        unavailableMessage: "Impossible de récupérer les informations de ce compte.",
        sections: {
          contact: "Coordonnées",
          account: "Compte",
          history: "Historique rapide",
          actions: "Actions disponibles",
        },
      },
      fields: {
        email: "Email",
        phone: "Téléphone",
        camtelLogin: "Login CAMTEL",
        createdAt: "Date de création",
        emailVerified: "Email vérifié",
        notVerified: "Non vérifié",
        notProvided: "Non renseigné",
        activatedAt: "Date d'activation",
        activatedBy: "Activé par",
      },
      history: {
        accountCreated: "Compte créé",
        accountCreatedDesc: "Inscription sur la plateforme",
        emailVerified: "Email vérifié",
        emailVerifiedDesc: "Confirmation de l'adresse email",
        accountActivated: "Compte activé",
        by: "Par",
        byAdmin: "Par un administrateur",
        accountSuspended: "Compte suspendu",
        accountSuspendedDesc: "Accès temporairement désactivé",
        accountRejected: "Compte rejeté",
        accountRejectedDesc: "Demande refusée",
      },
      roles: {
        noneAssigned: "Aucun rôle attribué",
        manageTitle: "Gestion des rôles",
        assignLabel: "Assigner un rôle",
        choosePlaceholder: "Choisir un rôle…",
        noRoleAvailable: "Aucun rôle disponible",
        assignButton: "Assigner",
        assignedTitle: "Rôles attribués",
        removeButton: "Retirer",
        noneTitle: "Aucun rôle",
        noneDesc: "Cet utilisateur n'a pas encore de rôle",
      },
      actions: {
        activateTitle: "Activer le compte",
        activateDesc: "Permet à l'utilisateur d'accéder à la plateforme",
        reactivateTitle: "Réactiver le compte",
        reactivateDesc: "Restaurer l'accès à la plateforme",
        suspendTitle: "Suspendre le compte",
        suspendDesc: "Bloquer temporairement l'accès utilisateur",
        rejectTitle: "Rejeter le compte",
        rejectDesc: "Refuser définitivement la demande",
        noneTitle: "Aucune action disponible",
        noneDesc: "Le statut actuel ne permet aucune action",
        rejectionReasonTitle: "Motif de rejet",
      },
      confirm: {
        activateTitle: "Activer le compte",
        suspendTitle: "Suspendre le compte",
        reactivateTitle: "Réactiver le compte",
        rejectTitle: "Rejeter le compte",
        actionOn: "Action sur",
        reasonOptionalLabel: "Motif (optionnel)",
        reasonPlaceholder: "Ex: informations incomplètes, doublon, non éligible...",
      },
      errors: {
        missingParams: "Paramètres manquants",
        missingRole: "Rôle manquant",
        loadError: "Erreur lors du chargement",
        genericError: "Une erreur est survenue",
      },
      toasts: {
        copied: "Copié dans le presse-papier",
        actionDone: "Action effectuée",
      },
    },
    adminCamtelLogins: {
      breadcrumb: {
        admin: "Administration",
        camtelLogins: "Logins CAMTEL",
      },
      header: {
        title: "Gestion des logins CAMTEL",
        subtitle: "Créer, modifier, supprimer et révéler un mot de passe à la demande.",
      },
      stats: {
        total: "Total",
      },
      search: {
        placeholder: "Rechercher (login, libellé, notes...)",
      },
      table: {
        login: "Login",
        label: "Libellé",
        created: "Créé",
        actions: "Actions",
        view: "Voir",
        openTooltip: "Ouvrir le panneau de détails",
        emptyTitle: "Aucun login trouvé",
        emptyMessage: "Ajuste la recherche ou ajoute un nouveau login.",
      },
      drawer: {
        tabs: {
          details: "Détails",
          actions: "Actions",
        },
      },
      badges: {
        camtel: "CAMTEL",
        usersCount: "{count} utilisateur(s)",
      },
      accessDenied: {
        title: "Accès refusé",
        message: "Seuls les Administrateurs et Super Administrateurs peuvent gérer les logins CAMTEL.",
      },
      panel: {
        unavailableTitle: "Détails indisponibles",
        unavailableMessage: "Impossible de récupérer les informations de ce login.",
        sections: {
          main: "Informations",
          users: "Utilisateurs liés",
          history: "Historique rapide",
          meta: "Métadonnées",
          actions: "Actions",
        },
      },
      fields: {
        login: "Login",
        password: "Mot de passe",
        label: "Libellé",
        camtelCreatedAt: "Créé sur CAMTEL",
        createdAt: "Date de création",
        updatedAt: "Dernière mise à jour",
      },
      users: {
        empty: "Aucun utilisateur lié à ce login.",
      },
      history: {
        created: "Création",
        createdDesc: "Login créé dans le système",
        updated: "Mise à jour",
        updatedDesc: "Dernière modification enregistrée",
        noData: "Aucune information d'historique.",
      },
      actions: {
        createButton: "Nouveau login",
        revealPasswordTitle: "Révéler le mot de passe",
        revealPasswordDesc: "Accès explicite au mot de passe en clair (stocké chiffré en base).",
        editTitle: "Modifier",
        editDesc: "Mettre à jour le login, le libellé, les notes ou le mot de passe.",
        deleteTitle: "Supprimer",
        deleteDesc: "Supprimer définitivement cet identifiant.",
      },
      form: {
        createTitle: "Créer un login CAMTEL",
        editTitle: "Modifier le login CAMTEL",
        subtitle: "Les informations sensibles ne sont révélées qu’à la demande.",
        loginPlaceholder: "Ex: BA_agenceyaounde",
        loginHelp: "Format requis: BA_xxx (lettres/chiffres minuscules). Ex: BA_agence123",
        passwordPlaceholder: "Mot de passe",
        passwordOptional: "optionnel",
        labelPlaceholder: "Ex: Propriétaire / agence",
        camtelCreatedAtPlaceholder: "Date (optionnel) — ex: 2025-01-01",
        createCta: "Créer",
        saveCta: "Enregistrer",
      },
      confirm: {
        deleteTitle: "Supprimer le login",
        deleteDescription: "Confirmer la suppression de",
        deleteHint: "Cette action est irréversible.",
      },
      password: {
        title: "Mot de passe en clair",
        subtitle: "Affichage à la demande (accès audité côté API).",
        copy: "Copier",
        notice: "Évite de partager ce mot de passe dans des canaux non sécurisés.",
      },
      errors: {
        missingParams: "Paramètres manquants",
        unauthorized: "Accès refusé",
        missingCreateFields: "Login et mot de passe requis",
        missingOwnerName: "Le propriétaire (owner_name) est requis",
        nothingToUpdate: "Aucune modification à enregistrer",
        loadError: "Erreur lors du chargement",
        genericError: "Une erreur est survenue",
      },
      pagination: {
        page: "Page",
        of: "sur",
        prev: "Précédent",
        next: "Suivant",
      },
      toasts: {
        copied: "Copié dans le presse-papier",
        actionDone: "Action effectuée",
        created: "Login créé",
        updated: "Login mis à jour",
        deleted: "Login supprimé",
        passwordRevealed: "Mot de passe récupéré",
      },
    },
    profile: {
      title: "Mon Profil",
      subtitle: "Gérez vos informations personnelles et vos préférences",
      tabs: {
        general: "Général",
        security: "Sécurité",
        sessions: "Sessions",
        preferences: "Préférences",
        notifications: "Notifications",
      },
      general: {
        title: "Informations Générales",
        subtitle: "Gérez vos informations personnelles et votre avatar",
        avatar: "Photo de profil",
        changeAvatar: "Changer",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Adresse email",
        phone: "Téléphone",
        roles: "Rôles",
        accountStatus: "Statut du compte",
        memberSince: "Membre depuis",
        lastLogin: "Dernière connexion",
        saveChanges: "Enregistrer les modifications",
        saving: "Enregistrement...",
      },
      security: {
        title: "Sécurité",
        subtitle: "Gérez votre mot de passe et la sécurité de votre compte",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        changePassword: "Changer le mot de passe",
        changing: "Modification...",
        twoFactor: {
          title: "Authentification à deux facteurs",
          description: "Ajoutez une couche de sécurité supplémentaire à votre compte",
          enable: "Activer",
          disable: "Désactiver",
          enabled: "Activée",
          disabled: "Désactivée",
        },
        loginHistory: {
          title: "Historique de connexion",
          device: "Appareil",
          location: "Localisation",
          date: "Date",
          current: "Session actuelle",
        },
      },
      sessions: {
        title: "Sessions Actives",
        subtitle: "Gérez vos sessions actives sur différents appareils",
        active: "sessions actives",
        device: "Appareil",
        location: "Localisation",
        lastActive: "Dernière activité",
        current: "Session actuelle",
        revoke: "Révoquer",
        revokeAll: "Révoquer toutes les sessions",
        revoking: "Révocation...",
      },
      preferences: {
        title: "Préférences",
        subtitle: "Personnalisez votre expérience sur la plateforme",
        language: {
          title: "Langue",
          description: "Choisissez votre langue préférée",
        },
        theme: {
          title: "Thème",
          description: "Choisissez le thème de l'interface",
        },
        timezone: {
          title: "Fuseau horaire",
          description: "Définissez votre fuseau horaire",
        },
        dateFormat: {
          title: "Format de date",
          description: "Choisissez comment afficher les dates",
        },
      },
      notifications: {
        title: "Notifications",
        subtitle: "Configurez vos préférences de notification",
        email: {
          title: "Notifications par email",
          marketing: "Emails marketing et promotionnels",
          updates: "Mises à jour et nouveautés",
          security: "Alertes de sécurité",
        },
        push: {
          title: "Notifications push",
          all: "Toutes les notifications",
          important: "Seulement les notifications importantes",
          none: "Aucune notification",
        },
      },
      messages: {
        updateSuccess: "Profil mis à jour avec succès",
        updateError: "Erreur lors de la mise à jour du profil",
        passwordChanged: "Mot de passe modifié avec succès",
        passwordError: "Erreur lors de la modification du mot de passe",
        sessionRevoked: "Session révoquée avec succès",
        sessionsRevoked: "Toutes les sessions ont été révoquées",
      },
    },
    credits: {
      title: "Gestion des Crédits",
      subtitle: "Boostez votre activité avec nos forfaits partenaires",
      badge: "BA Certifié",
      balance: {
        title: "Mon Portefeuille",
        subtitle: "Suivez vos actifs",
        current: "Solde Actuel",
        readyFor: "Prêt pour",
        activations: "activations SIM",
        stats: {
          today: "Aujourd'hui",
          currentMonth: "Ce mois-ci",
        },
      },
      stats: {
        title: "Analyse d'Activité",
        avgConsumption: "Conso. Quotidienne",
        lastRecharge: "Dernier Top-up",
        estEnd: "Autonomie Estimée",
        unitDay: "jour",
        unitDays: "jours",
        yesterday: "hier",
      },
      recharge: {
        title: "Choisissez votre forfait",
        promoCode: "Code de réduction ?",
        customAmount: "Autre montant",
        minRequired: "Min. 10 crédits",
        validate: "Appliquer",
        submit: "ACTIVER MON FORFAIT",
        bonus: "CADEAU",
        included: "OFFERT",
        creditsLabel: "Crédits",
        popular: "Recommandé",
        bestValue: "Meilleur choix",
      },
      history: {
        title: "Historique des Flux",
        viewAll: "Voir les détails",
        table: {
          type: "Action",
          details: "Détails",
          date: "Horodatage",
          credits: "Montant",
        },
        types: {
          recharge: "Provisionnement",
          usage: "Service",
        },
      },
      payment: {
        secureTitle: "Sécurisé par nos partenaires",
        methods: {
          orange: "Orange Money",
          mtn: "MTN MoMo",
        },
      },
    },
    chat: {
      messages: "Messages",
      searchPlaceholder: "Rechercher...",
      conversationsTab: "Conversations",
      contactsTab: "Contacts",
      noConversations: "Aucune conversation",
      noConversationsSub: "Allez dans \"Contacts\" pour démarrer une discussion",
      noContactsFound: "Aucun contact trouvé",
      startDiscussion: "Démarrer une discussion",
      online: "En ligne",
      offline: "Hors ligne",
      typing: "est en train d'écrire...",
      typingMultiple: "sont en train d'écrire...",
      inputPlaceholder: "Écrivez votre message...",
      attachments: "Pièces jointes – à venir",
      emojis: "Émojis – à venir",
      realTime: "Temps réel",
      emptyStateTitle: "Vos messages",
      emptyStateDesc: "Sélectionnez une conversation existante ou démarrez-en une nouvelle depuis l'onglet \"Contacts\".",
      refresh: "Rafraîchir",
      justNow: "À l'instant",
      minutesAgo: "Il y a {n} min",
      noMessage: "Aucun message pour le moment.",
      startChat: "Commencez la discussion !",
      conversation: "Conversation",
      you: "Vous",
      connectionStatus: {
        connecting: "Connexion...",
        disconnected: "Déconnecté",
        offline: "Hors ligne",
        connected: "En ligne",
      },
    },
  },
  en: {
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      partners: "Partners",
      transactions: "Transactions",
      help: "Help",
      searchCustomer: "Search Customer",
      newCustomer: "New Customer",
      simActivation: "SIM Activation",
      activationRequests: "Requests",
      admin: "Admin",
      camtelLogins: "CAMTEL Logins",
      identificationManagement: "Identification Management",
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
      optional: "optional",
      cancel: "Cancel",
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
    serverError: {
      title: "Something went wrong",
      description: "We encountered an unexpected error. Our team has been notified.",
      details: "Error Details",
      buttons: {
        reload: "Reload Page",
        home: "Return Home",
      },
      dev: {
        showStack: "Show Stack Trace",
        hideStack: "Hide Stack Trace",
      },
    },
    connection: {
      title: "Connection problem",
      offline: "You are offline",
      offlineSub: "Check your internet connection",
      timeout: "Connection is taking too long",
      serverError: "Server is not responding correctly",
      networkError: "Network connection problem detected",
      retry: "Retry",
      retrySub: "Please try again in a few moments",
      checking: "Checking...",
      restored: "Connection restored",
      restoredSub: "Your internet connection is back",
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
      adminUsers: {
        title: "User management - BABANA Partner",
        description: "Manage users, roles and account statuses in BABANA Partner",
      },
      adminCamtelLogins: {
        title: "CAMTEL logins - BABANA Partner",
        description: "Secure management of CAMTEL credentials (admins only)",
      },
      profile: {
        title: "My Profile - BABANA Partner",
        description: "Manage your personal information, security and preferences",
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
        identify: {
          title: "Identify Customer - BABANA Partner",
          description: "Identify an existing customer with their documents",
        },
      },
      sales: {
        activation: {
          title: "Activation - BABANA Partner",
          description: "Activate a customer in the BABANA partner platform",
        },
        activationRequests: {
          title: "Activation Requests - BABANA Partner",
          description: "Manage and process SIM card activation requests",
        },
        adminReports: {
          title: "Reports and Statistics - BABANA Partner",
          description: "Performance analysis and detailed system reports",
        },
      },
      support: {
        title: "Support & Assistance",
        description: "Our team is here to help. Contact us and we'll get back to you as soon as possible.",
        badge: "Premium Support",
        form: {
          title: "Send us a message",
          subtitle: "Fill out the form below and our team will respond quickly",
          name: "Full name",
          namePlaceholder: "Your full name",
          email: "Email address",
          emailPlaceholder: "your@email.com",
          subject: "Subject",
          subjectPlaceholder: "What is this about?",
          priority: "Priority",
          priorities: {
            low: "Low",
            normal: "Normal",
            high: "High",
            urgent: "Urgent",
          },
          message: "Message",
          messagePlaceholder: "Describe your problem or question in detail...",
          submit: "Send message",
          sending: "Sending...",
          success: {
            title: "Message sent successfully!",
            message: "We have received your message. Our team will get back to you as soon as possible.",
          },
          errors: {
            requiredFields: "All fields are required",
            invalidEmail: "Invalid email",
            invalidPriority: "Invalid priority",
            submitFailed: "Error sending message",
          },
        },
        contact: {
          title: "Contact us",
          emailLabel: "Email",
          email: "calvinopro007@gmail.com",
          phoneLabel: "Phone",
          phone: "+237 622 037 000",
          hoursLabel: "Business hours",
          hours: "Mon - Fri: 8:00 AM - 6:00 PM",
        },
        response: {
          title: "Response time",
          urgent: "Urgent",
          high: "High",
          normal: "Normal",
          low: "Low",
        },
        faq: {
          title: "Frequently asked questions",
          description: "Check our FAQ for quick answers to common questions.",
          button: "View FAQ",
        },
        security: {
          title: "Privacy guaranteed",
          description: "All your information is secure and confidential. We respect your privacy.",
        },
        stats: {
          availability: "Availability",
          averageResponse: "Average response time",
          satisfaction: "Satisfaction rate",
        },
        errors: {
          fetchFailed: "Error fetching data",
          updateFailed: "Error updating ticket",
          replyFailed: "Error sending reply",
          statsFailed: "Error fetching statistics",
        },
        messages: {
          updated: "Ticket updated successfully",
          replied: "Reply sent successfully",
        },
      },
      tutorials: {
        title: "Tutorials - BABANA",
        description: "Learn how to use the BABANA platform with our step-by-step guides",
        center: "Tutorial Center",
        subtitle: "Learn to master the platform with our step-by-step guides",
        searchPlaceholder: "Search for a tutorial...",
        all: "All",
        categories: {
          gettingStarted: "Getting Started",
          customers: "Customers",
          sales: "Sales",
          admin: "Administration",
          advanced: "Advanced",
        },
        difficulty: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced",
        },
        meta: {
          steps: "steps",
          duration: "Duration",
          prerequisites: "Prerequisites",
        },
        actions: {
          start: "Start",
          back: "Back to tutorials",
          viewAll: "View all tutorials",
          previous: "Previous tutorial",
          next: "Next tutorial",
        },
        empty: {
          title: "No tutorials found",
          message: "Try adjusting your search criteria",
        },
        detail: {
          stepsTitle: "Steps to follow",
          practicalTips: "Practical tips",
        },
        items: {
          "getting-started": {
            title: "Get started with the platform",
            description: "Discover the basics of the platform and learn to navigate efficiently",
            steps: {
              1: {
                title: "Create your account",
                description: "Sign up on the platform by filling out the registration form with your personal information.",
                tips: [
                  "Make sure to use a valid email address",
                  "Choose a secure password",
                  "Verify your email after registration"
                ]
              },
              2: {
                title: "Understand the dashboard",
                description: "Explore the different sections of the dashboard and familiarize yourself with the interface.",
                tips: [
                  "The navigation menu is located at the top of the page",
                  "Available features depend on your permissions",
                  "Use the search bar to quickly find what you're looking for"
                ]
              },
              3: {
                title: "Configure your profile",
                description: "Complete your profile with your information and preferences for a better experience.",
                tips: [
                  "Add a profile photo to personalize your account",
                  "Configure your notifications according to your preferences",
                  "Regularly check your security settings"
                ]
              }
            }
          },
          "create-customer": {
            title: "Create a new customer",
            description: "Register a new customer in the platform (without document upload or credit usage)",
            steps: {
              1: {
                title: "Access the creation form",
                description: "Click on \"New Customer\" in the menu or on the corresponding card on the dashboard.",
                tips: [
                  "This method does not require credits",
                  "No documents are required for this simple creation",
                  "For a complete creation with documents, use \"Identify a customer\""
                ]
              },
              2: {
                title: "Fill in customer information",
                description: "Complete all required fields with customer information: name, first name, ID number, ID type, phone, address, etc.",
                tips: [
                  "Fields marked with an asterisk (*) are required",
                  "Verify the accuracy of information before submitting",
                  "Phone number must be in valid format"
                ]
              },
              3: {
                title: "Verify and validate",
                description: "Review all entered information and click \"Create\" to register the customer.",
                tips: [
                  "Take time to verify all information",
                  "Note: Customer modification is only possible by administrators",
                  "Once created, you can create activation requests for this customer"
                ]
              }
            }
          },
          "search-customer": {
            title: "Search for a customer",
            description: "Search for a customer by their ID number and ID type",
            steps: {
              1: {
                title: "Access the search",
                description: "Click on \"Search Customer\" in the menu or on the corresponding card on the dashboard.",
                tips: [
                  "Search is done only by ID card",
                  "Make sure you have the customer's ID number and type"
                ]
              },
              2: {
                title: "Enter ID information",
                description: "Select the ID type (CNI, Passport, etc.) and enter the customer's ID number.",
                tips: [
                  "ID type is required",
                  "Verify that the ID number is correct before searching",
                  "The number format depends on the selected ID type"
                ]
              },
              3: {
                title: "View result and continue",
                description: "If the customer is found, you will see their information. You can then continue with a SIM activation request if the customer has not reached their maximum quota of 3 SIMs.",
                tips: [
                  "A customer can have a maximum of 3 SIMs",
                  "If the quota is reached, you will not be able to create a new activation request",
                  "If the customer is not found, you can create them via \"Identify a customer\""
                ]
              }
            }
          },
          "identify-customer": {
            title: "Identify a customer",
            description: "Create a new customer with document upload (ID cards, portrait, location plan) using your credits",
            prerequisites: ["Have available credits"],
            steps: {
              1: {
                title: "Check your credits",
                description: "Make sure you have at least 1 credit available in your wallet. Each identification consumes 1 credit.",
                tips: [
                  "Check your balance in the \"Credits\" section",
                  "Top up your account if necessary",
                  "Identification cannot be performed without credits"
                ]
              },
              2: {
                title: "Fill in customer information",
                description: "Complete the form with customer information: name, first name, ID number, ID type, phone, address, etc.",
                tips: [
                  "All fields marked with an asterisk (*) are required",
                  "Verify the accuracy of the ID number according to the selected type",
                  "Email is optional but recommended"
                ]
              },
              3: {
                title: "Upload required documents",
                description: "Upload the 4 required documents: front of ID card, back of ID card, customer portrait photo, and location plan.",
                tips: [
                  "Files must be in image format (JPG, PNG)",
                  "Make sure documents are readable and of good quality",
                  "The location plan must show the customer's precise location"
                ]
              },
              4: {
                title: "Validate and confirm",
                description: "Review all information and documents, then click \"Identify\" to create the customer. The credit will be automatically deducted.",
                tips: [
                  "Verify that all documents are properly uploaded",
                  "Once validated, the customer will be created and you can create an activation request",
                  "You will receive a confirmation of customer creation"
                ]
              }
            }
          },
          "sim-activation": {
            title: "Manage SIM activations",
            description: "Manage your SIM activation requests: modify, reject or cancel requests as needed",
            steps: {
              1: {
                title: "Access your activation requests",
                description: "Open the \"SIM Activation\" or \"Requests\" section to see all your SIM activation requests.",
                tips: [
                  "Only BAs (Brand Ambassadors) and users with this role can manage their requests",
                  "You will only see requests you have created"
                ]
              },
              2: {
                title: "View request details",
                description: "Click on a request to see all its details: customer information, SIM number, status, creation date, etc.",
                tips: [
                  "Requests can have different statuses: pending, approved, rejected, cancelled",
                  "Check information before taking action"
                ]
              },
              3: {
                title: "Modify a request",
                description: "If you need to correct information, use the \"Modify\" option to update request details.",
                tips: [
                  "You can modify a request as long as it has not been processed yet",
                  "Verify the accuracy of new information before saving"
                ]
              },
              4: {
                title: "Reject or cancel a request",
                description: "If you and the customer are no longer in agreement about the sale or for any other reason, you can reject or cancel the request.",
                tips: [
                  "Cancellation may be necessary if the customer changes their mind",
                  "Rejection can be used if information is incorrect",
                  "These actions free up the customer's quota for new requests"
                ]
              }
            }
          },
          "manage-activations": {
            title: "Process activation requests",
            description: "Learn how to process and approve pending activation requests",
            prerequisites: ["Permission to process requests"],
            steps: {
              1: {
                title: "Access pending requests",
                description: "Open the list of activation requests and filter to see pending ones.",
                tips: [
                  "Use filters to quickly find requests to process",
                  "Requests are sorted by creation date"
                ]
              },
              2: {
                title: "Examine request details",
                description: "Click on a request to see all its details and verify information.",
                tips: [
                  "Verify all information before approving",
                  "Contact the customer if information is missing or incorrect"
                ]
              },
              3: {
                title: "Approve or reject the request",
                description: "After verification, approve the request if everything is correct, or reject it with a comment if necessary.",
                tips: [
                  "Add a comment if you reject a request",
                  "Approved requests are automatically processed"
                ]
              }
            }
          },
          "manage-credits": {
            title: "Manage your credits",
            description: "Learn to top up your account and track your credit expenses",
            steps: {
              1: {
                title: "Access your wallet",
                description: "Open the \"Credits\" section from the menu to see your current balance.",
                tips: [
                  "Your balance is displayed in real time",
                  "You can view your transaction history"
                ]
              },
              2: {
                title: "Top up your account",
                description: "Click on \"Top Up\" and follow the instructions to add credits to your account.",
                tips: [
                  "Multiple payment methods are available",
                  "Top-up is instant after payment validation"
                ]
              },
              3: {
                title: "View history",
                description: "Browse your transaction history to track your expenses and top-ups.",
                tips: [
                  "You can filter by transaction type",
                  "Export your statements if needed"
                ]
              }
            }
          },
          "support-tickets": {
            title: "Create a support ticket",
            description: "Learn to create and track your support tickets to get help",
            steps: {
              1: {
                title: "Access support",
                description: "Click on \"Support\" in the menu to access the help section.",
                tips: [
                  "You can also access support from the dashboard",
                  "Check the FAQ first for quick answers"
                ]
              },
              2: {
                title: "Create a new ticket",
                description: "Click on \"New ticket\" and fill out the form with your question or problem.",
                tips: [
                  "Be specific in your description",
                  "Add screenshots if necessary",
                  "Select the appropriate category"
                ]
              },
              3: {
                title: "Track your ticket",
                description: "View your ticket list to see responses and update your request if needed.",
                tips: [
                  "You will receive a notification when a response is added",
                  "You can reply to messages to continue the conversation"
                ]
              }
            }
          },
          "admin-settings": {
            title: "Administrator settings",
            description: "Complete guide to managing system settings as an administrator",
            prerequisites: ["Administrator access"],
            steps: {
              1: {
                title: "Access settings",
                description: "Open the \"Administration\" section then \"Settings\" to access system configurations.",
                tips: [
                  "Only administrators can access this section",
                  "Be careful with modifications you make"
                ]
              },
              2: {
                title: "Configure general settings",
                description: "Modify general platform settings according to your needs.",
                tips: [
                  "Save your modifications regularly",
                  "Test changes before applying them in production"
                ]
              },
              3: {
                title: "Manage users and permissions",
                description: "Configure roles and permissions of platform users.",
                tips: [
                  "Verify permissions before assigning them",
                  "Document important permission changes"
                ]
              }
            }
          },
          "reports-analytics": {
            title: "Generate reports",
            description: "Learn to create and export reports to analyze your data",
            steps: {
              1: {
                title: "Access reports",
                description: "Open the \"Reports\" section from the administrator menu.",
                tips: [
                  "Reports may take time to generate",
                  "You can filter data according to your needs"
                ]
              },
              2: {
                title: "Select report type",
                description: "Choose the type of report you want to generate (sales, customers, activations, etc.).",
                tips: [
                  "Each report type displays different data",
                  "You can customize displayed columns"
                ]
              },
              3: {
                title: "Export the report",
                description: "Once the report is generated, export it in the desired format (PDF, Excel, CSV).",
                tips: [
                  "Exported reports contain all filtered data",
                  "You can schedule automatic reports"
                ]
              }
            }
          },
          "manage-account": {
            title: "Manage your account",
            description: "Learn to manage your personal information, security, sessions and account preferences",
            steps: {
              1: {
                title: "Access your profile",
                description: "Click on your name in the top right menu, then select \"My Profile\" to access your account management.",
                tips: [
                  "You can also access the profile via the user icon",
                  "All management sections are accessible from this page"
                ]
              },
              2: {
                title: "Modify your general information",
                description: "In the \"General\" tab, modify your personal information: name, first name, email, phone, profile photo, etc.",
                tips: [
                  "Your profile photo allows you to personalize your account",
                  "Make sure your email is valid to receive notifications",
                  "Save your changes after each modification"
                ]
              },
              3: {
                title: "Manage your security",
                description: "In the \"Security\" tab, modify your password, enable two-factor authentication if available, and view your active sessions.",
                tips: [
                  "Choose a strong and unique password",
                  "You can revoke active sessions on other devices",
                  "Change your password regularly for more security"
                ]
              },
              4: {
                title: "Configure your preferences",
                description: "In the \"Preferences\" tab, configure your preferred language, theme (light/dark), and notification settings.",
                tips: [
                  "The chosen language applies to the entire interface",
                  "Dark theme reduces eye strain",
                  "Configure notifications according to your needs"
                ]
              },
              5: {
                title: "Manage your sessions",
                description: "View all your active sessions, see where and when you are logged in, and revoke suspicious or unwanted sessions.",
                tips: [
                  "Regularly check your active sessions",
                  "Immediately revoke any suspicious session",
                  "Always log out on shared devices"
                ]
              }
            }
          }
        }
      },
    },
    roles: {
      super_admin: { name: "Super Administrator", description: "Full access to all platform features" },
      admin: { name: "Administrator", description: "Access to most administrative features" },
      ba: { name: "Brand Ambassador (BA)", description: "Brand Ambassador with basic feature access" },
      activateur: { name: "Activator", description: "Manages and processes BA requests" },
      identificateur: { name: "Identifier", description: "Manages and validates customer identifications (KYC)" },
      pos: { name: "Point of Sale (POS)", description: "Point of sale with BA rights and additional rights" },
      dsm: { name: "District Sales Manager (DSM)", description: "Manages Points of Sale (POS)" },
      vendeur: { name: "Seller", description: "Sells products to BAs" },
      customer: { name: "Customer", description: "Platform customer" },
      autre: { name: "Other", description: "User with limited access to manage their tasks" },
    },
    identifications: {
      title: "Identification Management",
      description: "Verification of customer identity documents (KYC)",
      status: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        verified: "Verified"
      },
      labels: {
        ba: "Business Advisor",
        processor: "Identifier",
        submittedAt: "Submitted on",
        processedAt: "Processed on",
        reason: "Rejection Reason"
      },
      messages: {
        submittedTitle: "Identification Submitted",
        submittedSubtitle: "The request has been successfully sent and is pending verification by an identifier.",
        approved: "Identification has been approved.",
        rejected: "Identification has been rejected."
      },
      actions: {
        approve: "Approve",
        reject: "Reject",
        viewDetails: "View Details"
      }
    },
    adminCamtelLogins: {
      breadcrumb: {
        admin: "Administration",
        camtelLogins: "CAMTEL Logins",
      },
      header: {
        title: "CAMTEL logins management",
        subtitle: "Create, update, delete and reveal passwords on-demand.",
      },
      stats: {
        total: "Total",
      },
      search: {
        placeholder: "Search (login, label, notes...)",
      },
      table: {
        login: "Login",
        label: "Label",
        created: "Created",
        actions: "Actions",
        view: "View",
        openTooltip: "Open details panel",
        emptyTitle: "No login found",
        emptyMessage: "Adjust your search or create a new login.",
      },
      drawer: {
        tabs: {
          details: "Details",
          actions: "Actions",
        },
      },
      badges: {
        camtel: "CAMTEL",
        usersCount: "{count} user(s)",
      },
      accessDenied: {
        title: "Access denied",
        message: "Only Admins and Super Admins can manage CAMTEL logins.",
      },
      panel: {
        unavailableTitle: "Details unavailable",
        unavailableMessage: "Unable to fetch this login details.",
        sections: {
          main: "Information",
          users: "Linked users",
          history: "Quick history",
          meta: "Metadata",
          actions: "Actions",
        },
      },
      fields: {
        login: "Login",
        password: "Password",
        label: "Label",
        camtelCreatedAt: "Created on CAMTEL",
        createdAt: "Created at",
        updatedAt: "Updated at",
      },
      users: {
        empty: "No user is linked to this login.",
      },
      history: {
        created: "Created",
        createdDesc: "Login created in the system",
        updated: "Updated",
        updatedDesc: "Last modification recorded",
        noData: "No history information.",
      },
      actions: {
        createButton: "New login",
        revealPasswordTitle: "Reveal password",
        revealPasswordDesc: "Explicit access to the clear password (stored encrypted in DB).",
        editTitle: "Edit",
        editDesc: "Update login, label, notes or password.",
        deleteTitle: "Delete",
        deleteDesc: "Permanently delete this credential.",
      },
      form: {
        createTitle: "Create CAMTEL login",
        editTitle: "Edit CAMTEL login",
        subtitle: "Sensitive information is revealed only on-demand.",
        loginPlaceholder: "e.g. BA_yaoundeagency",
        loginHelp: "Required format: BA_xxx (lowercase letters/digits). e.g. BA_agency123",
        passwordPlaceholder: "Password",
        passwordOptional: "optional",
        labelPlaceholder: "e.g. Owner / agency",
        camtelCreatedAtPlaceholder: "Date (optional) — e.g. 2025-01-01",
        createCta: "Create",
        saveCta: "Save",
      },
      confirm: {
        deleteTitle: "Delete login",
        deleteDescription: "Confirm deletion of",
        deleteHint: "This action is irreversible.",
      },
      password: {
        title: "Clear password",
        subtitle: "On-demand display (audited server-side).",
        copy: "Copy",
        notice: "Avoid sharing this password in non-secure channels.",
      },
      errors: {
        missingParams: "Missing parameters",
        unauthorized: "Access denied",
        missingCreateFields: "Login and password are required",
        missingOwnerName: "Owner name is required",
        nothingToUpdate: "Nothing to update",
        loadError: "Error while loading",
        genericError: "An error occurred",
      },
      pagination: {
        page: "Page",
        of: "of",
        prev: "Previous",
        next: "Next",
      },
      toasts: {
        copied: "Copied to clipboard",
        actionDone: "Action done",
        created: "Login created",
        updated: "Login updated",
        deleted: "Login deleted",
        passwordRevealed: "Password retrieved",
      },
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
      searchCriteria: "Search Criteria",
      validFormat: "Valid Format",
      idCardTab: "ID Card",
      simTab: "SIM Number",
      pleaseWait: "Searching...",
      secureConnection: "Secure Connection",
      fields: {
        idCardTypeRequired: "ID Card Type *",
        idCardNumberRequired: "ID Card Number *",
        idCardNumberPlaceholder: "Ex: 123456789",
        simNumber: "SIM Number",
        simNumberPlaceholder: "Ex: 621234567",
        selectType: "Select a type",
      },
      searchButton: "Search",
      searching: "Searching...",
      accessDenied: {
        title: "Access Denied",
        message: "You do not have the necessary permissions to access customer search.",
        backHome: "Back to Home",
      },
      results: {
        notFound: "Customer Not Found",
        createCustomer: "Create New Customer",
        found: "Customer Verified",
        sellSim: "Sell SIM Card",
        newSearch: "New Search",
        limitReached: "Limit Reached",
      },
      customerInfo: {
        fullName: "Full Name",
        phone: "Phone",
        idCardType: "Card Type",
        idCardNumber: "Card Number",
        address: "Address",
        notAvailable: "N/A",
      },
      activationStatus: {
        title: "Activation Status",
        activations: "Activations",
        remaining: "Remaining",
        maximum: "Maximum",
        canActivate: "Can Activate",
        limitReachedWarning: "This customer has reached the maximum activation limit",
      },
      errors: {
        attention: "Warning",
        invalidFormat: "Invalid card number format",
        invalidSimNumber: "Invalid format. SIM number must start with 62 and contain 9 digits (e.g. 621234567)",
        atLeastOneField: "Please fill in at least the SIM number or ID card information",
        mustBeAuthenticated: "You must be authenticated",
        noPermissions: "You do not have the necessary permissions",
        validationErrors: "Validation errors",
        searchError: "An error occurred during the search",
      },
    },
    customerCreate: {
      title: "New Customer",
      subtitle: "Register a new customer to perform operations.",
      personalInfo: "Personal Information",
      contactInfo: "Contact Details",
      steps: {
        personal: {
          label: "Step 1",
          title: "Information",
        },
        contact: {
          label: "Step 2",
          title: "Contact",
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        idCardType: "ID Card Type",
        selectIdCardType: "Select type",
        idCard: "ID Card Number",
        phone: "Phone",
        email: "Email (Optional)",
        address: "Address",
        addressPlaceholder: "Full address",
      },
      success: "Customer created successfully!",
      save: "Save Customer",
      saving: "Saving...",
      cancel: "Cancel",
      errors: {
        createFailed: "Error creating customer",
      },
      validation: {
        required: "This field is required",
        invalidPhone: "Invalid number. Format: +237 6XX XXX XXX (Orange, MTN, Blue)",
        invalidEmail: "Invalid email address",
        invalidName: "Name must contain at least 2 characters (letters only)",
        minLength: "Minimum {min} characters required",
        maxLength: "Maximum {max} characters allowed",
        personalRequired: "Please fill in the required information",
        contactRequired: "Please fill in the contact information",
        duplicate: "Would you like to activate them?",
        activateThisCustomer: "Activate this customer",
      },
    },
    customerIdentify: {
      title: "Customer Identification",
      subtitle: "Complete the form and upload required documents to identify the customer.",
      steps: {
        personal: {
          label: "Step 1",
          title: "Information",
        },
        contact: {
          label: "Step 2",
          title: "Contact",
        },
        documents: {
          label: "Step 3",
          title: "Documents",
        },
      },
      documents: {
        title: "Documents & Photos",
        description: "Please provide the required identification documents and photos.",
        idCardFront: "ID Card (Front)",
        idCardFrontHelper: "Clear photo of the ID card front",
        idCardBack: "ID Card (Back)",
        idCardBackHelper: "Clear photo of the ID card back",
        portraitPhoto: "Portrait Photo",
        portraitPhotoHelper: "Photo of the customer holding their ID (optional)",
        locationPlan: "Location Plan",
        locationPlanHelper: "Sketch or photo of the location plan",
        change: "Change image",
        remove: "Remove",
        dragDrop: "Click or drag an image",
        fileType: "JPG, PNG, GIF (max. 5MB)",
        optional: "Documents are optional for update",
      },
      success: "Identification request submitted successfully!",
      submit: "Submit Request",
      submitting: "Submitting...",
      validation: {
        personalRequired: "Please fill in the required information",
        contactRequired: "Please fill in the contact information",
        documentsRequired: "Please add all required documents",
        formError: "Please correct the errors before submitting.",
      },
    },
    customerUpdate: {
      title: "Customer Update",
      subtitle: "Modify customer information",
      success: "Customer updated successfully",
      updating: "Updating...",
      submit: "Update",
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
        simNumberFormat: "Invalid format (e.g. 62XXXXXXX)",
        iccid: "Must be 19 digits and start with 6240501000",
        iccidFormat: "Invalid format (e.g. 6240501000XXXXXXXXX)",
        imei: "Must be exactly 15 digits",
        imeiFormat: "Invalid format (15 digits)",
        required: "This field is required",
      },
      activate: "Activate SIM",
      success: "SIM Activation Request Submitted Successfully!",
      backToSearch: "Back to Customer Search",
    },
    activationRequests: {
      title: "Activation Requests",
      subtitle: "Manage and process SIM card activation requests",
      stats: {
        total: "Total",
        totalDesc: "All requests",
        pending: "Pending",
        pendingDesc: "To process",
        processing: "Processing",
        processingDesc: "In progress",
        activated: "Activated",
        activatedDesc: "Completed",
        rejected: "Rejected",
        rejectedDesc: "Refused",
      },
      filters: {
        title: "Filters",
        search: "Search",
        searchPlaceholder: "SIM number, ICCID, customer...",
        status: "Status",
        allStatuses: "All statuses",
        dateFrom: "Start Date",
        dateTo: "End Date",
        datePlaceholder: "Select a date",
        apply: "Filter",
        clear: "Clear",
        mine: "My requests only",
      },
      table: {
        id: "ID",
        customer: "Customer",
        simNumber: "SIM Number",
        iccid: "ICCID",
        ba: "BA",
        status: "Status",
        date: "Date",
        actions: "Actions",
        viewDetails: "View Details",
        accept: "Accept",
        reject: "Reject",
        noResults: "No requests found",
        noResultsMessage: "No activation request matches your search criteria.",
        page: "Page",
        of: "of",
        results: "result",
        previous: "Previous",
        next: "Next",
      },
      status: {
        pending: "Pending",
        processing: "Processing",
        activated: "Activated",
        rejected: "Rejected",
        cancelled: "Cancelled",
        all: "All statuses",
      },
      details: {
        title: "Activation Request",
        backToList: "Back to list",
        customerInfo: "Customer Information", 
        simInfo: "SIM Information",
        baInfo: "Brand Ambassador",
        notesDetails: "Notes and Comments",
        fullName: "Full name",
        phone: "Phone",
        cardType: "Card type",
        cardTypePiece: "ID type",
        cardNumber: "ID number",
        address: "Address",
        notProvided: "Not provided",
        name: "Name",
        email: "Email",
        baNotes: "BA Notes",
        adminNotes: "Admin Notes",
        rejectionReason: "Rejection reason",
        processedBy: "Processed by",
        simNumber: "SIM Number",
        iccid: "ICCID",
        imei: "IMEI",
        camtelLogin: "Camtel Login",
        brandAmbassador: "Brand Ambassador",
        noNotesAvailable: "No notes available",
        createdOn: "Created on",
        processedOn: "Processed on",
      },
      accept: {
        title: "Accept request",
        request: "Request",
        notes: "Notes (Optional)",
        notesPlaceholder: "Add notes about this activation...",
        notesHelp: "These notes will be visible in the request history",
        cancel: "Cancel",
        confirm: "Accept request",
        processing: "Processing...",
      },
      reject: {
        title: "Reject request",
        request: "Request",
        reason: "Rejection reason",
        reasonPlaceholder: "E.g.: Invalid document, incorrect information...",
        reasonRequired: "Rejection reason is required",
        notes: "Additional notes (Optional)",
        notesPlaceholder: "Internal notes...",
        cancel: "Cancel",
        confirm: "Reject request",
        processing: "Processing...",
      },
      edit: {
        title: "Edit request",
        request: "Request",
        save: "Save changes",
      },
      cancel: {
        title: "Cancel request",
        request: "Request",
        reason: "Cancellation reason",
        reasonPlaceholder: "Explain why you are canceling this request...",
        warning: "Warning - Irreversible Action",
        warningMessage: "This request will be permanently cancelled and cannot be processed anymore. This action cannot be undone.",
        confirm: "Confirm cancellation",
      },
      toast: {
        acceptSuccess: "Request approved successfully",
        acceptError: "Unable to approve the request",
        rejectSuccess: "Request rejected successfully",
        rejectError: "Unable to reject the request",
        updateSuccess: "Request updated successfully",
        updateError: "Unable to update the request",
        cancelSuccess: "Request cancelled successfully",
        cancelError: "Unable to cancel the request",
        copySuccess: "Copied!",
        copyError: "Error copying to clipboard",
        copyEmpty: "No value to copy",
      },
      accessDenied: {
        title: "Access Denied",
        message: "You do not have the necessary permissions to access this page. Only Activators, Administrators and Super Administrators can view activation requests.",
        backHome: "Back to home",
      },
      notFound: "Request not found",
    },
    reports: {
      title: "Reports and Statistics",
      subtitle: "Analyze performance and generate detailed reports",
      tabs: {
        overview: "Overview",
        performance: "Performance",
        analytics: "Analytics",
        export: "Export",
      },
      filters: {
        title: "Period Filters",
        active: "Active Filters",
        startDate: "Start Date",
        endDate: "End Date",
        apply: "Apply",
        reset: "Reset",
      },
      stats: {
        total: "Total",
        totalCard: "Total",
        pending: "Pending",
        processing: "Processing",
        activated: "Activated",
        rejected: "Rejected",
        cancelled: "Cancelled",
        trends: {
          today: "Today",
          thisWeek: "This week",
          thisMonth: "This month",
          thisMonthTotal: "This month (total)",
          notAvailable: "N/A",
        },
      },
      analytics: {
        detailedAnalysis: "Detailed Analysis",
        advancedMetrics: "Advanced metrics and insights",
        conversionRate: "Conversion Rate",
        avgProcessingTime: "Average Processing Time",
        totalProcessed: "Total Processed",
        trendsTitle: "Trends",
        keyIndicators: "Evolution of key indicators",
        activatedRequests: "Activated requests",
        rejectedRequests: "Rejected requests",
        percentOfTotal: "{percent}% of total",
      },
      export: {
        title: "Export Data",
        description: "Generate reports in different formats",
        csv: "CSV",
        csvDesc: "Export raw data in CSV format",
        excel: "Excel",
        excelDesc: "Generate an Excel file with charts",
        pdf: "PDF",
        pdfDesc: "Create a professional PDF report",
        exporting: "Exporting...",
        secretTitle: "Secret Exports",
        secretTitleUnlocked: "Secret Exports Unlocked",
        secretDesc: "Enter the secret code to unlock advanced exports",
        secretDescUnlocked: "🎉 Secret export access activated!",
        secretPlaceholder: "Enter secret code...",
        unlock: "Unlock",
        hint: "💡 Hint: The code is related to the app name...",
        advancedFeatureNote: "Secret exports use an advanced backend feature",
        secretExportInProgress: "Secret export in progress...",
        messages: {
          secretCodeValidated: "🎉 Secret code validated! Secret buttons are now available.",
          secretCodeIncorrect: "❌ Incorrect code. Try again!",
          preparingSecretExport: "Preparing secret {format} export...",
          secretExportSuccess: "🎉 Secret {format} export downloaded successfully!",
          secretExportError: "Error during secret {format} export: {error}",
        },
      },
      actions: {
        back: "Back",
        refresh: "Refresh",
        refreshing: "Refreshing...",
      },
      errors: {
        accessDenied: "You do not have the necessary permissions to access this page.",
        accessDeniedTitle: "Access Denied",
        errorTitle: "Error",
      },
      footer: {
        lastUpdate: "Last update: {date}",
        totalRequests: "{count} total request{plural}",
        request: "request",
      },
    },
    adminUsers: {
      breadcrumb: {
        admin: "Administration",
        users: "Users",
      },
      header: {
        title: "User management",
        subtitle: "A clear cockpit to activate, suspend and track accounts.",
      },
      stats: {
        total: "Total",
        active: "Active",
        pending: "Pending",
        suspended: "Suspended",
        rejected: "Rejected",
      },
      tabs: {
        all: "All",
        pending: "Pending",
      },
      search: {
        placeholder: "Search (name, email, phone, login...)",
      },
      filters: {
        status: "Status",
        allStatuses: "All statuses",
        role: "Role",
        allRoles: "All roles",
      },
      status: {
        pending_verification: "Email to verify",
        verified: "Pending activation",
        active: "Active",
        suspended: "Suspended",
        rejected: "Rejected",
      },
      statusDescriptions: {
        pending_verification: "The user must confirm their email address",
        verified: "Email verified, pending admin approval",
        active: "The user can access all features",
        suspended: "Account access has been temporarily disabled",
        rejected: "The account request has been rejected",
      },
      table: {
        user: "User",
        status: "Status",
        roles: "Roles",
        created: "Created",
        actions: "Actions",
        view: "View",
        openTooltip: "Open details panel",
        emptyTitle: "No users found",
        emptyMessage: "Adjust your search or filters.",
      },
      drawer: {
        tabs: {
          profile: "Profile",
          roles: "Roles & Permissions",
          actions: "Actions",
        },
      },
      panel: {
        unavailableTitle: "Details unavailable",
        unavailableMessage: "Unable to retrieve this account information.",
        sections: {
          contact: "Contact details",
          account: "Account",
          history: "Quick timeline",
          actions: "Available actions",
        },
      },
      fields: {
        email: "Email",
        phone: "Phone",
        camtelLogin: "CAMTEL login",
        createdAt: "Created at",
        emailVerified: "Email verified",
        notVerified: "Not verified",
        notProvided: "Not provided",
        activatedAt: "Activated at",
        activatedBy: "Activated by",
      },
      history: {
        accountCreated: "Account created",
        accountCreatedDesc: "Registration on the platform",
        emailVerified: "Email verified",
        emailVerifiedDesc: "Email address confirmation",
        accountActivated: "Account activated",
        by: "By",
        byAdmin: "By an admin",
        accountSuspended: "Account suspended",
        accountSuspendedDesc: "Access temporarily disabled",
        accountRejected: "Account rejected",
        accountRejectedDesc: "Request rejected",
      },
      roles: {
        noneAssigned: "No role assigned",
        manageTitle: "Role management",
        assignLabel: "Assign a role",
        choosePlaceholder: "Choose a role…",
        noRoleAvailable: "No role available",
        assignButton: "Assign",
        assignedTitle: "Assigned roles",
        removeButton: "Remove",
        noneTitle: "No roles",
        noneDesc: "This user has no role yet",
      },
      actions: {
        activateTitle: "Activate account",
        activateDesc: "Allow the user to access the platform",
        reactivateTitle: "Reactivate account",
        reactivateDesc: "Restore access to the platform",
        suspendTitle: "Suspend account",
        suspendDesc: "Temporarily block user access",
        rejectTitle: "Reject account",
        rejectDesc: "Reject the request permanently",
        noneTitle: "No actions available",
        noneDesc: "Current status does not allow any action",
        rejectionReasonTitle: "Rejection reason",
      },
      confirm: {
        activateTitle: "Activate account",
        suspendTitle: "Suspend account",
        reactivateTitle: "Reactivate account",
        rejectTitle: "Reject account",
        actionOn: "Action on",
        reasonOptionalLabel: "Reason (optional)",
        reasonPlaceholder: "E.g.: incomplete info, duplicate, not eligible...",
      },
      errors: {
        missingParams: "Missing parameters",
        missingRole: "Missing role",
        loadError: "Load error",
        genericError: "An error occurred",
      },
      toasts: {
        copied: "Copied to clipboard",
        actionDone: "Action completed",
      },
    },
    profile: {
      title: "My Profile",
      subtitle: "Manage your personal information and preferences",
      tabs: {
        general: "General",
        security: "Security",
        sessions: "Sessions",
        preferences: "Preferences",
        notifications: "Notifications",
      },
      general: {
        title: "General Information",
        subtitle: "Manage your personal information and avatar",
        avatar: "Profile picture",
        changeAvatar: "Change",
        firstName: "First name",
        lastName: "Last name",
        email: "Email address",
        phone: "Phone",
        roles: "Roles",
        accountStatus: "Account status",
        memberSince: "Member since",
        lastLogin: "Last login",
        saveChanges: "Save changes",
        saving: "Saving...",
      },
      security: {
        title: "Security",
        subtitle: "Manage your password and account security",
        currentPassword: "Current password",
        newPassword: "New password",
        confirmPassword: "Confirm password",
        changePassword: "Change password",
        changing: "Changing...",
        twoFactor: {
          title: "Two-factor authentication",
          description: "Add an extra layer of security to your account",
          enable: "Enable",
          disable: "Disable",
          enabled: "Enabled",
          disabled: "Disabled",
        },
        loginHistory: {
          title: "Login history",
          device: "Device",
          location: "Location",
          date: "Date",
          current: "Current session",
        },
      },
      sessions: {
        title: "Active Sessions",
        subtitle: "Manage your active sessions across different devices",
        active: "active sessions",
        device: "Device",
        location: "Location",
        lastActive: "Last active",
        current: "Current session",
        revoke: "Revoke",
        revokeAll: "Revoke all sessions",
        revoking: "Revoking...",
      },
      preferences: {
        title: "Preferences",
        subtitle: "Customize your platform experience",
        language: {
          title: "Language",
          description: "Choose your preferred language",
        },
        theme: {
          title: "Theme",
          description: "Choose your interface theme",
        },
        timezone: {
          title: "Timezone",
          description: "Set your timezone",
        },
        dateFormat: {
          title: "Date format",
          description: "Choose how to display dates",
        },
      },
      notifications: {
        title: "Notifications",
        subtitle: "Configure your notification preferences",
        email: {
          title: "Email notifications",
          marketing: "Marketing and promotional emails",
          updates: "Updates and news",
          security: "Security alerts",
        },
        push: {
          title: "Push notifications",
          all: "All notifications",
          important: "Only important notifications",
          none: "No notifications",
        },
      },
      messages: {
        updateSuccess: "Profile updated successfully",
        updateError: "Error updating profile",
        passwordChanged: "Password changed successfully",
        passwordError: "Error changing password",
        sessionRevoked: "Session revoked successfully",
        sessionsRevoked: "All sessions have been revoked",
      },
    },
    credits: {
      title: "Credit Management",
      subtitle: "Power up your business with our partner packs",
      badge: "Certified BA",
      balance: {
        title: "My Wallet",
        subtitle: "Track your assets",
        current: "Current Balance",
        readyFor: "Ready for",
        activations: "SIM activations",
        stats: {
          today: "Today",
          currentMonth: "This month",
        },
      },
      stats: {
        title: "Activity Analysis",
        avgConsumption: "Daily Usage",
        lastRecharge: "Last Top-up",
        estEnd: "Estimated Autonomy",
        unitDay: "day",
        unitDays: "days",
        yesterday: "yesterday",
      },
      recharge: {
        title: "Select your power-pack",
        promoCode: "Discount code?",
        customAmount: "Other amount",
        minRequired: "Min. 10 credits",
        validate: "Apply",
        submit: "ACTIVATE MY PACK",
        bonus: "GIFT",
        included: "FREE",
        creditsLabel: "Credits",
        popular: "Popular",
        bestValue: "Best Value",
      },
      history: {
        title: "Transaction History",
        viewAll: "View details",
        table: {
          type: "Action",
          details: "Details",
          date: "Timestamp",
          credits: "Amount",
        },
        types: {
          recharge: "Top-up",
          usage: "Service",
        },
      },
      payment: {
        secureTitle: "Secured by our partners",
        methods: {
          orange: "Orange Money",
          mtn: "MTN MoMo",
        },
      },
    },
    chat: {
      messages: "Messages",
      searchPlaceholder: "Search...",
      conversationsTab: "Conversations",
      contactsTab: "Contacts",
      noConversations: "No conversations",
      noConversationsSub: "Go to \"Contacts\" to start a discussion",
      noContactsFound: "No contacts found",
      startDiscussion: "Start a discussion",
      online: "Online",
      offline: "Offline",
      typing: "is typing...",
      typingMultiple: "are typing...",
      inputPlaceholder: "Type your message...",
      attachments: "Attachments – coming soon",
      emojis: "Emojis – coming soon",
      realTime: "Real-time",
      emptyStateTitle: "Your messages",
      emptyStateDesc: "Select an existing conversation or start a new one from the \"Contacts\" tab.",
      refresh: "Refresh",
      justNow: "Just now",
      minutesAgo: "{n} min ago",
      noMessage: "No messages yet.",
      startChat: "Start the conversation!",
      conversation: "Conversation",
      you: "You",
      connectionStatus: {
        connecting: "Connecting...",
        disconnected: "Disconnected",
        offline: "Offline",
        connected: "Online",
      },
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

