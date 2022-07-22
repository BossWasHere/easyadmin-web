export interface LocaleDict {
  productTitle: string
  common: {
    player: string
    server: string
  }
  ui: {
    header: {
      searchTip: string
    }
    search: {
      recent: string
      results: string
    }
    navigation: {
      labelGeneral: string
      labelAccount: string

      pageDashboard: string
      pageModerationAnalytics: string
      pageNetworkAnalytics: string
      pageUserSettings: string
      pageLogout: string
      pageAdministrativeSettings: string
      pageActiveSessions: string
      pageLogs: string
      pageAbout: string
      pageBugReport: string
      pageSupport: string
    }
    footer: {
      labelCopyright: string
    }
    player: {
      details: string
      history: string
      aliases: string
      moderation: string
      actions: string
      lastJoined: string
      playTime: string
      currentServer: string
    }
  }
  admin: {
    auth: {
      title: string
      tip: string
      password: string
      passwordDescription: string
      microsoftSSO: string
      microsoftSSODescription: string
      temporarySession: string
      temporarySessionDescription: string
      insecure: string
      insecureDescription: string
    }
  }
}
