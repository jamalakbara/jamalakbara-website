export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  nonInteraction?: boolean
}

export interface CustomDimensions {
  custom_map: {
    [key: string]: string
  }
}

export class GoogleAnalyticsConfig {
  private static instance: GoogleAnalyticsConfig
  private measurementId: string
  private isInitialized: boolean = false

  private constructor() {
    this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
  }

  public static getInstance(): GoogleAnalyticsConfig {
    if (!GoogleAnalyticsConfig.instance) {
      GoogleAnalyticsConfig.instance = new GoogleAnalyticsConfig()
    }
    return GoogleAnalyticsConfig.instance
  }

  public getMeasurementId(): string {
    return this.measurementId
  }

  public isEnabled(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!this.measurementId &&
      this.measurementId.startsWith('G-') &&
      process.env.NODE_ENV === 'production'
    )
  }

  public shouldLoadScript(): boolean {
    return (
      !!this.measurementId &&
      this.measurementId.startsWith('G-') &&
      !this.isInitialized
    )
  }

  public markAsInitialized(): void {
    this.isInitialized = true
  }

  // Custom event configurations for portfolio interactions
  public static readonly EVENTS = {
    // Portfolio interactions
    PROJECT_VIEW: {
      action: 'view_project',
      category: 'portfolio'
    },
    PROJECT_CLICK: {
      action: 'click_project',
      category: 'portfolio'
    },
    PROJECT_LIVE_PREVIEW: {
      action: 'view_live_preview',
      category: 'portfolio'
    },

    // Contact and conversions
    CONTACT_FORM_VIEW: {
      action: 'view_contact_form',
      category: 'conversion'
    },
    CONTACT_FORM_SUBMIT: {
      action: 'submit_contact_form',
      category: 'conversion'
    },

    // Navigation
    NAVIGATION_CLICK: {
      action: 'click_navigation',
      category: 'navigation'
    },
    THEME_TOGGLE: {
      action: 'toggle_theme',
      category: 'ui_interaction'
    },

    // Service engagement
    SERVICE_VIEW: {
      action: 'view_service',
      category: 'services'
    },
    SERVICE_CLICK: {
      action: 'click_service',
      category: 'services'
    },

    // Page engagement
    SCROLL_DEPTH: {
      action: 'scroll_depth',
      category: 'engagement'
    },
    PAGE_DWELL_TIME: {
      action: 'page_dwell_time',
      category: 'engagement'
    }
  } as const

  // Custom dimensions for enhanced tracking
  public static readonly CUSTOM_DIMENSIONS = {
    PROJECT_CATEGORY: 'dimension1',
    PROJECT_YEAR: 'dimension2',
    PROJECT_TECH_STACK: 'dimension3',
    USER_DEVICE_TYPE: 'dimension4',
    USER_THEME_PREFERENCE: 'dimension5'
  } as const
}

// Default export for convenience
export const GAConfig = GoogleAnalyticsConfig.getInstance()