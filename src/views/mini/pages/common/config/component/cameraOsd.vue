<template>
  <!-- OSD参数设置 -->
  <div id="cameraOsd">
    <el-checkbox
      v-model="ruleForm.enableOSD"
      :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
    ></el-checkbox>
    <p class="enableOSDInfo">
      {{ $t('frontParameterConfiguration.enableOSDInfo') }}
    </p>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      :label-width="locale == 'en' ? '155px' : '120px'"
      size="small"
      label-position="left"
      style="display: flex"
    >
      <div style="width: 65%">
        <div class="enableOSDTime">
          <el-checkbox
            v-model="ruleForm.checkedTime"
            style="margin-bottom: 25px"
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          >
            {{ $t('frontParameterConfiguration.enableOSDTime') }}
          </el-checkbox>
          <el-form-item :label="$t('frontParameterConfiguration.timeX') + '：'" prop="fTimeX">
            <el-input
              v-model="ruleForm.fTimeX"
              :placeholder="$t('frontParameterConfiguration.inputTimeX')"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('frontParameterConfiguration.timeY') + '：'" prop="fTimeY">
            <el-input
              v-model="ruleForm.fTimeY"
              :placeholder="$t('frontParameterConfiguration.inputTimeY')"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('frontParameterConfiguration.timeFormat') + '：'"
            prop="uiTimeFormat"
          >
            <el-select
              v-model="ruleForm.uiTimeFormat"
              :placeholder="$t('public.ptzTypePrompt')"
              :disabled="!ruleForm.checkedTime || (frontPlatType == 5 && frontDrive == 'T28181')"
            >
              <el-option
                :label="'--' + $t('frontParameterConfiguration.select') + '--'"
                value=""
              ></el-option>
              <el-option label="YYYY-MM-DD HH:Mi:SS" :value="1"></el-option>
              <el-option
                :label="$t('frontParameterConfiguration.osdTimeFormat') + ' HH:Mi:SS'"
                :value="2"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="enableOSDName">
          <el-checkbox
            v-model="ruleForm.checkedText"
            style="margin-bottom: 25px"
            :disabled="frontPlatType == 5 && frontDrive == 'T28181'"
          >
            {{ $t('frontParameterConfiguration.enableOSDName') }}
          </el-checkbox>
          <el-form-item :label="$t('frontParameterConfiguration.timeX') + '：'" prop="fTextX">
            <el-input
              v-model="ruleForm.fTextX"
              :placeholder="$t('frontParameterConfiguration.inputTimeX')"
              clearable
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('frontParameterConfiguration.timeY') + '：'" prop="fTextY">
            <el-input
              v-model="ruleForm.fTextY"
              :placeholder="$t('frontParameterConfiguration.inputTimeY')"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('frontParameterConfiguration.text') + '：'" prop="cOSDNameText">
            <el-input
              v-model="ruleForm.cOSDNameText"
              :placeholder="$t('frontParameterConfiguration.inputText')"
              clearable
              :disabled="!ruleForm.checkedText || (frontPlatType == 5 && frontDrive == 'T28181')"
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <div style="width: 35%">
        <div id="osdContain">
          <div
            v-show="ruleForm.checkedTime"
            id="osdDateDiv"
            :class="cuType == 4 ? '' : 'osdDateDiv'"
            @mousedown="osdSmallDown($event)"
          >
            {{ ruleForm.uiTimeFormat == '1' ? time : ruleForm.uiTimeFormat == '2' ? time1 : '' }}
          </div>
          <div
            v-show="ruleForm.checkedText"
            id="osdContentDiv"
            :class="cuType == 4 ? '' : 'osdContentDiv'"
            @mousedown="osdSmallDown1($event)"
          >
            {{ ruleForm.cOSDNameText }}
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
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import { getFormatDate, getFormatDate1 } from '@/utils/common/mutil'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      //用户权限判断
      PermissionManage: true,
      cuType: sessionStorage.getItem('cuType'),
      //格式化时间
      time: getFormatDate(new Date().getTime()),
      time1: getFormatDate1(new Date().getTime()),

      ruleForm: {
        enableOSD: 0, //是否显示OSD信息
        fTimeX: '0.000000', //X坐标
        fTimeY: '0.000000', //Y坐标
        fTextX: '0.000000', //X坐标
        fTextY: '0.000000', //Y坐标
        uiTimeFormat: '', //时间显示格式
        cOSDNameText: '${time@sys: YYYY-MM-DD}', //文字内容
        checkedText: 1, //显示文本
        checkedTime: 0 //显示时间
      }
    }
  },
  computed: {
    ...mapState({
      frontPlatType: state => state.config.frontPlatType,
      frontDrive: state => state.config.frontDrive
    }),
    rules() {
      return {
        cOSDNameText: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async mounted() {
    //用户权限判断
    this.PermissionManage = await permissions(172)
    this.viewOsdInfo()
  },
  methods: {
    //Osd信息查看
    viewOsdInfo() {
      this.$api.cameraOSDInfo({ cameraId: this.$route.query.cameraId }).then(res => {
        if (res.resultCode == 0) {
          if (res.enableOSD == 0) {
            this.ruleForm.enableOSD = false
          } else {
            this.ruleForm.enableOSD = true
          }
          this.ruleForm.fTimeX = res.timeX
          this.ruleForm.fTimeY = res.timeY
          this.ruleForm.fTextX = res.left
          this.ruleForm.fTextY = res.top
          this.ruleForm.uiTimeFormat = res.timeFormat
          this.ruleForm.cOSDNameText = res.nameText
          if (res.enableOSDTime == 0) {
            this.ruleForm.checkedTime = false
          } else {
            this.ruleForm.checkedTime = true
          }

          if (res.enableOSDName == 0) {
            this.ruleForm.checkedText = false
          } else {
            this.ruleForm.checkedText = true
          }

          let osdDateDiv = document.getElementById('osdDateDiv')
          osdDateDiv.style.left = this.ruleForm.fTimeX * 100 + '%'
          osdDateDiv.style.top = this.ruleForm.fTimeY * 100 + '%'

          let osdContentDiv = document.getElementById('osdContentDiv')
          osdContentDiv.style.left = this.ruleForm.fTextX * 100 + '%'
          osdContentDiv.style.top = this.ruleForm.fTextY * 100 + '%'
        }
      })
    },
    osdSmallDown(event) {
      var osmall = document.getElementById(event.currentTarget.id)

      var obig = osmall.parentElement
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

        _this.ruleForm.fTimeX = x
        _this.ruleForm.fTimeY = y
      }
      /*鼠标的抬起事件,终止拖动*/
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    osdSmallDown1(event) {
      var osmall = document.getElementById(event.currentTarget.id)

      var obig = osmall.parentElement
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

        _this.ruleForm.fTextX = x
        _this.ruleForm.fTextY = y
      }
      /*鼠标的抬起事件,终止拖动*/
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    submitForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //Osd信息设置
          let cameraOSDConfigObj = {
            cameraId: this.$route.query.cameraId,
            enableOSD: this.ruleForm.enableOSD ? 1 : 0,
            enableOSDTime: this.ruleForm.checkedTime ? 1 : 0,
            timeX: this.ruleForm.fTimeX,
            timeY: this.ruleForm.fTimeY,
            timeFormat: this.ruleForm.uiTimeFormat,

            enableOSDName: this.ruleForm.checkedText ? 1 : 0,
            left: this.ruleForm.fTextX,
            top: this.ruleForm.fTextY,
            nameText: this.ruleForm.cOSDNameText
          }
          this.$api.cameraOSDConfig(cameraOSDConfigObj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              if (!type) {
                this.cancelDialog()
              } else {
                this.viewOsdInfo()
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
#cameraOsd {
  .enableOSDInfo {
    font-size: 20px;
    color: #000;
    display: inline-block;
    margin-top: 0px;
    margin-left: 5px;
  }

  .el-input {
    width: 300px;
    .el-input__inner {
      width: 300px;
    }
  }
  .osdContentDiv,
  .osdDateDiv {
    color: #000;
  }
  #osdContain {
    height: 300px;
    width: 300px;
    position: relative;
    border: 1px solid #eee;
  }
  #osdDateDiv,
  #osdContentDiv {
    position: absolute;
    cursor: pointer;
    width: 135px;
    height: 20px;
    border: 1px solid #ff3300;
    top: 0px;
    left: 0px;
  }
}
</style>
