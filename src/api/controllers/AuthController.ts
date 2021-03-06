import IUserRepository from '../../database/repositories/IUserRepository';
import UserDbModel from '../../database/dbModels/UserDbModel';
import IAuthController from './IAuthController';
import HttpStatus from 'http-status-codes';
import IValidator from '../../api/validators/IValidator';
import ValidationError from '../../api/validators/ValidationError';
import ILogger from 'services/ILogger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import IDateHelper from 'helpers/IDateHelper';

class AuthController implements IAuthController {
    private readonly _repository: IUserRepository;
    // private readonly _validator: IValidator<any>;
    private readonly _logger: ILogger;
    private readonly _dateHelper: IDateHelper;

    constructor(repository: IUserRepository,
                validator: IValidator < any > ,
                logger: ILogger,
                dateHelper: IDateHelper) {
        this._repository = repository;
        // this._validator = validator;
        this._logger = logger;
        this._dateHelper = dateHelper;
    }

    public async login(req: any, res: any): Promise < void > {
        try {
            this._logger.info('AuthController login');
            const email = req.body.email;
            const inputPassword = req.body.password;
            this.loginByEmail(res, email, inputPassword);
        } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async logout(req: any, res: any): Promise<void> {
        try {
            // TODO do something!
            res.status(HttpStatus.OK).json({
                'x-access-token': '',
            });
        } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    public async register (req: any, res: any): Promise<void> {
        try {
            const hashedPassword = bcrypt.hashSync(req.body.password, 8);
            const email = req.body.email;
            const user = await
                this._repository.getByEmail(email);
            if (user) {
                return res.status(HttpStatus.CONFLICT).json('user exists');
            }

            const newUser = new UserDbModel(
                undefined,
                email,
                hashedPassword,
                'user',
                false,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                this._dateHelper.now(),
                undefined
                );
                const createdUser = await this._repository.create(newUser);
                if (createdUser && createdUser._id) {
                    this.loginByEmail(res, createdUser.email, req.body.password);
                } else { res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('No User Added'); }

        } catch (error) {
            // TODO better error handling with middlewares
            if (error instanceof ValidationError) {
                return res.status(HttpStatus.BAD_REQUEST).json(error);
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
            }
        }
    }

    private async loginByEmail(res: any, email: string, password: string): Promise<void> {
        // TODO validate email
        const user = await
        this._repository.getByEmail(email);
    if (!user) { res.status(HttpStatus.UNAUTHORIZED); } else {
        // TODO return a token
        const passwordIsValid = bcrypt.compareSync(password, user.password);
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
    }
}

export default AuthController;
