// @ts-ignore тк у либы не настроена типизация
import generateHash from 'random-hash';
import {Database} from "./db.service";
import {UserFriendlyDbUrlDto} from "../dto/user-friendly-db-url.dto";

export const shortenUrl = async (protocol: string, host: string, port: number, originalUrl: string) => {
    try {
        const hash = generateHash({length: 6})

        if (originalUrl.startsWith("https://") || originalUrl.startsWith("http://")) {
            await Database.set(hash, originalUrl)
        } else {
            await Database.set(hash, "http://" + originalUrl)
        }


        return `${protocol}://${host}:${port}/${hash}`
    } catch (error) {
        console.error('service err shortenUrl')
    }
}

export const getOriginalUrl = async (hash: string) => {
    try {
        return await Database.get(hash)
    } catch (error) {
        console.error('service err getOriginalUrl')
    }
}

export const getUrlInfo = async (hash: string) => {
    try {
        const info = await Database.getWithMeta(hash)

        if (!info) {
            return null;
        }

        let result: UserFriendlyDbUrlDto = {
            originalUrl: info.value,
            clickCount: info.meta.clickCount,
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