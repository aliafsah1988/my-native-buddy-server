import config from './config';
import RestServer from './services/RestServer';
import Logger from './services/Logger';
import DatabaseManager from './database/manager/DatabaseManager';
import SampleValidator from './api/validators/SampleValidator';
import GroupRepository from './database/repositories/GroupRepository';
import UserRepository from './database/repositories/UserRepository';
import GroupController from './api/controllers/GroupController';
import AuthController from './api/controllers/AuthController';
import LangController from './api/controllers/LangController';
import GroupRoutes from './api/routes/GroupRoutes';
import AuthRoutes from './api/routes/AuthRoutes';
import LangRoutes from './api/routes/LangRoutes';
import DateHelper from './helpers/DateHelper';
import AuthMiddleware from './api/middleware/AuthMiddleware';

import IocContainer from './services/IocContainer';
const iocContainer = new IocContainer();

iocContainer.service('Logger', c => new Logger());

iocContainer.service('DatabaseManager', c => DatabaseManager.getInstance(
    {
        ip: config.MONGOD_IP,
        port: config.MONGOD_PORT,
        dbName: config.MONGOD_DB,
    },
    c.Logger
));

iocContainer.service('SampleValidator', c => new SampleValidator(c.Logger));
iocContainer.service('DateHelper', c => new DateHelper(c.Logger));
iocContainer.service('GroupRepository', c => new GroupRepository(c.DatabaseManager, c.Logger));
iocContainer.service('UserRepository', c => new UserRepository(c.DatabaseManager, c.Logger));
iocContainer.service('GroupController', c => new GroupController(c.GroupRepository, c.SampleValidator, c.Logger, c.DateHelper));
iocContainer.service('AuthController', c => new AuthController(c.UserRepository, c.SampleValidator, c.Logger, c.DateHelper));
iocContainer.service('LangController', c => new LangController(c.SampleValidator, c.Logger));
iocContainer.service('AuthMiddleware', c => new AuthMiddleware(c.Logger, c.UserRepository ));
iocContainer.service('GroupRoutes', c => new GroupRoutes(c.GroupController, c.Logger, c.AuthMiddleware));
iocContainer.service('AuthRoutes', c => new AuthRoutes(c.AuthController, c.Logger));
iocContainer.service('LangRoutes', c => new LangRoutes(c.LangController, c.Logger, c.AuthMiddleware));
iocContainer.service('RestServer', c => new RestServer(config.SERVER_PORT, config.SERVER_HOST, [c.GroupRoutes, c.AuthRoutes, c.LangRoutes], c.Logger));

iocContainer.get('DatabaseManager').connect();
iocContainer.get('RestServer').start();
