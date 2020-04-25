<template>
    <div class="page-chnageCity">
        <el-row>
            <el-col :span="24">
                <iSelect></iSelect>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <Hot></Hot>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <Categroy></Categroy>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import iSelect from '@/components/changeCity/iselect.vue'
import Hot from '@/components/changeCity/hot.vue'
import Categroy from '@/components/changeCity/categroy.vue'

export default {
    components: {
        iSelect,
        Hot,
        Categroy
    }
}
</script>

<style lang="sass" scoped>

</style>