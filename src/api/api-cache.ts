import { EasyAdminAPI } from './api-connector'

export class APICache {
  private players: Map<string, EasyAdminAPI.PlayerInfo>
  private servers: Map<string, EasyAdminAPI.NetworkServer>
  private rootServers: string[]

  constructor() {
    this.players = new Map()
    this.servers = new Map()
    this.rootServers = []
  }

  clearAll() {
    this.clearPlayerCache()
    this.clearServerCache()
  }

  clearPlayerCache() {
    this.players.clear()
  }

  getPlayer(playerId: string): EasyAdminAPI.PlayerInfo | undefined {
    return this.players.get(playerId)
  }

  addPlayer(player: EasyAdminAPI.PlayerInfo) {
    this.players.set(player.uuid, player)
  }

  clearServerCache() {
    this.servers.clear()
    this.rootServers = []
  }

  getRootServerIds(): string[] {
    return Array.from(this.rootServers)
  }

  getServer(serverId: string): EasyAdminAPI.NetworkServer | undefined {
    return this.servers.get(serverId)
  }

  addServer(server: EasyAdminAPI.NetworkServer) {
    this.servers.set(server.id, server)
  }
}
