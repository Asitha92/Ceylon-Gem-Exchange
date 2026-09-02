// The dictionary's shape — every locale (including this one) is typed
// against this explicitly, rather than derived via `typeof en`, so a
// translation's string content doesn't get pinned to English's literal
// values. `si.ts` (and any future locale) implementing this interface means
// adding a key here without a matching entry there is a compile error, not
// a silently missing string.
//
// Namespaced by screen/feature, mirroring the 21-screen Claude Design
// corpus; `common` holds copy shared across screens (button labels, generic
// confirmations) rather than being tied to one of them.
//
// This is a first content pass — real copy, but not yet reviewed by a
// native Sinhala speaker (tracked as its own pre-launch task in the
// Confluence plan's risk register). Dynamic values (counts, prices, names)
// are deliberately not in here — components interpolate those at the call
// site; a dictionary entry is only ever the static label around them.
export interface Dictionary {
  common: {
    continue: string
    cancel: string
    save: string
    delete: string
    notNow: string
    search: string
    back: string
    next: string
    done: string
    retry: string
    loading: string
    genericError: string
    optional: string
  }
  auth: {
    signIn: {
      title: string
      subtitle: string
      emailLabel: string
      emailPlaceholder: string
      passwordLabel: string
      passwordPlaceholder: string
      forgotPassword: string
      submit: string
      noAccount: string
      signUpLink: string
    }
    signUp: {
      title: string
      subtitle: string
      nameLabel: string
      namePlaceholder: string
      mobileLabel: string
      emailLabel: string
      emailPlaceholder: string
      passwordLabel: string
      passwordPlaceholder: string
      submit: string
      hasAccount: string
      signInLink: string
      termsNotice: string
      /** Contains a literal `{{tradingTerms}}` marker — split on it to render `tradingTerms` as a separately styled inline span. */
      termsAgreement: string
      tradingTerms: string
    }
    forgotPassword: {
      title: string
      subtitle: string
      emailLabel: string
      emailPlaceholder: string
      submit: string
      backToSignIn: string
    }
    resetPassword: {
      title: string
      subtitle: string
      newPasswordLabel: string
      confirmPasswordLabel: string
      submit: string
      success: string
    }
    verifyPhone: {
      title: string
      subtitle: string
      codeSentTo: string
      resendCode: string
      resendIn: string
      submit: string
    }
    verifyEmail: {
      title: string
      subtitle: string
      resendLink: string
      checkSpamHint: string
    }
  }
  home: {
    searchPlaceholder: string
    featuredTitle: string
    categoriesTitle: string
    gemsTab: string
    equipmentTab: string
    viewAll: string
  }
  listingDetail: {
    priceOnRequest: string
    contactSeller: string
    whatsapp: string
    callSeller: string
    revealPhone: string
    reportListing: string
    blockSeller: string
    similarListings: string
    recentlyViewed: string
    certificate: string
    treatment: string
    origin: string
    weight: string
    dimensions: string
    shape: string
    color: string
    clarity: string
    soldBadge: string
  }
  postAd: {
    title: string
    stepPhotos: string
    stepDetails: string
    stepReview: string
    addPhotos: string
    coverPhotoHint: string
    gemTab: string
    equipmentTab: string
    titleLabel: string
    descriptionLabel: string
    priceLabel: string
    priceOnRequestToggle: string
    aiDraftButton: string
    submitForReview: string
    phoneVerificationRequired: string
    verifyNow: string
  }
  profile: {
    editProfile: string
    myAds: string
    myMembership: string
    savedSearches: string
    accountSettings: string
    memberSince: string
    verifiedBadge: string
    followers: string
  }
  editProfile: {
    title: string
    nameLabel: string
    bioLabel: string
    locationLabel: string
    whatsappLabel: string
    phoneLabel: string
    showPhoneToggle: string
  }
  accountSettings: {
    title: string
    language: string
    notifications: string
    privacy: string
    deleteAccount: string
    logOut: string
  }
  deleteAccount: {
    title: string
    warning: string
    confirmPrompt: string
    confirmButton: string
  }
  notifications: {
    title: string
    empty: string
    markAllRead: string
  }
  savedSearches: {
    title: string
    empty: string
    createFromSearch: string
    alertFrequency: string
    alertOff: string
    alertDaily: string
    alertInstant: string
  }
  myAds: {
    title: string
    empty: string
    statusActive: string
    statusPendingReview: string
    statusExpired: string
    statusSold: string
    renew: string
    markSold: string
    promote: string
  }
  membership: {
    title: string
    currentPlan: string
    upgrade: string
    freePlan: string
    dealerPlan: string
    showroomPlan: string
    creditsBalance: string
    manageBilling: string
  }
  noAccount: {
    title: string
    message: string
    signUpButton: string
  }
  countryPicker: {
    title: string
    searchPlaceholder: string
  }
  localeSettings: {
    title: string
    language: string
    currency: string
    location: string
  }
}

export const en: Dictionary = {
  common: {
    continue: 'Continue',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    notNow: 'Not now',
    search: 'Search',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    retry: 'Retry',
    loading: 'Loading…',
    genericError: 'Something went wrong. Please try again.',
    optional: 'Optional',
  },
  auth: {
    signIn: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue to Ceylon Gems',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot password?',
      submit: 'Sign in',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up',
    },
    signUp: {
      title: 'Create your account',
      subtitle: 'Join Sri Lanka’s trusted gem marketplace',
      nameLabel: 'Full name',
      namePlaceholder: 'Nimal Perera',
      mobileLabel: 'Mobile number',
      emailLabel: 'Email address (optional)',
      emailPlaceholder: 'you@gemhouse.lk',
      passwordLabel: 'Password',
      passwordPlaceholder: '8+ characters',
      submit: 'Create account',
      hasAccount: 'Already have an account?',
      signInLink: 'Sign in',
      termsNotice: 'By continuing, you agree to our Terms and Privacy Policy.',
      termsAgreement: 'I agree to the {{tradingTerms}} and NGJA certification checks.',
      tradingTerms: 'Trading Terms',
    },
    forgotPassword: {
      title: 'Forgot password?',
      subtitle: "Enter your email and we'll send you a reset link",
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      submit: 'Send reset link',
      backToSignIn: 'Back to sign in',
    },
    resetPassword: {
      title: 'Set a new password',
      subtitle: 'Choose a new password for your account',
      newPasswordLabel: 'New password',
      confirmPasswordLabel: 'Confirm password',
      submit: 'Reset password',
      success: 'Your password has been reset',
    },
    verifyPhone: {
      title: 'Verify your phone',
      subtitle: 'Enter the code we sent to your phone',
      codeSentTo: 'Code sent to',
      resendCode: 'Resend code',
      resendIn: 'Resend in',
      submit: 'Verify',
    },
    verifyEmail: {
      title: 'Verify your email',
      subtitle: 'We sent a verification link to your email',
      resendLink: 'Resend email',
      checkSpamHint: "Can't find it? Check your spam folder.",
    },
  },
  home: {
    searchPlaceholder: 'Search gemstones, equipment…',
    featuredTitle: 'Featured',
    categoriesTitle: 'Categories',
    gemsTab: 'Gems',
    equipmentTab: 'Equipment',
    viewAll: 'View all',
  },
  listingDetail: {
    priceOnRequest: 'Price on request',
    contactSeller: 'Contact seller',
    whatsapp: 'WhatsApp',
    callSeller: 'Call seller',
    revealPhone: 'Reveal phone number',
    reportListing: 'Report this listing',
    blockSeller: 'Block seller',
    similarListings: 'Similar listings',
    recentlyViewed: 'Recently viewed',
    certificate: 'Certificate',
    treatment: 'Treatment',
    origin: 'Origin',
    weight: 'Weight',
    dimensions: 'Dimensions',
    shape: 'Shape',
    color: 'Color',
    clarity: 'Clarity',
    soldBadge: 'Sold',
  },
  postAd: {
    title: 'Post an ad',
    stepPhotos: 'Photos',
    stepDetails: 'Details',
    stepReview: 'Review',
    addPhotos: 'Add photos',
    coverPhotoHint: 'The first photo is your cover photo',
    gemTab: 'Gem',
    equipmentTab: 'Equipment',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    priceLabel: 'Price',
    priceOnRequestToggle: 'Price on request',
    aiDraftButton: 'Draft with AI',
    submitForReview: 'Submit for review',
    phoneVerificationRequired: 'Verify your phone number before publishing',
    verifyNow: 'Verify now',
  },
  profile: {
    editProfile: 'Edit profile',
    myAds: 'My ads',
    myMembership: 'My membership',
    savedSearches: 'Saved searches',
    accountSettings: 'Account settings',
    memberSince: 'Member since',
    verifiedBadge: 'Verified seller',
    followers: 'Followers',
  },
  editProfile: {
    title: 'Edit profile',
    nameLabel: 'Business name',
    bioLabel: 'About',
    locationLabel: 'Location',
    whatsappLabel: 'WhatsApp number',
    phoneLabel: 'Phone number',
    showPhoneToggle: 'Show phone number on my listings',
  },
  accountSettings: {
    title: 'Account settings',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    deleteAccount: 'Delete account',
    logOut: 'Log out',
  },
  deleteAccount: {
    title: 'Delete account',
    warning: 'This will permanently delete your account and all your listings.',
    confirmPrompt: 'Are you sure you want to continue?',
    confirmButton: 'Delete my account',
  },
  notifications: {
    title: 'Notifications',
    empty: "You're all caught up",
    markAllRead: 'Mark all as read',
  },
  savedSearches: {
    title: 'Saved searches',
    empty: 'No saved searches yet',
    createFromSearch: 'Save this search',
    alertFrequency: 'Alert me',
    alertOff: 'Off',
    alertDaily: 'Daily digest',
    alertInstant: 'Instantly',
  },
  myAds: {
    title: 'My ads',
    empty: "You haven't posted any ads yet",
    statusActive: 'Active',
    statusPendingReview: 'Pending review',
    statusExpired: 'Expired',
    statusSold: 'Sold',
    renew: 'Renew',
    markSold: 'Mark as sold',
    promote: 'Promote',
  },
  membership: {
    title: 'My membership',
    currentPlan: 'Current plan',
    upgrade: 'Upgrade',
    freePlan: 'Free',
    dealerPlan: 'Dealer',
    showroomPlan: 'Showroom',
    creditsBalance: 'Credits balance',
    manageBilling: 'Manage billing',
  },
  noAccount: {
    title: 'Create an account to continue',
    message: 'Sign up to save listings, message sellers, and post your own ads.',
    signUpButton: 'Sign up',
  },
  countryPicker: {
    title: 'Select country',
    searchPlaceholder: 'Search country or code',
  },
  localeSettings: {
    title: 'Location, language & currency',
    language: 'Language',
    currency: 'Currency',
    location: 'Location',
  },
}
