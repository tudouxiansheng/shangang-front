<template>
  <!-- 遮挡告警设置 -->
  <div id="cameraOcclusionAlarm">
    <p v-if="!zteIfShow" class="zteNoShow">
      <span style="color: #f56c6c">*</span>
      {{ frontDrive }}{{ $t('frontParameterConfiguration.driveNotSupport') }}
    </p>
    <div v-if="zteIfShow">
      <el-checkbox
        v-model="ruleForm.bEnableVideoHide"
        :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
      ></el-checkbox>
      <p class="enableVideoHide">
        {{ $t('frontParameterConfiguration.enableVideoHide') }}
      </p>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :label-width="locale == 'en' ? '310px' : '190px'"
        size="small"
        label-position="left"
        style="display: flex"
      >
        <div style="width: 65%">
          <el-form-item
            :label="$t('frontParameterConfiguration.autoClearAlarmTime') + '：'"
            prop="uiAutoClearAlarmTime"
          >
            <el-input
              v-model="ruleForm.uiAutoClearAlarmTime"
              :placeholder="$t('frontParameterConfiguration.inputAutoClearAlarmTime')"
              style="width: 300px"
              clearable
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('frontParameterConfiguration.sensitivity') + '：'"
            prop="uiSensitivity"
          >
            <el-input
              v-model="ruleForm.uiSensitivity"
              :placeholder="$t('frontParameterConfiguration.inputSensitivity')"
              style="width: 300px"
              clearable
              :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
            ></el-input>
          </el-form-item>
        </div>

        <div style="width: 35%">
          <div id="father" class="occlusionAlarmContain">
            <div id="occlusionAlarmDiv" @mousedown="osdSmallDown($event)">
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
        <el-button class="cancelBtn" @click="cancelDialog">{{ $t('public.cancel') }}</el-button>
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

      //密码显示隐藏
      pwdType: 'password',
      ruleForm: {
        bEnableVideoHide: '', //启用视频遮挡告警
        uiAutoClearAlarmTime: 120, //告警检测时间间隔（秒）
        uiSensitivity: '', //视频遮挡灵敏度
        left: '', //X坐标
        right: '', //右边区域
        top: '', //Y坐标
        bottom: '' //底部区域
      },

      rules: {
        uiAutoClearAlarmTime: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputAutoClearAlarmTime'),
            trigger: 'change'
          },
          {
            pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/,
            message: this.$t('frontParameterConfiguration.occAlarmCheckFormat')
          }
        ],
        uiSensitivity: [
          {
            required: true,
            message: this.$t('frontParameterConfiguration.inputSensitivity'),
            trigger: 'change'
          },
          {
            pattern: /^[1-5]$/,
            message: this.$t('frontParameterConfiguration.occSensitivityFormat')
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
      this.viewOcclusionAlarm()
    }
    //用户权限判断
    this.PermissionManage = await permissions(176)
  },

  methods: {
    //视频遮挡告警信息查看
    viewOcclusionAlarm() {
      this.$api.cameraOcclusionInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          if (res.enableVideoHide == 1) {
            this.ruleForm.bEnableVideoHide = true
          } else {
            this.ruleForm.bEnableVideoHide = false
          }

          this.ruleForm.uiAutoClearAlarmTime = res.autoClearAlarmTime
          this.ruleForm.uiSensitivity = res.sensitivity

          //坐标
          let occlusionAlarmDiv = document.getElementById('occlusionAlarmDiv')
          occlusionAlarmDiv.style.left = res.left * 300 + 'px'
          occlusionAlarmDiv.style.top = res.top * 300 + 'px'

          occlusionAlarmDiv.style.width = (res.right - res.left) * 300 + 'px'
          occlusionAlarmDiv.style.height = (res.bottom - res.top) * 300 + 'px'
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
      var box = document.getElementById('occlusionAlarmDiv')
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
          let occlusionAlarmDiv = document.getElementById('occlusionAlarmDiv')
          //视频遮挡告警设置
          let cameraOcclusionConfigObj = {
            cameraId: this.$route.query.cameraId,
            enableVideoHide: this.ruleForm.bEnableVideoHide ? 1 : 0,
            autoClearAlarmTime: this.ruleForm.uiAutoClearAlarmTime,
            sensitivity: this.ruleForm.uiSensitivity,
            left: (occlusionAlarmDiv.offsetLeft / 300).toFixed(6),
            top: (occlusionAlarmDiv.offsetTop / 300).toFixed(6),
            right: (
              (occlusionAlarmDiv.offsetLeft + occlusionAlarmDiv.offsetWidth - 2) /
              300
            ).toFixed(6),
            bottom: (
              (occlusionAlarmDiv.offsetTop + occlusionAlarmDiv.offsetHeight - 2) /
              300
            ).toFixed(6)
          }

          this.$api.cameraOcclusionConfig(cameraOcclusionConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewOcclusionAlarm()
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
#cameraOcclusionAlarm {
  padding-left: 10px;
  .enableVideoHide {
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin-top: 0px;
    margin-left: 5px;
  }
  .occlusionAlarmContain {
    height: 300px;
    width: 300px;
    position: absolute;
    border: 1px solid #eee;
  }
  #occlusionAlarmDiv {
    display: block;
    position: absolute;
    cursor: pointer;
    width: 100px;
    height: 100px;
    border: 1px solid #ff3300;
    top: 0px;
    left: 0px;
  }
  .el-form-item__error {
    width: 300px;
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
