import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import config from '../config'
import logger from '../infrastructure/logger'
import apiResponse from './apiResponse'
import dataBase from '../dataBase'

const users = dataBase.users

exports.checkRole = (req, res, callback) => {
  try {
    logger.log_info('checking role')
    const token = req.headers['x-access-token']
    if (!token) {
      apiResponse.sendUnAuthorized(res)
      logger.log_info('authentication failed')
      return
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        apiResponse.sendUnAuthorized(res)
        logger.log_info('authentication failed')
        return
      }
      users.getById(decoded.id, (error, user) => {
        if (error) return apiResponse.sendNotFound(res)
        if (!user) return apiResponse.sendNotFound(res)
        callback(user, user.role)
      })
    })
  } catch (error) {
    apiResponse.sendInternalError(res, error)
    logger.log_error(error)
  }
}

exports.checkUserAuthentication = (req, res, callback) => {
  try {
    logger.log_info('checking user auth')
    const token = req.headers['x-access-token']
    if (!token) {
      apiResponse.sendUnAuthorized(res)
      logger.log_info('user authentication failed')
      return
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        apiResponse.sendUnAuthorized(res)
        logger.log_info('user authentication failed')
        logger.log_error(err)
        return
      }
      users.getById(decoded.id, (error, user) => {
        if (error) return apiResponse.sendNotFound(res)
        if (!user) return apiResponse.sendNotFound(res)
        callback(res, user)
      })
    })
  } catch (error) {
    apiResponse.sendInternalError(res, error)
    logger.log_error(error)
  }
}

exports.checkAuthForSuper = (req, res, callback) => {
  try {
    logger.log_info('checking super auth')
    const token = req.headers['x-access-token']
    if (!token) {
      apiResponse.sendUnAuthorized(res)
      logger.log_info('super authentication failed')
      return
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        apiResponse.sendUnAuthorized(res)
        logger.log_info('super authentication failed')
        return
      }
      users.getById(decoded.id, (error, user) => {
        if (error) return apiResponse.sendNotFound(res)
        if (!user) return apiResponse.sendNotFound(res)
        if (user.role !== 'super') {
          apiResponse.sendUnAuthorized(res)
          logger.log_info('super authorization failed')
          return
        }
        callback(user)
      })
    })
  } catch (error) {
    apiResponse.sendInternalError(res, error)
    logger.log_error(error)
  }
}

exports.login = (inputPassword, inputUser, res) => {
  try {
    const user = inputUser
    logger.log_info('log in')
    if (!user.password) {
      return res.status(401).send({
        auth: false,
        token: null
      })
    }
    const passwordIsValid = bcrypt.compareSync(inputPassword, user.password)
    if (!passwordIsValid) {
      return res.status(401).send({
        auth: false,
        token: null
      })
    }
    const token = jwt.sign(
      {
        id: user._id
      },
      config.secret
      // {
      //   // expiresIn: 86400 // expires in 24 hours
      // }
    )
    delete user.password
    delete user.deleted
    delete user._id

    return apiResponse.sendSucces(res, {
      // "auth": true,
      'x-access-token': token,
      // "user": user,
      role: user.role
    })
  } catch (error) {
    logger.log_error(error)
    return apiResponse.sendInternalError(res, error)
  }
}
