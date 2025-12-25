import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { env } from './src/lib/config/env.config'

const port = parseInt(env.PORT, 10)
const dev = env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : env.NODE_ENV
    }`
  )
})
