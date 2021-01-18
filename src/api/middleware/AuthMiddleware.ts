import IUserRepository from '../../database/repositories/IUserRepository';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import ILogger from 'services/ILogger';
import IAuthMiddleware from './IAuthMiddleware';

class AuthMiddleware implements IAuthMiddleware {
    private _logger;
    private _userRepository;

    constructor(logger: ILogger, userRepository: IUserRepository) {
        this._logger = logger;
        this._userRepository = userRepository;
    }

    public async checkUserAuthentication (request: any, response: Response, next: NextFunction): Promise<void>  {
        try {
          this._logger.info('checking user auth');
          const token = request.headers['x-access-token'];
          if (token) {
            const secret = config.SECRET;
            const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
            const user = await this._userRepository.getById(verificationResponse.id);
            if (user) {
              request.user = user;
              next();
            } else {
              next(new WrongAuthenticationTokenException());
            }
          } else {
            this._logger.info('user authentication failed, no token provided');
            next(new AuthenticationTokenMissingException());
          }
        } catch (error) {
          this._logger.error(error);
          next(new WrongAuthenticationTokenException());
        }
    }
}

export default AuthMiddleware;
