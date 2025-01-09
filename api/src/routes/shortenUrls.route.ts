import {Router} from 'express';
import {del, get, getInfo, makeShorten} from "../controllers/shortenUrls.controller"
import {clickCounterMiddleware} from "../middlewares/clickCounter.middleware";
import {linkExpirationMiddleware} from "../middlewares/linkExpiration.middleware";

const router = Router();

router.post('/shorten', makeShorten);
router.get('/:hash', linkExpirationMiddleware, clickCounterMiddleware, get)
router.get('/info/:hash', getInfo)
router.delete('/delete/:hash', del)

export default router;