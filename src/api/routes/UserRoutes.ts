// import ILogger from 'services/ILogger';
// import IUserController from '../controllers/IUserController';
// import IAuthMiddleware from '../middleware/IAuthMiddleware';
// import IRoute from './IRoute';
// import * as express from 'express';

//  class UserRoutes implements IRoute {
//    public router = express.Router();
//    private readonly _controller: IUserController;
//    private _app: any;
//    private readonly _logger: ILogger;
//    private readonly _authMiddleware: IAuthMiddleware;

//    constructor(controller: IUserController, logger: ILogger, authMiddleware: IAuthMiddleware) {
//      this._controller = controller;
//      this._logger = logger;
//      this._authMiddleware = authMiddleware;
//    }

//    public registerApp(app: any): void {
//     this._logger.info('registerApp UserRoutes');
//     this._app = app;
//    }

//    public attach(): void {
//     this._logger.info('attach UserRoutes');

//     this._app.route('/api/user/getAll')
//         .get(
//             this._authMiddleware.checkSuperAuthentication.bind(this._authMiddleware),
//             this._controller.getAll.bind(this._controller));

//     this._app.route('/api/user')
//         .get(
//             this._authMiddleware.checkSuperAuthentication.bind(this._authMiddleware),
//             this._controller.getById.bind(this._controller));

//     this._app.route('/api/user')
//         .put(
//             this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
//             this._controller.update.bind(this._controller));

//     this._app.route('/api/user')
//         .delete(
//             this._authMiddleware.checkUserAuthentication.bind(this._authMiddleware),
//             this._controller.delete.bind(this._controller));
//    }
// }

// export default UserRoutes;
