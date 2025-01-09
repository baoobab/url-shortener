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

/**
 * @swagger
 * /shorten:
 *   post:
 *     tags: [Shorten URLs]
 *     summary: Сокращение URL
 *     description: Создает сокращенный URL по предоставленному оригинальному URL, ttl - в секундах, не обязательный
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: "https://example.com" ## салам
 *               ttl:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Успешно создан сокращенный URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: "https://some.host/sdD4ok"
 *       400:
 *         description: Не передан обязательный параметр originalUrl
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "BAD_REQUEST"
 *                 message:
 *                   type: string
 *                   example: "originalUrl is required"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "some err"
 */

/**
 * @swagger
 * /{hash}:
 *   get:
 *     tags: [Shorten URLs]
 *     summary: Получение оригинального URL по хэшу
 *     description: Перенаправляет на оригинальный URL по сокращенному хэшу.
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         example: "sf3fDS"
 *         description: Хэш сокращенного URL.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Перенаправление на оригинальный URL
 *       404:
 *         description: Сокращённая ссылка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "short url not found"
 *       410:
 *         description: Срок действия сокращённой ссылки истёк
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "GONE"
 *                 message:
 *                   type: string
 *                   example: "link has expired"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "some err"
 */

/**
 * @swagger
 * /info/{hash}:
 *   get:
 *     tags: [Shorten URLs]
 *     summary: Получение информации о сокращенном URL
 *     description: Возвращает информацию о сокращенном URL, включая оригинальный URL и статистику.
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         example: "sf3fDS"
 *         description: Хэш сокращенного URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Информация о сокращенном URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: UserFriendlyUrlDto
 *                   example: { "originalUrl": "https://twitch.tv", "clickCount": 0, "expiresAt": "2025-01-09T15:14:09.772Z", "createdAt": "2025-01-09T15:13:09.772Z"}
 *       404:
 *         description: Сокращённая ссылка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "short url not found"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "some err"
 */

/**
 * @swagger
 * /analytics/{hash}:
 *   get:
 *     tags: [Shorten URLs]
 *     summary: Получение аналитики по сокращенному URL
 *     description: Возвращает статистику использования для сокращенного URL по хэшу.
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         example: "sf3fDS"
 *         description: Хэш сокращенного URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Статистика использования сокращенного URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: UserFriendlyMetricDto
 *                   example: { "originalUrl": "https://twitch.tv", "clickCount": 2, "metrics": [{"ip": "87.192.13.164", "clickedAt": "2025-01-09T15:15:36.394Z"}] }
 *       404:
 *         description: Сокращённая ссылка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "short url not found"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "some err"
 */

/**
 * @swagger
 * /delete/{hash}:
 *   delete:
 *     tags: [Shorten URLs]
 *     summary: Удаление сокращенного URL
 *     description: Удаляет сокращенный URL по хэшу.
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         example: "sf3fDS"
 *         description: Хэш сокращенного URL.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Успешно удалено
 *       404:
 *         description: Сокращённая ссылка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "NOT_FOUND"
 *                 message:
 *                   type: string
 *                   example: "short url not found"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 *                 message:
 *                   type: string
 *                   example: "some err"
 */