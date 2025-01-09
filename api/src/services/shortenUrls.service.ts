// @ts-ignore тк у либы не настроена типизация
import generateHash from 'random-hash';
import {Database} from "./db.service";
import {UserFriendlyUrlDto} from "../../dto/user-friendly-url.dto";
import {UserFriendlyMetricDto} from "../../dto/user-friendly-metric.dto";
import {UserFriendlyMetricMetaDto} from "../../dto/user-friendly-metric-meta.dto";

export const shortenUrl = async (protocol: string, host: string, port: number, originalUrl: string, ttl?: number) => {
    try {
        const options = {ttl: NaN}
        const hash = generateHash({length: Number(process.env.SHORT_URL_HASH_LENGTH) || 6})

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

        const result: UserFriendlyUrlDto = {
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

export const getUrlAnalyticsInfo = async (hash: string) => {
    try {
        const ipArrSize = Number(process.env.ANALYTICS_IP_ARRAY_LENGTH) || 5
        const info = await Database.getWithMeta(hash) //  собираем число переходов
        const dbMetrics = await Database.getMetrics(hash)
        const userFriendlyMetrics: UserFriendlyMetricMetaDto[] = []

        if (!info) return null;
        if (dbMetrics) {
            const slicedDbMetrics =
                dbMetrics.slice(-ipArrSize).sort((a, b) => {
                    return b.meta.createdAt - a.meta.createdAt
                })

            slicedDbMetrics.map(item => {
                const ufItem: UserFriendlyMetricMetaDto = {
                    ip: item.value,
                    clickedAt: new Date(item.meta.createdAt)
                }
                userFriendlyMetrics.push(ufItem)
                return item
            })
        }

        const result: UserFriendlyMetricDto = {
            originalUrl: info.value,
            clickCount: info.meta.clickCount,
            metrics: userFriendlyMetrics
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