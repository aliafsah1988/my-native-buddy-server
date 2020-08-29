import apiResponse from '../../apiResponse'
import logger from '../../../infrastructure/logger'
import dataBase from '../../../dataBase'
import dateHelper from '../../../infrastructure/helpers/dateHelper'
import config from '../../../config'

const words = dataBase.words

class PracticeController {
  constructor() {
    this.getTodayPractice = (req, res) => {
      try {
        const user = req.user
        if (!user) return apiResponse.sendNotFound(res)
        const userId = user._id
        let limit = parseInt(req.query.limit, 10)
        const groupId = req.query.groupId

        if (!limit) limit = 0

        const today = dateHelper.today()
        words.getByUserIdAndDate(
          userId,
          today,
          limit,
          groupId,
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
    this.check = (req, res) => {
      try {
        const user = req.user
        if (!user) return apiResponse.sendNotFound(res)
        const userId = user._id

        const text = req.body.text
        const wordId = req.body.wordId

        words.getByIdAndUserId(
          userId,
          wordId,
          (error, inputWord) => {
            if (error) {
              logger.log_error(error)
              apiResponse.sendInternalError(res, error)
              return
            }
            if (!inputWord) {
              logger.log_error(error)
              apiResponse.sendInternalError(res, 'no word founded')
              return
            }
            const word = inputWord

            let message = 'wrong'
            let date = 0

            if (word.text === text) {
              message = 'correct'
              word.correctcount += 1
              // const previousNextPractice = word.nextpractice
              // const daysToAdd = config.PRACTICE_INTERVALS[word.correctcount]
              // date = dateHelper
              //   .addDays(previousNextPractice, daysToAdd)
              date = dateHelper
                .addDays(dateHelper.today(), config.PRACTICE_INTERVALS[word.correctcount])
            } else {
              word.correctcount = 0
              date = dateHelper
                .addDays(dateHelper.today(), 1)
            }
            words.update(user._id, word._id, {
              nextpractice: date,
              correctcount: word.correctcount
            }, (
              err,
              result
            ) => {
              if (err) {
                logger.log_error(err)
                apiResponse.sendInternalError(res, err)
              } else {
                apiResponse.sendSucces(res, message)
              }
            })
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

export default new PracticeController()
