<template>
    <el-row class="m-header">
        <el-col :span="4">
            <geo />
        </el-col>
        <el-col :span="6">
            <user />
        </el-col>
        <el-col :span="14">
            <navbar />
        </el-col>
    </el-row>
</template>

<script>
import Geo from './geo.vue'
import User from './user.vue'
import Navbar from './nav.vue'

export default {
    name: 'myHeader',
    components: {
        Geo,
        User,
        Navbar
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/css/public/header/index.scss';
    // @import '@/assets/css/public/header.scss';
    @import '@/assets/css/public/layout.scss';
</style>