<template>
    <div class="search-panel">
        <el-row class="m-header-searchbar">
            <el-col :span="3" class="left">
                <img
                    src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
                    alt="美团">
            </el-col>
            <el-col :span="15" class="center">
                <div class="wrapper">
                    <el-input placeholder="搜索商家或地点" v-model="search" @focus="focus" @blur="blur" @input="input"></el-input>
                    <button class="el-button el-button--primary"><i class="el-icon-search" /></button>
                    <dl class="hotPlace" v-if="isHotPlace">
                        <dt>热门搜索</dt>
                        <dd v-for="(item,index) in hotPlace" :key="index">{{ item }}</dd>
                    </dl>
                    <div class="searchList" v-if="isSearchList">
                        <dd v-for="(item,index) in searchList" :key="index">{{ item }}</dd>
                    </div>
                </div>
                <p class="suggset">
                    <a href="#">故宫博物馆</a>
                    <a href="#">故宫博物馆</a>
                    <a href="#">故宫博物馆</a>
                </p>
                <ul class="nav">
                    <li><nuxt-link to="/" class="takeout">美团外卖</nuxt-link></li>
                    <li><nuxt-link to="/" class="movie">猫眼电影</nuxt-link></li>
                    <li><nuxt-link to="/" class="hotel">美团酒店</nuxt-link></li>
                    <li><nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link></li>
                    <li><nuxt-link to="/" class="business">商家入驻</nuxt-link></li>
                </ul>
            </el-col>
            <el-col :span="6" class="right">
                <ul class="security">
                    <li><i class="refund" /><p class="txt">随时退</p></li>
                    <li><i class="single" /><p class="txt">不满意免单</p></li>
                    <li><i class="overdue" /><p class="txt">过期退</p></li>
                </ul>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 搜索输入框的内容
            search: '',
            // 输入框聚焦状态
            isFocus: false,
            // 热门搜索
            hotPlace: ['火锅', '火锅', '火锅'],
            // 推荐搜索
            searchList: ['故宫', '故宫', '故宫']
        }
    },
    computed: {
        // 热门搜索
        isHotPlace () {
            return this.isFocus&&!this.search
        },
        // 推荐列表
        isSearchList () {
            return this.isFocus&&this.search
        }
    },
    methods: {
        // 输入框聚焦事件
        focus () {
            this.isFocus = true
        },
        // 输入框失焦事件
        blur () {
            // 延时
            let self = this
            setTimeout(function () {
                self.isFocus = false
            }, 200)
        },
        // 输入事件
        input () {
            console.log('input')
        }
    }
}
</script>

<style lang="scss" scoped>

</style>