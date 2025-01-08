import {SavedDbUrlDto} from "../dto/saved-db-url.dto";
import {MetaDbUrlDto} from "../dto/meta-db-url.dto";
import {UpdateMetaDbUrlDto} from "../dto/update-meta-db-url.dto";


// БД, которая хранит данные в кэше
export class Database {
    private static cache: Record<string, SavedDbUrlDto> = {}; // здесь будем хранить все данные
    static ready = true; // для того чтобы задавать состояние базы

    // подключение и отключение базы
    private beforeDisconnectCallbacks: ((...args: any[]) => any)[] = [];

    addBeforeDisconnectCallback = (callback: (...args: any[]) => any) => {
        this.beforeDisconnectCallbacks.push(callback);
    };

    async onModuleDestroy(): Promise<void> {
        await Promise.allSettled(
            this.beforeDisconnectCallbacks.map((cb) => cb())
        );

        this.ready = false;
    }

    onModuleInit(): any {
        this.ready = true;
    }

    // метод для очищения всех данных из памяти
    static flushall() {
        Database.cache = {};
    }

    // получаем и задаем состояние базы
    get ready() {
        return Database.ready;
    }

    set ready(value: boolean) {
        Database.ready = value;
    }

    // метод добавления данных в базу
    static async set(key: string, value: any, options?: { ttl: number }) {
        const meta: MetaDbUrlDto = {
            clickCount: 0,
            ttl: options?.ttl ? options.ttl : -1,
            createdAt: Date.now(),
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

    // метод обновления метаданных
    static async updateMeta(key: string, options: UpdateMetaDbUrlDto) {
        const oldData = Database.cache[key]
        if (oldData) {
            Database.cache[key] = {
                value: oldData.value,
                meta: {
                    clickCount: options.clickCount ? options.clickCount : oldData.meta.clickCount,
                    ttl: options.ttl ? options.ttl : oldData.meta.ttl,
                    createdAt: oldData.meta.createdAt,
                }
            }
        }
    }

    async updateMeta(key: string, options: UpdateMetaDbUrlDto) {
        await Database.set(key, options);
    }

    // метод получения данных, включая метаданные из базы
    static async getWithMeta(key: string): Promise<SavedDbUrlDto | null> {
        const data = Database.cache[key] || {}

        return typeof data.value !== 'undefined' ? data : null;
    }

    async getWithMeta(key: string) {
        return Database.getWithMeta(key);
    }

    // срок хранения ключа в базе
    ttl(key: string) {
        return Database.cache[key].meta.ttl;
    }

    static ttl(key: string) {
        return Database.cache[key].meta.ttl || null;
    }

    // удаление данных по ключу
    static async del(key: string): Promise<void> {
        delete Database.cache[key];
    }

    async del(key: string): Promise<void> {
        await Database.del(key);
    }
}