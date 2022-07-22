import type { LocaleDict } from '../messages'

const messages: LocaleDict = {
  productTitle: 'EasyAdmin',
  common: {
    player: 'player',
    server: 'server',
    never: 'never',
  },
  ui: {
    header: {
      searchTip: 'Search for a player, UUID, or server',
    },
    search: {
      recent: 'Recent',
      results: 'Results',
    },
    navigation: {
      labelGeneral: 'General',
      labelAccount: 'Account',
      pageDashboard: 'My Dashboard',
      pageModerationAnalytics: 'Moderation Analytics',
      pageNetworkAnalytics: 'Network Analytics',
      pageUserSettings: 'User Settings',
      pageLogout: 'Logout',
      pageAdministrativeSettings: 'Administrative Settings',
      pageActiveSessions: 'Active Sessions',
      pageLogs: 'Logs',
      pageAbout: 'About',
      pageBugReport: 'Report a Bug',
      pageSupport: 'Help',
    },
    footer: {
      labelCopyright: 'EasyAdmin Web © BackwardsNode 2022',
    },
    player: {
      details: 'Details',
      history: 'History',
      aliases: 'Aliases',
      moderation: 'Moderation',
      actions: 'Actions',
      currentSession: 'Current Session',
      currentServer: 'Current Server',
      lastJoined: 'Last Joined',
      lastDisconnected: 'Last Disconnected',
      timesJoined: 'Times Joined',
      playTime: 'Play Time',
      lastIPAddress: 'Last IP',
      lastPunishment: 'Last Punishment',
      bans: 'Bans',
      mutes: 'Mutes',
    },
  },
  admin: {
    auth: {
      title: 'Authentication',
      tip: 'Controls how EasyAdmin authenticates users online:',
      password: 'Password',
      passwordDescription: ' - Log in with traditional email & password',
      microsoftSSO: 'Microsoft SSO',
      microsoftSSODescription: ' - Use your Microsoft account to login',
      temporarySession: 'Temporary Session',
      temporarySessionDescription: ' - Run a command in-game to get a one-time code to login with',
      insecure: 'Insecure',
      insecureDescription: ' - ONLY USE IF THIS SERVICE IS NOT EXPOSED THIS TO THE INTERNET',
    },
  },
}

export default messages
