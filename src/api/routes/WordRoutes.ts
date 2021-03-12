import ILogger from 'services/ILogger';
import IWordController from '../controllers/IWordController';
import IRoute from './IRoute';
import IAuthMiddleware from '../middleware/IAuthMiddleware';
import * as express from 'express';

 class WordRoutes implements IRoute {
   public router = express.Router();
   private readonly _controller: IWordController;
   private _app: any;
   private readonly _logger: ILogger;
   private readonly _authMiddleware: IAuthMiddleware;

   constructor(controller: IWordController, logger: ILogger, authMiddleware: IAuthMiddleware) {
     this._controller = controller;
     this._logger = logger;
     this._authMiddleware = authMiddleware;
   }

   public registerApp(app: any): void {
    this._logger.info('registerApp WordRoutes');
    this._app = app;
   }

   public attach(): void {
    this._logger.info('attach WordRoutes');

    this._app.route('/api/word/getByUserId')
    .get(
      this._authMiddleware.checkSuperAuthentication.bind(this._authMiddleware),
      this._controller.getByUserId.bind(this._controller)
    );

    this._app.route('/api/word')
    .get(
      this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
      this._controller.getById.bind(this._controller)
    );

    this._app.route('/api/word')
    .post(
      this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
      this._controller.create.bind(this._controller)
    );

    this._app.route('/api/word')
    .put(
      this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
      this._controller.update.bind(this._controller)
    );

    this._app.route('/api/word')
    .delete(
      this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
      this._controller.delete.bind(this._controller)
    );

    this._app.route('/api/word/user')
    .get(
      this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
      this._controller.getMyWords.bind(this._controller)
    );
   }
}

export default WordRoutes;
