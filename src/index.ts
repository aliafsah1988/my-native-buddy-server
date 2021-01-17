import config from './config';
import RestServer from './services/RestServer';
import Logger from './services/Logger';
import DatabaseManager from './database/manager/DatabaseManager';
import SampleValidator from './api/validators/SampleValidator';
import GroupRepository from './database/repositories/GroupRepository';
import GroupController from './api/controllers/GroupController';
import GroupRoutes from './api/routes/GroupRoutes';
import DateHelper from './helpers/DateHelper';

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
iocContainer.service('SampleController', c => new GroupController(c.GroupRepository, c.SampleValidator, c.Logger, c.DateHelper));
iocContainer.service('SampleRoutes', c => new GroupRoutes(c.SampleController, c.Logger));
iocContainer.service('RestServer', c => new RestServer(config.SERVER_PORT, config.SERVER_HOST, c.SampleRoutes, c.Logger));

iocContainer.get('DatabaseManager').connect();
iocContainer.get('RestServer').start();
