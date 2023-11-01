import { fromHex, toHex } from './common';
import { webcrypto } from 'node:crypto';

export namespace Subtle {
  export async function makeDeviceKey(): Promise<Uint8Array> {
    const key = await webcrypto.subtle.generateKey({
      name: "AES-CBC",
      length: 128
    }, true, ['encrypt', 'decrypt']);
    const buffer = await webcrypto.subtle.exportKey("raw", key);
    return new Uint8Array(buffer).slice();
  }

  export async function encrypt(key: Uint8Array, data: Uint8Array): Promise<{ salt: string; encryptedData: Uint8Array; }> {
    const $key = await webcrypto.subtle.importKey("raw", key.buffer, "AES-CBC", false, ['encrypt']);
    const iv = webcrypto.getRandomValues(new Uint8Array(16));
    const encryptedData = await webcrypto.subtle.encrypt({ name: "AES-CBC", iv }, $key, data.buffer);
    return { salt: toHex(iv), encryptedData: new Uint8Array(encryptedData) };
  }

  export async function decrypt(key: Uint8Array, salt: string, encryptedData: Uint8Array): Promise<Uint8Array> {
    const $key = await webcrypto.subtle.importKey("raw", key, "AES-CBC", false, ["decrypt"]);
    const iv = fromHex(salt);
    const result = await webcrypto.subtle.decrypt({ name: "AES-CBC", iv }, $key, encryptedData);
    return new Uint8Array(result);
  }
}
