<template>
    <div class="page-register">
        <!-- 头部区域 -->
        <article class="header">
            <header>
                <a href="/" class="site-logo" />
                <span class="login">
                    <em class="bold">已有美团账号？</em>
                    <a href="/login">
                        <el-button type="primary" size="small">登录</el-button>
                    </a>
                </span>
            </header>
        </article>
        <!-- 表单区域 -->
        <section>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                    <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
                    <span class="status">{{ statusMsg }}</span>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="ruleForm.code" maxlength="4"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="ruleForm.pwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="cpwd">
                    <el-input v-model="ruleForm.cpwd" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="register">同意以下协议并注册</el-button>
                    <div class="error">{{ error }}</div>
                </el-form-item>
                <el-form-item>
                    <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
// crypto-js 用于密码加密，MD5的方式
import CryptoJS from 'crypto-js'

Vue.prototype.$axios = axios

export default {
    layout: 'blank',
    data () {
        return {
            // 发送验证码时的状态文字信息
            statusMsg: '',
            // 错误信息
            error: '',
            // 表单对象
            ruleForm: {
                name: '',
                code: '',
                pwd: '',
                cpwd: '',
                email: ''
            },
            // 表单验证对象
            rules: {
                name: [
                    { required: true, type: 'string', message: '请输入昵称', trigger: 'blur'}
                ],
                email: [
                    { required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '创建密码', trigger: 'blur' }
                ],
                cpwd: [
                    { required: true, message: '确认密码', trigger: 'blur'},
                    { validator: (rule, value, callback) => {
                        if (value==='') {
                            callback(new Error('请再次输入密码'))
                        } else if (value!==this.ruleForm.pwd) {
                            callback(new Error('两次输入密码不一致'))
                        } else {
                            callback()
                        }
                    }, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        // 发送验证码事件
        sendMsg () {
            const self = this
            let namePass
            let emailPass
            // timerid 作为倒计时的计时器
            if (self.timerid) {
                return false
            }
            // 对表单中的 name 值进行预校验
            this.$refs.ruleForm.validateField('name', (valid) => { // valid 默认 校验失败
                namePass = valid
            })
            self.statusMsg = ''
            if (namePass) { // 校验失败
                return false
            }
            // 对表单中的 email 值进行预校验
            this.$refs.ruleForm.validateField('email', (valid) => { // 校验失败
                emailPass = valid
            })
            if (!namePass && !emailPass) {
                // 发送获取验证码的请求
                self.$axios.post('/users/verify', {
                    //  encodeURIComponent() 可把字符串作为 URI 组件进行编码
                    username: encodeURIComponent(self.ruleForm.name),
                    email: self.ruleForm.email
                }).then(({status, data}) => {
                    if (status === 200 && data && data.code === 0) { // 响应正确，有数据，请求成功
                        let count = 60
                        self.statusMsg =   `验证码已发送，剩余${count--}秒`
                        // 设置定时器，进行倒计时
                        self.timerid = setInterval(function() {
                            self.statusMsg = `验证码已发送，剩余${count--}秒`
                            // 剩余时间为0的时候，清除定时器
                            if (count === 0) {
                                clearInterval(self.timerid)
                            }
                        }, 1000)
                    } else { // 响应失败，数据获取失败
                        self.statusMsg = data.msg
                    }
                })
            }
        },
        // 点击注册事件
        register () {
            let self = this
            // 进行表单的预校验
            this.$refs.ruleForm.validate((valid) => {
                if (valid) { // 校验通过，发送注册的请求
                    self.$axios.post('/users/signup', {
                        // encodeURIComponent() 可把字符串作为 URI 组件进行编码
                        username: window.encodeURIComponent(self.ruleForm.name),
                        // 对密码值进行 MD5 加密
                        password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
                        email: self.ruleForm.email,
                        code: self.ruleForm.code
                    }).then(({status, data}) => {
                        if (status === 200) { // 接口响应成功，状态码为200
                            if (data && data.code===0) {
                                location.href = '/login'
                            } else {
                                self.error = data.msg
                            }
                        } else { // 接口响应不成功，失败了
                            self.error = `服务器出错，错误码：${status}`
                        }
                        setTimeout(function() {
                            self.error = ''
                        }, 1500)
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/css/register/index.scss'
</style>
