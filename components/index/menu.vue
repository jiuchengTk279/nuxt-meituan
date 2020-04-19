<template>
    <div class="m-menu">
        <!-- 左边导航 -->
        <dl class="nav" @mouseleave="mouseleave">
            <dt>全部分类</dt>
            <dd v-for="(item, index) in menu" :key="index" @mouseenter="mouseenter">
                <i :class="item.type" />{{ item.name }}<span class="arrow"></span>
            </dd>
        </dl>
        <!-- 右边详情 -->
        <div class="detail" v-if="kind" @mouseenter="sover" @mouseleave="sout">
            <template v-for="(item, index) in curdetail.child">
                <h4 :key="index">{{ item.title }}</h4>
                <span v-for="v in item.child" :key="v">{{ v }}</span>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 类型
            kind: '',
            // 菜单数据
            menu: [
                {
                    type: 'food',
                    name: '美食',
                    child: [
                        {
                            title: '美食',
                            child: ['代金卷', '甜品饮品', '火锅', '自助餐', '小吃快餐']
                        }
                    ]
                },
                {
                    type: 'takeout',
                    name: '外卖',
                    child: [
                        {
                            title: '外卖',
                            child: ['美团外卖']
                        }
                    ]
                },
                {
                    type: 'hotel',
                    name: '酒店',
                    child: [
                        {
                            title: '酒店星级',
                            child: ['经济型', '舒适/三星', '高档/四星', '豪华/五星']
                        }
                    ]
                }
            ]
        }
    },
    computed: {
        curdetail () {
            return this.menu.filter((item) => item.type===this.kind)[0]
        }
    },
    methods: {
        mouseleave () {
            let self = this
            self._timer =  setTimeout(function () {
                self.kind = ''
            }, 150)
        },
        mouseenter (e) {
            this.kind = e.target.querySelector('i').className
        },
        sover () {
            clearTimeout(this._timer)
        },
        sout () {
            this.kind = ''
        }
    }
}
</script>

<style scoped>

</style>