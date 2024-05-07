<template>
    <div>
        <cus-dialog
            :title="operation === 0 ? $t('AlarmLinkage.Title.addRule') : $t('AlarmLinkage.Title.editRule')"
            :visible="visible"
            @close="dialogClose"
            @open="dialogOpen"
            @submit="submitForm"
            :submitLoading="loading"
            :width="1200"
        >
            <template slot="body">
                <el-steps :active="stepIndex" align-center finish-status="success">
                    <el-step :title="$t('AlarmLinkage.Title.addDevice')"></el-step>
                    <el-step :title="$t('AlarmLinkage.Title.addType')"></el-step>
                    <el-step :title="$t('AlarmLinkage.Title.addLinkage')"></el-step>
                    <el-step :title="$t('AlarmLinkage.Title.complete')"></el-step>
                </el-steps>
                <el-form ref="forms" class="addForm long" label-suffix="：" inline :model="formData" :rules="formRule">
                    <div v-show="stepIndex == 0">
                        <!-- 设备类型 -->
                        <el-form-item :label="$t('AlarmLinkage.Form.deviceType')" prop="deviceType">
                            <el-select v-model="formData.deviceType" @change="deviceChg" :disabled="operation === 1">
                                <el-option
                                    v-for="item in deviceType"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 告警设备 -->
                        <el-form-item :label="$t('AlarmLinkage.Form.alarmDev')" prop="deviceId">
                            <CameraTree
                                key="1"
                                v-show="formData.deviceType == 1"
                                canModify
                                :repalyIdArr="deviceIds"
                                ref="cameraT"
                                @nodeCheck="nodeCheck"
                                :dataOption="{ dataType: 'camera', single: true, strictly: true }"
                            ></CameraTree>
                            <IotDeviceTree
                                key="2"
                                v-show="formData.deviceType == 2"
                                :repalyIdArr="deviceIds2"
                                ref="accessT"
                                @nodeCheck="nodeCheck"
                                module="1"
                                canModify
                                :dataOption="{ dataType: 'device', single: true, strictly: true }"
                            >
                            </IotDeviceTree>
                            <IotDeviceTree
                                key="3"
                                v-show="formData.deviceType == 3"
                                ref="barrierT"
                                @nodeCheck="nodeCheck"
                                :repalyIdArr="deviceIds3"
                                module="2"
                                canModify
                                :dataOption="{ dataType: 'device', single: true, strictly: true }"
                            >
                            </IotDeviceTree>
                        </el-form-item>
                    </div>
                    <div v-show="stepIndex == 1">
                        <!-- 选择告警类型 -->
                        <el-form-item :label="$t('AlarmLinkage.Title.addType')" prop="alarmType">
                            <div class="alarmRow flex" v-for="item in alarmData" :key="item.key">
                                <div class="alarmRow-item1">{{ setGroup(item.key) }}</div>
                                <div class="alarmRow-item2">
                                    <el-checkbox-group v-model="formData.alarmType">
                                        <el-checkbox
                                            v-for="val in item.value"
                                            :label="val.alarmType"
                                            :key="val.label"
                                            :disabled="disableAlarmType.includes(val.alarmType)"
                                        >
                                            {{ locale == 'en' ? val.alarmEnName : val.alarmName }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                    <div v-show="stepIndex == 2">
                        <!-- 联动动作 -->
                        <el-form-item :label="$t('AlarmLinkage.Form.action')" prop="linkageAction">
                            <el-row>
                                <!-- 选择动作 -->
                                <el-col :span="6">
                                    <div class="action-item">
                                        <div class="action-item_header">
                                            {{ $t('AlarmLinkage.Title.actionSel') }}
                                        </div>
                                        <div class="action-item_body">
                                            <template v-for="(item, index) in videoType">
                                                <div
                                                    :key="index"
                                                    @click="actionAdd(item)"
                                                    class="list-item"
                                                    :class="[formData.linkageAction.includes(item) ? 'active' : '']"
                                                >
                                                    {{ item.name }}
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </el-col>
                                <!-- 已选择动作 -->
                                <el-col :span="6">
                                    <div class="action-item">
                                        <div class="action-item_header">
                                            {{ $t('AlarmLinkage.Title.actionSeled') }}
                                        </div>
                                        <div class="action-item_body">
                                            <div
                                                v-for="(item, index) in formData.linkageAction"
                                                :key="index"
                                                class="list-item"
                                                :class="actionType == item.value ? 'active' : ''"
                                                @click="actionChoose(item.value)"
                                            >
                                                {{ item.name }}
                                                <i class="el-icon-close" @click.stop="removeAction(item)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <!-- 配置规则 -->
                                <el-col :span="12">
                                    <div class="action-item">
                                        <div class="action-item_header">
                                            {{ $t('AlarmLinkage.Title.ruleConfig') }}
                                        </div>
                                        <div class="action-item_body">
                                            <div class="ruleInfo">
                                                <!-- 录像时长 未实现 -->
                                                <template v-if="actionType == 1">
                                                    <div class="itemwrapper flex">
                                                        <span class="label">录像时长</span>
                                                        <el-input class="input" v-model="curActRule.times">
                                                            <span slot="suffix">秒</span>
                                                        </el-input>
                                                    </div>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">摄像机</span>
                                                        <div class="input flex flex-column">
                                                            <div class="choose" @click="deviceChooseVisible = true">
                                                                <span v-if="!activeRuleDevice.length">请选择设备</span>
                                                                <span v-else
                                                                    >已选择{{ activeRuleDevice.length }}个</span
                                                                >
                                                            </div>
                                                            <span class="tips"
                                                                >提示：最多选择{{
                                                                    linkLimit[actionType]
                                                                }}个联动设备</span
                                                            >
                                                            <template v-if="activeRuleDevice.length">
                                                                <div class="tips">已选择：</div>
                                                                <div
                                                                    class="nameLabel"
                                                                    :title="item.label"
                                                                    v-for="item in activeRuleDevice"
                                                                    :key="item.id"
                                                                >
                                                                    <i :class="classOf(item.payload)"></i>
                                                                    {{ item.label }}
                                                                </div>
                                                            </template>
                                                        </div>
                                                    </div>
                                                </template>
                                                <!-- 实况播放 / 视频上墙 -->
                                                <template v-if="actionType == 2 || actionType == 3">
                                                    <div class="itemwrapper flex">
                                                        <span class="label">摄像机</span>
                                                        <div class="input flex flex-column">
                                                            <template v-if="formData.deviceType == 1">
                                                                <el-checkbox
                                                                    v-model="curActRule.withOrigin"
                                                                    label="事件源摄像机"
                                                                ></el-checkbox>
                                                                <span class="name">
                                                                    <i
                                                                        :class="
                                                                            classOf({
                                                                                ptzType: formData.ptzType,
                                                                                status: 1,
                                                                            })
                                                                        "
                                                                    ></i>
                                                                    {{ formData.deviceName }}
                                                                </span>
                                                                <el-checkbox
                                                                    v-model="curActRule.withExtra"
                                                                    label="其他摄像机"
                                                                ></el-checkbox>
                                                            </template>
                                                            <div
                                                                class="flex flex-column"
                                                                v-show="
                                                                    formData.deviceType != 1 || curActRule.withExtra
                                                                "
                                                            >
                                                                <div class="choose" @click="deviceChooseVisible = true">
                                                                    <span v-if="!activeRuleDevice.length"
                                                                        >请选择设备</span
                                                                    >
                                                                    <span v-else
                                                                        >已选择{{ activeRuleDevice.length }}个</span
                                                                    >
                                                                </div>
                                                                <span class="tips"
                                                                    >提示：最多选择{{
                                                                        linkLimit[actionType]
                                                                    }}个联动设备</span
                                                                >
                                                                <template v-if="activeRuleDevice.length">
                                                                    <div class="tips">已选择：</div>
                                                                    <div
                                                                        v-for="item in activeRuleDevice"
                                                                        :key="item.id"
                                                                        class="nameLabel"
                                                                        :title="item.label"
                                                                    >
                                                                        <i :class="classOf(item.payload)"></i>
                                                                        {{ item.label }}
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="itemwrapper flex" v-if="actionType == 3">
                                                        <span class="label">电视墙</span>
                                                        <el-select style="width: 30%" v-model="curActRule.layoutName">
                                                            <el-option
                                                                v-for="(item, index) in wallList"
                                                                :label="item"
                                                                :value="item"
                                                                :key="index"
                                                            ></el-option>
                                                        </el-select>
                                                    </div>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">视频恢复</span>
                                                        <div class="input flex flex-column">
                                                            <div>
                                                                <el-radio v-model="curActRule.restore" label="0"
                                                                    >永不恢复</el-radio
                                                                >
                                                            </div>
                                                            <div>
                                                                <el-radio v-model="curActRule.restore" label="1"
                                                                    >恢复时间</el-radio
                                                                >
                                                                <template v-if="curActRule.restore == '1'">
                                                                    <span class="tips">提示：输入范围1~3600</span>
                                                                    <br />
                                                                    <el-input
                                                                        style="width: 30%"
                                                                        v-model.number="curActRule.restoreTime"
                                                                        @blur="inputChg('restoreTime', 1, 3600)"
                                                                    >
                                                                        <span slot="suffix">秒</span>
                                                                    </el-input>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <!-- 反控设备 -->
                                                <template v-if="actionType == 4">
                                                    <div class="itemwrapper flex">
                                                        <span class="label">门禁设备</span>
                                                        <div class="input flex flex-column">
                                                            <!-- 用于触发校验 -->
                                                            <el-input
                                                                v-model="curActRule.valid"
                                                                v-show="false"
                                                            ></el-input>
                                                            <div class="choose" @click="IotDeviceChooseVisible = true">
                                                                <span v-if="!activeRuleDevice.length">请选择设备</span>
                                                                <span v-else
                                                                    >已选择{{ activeRuleDevice.length }}个</span
                                                                >
                                                            </div>
                                                            <template v-if="activeRuleDevice.length">
                                                                <div class="tips">已选择：</div>
                                                                <div
                                                                    class="nameLabel"
                                                                    :title="item.label"
                                                                    v-for="item in activeRuleDevice"
                                                                    :key="item.id"
                                                                >
                                                                    <i class="iconCss aci-lock"></i>
                                                                    {{ item.label }}
                                                                </div>
                                                            </template>
                                                        </div>
                                                    </div>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">门禁操作</span>
                                                        <div class="input flex flex-column">
                                                            <div>
                                                                <el-radio v-model="curActRule.optMode" label="0"
                                                                    >告警确认后操作</el-radio
                                                                >
                                                            </div>
                                                            <div class="flex flex-align_center">
                                                                <el-radio v-model="curActRule.optMode" label="1"
                                                                    >立即设为常开</el-radio
                                                                >
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- 门禁恢复 功能调整 -->
                                                    <!-- <div class="itemwrapper flex">
                                                        <span class="label2">门禁恢复</span>
                                                        <div class="input flex flex-column">
                                                            <div>
                                                                <el-radio v-model="curActRule.restore" label="0"
                                                                    >不恢复</el-radio
                                                                >
                                                            </div>

                                                            <div>
                                                                <el-radio v-model="curActRule.restore" label="1"
                                                                    >恢复时间</el-radio
                                                                >
                                                                <template v-if="curActRule.restore == '1'">
                                                                    <span class="tips">提示：输入范围1~1440</span>
                                                                    <br />
                                                                    <el-input
                                                                        style="width: 30%"
                                                                        v-model.number="curActRule.restoreTime"
                                                                        @blur="inputChg('restoreTime', 1, 1440)"
                                                                    >
                                                                        <span slot="suffix">分</span>
                                                                    </el-input>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </div> -->
                                                </template>
                                                <!-- 前端喊话 -->
                                                <template v-if="actionType == 5">
                                                    <div class="itemwrapper flex">
                                                        <span class="label">喊话文件</span>
                                                        <div class="flex flex-column">
                                                            <el-upload
                                                                ref="uploadRef"
                                                                :auto-upload="false"
                                                                action=""
                                                                accept="audio/mpeg"
                                                                :multiple="false"
                                                                :show-file-list="false"
                                                                :on-change="handleFileChange"
                                                            >
                                                                <el-button type="primary">
                                                                    <!-- {{$t('AlarmType.Button.upload')}} -->
                                                                    选择文件
                                                                </el-button>
                                                            </el-upload>
                                                            <div
                                                                class="flex flex-align_center"
                                                                v-show="!!curActRule.fileName"
                                                            >
                                                                <span>{{ locale == 'en' ? 'file：' : '语音：' }}</span>
                                                                <span class="fileName" :title="curActRule.fileName">{{
                                                                    curActRule.fileName
                                                                }}</span>
                                                                <i
                                                                    v-if="curActRule.fileId"
                                                                    class="el-icon-circle-check success"
                                                                ></i>
                                                                <el-button
                                                                    v-else
                                                                    type="text"
                                                                    class="table-btn_info"
                                                                    @click="uploadFile"
                                                                >
                                                                    {{ uploadTxt }}
                                                                </el-button>
                                                                <el-button type="text" @click="voicePlay">
                                                                    {{ $t('AlarmType.Button.play') }}
                                                                </el-button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">摄像机</span>
                                                        <div class="input flex flex-column">
                                                            <template v-if="formData.deviceType == 1">
                                                                <el-checkbox
                                                                    v-model="curActRule.withOrigin"
                                                                    label="事件源摄像机"
                                                                ></el-checkbox>
                                                                <span class="name">{{ formData.deviceName }}</span>
                                                                <el-checkbox
                                                                    v-model="curActRule.withExtra"
                                                                    label="其他摄像机"
                                                                ></el-checkbox>
                                                            </template>
                                                            <div
                                                                class="flex flex-column"
                                                                v-show="
                                                                    formData.deviceType != 1 || curActRule.withExtra
                                                                "
                                                            >
                                                                <div class="choose" @click="deviceChooseVisible = true">
                                                                    <span v-if="!activeRuleDevice.length"
                                                                        >请选择设备</span
                                                                    >
                                                                    <span v-else
                                                                        >已选择{{ activeRuleDevice.length }}个</span
                                                                    >
                                                                </div>
                                                                <span class="tips"
                                                                    >提示：最多选择{{
                                                                        linkLimit[actionType]
                                                                    }}个联动设备</span
                                                                >
                                                                <template v-if="activeRuleDevice.length">
                                                                    <div class="tips">已选择：</div>
                                                                    <div
                                                                        v-for="item in activeRuleDevice"
                                                                        :key="item.id"
                                                                        class="nameLabel"
                                                                        :title="item.label"
                                                                    >
                                                                        <i :class="classOf(item.payload)"></i>
                                                                        {{ item.label }}
                                                                    </div>
                                                                </template>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="itemwrapper flex">
                                                        <span class="label">执行次数</span>
                                                        <div class="input flex flex-column">
                                                            <el-input
                                                                style="width: 30%"
                                                                type="number"
                                                                v-model="curActRule.executionsTimes"
                                                                @blur="inputChg('executionsTimes', 1, 5)"
                                                                :min="1"
                                                                :max="5"
                                                            >
                                                                <span slot="suffix">次</span>
                                                            </el-input>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                        <p class="errText" v-if="actionErrorShow">{{ actionError }}</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </div>
                    <!-- 完成 -->
                    <div v-show="stepIndex == 3" style="display: flex; flex-direction: column; align-items: center">
                        <h2 v-if="operation == 0">
                            <i class="el-icon-success"></i>
                            {{ $t('AlarmPushRule.Tips.addRuleSucc') }}
                        </h2>
                        <h2 v-else>
                            <i class="el-icon-success"></i>
                            {{ $t('AlarmPushRule.Tips.editRuleSucc') }}
                        </h2>
                        <p>{{ $t('AlarmPushRule.Tips.clickButtonTo') }}</p>
                    </div>
                </el-form>
            </template>
            <template slot="footer">
                <el-button type="primary" @click="preBack" v-show="stepIndex > 0 && stepIndex < 3">
                    {{ $t('public.previousStep') }}
                </el-button>
                <el-button type="primary" @click="nextTo" v-show="stepIndex < 2">
                    {{ $t('public.nextStep') }}
                </el-button>
                <el-button type="primary" @click="submitForm" v-show="stepIndex == 2">
                    {{ $t('public.save') }}
                </el-button>
                <el-button v-show="stepIndex == 3" type="primary" @click="backToList">
                    {{ $t('AlarmPushRule.Button.backToList') }}
                </el-button>
                <el-button v-show="stepIndex == 3" type="success" @click="viewInfo">
                    {{ $t('AlarmPushRule.Button.viewInfo') }}
                </el-button>
            </template>
        </cus-dialog>
        <DeviceChoose
            ref="deviceChoose"
            :visible.sync="deviceChooseVisible"
            @selDevice="selDevice"
            :selectedList="activeRuleDevice"
            :disableId="formData.deviceId"
            :limitNum="linkLimit[actionType]"
        ></DeviceChoose>
        <IotDeviceChoose
            ref="iotDeviceChoose"
            :visible.sync="IotDeviceChooseVisible"
            @selDevice="selDevice"
            :selectedList="activeRuleDevice"
        ></IotDeviceChoose>
    </div>
</template>

<script>
// 获取已选择的告警类型 getAlarmTypeByLinkage
// 新增 addLinkageRule
// 新增 modifyLinkageRule
const CameraTree = () => import('@/components/CameraTree')
const IotDeviceTree = () => import('@/components/IotDeviceTree')
const AreaTree = () => import('./AreaTree')
const DeviceChoose = () => import('./DeviceChoose')
const IotDeviceChoose = () => import('./IotDeviceChoose')
import fileCheck from '@/mixin/fileCheck.js'
export default {
    props: {
        visible: {
            type: Boolean,
        },
        operation: {
            type: Number,
        },
        videoType: {
            type: Array,
        },
        deviceType: {
            type: Array,
        },
        sceneList: {
            type: Array,
        },
        alarmData: {
            type: Array,
        },
        dataInfo: {
            type: Object,
        },
    },
    mixins: [fileCheck],
    components: {
        CameraTree,
        IotDeviceTree,
        AreaTree,
        DeviceChoose,
        IotDeviceChoose,
    },
    data() {
        return {
            stepIndex: 0,
            loading: false,
            deviceIds: [], //摄像机设备/门禁设备/道闸设备
            deviceIds2: [], //摄像机设备/门禁设备/道闸设备
            deviceIds3: [], //摄像机设备/门禁设备/道闸设备
            cameraIds: [], //回显设备ID
            actionType: '', //当前所选的动作类型
            formData: {
                deviceType: '1', //设备类型字段
                deviceId: '', //所选事件源设备ID
                deviceName: '', //所选事件源设备名称
                ptzType: '', //事件源设备类型
                alarmType: [], //告警字段
                linkageAction: [], //动作字段
            },
            formRule: {
                deviceType: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                    },
                ],
                deviceId: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            //校验用户
                            this.$nextTick(() => {
                                let datas
                                if (this.formData.deviceType == 1) {
                                    datas = this.$refs.cameraT.getSaveData()
                                } else if (this.formData.deviceType == 2) {
                                    datas = this.$refs.accessT.getSaveData()
                                } else {
                                    datas = this.$refs.barrierT.getSaveData()
                                }
                                if (datas.length) {
                                    callback()
                                } else {
                                    callback(new Error(this.$t('length.required')))
                                }
                            })
                        },
                        trigger: 'change',
                    },
                ],
                alarmType: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                        validator: (rule, value, callback) => {
                            if (value.length == this.disableAlarmType.length) {
                                callback(new Error(this.$t('length.required')))
                            } else {
                                callback()
                            }
                        },
                    },
                ],
                linkageAction: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if (value.length) {
                                // let res = this.validateRule(this.actionType)
                                // if (typeof res === 'boolean') callback()
                                // callback(new Error(res))
                                callback()
                            } else {
                                this.actionError = ''
                                this.actionErrorShow = false
                                callback(new Error(this.$t('public.select', { type: '联动动作' })))
                            }
                        },
                        trigger: 'change',
                    },
                ],
            },
            actionError: '',
            actionErrorShow: false,
            deviceChooseVisible: false,
            IotDeviceChooseVisible: false,
            actRulesTemp: {}, //保存各个动作的配置
            curActRule: {}, //当前正在操作的动作相关配置
            activeRuleDevice: [], //联动设备
            //各个动作的设备限制数量
            linkLimit: {
                1: 8,
                2: 8,
                3: 8,
                5: 8,
            },
            uploadTxt: '上传',
            /****** 编辑或查看使用 **** */
            viewData: null, //查看详情使用
            disableAlarmType: [], //禁止选择的告警类型
            editRuleType: [], //正在编辑的拥有的类型
            editCamreraId: '', //编辑时未修改设备摄像机的id
            wallList: [], //电视墙列表
        }
    },
    methods: {
        // 重置等逻辑
        dialogClose() {
            // 重置等逻辑
            this.activeRuleDevice = []
            this.actRulesTemp = {}
            this.curActRule = {}
            this.actionType = ''
            this.curFile = null
            this.actionError = ''
            this.actionErrorShow = false
            if (this.player) {
                this.player.pause()
                this.player = null
            }
            if (this.playUrl) URL.revokeObjectURL(this.playUrl)
            this.playUrl = ''
            this.$emit('update:visible', false)
        },
        // 打开弹窗 回显等
        async dialogOpen() {
            if (!this.wallList.length) this.getWallList()
            //重置
            this.stepIndex = 0
            this.deviceIds = [] //清空已选择的告警设备
            this.deviceIds2 = [] //清空已选择的告警设备
            this.deviceIds3 = [] //清空已选择的告警设备
            this.$refs.forms?.resetFields() //重置表单
            if (this.operation == 1) {
                // 编辑回显
                let ruleInfo = this.dataInfo
                await this.getDisAlarmType(ruleInfo.deviceId)
                this.deviceChg(ruleInfo.deviceType)
                this.$nextTick(() => {
                    // 回显告警设备
                    if (ruleInfo.deviceType == 1) {
                        this.deviceIds = [
                            {
                                type: 2,
                                id: ruleInfo.deviceId,
                            },
                        ]
                    }
                    if (ruleInfo.deviceType == 2) {
                        this.deviceIds2 = [
                            {
                                type: 2,
                                id: ruleInfo.deviceId,
                            },
                        ]
                    }
                    if (ruleInfo.deviceType == 3) {
                        this.deviceIds3 = [
                            {
                                type: 2,
                                id: ruleInfo.deviceId,
                            },
                        ]
                    }
                    // 回显动作
                    let keys = Object.keys(ruleInfo.linkageAction)
                        .map((t) => {
                            return this.videoType.find((a) => a.value == t)?.value
                        })
                        .filter((a) => !!a) //动作字段
                    let Ids = [], //摄像机
                        Ids2 = [] //门禁
                    keys.forEach((key) => {
                        this.actRulesTemp[key] = {
                            ...ruleInfo.linkageAction[key],
                        }
                        this.actRulesTemp[key].activeRuleDevice = []
                        if (key == 4) Ids2 = Ids2.concat(this.actRulesTemp[key].idList)
                        else Ids = Ids.concat(this.actRulesTemp[key].idList)
                        // this.actRulesTemp[key].idList.map((id) => {
                        //     if (key == 4) Ids2.push(id)
                        //     else Ids.push(id)
                        //     return {
                        //         id,
                        //     }
                        // })
                        // delete this.actRulesTemp[key].idList
                        // delete this.actRulesTemp[key].type
                    })
                    this.actionType = keys[0]
                    if (Ids.length || Ids2.length) {
                        // 请求全部的设备 ,可能存在设备删除的情况
                        this.$api
                            .getRoleUserCameraOrgRequest({ cameraIdList: Ids, iotDeviceIdList: Ids2 })
                            .then((res) => {
                                let seledDeviceList = [] //所有的设备
                                if (res.iotDeviceInfoList?.length) {
                                    res.iotDeviceInfoList.forEach((t) => {
                                        t.label = t.deviceName
                                        t.id = t.deviceId
                                    })
                                    // 有门禁设备
                                    seledDeviceList = seledDeviceList.concat(res.iotDeviceInfoList)
                                }
                                if (res.cameraInfoList?.length) {
                                    // 有摄像机
                                    res.cameraInfoList.forEach((t) => {
                                        t.label = t.cameraName
                                        t.id = t.cameraId
                                        t.payload = {
                                            ptzType: t.ptzType,
                                            status: t.status,
                                        }
                                    })
                                    seledDeviceList = seledDeviceList.concat(res.cameraInfoList)
                                }
                                this.seledDeviceList = seledDeviceList

                                keys.forEach((key) => {
                                    this.actRulesTemp[key].activeRuleDevice = this.actRulesTemp[key].idList
                                        .map((id) => {
                                            let obj = seledDeviceList.find((s) => s.deviceId == id || s.cameraId == id)
                                            if (obj) {
                                                obj.belongType = key
                                                return obj
                                            } else {
                                                return
                                            }
                                        })
                                        .filter((item) => !!item)
                                })
                            })
                    }

                    this.formData = {
                        id: ruleInfo.id, //联动id
                        deviceType: ruleInfo.deviceType + '', //设备类型字段
                        deviceId: ruleInfo.deviceId, //设备列表字段
                        deviceName: ruleInfo.deviceName,
                        ptzType: ruleInfo.ptzType,
                        alarmType: ruleInfo.alarmType, //告警字段
                        linkageAction: keys.map((t) => {
                            return this.videoType.find((a) => a.value == t)
                        }), //动作字段
                    }
                    this.editCamreraId = ruleInfo.deviceId
                    this.editRuleType = ruleInfo.alarmType
                    this.syncAlarm(ruleInfo.alarmType)
                })
            }
        },
        // 设备类型改变,重置
        deviceChg() {
            this.deviceIds = []
            this.deviceIds2 = []
            this.deviceIds3 = []
            this.formData.linkageAction = []
            this.curActRule = {}
            this.activeRuleDevice = []
            this.actRulesTemp = {}
            this.actionType = ''
        },
        // 选择设备后的回调函数
        async nodeCheck(node, check) {
            // 重置告警类型
            this.formData.alarmType = []
            // 如果是勾选
            if (check) {
                // 更新
                if (this.formData.deviceType == 1) {
                    // 摄像机
                    this.cameraIds = this.$refs.cameraT.getSaveData()
                    this.formData.ptzType = this.cameraIds[0].ptzType
                } else if (this.formData.deviceType == 2) {
                    // 门禁
                    this.cameraIds = this.$refs.accessT.getSaveData()
                } else {
                    // 道闸
                    this.cameraIds = this.$refs.barrierT.getSaveData()
                }
                this.formData.deviceName = this.cameraIds[0].label
                this.formData.deviceId = this.cameraIds[0].id
                await this.getDisAlarmType(node.id)
                // 切换摄像机后 清除动作配置
                this.formData.linkageAction = []
                this.actRulesTemp = {}
                this.curActRule = {}
                this.activeRuleDevice = []
                this.actionType = ''
                this.$refs?.iotDeviceChoose?.refresh()
                this.$refs?.deviceChoose?.refresh()
            }
        },
        // 获取设备使用过的告警类型
        async getDisAlarmType(deviceId, types) {
            let res = await this.$api.getAlarmTypeByLinkage({
                deviceId,
            })
            if (res.resultCode == 0) {
                this.disableAlarmType = res.alarmTypeList || []
            }
        },
        // 返回上一步
        preBack() {
            this.stepIndex--
        },
        // 校验 下一步
        nextTo() {
            if (this.stepIndex == 0) {
                this.$refs.forms.validateField('deviceType', (msg) => {
                    if (!msg) {
                        this.$refs.forms.validateField('deviceId', async (msg2) => {
                            if (!msg2) {
                                this.stepIndex++
                                if (this.operation == 1) {
                                    if (this.editCamreraId !== this.formData.deviceId) {
                                        this.syncAlarm([])
                                    } else {
                                        this.syncAlarm(this.editRuleType)
                                    }
                                } else this.syncAlarm([])
                            }
                        })
                        this.$refs.forms.clearValidate()
                    }
                })
            } else if (this.stepIndex == 1) {
                this.$refs.forms.validateField('alarmType', (msg) => {
                    if (!msg) {
                        if (this.operation == 1) {
                            // 编辑时回显已选的第一个动作
                            if (this.actionType) {
                                this.curActRule = this.actRulesTemp[this.actionType]
                                this.activeRuleDevice = this.curActRule.activeRuleDevice
                            }
                        }
                        this.stepIndex++
                    }
                })
            }
        },
        // 编辑和新增时告警类型能否勾选,编辑时取消禁止选择
        syncAlarm(types) {
            this.formData.alarmType = [...this.disableAlarmType, ...this.formData.alarmType]
            // 去重
            this.formData.alarmType = Array.from(new Set(this.formData.alarmType))
            this.disableAlarmType = this.disableAlarmType.filter((da) => {
                return !types.includes(da)
            })
        },
        // 选择动作
        actionAdd(item) {
            if (!this.formData.linkageAction.find((ac) => ac.value == item.value)) {
                this.formData.linkageAction.push(item)
                this.actionChoose(item.value)
            }
        },
        // 移除动作
        removeAction(item) {
            delete this.actRulesTemp[item.value]
            this.formData.linkageAction = this.formData.linkageAction.filter((action) => action.value != item.value)
            if (!this.formData.linkageAction.length) {
                this.actionType = ''
                this.curActRule = {}
                this.activeRuleDevice = []
                this.$refs.forms.validateField('linkageAction')
                return
            }
            if (this.formData.linkageAction.find((l) => l.value == this.actionType)) return
            this.actionChoose(this.formData.linkageAction[this.formData.linkageAction.length - 1]?.value)
        },
        // 动作改变
        actionChoose(val) {
            if (this.actionType == val) return
            this.actionError = ''
            this.actionErrorShow = false
            this.actionType = Number(val)
            this.activeRuleDevice = []
            this.curActRule = {}
            this.$nextTick(() => {
                if (!!this.actRulesTemp[val]) {
                    this.curActRule = this.actRulesTemp[val]
                    this.activeRuleDevice = this.actRulesTemp[val].activeRuleDevice
                    return
                }
                let tem = {}
                if (val == 1) {
                    //平台录像
                    tem.times = 40
                    tem.activeRuleDevice = []
                } else if (val == 2) {
                    //实况播放
                    tem.withOrigin = false
                    tem.withExtra = false
                    tem.activeRuleDevice = []
                    tem.restore = '0'
                    tem.restoreTime = 300
                } else if (val == 3) {
                    //视频上墙
                    tem.withOrigin = false
                    tem.withExtra = false
                    tem.activeRuleDevice = []
                    tem.restore = '0'
                    tem.restoreTime = 300
                    tem.layoutName = ''
                } else if (val == 4) {
                    //反控设备
                    tem.activeRuleDevice = []
                    tem.optMode = '1'
                    tem.restore = '0'
                    tem.restoreTime = 60
                    tem.valid = ''
                } else if (val == 5) {
                    //前端喊话
                    tem.withOrigin = false
                    tem.withExtra = false
                    tem.activeRuleDevice = []
                    tem.fileId = ''
                    tem.fileUrl = ''
                    tem.fileName = ''
                    tem.executionsTimes = 1
                }
                this.curActRule = tem
                this.actRulesTemp[val] = tem
            })
        },
        // 联动设备选择时触发
        selDevice(data) {
            this.activeRuleDevice = data.map((d) => {
                d.belongType = this.actionType
                return d
            })
            this.actRulesTemp[this.actionType].activeRuleDevice = this.activeRuleDevice
            this.$refs.forms.validateField('linkageAction')
        },
        //输入框自动检查值
        inputChg(val, min, max) {
            if (isNaN(Number(this.curActRule[val]))) return (this.curActRule[val] = min)
            if (this.curActRule[val] < min) this.curActRule[val] = min
            else if (this.curActRule[val] > max) this.curActRule[val] = max
            else this.curActRule[val] = parseInt(this.curActRule[val])
        },
        // 校验单个规则,并返回错误信息
        validateRule(actionType) {
            let _cur = this.actRulesTemp[actionType]
            let _type = this.formData.deviceType
            if (actionType == 1) {
                // 平台录像
                // 校验录像时长
                if (isNaN(Number(_cur.times))) return '录像时长只能输入正整数'
                if (Number(_cur.times) < 10) return '录像时长最小不能低于10'
                _cur.times = parseInt(_cur.times)
            } else if (actionType == 2 || actionType == 3) {
                // 实况播放 / 视频上墙
                if (_type == 1) {
                    // 摄像机
                    if (!_cur.withOrigin && !_cur.withExtra) return this.$t('请选择摄像机') //需要选择摄像机
                    if (!_cur.withExtra) return true //不需要校验其他摄像机
                }
                if (actionType == 3) {
                    if (!_cur.layoutName) return this.$t('请选择电视墙') //需要选择摄像机
                }
            } else if (actionType == 4) {
                _cur.restoreTime = parseInt(_cur.restoreTime)
                if (_cur.activeRuleDevice.length) return true
                return this.$t('AlarmLinkage.Tips.deviceNeed') //不需要校验设备数量
            } else if (actionType == 5) {
                if (Number(_cur.executionsTimes) > 5) _cur.executionsTimes = 5
                if (Number(_cur.executionsTimes) < 1) _cur.executionsTimes = 1
                _cur.executionsTimes = parseInt(Number(_cur.executionsTimes))
                // 前端喊话
                if (!_cur.fileId) return '请上传文件'
                if (_type == 1) {
                    // 摄像机
                    if (!_cur.withOrigin && !_cur.withExtra) return this.$t('AlarmLinkage.Tips.deviceNeed') //需要选择摄像机
                    if (!_cur.withExtra) return true //不需要校验其他摄像机
                } else {
                    // 门禁道闸
                    _cur.withExtra = true
                }
            }
            if (_cur.activeRuleDevice.length) {
                if (_cur.activeRuleDevice.length <= this.linkLimit[_cur.activeRuleDevice?.[0]?.belongType]) {
                    if (_cur.activeRuleDevice.includes(this.formData.deviceId)) {
                        _cur.activeRuleDevice = _cur.activeRuleDevice.filter((a) => a != this.formData.deviceId)
                    }
                    return true
                } else {
                    return this.$t('AlarmLinkage.Tips.deviceNo8')
                }
            } else {
                return '请选择摄像机'
            }
        },
        // 文件选择
        handleFileChange(file, w) {
            file = file.raw
            if (file.type != 'audio/mpeg') return this.$message.error('文件格式错误！')
            if (this.checkFileLength(file.name)) {
                if (!this.checkFileSize(file.size, 5)) {
                    return this.$message.error('文件不能超过5Mb')
                }
                this.curActRule.fileId = '' //重置
                this.curFile = file
                this.curActRule.fileName = file.name
                this.uploadTxt = '上传'
                if (this.playUrl) URL.revokeObjectURL(this.playUrl)
                this.playUrl = URL.createObjectURL(file)
                this.$nextTick(() => {
                    this.$refs.forms.validateField('linkageAction')
                })
            }
        },
        // 文件播放
        voicePlay() {
            if (this.player) {
                this.player.pause()
                this.player = null
            }
            if (!!this.playUrl) {
                this.player = new Audio(this.playUrl)
                this.player.play() //播放 mp3这个音频对象
            } else {
                try {
                    if (this.curActRule.fileUrl) {
                        this.player = new Audio(this.curActRule.fileUrl)
                        this.player.play() //播放 mp3这个音频对象
                    } else {
                        if (this.curActRule.fileId) {
                            this.$api.getDownloadUrl({ fileId: this.curActRule.fileId }).then((dow) => {
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
            }
        },
        // 上传文件
        uploadFile() {
            if (!!this.curFile) {
                const formData = new FormData()
                formData.append('file', this.curFile)
                this.uploadTxt = '上传中'
                this.$api.getUploadUrl({}).then((res) => {
                    if (res.resultCode == 0) {
                        this.$postFetch(res.uploadUrl, formData, 10000).then((_file) => {
                            if (_file && _file.resultCode == 0) {
                                this.curFile = null
                                this.uploadTxt = '上传成功'
                                this.curActRule.fileId = res.fileId
                                this.$nextTick(() => {
                                    this.$refs.forms.validateField('linkageAction')
                                })
                                this.$api.getDownloadUrl({ fileId: _file.fileId }).then((dow) => {
                                    if (dow && dow.resultCode == 0) {
                                        this.curActRule.fileUrl = dow.downloadUrl
                                    }
                                })
                            } else {
                                this.uploadTxt = '上传'
                                return this.$message.error(this.$t('AlarmType.Tips.fileError'))
                            }
                        })
                    } else {
                        return this.$message.error(this.$t('AlarmType.Tips.fileError'))
                    }
                })
            }
        },
        // 设置告警来源文字
        setGroup(val) {
            return this.sceneList.find((a) => a.value == val)?.name
        },
        // 图标
        classOf(data) {
            if (!data) return
            let cls = 'iconCss2'
            if (data.status == 1) cls = 'iconCss'
            cls += ' '
            if (data.ptzType == 1) {
                return cls + 'aci-camera-gun'
            } else if (data.ptzType == 2) {
                return cls + 'aci-camera-ptz'
            } else if (data.ptzType == 3) {
                return cls + 'aci-camera-ball'
            } else if (data.ptzType == 4) {
                return cls + 'aci-camera-hemisphere'
            } else if (data.ptzType == 5) {
                return cls + 'aci-camera-collect'
            }
        },
        // 提交表单
        submitForm() {
            if (this.stepIndex == 2) {
                // 校验当前的动作
                this.$refs.forms.validateField('linkageAction', (msg) => {
                    if (!msg) {
                        let curValid = this.validateRule(this.actionType)
                        if (typeof curValid !== 'boolean') {
                            this.actionError = curValid
                            this.actionErrorShow = true
                            return
                        }
                        this.actionError = ''
                        this.actionErrorShow = false
                        let res
                        let valid = true
                        // 校验其他动作
                        for (let i = 0; i < this.formData.linkageAction.length; i++) {
                            const link = this.formData.linkageAction[i]
                            res = this.validateRule(link.value)
                            if (typeof res !== 'boolean') {
                                valid = false
                                this.actionErrorShow = true
                                // this.$message.info(link.name + '动作规则配置未通过校验，请调整！')
                                this.actionError = link.name + '动作规则配置未通过校验，请调整！'
                                break
                            }
                        }
                        if (!valid) return
                        // 校验通过
                        this.loading = true
                        // 拼装JSON
                        let linkageRuleInfo = {}
                        // 基础信息
                        linkageRuleInfo.deviceType = Number(this.formData.deviceType)
                        linkageRuleInfo.deviceId = this.formData.deviceId
                        linkageRuleInfo.deviceName = this.formData.deviceName
                        // 告警类型
                        let alarmtypes = []
                        alarmtypes = this.formData.alarmType.filter((al) => !this.disableAlarmType.includes(al))
                        linkageRuleInfo.alarmType = alarmtypes.join(',')
                        // 联动动作
                        let linkageAction = {}
                        Object.keys(this.actRulesTemp).forEach((item) => {
                            linkageAction[item] = {
                                ...this.actRulesTemp[item],
                            }
                            linkageAction[item].type = item
                            linkageAction[item].idList = linkageAction[item].activeRuleDevice.map((li) => li.id)
                            delete linkageAction[item].activeRuleDevice
                        })
                        linkageRuleInfo.linkageAction = JSON.stringify(linkageAction)
                        if (this.operation == 0) {
                            this.$api
                                .addLinkageRule({
                                    linkageRuleInfo,
                                })
                                .then((res) => {
                                    this.loading = false
                                    if (res.resultCode == 0) {
                                        this.stepIndex++
                                        this.viewData = {
                                            ...linkageRuleInfo,
                                            id: res.id,
                                        }
                                    }
                                })
                        } else {
                            this.$api
                                .modifyLinkageRule({
                                    linkageRuleInfo,
                                    id: this.formData.id,
                                })
                                .then((res) => {
                                    this.loading = false
                                    if (res.resultCode == 0) {
                                        this.stepIndex++
                                        this.viewData = {
                                            ...linkageRuleInfo,
                                            id: this.formData.id,
                                        }
                                    }
                                })
                        }
                    }
                })
            }
        },
        // 返回列表
        backToList() {
            this.$emit('backToList')
        },
        // 查看详情
        viewInfo() {
            this.viewData.deviceTypeName = this.deviceType.find((d) => d.value == this.viewData.deviceType)?.name
            this.$emit('viewInfo', this.viewData)
        },
        getWallList() {
            this.$api.getWallList({}).then((res) => {
                if (res.resultCode == 0) {
                    let wallMap = new Set(res.arrangementInfos.map((a) => a.layoutName))
                    // res.arrangementInfos.map(a=>{
                    //     wallMap.set(a.layoutName,a)
                    // })
                    this.wallList = Array.from(wallMap) || []
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
// @import '@/assets/scss/config/mixin.scss'; //引用此混合样式
.el-form-item {
    width: 100%;
}
::v-deep .el-steps {
    width: 100%;
    margin-bottom: 20px;
    .el-step__icon.is-text {
        width: 68px;
        height: 68px;
        // border-color: #64BEFD;
        background: transparent;
        color: #fff;
    }
    .el-step.is-center .el-step__line {
        left: 65%;
        top: 33px;
        width: 70.3%;
    }
    .el-step__head.is-process .el-step__icon.is-text {
        border-color: #64befd !important;
        color: #64befd;
    }
    .el-step__title.is-process {
        color: #64befd;
    }
    .el-step__title.is-success {
        color: #ccc;
    }
    .el-step__head.is-success .el-step__icon.is-text {
        border-color: #64befd !important;
        background: #64befd;
    }
    .el-step__head.is-success {
        border-color: #bfbfbf;
    }
    .el-step__icon-inner {
        font-size: 20px;
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
    ::v-deep .el-checkbox-group {
        display: flex;
        //   flex-direction: column;
        flex-wrap: wrap;
        height: 100%;
        .el-checkbox {
            color: #fff;
            width: 50%;
        }
    }
}
.action {
    &-item {
        background: #134b71;
        margin-right: 20px;
        height: 380px;
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
                &:hover {
                    background: #206392;
                }
                i {
                    position: absolute;
                    right: 20px;
                    line-height: 32px;
                }
            }
            .ruleInfo {
                padding: 10px;
                // ::v-deep .el-form-item {
                //     .el-form-item__label {
                //         width: 120px !important;
                //         text-align: left;
                //     }
                //     .el-form-item__content {
                //         width: calc(100% - 120px) !important;
                //     }
                // }
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
                        width: calc(100% - 100px);
                        .el-input__inner {
                            border-color: #ccc;
                        }
                        .choose {
                            width: 200px;
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

                    .el-checkbox {
                        color: #fff;
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
            }
        }
    }
}
.errText {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 50%;
}
</style>
