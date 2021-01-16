import HttpStatus from 'http-status-codes'
import logger from '../infrastructure/logger'

export default {
  sendSucces(res, data) {
    try {
      if (res) {
        logger.log_info('sending OK')
        res.status(HttpStatus.OK).json(data)
      }
    } catch (error) {
      logger.log_error(error.message)
    }
  },
  sendInternalError(res, error) {
    if (res && error) {
      logger.log_error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
      })
    }
  },
  sendBadRequest(res, message) {
    try {
      if (res) {
        res.status(HttpStatus.BAD_REQUEST).send({
          error: message
        })
        logger.log_info('sending BAD_REQUEST')
      }
    } catch (error) {
      logger.log_error(error.message)
    }
  },
  sendUnAuthorized(res) {
    try {
      if (res) {
        res.status(HttpStatus.UNAUTHORIZED).send({
          auth: false,
          error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)
        })
        logger.log_info('sending UNAUTHORIZED')
      }
    } catch (error) {
      logger.log_error(error.message)
    }
  },
  sendNotFound(res) {
    try {
      if (res) {
        res.status(HttpStatus.NOT_FOUND).send({
          error: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
        })
        logger.log_info('sending NOT_FOUND')
      }
    } catch (error) {
      logger.log_error(error.message)
    }
  },
  sendConflict(res) {
    try {
      if (res) {
        res.status(HttpStatus.CONFLICT).send({
          error: HttpStatus.getStatusText(HttpStatus.CONFLICT)
        })
        logger.log_info('sending CONFLICT')
      }
    } catch (error) {
      logger.log_error(error.message)
    }
  }
}
