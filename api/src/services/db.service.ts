import {SavedDbUrlDto} from "../dto/saved-db-url.dto";
import {MetaDbUrlDto} from "../dto/meta-db-url.dto";
import {UpdateMetaDbUrlDto} from "../dto/update-meta-db-url.dto";


// БД, которая хранит данные в кэше
export class Database {
    private static cache: Record<string, SavedDbUrlDto> = {}; // здесь будем хранить все данные

    // метод для очищения всех данных из памяти
    static flushall() {
        Database.cache = {};
    }

    // метод добавления данных в базу
    static async set(key: string, value: any, options?: { ttl: number }) {
        const dateNow = Date.now()

        const meta: MetaDbUrlDto = {
            clickCount: 0,
            expiresAt: options?.ttl ? (Date.now() + options?.ttl * 1000) : null,
            createdAt: dateNow,
        }

        Database.cache[key] = {
            value,
            meta: meta
        };
    }

    async set(key: string, value: any, options?: { ttl: number }) {
        await Database.set(key, value, options);
    }

    // метод получения данных из базы
    static async get(key: string): Promise<string | null> {
        const data = Database.cache[key] || {}

        return typeof data.value !== 'undefined' ? data.value : null;
    }

    async get(key: string) {
        return Database.get(key);
    }

    // метод получения данных, включая метаданные из базы
    static async getWithMeta(key: string): Promise<SavedDbUrlDto | null> {
        const data = Database.cache[key] || {}

        return typeof data.value !== 'undefined' ? data : null;
    }

    async getWithMeta(key: string) {
        return Database.getWithMeta(key);
    }

    // метод обновления метаданных
    static async updateMeta(key: string, options: UpdateMetaDbUrlDto) {
        const oldData = Database.cache[key]
        if (oldData) {
            Database.cache[key] = {
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
        await Database.set(key, options);
    }

    // удаление данных по ключу
    static async del(key: string): Promise<void> {
        delete Database.cache[key];
    }

    async del(key: string): Promise<void> {
        await Database.del(key);
    }
}