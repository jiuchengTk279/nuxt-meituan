<template>
    <div class="m-crumbs">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path: '/'}">{{ $store.state.geo.position.city.replace('市', '')}}美团</el-breadcrumb-item>
            <el-breadcrumb-item>
                <!-- decodeURIComponent(keyword) 是关键字，城市对应的信息 -->
                <a href="/">{{ $store.state.geo.position.city.replace('市', '')}} {{ decodeURIComponent(keyword) }}</a>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    props: {
        keyword: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>

</style>