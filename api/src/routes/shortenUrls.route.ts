import {Router} from 'express';
import {del, get, getAnalyticsInfo, getInfo, makeShorten} from "../controllers/shortenUrls.controller"
import {clickCounterMiddleware} from "../middlewares/clickCounter.middleware";
import {linkExpirationMiddleware} from "../middlewares/linkExpiration.middleware";
import {analyticsMiddleware} from "../middlewares/analytics.middleware";

const router = Router();

router.post('/shorten', makeShorten);
router.get('/:hash', linkExpirationMiddleware, clickCounterMiddleware, analyticsMiddleware, get)
router.get('/info/:hash', getInfo)
router.delete('/delete/:hash', del)
router.get('/analytics/:hash', getAnalyticsInfo)

export default router;