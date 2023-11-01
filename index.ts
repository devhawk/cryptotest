import { Subtle } from './subtle.js';
import { GOSQAS } from './gosqas.js';
import base58 from 'bs58';
import { toHex } from './common.js';

const quote = "This is Jack Burton in the Pork Chop Express, and I'm talkin' to whoever's out there.";

async function test(
  makeKey: () => Promise<Uint8Array>,
  encrypt: (key: Uint8Array, data: Uint8Array) => Promise<{ salt: string; encryptedData: Uint8Array; }>,
  decrypt: (key: Uint8Array, salt: string, encryptedData: Uint8Array) => Promise<Uint8Array>
) {
  const data = new TextEncoder().encode(quote);
  console.log(`Encoded Quote: ${toHex(data)}`)
  const key = await makeKey();
  console.log(`Encoded Key: ${base58.encode(key)}`);
  const { salt, encryptedData } = await encrypt(key, data);
  console.log(`Salt: ${salt}`);
  console.log(`Encrypted Data: ${toHex(encryptedData)}`)
  const result = await decrypt(key, salt, encryptedData);
  console.log(`Decrypted Data: ${toHex(result)}`)
  const $quote = new TextDecoder().decode(result);
  console.log(`Decoded Quote: ${$quote}`);
}

async function main() {
  await test(GOSQAS.makeDeviceKey, GOSQAS.encrypt, Subtle.decrypt);
}

main().catch(console.error);
