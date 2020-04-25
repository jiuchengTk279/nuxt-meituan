import axios from 'axios'

const instance = axios.create({
    // 基础路径，判断开发环境
    baseURL: `http://${process.env.HOST||'localhost'}:${process.env.POST||3000}`,
    // 超时时间
    timeout: 3000,
    // 头部区域
    headers: {

    }
})

export default instance
