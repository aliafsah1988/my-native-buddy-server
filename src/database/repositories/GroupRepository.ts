import mongodb from 'mongodb';

import IGroupRepository from './IGroupRepository';
import IGroupDbModel from '../dbModels/IGroupDbModel';
import IDatabaseManager from '../manager/IDatabaseManager';
import ILogger from 'services/ILogger';

const COLLECTION_NAME = 'groups';

class GroupRepository implements IGroupRepository {
    private _databaseManager: IDatabaseManager;
    private readonly _logger: ILogger;

    constructor(databaseManager: IDatabaseManager, logger: ILogger) {
        this._databaseManager = databaseManager;
        this._logger = logger;
    }

    public async getById(groupId: string): Promise<IGroupDbModel> {
        this._logger.info('GroupRepository getById');
        const _id = new mongodb.ObjectID(groupId);
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).findOne({ _id });
    }

    public async getByUserId(userId: string, limit: number, skip: number): Promise<IGroupDbModel[]> {
        this._logger.info('GroupRepository getByUserId');
        const userObjectId = new mongodb.ObjectID(userId);
        const query = { userId: userObjectId };
        return await this._databaseManager.database
            .collection(COLLECTION_NAME)
            .find(query)
            .limit(limit)
            .skip(skip);
    }

    public async getByIdAndUserId(userId: string, groupId: string): Promise<IGroupDbModel> {
        this._logger.info('GroupRepository getByIdAndUserId');
        const query = {
            _id: new mongodb.ObjectID(groupId),
            userId: new mongodb.ObjectID(userId),
        };

        return await this._databaseManager.database
            .collection(COLLECTION_NAME)
            .findOne(query);
    }

    public async getAll(skip: number, limit: number): Promise<IGroupDbModel[]> {
        this._logger.info('GroupRepository getAll');
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).find().skip(skip).limit(limit).toArray();
    }

    public async create(newEntry: IGroupDbModel): Promise<any> {
        this._logger.info('GroupRepository create');
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).insertOne(newEntry);
    }

    public async update(userId: string, groupId: string, modifiedFields: IGroupDbModel): Promise<any> {
        this._logger.info('GroupRepository update');
        const query = {
            userId: new mongodb.ObjectID(userId),
            _id: new mongodb.ObjectID(groupId),
        };
        const newvalues = {
            $set: modifiedFields,
        };
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).updateOne(query, newvalues);
    }

    public async deleteByIdAndUserId(userId: string, groupId: string): Promise<boolean> {
        this._logger.info('GroupRepository delete');
        const query = {
            userId: new mongodb.ObjectID(userId),
            _id: new mongodb.ObjectID(groupId),
        };
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).deleteOne(query);
    }
}

export default GroupRepository;
