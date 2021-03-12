import ILangController from './ILangController';
import HttpStatus from 'http-status-codes';
import IValidator from '../../api/validators/IValidator';
import ValidationError from '../../api/validators/ValidationError';
import ILogger from 'services/ILogger';
import LangType from '../../types/LangType';

class LangController implements ILangController {
    // private readonly _validator: IValidator<any>;
    private readonly _logger: ILogger;

    constructor(validator: IValidator < any > ,
                logger: ILogger) {
        // this._validator = validator;
        this._logger = logger;
    }

    public async getList(req: any, res: any): Promise < void > {
        try {
            this._logger.info('LangController getList');
            res.status(HttpStatus.OK).json(LangType);
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

export default LangController;
