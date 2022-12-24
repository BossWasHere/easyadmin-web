import { scrypt } from 'scrypt-js'

export async function hashPassword(
  plain: string,
  saltLength = 32,
  keyLength = 32
): Promise<string> {
  const plainBuffer = new TextEncoder().encode(plain.normalize('NFKC'))
  const saltBuffer = new Uint8Array(saltLength)

  window.crypto.getRandomValues(saltBuffer)

  const hashed = await scrypt(plainBuffer, saltBuffer, 1024, 8, 1, keyLength)
  return intArrayToHex(saltBuffer) + ':' + intArrayToHex(hashed)
}

function intArrayToHex(intArray: Uint8Array): string {
  return Array.from(intArray)
    .map((i) => i.toString(16).padStart(2, '0'))
    .join('')
}
