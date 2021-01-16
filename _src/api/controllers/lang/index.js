import apiResponse from '../../apiResponse'
import logger from '../../../infrastructure/logger'
import languages from '../../../infrastructure/statics/languageList'

class LangController {
  async getList(req, res) {
    try {
      const user = req.user
      if (!user) return apiResponse.sendNotFound(res)
      apiResponse.sendSucces(res, languages)
    } catch (error) {
      logger.log_error(error)
      apiResponse.sendInternalError(res, error)
    }
  }
}

export default LangController
