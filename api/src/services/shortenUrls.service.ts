// @ts-ignore тк у либы не настроена типизация
import generateHash from 'random-hash';
import {Database} from "./db.service";
import {UserFriendlyDbUrlDto} from "../dto/user-friendly-db-url.dto";

export const shortenUrl = async (protocol: string, host: string, port: number, originalUrl: string, ttl?: number) => {
    try {
        const options = {ttl: NaN}
        const hash = generateHash({length: 6})

        if (Number(ttl) > 0) options.ttl = Number(ttl);

        if (originalUrl.startsWith("https://") || originalUrl.startsWith("http://")) {
            await Database.set(hash, originalUrl, options)
        } else {
            await Database.set(hash, "http://" + originalUrl, options)
        }


        return `${protocol}://${host}:${port}/${hash}`
    } catch (error) {
        console.error('service err shortenUrl')
    }
}

export const getOriginalUrl = async (hash: string) => {
    try {
        const urlData = await Database.getWithMeta(hash)
        if (urlData) {
            if (urlData.meta.expiresAt != null && urlData.meta.expiresAt <= Date.now()) {
                throw new Error("Url has expired");
            }
        }
        return urlData?.value
    } catch (error) {
        console.error('service err getOriginalUrl')
        throw error;
    }
}

export const getUrlInfo = async (hash: string) => {
    try {
        const info = await Database.getWithMeta(hash)

        if (!info) {
            return null;
        }

        const result: UserFriendlyDbUrlDto = {
            originalUrl: info.value,
            clickCount: info.meta.clickCount,
            expiresAt: info.meta.expiresAt ? new Date(info.meta.expiresAt) : null,
            createdAt: new Date(info.meta.createdAt)
        }

        return result
    } catch (error) {
        console.error('service err getUrlInfo')
    }
}

export const delShortUrl = async (hash: string) => {
    try {
        const urlData = await Database.get(hash)
        if (!urlData) {
            return false;
        }

        await Database.del(hash)
        return true;
    } catch (error) {
        console.error('service err delShortUrl')
    }
}