import IUserDbModel from '../dbModels/IUserDbModel';
// import IRepository from './IRepository';

// interface IUserRepository extends IRepository<IUserDbModel> {
interface IUserRepository {
    getById: (id: string) => Promise<IUserDbModel>;
    getByEmail: (id: string) => Promise<IUserDbModel>;
    create: (newUser: IUserDbModel) => Promise<IUserDbModel>;
}

export default IUserRepository;
