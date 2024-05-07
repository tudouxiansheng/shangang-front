<template>
  <!-- 创建算法识别模板 -->
  <div id="templateAddDialog">
    <el-dialog
      :title="
        $parent.operation ? $t('algoTemplate.createTemplate') : $t('algoTemplate.modifyTemplate')
      "
      v-model="$parent.dialogFormVisible_add"
      top="10vh"
      :width="locale == 'en' ? '1200px' : '1000px'"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale == 'en' ? '220px' : '120px'"
      >
        <el-form-item
          :label="$t('algoTemplate.templateName2') + '：'"
          prop="name"
          class="alignRight"
        >
          <el-input
            style="width: 50%"
            v-model="form.name"
            auto-complete="off"
            :placeholder="$t('algoTemplate.inputTemplateName')"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('algoTemplate.algorithmProperties') + '：'"
          prop="type"
          class="alignRight"
        >
          <el-radio-group v-model="form.type" @change="changeType2">
            <el-radio :label="0">{{ $t('algoTemplate.areaDetection') }}</el-radio>
            <el-radio :label="1">{{ $t('algoTemplate.markingDetection') }}</el-radio>
            <el-radio :label="2">{{ $t('algoTemplate.fullScreenTesting') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <div v-if="form.type == 0" style="width: 100%; display: flex; flex-wrap: wrap">
            <el-col :span="locale == 'en' ? 6 : 5" :offset="locale == 'en' ? 4 : 3">
              <el-form-item :label="$t('algoTemplate.identificationArea') + '：'" prop="roi.status">
                <el-switch
                  v-model="form.roi.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8">
              <el-form-item :label="$t('algoTemplate.areasAllowed') + '：'" prop="roi.num">
                <el-select
                  :popper-append-to-body="false"
                  v-model="form.roi.num"
                  :disabled="form.roi.status == '0'"
                  :placeholder="$t('algoTemplate.selectAreasAllowed')"
                >
                  <el-option
                    v-for="(item, index) in areasNumber"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8">
              <el-form-item :label="$t('algoTemplate.areaShape') + '：'" prop="roi.type">
                <el-select
                  :popper-append-to-body="false"
                  v-model="form.roi.type"
                  :disabled="form.roi.status == '0'"
                  :placeholder="$t('algoTemplate.selectAreaShape')"
                >
                  <el-option
                    v-for="(item, index) in shapeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 6 : 5" :offset="locale == 'en' ? 4 : 3">
              <el-form-item :label="$t('algoTemplate.exclusionArea') + '：'" prop="nRoi.status">
                <el-switch
                  v-model="form.nRoi.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8">
              <el-form-item :label="$t('algoTemplate.areasAllowed') + '：'" prop="nRoi.num">
                <el-select
                  :popper-append-to-body="false"
                  v-model="form.nRoi.num"
                  :disabled="form.nRoi.status == '0'"
                  :placeholder="$t('algoTemplate.selectAreasAllowed')"
                >
                  <el-option
                    v-for="(item, index) in areasNumber"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8">
              <el-form-item :label="$t('algoTemplate.areaShape') + '：'" prop="nRoi.type">
                <el-select
                  :popper-append-to-body="false"
                  v-model="form.nRoi.type"
                  :disabled="form.nRoi.status == '0'"
                  :placeholder="$t('algoTemplate.selectAreaShape')"
                >
                  <el-option
                    v-for="(item, index) in shapeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="form.type == 1" style="width: 100%">
            <el-col :span="locale == 'en' ? 7 : 7" :offset="locale == 'en' ? 4 : 3">
              <el-form-item
                :label="$t('algoTemplate.supportType') + '：'"
                prop="line.type"
                :rules="form.type == 1 ? rules.mainDevName : {}"
              >
                <el-select
                  v-model="form.line.type"
                  multiple
                  :placeholder="$t('algoTemplate.select')"
                  @change="changeType"
                >
                  <el-option
                    v-for="item in lineList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div
            v-if="form.type == 0 || form.type == 1"
            style="width: 100%; display: flex; flex-wrap: wrap"
          >
            <el-col :span="locale == 'en' ? 6 : 5" :offset="locale == 'en' ? 4 : 3">
              <el-form-item
                :label="$t('algoTemplate.maximumTarget') + '：'"
                prop="maxTarget.status"
              >
                <el-switch
                  v-model="form.maxTarget.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8">
              <el-form-item :label="$t('algoTemplate.areaShape') + '：'" prop="maxTarget.type">
                <el-select
                  :popper-append-to-body="false"
                  v-model="form.maxTarget.type"
                  :disabled="form.maxTarget.status == '0'"
                  :placeholder="$t('algoTemplate.selectAreaShape')"
                >
                  <el-option
                    v-for="(item, index) in shapeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8"></el-col>
            <el-col :span="locale == 'en' ? 6 : 5" :offset="locale == 'en' ? 4 : 3">
              <el-form-item
                :label="$t('algoTemplate.minimumTarget') + '：'"
                prop="minTarget.status"
              >
                <el-switch
                  v-model="form.minTarget.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8">
              <el-form-item :label="$t('algoTemplate.areaShape') + '：'" prop="minTarget.type">
                <el-select
                  :popper-append-to-body="false"
                  v-model="form.minTarget.type"
                  :disabled="form.minTarget.status == '0'"
                  :placeholder="$t('algoTemplate.selectAreaShape')"
                >
                  <el-option
                    v-for="(item, index) in shapeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="locale == 'en' ? 7 : 8"></el-col>
          </div>
        </el-row>
        <el-form-item
          :label="$t('algoTemplate.promptDescription') + '：'"
          prop="remark"
          class="alignRight"
        >
          <el-input
            v-model="form.remark"
            auto-complete="off"
            :placeholder="$t('algoTemplate.clockwiseRepresentation')"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('algoTemplate.sketchMap') + '：'"
          prop="sketchMap"
          class="alignRight"
        >
          <div class="img_content">
            <div class="img_title">
              <div
                class="left"
                :style="form.type != 1 ? 'color:' + '#bfbfbf' : 'color:' + '#666666'"
              >
                <svg-icon
                  style="width: 15px; height: 15px"
                  :icon-class="form.type != 1 ? 'line_disabled' : 'line'"
                  class-name="file-icon"
                ></svg-icon>
                <p>{{ $t('algoTemplate.drawLine') }}</p>
              </div>
              <div class="left" style="width: 20% !important">
                <el-select
                  v-model="lineType"
                  :placeholder="$t('algoTemplate.select')"
                  :disabled="form.type != 1"
                >
                  <el-option
                    v-for="item in lineList2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="left">
                <svg-icon
                  style="width: 15px; height: 15px"
                  v-if="form.type == 0"
                  :icon-class="
                    form.roi.status == 1 && form.roi.type == 0
                      ? 'quadrilateral'
                      : form.roi.status == 1 && form.roi.type == 1
                      ? 'polygon'
                      : form.roi.status == 0 && form.roi.type == 0
                      ? 'quadrilateral_disabled'
                      : 'polygon_disabled'
                  "
                  class-name="file-icon"
                ></svg-icon>
                <svg-icon
                  style="width: 15px; height: 15px"
                  v-if="form.type == 1 || form.type == 2"
                  :icon-class="form.roi.type == 0 ? 'quadrilateral_disabled' : 'polygon_disabled'"
                  class-name="file-icon"
                ></svg-icon>
                <p
                  v-if="form.type == 0"
                  :style="form.roi.status != 1 ? 'color:' + '#bfbfbf' : 'color:' + '#666666'"
                >
                  {{ $t('algoTemplate.identificationArea') }}
                </p>
                <p v-if="form.type == 1 || form.type == 2" :style="'color:' + '#bfbfbf'">
                  {{ $t('algoTemplate.identificationArea') }}
                </p>
              </div>
              <div class="left">
                <svg-icon
                  style="width: 15px; height: 15px"
                  v-if="form.type == 0"
                  :icon-class="
                    form.nRoi.status == 1 && form.nRoi.type == 0
                      ? 'quadrilateral'
                      : form.nRoi.status == 1 && form.nRoi.type == 1
                      ? 'polygon'
                      : form.nRoi.status == 0 && form.nRoi.type == 0
                      ? 'quadrilateral_disabled'
                      : 'polygon_disabled'
                  "
                  class-name="file-icon"
                ></svg-icon>
                <svg-icon
                  style="width: 15px; height: 15px"
                  v-if="form.type == 1 || form.type == 2"
                  :icon-class="form.nRoi.type == 0 ? 'quadrilateral_disabled' : 'polygon_disabled'"
                  class-name="file-icon"
                ></svg-icon>
                <p
                  v-if="form.type == 0"
                  :style="form.nRoi.status != 1 ? 'color:' + '#bfbfbf' : 'color:' + '#666666'"
                >
                  {{ $t('algoTemplate.exclusionArea') }}
                </p>
                <p v-if="form.type == 1 || form.type == 2" :style="'color:' + '#bfbfbf'">
                  {{ $t('algoTemplate.exclusionArea') }}
                </p>
              </div>
              <div
                class="left"
                :style="form.maxTarget.status != 1 ? 'color:' + '#bfbfbf' : 'color:' + '#666666'"
              >
                <svg-icon
                  style="width: 15px; height: 15px"
                  :icon-class="
                    form.maxTarget.status == 1 && form.maxTarget.type == 0
                      ? 'quadrilateral'
                      : form.maxTarget.status == 1 && form.maxTarget.type == 1
                      ? 'polygon'
                      : form.maxTarget.status == 0 && form.maxTarget.type == 0
                      ? 'quadrilateral_disabled'
                      : 'polygon_disabled'
                  "
                  class-name="file-icon"
                ></svg-icon>
                <p>{{ $t('algoTemplate.maximumTarget') }}</p>
              </div>
              <div
                class="left"
                :style="form.minTarget.status != 1 ? 'color:' + '#bfbfbf' : 'color:' + '#666666'"
              >
                <svg-icon
                  style="width: 15px; height: 15px"
                  :icon-class="
                    form.minTarget.status == 1 && form.minTarget.type == 0
                      ? 'quadrilateral'
                      : form.minTarget.status == 1 && form.minTarget.type == 1
                      ? 'polygon'
                      : form.minTarget.status == 0 && form.minTarget.type == 0
                      ? 'quadrilateral_disabled'
                      : 'polygon_disabled'
                  "
                  class-name="file-icon"
                ></svg-icon>
                <p>{{ $t('algoTemplate.minimumTarget') }}</p>
              </div>
              <div
                style="width: 20%; text-align: right; font-size: 12px; margin-top: 21px"
                v-if="form.type == 0 && form.roi.status == 1"
              >
                <el-tooltip
                  v-if="form.roi.num === 5"
                  class="item"
                  effect="dark"
                  :content="$t('algoTemplate.region5')"
                  placement="top-start"
                >
                  <p class="item-num">{{ $t('algoTemplate.region5') }}&nbsp;&nbsp;</p>
                </el-tooltip>
                <el-tooltip v-else class="item" effect="dark" placement="top-start">
                  <template #content>
                    <div>
                      {{ $t('algoTemplate.maximumSupport') }}&nbsp;&nbsp;
                      <span style="color: #409eff">{{ form.roi.num }}</span>
                      &nbsp;&nbsp;{{ $t('algoTemplate.region2') }}
                    </div>
                  </template>

                  <p class="item-num">
                    {{ $t('algoTemplate.maximumSupport') }}&nbsp;&nbsp;
                    <span style="color: #409eff">{{ form.roi.num }}</span>
                    &nbsp;&nbsp;{{ $t('algoTemplate.region2') }}
                  </p>
                </el-tooltip>
              </div>
            </div>
            <div style="position: absolute">
              <img src="@/assets/img/common/draw.png" style="width: calc(100% - 20px)" />
              <div
                class="question_mark"
                style="position: absolute; top: 10px; right: 30px; color: #000; z-index: 100001"
              >
                <el-tooltip
                  class="tip-item"
                  popper-class="tip-item-popper"
                  effect="dark"
                  :content="form.remark"
                  placement="left"
                  :disabled="form.remark == ''"
                >
                  <el-icon><el-icon-question /></el-icon>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$parent.dialogFormVisible_add = false">
            {{ $t('public.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitForm" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { QuestionFilled as ElIconQuestion } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconQuestion
  },
  name: 'templateAdd',
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        name: '',
        type: 0,
        roi: {
          type: 0,
          status: 1,
          num: 1
        },
        nRoi: {
          type: 0,
          status: 0,
          num: 1
        },
        line: {
          type: [1],
          status: 1
        },
        maxTarget: {
          type: 0,
          status: 0
        },
        minTarget: {
          type: 0,
          status: 0
        },
        remark: ''
      },
      rules: {},
      areasNumber: [],
      shapeList: [],
      lineList: [],
      lineType: '',
      lineList2: []
    }
  },
  mounted() {
    this.setFormRules()
    this.setData()
  },
  methods: {
    changeType() {
      this.lineList2 = []
      this.form.line.type.forEach(element => {
        if (element == 1) {
          this.lineList2.push({
            value: 1,
            label: this.$t('algoTemplate.noDirection')
          })
        } else if (element == 2) {
          this.lineList2.push({
            value: 2,
            label: this.$t('algoTemplate.forward')
          })
        } else if (element == 4) {
          this.lineList2.push({
            value: 4,
            label: this.$t('algoTemplate.reverse')
          })
        } else {
          this.lineList2.push({
            value: 8,
            label: this.$t('algoTemplate.twoWay')
          })
        }
      })
      this.lineType = this.lineList2.length != 0 ? this.lineList2[0].value : ''
    },
    changeType2() {
      this.form.roi = {
        type: 0,
        status: 1,
        num: 1
      }
      this.form.nRoi = {
        type: 0,
        status: 0,
        num: 1
      }
      this.form.line = {
        type: [1],
        status: 1
      }
      this.form.maxTarget = {
        type: 0,
        status: 0
      }
      this.form.minTarget = {
        type: 0,
        status: 0
      }
      this.changeType()
      this.$refs.form.clearValidate()
    },
    setFormRules() {
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
      var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\] ]/im
      var validatePass1 = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error(this.$t('algoTemplate.nameRequired')))
        }
        if (regEn.test(value) || regCn.test(value)) {
          callback(new Error(this.$t('repo.cantContainSpecial')))
        }
        if (value.length > 64 || value.length < 1) {
          callback(new Error(this.$t('algoTemplate.requires64')))
        }
        callback()
      }
      this.rules = {
        name: [{ validator: validatePass1, trigger: 'change' }],
        'line.type': [
          {
            required: true,
            message: this.$t('algoTemplate.drawingRule'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 256,
            message: this.$t('algoTemplate.remarkLength'),
            trigger: 'change'
          }
        ]
      }
    },
    setData() {
      this.areasNumber = [
        {
          value: 1,
          label: '1'
        },
        {
          value: 2,
          label: '2'
        },
        {
          value: 3,
          label: '3'
        },
        {
          value: 4,
          label: '4'
        },
        {
          value: 5,
          label: this.$t('algoTemplate.unlimited')
        }
      ]
      this.shapeList = [
        {
          value: 0,
          label: this.$t('algoTemplate.rectangle')
        },
        {
          value: 1,
          label: this.$t('algoTemplate.polygon')
        }
      ]
      this.lineList = [
        {
          value: 1,
          label: this.$t('algoTemplate.noDirection')
        },
        {
          value: 2,
          label: this.$t('algoTemplate.forward')
        },
        {
          value: 4,
          label: this.$t('algoTemplate.reverse')
        },
        {
          value: 8,
          label: this.$t('algoTemplate.twoWay')
        }
      ]
      this.changeType()
    },
    async dialogOpen() {
      this.$nextTick(() => {
        this.form = this.$parent.addForm
        this.$refs.form.resetFields()
      })
    },
    sum(arr) {
      let sumall = 0
      arr.forEach(element => {
        sumall += element
      })
      return sumall
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let data = {
            name: this.form.name,
            type: this.form.type,
            roi: this.form.roi,
            nRoi: this.form.nRoi,
            line: {
              type: 1,
              status: this.form.line.status
            },
            maxTarget: this.form.maxTarget,
            minTarget: this.form.minTarget,
            remark: this.form.remark
          }
          if (this.form.type == 0) {
            delete data.line
          } else if (this.form.type == 1) {
            data.line.type = this.sum(this.form.line.type)
            delete data.roi
            delete data.nRoi
          } else {
            delete data.roi
            delete data.nRoi
            delete data.line
            delete data.maxTarget
            delete data.minTarget
          }
          this.$parent.maskloading = true
          if (this.$parent.operation) {
            data.status = 1
            this.$api.addAlgorithmRule(data).then(async res => {
              if (res.resultCode == 0) {
                this.successBack()
              } else {
                this.$parent.maskloading = false
              }
            })
          } else {
            data.ruleId = this.$parent.selectId
            this.$api.modifyAlgorithmRule(data).then(async res => {
              if (res.resultCode == 0) {
                this.successBack()
              } else {
                this.$parent.maskloading = false
              }
            })
          }
        }
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      Object.assign(this.form, this.$options.data)
    },
    successBack() {
      this.$message({
        type: 'success',
        message: this.$parent.operation
          ? this.$t('public.addSuccess')
          : this.$t('public.modifySuccess')
      })
      this.$parent.dialogFormVisible_add = false
      this.$parent.getGroupList()
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
#templateAddDialog {
  .el-dialog__body {
    padding: 15px 20px 5px;
  }

  .alignRight {
    label {
      text-align: right;
    }
  }

  .el-input__inner {
    background: transparent;
  }

  .img_content {
    width: 100%;
    height: 401px;
    background: #f0f0f0;
    padding: 20px;

    .img_title {
      height: 60px;
      display: flex;

      .left {
        width: 12%;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #666666;

        svg {
          margin: auto;
        }

        p {
          margin-top: 6px;
        }
      }
    }
  }

  .item-num {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ml20 {
    margin-left: 20px !important;
  }
}
</style>
