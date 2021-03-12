import mongodb from 'mongodb';

import IWordRepository from './IWordRepository';
import IWordDbModel from '../dbModels/IWordDbModel';
import IDatabaseManager from '../manager/IDatabaseManager';
import ILogger from 'services/ILogger';

const COLLECTION_NAME = 'words';

class WordRepository implements IWordRepository {
    private _databaseManager: IDatabaseManager;
    private readonly _logger: ILogger;

    constructor(databaseManager: IDatabaseManager, logger: ILogger) {
        this._databaseManager = databaseManager;
        this._logger = logger;
    }

    public async getAll(skip: number, limit: number): Promise<IWordDbModel[]> {
        this._logger.info('WordRepository getAll');
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).find().skip(skip).limit(limit).toArray();
    }

    public async getById(wordId: string): Promise<IWordDbModel> {
        this._logger.info('WordRepository getById');
        const _id = new mongodb.ObjectID(wordId);
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).findOne({ _id });
    }

    public async getByUserId(userId: string, limit: number, skip: number): Promise<IWordDbModel[]> {
        this._logger.info('WordRepository getByUserId');
        const userObjectId = new mongodb.ObjectID(userId);
        const query = { userId: userObjectId };

        return await this._databaseManager.database
            .collection(COLLECTION_NAME)
            .find(query)
            .limit(limit)
            .skip(skip)
            .toArray();
    }

    public async getByIdAndUserId(userId: string, wordId: string): Promise<IWordDbModel> {
        this._logger.info('WordRepository getByIdAndUserId');
        const query = {
            _id: new mongodb.ObjectID(wordId),
            userId: new mongodb.ObjectID(userId),
        };

        return await this._databaseManager.database
            .collection(COLLECTION_NAME)
            .findOne(query);
    }

    public async getByUserIdAndDate(userId: string, date: string, limit: number, groupId: string): Promise<IWordDbModel[]> {
        this._logger.info('WordRepository getByUserIdAndDate');
        const query = {
            userId: new mongodb.ObjectID(userId),
            nextpractice: { $lte: date },
            groupId: new mongodb.ObjectID(groupId),
          };

        return await this._databaseManager.database
            .collection(COLLECTION_NAME)
            .find(query, {})
            .limit(limit)
            .skip(0)
            .toArray();
    }

    public async getByUserIdAndText(userId: string, text: string): Promise<IWordDbModel> {
        this._logger.info('WordRepository getByUserIdAndText');
        const userIdObj = new mongodb.ObjectID(userId);
        const query = {
            userId: userIdObj,
            text: text.trim(),
          };

          return await this._databaseManager.database
          .collection(COLLECTION_NAME).findOne(query);
    }

    public async create(newWord: IWordDbModel): Promise<string> {
        this._logger.info('WordRepository create');
        if (newWord.groupId) {
            const groupObjectId = new mongodb.ObjectID(newWord.groupId);
            newWord.groupId = groupObjectId;
          }
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).insertOne(newWord);
    }

    public async update(userId: string, wordId: string, modifiedFields: IWordDbModel): Promise<any> {
        this._logger.info('WordRepository update');
        const query = {
            userId: new mongodb.ObjectID(userId),
            _id: new mongodb.ObjectID(wordId),
        };
        const wordToSave = { ...modifiedFields };

        if (modifiedFields.groupId) {
        const groupObjectId = new mongodb.ObjectID(modifiedFields.groupId);
        wordToSave.groupId = groupObjectId;
        }

        const newvalues = {
            $set: wordToSave,
        };
        return await this._databaseManager.database
            .collection(COLLECTION_NAME).updateOne(query, newvalues);
    }

    public async deleteByIdAndUserId(userId: string, wordId: string): Promise<boolean> {
        this._logger.info('WordRepository deleteByIdAndUserId');
        const query = {
            userId: new mongodb.ObjectID(userId),
            _id: new mongodb.ObjectID(wordId),
        };
        const result = await this._databaseManager.database
            .collection(COLLECTION_NAME).deleteOne(query);
        return result.result.n >= 1;
    }
}

export default WordRepository;
