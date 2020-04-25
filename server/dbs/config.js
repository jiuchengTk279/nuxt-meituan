export default {
    dbs: 'mongodb://127.0.0.1:27017/student',
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port() {
            return 6379
        }
    },
    smtp: {
        get host() {
            return 'smtp.qq.com'
        },
        get user() {
            return '1613094606@qq.com'
        },
        get pass() {
            return 'yileopgqrcikfceh'
        },
        // 返回 code 编码
        get code() {
            return () => {
                // 转换16进制，大写，四位数随机验证码
                return Math.random().toString(16).slice(2,6).toUpperCase()
            }
        },
        // 过期时间
        get expire() {
            return () => {
                // 有效时间一分钟
                return new Date().getTime()+60*60*1000
            }
        }
    }
    
}