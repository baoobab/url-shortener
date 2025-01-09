import {Request, Response} from 'express';
import {
    delShortUrl,
    getOriginalUrl,
    getUrlAnalyticsInfo,
    getUrlInfo,
    shortenUrl
} from "../services/shortenUrls.service";
import {ERRORS_MESSAGES} from "../../shared/enums";

export const makeShorten = async (req: Request, res: Response) => {
    const originalUrl = req.body.originalUrl
    const ttl = req.body.ttl

    if (!originalUrl) {
        res.status(400).json({
            success: false,
            error: ERRORS_MESSAGES.BAD_REQUEST,
            message: 'originalUrl is required'})
        return;
    }

    try {
        const host = req.hostname
        const port = Number(process.env.API_PORT)

        const shortenedUrl = await shortenUrl(req.protocol, host, port, originalUrl, ttl)
        res.status(201).json({
            success: true,
            data: shortenedUrl
        })
    } catch (error) {
        console.error('error shortening URL:', error)
        res.status(500).json({
            success: false,
            error: ERRORS_MESSAGES.INTERNAL_SERVER_ERROR,
            message: 'failed to shorten URL'
        })
    }
}


export const get = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const originalUrl = await getOriginalUrl(hash)

        if (!originalUrl) {
            res.status(404).json({
                success: false,
                error: ERRORS_MESSAGES.NOT_FOUND,
                message: 'short url not found'
            })
            return;
        }

        res.status(302).redirect(originalUrl)
    } catch (error) {
        console.error('Error redirecting:', error)
        res.status(500).json({
            success: false,
            error: ERRORS_MESSAGES.INTERNAL_SERVER_ERROR,
            message: 'failed to redirect'
        })
    }
}

export const getInfo = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const info = await getUrlInfo(hash)

        if (!info) {
            res.status(404).json({
                success: false,
                error: ERRORS_MESSAGES.NOT_FOUND,
                message: 'short url not found'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: info
        })
    } catch (error) {
        console.error('error getting info:', error)
        res.status(500).json({
            success: false,
            error: ERRORS_MESSAGES.INTERNAL_SERVER_ERROR,
            message: 'failed to getting info'
        })
    }
}

export const getAnalyticsInfo = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const info = await getUrlAnalyticsInfo(hash)

        if (!info) {
            res.status(404).json({
                success: false,
                error: ERRORS_MESSAGES.NOT_FOUND,
                message: 'short url not found'
            })
            return;
        }

        res.status(200).json({
            success: true,
            data: info
        })
    } catch (error) {
        console.error('error getting analytics info:', error)
        res.status(500).json({
            success: false,
            error: ERRORS_MESSAGES.INTERNAL_SERVER_ERROR,
            message: 'failed to getting analytics info'
        })
    }
}

export const del = async (req: Request, res: Response) => {
    try {
        const hash = req.params.hash
        const isDeleted = await delShortUrl(hash)

        if (!isDeleted) {
            res.status(404).json({
                success: false,
                error: ERRORS_MESSAGES.NOT_FOUND,
                message: 'short url not found'
            })
            return;
        }

        res.status(204).json({
            success: true
        })
    } catch (error) {
        console.error('error getting info:', error)
        res.status(500).json({
            success: false,
            error: ERRORS_MESSAGES.INTERNAL_SERVER_ERROR,
            message: 'failed to deleting shortUrl'
        })
    }
}