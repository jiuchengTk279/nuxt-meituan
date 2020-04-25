// const Koa = require('koa')
import Koa from 'koa'
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

// 导入包和工具类
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import dbConfig from './dbs/config'
import passport from './interface/untils/passport'
import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'

const app = new Koa()

// 进行配置
app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({key: 'mt', prefix: 'mt:uid', store: new Redis()}))
app.use(bodyParser({
  extendTypes: ['json', 'from', 'text']
}))
app.use(json())

// 连接邮箱
mongoose.connect(dbConfig.dbs, {
  // 开启使用当前URL字符串的解析器
  useNewUrlParser: true
})
// 初始化passport,为每个请求req上附加passport的对象实例（_passport）, 这个中间件是必须注册的
app.use(passport.initialize())
// 开启session的话，这个中间件需要放到session中间件的后面
app.use(passport.session())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  await nuxt.ready()
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  //匹配对应路径，根据ctx.status设置response
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
