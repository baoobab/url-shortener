import {Request, Response, NextFunction} from "express";
import {Database} from "../services/db.service";
import {ERRORS_MESSAGES} from "../../shared/enums";

export const clickCounterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const hash = req.params.hash;
    const urlData = await Database.getWithMeta(hash)

    if (!urlData) {
        res.status(404).json({
            success: false,
            error: ERRORS_MESSAGES.NOT_FOUND,
            message: 'short url not found'
        })
        return;
    }

    Database.updateMeta(hash, {clickCount: urlData.meta.clickCount + 1})
    next();
}