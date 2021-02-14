import IUserRepository from '../../database/repositories/IUserRepository';
import IAuthController from './IAuthController';
import HttpStatus from 'http-status-codes';
import IValidator from '../../api/validators/IValidator';
import ValidationError from '../../api/validators/ValidationError';
import ILogger from 'services/ILogger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

class AuthController implements IAuthController {
    private readonly _repository: IUserRepository;
    // private readonly _validator: IValidator<any>;
    private readonly _logger: ILogger;

    constructor(repository: IUserRepository,
                validator: IValidator < any > ,
                logger: ILogger) {
        this._repository = repository;
        // this._validator = validator;
        this._logger = logger;
    }

    public async login(req: any, res: any): Promise < void > {
        try {
            this._logger.info('AuthController login');
            const email = req.body.email;
            const inputPassword = req.body.password;
            // TODO validate email
            const user = await
                this._repository.getByEmail(email);
            if (!user) { res.status(HttpStatus.UNAUTHORIZED); } else {
                // TODO return a token
                const passwordIsValid = bcrypt.compareSync(inputPassword, user.password);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        auth: false,
                        token: undefined,
                    });
                }
                const token = jwt.sign(
                    {
                      id: user._id,
                    },
                    config.SECRET
                    // {
                    //   // expiresIn: 86400 // expires in 24 hours
                    // }
                  );
                  delete user.password;
                  delete user._id;

                res.status(HttpStatus.OK).json({
                    'x-access-token': token,
                    role: user.role,
                });
             }
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

export default AuthController;
