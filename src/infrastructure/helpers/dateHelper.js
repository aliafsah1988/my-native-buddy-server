import moment from 'moment'
import logger from '../logger'

const dateHelper = {
  today() {
    try {
      return moment().utc().startOf('day').toDate()
    } catch (error) {
      logger.log_error(error)
      return null
    }
  },
  now() {
    try {
      return moment().utc().toDate()
    } catch (error) {
      logger.log_error(error)
      return null
    }
  },
  addDays(date, days) {
    try {
      return moment(date).add(days, 'days').toDate()
    } catch (error) {
      return null
    }
  },
  toLocalDate(date) {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
}

export default dateHelper
