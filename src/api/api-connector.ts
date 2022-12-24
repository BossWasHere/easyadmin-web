import { EasyAdminAuth } from './auth-engine'
import { useAccountStore } from 'src/stores/account-store'
import { useSessionStore } from 'src/stores/session-store'
import { hashPassword } from '../util/crypto-util'

export namespace EasyAdminAPI {
  export type APIStatus = {
    uptime: number
    platform: {
      name: string
      version: string
    }
    playerCount: number
  }

  export type NetworkServerRoot = {
    servers: NetworkServer[]
  }

  export type NetworkServer = {
    type: 'standard' | 'proxy'
    id: string
    platform: string
    description: string
    children?: NetworkServer[]
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

    constructor(engine?: APIProvider) {
      this.engine = engine ?? UndefinedEngine
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
      const noncePair = await this.engine.post<EasyAdminAuth.NoncePair>('/identity/nonce', {
        clientId: this.engine.getIdentity().clientId,
      })

      if ('error' in noncePair) {
        return noncePair
      }

      const passwordHash = await hashPassword(currentPassword + noncePair.nonce)

      return await this.engine.post<PasswordChange>('/identity/password', {
        old: passwordHash,
        new: newPassword,
        nonce: noncePair,
      })
    }
  }

  interface APIProvider {
    isAuthenicated(): boolean
    getAccessToken(): string | undefined
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
    private isAuthenticating: boolean

    constructor(baseUrl: string, accessToken?: string) {
      this.accessToken = accessToken
      this.baseUrl = baseUrl
      this.isAuthenticating = false
    }

    isAuthenicated() {
      return !!this.getAccessToken()
    }

    getAccessToken() {
      return this.accessToken
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
      await authWrapper.loadState(state)
      this.isAuthenticating = true
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
      this.isAuthenticating = false
      if (store) {
        useAccountStore().insertAccount({ serverUrl: this.baseUrl, token: this.accessToken })
      }
      useAccountStore().updatePendingLogin()
      await authWrapper.afterLogin(this)
    }

    async get<T>(path: string): Promise<T | APIError> {
      const url = new URL(path, this.baseUrl).toString()
      if (!this.getAccessToken()) {
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
            Authorization: `Bearer ${this.getAccessToken()}`,
            'Content-Type': 'application/json',
          },
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

    async post<T>(path: string, body?: object): Promise<T | APIError> {
      const url = new URL(path, this.baseUrl).toString()
      if (!this.getAccessToken() && !this.isAuthenticating) {
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
            Authorization: this.isAuthenticating ? undefined : `Bearer ${this.getAccessToken()}`,
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
