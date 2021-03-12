import IWordRepository from '../../database/repositories/IWordRepository';
import IWordDbModel from '../../database/dbModels/IWordDbModel';
import IWordController from '../controllers/IWordController';
import HttpStatus from 'http-status-codes';
import IValidator from '../../api/validators/IValidator';
import ValidationError from '../../api/validators/ValidationError';
import ILogger from 'services/ILogger';
import IDateHelper from 'helpers/IDateHelper';

class WordController implements IWordController {
    private readonly _repository: IWordRepository;
    // private readonly _validator: IValidator<any>;
    private readonly _dateHelper: IDateHelper;
    private readonly _logger: ILogger;

    constructor(repository: IWordRepository,
                validator: IValidator<any>,
                logger: ILogger,
                dateHelper: IDateHelper) {
        this._repository = repository;
        // this._validator = validator;
        this._logger = logger;
        this._dateHelper = dateHelper;
    }

    public async getMyWords(req: any, res: any): Promise<void> {
        try {
            this._logger.info('WordController getMyWords');
            const user = req.user;
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json();
                return undefined;
            }
            const userId = user._id;
            const skip = parseInt(req.query.skip, 10);
            const limit = parseInt(req.query.limit, 10);

            const words = await
                this._repository.getByUserId(userId, skip, limit);

            res.status(HttpStatus.OK).json(words);
        } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async getByUserId(req: any, res: any): Promise<void> {
        try {
            this._logger.info('WordController getByUserId');
            const user = req.user;
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json();
                return undefined;
            }
            const { userId } = req.query;
            const skip = parseInt(req.query.skip, 10);
            const limit = parseInt(req.query.limit, 10);

            const groups = await
                this._repository.getByUserId(userId, limit, skip);
            res.status(HttpStatus.OK).json(groups);
        } catch (error) {
            console.error(error);
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async getById(req: any, res: any): Promise<void> {
        try {
            this._logger.info('WordController getById');
            const user = req.user;
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json();
                return undefined;
            }
            const wordId = req.query.id;
            if (user.role === 'super') {
                res.status(HttpStatus.OK).json(await this._repository.getById(wordId));
            } else {
                res.status(HttpStatus.OK).json(await this._repository.getByIdAndUserId(user._id, wordId));
            }
        } catch (error) {
            console.error(error);
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async create(req: any, res: any): Promise<void> {
        try {
            this._logger.info('WordController create');
            const user = req.user;
            if (!user) { return res.status(HttpStatus.NOT_FOUND); }

            const userId = user._id;
            const text = req.body.text.trim();
            const description = req.body.description;
            const synonyms = req.body.synonyms;
            const translation = req.body.translation;
            const groupId = req.body.groupId;
            const langId = req.body.langId;
            const today = this._dateHelper.today();

            if (await this._repository.getByUserIdAndText(userId, text)) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('word already exists');
                return;
            }

            const result = await
                this._repository.create({
                    text,
                    description,
                    synonyms,
                    translation,
                    nextpractice: today,
                    correctcount: 0,
                    userId,
                    groupId,
                    langId,
                    createDate: await this._dateHelper.now(),
                } as IWordDbModel);

            res.status(HttpStatus.OK).json(result.insertedId);
        } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async update(req: any, res: any): Promise<void> {
        try {
            this._logger.info('GroupController update');
            const user = req.user;
            if (!user) { return res.status(HttpStatus.NOT_FOUND); }

            const userId = user._id;
            const wordId = req.query.id;
            const text = req.body.text.trim();
            const description = req.body.description;
            const synonyms = req.body.synonyms;
            const translation = req.body.translation;
            const groupId = req.body.groupId;
            const langId = req.body.langId;

            const existedWord = await this._repository.getByUserIdAndText(userId, text);
            if (existedWord && existedWord._id && existedWord._id.toString() !== wordId) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('word already exists');
                return;
            }

            const modifiedFileds = {
                text,
                description,
                synonyms,
                translation,
                groupId,
                langId,
                persistDate: this._dateHelper.now(),
            } as IWordDbModel;

            const result = await
                this._repository.update(
                    userId,
                    wordId,
                    modifiedFileds
                );

            res.status(HttpStatus.OK).json(result.insertedId);
        } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async delete(req: any, res: any): Promise<void> {
        try {
            const user = req.user;
            const wordId = req.query.id;
            // TODO validate
            if (!wordId || wordId.length === 0) {
              res.status(HttpStatus.BAD_REQUEST).json('no word id provided');
              return;
            }

            res.status(HttpStatus.OK).json(await this._repository.deleteByIdAndUserId(user._id, wordId));
          } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
          }
    }
}

export default WordController;
