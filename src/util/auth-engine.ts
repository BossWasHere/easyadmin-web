//import bcrypt from 'bcrypt'
import { EasyAdminAPI } from './api-connector'
import { hashPassword } from './crypto-util'

export namespace EasyAdminAuth {
  export type Account = {
    serverUrl: string
    token: string
  }

  export type PersistOptions = {
    persist: boolean
    awaitNext: boolean
    next?: () => Promise<void>
  }

  export type LoginState = MicrosoftAADAuthState | PasswordAuthState | OTPAuthState | void

  export type MicrosoftAADAuthState = {
    method: 'microsoftaad'
    phase: 'init' | 'authorize' | 'token'
    oauth2?: AzureADAuth.OAuth2Request
    oauthCode: string
    aadToken?: AzureADAuth.OAuth2TokenResponse
  }

  export type PasswordAuthState = {
    method: 'password'
    username: string
    password: string
    nonce?: NoncePair
  }

  export type OTPAuthState = {
    method: 'otp'
    otp: string
  }

  export type NoncePair = {
    id: string
    nonce: string
  }

  export interface AuthWrapper {
    loadState(pending: LoginState): Promise<void>
    saveState(): Promise<LoginState>
    beforeLogin(engine: EasyAdminAPI.APIEngine): Promise<PersistOptions | void>
    login(engine: EasyAdminAPI.APIEngine): Promise<string>
    afterLogin(engine: EasyAdminAPI.APIEngine): Promise<void>
  }

  export class MicrosoftAADAuth implements AuthWrapper {
    private state?: MicrosoftAADAuthState

    async loadState(state: LoginState) {
      if (state && state.method === 'microsoftaad') {
        this.state = { ...state }
        if (this.state.phase === 'authorize' || this.state.phase === 'token') {
          // persisted state workaround
          Object.setPrototypeOf(this.state.oauth2, AzureADAuth.OAuth2Request.prototype)
        }
      } else {
        throw new Error('No pending login, or unexpected login type')
      }
    }

    async saveState() {
      return this.state ?? throwError('No loaded state')
    }

    async beforeLogin() {
      if (!this.state) {
        throwError('No loaded state')
      }
      switch (this.state.phase) {
        case 'init': {
          this.state.phase = 'authorize'
          this.state.oauth2 = await AzureADAuth.initializeRequest()
          const authorizeUrl = this.state.oauth2.getAuthorizeUrl()
          return {
            persist: true,
            awaitNext: true,
            next: async () => {
              window.location.href = authorizeUrl
            },
          }
        }
        case 'authorize': {
          this.state.phase = 'token'
          if (!this.state.oauth2) {
            throw new Error('No OAuth2 state found for authorization')
          }
          const tokenResponse = await this.state.oauth2.getAccessToken(this.state.oauthCode)
          if ('token_type' in tokenResponse) {
            this.state.aadToken = tokenResponse
          } else {
            throw tokenResponse
          }
        }
      }
    }

    async login() {
      // TODO going to need a app service
      return ''
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async afterLogin() {}
  }

  export class PasswordAuth implements AuthWrapper {
    private state?: PasswordAuthState

    async loadState(state: LoginState) {
      if (state && state.method === 'password') {
        this.state = { ...state }
      } else {
        throw new Error('No pending login, or unexpected login type')
      }
    }

    async saveState() {
      return this.state ?? throwError('No loaded state')
    }

    async beforeLogin(engine: EasyAdminAPI.APIEngine) {
      if (!this.state) {
        throwError('No loaded state')
      }

      const noncePair = await engine.post<NoncePair>('/identity/nonce', {
        clientId: engine.getIdentity().clientId,
      })
      if ('error' in noncePair) {
        throw noncePair
      }
      this.state.nonce = noncePair
    }

    async login(engine: EasyAdminAPI.APIEngine) {
      if (!this.state) {
        throwError('No loaded state')
      }
      const passwordHash = await hashPassword(this.state.password + this.state.nonce?.nonce)
      //const passwordHash = await bcrypt.hash(this.state.password + this.state.nonce?.nonce, 16)

      const loginData = await engine.post<{ token: string }>('/identity/login', {
        method: 'password',
        clientId: engine.getIdentity().clientId,
        username: this.state.username,
        password: passwordHash,
        nonce: this.state.nonce,
      })
      if ('error' in loginData) {
        throw loginData
      }
      return loginData.token
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async afterLogin() {}
  }

  export class OTPAuth implements AuthWrapper {
    private state?: OTPAuthState

    async loadState(state: LoginState) {
      if (state && state.method === 'otp') {
        this.state = { ...state }
      } else {
        throw new Error('No pending login, or unexpected login type')
      }
    }

    async saveState() {
      return this.state ?? throwError('No loaded state')
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async beforeLogin() {}

    async login(engine: EasyAdminAPI.APIEngine) {
      const loginData = await engine.post<{ token: string }>('/identity/login', {
        method: 'otp',
        clientId: engine.getIdentity().clientId,
        otp: this.state?.otp,
      })
      if ('error' in loginData) {
        throw loginData
      }
      return loginData.token
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async afterLogin() {}
  }

  export class Authless implements AuthWrapper {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async loadState() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async saveState() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async beforeLogin() {}

    async login(engine: EasyAdminAPI.APIEngine) {
      const loginData = await engine.post<{ token: string }>('/identity/login', {
        method: 'open',
        clientId: engine.getIdentity().clientId,
      })
      if ('error' in loginData) {
        throw loginData
      }
      return loginData.token
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async afterLogin() {}
  }
}

export namespace AzureADAuth {
  export type PKCE = {
    codeVerifier: string
    codeChallenge: string
    codeChallengeMethod: 'S256'
  }

  export type OAuth2TokenResponse = {
    token_type: string
    scope: string
    expires_in: number
    ext_expires_in: number
    access_token: string
    refresh_token: string
  }

  export type OAuth2TokenError = {
    error: string
  }

  export async function initializeRequest(): Promise<OAuth2Request> {
    const pkce = await generatePKCE()
    return new OAuth2Request(pkce, secureRandomString(32))
  }

  async function generatePKCE(): Promise<AzureADAuth.PKCE> {
    const randomBuf = new Uint8Array(96)
    window.crypto.getRandomValues(randomBuf)

    const codeVerifier = base64EncodeURL(randomBuf)

    const hashBuffer = await window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier)
    )
    const codeChallenge = base64EncodeURL(new Uint8Array(hashBuffer))

    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256',
    }
  }

  export class OAuth2Request {
    clientId: string
    tenantId: string
    redirectUri: string
    scopes: string
    pkce: PKCE
    state: string

    constructor(pkce: PKCE, state: string) {
      this.clientId =
        process.env.MSAAD_OAUTH2_CLIENT_ID ?? throwError('Variable not set: MSAAD_OAUTH2_CLIENT_ID')
      this.tenantId =
        process.env.MSAAD_OAUTH2_TENANT_ID ?? throwError('Variable not set: MSAAD_OAUTH2_TENANT_ID')
      this.scopes =
        process.env.MSAAD_OAUTH2_SCOPES ?? throwError('Variable not set: MSAAD_OAUTH2_SCOPES')
      this.pkce = pkce
      this.state = state

      const redirectPath =
        process.env.MSAAD_OAUTH2_REDIRECT_PATH ??
        throwError('Variable not set: MSAAD_OAUTH2_REDIRECT_PATH')
      this.redirectUri = new URL(redirectPath, window.location.origin).href
    }

    getEncodedRedirectUri() {
      return encodeURIComponent(this.redirectUri)
    }

    getEncodedScopes() {
      return encodeURIComponent(this.scopes)
    }

    getAuthorizeUrl() {
      return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/authorize?client_id=${
        this.clientId
      }&response_type=code&redirect_uri=${this.getEncodedRedirectUri()}&code_challenge_method=${
        this.pkce.codeChallengeMethod
      }&code_challenge=${this.pkce.codeChallenge}&scope=${this.getEncodedScopes()}&state=${
        this.state
      }`
    }

    getTokenUrl() {
      return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`
    }

    async getAccessToken(
      code: string
    ): Promise<AzureADAuth.OAuth2TokenResponse | AzureADAuth.OAuth2TokenError> {
      const response = await fetch(this.getTokenUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          scope: this.scopes,
          code: code,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
          code_verifier: this.pkce.codeVerifier,
        }),
      })

      if (response.ok) {
        return (await response.json()) as AzureADAuth.OAuth2TokenResponse
      }

      return {
        error: await response.text(),
      }
    }
  }
}

function secureRandomString(n: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomValues = new Uint8Array(n)
  window.crypto.getRandomValues(randomValues)
  return Array.from(randomValues)
    .map((val) => {
      return chars[val % chars.length]
    })
    .join('')
}

function base64EncodeURL(array: Uint8Array) {
  return btoa(
    Array.from(array)
      .map((val) => {
        return String.fromCharCode(val)
      })
      .join('')
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, '')
}

// function base64DecodeURL(b64: string) {
//   return new Uint8Array(
//     atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
//       .split('')
//       .map((val) => {
//         return val.charCodeAt(0)
//       })
//   )
// }

function throwError(message: string): never {
  throw new Error(message)
}
