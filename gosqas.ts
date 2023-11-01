import crypto from 'node:crypto';

export namespace GOSQAS {
    export async function makeDeviceKey(): Promise<Uint8Array> {
        return new Uint8Array(crypto.randomBytes(16)).slice();
    }

    export async function encrypt(key: Uint8Array, data: Uint8Array): Promise<{ salt: string; encryptedData: Uint8Array; }> {
        const salt = crypto.randomBytes(16);
        const crypter = crypto.createCipheriv('aes-128-cbc', key, salt);
        const buffer = Buffer.concat([crypter.update(data), crypter.final()]);
        const encryptedData = new Uint8Array(buffer).slice();
        return { salt: salt.toString('hex'), encryptedData };
    }

    export async function decrypt(key: Uint8Array, salt: string, encryptedData: Uint8Array): Promise<Uint8Array> {
        const $salt = Buffer.from(salt, 'hex');
        const crypter = crypto.createDecipheriv('aes-128-cbc', key, $salt);
        const buffer = Buffer.concat([crypter.update(encryptedData), crypter.final()]);
        return new Uint8Array(buffer).slice();
    }
}