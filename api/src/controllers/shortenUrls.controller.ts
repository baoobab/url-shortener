import {Request, Response} from 'express';
import {getOriginalUrl, shortenUrl} from "../services/shortenUrls.service";

export const shorten = async (req: Request, res: Response) => {
    const originalUrl = req.body.originalUrl

    if (!originalUrl) {
        res.status(400).json({ error: "originalUrl is required" })
        return;
    }

    try {
        const host = req.hostname
        const port = Number(process.env.API_PORT)

        const shortenedUrl = await shortenUrl(req.protocol, host, port, originalUrl)
        res.status(200).json(shortenedUrl)
    } catch (error) {
        console.error('Error shortening URL:', error)
        res.status(500).json({ error: 'Failed to shorten URL' });
    }
}


export const get = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const originalUrl = await getOriginalUrl(hash)

        if (!originalUrl) {
            res.status(404)
            return;
        }

        res.status(200).redirect(originalUrl)
    } catch (error) {
        console.error('Error redirecting:', error)
        res.status(500).json({ error: 'Failed to redirect' });
    }
}