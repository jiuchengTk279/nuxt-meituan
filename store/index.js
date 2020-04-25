import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import geo from './modules/geo'
import home from './modules/home'

Vue.prototype.$axios = axios

Vue.use(Vuex)

const store = () => new Vuex.Store({
    modules: { geo, home },
    actions: {
        //  nuxtServerInit 浏览器进来的请求
        // async nuxtServerInit({commit}, {req, app}) {
        //     // 1. 获取城市定位信息
        //     const {status, data: {province, city}} = await app.$axios.get('/geo/getPosition')
        //     // 客户端做检查,提交 action 
        //     commit('geo/getPosition', status === 200 ? {city, province} : {city: '', province: ''})
        //     // 2. 获取菜单数据的信息
        //     const {status:status2, data: {menu}} = await app.$axios.get('/geo/menu')
        //     commit('home/setMenu', status2 = 200 ? menu: [])
        // }
    }
})

export default store