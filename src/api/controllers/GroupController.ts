import IGroupRepository from '../../database/repositories/IGroupRepository';
import GroupDbModel from '../../database/dbModels/GroupDbModel';
// import IGroupController from './IGroupController';
import HttpStatus from 'http-status-codes';
import IValidator from '../../api/validators/IValidator';
import ValidationError from '../../api/validators/ValidationError';
import ILogger from 'services/ILogger';
import IDateHelper from 'helpers/IDateHelper';

// class GroupController implements IGroupController {
class GroupController {
    private readonly _repository: IGroupRepository;
    // private readonly _validator: IValidator<any>;
    private readonly _dateHelper: IDateHelper;
    private readonly _logger: ILogger;

    constructor(repository: IGroupRepository,
                validator: IValidator<any>,
                logger: ILogger,
                dateHelper: IDateHelper) {
        this._repository = repository;
        // this._validator = validator;
        this._logger = logger;
        this._dateHelper = dateHelper;
    }

    public async getMyGroups(req: any, res: any): Promise<void> {
        try {
            this._logger.info('GroupController getMyGroups');
            const user = req.user;
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json();
                return undefined;
            }
            const userId = user._id;
            const skip = parseInt(req.query.skip, 10);
            const limit = parseInt(req.query.limit, 10);

            const samples = await
                this._repository.getByUserId(userId, skip, limit);

            res.status(HttpStatus.OK).json(samples);
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
            this._logger.info('GroupController getByUserId');
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
            this._logger.info('GroupController getById');
            const user = req.user;
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json();
                return undefined;
            }
            const groupId = req.query.id;
            if (user.role === 'super') {
                res.status(HttpStatus.OK).json(await this._repository.getById(groupId));
            } else {
                res.status(HttpStatus.OK).json(await this._repository.getByIdAndUserId(user._id, groupId));
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
            this._logger.info('GroupController create');
            const user = req.user;
            if (!user) { return res.status(HttpStatus.NOT_FOUND); }

            const userId = user._id;
            const {name, description, langId} = req.body;

            const result = await
                this._repository.create(new GroupDbModel(
                    undefined,
                    name,
                    description,
                    userId,
                    langId,
                    this._dateHelper.now(),
                    undefined
                ));

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
            const groupId = req.query.id;
            const {name, description, langId} = req.body;

            const result = await
                this._repository.update(
                    userId,
                    new GroupDbModel(
                    groupId,
                    name,
                    description,
                    userId,
                    langId,
                    this._dateHelper.now(),
                    undefined
                ));

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
}

export default GroupController;
