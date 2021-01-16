/* eslint-disable */
import jwt from "jsonwebtoken";
import bcrypt from"bcryptjs";
import config from "../../config";
import logger from "../infrastructure/logger";
import apiResponse from "./apiResponse";

export default {
    login(inputPassword, user, res) {
        try {
            logger.log_info("log in");
            if (!user.password)
                return res.status(401).send({
                    auth: false,
                    token: null
                });
            let passwordIsValid = bcrypt.compareSync(inputPassword, user.password);
            if (!passwordIsValid)
                return res.status(401).send({
                    auth: false,
                    token: null
                });
            var token = jwt.sign(
                {
                    id: user._id
                },
                config.secret
            // {
            //   // expiresIn: 86400 // expires in 24 hours
            // }
            );
            delete user.password;
            delete user.deleted;
            delete user._id;
            if (user.services) {
                for (let i = 0; i < user.services.length; i++) {
                    delete user.services[i].contract_id;
                }
            }

            return apiResponse.sendSucces(res, {
            //"auth": true,
                "x-access-token": token,
                //"user": user,
                services: [],
                roles: ["admin"]
            //"contact_id": user.contract_id
            });
        } catch (error) {
            logger.log_error(error);
            return apiResponse.sendInternalError(res, error);
        }
    }
};
