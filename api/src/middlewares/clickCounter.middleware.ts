import {Request, Response, NextFunction} from "express";
import {Database} from "../services/db.service";

export const clickCounterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const hash = req.params.hash;
    const urlData = await Database.getWithMeta(hash)

    if (!urlData) {
        console.error("clickCounterMiddleware error: url data not found")

        next();
        return;
    }

    Database.updateMeta(hash, {clickCount: urlData.meta.clickCount + 1})

    next();
}