import requestIp from "request-ip";
import {NextFunction, Request, Response} from "express";
import {Database} from "../services/db.service";

export const analyticsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const hash = req.params.hash
    const ip = requestIp.getClientIp(req)
    const urlData = await Database.get(hash)

    if (!urlData) {
        res.status(404).json({error: 'Url not found'})
        return;
    }

    if (ip) {
        Database.addMetrics(hash, ip)
    } else {
        Database.addMetrics(hash, "not-recognized")
    }
    next();
}
