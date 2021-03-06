import { NextFunction, Response } from 'express';

interface IAuthMiddleware {
    checkUserAuthentication: (request: any, response: Response, next: NextFunction) => Promise<void>;
    checkSuperAuthentication: (request: any, response: Response, next: NextFunction) => Promise<void>;
}

export default IAuthMiddleware;
