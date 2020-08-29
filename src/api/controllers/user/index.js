import apiResponse from '../../apiResponse'
import logger from '../../../infrastructure/logger'
import dataBase from '../../../dataBase'
import dateHelper from '../../../infrastructure/helpers/dateHelper'

const users = dataBase.users
const UserModel = dataBase.models.userModel

export default {
  getAll(req, res) {
    try {
      let skip = parseInt(req.query.skip, 10)
      let limit = parseInt(req.query.limit, 10)

      if (!skip) skip = 0
      if (!limit) limit = 0

      users.getAll(skip, limit, (error, result) => {
        if (error) {
          logger.log_error(error)
          apiResponse.sendInternalError(res, error)
        } else apiResponse.sendSucces(res, result)
      })
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  },
  getById(req, res) {
    try {
      const id = String(req.query.id)
      if (id === undefined) apiResponse.sendBadRequest(res)
      else {
        users.getById(id, (error, result) => {
          if (error) {
            logger.log_error(error)
            apiResponse.sendInternalError(res, error)
          } else apiResponse.sendSucces(res, result)
        })
      }
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  },
  getByEmail(req, res) {
    try {
      const email = String(req.body.email)
      if (email === undefined) apiResponse.sendBadRequest(res)
      else {
        users.getByEmail(email, (error, result) => {
          if (error) {
            logger.log_error(error)
            apiResponse.sendInternalError(res, error)
          } else apiResponse.sendSucces(res, result)
        })
      }
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  },
  update(req, res) {
    try {
      const user = req.user
      if (!user) return apiResponse.sendNotFound(res)
      const userId = req.query.id
      const email = req.body.email
      const password = req.body.password
      const role = req.body.role
      const active = req.body.active
      const firstName = req.body.firstName
      const lastName = req.body.lastName
      const phone_number = req.body.phone_number
      const location = req.body.location
      const birth_date = req.body.birth_date

      const modifiedUser = new UserModel(
        email,
        password,
        role,
        active,
        firstName,
        lastName,
        phone_number,
        location,
        birth_date,
        null,
        null,
        dateHelper.now()
      )

      users.updateById(
        userId,
        modifiedUser,
        (
          error,
          result
        ) => {
          if (error) {
            logger.log_error(error)
            apiResponse.sendInternalError(res, error)
          } else {
            apiResponse.sendSucces(res, result)
          }
        }
      )
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  },
  delete(req, res) {
    try {
      const userId = req.query.id
      if (userId === undefined) apiResponse.sendBadRequest(res)
      else {
        users.deleteById(userId, (error, result) => {
          if (error) {
            logger.log_error(error)
            apiResponse.sendInternalError(res, error)
          } else apiResponse.sendSucces(res, result.n > 0)
        })
      }
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  }
}
