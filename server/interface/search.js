import Router from 'koa-router'
import axios from './untils/axios'
import Poi from '../dbs/models/poi'

let router = new Router({
    prefix: '/geo'
})

const sign = 'abcd'

// 搜索框搜索内容的接口
router.get('/top', async (ctx) => {
    let {status, data: {top}} = await axios.get(`http://cp-tools.cn/search/top`, {
        params: {
            input: ctx.query.input,
            city: ctx.query.city,
            // sign
        }
    })
    ctx.body = {
        top: status === 200 ? top: []
    }
})

// 搜索框热门城市的内容
router.get('/hotPlace', async (ctx) => {
    let city = ctx.store ? ctx.store.geo.position.city : city.query.city
    let {status, data: {result}} = await axios.get(`http://cp-tools.cn/search/hotPlace`, {
        params: {
            city,
            // sign
        }
    })
    ctx.body = {
        result: status === 200 ? result : []
    }
})

// 从导航关键字获取底部显示的数据
router.get('/resultsByKeywords', async (ctx) => {
    const {city, keyword} = ctx.query
    let {status, data: {count, pois}} = await axios.get(`http://cp-tools.cn/search/resultsByKeywords`, {
        params: {
            city, 
            keyword
        }
    })
    ctx.body = {
        count: status === 200 ? count : 0,
        pois: status === 200 ? pois : []
    }
})


export default router

