'use strict'

const compress = require('koa-compress')
const logger = require('koa-logger')
const serve = require('koa-static')
const route = require('koa-route')
const bodyParser = require('koa-bodyparser')
const koa = require('koa')

const path = require('path')
const app = module.exports = koa()
const algorithm = require('./src/algorithm')

app.use(bodyParser( { 
	extendTypes: {
      json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
    }
}))

// Logger
app.use(logger())

let home = function * home (next) {
  if (this.method !== 'GET') return yield next
  this.body = yield { name: 'testValue' }
}

let post = function * post(next) {
  if (this.method !== 'POST') return yield next
  console.log(this.request.body)
  this.body = yield { name: 'testValue' }
}

let pathFind = function * pathFind(next) {
  if (this.method !== 'POST') return yield next
  // 50 runs of genetic algorithm
  const body = this.request.body  
  if (body.points && body.points.length >= 3) {
    const TIMES_ITERATION = 50

    algorithm.GAInitialize(body.points)

    for (let i = 0; i < TIMES_ITERATION ; ++i) {
      algorithm.GANextGeneration()
    }

    const results = algorithm.getResults()
    this.body = yield { path: results }
  } else {
    this.throw('Invalid points format', 400)
  }
}

app.use(route.get('/', home))
// app.use(route.get('/books/', books.all));
// app.use(route.get('/view/books/', books.list));
app.use(route.post('/paths/find', pathFind));
app.use(route.post('/', post));
// app.use(route.put('/books/:id', books.modify));
// app.use(route.delete('/books/:id', books.remove));
// app.use(route.options('/', books.options));
// app.use(route.trace('/', books.trace));
// app.use(route.head('/', books.head));

// Serve static files
app.use(serve(path.join(__dirname, 'public')))

// Compress
app.use(compress())

if (!module.parent) {
  let port = process.env.PORT || 3003
  app.listen(port)
  console.log('listening on port', port)
}
