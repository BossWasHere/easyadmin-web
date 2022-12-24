export interface LocaleDict {
  productTitle: string
  common: {
    player: string
    server: string
    never: string
  }
  ui: {
    header: {
      searchTip: string
    }
    login: {
      msOauth2: string
      password: string
      oneTimePassword: string
      insecure: string
      usernameField: string
      passwordField: string
      oneTimePasswordField: string
      remoteAddressField: string
      withMicrosoft: string
      withPassword: string
      withOneTimePassword: string
      withInsecure: string
    }
    generic: {
      fieldRequired: string
    }
    search: {
      recent: string
      results: string
    }
    navgoto: {
      dashboard: string
      installationHelp: string
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
      pageLogin: string
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
      currentSession: string
      currentServer: string
      firstJoined: string
      lastJoined: string
      lastDisconnected: string
      timesJoined: string
      playTime: string
      lastPunishment: string
      lastIPAddress: string
      bans: string
      mutes: string
      kicks: string
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
    saveChanges: string
  }
}
