import DataBaseManager from './lib/dataBaseManager'

import UserRepository from './lib/repositories/user'
import WordRepository from './lib/repositories/word'
import GroupRepository from './lib/repositories/group'

import userModel from './lib/models/user/userModel'
import wordModel from './lib/models/word'
import groupModel from './lib/models/group'

const dataBaseManager = DataBaseManager.getInstance()
const users = new UserRepository()
const words = new WordRepository()
const groups = new GroupRepository()

function connect() {
  dataBaseManager.connect()
}

function disconnect() {
  dataBaseManager.disconnect()
}

export default {
  connect,
  disconnect,
  users,
  words,
  groups,
  models: {
    userModel,
    wordModel,
    groupModel
  }
}
