import ILogger from 'services/ILogger';
import IAuthController from '../controllers/IAuthController';
import IRoute from './IRoute';
import * as express from 'express';

 class AuthRoutes implements IRoute {
   public router = express.Router();
   private readonly _controller: IAuthController;
   private _app: any;
   private readonly _logger: ILogger;

   constructor(controller: IAuthController, logger: ILogger) {
     this._controller = controller;
     this._logger = logger;
   }

   public registerApp(app: any): void {
    this._logger.info('registerApp AuthRoutes');
    this._app = app;
   }

   public attach(): void {
    this._logger.info('attach AuthRoutes');

    this._app.route('/api/auth/getToken')
        .post(this._controller.login.bind(this._controller));
    this._app.route('/api/auth/logout')
        .post(this._controller.logout.bind(this._controller));
    this._app.route('/api/auth/register')
        .post(this._controller.register.bind(this._controller));
   }
}

export default AuthRoutes;
