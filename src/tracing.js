const {
  lightstep,
  opentelemetry
} = require('lightstep-opentelemetry-launcher-node')
const {
  GraphQLInstrumentation
} = require('@opentelemetry/instrumentation-graphql')

module.exports = (async () => {
  const sdk = lightstep.configureOpenTelemetry({
    logLevel: 'debug',
    serviceName: 'test-app'
  })
  await sdk.start()
  const provider = opentelemetry.trace.getTracerProvider()
  const graphQLInstrumentation = new GraphQLInstrumentation({})
  graphQLInstrumentation.setTracerProvider(provider)
  graphQLInstrumentation.enable()
})()
