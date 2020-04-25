import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

// Passport是Node.js的Express兼容身份验证中间件
// Passport的唯一目的是对请求进行身份验证，它通过一组称为策略的可扩展插件来完成
// 您向Passport提供身份验证请求，而Passport提供钩子来控制身份验证成功或失败时发生的情况。
// Passport使用策略的概念来验证请求。策略的范围包括验证用户名和密码凭据，使用OAuth委托的身份验证（例如，通过Facebook 或Twitter）或使用OpenID的联合身份验证
passport.use(new LocalStrategy(async function (username, password, done) {
    let where = { username }
    // 根据用户名进行查找
    let result = await UserModel.findOne(where)
    // 查询结果不为空
    if (result != null) {
        if (result.password===password) {
            return done(null, result)
        } else {
            return done(null, false, '密码错误')
        }
    } else { // 查询结果为空
        return done(null, false, '用户不存在')
    }
}))

// Passport将维持持久的登录会话。为了使持久会话正常工作，必须将经过身份验证的用户序列化到该会话，并在发出后续请求时将其反序列化
// 只需序列化用户ID，然后在反序列化时按ID查找用户，存 session
// 序列化
passport.serializeUser(function (user, done) {
    done(null, user)
})

// 反序列化
passport.deserializeUser(function (user, done) {
    return done(null, user)
})

export default passport