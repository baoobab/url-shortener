import {Request, Response} from 'express';
import {
    delShortUrl,
    getOriginalUrl,
    getUrlAnalyticsInfo,
    getUrlInfo,
    shortenUrl
} from "../services/shortenUrls.service";

export const makeShorten = async (req: Request, res: Response) => {
    const originalUrl = req.body.originalUrl
    const ttl = req.body.ttl

    if (!originalUrl) {
        res.status(400).json({error: 'originalUrl is required'})
        return;
    }

    try {
        const host = req.hostname
        const port = Number(process.env.API_PORT)

        const shortenedUrl = await shortenUrl(req.protocol, host, port, originalUrl, ttl)
        res.status(201).json(shortenedUrl)
    } catch (error) {
        console.error('Error shortening URL:', error)

        res.status(500).json({error: 'Failed to shorten URL'});
    }
}


export const get = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const originalUrl = await getOriginalUrl(hash)

        if (!originalUrl) {
            res.status(404).json({error: 'Url not found'});
            return;
        }

        res.status(200).redirect(originalUrl)
    } catch (error: any) {
        if (error.message === 'Url has expired') {
            res.status(401).json({ error: 'Url has expired' })
            return;
        }

        console.error('Error redirecting:', error)
        res.status(500).json({error: 'Failed to redirect'});
    }
}

export const getInfo = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const info = await getUrlInfo(hash)

        if (!info) {
            res.status(404).json({error: 'Url not found'});
            return;
        }

        res.status(200).json(info)
    } catch (error) {
        console.error('Error getting info:', error)
        res.status(500).json({error: 'Failed to getting info'});
    }
}

export const getAnalyticsInfo = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const info = await getUrlAnalyticsInfo(hash)

        if (!info) {
            res.status(404).json({error: 'Url not found'});
            return;
        }

        res.status(200).json(info)
    } catch (error) {
        console.error('Error getting analytics info:', error)
        res.status(500).json({error: 'Failed to getting analytics info'});
    }
}

export const del = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const isDeleted = await delShortUrl(hash)

        if (!isDeleted) {
            res.status(400).json({error: "Url not found"})
            return;
        }

        res.status(204).json("deleted")
    } catch (error) {
        console.error('Error getting info:', error)
        res.status(500).json({error: 'Failed to deleting shortUrl'});
    }
}