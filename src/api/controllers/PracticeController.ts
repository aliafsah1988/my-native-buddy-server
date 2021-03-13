import IPracticeController from './IPracticeController';
import HttpStatus from 'http-status-codes';
import IValidator from '../../api/validators/IValidator';
import ValidationError from '../../api/validators/ValidationError';
import ILogger from 'services/ILogger';
import IWordRepository from '../../database/repositories/IWordRepository';
import IDateHelper from 'helpers/IDateHelper';
import IWordDbModel from 'database/dbModels/IWordDbModel';
import config from '../../config';

class PracticeController implements IPracticeController {
    private readonly _repository: IWordRepository;
    // private readonly _validator: IValidator<any>;
    private readonly _logger: ILogger;
    private readonly _dateHelper: IDateHelper;

    constructor(repository: IWordRepository,
                validator: IValidator<any>,
                logger: ILogger,
                dateHelper: IDateHelper) {
        // this._validator = validator;
        this._logger = logger;
        this._repository = repository;
        this._dateHelper = dateHelper;
    }

    public async getTodayPractice(req: any, res: any): Promise < void > {
        try {
            this._logger.info('PracticeController getTodayPractice');
            const user = req.user;
            if (!user) { return res.status(HttpStatus.NOT_FOUND); }

            const userId = user._id;
            const limit = parseInt(req.query.limit, 10);
            const groupId = req.query.groupId;
            const today = this._dateHelper.today();

            const words = await
                this._repository.getByUserIdAndDate(
                    userId,
                    today,
                    limit,
                    groupId);

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

    public async check(req: any, res: any): Promise <void> {
        try {
            this._logger.info('PracticeController check');
            const user = req.user;
            if (!user) { return res.status(HttpStatus.NOT_FOUND); }
            const userId = user._id;
            const text = req.body.text;
            const wordId = req.body.wordId;

            const word: IWordDbModel = await
                this._repository.getByIdAndUserId(
                    userId,
                    wordId);

            if (!word) {
                this._logger.error('no word founded');
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('no word founded');
                return;
            }

            let message = 'wrong';
            let date = 0;

            if (word.text === text) {
                message = 'correct';
                word.correctcount += 1;
                // const previousNextPractice = word.nextpractice
                // const daysToAdd = config.PRACTICE_INTERVALS[word.correctcount]
                // date = dateHelper
                //   .addDays(previousNextPractice, daysToAdd)
                date = this._dateHelper
                  .addDays(this._dateHelper.today(),
                  config.PRACTICE_INTERVALS[word.correctcount]);
              } else {
                word.correctcount = 0;
                date = this._dateHelper
                  .addDays(this._dateHelper.today(), 1);
              }

              this._repository.update(user._id, word._id.toString(), {
                nextpractice: date,
                correctcount: word.correctcount,
              } as IWordDbModel);

            res.status(HttpStatus.OK).json(message);

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

export default PracticeController;
