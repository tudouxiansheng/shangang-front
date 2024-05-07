<!-- 告警详情 -->
<template>
    <cus-dialog
        :title="$t('AlarmType.Title.TheAlarmTypeInfo')"
        :visible.sync="$parent.alarmTypeDetailVisible"
        @close="dialogClosed"
        @open="dialogOpen"
        :width="600"
        :isDetail="true"
    >
        <template slot="body">
            <el-form ref="form" :model="form" class="addForm" label-suffix="：" inline label-position="right">
                <el-form-item :label="$t('AlarmType.Table.alarmTypeName')">
                    <span>
                        {{ locale == 'en' ? $parent.dataForm.alarmEnName : $parent.dataForm.alarmName }}
                    </span>
                </el-form-item>
                <el-form-item :label="$t('AlarmType.Table.alarmType')">
                    <p v-for="(item, index) in form.alarmGroups" :key="index">
                        <span>{{ setAlarmGroup(item) }}</span>
                    </p>
                </el-form-item>
                <el-form-item :label="$t('AlarmType.Table.alarmLevel')">
                    <span :style="'color:' + setAlarmLevel(form.alarmLevel).color">
                        {{ setAlarmLevel(form.alarmLevel).value }}
                    </span>
                </el-form-item>
            </el-form>
        </template>
    </cus-dialog>
</template>

<script>
export default {
    data() {
        return {
            form: {},
        }
    },

    methods: {
        dialogOpen() {
            this.$nextTick(() => {
                this.form = this.$parent.dataForm
                this.form.alarmGroups = this.form.alarmGroup.split(',')
            })
        },

        dialogClosed() {
            this.$parent.alarmTypeDetailVisible = false
            this.$parent.dataForm = {}
        },
        setAlarmGroup(val) {
            return this.$parent.alarmSource.find((item) => item.groupCode == val)?.groupName
        },

        setAlarmLevel(val) {
            let data = { value: '', color: '' }
            this.$parent.alarmLevelList.forEach((element) => {
                if (val == element.alarmLevelId) {
                    data.value = element.alarmLevelName
                    data.color = element.color
                }
            })
            return data
        },
    },
}
</script>
<style lang="scss" scoped>
::v-deep .el-form {
    .el-form-item {
        width: 100%;
    }
}
</style>
