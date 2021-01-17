import IGroupDbModel from '../dbModels/IGroupDbModel';
import IRepository from './IRepository';

interface IGroupRepository extends IRepository<IGroupDbModel> {
    getAll: (limit: number, skip: number) => Promise<IGroupDbModel[]>;
    getByUserId: (userId: string, limit: number, skip: number) => Promise<IGroupDbModel[]>;
    getById: (groupId: string) => Promise<IGroupDbModel>;
    getByIdAndUserId: (userId: string, groupId: string) => Promise<IGroupDbModel>;
    create: (newGroup: IGroupDbModel) => Promise<any>;
    update: (userId: string, groupId: string, modifiedFields: IGroupDbModel) => Promise<any>;
    deleteByIdAndUserId: (userId: string, groupId: string) => Promise<boolean>;
}

export default IGroupRepository;
