<!-- 告警设置 -->
<template>
    <cus-dialog
        :title="$t('AlarmType.Button.alarmSet')"
        :visible.sync="show"
        :width="locale == 'en' ? 800 : 660"
        @submit="uploadFile"
        :submitLoading="maskloading"
        @close="dialogClosed"
        @open="dialogOpen"
    >
        <el-form
            slot="body"
            ref="form"
            :model="formData"
            :rules="rules"
            class="addForm"
            inline
            label-position="right"
            label-suffix="："
        >
            <!-- 告警名称 -->
            <el-form-item :label="$t('AlarmType.Form.alarmTypeName')">
                <span>
                    {{ locale == 'en' ? $parent.dataForm.alarmEnName : $parent.dataForm.alarmName }}
                </span>
            </el-form-item>
            <!-- 高频规则配置 -->
            <template v-if="showHfreq">
                <el-form-item :label="$t('AlarmType.Form.hfRule')" class="hfrule">
                    <div class="flex flex-align_center hfrule-item">
                        <span>{{ $t('AlarmType.Tips.when') }}</span>
                        <el-input
                            class="input1"
                            v-model.number="hfField.frequency"
                            min="1"
                            :max="fmax"
                            @blur="freqBlur(hfField.frequency)"
                        ></el-input>
                        <el-select class="input2" v-model="hfField.type" @change="frequencyChg">
                            <el-option :label="$t('AlarmType.Form.minutes')" :value="1"></el-option>
                            <el-option :label="$t('AlarmType.Form.hour')" :value="2"></el-option>
                            <!-- <el-option :label="$t('AlarmType.Form.day')" :value="3"></el-option> -->
                        </el-select>
                        <span>{{ $t('AlarmType.Tips.happen') }}</span>
                        <el-input
                            class="input1"
                            v-model.number="hfField.count"
                            :max="100"
                            @blur="countBlur(hfField.count)"
                        ></el-input>
                        <span>次</span>
                    </div>
                </el-form-item>
                <!-- 提示 -->
                <el-form-item :label="$t('AlarmType.Tips.tip')" class="tips">
                    {{ $t('AlarmType.Tips.hfTips') }}
                </el-form-item>
            </template>

            <!-- 告警时间间隔 -->
            <el-form-item :label="$t('AlarmType.Form.timeInterval')" prop="timeInterval">
                <el-radio-group v-model="formData.timeInterval">
                    <el-radio :label="0">{{ $t('public.none') }}</el-radio>
                    <el-radio :label="1800">{{ $t('AlarmType.Form.min30') }}</el-radio>
                    <el-radio :label="3600">{{ 1 + $t('AlarmType.Form.hour') }}</el-radio>
                    <el-radio label="custom">{{ $t('AlarmType.Form.custom') }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 自定义告警时间间隔 -->
            <template v-if="formData.timeInterval == 'custom'">
                <!-- 时间单位 -->
                <el-form-item :label="$t('AlarmType.Form.timeUnit')" prop="timeUnit">
                    <el-select
                        v-model="formData.timeUnit"
                        :placeholder="$t('public.select', { type: $t('AlarmType.Form.timeUnit') })"
                    >
                        <el-option :label="$t('AlarmType.Form.minutes')" value="m"></el-option>
                        <el-option :label="$t('AlarmType.Form.hour')" value="h"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 时长 -->
                <el-form-item :label="$t('AlarmType.Form.timeNum')" prop="timeNum">
                    <el-input
                        v-model="formData.timeNum"
                        :placeholder="$t('public.input', { type: $t('AlarmType.Form.timeNum') })"
                    ></el-input>
                </el-form-item>
            </template>
            <!-- 提示 -->
            <el-form-item :label="$t('AlarmType.Tips.tip')" class="tips">
                {{ $t('AlarmType.Tips.settingTips') }}
            </el-form-item>
            <!-- 系统语音提示 -->
            <el-form-item :label="$t('AlarmType.Form.sysVoice')" prop="systemVoiceStatus">
                <div class="flex flex-align_center">
                    <el-switch v-model="formData.systemVoiceStatus"></el-switch>
                    <span class="lableTip">
                        {{ formData.systemVoiceStatus ? $t('public.open') : $t('public.close') }}
                    </span>
                </div>
            </el-form-item>
            <!-- 系统语音文件 -->
            <el-form-item
                :label="$t('AlarmType.Form.voiceFIle')"
                v-show="formData.systemVoiceStatus"
                prop="systemVoiceFileId"
            >
                <el-input v-model="formData.systemVoiceFileId" v-show="false"></el-input>
                <div>
                    <div class="flex flex-align_center">
                        <el-upload
                            ref="uploadRef"
                            :auto-upload="false"
                            action=""
                            accept="audio/mpeg"
                            :multiple="false"
                            :show-file-list="false"
                            :on-change="handleFileChange"
                        >
                            <el-button type="text">{{ $t('AlarmType.Button.upload') }}</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传mp3文件</div> -->
                        </el-upload>
                        <span class="tips fileTip">{{ $t('AlarmType.Tips.fileTip') }}</span>
                    </div>
                    <div class="flex flex-align_center" v-show="!!fileName">
                        <span>{{ locale == 'en' ? 'file：' : '语音：' }}</span>
                        <span class="fileName" :title="fileName">{{ fileName }}</span>
                        <el-button type="text" class="play" @click="voicePlay">
                            {{ $t('AlarmType.Button.play') }}
                        </el-button>
                    </div>
                </div>
            </el-form-item>
            <!-- 摄像机语音提示 -->
            <el-form-item :label="$t('AlarmType.Form.caVoice')" prop="cameraVoiceStatus">
                <div>
                    <el-switch
                        v-model="formData.cameraVoiceStatus"
                        @change="formData.cameraVoiceIntervalFlag = false"
                    ></el-switch>
                    <span class="lableTip">
                        {{ formData.cameraVoiceStatus ? $t('public.open') : $t('public.close') }}
                    </span>
                </div>
            </el-form-item>
            <!-- 提示时间间隔 -->
            <el-form-item
                :label="$t('AlarmType.Form.interval')"
                v-show="formData.cameraVoiceStatus"
                prop="cameraVoiceIntervalFlag"
            >
                <div>
                    <el-switch v-model="formData.cameraVoiceIntervalFlag"></el-switch>
                    <span class="lableTip">
                        {{ formData.cameraVoiceIntervalFlag ? $t('public.open') : $t('public.close') }}
                    </span>
                </div>
            </el-form-item>
        </el-form>
    </cus-dialog>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            maskloading: false,
            formData: {
                alarmType: '',
                timeInterval: 0,
                timeUnit: 'm',
                timeNum: '',
                systemVoiceStatus: false,
                systemVoiceFileId: '',
                systemVoiceUrl: '',
                cameraVoiceStatus: false,
                cameraVoiceIntervalFlag: false,
            },
            rules: {
                timeInterval: [
                    {
                        required: true,
                    },
                ],
                timeUnit: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            this.$refs.form.validateField('timeNum')
                            callback()
                        },
                    },
                ],
                timeNum: [
                    {
                        required: true,
                        message: this.$t('length.required'),
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (!isNaN(Number(value))) {
                                if (this.formData.timeUnit == 'm') {
                                    if (value % parseInt(value) > 0) {
                                        callback(new Error(this.$t('AlarmType.Tips.minuteCheck')))
                                    }
                                    if (Number(value) >= 1 && Number(value) <= 60) {
                                        callback()
                                    } else {
                                        callback(new Error(this.$t('AlarmType.Tips.minuteCheck')))
                                    }
                                } else {
                                    if (value % parseInt(value) > 0) {
                                        callback(new Error(this.$t('AlarmType.Tips.minuteCheck')))
                                    }
                                    if (Number(value) >= 1 && Number(value) <= 24) {
                                        callback()
                                    } else {
                                        callback(new Error(this.$t('AlarmType.Tips.hourCheck')))
                                    }
                                }
                            } else {
                                callback(new Error(this.$t('AlarmType.Tips.numCheck')))
                            }
                        },
                    },
                ],
            },
            fileName: '',
            curFile: null,
            player: null,
            playUrl: null,
            hfField: {
                count: '5', //次数
                type: 1,
                frequency: '10', //频率
            },
            showHfreq: false,
        }
    },
    computed: {
        fmax() {
            if (this.hfField.type == 1) {
                //分钟
                return 1440
            } else if (this.hfField.type == 2) {
                return 24
            }
        },
    },
    methods: {
        dialogOpen() {
            this.$nextTick(() => {
                this.formData.alarmType = this.$parent.dataForm.alarmType
                if (this.formData.alarmType == 'STRANGER_HIGH_FREQUENCY_PERSONNEL_ALARM') {
                    this.showHfreq = true
                    // 回显 this.hfField
                    let dateDefinition = this.$parent.dataForm.dateDefinition || 10
                    let numDefinition = this.$parent.dataForm.numDefinition || 15
                    let type = Number(this.$parent.dataForm.type) || 1
                    if (type == 2) dateDefinition = dateDefinition / 60
                    this.hfField = {
                        frequency: dateDefinition,
                        type,
                        count: numDefinition,
                    }
                }
                this.formData.systemVoiceStatus = this.$parent.dataForm.systemVoiceStatus == 1 ? true : false
                if (this.formData.systemVoiceStatus) {
                    this.curFile = true //复盘时需要
                }
                this.formData.systemVoiceFileId = this.$parent.dataForm.systemVoiceFileId
                this.fileName = this.$parent.dataForm.systemVoiceFileName
                this.playUrl = this.$parent.dataForm.systemVoiceFileUrl
                if (!!this.playUrl) this.curFile = true //复盘时需要
                this.formData.cameraVoiceStatus = this.$parent.dataForm.cameraVoiceStatus == 1 ? true : false
                this.formData.cameraVoiceIntervalFlag =
                    this.$parent.dataForm.cameraVoiceIntervalFlag == 1 ? true : false
                let timeType = this.$parent.dataForm.timeType
                if (timeType == 0) {
                    this.formData.timeInterval = this.$parent.dataForm.timeNum || 0
                } else if (timeType == 1) {
                    this.formData.timeInterval = 'custom'
                    this.formData.timeUnit = 'm'
                    this.formData.timeNum = this.$parent.dataForm.timeNum / 60
                } else if (timeType == 2) {
                    this.formData.timeInterval = 'custom'
                    this.formData.timeUnit = 'h'
                    this.formData.timeNum = this.$parent.dataForm.timeNum / 3600
                }
            })
        },
        dialogClosed() {
            this.show = false
            this.maskloading = false
            this.clearPlay()
            this.hfField = {
                count: '', //次数
                type: 1,
                frequency: '', //频率
            }
            this.showHfreq = false
            this.formData = {
                alarmType: '',
                timeInterval: 0,
                timeUnit: 'm',
                timeNum: '',
                systemVoiceStatus: false,
                systemVoiceFileId: '',
                systemVoiceUrl: '',
                cameraVoiceStatus: false,
                cameraVoiceIntervalFlag: false,
            }
        },
        // 高频得次数变化时间
        countBlur(val) {
            if (Number.isNaN(Number(this.hfField.count))) this.hfField.count = 1
            if (val > 100) this.hfField.count = 100
            else if (val < 1) this.hfField.count = 1
            else this.hfField.count = Math.floor(this.hfField.count)
        },
        // 高频得次数变化时间
        freqBlur() {
            if (Number.isNaN(Number(this.hfField.frequency))) this.hfField.frequency = 1
            if (this.hfField.frequency < 1) this.hfField.frequency = 1
            else {
                if (this.hfField.type == 1) {
                    //分钟
                    if (this.hfField.frequency > 1440) {
                        this.hfField.frequency = 1440
                    }
                } else if (this.hfField.type == 2) {
                    //小时
                    if (this.hfField.frequency > 24) {
                        this.hfField.frequency = 24
                    }
                }
                this.hfField.frequency = Math.floor(this.hfField.frequency)
            }
        },
        // 频率单位变化
        frequencyChg(val) {
            if (val == 1) {
                // h => m
                this.hfField.frequency = this.hfField.frequency * 60
            } else {
                // m => h
                this.hfField.frequency = Math.floor(this.hfField.frequency / 60) || 1
            }
        },
        handleFileChange(file, w) {
            file = file.raw
            if (file.type != 'audio/mpeg') return
            this.curFile = file
            this.fileName = file.name
            // file.size / 1024 / 1024
            this.playUrl = URL.createObjectURL(file)
        },
        voicePlay() {
            if (this.player) {
                this.player.pause()
                this.player = null
            }
            this.player = new Audio(this.playUrl)
            this.player.play() //播放 mp3这个音频对象
            // var path = URL.createObjectURL(file[i]);
            //   var audio = document.createElement('audio');
            //   audio.src = path;
            //   audio.controls = true;
            //   audio.volume = '0.2';
            //   $('#audio1').append(audio);
            //暂停
            //player.pause();
            //player.load();
        },
        clearPlay() {
            this.curFile = null
            this.fileName = ''
            if (this.player) {
                this.player.pause()
                this.player = null
            }
            this.playUrl = null
        },
        // 上传文件
        uploadFile() {
            // 打开了系统音频并且上传了文件
            if (this.formData.systemVoiceStatus && !this.curFile) {
                return this.$message.info(this.$t('AlarmType.Tips.fileInput'))
            } else if (this.formData.systemVoiceStatus && this.curFile) {
                if (this.curFile === true) {
                    this.submitForm()
                } else {
                    const formData = new FormData()
                    formData.append('file', this.curFile)
                    this.$api.getUploadUrl({}).then((res) => {
                        if (res.resultCode == 0) {
                            this.$postFetch(res.uploadUrl, formData).then((_file) => {
                                if (_file.resultCode == 0) {
                                    this.formData.systemVoiceFileId = _file.fileId
                                    this.submitForm()
                                } else {
                                    return this.$message.error(this.$t('AlarmType.Tips.fileError'))
                                }
                            })
                        } else {
                            return this.$message.error(this.$t('AlarmType.Tips.fileError'))
                        }
                    })
                }
            } else {
                this.submitForm()
            }
        },
        // 表单提交
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let obj = {
                        // 告警为陌生人员高频人员告警类型时,alarmType传陌生人员的告警值
                        alarmType:
                            this.formData.alarmType === 'STRANGER_HIGH_FREQUENCY_PERSONNEL_ALARM'
                                ? 'STRANGER_ALERT'
                                : this.formData.alarmType,
                        systemVoiceStatus: this.formData.systemVoiceStatus ? 1 : 0,
                        systemVoiceFileId: this.formData.systemVoiceFileId,
                        cameraVoiceStatus: this.formData.cameraVoiceStatus ? 1 : 0,
                        cameraVoiceIntervalFlag: this.formData.cameraVoiceIntervalFlag ? 1 : 0,
                    }
                    if (this.formData.timeInterval != 'custom') {
                        obj.timeNum = this.formData.timeInterval
                        obj.timeType = '0' //不是自定义
                    } else {
                        if (this.formData.timeUnit == 'm') {
                            obj.timeType = '1'
                            obj.timeNum = this.formData.timeNum * 60
                        }
                        if (this.formData.timeUnit == 'h') {
                            obj.timeType = '2'
                            obj.timeNum = this.formData.timeNum * 3600
                        }
                    }
                    // 是高频告警
                    if (this.showHfreq) {
                        let dateDefinition = Number(this.hfField.frequency)
                        if (this.hfField.type == 2) dateDefinition = dateDefinition * 60
                        // if (this.hfField.type == 3) dateDefinition = dateDefinition * 60 * 24
                        obj.alarmDefinitionConfig = {
                            type: this.hfField.type + '',
                            dateDefinition: dateDefinition,
                            numDefinition: Number(this.hfField.count),
                            alarmType: 'STRANGER_ALERT',
                        }
                    }
                    this.$api.setAlarmConfig(obj).then((res) => {
                        this.successResult(res, this.$t('public.modifySuccess'))
                    })
                }
            })
        },

        successResult(res, title) {
            if (res.resultCode === 0) {
                this.show = false
                this.$message.success(title)
                this.$parent.handleFind()
            }
            this.maskloading = false
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
.lableTip {
    margin-left: 20px;
    line-height: 38px;
}
.play,
.fileTip {
    margin-left: 20px;
}
.fileName {
    max-width: 60%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.hfrule {
    &-item {
        height: 32px;
        .input1,
        .input2 {
            width: 100px;
            margin-left: 10px;
        }
        .input2 {
            margin-right: 10px;
        }
    }
}
</style>
