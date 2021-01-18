import ILogger from 'services/ILogger';
import IGroupController from '../controllers/IGroupController';
import IRoute from './IRoute';
import IAuthMiddleware from '../middleware/IAuthMiddleware';
import * as express from 'express';

 class GroupRoutes implements IRoute {
   public router = express.Router();
   private readonly _controller: IGroupController;
   private _app: any;
   private readonly _logger: ILogger;
   private readonly _authMiddleware: IAuthMiddleware;

   constructor(controller: IGroupController, logger: ILogger, authMiddleware: IAuthMiddleware) {
     this._controller = controller;
     this._logger = logger;
     this._authMiddleware = authMiddleware;
   }

   public registerApp(app: any): void {
    this._logger.info('registerApp GroupRoutes');
    this._app = app;
   }

   public attach(): void {
    this._logger.info('attach GroupRoutes');
    // this._app.route('/api/group/getByUserId')
    // .get(
    //   this._controller.getByUserId.bind(this._controller)
    // );

    // this._app.route('/api/group')
    // .get(
    //   this._controller.getById.bind(this._controller)
    // );

    // this._app.route('/api/group')
    // .post(
    //   this._controller.create.bind(this._controller)
    // );

    // this._app.route('/api/group')
    // .put(
    //   this._controller.update.bind(this._controller)
    // );

    // this._app.route('/api/group')
    // .delete(
    //   this._controller.delete.bind(this._controller)
    // );

    this._app.route('/api/group/user')
    .get(
      this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
      this._controller.getMyGroups.bind(this._controller)
    );
   }
}

export default GroupRoutes;
