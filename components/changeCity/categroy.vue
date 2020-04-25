<template>
    <div class="">
        <dl class="m-categroy">
            <dt>按拼音首字母选择：</dt>
            <dd v-for="item in list" :key="item">
                <!-- 做哈希跳转 -->
                <a :href="'#city-'+item">{{ item }}</a>
            </dd>
        </dl>
        <dl v-for="item in block" :key="item.title" class="m-categroy-section">
            <!-- 字母 -->
            <dt :id="'city-'+item.title">{{ item.title }}</dt>
            <!-- 字母对应的城市数据 -->
            <dd>
                <span v-for="c in item.city" :key="c">{{ c }}</span>
            </dd>
        </dl>
    </div>
</template>

<script>
import pyjs from 'js-pinyin'

export default {
    data () {
        return {
            list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            block: []
        }
    },
    async mounted () {
        let self = this
        let blocks = []
        let {status, data: {city}} = await self.$axios.get('/geo/city')
        if (status === 200) {
            let p
            let c
            // 保存每个字母对应的城市数据数组
            let d = {}
            city.forEach(item => {
                // pyjs.getFullChars 可以获取字符串的全部拼音，  toLocaleLowerCase() 是将字符串转换为小写
                p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
                // charCodeAt 可以返回字符对应的 ASCII 编码
                c = p.charCodeAt(0)
                if (c>96 && c<123) { // 只取小写的 a-z
                    if (!d[p]) {
                        d[p] = []
                    }
                    d[p].push(item.name)
                }
            })
            // Object.entries()方法返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 for...in 循环遍历该对象时返回的顺序一致
            for (let [k,v] of Object.entries(d)) {
                blocks.push({
                    // toUpperCase() 将字母转换为大写
                    title: k.toUpperCase(),
                    city: v
                })
            }
            blocks.sort((a,b) => a.title.charCodeAt(0) -b.title.charCodeAt(0))
            self.block = blocks
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/css/changeCity/categroy.scss';
</style>