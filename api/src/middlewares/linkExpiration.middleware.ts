import {NextFunction, Request, Response} from "express";
import {Database} from "../services/db.service";
import {ERRORS_MESSAGES} from "../../shared/enums";


export const linkExpirationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const hash = req.params.hash;

    try {
        const urlData = await Database.getWithMeta(hash)

        if (!urlData) {
            res.status(404).json({
                success: false,
                error: ERRORS_MESSAGES.NOT_FOUND,
                message: 'short url not found'
            })
            return;
        }

        if (urlData.meta.expiresAt && urlData.meta.expiresAt < Date.now()) {
            res.status(410).json({
                success: false,
                error: ERRORS_MESSAGES.GONE,
                message: 'link has expired'
            })
            return;
        }

        next();
    } catch (error) {
        console.error('linkExpirationMiddleware error:', error);
        res.status(500).json({
            success: false,
            error: ERRORS_MESSAGES.INTERNAL_SERVER_ERROR,
            message: 'failed to check expiration'
        })
    }
}