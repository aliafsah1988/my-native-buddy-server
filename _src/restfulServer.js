
import express from 'express'
import bodyParser from 'body-parser'
import config from './config'

import userRouts from './api/routes/user'
import authRouts from './api/routes/auth'
import wordRouts from './api/routes/word'
import groupRouts from './api/routes/group'
import practiceRouts from './api/routes/practice'
import langRouts from './api/routes/lang'

import dataBase from './dataBase'
import logger from './infrastructure/logger'

const app = express()
const port = config.SERVER_PORT || 3000
const host = config.SERVER_HOST || '127.0.0.1'

function initBodyParser() {
  logger.log_info('initing body parser')
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(bodyParser.json())
}

function add_Access_Control_Allow_Headers() {
  logger.log_info('adding Access_Control_Allow_Headers')

  // Add headers
  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')

    // Request methods you wish to allow
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )

    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type,x-access-token,encType'
    )

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
  })
}

function registerRoutes() {
  logger.log_info('registering routes')

  userRouts(app)
  authRouts(app)
  wordRouts(app)
  practiceRouts(app)
  groupRouts(app)
  langRouts(app)
}

function initial() {
  try {
    dataBase.connect()
    initBodyParser()
    add_Access_Control_Allow_Headers()
    registerRoutes()
  } catch (err) {
    logger.log_error(err)
  }
}

class RestfulServer {
  constructor() {
    initial()
    this.startListening = () => {
      try {
        app.listen(port, host)
        logger.log_info(`RESTful API server started on: ${host}:${port}`)
      } catch (error) {
        logger.log_error(error)
      }
    }
  }
}

// constructor implemented inside so, no matter how many times require call this file,
// it will be always one object (to prevent multi restful server on all over the project)
export default RestfulServer
