import mongodb from 'mongodb'
import DataBaseManager from '../../dataBaseManager'
import logger from '../../../../infrastructure/logger'

class userRepository {
  constructor() {
    this.dataBaseManager = DataBaseManager.getInstance()
  }

  getAll(skip, limit, callback) {
    try {
      const projectionQuery = {
        fields: {
          password: 0
        }
      }
      this.dataBaseManager.dataBase
        .collection('users')
        .find({}, projectionQuery)
        .limit(limit)
        .skip(skip)
        .toArray((err, result) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('getAllUsers done')
          callback(null, result)
        })
    } catch (error) {
      logger.log_error(error)
      return callback(error, null)
    }
  }

  // getByEmail(email, callback) {
  //   try {
  //     const projectionQuery = {
  //       // fields: {
  //       //   password: 0
  //       // }
  //     }
  //     this.dataBaseManager.dataBase.collection('users').findOne(
  //       {
  //         email
  //       },
  //       projectionQuery,
  //       (err, result) => {
  //         if (err) {
  //           logger.log_error(err)
  //           return callback(err, null)
  //         }
  //         logger.log_info('getUserByEmail done')
  //         callback(null, result)
  //       }
  //     )
  //   } catch (err) {
  //     logger.log_error(err)
  //     callback(err, null)
  //   }
  // }

  // getById(id, callback) {
  //   try {
  //     const o_id = new mongodb.ObjectID(id)
  //     const projectionQuery = {
  //       fields: {
  //         password: 0
  //       }
  //     }
  //     this.dataBaseManager.dataBase.collection('users').findOne(
  //       {
  //         _id: o_id
  //       },
  //       projectionQuery,
  //       (err, result) => {
  //         if (err) {
  //           logger.log_error(err)
  //           return callback(err, null)
  //         }
  //         logger.log_info('getById done')
  //         callback(null, result)
  //       }
  //     )
  //   } catch (error) {
  //     logger.log_error(error)
  //     callback(error, null)
  //   }
  // }

  create(newUser, callback) {
    try {
      this.dataBaseManager.dataBase
        .collection('users')
        .insertOne(newUser, (err, res) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('create user done')
          callback(null, res)
        })
    } catch (err) {
      logger.log_error(err)
      callback(err, null)
    }
  }

  updateById(id, modifiedFields, callback) {
    try {
      const userId = new mongodb.ObjectID(id)
      const myquery = {
        _id: userId
      }
      const newvalues = {
        $set: modifiedFields
      }
      this.dataBaseManager.dataBase
        .collection('users')
        .updateOne(myquery, newvalues, (err, res) => {
          try {
            if (err) return callback(err, null)
            if (res.result.nModified && res.result.nModified > 0) {
              logger.log_info('updateUserById done')
              return callback(null, true)
            }
            logger.log_error('no user updated')
            callback(null, false)
          } catch (error) {
            logger.log_error(error)
            callback(error, null)
          }
        })
    } catch (err) {
      logger.log_error(err)
      callback(err, null)
    }
  }

  deleteById(id, callback) {
    try {
      const userId = new mongodb.ObjectID(id)
      const query = {
        _id: userId
      }
      this.dataBaseManager.dataBase
        .collection('users')
        .remove(query, (err, obj) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('deleteUserById done')
          callback(null, obj)
        })
    } catch (err) {
      logger.log_error(err)
      callback(err, null)
    }
  }
}

export default userRepository
