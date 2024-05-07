<!-- 告警推送规则 -->
<template>
    <cus-dialog
        :title="$t('AlarmPushRule.Title.detailTitle')"
        :visible.sync="show"
        :width="1200"
        :isDetail="true"
        @close="dialogClosed"
        @open="dialogOpen"
    >
        <el-form slot="body" class="addForm" label-position="right" inline label-suffix="：">
            <el-form-item :label="$t('AlarmPushRule.Form.ruleName')">
                {{ ruleName }}
            </el-form-item>
            <el-form-item :label="$t('AlarmPushRule.Form.device')">
                <CameraTree :canModify="false" :repalyIdArr="cameraIdArr"></CameraTree>
            </el-form-item>
            <el-form-item :label="$t('AlarmPushRule.Form.alarmType')">
                <div class="alarmRow flex" v-for="item in alarmData" :key="item.key">
                    <div class="alarmRow-item1">{{ setGroup(item.key) }}</div>
                    <div class="alarmRow-item2">
                        <span v-for="val in item.value" :key="val.label">
                            {{ locale == 'en' ? val.alarmEnName : val.alarmName }}
                        </span>
                    </div>
                </div>
            </el-form-item>
            <el-form-item :label="$t('AlarmPushRule.Form.recipient')">
                <div class="flex">
                    <div class="user-type" v-if="userType == 1">
                        {{ $t('AlarmPushRule.Title.byRole') }}
                    </div>
                    <div class="user-type" v-else>
                        {{ $t('AlarmPushRule.Title.byUser') }}
                    </div>
                </div>
                <div class="role-box" v-if="userType == 1">
                    <div v-for="item in rolesData" :key="item.roleId">{{ item.roleName }}</div>
                </div>
                <div v-else>
                    <UserTree :canModify="false" :repalyIdArr="userIdArr"></UserTree>
                </div>
            </el-form-item>
            <el-form-item :label="$t('AlarmPushRule.Form.receiveTime')">
                <div class="flex timeType" v-if="timeType == 1">
                    <div class="type">{{ $t('AlarmPushRule.Form.allDay') }}</div>
                    <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip1') }}</div>
                </div>
                <div class="flex timeType" v-if="timeType == 2">
                    <div class="type">{{ $t('AlarmPushRule.Form.workDay') }}</div>
                    <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip2') }}</div>
                </div>
                <div class="flex timeType" v-if="timeType == 3">
                    <div class="type">{{ $t('AlarmPushRule.Form.weekend') }}</div>
                    <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip3') }}</div>
                </div>
                <div class="flex timeType" v-if="timeType == 4">
                    <div class="type">{{ $t('AlarmPushRule.Form.custom') }}</div>
                    <div class="tips">{{ $t('AlarmPushRule.Tips.timeTip4') }}</div>
                </div>
                <!-- 网格时间选择控件 -->
                <time-grid-control
                    v-show="timeType === 4"
                    ref="timeGridControl"
                    id="time_grid_control1"
                ></time-grid-control>
            </el-form-item>
        </el-form>
    </cus-dialog>
</template>

<script>
const CameraTree = () => import('@/components/CameraTree')
const UserTree = () => import('@/components/UserTree')
const timeGridControl = () => import('@/components/time-grid-control.vue')
export default {
    props: {
        infoData: {
            type: Object,
        },
        sceneList: {
            type: Array,
        },
    },
    components: {
        CameraTree,
        UserTree,
        timeGridControl,
    },
    data() {
        return {
            show: false,
            ruleName: '',
            alarmData: [],
            alarmList: [],
            rolesData: [],
            userType: '',
            cameraIdArr: [], //回显的摄像机
            userIdArr: [], //回显的用户
            timeType: 1,
        }
    },
    methods: {
        dialogOpen() {
            this.$nextTick().then(() => {
                this.ruleName = this.infoData.ruleName
                this.setAlarmType(this.infoData.alarmTypes)
                let actionParam = JSON.parse(this.infoData.actionParam)
                this.cameraIdArr = actionParam.cameraList.map((id) => {
                    return {
                        type: 2,
                        id,
                    }
                })
                this.cameraIdArr = this.cameraIdArr.concat(
                    actionParam.areaList.map((id) => {
                        return {
                            type: 1,
                            id,
                        }
                    })
                )
                if (actionParam.roleList) {
                    this.userType = '1'
                    this.replayRoles(actionParam.roleList)
                }
                if (actionParam.userList) {
                    this.userType = '2'
                    this.userIdArr = actionParam.orgList.map((id) => {
                        return {
                            type: 1,
                            id,
                        }
                    })
                    this.userIdArr = this.userIdArr.concat(
                        actionParam.userList.map((id) => {
                            return {
                                type: 2,
                                id,
                            }
                        })
                    )
                }
                if (actionParam.timeList) {
                    this.timeType = actionParam.timeList[0]?.type
                    if (this.timeType == 4) {
                        let periodList = actionParam.timeList[0]?.periodList
                        let planType = periodList[0].dayType == 0 ? 1 : 0
                        this.$refs.timeGridControl.time_initialize(planType, 1, periodList)
                    }
                } else {
                    this.timeType = 1
                }
            })
        },
        dialogClosed() {
            this.show = false
            this.rolesData = []
            this.alarmData = []
            this.cameraIds = []
        },
        // 设置告警类型还原
        async setAlarmType(types) {
            if (!this.alarmList.length) {
                let res = await this.$api.getAlarmTypes({
                    pageInfo: {
                        pageNum: 1,
                    },
                })
                if (res.resultCode == 0) this.alarmList = res.alarmTypeList
            }
            let obj = {}
            this.alarmList.forEach((al) => {
                if (types.includes(al.alarmType)) {
                    if (!obj[al.scene]) obj[al.scene] = []
                    obj[al.scene].push(al)
                }
            })
            this.alarmData = Object.keys(obj).map((k) => {
                return {
                    key: k,
                    value: obj[k],
                }
            })
        },
        // 还原角色
        replayRoles(ids) {
            this.$api
                .selectRoles({
                    pageInfo: {
                        pageNum: 1,
                        pageSize: 500,
                    },
                    menuId: '20400',
                })
                .then((res) => {
                    if (res.resultCode == 0) {
                        if (res.roleList && res.roleList.length) {
                            this.rolesData = res.roleList.filter((role) => ids.includes(role.roleId))
                        }
                    }
                })
        },
        setGroup(val) {
            return this.sceneList.find((a) => a.value == val)?.name
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
.alarmRow {
    width: 100%;
    border: 1px solid #156c9e;
    background: #134b71;
    &-item1 {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30%;
        border-right: 1px solid #156c9e;
    }
    &-item2 {
        padding: 10px 20px;
        width: 70%;
    }
}
.role-box {
    background: #134b71;
    max-height: 300px;
    overflow: auto;
    padding: 20px;
}
.timeType {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background-color: #134b71;
    margin-bottom: 20px;
    .type {
        width: 100px;
    }
}
</style>
