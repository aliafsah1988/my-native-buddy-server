import mongodb from 'mongodb';

import IUserRepository from './IUserRepository';
import IUserDbModel from '../dbModels/IUserDbModel';
import IDatabaseManager from '../manager/IDatabaseManager';
import ILogger from 'services/ILogger';

const COLLECTION_NAME = 'users';

class UserRepository implements IUserRepository {
    private _databaseManager: IDatabaseManager;
    private readonly _logger: ILogger;

    constructor(databaseManager: IDatabaseManager, logger: ILogger) {
        this._databaseManager = databaseManager;
        this._logger = logger;
    }

    public async getById(id: string): Promise<IUserDbModel> {
        this._logger.info('UserRepository getById');
        const _id = new mongodb.ObjectID(id);
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).findOne({ _id });
    }
}

export default UserRepository;
