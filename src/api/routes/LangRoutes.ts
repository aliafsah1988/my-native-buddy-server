import ILogger from 'services/ILogger';
import ILangController from '../controllers/ILangController';
import IAuthMiddleware from '../middleware/IAuthMiddleware';
import IRoute from './IRoute';
import * as express from 'express';

 class LangRoutes implements IRoute {
   public router = express.Router();
   private readonly _controller: ILangController;
   private _app: any;
   private readonly _logger: ILogger;
   private readonly _authMiddleware: IAuthMiddleware;

   constructor(controller: ILangController, logger: ILogger, authMiddleware: IAuthMiddleware) {
     this._controller = controller;
     this._logger = logger;
     this._authMiddleware = authMiddleware;
   }

   public registerApp(app: any): void {
    this._logger.info('registerApp LangRoutes');
    this._app = app;
   }

   public attach(): void {
    this._logger.info('attach LangRoutes');

    this._app.route('/api/lang/list')
        .get(
            this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
            this._controller.getList.bind(this._controller));
   }
}

export default LangRoutes;
