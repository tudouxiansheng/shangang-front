<template>
    <el-table
        :row-class-name="rowClass || tableRowClassName"
        :data="dataList"
        @selection-change="handleSelectionChange"
        @row-contextmenu="rowContextmenu"
        class="cus-table"
        ref="cusTable"
        :max-height="max"
        :class="showCheck ? 'cus-table2' : ''"
        :element-loading-text="$t('public.loading')"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
        v-loading="loading"
        border
    >
        <slot name="index">
            <el-table-column :label="$t('public.order')" type="index" :show-overflow-tooltip="true" :width="indexWidth">
                <template slot-scope="{ $index }">
                    {{ pageSize * (pageNum - 1) + $index + 1 }}
                </template>
            </el-table-column>
            <el-table-column :width="selWidth" type="selection" v-if="showCheck"></el-table-column>
        </slot>
        <!-- :width="computeRem(item.width)" -->
        <el-table-column
            v-for="item in column"
            :key="item.prop"
            :prop="item.prop"
            :label="$t(item.label)"
            show-overflow-tooltip
        >
            <template slot-scope="scope">
                <!-- 通过类名设置字体 -->
                <template v-if="item.fontClass">
                    <span :class="item.fontClass[scope.row[item.prop]]">
                        {{ (item.format && item.format(scope.row[item.prop], scope.row)) || scope.row[item.prop] }}
                    </span>
                </template>
                <!-- 操作按钮+字体显示 -->
                <template v-else-if="item.optionColumn">
                    <slot name="operateColumn" :row="scope.row"></slot>
                </template>
                <!-- 点击操作 -->
                <template v-else-if="item.clickColumn">
                    <slot name="clickColumn" :row="scope.row"></slot>
                </template>
                <!-- 通过颜色值设置字体 -->
                <template v-else>
                    <span :style="item.fontColor ? 'color:' + item.fontColor(scope.row[item.prop]) : ''">
                        {{ (item.format && item.format(scope.row[item.prop], scope.row)) || scope.row[item.prop] }}
                    </span>
                </template>
            </template>
        </el-table-column>
        <el-table-column :label="$t('public.operating')" :min-width="operateWidth" v-if="isOperating">
            <template slot-scope="scope">
                <slot name="operate" :row="scope.row"></slot>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    props: {
        column: {
            type: Array,
        },
        dataList: {
            type: Array,
        },
        maxHeight: {
            type: Number,
        },
        rowClass: {
            type: Function,
        },
        showCheck: {
            type: Boolean,
            default: false,
        },
        operateWidth: {
            type: Number,
            default: 120,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        pageNum: {
            type: Number,
        },
        pageSize: {
            type: Number,
        },
        // 是否展示操作列
        isOperating: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            max: 0,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.max = this.maxHeight || 600
        })
    },
    computed: {
        indexWidth: function () {
            let rem = window.innerWidth / 1920
            if (rem < 1) return 80
            return 80 * rem
        },
        selWidth: function () {
            let rem = window.innerWidth / 1920
            if (rem < 1) return 50
            return 50 * rem
        },
    },
    methods: {
        // 表格斑马纹
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 == 1) {
                return ''
            } else {
                return 'success-row'
            }
        },
        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val)
        },
        rowContextmenu(row, column, event) {
            this.$emit('rowContextmenu', row, column, event)
        },
        // computeRem(width) {
        //   if (!width) return
        //   if (isNaN(Number(width))) return
        //   let rem = window.innerWidth / 1920
        //   let n = Number(width)
        //   return width * rem
        // }
    },
}
</script>

<style lang="scss" scoped>
.cus-table {
    height: calc(100% - 50px);
    &.cus-table2 {
        ::v-deep tr {
            > :first-child {
                border-right: none !important;
            }
        }
    }
}
</style>
