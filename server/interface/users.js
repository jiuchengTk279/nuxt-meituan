import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './untils/passport'
import Email from '../dbs/config'
import axios from './untils/axios'

let router = new Router({
    // 添加前缀
    prefix: '/users'
})

let Store = new Redis().client

// 注册的接口
router.post('/signup', async (ctx) => {
    const { username, password, email, code} = ctx.request.body;
    
    // 验证验证码
    // 在点击发送验证码以后，会将code值存储在redis中，取的时候从redis中获取
    if (code) {
        // Redis Hset 命令用于为哈希表中的字段赋值
        // 如果哈希表不存在，一个新的哈希表被创建并进行 HSET 操作
        // 如果字段已经存在于哈希表中，旧值将被覆盖
        // hset 基本语法 redis 127.0.0.1:6379> HSET KEY_NAME FIELD VALUE
        // 从 redis 中获取  code 的值， username 作为键
        const saveCode = await Store.hget(`nodemail:${username}`, 'code')
        // 从 redis 中获取 expire 的值， username 作为键
        const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
        // 判断验证码是否相等
        if (code === saveCode) { // 验证码正确
            // 当前时间大于失效时间，说明过期
            if (new Date().getTime() - saveExpire > 0) {
                ctx.body = {
                    code: -1,
                    msg: '验证码已过期，请重新尝试'
                }
                return false
            }
        } else {  // 验证码错误
            ctx.body = {
                code: -1,
                msg: '请填写正确的验证码'
            }
        }
    } else { // 没有填验证码
        ctx.body = {
            code: -1,
            msg: '请填写验证码'
        }
    }

    // 验证用户名，根据用户名去查找是否有重复的
    let user = await User.find({ username })
    // 用户名已存在
    if (user.length) {
        ctx.body = {
            code: -1,
            msg: '已被注册'
        }
        return
    }
    // 用户名不存在，写库，创建新用户
    let nuser = await User.create({ username, password, email })
    // 存在新用户nuser
    if (nuser) {
        // 发送请求提交数据
        let res = await axios.post('/users/signin', { username, password})
        if (res.data && res.data.code === 0) { // 有响应数据，并且返回的code编码为0
            ctx.body = {
                code: 0,
                msg: '注册成功',
                user: res.data.user
            }
        } else { // 没有响应数据
            ctx.body = {
                code: -1,
                msg: 'error'
            }
        }
    } else { 
        ctx.body = {
            code: -1,
            msg: '注册失败'
        }
    }
})


// 登录的接口
router.post('/signin', async (ctx, next) => {
    // passport.authenticate( strategy, options, callback ), 验证请求用户
    // 返回一个function，符合funciton(req, res, next)的middleware格式
    // 仅在登录时验证该登录请求，登录成功后，一般需要配合session策略，将登录状态保存在session中，这样每个请求的登录状态就可以通过session策略来获取了
    // 这种场景，需要确认passport.authenticate传入的options.session为true（默认值），并将passport.session()注册为middleware，以便在每个请求时都执行（注册在static和initialize之后）
    // 这个中间件会从每个req的session中取出’passport’的值，反序列化出user，并赋值给req.user（用于存储user对象的字段名是可配置的）
    return Passport.authenticate('local', function (err, user, info, status ) {
        if (err) { // error 异常抛出
            ctx.body = {
                code: -1,
                msg: err
            }
        } else { // 无 error
            if (user) { // user 用户存在
                ctx.body = {
                    code: 0,
                    msg: '登录成功',
                    user
                }
                return ctx.login(user)
            } else { // user 用户不存在
                ctx.body = {
                    code: 1,
                    msg: info
                }
            }
        }
    })(ctx, next)
})

// 验证码验证的接口
router.post('/verify', async (ctx, next) => {
    //  从请求中获取 username 的值
    let username = ctx.request.body.username
    //  从 redis 中获取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    // 存在过期时间并且当前时间小于过期时间，设置不频繁请求
    if (saveExpire && new Date() - saveExpire < 0) { 
        ctx.body = {
            code: -1,
            msg: '验证请求过于频繁，1分钟内1次'
        }
        return false
    }
    // nodeMailer 创建传输方式，发送对象
    let transporter = nodeMailer.createTransport({
        host: Email.smtp.post,
        port: 587,
        secure: false, // 不使用 SSL 传输
        auth: {
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })
    // 接收对象
    let ko = {
        code: Email.smtp.code(),
        expire: Email.smtp.expire(),
        email: ctx.request.body.email,
        user: ctx.request.body.username
    }
    // 配置发送的邮箱对象
    let mailOptions = {
        from: `"认证邮件" <${Email.smtp.user}>`,
        to: ko.email,
        subject: '美团网注册码',
        html: `您在美团网注册，您的邀请码是${ko.code}`
    }
    // transporter 发送对象去发送邮箱，携带配置对象，err和info
    await transporter.sendMail(mailOptions, (err,info) => {
        if (err) { // 有 error 报错
            return console.log('error')
        } else { // 无 error 存 redis
            Store.hmset(`nodemail:${ko.user}`, 'code',ko.code, 'expire',ko.expire, 'email',ko.email )
        }
    })
    ctx.body = {
        code: 0,
        msg: '验证码已发送，可能会有延时，有效期1分钟'
    }
})


// 退出的接口
router.get('/exit', async (ctx, next) => {
    // 执行退出的操作
    await ctx.logout()
    // 进行二次校验，看是否还是登录的状态
    if (!ctx.isAuthenticated()) { // 登录成功
        ctx.body = {
            code: 0
        }
    } else { // 登录失败
        ctx.body = {
            code: -1
        }
    }
})


// 获取用户名的接口
router.get('/getUser', async (ctx, next) => {
    // 判断是否是登录状态，进行二次校验
    if (ctx.isAuthenticated) { // 登录状态
        // 如果是登录状态，passport是存储于 session，从session中获取 passport.user
        const { username, email } = ctx.session.passport.user
        ctx.body = {
            user: username,
            email
        }
    } else { // 未登录状态
        ctx.body = {
            user: '',
            email: ''
        }
    }
})

// 向外暴露接口
export default router