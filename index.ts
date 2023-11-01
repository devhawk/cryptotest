import { Subtle } from './subtle.js';
import { GOSQAS } from './gosqas.js';

const quote = "This is Jack Burton in the Pork Chop Express, and I'm talkin' to whoever's out there.";

async function test(
  makeKey: () => Promise<Uint8Array>,
  encrypt: (key: Uint8Array, data: Uint8Array) => Promise<{ salt: string; encryptedData: Uint8Array; }>,
  decrypt: (key: Uint8Array, salt: string, encryptedData: Uint8Array) => Promise<Uint8Array>
) {
  const data = new TextEncoder().encode(quote);
  const key = await makeKey();
  const { salt, encryptedData } = await encrypt(key, data);
  const result = await decrypt(key, salt, encryptedData);
  const $quote = new TextDecoder().decode(result);
  console.log($quote);
}

async function main() {
  await test(Subtle.makeDeviceKey, Subtle.encrypt, GOSQAS.decrypt);
}

main().catch(console.error);
