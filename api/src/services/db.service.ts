// БД, которая хранит данные в кэше
export class Database {
    private static cache: any = {}; // здесь будем хранить все данные
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
        Database.cache[key] = {
            value,
            ttl: options?.ttl ? options.ttl : -1,
            createdAt: Date.now(),
        };
    }

    async set(key: string, value: any, options?: { ttl: number }) {
        await Database.set(key, value, options);
    }

    // метод получения данных из базы
    static async get(key: string): Promise<string | null> {
        const data = Database.cache[key] || {};

        return typeof data.value !== 'undefined' ? data.value : null;
    }

    async get(key: string) {
        return Database.get(key);
    }

    // срок хранения ключа в базе
    ttl(key: string) {
        return Database.cache[key].ttl;
    }

    static ttl(key: string) {
        return Database.cache[key].ttl || null;
    }

    // удаление данных по ключу
    static async del(key: string): Promise<void> {
        delete Database.cache[key];
    }

    async del(key: string): Promise<void> {
        await Database.del(key);
    }
}