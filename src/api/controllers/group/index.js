import apiResponse from '../../apiResponse'
import logger from '../../../infrastructure/logger'
import dataBase from '../../../dataBase'
import dateHelper from '../../../infrastructure/helpers/dateHelper'

const GroupModel = dataBase.models.groupModel
const groups = dataBase.groups

class GroupController {
  async create(req, res) {
    try {
      const user = req.user
      if (!user) return apiResponse.sendNotFound(res)

      const userId = user._id
      const name = req.body.name
      const description = req.body.description
      const langId = req.body.langId

      const newGroup = new GroupModel(name,
        description,
        userId,
        langId,
        dateHelper.now())

      const result = await groups.create(newGroup)
      apiResponse.sendSucces(res, {
        id: result.insertedId
      })
    } catch (error) {
      logger.log_error(error)
      apiResponse.sendInternalError(res, error)
    }
  }

  async delete(req, res) {
    try {
      const user = req.user
      const wordId = req.query.id
      if (!wordId || wordId.length === 0) {
        apiResponse.sendBadRequest(res, 'no word id provided')
        return
      }

      apiResponse.sendSucces(res, {
        id: await groups.delete(user._id, wordId)
      })
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  }

  async update(req, res) {
    try {
      const user = req.user
      if (!user) return apiResponse.sendNotFound(res)
      const userId = user._id
      const groupId = req.query.id
      const name = req.body.name
      const description = req.body.description
      const langId = req.body.langId

      const newGroup = new GroupModel(name,
        description,
        userId,
        langId,
        null,
        dateHelper.now())

      apiResponse.sendSucces(res, await groups.update(userId, groupId, newGroup))
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  }

  async getByUserId(req, res) {
    try {
      const user = req.user
      if (!user) return apiResponse.sendNotFound(res)
      const userId = req.query.userId
      let skip = parseInt(req.query.skip, 10)
      let limit = parseInt(req.query.limit, 10)

      if (!skip) skip = 0
      if (!limit) limit = 0
      apiResponse.sendSucces(res, await groups.getByUserId(userId, limit, skip))
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  }

  async getById(req, res) {
    try {
      const user = req.user
      const userId = user._id
      const groupId = req.query.id
      if (user.role === 'super') { apiResponse.sendSucces(res, await groups.getById(groupId)) } else { apiResponse.sendSucces(res, await groups.getByIdAndUserId(userId, groupId)) }
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  }

  async getMyGroups(req, res) {
    try {
      const user = req.user
      if (!user) return apiResponse.sendNotFound(res)
      const userId = user._id
      let skip = parseInt(req.query.skip, 10)
      let limit = parseInt(req.query.limit, 10)

      if (!skip) skip = 0
      if (!limit) limit = 0

      const result = await groups.getByUserId(userId, limit, skip)
      apiResponse.sendSucces(res, result)
    } catch (error) {
      apiResponse.sendInternalError(res, error)
      logger.log_error(error)
    }
  }
}

export default GroupController
