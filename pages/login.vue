<template>
    <div class="page-login">
        <div class="login-header">
            <a
                href="/"
                class="logo"/>
        </div>
        <div class="login-panel">
            <div class="banner">
                <img
                src="//s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg"
                width="480"
                height="370"
                alt="美团网">
            </div>
            <div class="form">
                <h4
                v-if="error"
                class="tips"><i/>{{ error }}</h4>
                <p><span>账号登录</span></p>
                <el-input
                v-model="username"
                prefix-icon="profile"/>
                <el-input
                v-model="password"
                prefix-icon="password"
                type="password"/>
                <div class="foot">
                <el-checkbox v-model="checked">7天内自动登录</el-checkbox>
                <b>忘记密码？</b>
                </div>
                <el-button
                class="btn-login"
                type="success"
                size="mini"
                >登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

export default {
    layout: 'blank',
    data () {
        return {
            username: '',
            password: '',
            checked: '',
            error: ''
        }
    },
    methods: {
        login () {
            let self = this
            // 发送登录的数据请求
            self.$axios.post('/users/signin', {
                // encodeURIComponent() 可把字符串作为 URI 组件进行编码
                username: window.encodeURIComponent(self.username),
                password: CryptoJS.MD5(self.password).toString()
            }).then(({status, data}) => {
                if (status === 200) { // 接口响应成功
                    if (data && data.code === 0) {
                        location.href = '/'
                    } else {
                        self.error = data.msg
                    }
                } else { // 接口响应失败
                    self.error = `服务器出错`
                }
                setTimeout(function() {
                    self.error = ''
                }, 1500)
            })
        }
    }
}
</script>

<style lang="scss">
    @import "@/assets/css/login/index.scss";
</style>
