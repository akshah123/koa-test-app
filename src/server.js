const { opentelemetry } = require('lightstep-opentelemetry-launcher-node')

const Koa = require('koa')
const logger = require('koa-logger')

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const knex = require('./db/connection')
const {
  SERVICE_NAME: serviceName,
  INSTANCE_ID: instanceId,
  LOG_LEVEL,
  AMQP_URL,
  JWT_USER_SECRET,
  HTTP_PORT,
  SCHEMA_REGISTRY_URL,
  SENTRY_DSN
} = process.env

const amqpConfig = {
  url: AMQP_URL,
  prefetch: 10
}
const jwtConfig = {
  secret: JWT_USER_SECRET
}
const schemaRegistryConfig = {
  schemaRegistryUrl: SCHEMA_REGISTRY_URL
}

// don't use cache if it's prime cache event
// otherwise use default caching strategy
const runServer = () => {
  // start graphql server
  const app = new Koa()
  app.use(logger())

  const PORT = HTTP_PORT || 3000

  app.use(bodyParser())
  const router = new Router()
  const BASE_URL = `/movies`
  router.get(BASE_URL, async ctx => {
    try {
      const movies = await knex('movies').select('*')
      ctx.body = {
        status: 'success',
        data: movies
      }
    } catch (err) {
      console.log(err)
    }
  })

  router.post(`${BASE_URL}`, async ctx => {
    try {
      const movie = await knex('movies')
        .insert(ctx.request.body)
        .returning('*')
      if (movie.length) {
        ctx.status = 201
        ctx.body = {
          status: 'success',
          data: movie
        }
      } else {
        ctx.status = 400
        ctx.body = {
          status: 'error',
          message: 'Something went wrong.'
        }
      }
    } catch (err) {
      ctx.status = 400
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.'
      }
    }
  })

  app.use(router.routes())

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
  })

  return { server }
}

module.exports = { runServer }
