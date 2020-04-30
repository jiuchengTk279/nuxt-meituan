import Router from 'koa-router'
import axios from './untils/axios'
import Cart from '../dbs/models/cart'
import Cart from '../dbs/models/order'
import md5 from 'crypto-js/md5'

let router = new Router({prefix: '/order'})

// 创建订单的接口
router.post('/createOrder', async ctx => {
    let {id, price, count} = ctx.request.body
    let time = Date()
    let orderID = md5(Math.random() * 1000 + time).toString()
    // 判断是否是登录状态
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            code: -1,
            msg: 'please login'
        }
    } else {
        let findCart = await Cart.findOne({cartNo: id})
        let order = new order({
            id: orderID,
            count,
            total: price*count,
            time,
            user: ctx.session.passport.user,
            name: findCart.detail[0].name,
            imgs: findCart.detail[0].imgs,
            status: 0 // 0 表示待付款状态
        })
        // 保存订单数据，写库
        try {
            let result = await order.save()
            if (result) { // 有数据
                await findCart.remove()
                ctx.body = {
                    code: 0,
                    id: orderID
                }
            } else { // 无数据
                ctx.body = {
                    code: -1
                }
            }
        } catch (e) {
            ctx.body = {
                code: -1
            }
        }
    }
})


// 获取订单的接口
router.post('/getOrders', async ctx => {
    // 判断是否登录状态
    if (!ctx.isAuthenticated()) { // 未登录
        ctx.body = {
            code: -1,
            list: [],
            msg: 'please login'
        }
    } else { // 已登录
        // 查询订单数据
        try {
            let result = await Order.find()
            if (result) { // 查询有结果
                ctx.body = {
                    code: 0,
                    list: result
                }
            } else { // 查询无结果
                ctx.body = {
                    code: -1,
                    list: []
                }
            }
        } catch (e) { // 异常结果
            ctx.body = {
                code: -1,
                list: []
            }
        }
    }
})


export default router