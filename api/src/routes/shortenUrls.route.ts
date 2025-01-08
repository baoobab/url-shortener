import {Router} from 'express';
import {get, shorten} from "../controllers/shortenUrls.controller"
const router = Router();

router.post('/shorten', shorten);
router.get('/:hash', get)

export default router;