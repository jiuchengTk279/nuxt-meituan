import Router from 'koa-router';
import axios from './utils/axios'
import Cart from '../dbs/models/cart'
import md5 from 'crypto-js/md5'

let router = new Router({prefix: '/cart'})

// 创建购物车的接口
router.post('/create', async ctx => {
    // 未登录状态
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            code: -1,
            msg: 'please login'
        }
    } else {
        let time = Date()
        let cartNo = md5(Math.random()*1000 + time).toString()
        let {params: {id, detail}} = ctx.request.body
        let cart = new Cart({
            id,
            cartNo,
            time,
            user: ctx.session.passport.user,
            detail
        })
        // 保存购物车数据
        let result = await cart.save()
        if (result) {
            ctx.body = {
                code: 0,
                msg: '',
                id: cartNo
            }
        } else {
            ctx.body = {
                code: -1,
                msg: 'fail'
            }
        }
    }
})


// 获取购物车， 通过购物车产品的id作为两个之间的关联 cartNo 
router.post('/getCart', async ctx => {
    let {id} = ctx.request.body
    // 做异常的处理
    try {
        let result = await Cart.findOne({cartNo: id})
        ctx.body = {
            code: 0,
            data: result ? result.detail[0] : {}
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: {}
        }
    }
})

export default router