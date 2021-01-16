import bcrypt from 'bcryptjs'
import apiResponse from '../../apiResponse'
import authManager from '../../authManager'
import logger from '../../../infrastructure/logger'
import dataBase from '../../../dataBase'
import validateEmail from '../../../infrastructure/helpers/validator'
import dateHelper from '../../../infrastructure/helpers/dateHelper'

const users = dataBase.users
const UserModel = dataBase.models.userModel

class AuthController {
  constructor() {
    this.apiResponse = apiResponse
    this.register_a_user = (req, res) => {
      try {
        try {
          const hashedPassword = bcrypt.hashSync(req.body.password, 8)
          const password = req.body.password
          const email = req.body.email
          users.getByEmail(email, (error, result) => {
            if (error) {
              logger.log_error(error)
              this.apiResponse.sendInternalError(res, error)
            } else if (result) {
              return this.apiResponse.sendConflict(res)
            } else {
              if (!validateEmail(email)) {
                return this.apiResponse.sendBadRequest(res)
              }
              if (email === undefined || hashedPassword === undefined) {
                this.apiResponse.sendBadRequest(res)
              } else {
                const newUser = new UserModel(
                  email,
                  hashedPassword,
                  'user',
                  false,
                  null,
                  null,
                  null,
                  null,
                  null,
                  false,
                  dateHelper.now(),
                  null
                )
                users.create(newUser, (createError) => {
                  if (createError) {
                    logger.log_error(createError)
                    this.apiResponse.sendInternalError(res, createError)
                  } else {
                    this.loginUserByEmail(res, email, password)
                  }
                })
              }
            }
          })
        } catch (error) {
          logger.log_error(error)
          return this.apiResponse.sendInternalError(res, error)
        }
      } catch (error) {
        logger.log_error(error)
        this.apiResponse.sendInternalError(res, error)
      }
    }
    this.login = (req, res) => {
      try {
        const userNameParameter = req.body.email
        if (userNameParameter === undefined) {
          this.apiResponse.sendBadRequest(res)
        } else {
          const username = String(userNameParameter)
          this.loginUserByEmail(res, username, req.body.password)
        }
      } catch (error) {
        logger.log_error(error)
        return this.apiResponse.sendInternalError(res, error)
      }
    }

    this.logout = (req, res) => {
      try {
        // if (!user) return this.apiResponse.sendNotFound(res);
        // else {
        this.apiResponse.sendSucces(res, {
          auth: false,
          token: null
        })
        // }
      } catch (error) {
        this.apiResponse.sendInternalError(res, error)
        logger.log_error(error)
      }
    }
  }

  loginUserByEmail(res, email, password) {
    users.getByEmail(email, (error, user) => {
      if (error) {
        logger.log_error(error)
        this.apiResponse.sendInternalError(res, error)
      } else if (!user) return this.apiResponse.sendNotFound(res)
      else {
        authManager.login(password, user, res)
      }
    })
  }
}

export default AuthController
