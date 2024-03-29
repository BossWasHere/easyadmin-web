import { EasyAdminAuth } from './auth-engine'
import { useAccountStore } from 'src/stores/account-store'
import { useSessionStore } from 'src/stores/session-store'
import { hashPassword } from '../util/crypto-util'
import { APICache } from './api-cache'

export namespace EasyAdminAPI {
  export type APIVersion = 'v1.0'

  export type APIStatus = {
    uptime: number
    platform: {
      name: string
      version: string
    }
    playerCount: number
  }

  export type NetworkServerRoot = {
    roots: string[]
    servers: NetworkServer[]
  }

  export type NetworkServer = {
    type: 'standard' | 'proxy'
    id: string
    platform: string
    description: string
    children?: string[]
    managableInstance: boolean
    stats: {
      name: string
      motd: string
      online: boolean
      onlinePlayers: number
      maxPlayers: number
    }
  }

  export type SearchResults<T extends SearchResult> = {
    results: T[]
  }

  export type SearchResult = {
    type: string
  }

  export type PlayerResult = SearchResult & {
    uuid: string
    name: string
  }

  export type ServerResult = SearchResult & {
    name: string
  }

  export type PlayerInfo = {
    uuid: string
    name: string
    displayName: string
    isOnline: boolean
    roles: PlayerRole[]
    session: {
      currentPlaytime: number
      currentServer: string
    } | null
    firstJoined: number
    lastJoined: number
    lastSeen: number
    joinCount: number
    playTime: number
    lastIp: string
    punishmentHistory: Punishment[]
    moderationHistory: Punishment[]
    banCount: number
    muteCount: number
    kickCount: number
    aliases: string[]
    availableActions: PlayerActionType[]
  }

  export type PlayerRole = {
    name: string
    color: string
    weight: number
  }

  export type Punishment = {
    id: number
    type: string
    reason: string
  }

  export const PlayerAction = {
    Ban: 'ban',
    Kick: 'kick',
    Mute: 'mute',
    Unban: 'unban',
    Unmute: 'unmute',
    Comment: 'comment',
    Warn: 'warn',
    MoveServer: 'move-server',
    SendMessage: 'send-message',
    SendAnonymousMessage: 'send-anonymous-message',
    ManageRoles: 'manage-roles',
    ManagePermissions: 'manage-permissions',
    ExecuteCommand: 'execute-command',
  } as const

  export type PlayerActionType = typeof PlayerAction[keyof typeof PlayerAction]

  export type PasswordChange = {
    success: boolean
  }

  export type APIError = {
    error: string
    errorStatus: string
    code: number
  }

  export async function login(
    serverUrl: string,
    authWrapper: EasyAdminAuth.AuthWrapper,
    state: EasyAdminAuth.LoginState,
    remember: boolean
  ): Promise<APIEngine | APIError> {
    const engine = new APIEngine(serverUrl)
    try {
      console.debug(`Preparing to log in to ${serverUrl}`)
      await engine.handleLogin(authWrapper, state, remember)
      console.debug(`Logged in to ${serverUrl}`)
      useSessionStore().applyEngine(engine)
      return engine
    } catch (err) {
      console.error(`Failed to log in to ${serverUrl}`, err)
      return err as APIError
    }
  }

  export class APISession {
    private engine: APIProvider
    private cache: APICache

    constructor(engine?: APIProvider) {
      this.engine = engine ?? UndefinedEngine
      this.cache = new APICache()
    }

    setEngine(engine: APIProvider) {
      this.engine = engine
    }

    async getAPIStatus(): Promise<APIStatus | APIError> {
      return await this.engine.get<APIStatus>('/server/status')
    }

    async getServerGraph(): Promise<NetworkServerRoot | APIError> {
      return await this.engine.get<NetworkServerRoot>('/server/network')
    }

    async getServerInfo(id: string, getChildren = false): Promise<NetworkServer | APIError> {
      return await this.engine.get<NetworkServer>(
        `/server/${id}?${new URLSearchParams({ children: getChildren.toString() })}`
      )
    }

    async getPlayerInfo(uuid: string): Promise<PlayerInfo | APIError> {
      return await this.engine.get<PlayerInfo>(`/player/${uuid}`)
    }

    async searchServers(
      query: string,
      limit = 10
    ): Promise<SearchResults<ServerResult> | APIError> {
      return await this.engine.get<SearchResults<ServerResult>>(
        `/server/search?${new URLSearchParams({ query, limit: limit.toString() })}`
      )
    }

    async searchPlayers(
      query: string,
      limit = 10
    ): Promise<SearchResults<PlayerResult> | APIError> {
      return await this.engine.get<SearchResults<PlayerResult>>(
        `/player/search?${new URLSearchParams({ query, limit: limit.toString() })}`
      )
    }

    async searchAll(
      query: string,
      limit = 10
    ): Promise<SearchResults<PlayerResult | ServerResult> | APIError> {
      return await this.engine.get<SearchResults<PlayerResult | ServerResult>>(
        `/search?${new URLSearchParams({ query, limit: limit.toString() })}`
      )
    }

    async changePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<PasswordChange | APIError> {
      const nonceResult = await this.engine.post<{ nonce: string }>('/identity/nonce', {
        clientId: this.engine.getIdentity().clientId,
      })

      if ('error' in nonceResult) {
        return nonceResult
      }

      const passwordHash = await hashPassword(currentPassword + nonceResult.nonce)

      return await this.engine.post<PasswordChange>('/identity/password', {
        old: passwordHash,
        new: newPassword,
        nonce: nonceResult,
      })
    }
  }

  interface APIProvider {
    isAuthenicated(): boolean
    getAccessToken(): string | undefined
    getAPIVersion(): APIVersion | undefined
    getIdentity(): { token?: string; clientId: string }
    handleLogin(
      authWrapper: EasyAdminAuth.AuthWrapper,
      state: EasyAdminAuth.LoginState,
      store?: boolean
    ): Promise<void>
    get<T>(path: string): Promise<T | APIError>
    post<T>(path: string, body: object): Promise<T | APIError>
  }

  const UndefinedEngine: APIProvider = {
    isAuthenicated(): boolean {
      return false
    },

    getAccessToken() {
      return undefined
    },

    getAPIVersion() {
      return undefined
    },

    getIdentity() {
      const { clientId } = useAccountStore()
      return {
        clientId,
      }
    },

    async handleLogin() {
      return
    },

    async get() {
      return {
        error: 'No authorization engine selected',
        errorStatus: 'Unauthorized',
        code: -1,
      }
    },

    async post() {
      return {
        error: 'No authorization engine selected',
        errorStatus: 'Unauthorized',
        code: -1,
      }
    },
  }

  export class APIEngine implements APIProvider {
    private accessToken?: string
    private baseUrl: string
    private apiVersion?: APIVersion

    constructor(baseUrl: string, accessToken?: string) {
      this.accessToken = accessToken
      this.baseUrl = baseUrl
    }

    isAuthenicated() {
      return !!this.getAccessToken()
    }

    getAccessToken() {
      return this.accessToken
    }

    getAPIVersion() {
      return this.apiVersion
    }

    getAPIUrl(endpoint = '') {
      return new URL((this.apiVersion ?? 'v1.0') + endpoint, this.baseUrl)
    }

    getIdentity() {
      const { clientId } = useAccountStore()
      return {
        token: this.accessToken,
        clientId,
      }
    }

    async handleLogin(
      authWrapper: EasyAdminAuth.AuthWrapper,
      state: EasyAdminAuth.LoginState,
      store = true
    ) {
      await this.checkAPIAvailability()
      await authWrapper.loadState(state)
      const persistOptions = await authWrapper.beforeLogin(this)
      if (persistOptions) {
        if (persistOptions.persist) {
          useAccountStore().updatePendingLogin(await authWrapper.saveState())
        }
        if (persistOptions.next) {
          if (persistOptions.awaitNext) {
            await persistOptions.next()
          } else {
            persistOptions.next()
          }
        }
      }
      this.accessToken = await authWrapper.login(this)
      if (store) {
        useAccountStore().insertAccount({ serverUrl: this.baseUrl, token: this.accessToken })
      }
      useAccountStore().updatePendingLogin()
      await authWrapper.afterLogin(this)
    }

    async checkAPIAvailability(forceRefresh = false): Promise<APIVersion> {
      if (this.apiVersion && !forceRefresh) {
        return this.apiVersion
      }

      const url = new URL(this.baseUrl)

      const result = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      })

      const versionData = await this.handleResponse<{ version: APIVersion }>(result)
      if ('error' in versionData) {
        throw versionData
      }

      this.apiVersion = versionData.version
      return versionData.version
    }

    async get<T>(path: string, requireAuthorization = true): Promise<T | APIError> {
      const url = this.getAPIUrl(path)

      if (!this.getAccessToken() && requireAuthorization) {
        return {
          error: 'No access token provided',
          errorStatus: 'Unauthorized',
          code: 401,
        }
      }

      try {
        const result = await fetch(url, {
          headers: {
            Accept: 'application/json',
            Authorization: requireAuthorization ? undefined : `Bearer ${this.getAccessToken()}`,
            'Content-Type': 'application/json',
          } as HeadersInit,
        })

        return await this.handleResponse<T>(result)
      } catch (error) {
        return {
          error: error as string,
          errorStatus: 'Unknown',
          code: -1,
        }
      }
    }

    async post<T>(path: string, body?: object, requireAuthorization = true): Promise<T | APIError> {
      const url = this.getAPIUrl(path)

      if (!this.getAccessToken() && requireAuthorization) {
        return {
          error: 'No access token provided',
          errorStatus: 'Unauthorized',
          code: 401,
        }
      }

      try {
        const result = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: requireAuthorization ? undefined : `Bearer ${this.getAccessToken()}`,
            'Content-Type': 'application/json',
          } as HeadersInit,
          body: JSON.stringify(body),
        })

        return await this.handleResponse<T>(result)
      } catch (error) {
        return {
          error: error as string,
          errorStatus: 'Unknown',
          code: -1,
        }
      }
    }

    private async handleResponse<T>(response: Response): Promise<T | APIError> {
      if (response.ok) {
        return await response.json()
      }
      return {
        error: await response.text(),
        errorStatus: response.statusText,
        code: response.status,
      }
    }
  }
}
