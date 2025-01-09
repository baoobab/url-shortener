import {NextFunction, Request, Response} from "express";
import {Database} from "../services/db.service";


export const linkExpirationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const hash = req.params.hash;

    try {
        const urlData = await Database.getWithMeta(hash)

        if (!urlData) {
            res.status(404).send('Link not found')
            return;
        }

        if (urlData.meta.expiresAt && urlData.meta.expiresAt < Date.now()) {
            res.status(410).send('Link has expired')
            return;
        }

        next();
    } catch (error) {
        console.error('linkExpirationMiddleware error:', error);
        res.status(500).send('Internal server error');
    }
}