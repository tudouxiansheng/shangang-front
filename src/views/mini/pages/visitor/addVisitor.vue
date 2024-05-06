<template>
  <!--新增访客-->
  <CusDialog
    :visible="visible"
    @close="dialogClosed"
    @open="dialogOpen"
    :isDetail="isDetail"
    defaultBgc="bigBgc"
    :title="addVisitorOrDetail == 1 ? $t('visitor.register') : $t('public.detail')"
  >
    <el-scrollbar class="scrollbar" slot="body">
      <el-form ref="form" :class="isZh ? '' : 'en'" :model="form" :rules="rules" label-suffix="：">
        <!--被访人信息-->
        <div class="module1">
          <div class="m-title">
            <div class="m-line"></div>
            <div class="m-name">{{ $t('visitor.IntervieweeInformation') }}</div>
          </div>
          <div class="m-content">
            <div class="m-wrapper">
              <div class="m-left">
                <el-form-item :label="$t('visitor.intervieweeName')" prop="intervieweeName">
                  <el-input
                    v-model="form.intervieweeName"
                    class="myinput"
                    clearable
                    :placeholder="$t('public.placeholderEnter', { type: $t('visitor.intervieweeName') })"
                    :disabled="addVisitorOrDetail == 2"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="m-right">
                <el-form-item :label="$t('visitor.mobile')" prop="intervieweeMobile">
                  <el-input
                    v-model="form.intervieweeMobile"
                    class="myinput"
                    clearable
                    :placeholder="$t('public.placeholderEnter', { type: $t('visitor.mobile') })"
                    :disabled="addVisitorOrDetail == 2"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!--访客信息-->
        <div class="module1 module2">
          <div class="m-title">
            <div class="m-line"></div>
            <div class="m-name">{{ $t('visitor.visitorInformation') }}</div>
          </div>
          <div class="m-content">
            <div class="m-wrapper-column">
              <div class="m-center">
                <el-form-item :label="$t('visitor.photo')" prop="facePhoto">
                  <div class="wr-icon-picture">
                    <div class="avatar-uploader" v-if="addVisitorOrDetail == 2">
                      <img v-if="form.facePhoto" v-viewer :src="form.facePhoto" />
                    </div>
                    <el-upload
                      v-else
                      class="avatar-uploader"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :before-upload="uploadClick"
                      :on-success="handleAvatarSuccess"
                      accept="image/*"
                    >
                      <img v-if="imageUrl || form.facePhoto" :src="imageUrl || form.facePhoto" />
                      <i v-else class="el-icon-plus avatar-uploader-icon2"></i>
                    </el-upload>
                  </div>
                </el-form-item>
              </div>
              <div class="flexRow">
                <div class="m-left">
                  <el-form-item :label="$t('visitor.visitorName')" prop="visitorName">
                    <el-input
                      v-model="form.visitorName"
                      class="myinput"
                      clearable
                      :placeholder="$t('public.placeholderEnter', { type: $t('visitor.visitorName') })"
                      :disabled="addVisitorOrDetail == 2"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('visitor.idCard')" prop="visitorIdCard">
                    <el-input
                      v-model="form.visitorIdCard"
                      clearable
                      class="myinput"
                      :placeholder="$t('public.placeholderEnter', { type: $t('visitor.idCard') })"
                      :disabled="addVisitorOrDetail == 2"
                    ></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('visitor.reason')" prop="visitType">
                    <el-select
                      class="myinput"
                      v-model="form.visitType"
                      :disabled="addVisitorOrDetail == 2"
                      :placeholder="$t('public.placeholderSelect', { type: $t('visitor.reason') })"
                    >
                      <el-option
                        v-for="item in visitTypeList"
                        :key="item.value"
                        :label="isZh ? item.label : item.labelEn"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="m-right">
                  <el-form-item :label="$t('visitor.mobile')" prop="visitorMobile">
                    <el-input
                      v-model="form.visitorMobile"
                      clearable
                      :placeholder="$t('public.placeholderEnter', { type: $t('visitor.mobile') })"
                      class="myinput"
                      :disabled="addVisitorOrDetail == 2"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('application.plateNum')" prop="carPlate">
                    <el-input
                      v-model="form.carPlate"
                      class="myinput"
                      :placeholder="
                        addVisitorOrDetail == 2
                          ? ''
                          : $t('public.placeholderEnter', { type: $t('application.plateNum') })
                      "
                      :disabled="addVisitorOrDetail == 2"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="m-center" style="display: flex; justify-content: flex-start">
              <el-form-item :label="$t('visitor.visitTime')" prop="startTime">
                <el-time-picker
                  v-model="form.startTime"
                  @change="handleValidTime"
                  :editable="false"
                  :format="addVisitorOrDetail == 2 ? 'yyyy-MM-dd HH:mm:ss' : 'HH:mm:ss'"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="{
                    selectableRange: selectableStartRange,
                  }"
                  :placeholder="$t('public.placeholderEnter', { type: $t('public.startTime') })"
                  :disabled="addVisitorOrDetail == 2"
                >
                </el-time-picker>
                <span style="color: white">-</span>
              </el-form-item>
              <el-form-item prop="endTime" class="two">
                <el-time-picker
                  v-model="form.endTime"
                  :editable="false"
                  @change="handleValidTime"
                  :format="addVisitorOrDetail == 2 ? 'yyyy-MM-dd HH:mm:ss' : 'HH:mm:ss'"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="{
                    selectableRange: selectableEndRange,
                  }"
                  :placeholder="$t('public.placeholderEnter', { type: $t('public.endTime') })"
                  :disabled="addVisitorOrDetail == 2"
                >
                </el-time-picker>
              </el-form-item>
            </div>
            <div class="m-center">
              <el-form-item :label="$t('visitor.remark')" prop="visitRemark">
                <el-input
                  v-model="form.visitRemark"
                  clearable
                  type="textarea"
                  resize="none"
                  :placeholder="
                    addVisitorOrDetail == 2 ? '' : $t('public.placeholderEnter', { type: $t('visitor.remark') })
                  "
                  :disabled="addVisitorOrDetail == 2"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <!--防疫信息-->
        <!-- <div
          class="module1 module2 module3"
          v-if="(info.auditType == 1 && isSec) || (info.auditType == 1 && info.securityAuditType != 3)"
        >
          <div class="m-title">
            <div class="m-line"></div>
            <div class="m-name">{{ $t('visitor.healthStatus') }}</div>
          </div>
          <div :class="addVisitorOrDetail != 2 ? 'm-no-cotent' : ''" class="m-content">
            <div class="m-wrapper">
              <div class="m-left">
                <el-form-item
                  :label="$t('visitor.temperature')"
                  prop="temperature"
                  :rules="[
                    {
                      required: form.securityAuditType == 1,
                      message: this.$t('public.placeholderEnter', { type: this.$t('visitor.temperature') }),
                    },
                    {
                      pattern: /^((3[4-9])|40)\.\d{1}$/,
                      message: this.$t('public.placeholderEnter', { type: this.$t('visitor.temperature') }),
                    },
                  ]"
                >
                  <el-input
                    v-model="form.temperature"
                    class="myinput"
                    clearable
                    :disabled="info.securityAuditType != 3"
                    :placeholder="$t('public.placeholderEnter', { type: $t('visitor.temperature') })"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('visitor.healthCode')"
                  :rules="[
                    {
                      required: form.securityAuditType == 1,
                      message: this.$t('public.placeholderSelect', { type: this.$t('visitor.healthCode') }),
                      trigger: 'change',
                    },
                  ]"
                  prop="healthCode"
                >
                  <el-radio-group
                    :disabled="info.securityAuditType != 3"
                    v-model="form.healthCode"
                    @change="handleChangeHealthCode"
                  >
                    <el-radio :label="1">{{ $t('visitor.green') }}</el-radio>
                    <el-radio :label="2">{{ $t('visitor.yellow') }}</el-radio>
                    <el-radio :label="3">{{ $t('visitor.red') }}</el-radio>
                    <el-radio :label="4">{{ $t('visitor.none') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  :label="$t('visitor.testResult')"
                  prop="testResult"
                  :rules="[
                    {
                      required: form.healthCode == 4 && form.securityAuditType == 1,
                      message: $t('public.placeholderSelect', { type: $t('visitor.testResult') }),
                      trigger: 'change',
                    },
                  ]"
                >
                  <el-radio-group v-model="form.testResult" :disabled="info.securityAuditType != 3">
                    <el-radio :label="1">{{ $t('visitor.yin') }}</el-radio>
                    <el-radio :label="2">{{ $t('visitor.yang') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <template v-if="false">
                  <el-form-item label="是否接触过确诊病例：" prop="contactType">
                    <el-radio-group v-model="form.contactType">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="过去14天有哪些症状：" prop="symptom">
                    <el-checkbox-group v-model="symptom" @change="changeGroupBox">
                      <el-checkbox :label="1">无</el-checkbox>
                      <el-checkbox :label="2">咳嗽</el-checkbox>
                      <el-checkbox :label="3">发烧</el-checkbox>
                      <el-checkbox :label="4">呼吸不畅</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>

                  <el-form-item label="备注：" prop="remark">
                    <el-input v-model="form.remark" class="myinput" clearable placeholder="请输入备注信息"></el-input>
                  </el-form-item>
                </template>
              </div>
            </div>
          </div>
        </div> -->
        <template v-if="addVisitorOrDetail == 2">
          <div class="module1 module2">
            <div class="m-title">
              <div class="m-line"></div>
              <div class="m-name">{{ $t('visitor.auditInformation') }}</div>
            </div>
            <div class="m-content">
              <div class="item-wrapper">
                <div class="item">
                  <div class="label">
                    {{ $t('visitor.interviewee') }}<span v-if="info.auditType != 3">({{ info.intervieweeName }})</span>
                  </div>
                  <div class="value" v-if="info.auditType != 3">
                    {{
                      info.auditType == 1
                        ? $t('visitor.pass')
                        : info.auditType == 2
                        ? $t('visitor.reject')
                        : $t('visitor.audit')
                    }}
                  </div>
                </div>
                <div class="item">
                  <div class="label">{{ $t('visitor.auditTime') }}</div>
                  <div class="value" v-if="info.auditType != 3">{{ info.auditTime }}</div>
                </div>
              </div>
              <div class="item-wrapper">
                <div class="item">
                  <div class="label">
                    {{ $t('visitor.admin') }}
                    <span v-if="info.securityAuditType != 3">({{ info.securityAuditName }})</span>
                  </div>
                  <div class="value" v-if="info.securityAuditType != 3">
                    {{
                      info.securityAuditType == 1
                        ? $t('visitor.pass')
                        : info.securityAuditType == 2
                        ? $t('visitor.reject')
                        : $t('visitor.audit')
                    }}
                  </div>
                </div>
                <div class="item">
                  <div class="label">{{ $t('visitor.auditTime') }}</div>
                  <div class="value" v-if="info.securityAuditType != 3">{{ info.securityAuditTime }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="module1 module2" v-if="info.auditType == 1 && info.securityAuditType == 3 && isSec">
            <div class="m-title">
              <div class="m-line"></div>
              <div class="m-name">{{ $t('visitor.securityAudit') }}</div>
            </div>
            <div class="m-content m-no-cotent">
              <el-form-item :label="$t('visitor.auditResult')" prop="securityAuditType">
                <el-radio-group
                  @change="handleClearValidate"
                  v-model="form.securityAuditType"
                  :disabled="info.securityAuditType != 3"
                >
                  <el-radio :label="1">{{ $t('visitor.p') }}</el-radio>
                  <el-radio :label="2">{{ $t('visitor.r') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="form.securityAuditType == 2"
                :label="$t('visitor.rejectReason')"
                prop="securityReason"
              >
                <el-input
                  style="width: 80%"
                  resize="none"
                  type="textarea"
                  v-model="form.securityReason"
                  :placeholder="$t('public.placeholderEnter', { type: $t('visitor.rejectReason') })"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </template>
      </el-form>
    </el-scrollbar>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="info.auditType == 1 && info.securityAuditType == 3 && addVisitorOrDetail != 1 && isSec"
    >
      <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" @click="handleSignInVisitor">{{ $t('public.confirm') }} </el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="addVisitorOrDetail == 1">
      <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
    </div>
  </CusDialog>
</template>

<script>
import { addVisitor, getUploadUrl, signInVisitor, checkInterviewee } from '@/utils/api'
import Dayjs from '../../../../utils/Dayjs'
import fileCheck from '../../../../mixin/fileCheck'

export default {
  props: {
    recordId: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default() {
        return {}
      },
    },
    addVisitorOrDetail: {
      type: Number,
      default: 1,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isDetail() {
      if (this.addVisitorOrDetail == 1) {
        return false
      } else if (
        this.info.auditType == 1 &&
        this.info.securityAuditType == 3 &&
        this.addVisitorOrDetail != 1 &&
        this.isSec
      ) {
        return false
      } else {
        return true
      }
    },
    account() {
      return sessionStorage.getItem('account')
    },
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
    selectableStartRange() {
      let end = '23:59:59'
      if (this.form.endTime) {
        end = Dayjs(this.form.endTime).format('HH:mm:ss')
      }
      let s = Dayjs().format('HH:mm:ss')
      return `${s} - ${end}`
    },
    selectableEndRange() {
      let start = Dayjs().format('HH:mm:ss')
      if (this.form.startTime) {
        start = Dayjs(this.form.startTime).format('HH:mm:ss')
      }
      return `${start} - 23:59:59`
    },
  },
  created() {
    console.log(this.addVisitorOrDetail)
    let str = sessionStorage.getItem('roleId')
    if (str) {
      this.isSec = str.split(',').indexOf('00000000000000000403009999999991') != -1
      this.isAdmin = str.split(',').indexOf('00000000000000000403000000000000') != -1
    }
  },
  mixins: [fileCheck],
  data() {
    var checkphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('public.placeholderEnter', { type: this.$t('public.phone') })))
      } else if (!this.isCellPhone(value)) {
        callback(new Error(this.$t('tips.ext', { type: this.$t('public.phone') })))
      } else {
        callback()
      }
    }
    var getCardTypeNumber = (rule, value, callback) => {
      const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

      if (reg.test(value) === false && value) {
        callback(new Error(this.$t('tips.ext', { type: this.$t('visitor.idCard') })))
      } else {
        callback()
      }
    }
    return {
      isSec: false,
      isAdmin: false,
      form: {
        intervieweeName: '', //被访人姓名
        intervieweeMobile: '',
        visitorName: '', //访客姓名
        temperature: '',
        remark: '',
        facePhoto: '',
        visitType: '',
        visitorMobile: '',
        startTime: '',
        endTime: '',
        // contactType: 2,
        symptom: '', //症状
        visitRemark: '',
        signType: 2,
        address: '',
        visitorIdCard: '',
        securityAuditType: 1,
        healthCode: '',
      },
      symptom: [],
      //1.外卖；2.保洁；3.快递配送；4.维修施工；5.面试；6.其他
      visitTypeList: [
        {
          label: '外卖',
          labelEn: 'Takeout',
          value: 1,
        },
        {
          label: '保洁',
          labelEn: 'Cleaning',
          value: 2,
        },
        {
          label: '快递配送',
          labelEn: 'Express delivery',
          value: 3,
        },
        {
          label: '维修施工',
          labelEn: 'Maintenance construction',
          value: 4,
        },
        {
          label: '面试',
          labelEn: 'Interview',
          value: 5,
        },
        {
          label: '其他',
          labelEn: 'Other',
          value: 6,
        },
      ],
      uploadUrl: '',
      imageUrl: '',
      rules: {
        carPlate: [
          {
            pattern:
              /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([ADF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[ADF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
            message: this.$t('public.placeholderEnter', { type: this.$t('application.plateNum') }),
            trigger: 'blur',
          },
        ],
        intervieweeName: [
          {
            required: true,
            message: this.$t('public.placeholderEnter', { type: this.$t('visitor.intervieweeName') }),
            trigger: 'blur',
          },
          {
            max: 30,
            message: this.$t('tips.size', { type: this.$t('visitor.intervieweeName'), size: 30 }),
            trigger: 'blur',
          },
        ],
        intervieweeMobile: [
          {
            required: true,
            message: this.$t('public.placeholderEnter', { type: this.$t('visitor.mobile') }),
            trigger: 'blur',
          },
          {
            validator: checkphone,
            trigger: 'blur',
          },
        ],
        visitorMobile: [
          {
            required: true,
            message: this.$t('public.placeholderEnter', { type: this.$t('visitor.visitorMobile') }),
            trigger: 'blur',
          },
          {
            validator: checkphone,
            trigger: 'blur',
          },
        ],
        visitorName: [
          {
            required: true,
            message: this.$t('public.placeholderEnter', { type: this.$t('visitor.visitorName') }),
          },
          {
            max: 30,
            message: this.$t('tips.size', { type: this.$t('visitor.visitorName'), size: 30 }),
            trigger: 'blur',
          },
        ],
        facePhoto: [
          {
            required: true,
            message: this.$t('public.upload'),
          },
        ],
        visitorIdCard: [
          {
            message: this.$t('tips.ext', { type: this.$t('visitor.idCard') }),
            validator: getCardTypeNumber,
            trigger: 'blur',
          },
          {
            required: true,
            message: this.$t('public.placeholderEnter', { type: this.$t('visitor.idCard') }),
            trigger: 'blur',
          },
        ],
        visitType: [
          {
            required: true,
            message: this.$t('public.placeholderSelect', { type: this.$t('visitor.reason') }),
          },
        ],
        contactType: [
          {
            required: true,
            message: '请选择是否接触病例',
          },
        ],
        startTime: [
          {
            required: true,
            message: this.$t('public.placeholderSelect', { type: this.$t('public.startTime') }),
          },
        ],
        endTime: [
          {
            required: true,
            message: this.$t('public.placeholderSelect', { type: this.$t('public.endTime') }),
          },
        ],
        visitRemark: [
          {
            message: this.$t('tips.size', { type: this.$t('visitor.remark'), size: 100 }),
            max: 100,
            trigger: 'blur',
          },
        ],
        securityAuditType: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('public.placeholderSelect', { type: this.$t('visitor.auditResult') }),
          },
        ],
        securityReason: [
          {
            message: this.$t('tips.size', { type: this.$t('visitor.rejectReason'), size: 100 }),
            max: 100,
            trigger: 'blur',
          },
        ],
      },
      pickerOptions: {
        disabledDate: (time) => {
          let endDateVal = this.form.endTime
          if (endDateVal) {
            return (
              time.getTime() > new Date(endDateVal).getTime() || time.getTime() > new Date().setHours(23, 59, 59, 999)
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > new Date().setHours(23, 59, 59, 999)
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          let beginDateVal = this.form.startTime
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() || time.getTime() > new Date().setHours(23, 59, 59, 999)
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > new Date().setHours(23, 59, 59, 999)
          }
        },
      },
    }
  },
  methods: {
    handleClearValidate() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    handleChangeHealthCode(val) {
      console.log(val)
      if (val !== 1) {
        this.$set(this.form, 'securityAuditType', 2)
      } else {
        this.$set(this.form, 'securityAuditType', 1)
      }
    },
    async uploadClick(file) {
      let types = ['jpg', 'jpeg', 'png']
      let size = file.size / 1024 / 1024 <= 5
      if (types.indexOf(file.type.split('/')[1]) == -1) {
        this.$message.warning(this.$t('tips.format'))
        return false
      }
      if (!size) {
        this.$message.warning(this.$t('tips.max', { size: 5 }))
        return false
      }
      if (!this.checkFileLength(file.name)) return false
      let res = await getUploadUrl({})
      if (res.resultCode === 0) {
        this.uploadUrl = res.uploadUrl
      }
    },
    // 图片上传成功
    async handleAvatarSuccess(res, file) {
      if (res.resultCode === 0) {
        this.form.facePhoto = res.fileId
        this.imageUrl = URL.createObjectURL(file.raw)
      }
    },
    handleSignInVisitor() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          let params = {
            recordId: this.form.recordId,
            securityType: this.form.securityAuditType,
            securityReason: this.form.securityReason,
            temperature: this.form.temperature,
            healthCode: this.form.healthCode,
            testResult: this.form.testResult,
          }
          Object.keys(params).map((key) => {
            if (params[key] == '' || params[key] == undefined) {
              delete params[key]
            }
          })
          console.log(params)
          signInVisitor(params).then((res) => {
            if (res.resultCode == 0) {
              this.$message.success(this.$t('public.success'))
              this.$emit('close', true)
            }
          })
        }
      })
    },
    handleValidTime() {
      console.log(this.form.startTime, this.form.endTime)
      console.log(new Date(this.form.startTime).getTime() > new Date(this.form.endTime).getTime())
      if (
        this.form.startTime &&
        this.form.endTime &&
        new Date(this.form.startTime).getTime() > new Date(this.form.endTime).getTime()
      ) {
        this.$message.warning(this.$t('public.startGtEnd'))
      }
    },
    //提交表单
    async submitForm() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (new Date(this.form.startTime).getTime() > new Date(this.form.endTime).getTime()) {
            this.$message.warning(this.$t('public.startGtEnd'))
            return
          }

          checkInterviewee({
            intervieweeMobile: this.form.intervieweeMobile,
          }).then((res) => {
            if (res.resultCode == 0 && res.checkResult) {
              this.form.signType = 2
              let params = {
                ...this.form,
                visitorIdCard: this.form.visitorIdCard.toLocaleUpperCase(),
              }
              addVisitor(params).then((res) => {
                if (res.resultCode == 0) {
                  this.$message.success(this.$t('public.success'))
                  this.$refs['form'].resetFields()
                  this.$emit('close', true)
                  this.imageUrl = ''
                  this.symptom = []
                }
              })
            } else {
              this.$message.warning('被访人不存在，请检查信息是否填写正确')
            }
          })
        }
      })
    },
    //多选症状
    changeGroupBox(val) {
      this.form.symptom = val.join(',')
    },
    dialogOpen() {
      // console.log(this.$parent.ruleForm)
      this.$nextTick(() => {
        console.log(this.info)
        if (this.addVisitorOrDetail == 2) {
          //详情
          this.form = {
            ...this.info,
            securityAuditType: 1,
          }
        } else {
          this.form = {
            intervieweeName: '', //被访人姓名
            intervieweeMobile: '',
            visitorName: '', //访客姓名
            temperature: '',
            remark: '',
            facePhoto: '',
            visitType: '',
            visitorMobile: '',
            startTime: '',
            endTime: '',
            contactType: 2,
            symptom: '', //症状
            visitRemark: '',
            signType: 2,
            address: '',
            visitorIdCard: '',
            securityAuditType: 1,
            healthCode: '',
          }
          if (this.form.symptom) {
            var symptomArray = this.form.symptom.split(',')
            for (let i = 0; i < symptomArray.length; i++) {
              this.symptom.push(Number(symptomArray[i]))
            }
          }
        }

        this.$refs.form.clearValidate()
      })
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 30)
    },
    // 检查手机号
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },

    dialogClosed() {
      this.$refs['form'].resetFields()
      this.imageUrl = ''
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.detail-value {
  color: #c0c4cc;
  overflow: hidden;
  white-space: nowrap;
  /*文字超出宽度则显示ellipsis省略号*/
  text-overflow: ellipsis;
}
.item-wrapper {
  color: #fff;
  display: flex;
  width: 80%;
  margin-bottom: 30px;
  .item {
    flex: 1;
    display: flex;
    .label {
      margin-right: 10px;
      &:after {
        content: ':';
      }
    }
  }
}
.el-form {
  ::v-deep.el-form-item__content {
    .el-textarea {
      .el-textarea__inner {
        background-color: transparent;
        border-color: #1f60a3;
        color: #fff;
      }
      &.is-disabled {
        .el-textarea__inner {
          background-color: #093753;
          border-color: #aaa;
        }
      }
    }
  }
  &.en {
    ::v-deep.el-form-item {
      .el-form-item__label {
        width: 180px;
        white-space: nowrap;
      }
      .el-form-item__content {
        margin-left: 180px;
      }
    }
    .m-left {
      ::v-deep.el-form-item {
        .el-form-item__label {
          width: 180px;
          white-space: nowrap;
        }
        .el-form-item__content {
          margin-left: 180px;
        }
      }
    }
  }
  ::v-deep.el-form-item {
    .el-form-item__label {
      width: 150px;
      white-space: nowrap;
    }
    .el-form-item__content {
      margin-left: 150px;
    }
  }
  .m-left {
    ::v-deep.el-form-item {
      .el-form-item__label {
        width: 150px;
        white-space: nowrap;
      }
      .el-form-item__content {
        margin-left: 150px;
      }
    }
  }
  .m-center {
    ::v-deep.el-form-item {
      &.two {
        .el-form-item__content {
          margin-left: 0;
        }
      }
    }
  }
}
.myinput {
  width: 240px !important;
}

.longinput {
  width: 600px;
}

/*radio样式 */
.el-radio__label {
  color: white;
}

.el-checkbox__label {
  color: #ffffff;
}

.wr-icon-picture {
  width: 92px;
  height: 92px;
  // border: 1px dashed #ffffff;
  .avatar-uploader {
    width: 100%;
    height: 100%;
    line-height: 92px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .el-upload {
    width: 90px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.avatar-uploader-icon2 {
  color: #ffffff;
}

.module1 {
  .m-title {
    display: flex;
    margin-bottom: 30px;
    .m-line {
      width: 2px;
      height: 22px;
      background: #00a1ff;
    }

    .m-name {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #fefefe;
      margin-left: 9px;
    }
  }

  .m-content {
    display: flex;
    padding: 10px 5px;
    flex-direction: column;
    border-bottom: 1px solid #535353;

    .m-wrapper-column {
      display: flex;
      flex-direction: column;

      .m-center {
        .avatar {
          width: 90px;
          height: 90px;
        }

        .avatar-upload {
          width: 90px;
          height: 90px;
        }
      }
    }

    .m-wrapper {
      display: flex;
    }

    .m-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .m-right {
      flex: 1;
      overflow: hidden;
    }

    .flexRow {
      display: flex;
    }
  }

  .m-no-cotent {
    border-bottom: none;
  }
}

.module2 {
  margin-top: 20px;
}
</style>
