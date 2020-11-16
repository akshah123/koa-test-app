require('./tracing').then(() => {
  const { runServer } = require('./server') // eslint-disable-line global-require
  runServer()
})
