import apiResponse from '../../apiResponse'
import logger from '../../../infrastructure/logger'
import dataBase from '../../../dataBase'
import dateHelper from '../../../infrastructure/helpers/dateHelper'

const words = dataBase.words
const WordModel = dataBase.models.wordModel

class WordController {
  constructor() {
    this.create = async(req, res) => {
      try {
        const user = req.user
        if (!user) return apiResponse.sendNotFound(res)
        const userId = user._id
        const text = req.body.text.trim()
        const description = req.body.description
        const synonyms = req.body.synonyms
        const translation = req.body.translation
        const groupId = req.body.groupId
        const langId = req.body.langId
        const today = dateHelper.today()

        if (await words.getByUserIdAndText(userId, text)) { return apiResponse.sendInternalError(res, 'word already exists') }

        const newWord = new WordModel(text,
          description,
          synonyms,
          translation,
          today,
          0,
          userId,
          groupId,
          langId,
          dateHelper.now())

        words.create(newWord, (
          error,
          result
        ) => {
          if (error) {
            logger.log_error(error)
            apiResponse.sendInternalError(res, error)
          } else {
            apiResponse.sendSucces(res, {
              id: result.insertedId
            })
          }
        })
      } catch (error) {
        apiResponse.sendInternalError(res, error)
        logger.log_error(error)
      }
    }
    this.delete = (req, res) => {
      try {
        const user = req.user
        const wordId = req.query.id
        if (!wordId || wordId.length === 0) {
          apiResponse.sendBadRequest(res, 'no word id provided')
          return
        }
        words.delete(user._id, wordId, (
          error,
          result
        ) => {
          if (error) {
            logger.log_error(error)
            apiResponse.sendInternalError(res, error)
          } else {
            apiResponse.sendSucces(res, result)
          }
        })
        return
      } catch (error) {
        apiResponse.sendInternalError(res, error)
        logger.log_error(error)
      }
    }
    this.update = async(req, res) => {
      try {
        const user = req.user
        if (!user) return apiResponse.sendNotFound(res)
        const userId = user._id
        const wordId = req.query.id
        const text = req.body.text.trim()
        const description = req.body.description
        const synonyms = req.body.synonyms
        const translation = req.body.translation
        const groupId = req.body.groupId
        const langId = req.body.langId

        const existedWord = await words.getByUserIdAndText(userId, text)
        if (existedWord && existedWord._id && existedWord._id.toString() !== wordId) {
          return apiResponse.sendInternalError(res, 'word already exists')
        }

        const modifiedWord = new WordModel(
          text,
          description,
          synonyms,
          translation,
          null,
          null,
          null,
          groupId,
          langId,
          null,
          dateHelper.now()
        )

        words.update(
          userId,
          wordId,
          modifiedWord,
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
    }
    this.getByUserId = (req, res) => {
      try {
        const user = req.user
        if (!user) return apiResponse.sendNotFound(res)
        const userId = req.query.userId
        let skip = parseInt(req.query.skip, 10)
        let limit = parseInt(req.query.limit, 10)

        if (!skip) skip = 0
        if (!limit) limit = 0

        words.getByUserId(
          userId,
          skip,
          limit,
          (error, result) => {
            if (error) {
              logger.log_error(error)
              apiResponse.sendInternalError(res, error)
            } else apiResponse.sendSucces(res, result)
          }
        )
        return
      } catch (error) {
        apiResponse.sendInternalError(res, error)
        logger.log_error(error)
      }
    }
    this.getById = (req, res) => {
      try {
        const user = req.user
        const userId = user._id
        const wordId = req.query.id
        if (user.role === 'super') {
          words.getById(
            wordId,
            (error, result) => {
              if (error) {
                logger.log_error(error)
                apiResponse.sendInternalError(res, error)
              }
              apiResponse.sendSucces(res, result)
            }
          )
        } else {
          words.getByIdAndUserId(
            userId,
            wordId,
            (error, result) => {
              if (error) {
                logger.log_error(error)
                apiResponse.sendInternalError(res, error)
              }
              apiResponse.sendSucces(res, result)
            }
          )
        }
      } catch (error) {
        apiResponse.sendInternalError(res, error)
        logger.log_error(error)
      }
    }
    this.getMyWords = (req, res) => {
      try {
        const user = req.user
        if (!user) return apiResponse.sendNotFound(res)
        const userId = user._id
        let skip = parseInt(req.query.skip, 10)
        let limit = parseInt(req.query.limit, 10)

        if (!skip) skip = 0
        if (!limit) limit = 0

        words.getByUserId(
          userId,
          skip,
          limit,
          (error, result) => {
            if (error) {
              logger.log_error(error)
              apiResponse.sendInternalError(res, error)
            } else apiResponse.sendSucces(res, result)
          }
        )
        return
      } catch (error) {
        apiResponse.sendInternalError(res, error)
        logger.log_error(error)
      }
    }
  }
}

export default new WordController()
