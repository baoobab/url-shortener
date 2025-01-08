import {Router} from 'express';
import {del, get, getInfo, makeShorten} from "../controllers/shortenUrls.controller"
import {clickCounterMiddleware} from "../middlewares/clickCounter.middleware";

const router = Router();

router.post('/shorten', makeShorten);
router.get('/:hash', clickCounterMiddleware, get)
router.get('/info/:hash', getInfo)
router.delete('/delete/:hash', del)

export default router;