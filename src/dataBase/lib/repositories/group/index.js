import mongodb from 'mongodb'
import DataBaseManager from '../../dataBaseManager'
import logger from '../../../../infrastructure/logger'

class GroupRepository {
  constructor() {
    this.dataBaseManager = DataBaseManager.getInstance()
  }

  getByUserId(userId, limit, skip) {
    return new Promise((resolve, reject) => {
      try {
        const userObjectId = new mongodb.ObjectID(userId)
        const query = { userId: userObjectId }

        this.dataBaseManager.dataBase
          .collection('groups')
          .find(query, {})
          .limit(limit)
          .skip(skip)
          .toArray((err, result) => {
            if (err) {
              logger.log_error(err)
              return reject(err)
            }
            logger.log_info('groups getByUserId done')
            resolve(result)
          })
      } catch (error) {
        logger.log_error(error)
        reject(error)
      }
    })
  }

  getById(groupId) {
    return new Promise((resolve, reject) => {
      try {
        const _id = new mongodb.ObjectID(groupId)
        this.dataBaseManager.dataBase.collection('groups').findOne(
          {
            _id
          },
          (err, result) => {
            if (err) {
              logger.log_error(err)
              return reject(err)
            }
            logger.log_info('groups getById done')
            resolve(result)
          }
        )
      } catch (err) {
        logger.log_error(err)
        return reject(err)
      }
    })
  }

  getByIdAndUserId(userId, groupId) {
    return new Promise((resolve, reject) => {
      try {
        this.dataBaseManager.dataBase.collection('groups').findOne(
          {
            _id: new mongodb.ObjectID(groupId),
            userId: new mongodb.ObjectID(userId)
          },
          (err, result) => {
            if (err) {
              logger.log_error(err)
              return reject(err)
            }
            logger.log_info('groups getByIdAndUserId done')
            resolve(result)
          }
        )
      } catch (err) {
        logger.log_error(err)
        return reject(err)
      }
    })
  }

  create(newGroup) {
    return new Promise((resolve, reject) => {
      try {
        this.dataBaseManager.dataBase
          .collection('groups')
          .insertOne(newGroup, (err, res) => {
            if (err) {
              logger.log_error(err)
              return reject(err)
            }
            logger.log_info('create group done')
            resolve(res)
          })
      } catch (error) {
        logger.log_error(error)
        reject(error)
      }
    })
  }

  update(userId, groupId, modifiedFields) {
    return new Promise((resolve, reject) => {
      const query = {
        userId: new mongodb.ObjectID(userId),
        _id: new mongodb.ObjectID(groupId)
      }
      const newvalues = {
        $set: modifiedFields
      }

      this.dataBaseManager.dataBase
        .collection('groups')
        .updateOne(query, newvalues, (err, res) => {
          try {
            if (err) return reject(err)
            if (res.result.nModified && res.result.nModified > 0) {
              logger.log_info('update group done')
              return resolve(true)
            }
            logger.log_error('no group updated')
            resolve(false)
          } catch (error) {
            logger.log_error(error)
            reject(err)
          }
        })
    })
  }

  delete(userId, groupId, callback) {
    return new Promise((resolve, reject) => {
      try {
        const query = {
          userId: new mongodb.ObjectID(userId),
          _id: new mongodb.ObjectID(groupId)
        }
        this.dataBaseManager.dataBase
          .collection('groups').deleteOne(
            query,
            (err, result) => {
              if (err) {
                logger.log_error(err)
                return reject(err)
              }
              logger.log_info(`delete group id=${groupId} done`)
              resolve(result.result.n >= 1)
            }
          )
      } catch (error) {
        logger.log_error(error)
        reject(error)
      }
    })
  }
}

export default GroupRepository
