import IUserDbModel from '../dbModels/IUserDbModel';
// import IRepository from './IRepository';

// interface IGroupRepository extends IRepository<IUserDbModel> {
interface IGroupRepository {
    getById: (id: string) => Promise<IUserDbModel>;
}

export default IGroupRepository;
