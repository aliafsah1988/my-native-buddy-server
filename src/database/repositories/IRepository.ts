interface IRepository<T> {
    getAll: (skip: number, limit: number) => Promise<T[]>;
    getById: (id: string) => Promise<T>;
    create: (newEntry: T) => Promise<any>;
    // update: (id: object, modifiedEntry: T) => Promise<any>;
    // deleteById: (id: object) => Promise<boolean>;
}

export default IRepository;
