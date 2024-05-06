<template>
  <!-- 视频编码设置 -->
  <div id="videoEncode">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '170px' : '100px'"
      size="small"
      label-position="left"
      style="display: flex"
    >
      <div style="width: 50%; padding-right: 10px">
        <el-form-item
          :label="$t('frontParameterConfiguration.streamType') + '：'"
          prop="streamType"
        >
          <el-select
            v-model="ruleForm.streamType"
            :placeholder="$t('frontParameterConfiguration.selectStreamType')"
            @change="changeStreamType"
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          >
            <el-option
              :label="$t('frontParameterConfiguration.streamType0')"
              :value="0"
            ></el-option>
            <el-option
              :label="$t('frontParameterConfiguration.streamType1')"
              :value="1"
            ></el-option>
            <el-option
              :label="$t('frontParameterConfiguration.streamType2')"
              :value="2"
            ></el-option>
            <el-option
              :label="$t('frontParameterConfiguration.streamType3')"
              :value="3"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.encodeType') + '：'"
          prop="encodeType"
        >
          <el-select
            v-model="ruleForm.encodeType"
            :placeholder="$t('frontParameterConfiguration.selectEncodeType')"
          >
            <el-option label="H.264" value="1"></el-option>
            <el-option label="H265" value="6"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Profile：" prop="profile">
          <el-select
            v-model="ruleForm.profile"
            :placeholder="$t('frontParameterConfiguration.selectProfile')"
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          >
            <el-option label="BP" :value="1"></el-option>
            <el-option label="EP" :value="2"></el-option>
            <el-option label="MP" :value="3"></el-option>
            <el-option label="HP" :value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.frameInterval') + '：'"
          prop="frameInterval"
        >
          <el-input
            v-model="ruleForm.frameInterval"
            :placeholder="$t('frontParameterConfiguration.inputFrameInterval')"
            clearable
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.resolution') + '：'"
          prop="resolution"
        >
          <el-select
            v-model="ruleForm.resolution"
            :placeholder="$t('frontParameterConfiguration.selectResolution')"
          >
            <el-option label="176*144" value="176*144"></el-option>
            <el-option label="320*240" value="320*240"></el-option>
            <el-option label="352*288" value="352*288"></el-option>
            <el-option label="528*384" value="528*384"></el-option>
            <el-option label="704*288" value="704*288"></el-option>
            <el-option label="720*288" value="720*288"></el-option>
            <el-option label="640*480" value="640*480"></el-option>
            <el-option label="704*576" value="704*576"></el-option>
            <el-option label="720*576" value="720*576"></el-option>
            <el-option label="800*600" value="800*600"></el-option>
            <el-option label="1024*768" value="1024*768"></el-option>
            <el-option label="1280*720" value="1280*720"></el-option>
            <el-option label="1280*960" value="1280*960"></el-option>
            <el-option label="1600*1200" value="1600*1200"></el-option>
            <el-option label="1600*2540" value="1600*2540"></el-option>
            <el-option label="1920*1080" value="1920*1080"></el-option>
            <el-option label="2560*1920" value="2560*1920"></el-option>
            <el-option label="2048*1536" value="2048*1536"></el-option>
            <el-option label="2448*2048" value="2448*2048"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.picQuality') + '：'"
          prop="picQuality"
        >
          <el-select
            v-model="ruleForm.picQuality"
            :placeholder="$t('frontParameterConfiguration.selectPicQuality')"
            disabled
          >
            <el-option
              :label="$t('frontParameterConfiguration.picQuality0')"
              :value="0"
            ></el-option>
            <el-option
              :label="$t('frontParameterConfiguration.picQuality1')"
              :value="1"
            ></el-option>
            <el-option
              :label="$t('frontParameterConfiguration.picQuality2')"
              :value="2"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="width: 50%; padding-left: 10px">
        <el-form-item
          :label="$t('frontParameterConfiguration.transProtocol') + '：'"
          prop="transProtocol"
        >
          <el-radio-group v-model="ruleForm.transProtocol">
            <el-radio label="1" text-color="#333">RTP over UDP</el-radio>
            <el-radio label="2" text-color="#333">RTP over TCP</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.pktProtocol') + '：'"
          prop="pktProtocol"
        >
          <el-radio-group v-model="ruleForm.pktProtocol">
            <el-radio
              label="1"
              text-color="#333"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            >
              ES
            </el-radio>
            <el-radio
              label="2"
              text-color="#333"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            >
              PS
            </el-radio>
            <el-radio
              label="3"
              text-color="#333"
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            >
              TS
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          :label="$t('frontParameterConfiguration.bitRateType') + '：'"
          prop="bitRateType"
        >
          <el-radio-group v-model="ruleForm.bitRateType">
            <el-radio :label="0" text-color="#333">
              {{ $t('frontParameterConfiguration.bitRateType0') }}
            </el-radio>
            <el-radio :label="1" text-color="#333">
              {{ $t('frontParameterConfiguration.bitRateType1') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.frameRate') + '：'" prop="frameRate">
          <el-input
            v-model="ruleForm.frameRate"
            :placeholder="$t('frontParameterConfiguration.inputFrameRate')"
            clearable
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('frontParameterConfiguration.bitRate') + '：'" prop="bitRate">
          <el-input
            v-model="ruleForm.bitRate"
            :placeholder="$t('frontParameterConfiguration.inputBitRate')"
            clearable
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="button">
      <el-button
        v-if="PermissionManage"
        type="primary"
        class="sureBtn"
        @click="submitForm('ruleForm', 0)"
      >
        {{ $t('public.confirm') }}
      </el-button>
      <el-button class="cancelBtn" @click="cancelDialog">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button
        v-if="PermissionManage"
        type="primary"
        class="cancelBtn"
        @click="submitForm('ruleForm', 1)"
      >
        {{ $t('frontParameterConfiguration.apply') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      //用户权限判断
      PermissionManage: true,
      //密码显示隐藏
      ruleForm: {
        streamType: '', //码流类型
        encodeType: '', //编码格式
        transProtocol: '', //传输协议
        profile: '', //Profile
        frameInterval: '', //I帧间隔
        resolution: '', //分辨率
        picQuality: '', //监控平台摄像机编码
        frameRate: '', //帧率
        bitRate: '', //码率
        pktProtocol: '', //打包协议
        bitRateType: '' //码率类型
      },
      cameraStreamList: [],
      rules: {
        streamType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectStreamType'),
            trigger: 'change'
          }
        ],
        transProtocol: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.chooseTransProtocol'),
            trigger: 'change'
          }
        ],
        profile: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectProfile'),
            trigger: 'change'
          }
        ],
        frameInterval: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputFrameInterval'),
            trigger: 'change'
          }
        ],
        resolution: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectResolution'),
            trigger: 'change'
          }
        ],
        picQuality: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectPicQuality'),
            trigger: 'change'
          }
        ],
        frameRate: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputFrameRate'),
            trigger: 'change'
          }
        ],
        bitRate: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputBitRate'),
            trigger: 'change'
          }
        ],
        pktProtocol: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectPktProtocol'),
            trigger: 'change'
          }
        ],
        bitRateType: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.selectBitRateType'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    })
  },
  async mounted() {
    //用户权限判断
    this.PermissionManage = await permissions(168)
    this.viewVideoEncode()
  },

  methods: {
    //视频编码查看
    viewVideoEncode() {
      this.$api.cameraStreamInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          this.cameraStreamList = res.cameraStreamList
          Object.assign(this.ruleForm, this.cameraStreamList[0])
        }
      })
    },
    //变化码流类型
    changeStreamType(streamType) {
      this.$refs.ruleForm.resetFields()
      let obj = this.cameraStreamList.find(item => {
        return item.streamType == streamType
      })
      obj && Object.assign(this.ruleForm, obj)
      this.ruleForm.streamType = streamType
    },

    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //视频编码设置
          let cameraStreamConfigObj = {
            cameraId: this.$route.query.cameraId,
            cameraStreamList: [
              {
                streamType: this.ruleForm.streamType,
                transProtocol: this.ruleForm.transProtocol,
                encodeType: this.ruleForm.encodeType,
                profile: Number(this.ruleForm.profile),
                frameInterval: Number(this.ruleForm.frameInterval),
                resolution: this.ruleForm.resolution,
                picQuality: this.ruleForm.picQuality,
                pktProtocol: this.ruleForm.pktProtocol,
                bitRateType: this.ruleForm.bitRateType,
                frameRate: this.ruleForm.frameRate,
                bitRate: this.ruleForm.bitRate
              }
            ]
          }
          this.$api.cameraStreamConfig(cameraStreamConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewVideoEncode()
              }
            }
          })
        }
      })
    },

    //关闭谈框
    cancelDialog() {
      let param = {
        url: '/AIV-MP/#/config/pu-config' + this.$route.query.cameraId
      }
      this.$webkitProc('close_dialog', JSON.stringify(param))
    }
  }
}
</script>

<style lang="scss">
#videoEncode {
  height: 100%;
}
</style>
