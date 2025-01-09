import {SavedDbUrlDto} from "../../dto/saved-db-url.dto";
import {MetaDbUrlDto} from "../../dto/meta-db-url.dto";
import {UpdateMetaDbUrlDto} from "../../dto/update-meta-db-url.dto";
import {SavedDbMetricDto} from "../../dto/saved-db-metric.dto";
import {MetaDbMetricDto} from "../../dto/meta-db-metric.dto";


// бд, которая хранит данные в кэше
export class Database {
    /* urlsTable: "таблица" для хранения всех данных по ссылкам
     * Ключ - хэш-строка для сокращённой ссылки, уникальный
     * Значение - объект типа SavedDbUrlDto
     */
    private static urlsTable: Record<string, SavedDbUrlDto> = {}

    /* metricsTable: "таблица" для хранения всех данных по метрикам
     * Ключ - хэш-строка для сокращённой ссылки, уникальный
     * Значение - массив объектов типа SavedDbMetricDto;
     * массив, тк отношение One-to-Many если можно так выразиться,
     * на один ключ (уникальную ссылку) несколько метрик
     */
    private static metricsTable: Record<string, SavedDbMetricDto[]> = {}

    private static cache =
        {urlsTable: Database.urlsTable, metricsTable: Database.metricsTable}


    // метод для очищения всех данных из памяти
    static flushall() {
        Database.cache.urlsTable = {}
        Database.cache.metricsTable = {}
    }

    // метод добавления данных в базу
    static async set(key: string, value: string, options?: { ttl: number }) {
        const dateNow = Date.now()
        if (options?.ttl && options?.ttl < 0) {
            options.ttl = NaN
        }

        const meta: MetaDbUrlDto = {
            clickCount: 0,
            expiresAt: options?.ttl ? (Date.now() + options?.ttl * 1000) : null,
            createdAt: dateNow,
        }

        Database.cache.urlsTable[key] = {
            value,
            meta: meta
        };
    }

    async set(key: string, value: string, options?: { ttl: number }) {
        await Database.set(key, value, options);
        Database.setMetrics(key); // создание метрики постфактум
    }

    // метод получения данных из базы
    static async get(key: string): Promise<string | null> {
        const data = Database.cache.urlsTable[key] || {}

        return typeof data.value !== 'undefined' ? data.value : null;
    }

    async get(key: string) {
        return Database.get(key);
    }

    // метод получения данных, включая метаданные из базы
    static async getWithMeta(key: string): Promise<SavedDbUrlDto | null> {
        const data = Database.cache.urlsTable[key] || {}

        return typeof data.value !== 'undefined' ? data : null;
    }

    async getWithMeta(key: string) {
        return Database.getWithMeta(key);
    }

    // метод создания метрики в базе
    static async setMetrics(key: string) {
        const data = await Database.getMetrics(key)

        if (data === null) {
            Database.cache.metricsTable[key] = []
        }
    }

    async setMetrics(key: string) {
        return Database.setMetrics(key);
    }

    // метод добавления метрики к ключу
    static async addMetrics(key: string, value: string) {
        const data = await Database.getMetrics(key)
        const meta: MetaDbMetricDto = {
            createdAt: Date.now()
        }

        if (data != null) {
            Database.cache.metricsTable[key].push({
                value: value,
                meta: meta
            })
        } else {
            Database.cache.metricsTable[key] = [{
                value: value,
                meta: meta
            }]
        }
    }

    async addMetrics(key: string, value: string) {
        return Database.addMetrics(key, value);
    }

    // метод получения метрик из базы
    static async getMetrics(key: string): Promise<SavedDbMetricDto[] | null> {
        const data = Database.cache.metricsTable[key] || []
        return data.length !== 0 ? data : null;
    }

    async getMetrics(key: string) {
        return Database.getMetrics(key);
    }

    // метод обновления метаданных
    static async updateMeta(key: string, options: UpdateMetaDbUrlDto) {
        const oldData = Database.cache.urlsTable[key]
        if (options?.ttl && options?.ttl < 0) {
            return;
        }

        if (oldData) {
            Database.cache.urlsTable[key] = {
                value: oldData.value,
                meta: {
                    clickCount: options.clickCount ? options.clickCount : oldData.meta.clickCount,
                    expiresAt: options.ttl ? (Date.now() + options.ttl * 1000) : oldData.meta.expiresAt,
                    createdAt: oldData.meta.createdAt,
                }
            }
        }
    }

    async updateMeta(key: string, options: UpdateMetaDbUrlDto) {
        await Database.updateMeta(key, options);
    }

    // удаление данных по ключу
    static async del(key: string): Promise<void> {
        delete Database.cache.urlsTable[key];
    }

    async del(key: string): Promise<void> {
        await Database.del(key);
    }
}