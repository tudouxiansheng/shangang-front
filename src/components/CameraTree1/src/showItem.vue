<template>
    <div>
        <div class="selectItem">
            <div class="selectItem-label">
                <template v-if="data.showType == 'camera'">
                    <i
                        v-if="data.payload.ptzType == 1"
                        class="aci-camera-gun"
                        :class="data.payload.status == 0 ? 'iconCss2' : 'iconCss'"
                    ></i>
                    <i
                        v-if="data.payload.ptzType == 2"
                        class="aci-camera-ptz"
                        :class="data.payload.status == 0 ? 'iconCss2' : 'iconCss'"
                    ></i>
                    <i
                        v-if="data.payload.ptzType == 3"
                        class="aci-camera-ball"
                        :class="data.payload.status == 0 ? 'iconCss2' : 'iconCss'"
                    ></i>
                    <i
                        v-if="data.payload.ptzType == 4"
                        class="aci-camera-hemisphere"
                        :class="data.payload.status == 0 ? 'iconCss2' : 'iconCss'"
                    ></i>
                    <i
                        v-if="data.payload.ptzType == 5"
                        class="aci-camera-collect"
                        :class="data.payload.status == 0 ? 'iconCss2' : 'iconCss'"
                    ></i>
                </template>
                <span :title="data.label">{{ data.label }}</span>
            </div>
            <div class="selectItem-del" @click="removeSel(data.id)" v-if="showClose">
                <el-icon class="el-icon-close"></el-icon>
            </div>
        </div>
        <template v-if="data.children">
            <!-- 引用自身实现递归 -->
            <showItem
                v-for="(it, index) in data.children"
                :key="index"
                :data="it"
                @removeSel="removeSel"
                :showClose="showClose"
            ></showItem>
        </template>
    </div>
</template>

<script>
export default {
    name: 'showItem',
    props: {
        data: {
            type: Object,
        },
        showClose: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        removeSel(id) {
            this.$emit('removeSel', id)
        },
    },
}
</script>

<style lang="scss" scoped>
.selectItem {
    display: flex;
    justify-content: space-between;
    height: 30px;
    line-height: 30px;
    &-del {
        cursor: pointer;
    }
    &-label {
        width: 90%;
        display: flex;
        i {
            width: 20px;
            display: inline-block;
            vertical-align: text-bottom;
        }
        span {
            display: inline-block;
            width: calc(100% - 25px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
