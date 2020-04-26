import Router from 'koa-router'
import axios from './untils/axios'
import Province from '../dbs/models/province'

let router = new Router({
    prefix: '/categroy'
})

const sign = 'abcd'

router.get('/crumbs', async (ctx) => {
    let {status, data: {areas, types}} = await axios.get('http://cp-tools.cn/categroy/crumbs', {
        params: {
            city: ctx.query.city.replace('市','') || "北京",
            // sign
        }
    })
    ctx.body = {
        areas: status === 200 ? areas : [],
        types: status === 200 ? types : []
    }
})

export default router;