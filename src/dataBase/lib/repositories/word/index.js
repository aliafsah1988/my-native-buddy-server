import mongodb from 'mongodb'
import DataBaseManager from '../../dataBaseManager'
import logger from '../../../../infrastructure/logger'

class WordRepository {
  constructor() {
    this.dataBaseManager = DataBaseManager.getInstance()
  }

  getByUserId(userId, limit, skip, callback) {
    try {
      const userObjectId = new mongodb.ObjectID(userId)
      const query = { userId: userObjectId }

      this.dataBaseManager.dataBase
        .collection('words')
        .find(query, {})
        .limit(limit)
        .skip(skip)
        .toArray((err, result) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('words getByUserId done')
          callback(null, result)
        })
    } catch (error) {
      logger.log_error(error)
      callback(error, null)
    }
  }

  getById(wordId, callback) {
    try {
      const _id = new mongodb.ObjectID(wordId)
      this.dataBaseManager.dataBase.collection('words').findOne(
        {
          _id
        },
        (err, result) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('words getById done')
          callback(null, result)
        }
      )
    } catch (err) {
      logger.log_error(err)
      return callback(err, null)
    }
  }

  getByIdAndUserId(userId, wordId, callback) {
    try {
      this.dataBaseManager.dataBase.collection('words').findOne(
        {
          _id: new mongodb.ObjectID(wordId),
          userId: new mongodb.ObjectID(userId)
        },
        (err, result) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('words getByIdAndUserId done')
          callback(null, result)
        }
      )
    } catch (err) {
      logger.log_error(err)
      return callback(err, null)
    }
  }

  getByUserIdAndDate(userId, date, limit, groupId, callback) {
    try {
      const query = {
        userId: new mongodb.ObjectID(userId),
        nextpractice: { $lte: date },
        groupId: new mongodb.ObjectID(groupId)
      }

      this.dataBaseManager.dataBase
        .collection('words')
        .find(query, {})
        .limit(limit)
        .skip(0)
        .toArray((err, result) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('words getByUserIdAndDate done')
          callback(null, result)
        })
    } catch (error) {
      logger.log_error(error)
      callback(error, null)
    }
  }

  getByUserIdAndText(userId, text) {
    return new Promise((resolve, reject) => {
      try {
        const userIdObj = new mongodb.ObjectID(userId)
        this.dataBaseManager.dataBase.collection('words').findOne(
          {
            userId: userIdObj,
            text: text.trim()
          },
          (err, result) => {
            if (err) {
              logger.log_error(err)
              return reject(err)
            }
            logger.log_info('words getByUserIdAndText done')
            resolve(result)
          }
        )
      } catch (err) {
        logger.log_error(err)
        return reject(err)
      }
    })
  }

  create(newWord, callback) {
    try {
      const newWordToSave = { ...newWord }

      if (newWord.groupId) {
        const groupObjectId = new mongodb.ObjectID(newWord.groupId)
        newWordToSave.groupId = groupObjectId
      }

      this.dataBaseManager.dataBase
        .collection('words')
        .insertOne(newWordToSave, (err, res) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info('create word done')
          callback(null, res)
        })
    } catch (err) {
      logger.log_error(err)
      callback(err, null)
    }
  }

  update(userId, wordId, modifiedFields, callback) {
    const query = {
      userId: new mongodb.ObjectID(userId),
      _id: new mongodb.ObjectID(wordId)
    }

    const wordToSave = { ...modifiedFields }

    if (modifiedFields.groupId) {
      const groupObjectId = new mongodb.ObjectID(modifiedFields.groupId)
      wordToSave.groupId = groupObjectId
    }

    const newvalues = {
      $set: wordToSave
    }

    this.dataBaseManager.dataBase
      .collection('words')
      .updateOne(query, newvalues, (err, res) => {
        try {
          if (err) return callback(err, null)
          if (res.result.nModified && res.result.nModified > 0) {
            logger.log_info('update word done')
            return callback(null, true)
          }
          logger.log_error('no word updated')
          callback(null, false)
        } catch (error) {
          logger.log_error(error)
          callback(err, null)
        }
      })
  }

  delete(userId, wordId, callback) {
    const query = {
      userId: new mongodb.ObjectID(userId),
      _id: new mongodb.ObjectID(wordId)
    }
    this.dataBaseManager.dataBase
      .collection('words').deleteOne(
        query,
        (err, result) => {
          if (err) {
            logger.log_error(err)
            return callback(err, null)
          }
          logger.log_info(`delete word id=${wordId} done`)
          callback(null, result.result.n >= 1)
        }
      )
  }
}

export default WordRepository
