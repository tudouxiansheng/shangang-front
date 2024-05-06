<template>
  <!-- 移动侦测设置 -->
  <div id="cameraVmd">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ frontDrive }}{{ $t('frontParameterConfiguration.driveNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-checkbox
        v-model="ruleForm.motionDetectionEnable"
        :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
      ></el-checkbox>
      <p class="motionDetectionEnable">
        {{ $t('frontParameterConfiguration.motionDetectionEnable') }}
      </p>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '310px' : '190px'"
        size="small"
        label-position="left"
        style="display: flex; justify-content: center"
      >
        <div style="width: 65%">
          <el-form-item
            :label="$t('frontParameterConfiguration.autoClearAlarmTime') + '：'"
            prop="autoClearAlarmTime"
          >
            <el-input
              v-model="ruleForm.autoClearAlarmTime"
              :placeholder="$t('frontParameterConfiguration.inputAutoClearAlarmTime')"
              style="width: 300px"
              clearable
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.sensitivity') + '：'"
            prop="sensitivity"
          >
            <el-input
              v-model="ruleForm.sensitivity"
              :placeholder="$t('frontParameterConfiguration.inputSensitivity')"
              style="width: 300px"
              clearable
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.detectInterval') + '：'"
            prop="detectInterval"
          >
            <el-input
              v-model="ruleForm.detectInterval"
              :placeholder="$t('frontParameterConfiguration.inputDetectInterval')"
              style="width: 300px"
              clearable
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-input>
          </el-form-item>
        </div>

        <div style="width: 35%">
          <div id="father" class="vmdContain">
            <div id="vmdDiv" @mousedown="osdSmallDown($event)" style="">
              <div class="coor" id="coor" @mousedown="bigger($event)"></div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="button">
        <el-button
          v-if="PermissionManage && !(frontPlatType == 5 && frontDrive == 'T28181')"
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
          v-if="PermissionManage && !(frontPlatType == 5 && frontDrive == 'T28181')"
          type="primary"
          class="cancelBtn"
          @click="submitForm('ruleForm', 1)"
        >
          {{ $t('frontParameterConfiguration.apply') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      //中兴判断
      zteIfShow: true,
      //用户权限判断
      PermissionManage: true,
      locale: localStorage.getItem('locale'),

      ruleForm: {
        motionDetectionEnable: '', //启用前端移动侦测
        platformMotionDetection: '', //是否使能平台运动检测告警
        autoClearAlarmTime: '', //告警检测时间间隔（秒）
        sensitivity: '', //移动侦测灵敏度
        detectInterval: 10, //移动侦测时间间隔（秒）
        left: '', //X坐标
        right: '', //右边区域
        top: '', //Y坐标
        bottom: '' //底部区域
      },

      rules: {
        autoClearAlarmTime: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputAutoClearAlarmTime'),
            trigger: 'change'
          },
          {
            pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/,
            message: this.$t('frontParameterConfiguration.vmdAlarmCheckFormat')
          }
        ],
        sensitivity: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSensitivity'),
            trigger: 'change'
          },
          {
            pattern: /^[1-5]$/,
            message: this.$t('frontParameterConfiguration.vmdSensitivityFormat')
          }
        ],
        detectInterval: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputDetectInterval'),
            trigger: 'change'
          },
          {
            pattern: /^([12][0-9]|30|[1-9])$/,
            message: this.$t('frontParameterConfiguration.vmdIntervalFormat')
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
    //中兴判断
    if (this.frontPlatType == 9 && this.frontDrive == 'T28181') {
      this.zteIfShow = false
    } else {
      this.viewCameraVmdInfo()
    }
    //用户权限判断
    this.PermissionManage = await permissions(174)
  },

  methods: {
    //移动侦测查看
    viewCameraVmdInfo() {
      this.$api.cameraVmdInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          if (res.motionDetectionEnable == 0) {
            this.ruleForm.motionDetectionEnable = false
          } else {
            this.ruleForm.motionDetectionEnable = true
          }

          this.ruleForm.platformMotionDetection = res.platformMotionDetection

          this.ruleForm.autoClearAlarmTime = res.autoClearAlarmTime
          this.ruleForm.sensitivity = res.sensitivity
          this.ruleForm.detectInterval = res.detectInterval

          let box = document.getElementById('vmdDiv')
          box.style.left = res.left * 300 + 'px'
          box.style.top = res.top * 300 + 'px'
          box.style.width = (res.right - res.left) * 300 + 'px'
          box.style.height = (res.bottom - res.top) * 300 + 'px'
        }
      })
    },
    osdSmallDown(event) {
      var osmall = document.getElementById(event.currentTarget.id)

      if (osmall.className == 'coor') return false

      var obig = osmall.parentElement
      //获取obig的宽度高度数字
      var maxX = obig.offsetWidth
      var maxY = obig.offsetHeight

      var osmallWidth = osmall.offsetWidth
      var osmallHeight = osmall.offsetHeight

      var moveX = maxX - 2 - osmallWidth
      var moveY = maxY - 2 - osmallHeight

      var e = e || window.event
      /*用于保存小的div拖拽前的坐标*/
      osmall.startX = e.clientX - osmall.offsetLeft
      osmall.startY = e.clientY - osmall.offsetTop

      let _this = this
      /*鼠标的移动事件*/
      document.onmousemove = function (e) {
        var e = e || window.event
        osmall.style.left = e.clientX - osmall.startX + 'px'
        osmall.style.top = e.clientY - osmall.startY + 'px'
        var x = parseFloat(e.clientX - osmall.startX) / 298
        var y = parseFloat(e.clientY - osmall.startY) / 298
        /*对于大的DIV四个边界的判断*/
        if (e.clientX - osmall.startX <= 0) {
          osmall.style.left = 0 + 'px'
          x = 0
        }
        if (e.clientY - osmall.startY <= 0) {
          osmall.style.top = 0 + 'px'
          y = 0
        }
        if (e.clientX - osmall.startX >= moveX) {
          osmall.style.left = moveX + 'px'
          x = parseFloat(298 - osmallWidth) / 298
        }
        if (e.clientY - osmall.startY >= moveY) {
          osmall.style.top = moveY + 'px'
          y = parseFloat(298 - osmallHeight) / 298
        }
      }
      /*鼠标的抬起事件,终止拖动*/
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    bigger(e) {
      //放大缩小功能
      // 图片缩放效果
      var box = document.getElementById('vmdDiv')
      var fa = document.getElementById('father')

      // 阻止冒泡,避免缩放时触发移动事件
      e.stopPropagation()
      e.preventDefault()

      var pos = {
        w: box.offsetWidth,
        h: box.offsetHeight,
        x: e.clientX,
        y: e.clientY
      }
      fa.onmousemove = function (ev) {
        ev.preventDefault()
        // 设置图片的最小缩放为30*30
        var w = Math.max(30, ev.clientX - pos.x + pos.w)
        var h = Math.max(30, ev.clientY - pos.y + pos.h)

        // 设置图片的最大宽高
        w = w >= fa.offsetWidth - box.offsetLeft ? fa.offsetWidth - box.offsetLeft : w
        h = h >= fa.offsetHeight - box.offsetTop ? fa.offsetHeight - box.offsetTop : h
        box.style.width = w - 4 + 'px'
        box.style.height = h - 4 + 'px'
      }
      fa.onmouseleave = function () {
        fa.onmousemove = null
        fa.onmouseup = null
      }
      fa.onmouseup = function () {
        fa.onmousemove = null
        fa.onmouseup = null
      }
    },
    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let vmdDiv = document.getElementById('vmdDiv')

          //移动侦测设置
          let cameraVmdConfigObj = {
            cameraId: this.$route.query.cameraId,
            motionDetectionEnable: this.ruleForm.motionDetectionEnable ? 1 : 0,
            platformMotionDetection: this.ruleForm.platformMotionDetection,
            autoClearAlarmTime: this.ruleForm.autoClearAlarmTime,
            detectInterval: this.ruleForm.detectInterval,
            sensitivity: this.ruleForm.sensitivity,
            left: (vmdDiv.offsetLeft / 300).toFixed(6),
            top: (vmdDiv.offsetTop / 300).toFixed(6),
            right: ((vmdDiv.offsetLeft + vmdDiv.offsetWidth - 2) / 300).toFixed(6),
            bottom: ((vmdDiv.offsetTop + vmdDiv.offsetHeight - 2) / 300).toFixed(6)
          }

          this.$api.cameraVmdConfig(cameraVmdConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewCameraVmdInfo()
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
#cameraVmd {
  padding-left: 10px;
  .el-form-item__error {
    width: 300px;
  }
  .motionDetectionEnable {
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin-top: 0px;
    margin-left: 5px;
  }
  .vmdContain {
    height: 300px;
    width: 300px;
    position: absolute;
    border: 1px solid #eee;
  }
  #vmdDiv {
    display: block;
    position: absolute;
    cursor: pointer;
    width: 100px;
    height: 100px;
    border: 1px solid #ff3300;
    top: 0px;
    left: 0px;
  }
  #coor {
    width: 10px;
    height: 10px;
    overflow: hidden;
    cursor: se-resize;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
