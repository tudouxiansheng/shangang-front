import sha256 from 'crypto-js/sha256'

export function encryBySha256(ciphertext) {
  return sha256(ciphertext).toString()
}
