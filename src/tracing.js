const {
  lightstep,
  opentelemetry
} = require('lightstep-opentelemetry-launcher-node')
const {
  GraphQLInstrumentation
} = require('@opentelemetry/instrumentation-graphql')
const { AsyncLocalStorageContextManager } = require('@opentelemetry/context-async-hooks');

module.exports = (async () => {
  const sdk = lightstep.configureOpenTelemetry({
    contextManager: new AsyncLocalStorageContextManager(),
    accessToken: '',
    logLevel: 'debug',
    serviceName: 'test-app'
  })
  await sdk.start()
  const provider = opentelemetry.trace.getTracerProvider()
  const graphQLInstrumentation = new GraphQLInstrumentation({})
  graphQLInstrumentation.setTracerProvider(provider)
  graphQLInstrumentation.enable()
})()
