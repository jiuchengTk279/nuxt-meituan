<template>
    <dic class=""></dic>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

export default {
    layout: 'blank',
    // 利用中间件实现退出的功能
    middleware: async (ctx) => {
        let {status, data} = await ctx.$axios.get('/users/exit')
        if (status === 200 && data && data.code === 0) {
            window.location.href = '/'
        }
    }
}
</script>

<style scoped>

</style>
