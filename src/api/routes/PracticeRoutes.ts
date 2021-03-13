import ILogger from 'services/ILogger';
import IPracticeController from '../controllers/IPracticeController';
import IAuthMiddleware from '../middleware/IAuthMiddleware';
import IRoute from './IRoute';
import * as express from 'express';

 class PracticeRoutes implements IRoute {
   public router = express.Router();
   private readonly _controller: IPracticeController;
   private _app: any;
   private readonly _logger: ILogger;
   private readonly _authMiddleware: IAuthMiddleware;

   constructor(controller: IPracticeController, logger: ILogger, authMiddleware: IAuthMiddleware) {
     this._controller = controller;
     this._logger = logger;
     this._authMiddleware = authMiddleware;
   }

   public registerApp(app: any): void {
    this._logger.info('registerApp PracticeRoutes');
    this._app = app;
   }

   public attach(): void {
    this._logger.info('attach PracticeRoutes');

    this._app.route('/api/practice')
        .get(
            this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
            this._controller.getTodayPractice.bind(this._controller));

    this._app.route('/api/practice')
        .put(
            this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
            this._controller.check.bind(this._controller));
   }
}

export default PracticeRoutes;
