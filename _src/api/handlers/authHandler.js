/* eslint-disable */
import jwt from "jsonwebtoken";
import config from "../../config";
import apiResponse from "../apiResponse";
import logger from "../../infrastructure/logger";
import dataBase from "../../dataBase";
const users = dataBase.users;

export default {
    user: (req, res, next) => {
        try {
            logger.log_info("checking user auth");
            var token = req.headers["x-access-token"];
            if (!token) {
                apiResponse.sendUnAuthorized(res);
                logger.log_info("user authentication failed");
                return;
            }
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    apiResponse.sendUnAuthorized(res);
                    logger.log_info("user authentication failed");
                    logger.log_error(err);
                    return;
                }
                users.getById(decoded.id, function (err, user) {
                    if (err) return apiResponse.sendNotFound(res);
                    if (!user) {
                        return apiResponse.sendNotFound(res);
                    }
                    if (user.role === 'user' || user.role === 'super') {
                        req.user = user;
                        return next();
                    }
                    logger.log_info("user authentication failed");
                    return apiResponse.sendUnAuthorized(res);
                });
            });
        } catch (error) {
            logger.log_error(error);
            return apiResponse.sendInternalError(res, error);
        }
    },
    superAdmin: (req, res, next) => {
        try {
            logger.log_info("checking super auth");
            var token = req.headers["x-access-token"];
            if (!token) {
                apiResponse.sendUnAuthorized(res);
                logger.log_info("super authentication failed");
                return;
            }
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    apiResponse.sendUnAuthorized(res);
                    logger.log_info("super authentication failed");
                    return;
                }
                users.getById(decoded.id, function (err, user) {
                    if (err) return apiResponse.sendNotFound(res);
                    if (!user) return apiResponse.sendNotFound(res);
                    if (user.role != "super") {
                        apiResponse.sendUnAuthorized(res);
                        logger.log_info("super authorization failed");
                        return;
                    }
                    req.user = user;
                    return next();
                });
            });
        } catch (error) {
            apiResponse.sendInternalError(res, error);
            logger.log_error(error);
        }
    }
};
