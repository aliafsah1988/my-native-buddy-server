import IWordDbModel from '../dbModels/IWordDbModel';
import IRepository from './IRepository';

interface IWordRepository extends IRepository<IWordDbModel> {
    getByUserId: (userId: string, limit: number, skip: number) => Promise<IWordDbModel[]>;
    getById: (wordId: string) => Promise<IWordDbModel>;
    getByIdAndUserId: (userId: string, wordId: string) => Promise<IWordDbModel>;
    getByUserIdAndDate: (userId: string, date: string, limit: number, groupId: string) => Promise<IWordDbModel[]>;
    getByUserIdAndText: (userId: string, text: string) => Promise<IWordDbModel>;
    create: (newWord: IWordDbModel) => Promise<any>;
    update: (userId: string, wordId: string, modifiedFields: IWordDbModel) => Promise<any>;
    deleteByIdAndUserId: (userId: string, wordId: string) => Promise<boolean>;
}

export default IWordRepository;
