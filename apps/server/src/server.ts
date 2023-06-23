import express from 'express'
import http from 'http'

import 'dotenv/config'

import './setup'

import { logger } from './utils'

const app = express()

const server = http.createServer(app)

server.listen(3001, () => logger.info(`🚀 Server has launched`))
