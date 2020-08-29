import util from "util";
let format = util.format;
import mongo from "mongodb";
import logger from "../../infrastructure/logger";
import config from "../../config"

// //static fields
// dataBaseManager.client = null;
// dataBaseManager.dataBase = null;
// dataBaseManager.connected = false;

var Singleton = (function () {
    var instance;

    function createInstance() {
        var object = new dataBaseManager();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function dataBaseManager() {
    this.connected = false;
    this.client = null;
    this.dataBase = null;

    //public methods
    this.connect = function () {
        try {
            let user = encodeURIComponent(config.MONGOD_USER);
            let password = encodeURIComponent(config.MONGOD_PASS);
            let mongodIP = encodeURIComponent(config.MONGOD_IP);
            let mongodPort = encodeURIComponent(
                config.MONGOD_PORT
            );
            let authMechanism = config.MONGOD_AUTH;
            let mongoDbName = config.MONGOD_DB;
            // let mongoServerUrl = format(
            //     "mongodb://%s:%s@%s:%s/%s?authMechanism=%s",
            //     user,
            //     password,
            //     mongodIP,
            //     mongodPort,
            //     mongoDbName,
            //     authMechanism
            // );

            let mongoServerUrl = format(
                "mongodb://%s:%s/%s",
                mongodIP,
                mongodPort,
                mongoDbName,
            );


            //     let debug =
            // typeof v8debug === "object" ||
            // /--debug|--inspect/.test(process.execArgv.join(" "));

            //     if (debug) {
            //         mongoServerUrl = "mongodb://127.0.0.1:27017/server01";
            //         mongoDbName = "server01";
            //     }

            mongo.connect(
                mongoServerUrl,
                {
                    useNewUrlParser: true,
                    reconnectTries: 7200,
                    reconnectInterval: 1000
                },
                (err, client) => {
                    if (err) {
                        logger.log_error(err);
                        this.connected = false;
                        this.client = null;
                        this.dataBase = null;
                        return;
                    }
                    this.connected = true;
                    this.client = client;
                    this.dataBase = client.db(mongoDbName);
                    logger.log_info("connected to database");
                }
            );
        } catch (error) {
            logger.log_error(error);
        }
    };
    this.disconnect = function () {
        try {
            if (this.client) {
                this.client.close();
                this.connected = false;
                this.client = null;
                this.dataBase = null;
                logger.log_info("disconnected from database");
            }
        } catch (error) {
            logger.log_error(error);
        }
    };
}

export default Singleton;
