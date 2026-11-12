export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function generateAesGcmKey(): Promise<{ key: CryptoKey; rawHex: string }> {
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  const exported = await window.crypto.subtle.exportKey('raw', key);
  return { key, rawHex: bufferToHex(exported) };
}

export async function encryptAesGcm(
  plaintext: string,
  key: CryptoKey
): Promise<{ ciphertextBase64: string; ivBase64: string; ivHex: string }> {
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );
  return {
    ciphertextBase64: bufferToBase64(encryptedBuffer),
    ivBase64: bufferToBase64(iv),
    ivHex: bufferToHex(iv),
  };
}

export async function decryptAesGcm(
  ciphertextBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder();
  const iv = base64ToUint8Array(ivBase64);
  const ciphertextBytes = base64ToUint8Array(ciphertextBase64);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(iv).buffer,
    },
    key,
    new Uint8Array(ciphertextBytes).buffer
  );
  return decoder.decode(decryptedBuffer);
}

export async function computeSha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-256', encoder.encode(message));
  return bufferToHex(digest);
}

export interface RsaKeyExchangeDemo {
  publicKeyPemPreview: string;
  encryptedSessionKeyBase64: string;
  recoveredSessionKeyHex: string;
  originalSessionKeyHex: string;
  matched: boolean;
}

/**
 * Uses genuine Web Crypto RSA-OAEP (2048-bit, SHA-256) to demonstrate asymmetric
 * public-key wrapping of a 256-bit AES session key between a Hospital Department
 * and the Central Patient Records Server.
 */
export async function runLiveRsaKeyExchange(): Promise<RsaKeyExchangeDemo> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const spki = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const publicKeyBase64 = bufferToBase64(spki);
  const publicKeyPemPreview = `${publicKeyBase64.slice(0, 44)}...${publicKeyBase64.slice(-24)}`;

  const aesSessionBytes = window.crypto.getRandomValues(new Uint8Array(32));
  const originalSessionKeyHex = bufferToHex(aesSessionBytes);

  const wrapped = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    keyPair.publicKey,
    aesSessionBytes
  );

  const unwrapped = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    keyPair.privateKey,
    wrapped
  );

  const recoveredSessionKeyHex = bufferToHex(unwrapped);

  return {
    publicKeyPemPreview,
    encryptedSessionKeyBase64: bufferToBase64(wrapped),
    originalSessionKeyHex,
    recoveredSessionKeyHex,
    matched: originalSessionKeyHex === recoveredSessionKeyHex,
  };
}

