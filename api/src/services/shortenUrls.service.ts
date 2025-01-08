// @ts-ignore тк у либы не настроена типизация
import generateHash from 'random-hash';
import {Database} from "./db.service";

export const shortenUrl = async (protocol: string, host: string, port: number, originalUrl: string) => {
    try {
        const hash = generateHash({length: 6})
        await Database.set(hash, originalUrl)

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