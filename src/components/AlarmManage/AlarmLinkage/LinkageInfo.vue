<template>
    <cus-dialog
        :title="$t('AlarmLinkage.Title.RuleInfo')"
        :visible="visible"
        @close="dialogClose"
        isDetail
        :width="800"
        @open="dialogOpen"
    >
        <template slot="body">
            <el-form ref="forms" class="addForm long" label-suffix="：" inline>
                <!-- 设备类型 -->
                <el-form-item :label="$t('AlarmLinkage.Form.deviceType')">
                    {{ dataInfo.deviceTypeName }}
                </el-form-item>
                <!-- 告警设备 -->
                <el-form-item :label="$t('AlarmLinkage.Form.alarmDev')">
                    <i v-if="dataInfo.deviceType == 1" :class="classOf(dataInfo.ptzType, 1)"></i>
                    <i v-if="dataInfo.deviceType == 2" class="iconCss aci-lock"></i>
                    {{ dataInfo.deviceName }}
                </el-form-item>
                <!-- 告警类型 -->
                <el-form-item :label="$t('AlarmLinkage.Form.alarmType')">
                    <div class="alarmRow flex" v-for="item in alarmData" :key="item.key">
                        <div class="alarmRow-item1">{{ setGroup(item.key) }}</div>
                        <div class="alarmRow-item2">
                            <span v-for="val in item.value" :key="val.label">
                                {{ locale == 'en' ? val.alarmEnName : val.alarmName }}
                            </span>
                        </div>
                    </div>
                </el-form-item>
                <!-- 联动动作 -->
                <el-form-item :label="$t('AlarmLinkage.Form.action')">
                    <el-row>
                        <el-col :span="8">
                            <div class="action-item mgr">
                                <div class="action-item_header">
                                    {{ $t('AlarmLinkage.Title.actionSeled') }}
                                </div>
                                <div class="action-item_body">
                                    <div
                                        v-for="(item, index) in actionList"
                                        :key="index"
                                        class="list-item"
                                        :class="[actionType == item.value ? 'active' : '']"
                                        @click="actClick(item.value)"
                                    >
                                        {{ item.name }}
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="action-item">
                                <div class="action-item_header">
                                    {{ $t('AlarmLinkage.Title.ruleConfig') }}
                                </div>
                                <div class="action-item_body">
                                    <div class="ruleInfo">
                                        <template v-for="(item, index) in actionList">
                                            <!-- 平台录像 -->
                                            <div v-if="item.value == 1 && actionType == 1" :key="item.value">
                                                <div class="itemwrapper flex">
                                                    <span class="label">录像时长</span>
                                                    {{ ruleInfo[item.value].times }}秒
                                                </div>
                                                <div class="itemwrapper flex">
                                                    <span class="label">摄像机</span>
                                                    <div class="input flex flex-column">
                                                        <div
                                                            v-for="device in ruleInfo[item.value].cameraList"
                                                            :key="device.id"
                                                            class="nameLabel"
                                                            :title="item.label"
                                                        >
                                                            <i :class="classOf(device.ptzType, device.status)"></i>
                                                            {{ device.cameraName }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 实况视频 -->
                                            <div v-if="item.value == 2 && actionType == 2" :key="item.value">
                                                <div class="itemwrapper flex">
                                                    <span class="label">摄像机</span>
                                                    <div class="input flex flex-column">
                                                        <div v-if="ruleInfo[item.value].withOrigin">
                                                            <i :class="classOf(dataInfo.ptzType, 1)"></i>
                                                            {{ dataInfo.deviceName }}
                                                        </div>
                                                        <div
                                                            v-for="device in ruleInfo[item.value].cameraList"
                                                            :key="device.id"
                                                            class="nameLabel"
                                                            :title="item.label"
                                                        >
                                                            <i :class="classOf(device.ptzType, device.status)"></i>
                                                            {{ device.cameraName }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="itemwrapper flex">
                                                    <span class="label">视频恢复</span>
                                                    {{ ruleInfo[item.value].restore == '1' ? '恢复时长' : '永不恢复' }}
                                                    <span v-if="ruleInfo[item.value].restore == '1'"
                                                        >{{ ruleInfo[item.value].restoreTime }}秒</span
                                                    >
                                                </div>
                                            </div>
                                            <!-- 视频上墙 -->
                                            <div v-if="item.value == 3 && actionType == 3" :key="item.value">
                                                <div class="itemwrapper flex">
                                                    <span class="label">摄像机</span>
                                                    <div class="input flex flex-column">
                                                        <div v-if="ruleInfo[item.value].withOrigin">
                                                            <i :class="classOf(dataInfo.ptzType, 1)"></i>
                                                            {{ dataInfo.deviceName }}
                                                        </div>
                                                        <div
                                                            v-for="device in ruleInfo[item.value].cameraList"
                                                            :key="device.id"
                                                            class="nameLabel"
                                                            :title="item.label"
                                                        >
                                                            <i :class="classOf(device.ptzType, device.status)"></i>
                                                            {{ device.cameraName }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="itemwrapper flex">
                                                    <span class="label">电视墙</span>
                                                    {{ ruleInfo[item.value].layoutName }}
                                                </div>
                                                <div class="itemwrapper flex">
                                                    <span class="label">视频恢复</span>
                                                    {{ ruleInfo[item.value].restore == '1' ? '恢复时长' : '永不恢复' }}
                                                    <span v-if="ruleInfo[item.value].restore == '1'"
                                                        >{{ ruleInfo[item.value].restoreTime }}秒</span
                                                    >
                                                </div>
                                            </div>
                                            <!-- 反控设备 -->
                                            <div v-if="item.value == 4 && actionType == 4" :key="item.value">
                                                <div class="itemwrapper flex">
                                                    <span class="label">门禁设备</span>
                                                    <div class="input flex flex-column">
                                                        <div
                                                            v-for="device in ruleInfo[item.value].cameraList"
                                                            :key="device.id"
                                                            class="nameLabel"
                                                            :title="item.label"
                                                        >
                                                            <i class="iconCss aci-lock"></i>
                                                            {{ device.name }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <template>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">门禁操作</span>
                                                        <div class="input flex flex-column">
                                                            {{
                                                                ruleInfo[item.value].optMode == '1'
                                                                    ? '告警确认后操作'
                                                                    : '立即设为常开'
                                                            }}
                                                        </div>
                                                    </div>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">门禁恢复</span>
                                                        <div class="input flex flex-column">
                                                            {{
                                                                ruleInfo[item.value].restore == '1'
                                                                    ? '恢复时长'
                                                                    : '永不恢复'
                                                            }}
                                                            <span v-if="ruleInfo[item.value].restore == '1'"
                                                                >{{ ruleInfo[item.value].restoreTime }}分</span
                                                            >
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                            <!-- 前端喊话 -->
                                            <div v-if="item.value == 5 && actionType == 5" :key="item.value">
                                                <div class="itemwrapper flex">
                                                    <span class="label">喊话文件</span>
                                                    <div class="input flex flex-column">
                                                        <div class="flex flex-align_center">
                                                            <span
                                                                class="fileName"
                                                                :title="ruleInfo[item.value].fileName"
                                                                >{{ ruleInfo[item.value].fileName }}</span
                                                            >
                                                            <el-button type="text" @click="voicePlay">
                                                                {{ $t('AlarmType.Button.play') }}
                                                            </el-button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="itemwrapper flex">
                                                    <span class="label">摄像机</span>
                                                    <div class="input flex flex-column">
                                                        <div v-if="ruleInfo[item.value].withOrigin">
                                                            <i :class="classOf(dataInfo.ptzType, 1)"></i>
                                                            {{ dataInfo.deviceName }}
                                                        </div>
                                                        <div
                                                            v-for="device in ruleInfo[item.value].cameraList"
                                                            :key="device.id"
                                                            class="nameLabel"
                                                            :title="item.label"
                                                        >
                                                            <i :class="classOf(device.ptzType, device.status)"></i>
                                                            {{ device.cameraName }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="itemwrapper flex">
                                                    <span class="label">执行次数</span>
                                                    {{ ruleInfo[item.value].executionsTimes }}
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </template>
    </cus-dialog>
</template>

<script>
export default {
    props: {
        videoType: {
            type: Array,
        },
        visible: {
            type: Boolean,
        },
        dataInfo: {
            type: Object,
        },
        alarmList: {
            type: Array,
        },
        sceneList: {
            type: Array,
        },
    },
    data() {
        return {
            actionType: '',
            alarmData: [],
            actionList: [],
            ruleInfo: {},
        }
    },

    methods: {
        //获取列表
        dialogClose() {
            this.player && this.player.pause()
            this.player = null
            this.actionType = ''
            this.$emit('update:visible', false)
        },
        dialogOpen() {
            this.setAlarmType(this.dataInfo.alarmType)
            let keys = Object.keys(this.dataInfo.linkageAction)
            this.actionList = keys
                .map((t) => {
                    return this.videoType.find((a) => a.value == t)
                })
                .filter((a) => !!a)
            this.actionType = this.actionList[0].value
            keys = this.actionList.map((a) => a.value)
            keys.forEach((key) => {
                this.ruleInfo[key] = {
                    ...this.dataInfo.linkageAction[key],
                }
                if (key == 4) {
                    // 拿门禁
                    this.ruleInfo[key].cameraList = this.ruleInfo[key].idList
                        .map((id) => {
                            let obj = this.dataInfo.iotDeviceInfoList?.find((r) => r.deviceId == id)
                            if (obj) {
                                return {
                                    ...obj,
                                }
                            }
                        })
                        .filter((l) => !!l)
                } else {
                    // 拿摄像机
                    this.ruleInfo[key].cameraList = this.ruleInfo[key].idList
                        .map((id) => {
                            let obj = this.dataInfo.cameraInfoList?.find((r) => r.cameraId == id)
                            if (obj) {
                                return {
                                    ...obj,
                                }
                            }
                        })
                        .filter((l) => !!l)
                }
            })
        },
        // 选择动作回显配置
        actClick(val) {
            this.actionType = val
        },
        // 设置告警类型还原
        setAlarmType(types) {
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
        // 文件播放
        voicePlay() {
            if (this.player) {
                this.player.pause()
                this.player = null
            }
            try {
                if (this.ruleInfo[5].fileUrl) {
                    this.player = new Audio(this.ruleInfo[5].fileUrl)
                    this.player.play() //播放 mp3这个音频对象
                } else {
                    if (this.ruleInfo[5].fileId) {
                        this.$api.getDownloadUrl({ fileId: this.ruleInfo[5].fileId }).then((dow) => {
                            if (dow && dow.resultCode == 0) {
                                this.player = new Audio(dow.downloadUrl)
                                this.player.play() //播放 mp3这个音频对象
                            }
                        })
                    }
                }
            } catch (error) {
                this.$message.warning('播放失败！')
            }
        },
        // 设置告警来源文字
        setGroup(val) {
            return this.sceneList.find((a) => a.value == val)?.name
        },
        // 图标
        classOf(ptzType, status) {
            let cls = 'iconCss2'
            if (status == 1) cls = 'iconCss'
            cls += ' '
            if (ptzType == 1) {
                return cls + 'aci-camera-gun'
            } else if (ptzType == 2) {
                return cls + 'aci-camera-ptz'
            } else if (ptzType == 3) {
                return cls + 'aci-camera-ball'
            } else if (ptzType == 4) {
                return cls + 'aci-camera-hemisphere'
            } else if (ptzType == 5) {
                return cls + 'aci-camera-collect'
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.el-form-item {
    width: 100%;
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
.action {
    &-item {
        background: #134b71;
        height: 380px;
        &.mgr {
            margin-right: 20px;
        }
        &_header {
            text-align: center;
            border-bottom: 1px solid #156c9e;
            height: 40px;
            line-height: 40px;
        }
        &_body {
            height: calc(100% - 40px);
            overflow: auto;
            .list-item {
                cursor: pointer;
                padding: 0 20px;
                margin: 10px 0;
                position: relative;
                &.active {
                    background: #156c9e;
                }
            }
            .ruleInfo {
                padding: 10px;
                .itemwrapper {
                    margin-bottom: 10px;
                    width: 100%;
                    .label {
                        // width: fit-content;
                        width: 100px;
                        text-align: right;
                        &::before {
                            content: '* ';
                            color: #e45151;
                            vertical-align: middle;
                        }
                        &::after {
                            content: '：';
                        }
                    }
                    .label2 {
                        width: 100px;
                        text-align: right;
                        &::after {
                            content: '：';
                        }
                    }
                    ::v-deep .input {
                        width: 70%;
                        .el-input__inner {
                            border-color: #ccc;
                        }
                        .choose {
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            padding: 0 10px;
                            background: #365a88;
                            cursor: pointer;
                            &:hover {
                                background: #2162b6;
                            }
                        }
                        .name {
                            text-indent: 20px;
                        }
                        .nameLabel {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                        }
                    }

                    .fileName {
                        max-width: 50%;
                        display: inline-block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        margin-right: 10px;
                        margin-right: 10px;
                    }
                }

                ::v-deep .el-form-item {
                    .el-form-item__label {
                        width: 120px !important;
                        text-align: left;
                    }
                    .el-form-item__content {
                        width: calc(100% - 120px) !important;
                    }
                }
                .name {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>
