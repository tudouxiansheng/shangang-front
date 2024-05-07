<template>
  <div>
    <el-dialog
      :title="$t('algoTemplate.choice')"
      v-model="$parent.selectTemplateVisible"
      top="10vh"
      width="1200px"
      class="addAlgorithmDialog"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      draggable
    >
      <el-row class="tip">
        <svg-icon icon-class="tip" />
        {{ $t('algoTemplate.tip') }}
      </el-row>
      <el-form
        class="advanced-query-form"
        :label-width="locale == 'en' ? '150px' : '130px'"
        ref="queryForm"
        :rules="rules"
        :model="queryParams"
        label-position="left"
        style="display: flex"
      >
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="16" style="margin-left: -150px">
            <el-form-item prop="taskName">
              <el-input
                style="width: 100%"
                v-model="queryParams.taskName"
                clearable
                :placeholder="$t('algoTemplate.inputTemplateName')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: left">
            <el-button type="primary" class="initial-width" @click="getGroupList">
              {{ $t('public.search') }}
            </el-button>
          </el-col>
          <el-col :span="12" v-for="(item, index) in groupList" :key="index">
            <div
              class="groupList"
              :style="
                checked[index] ? 'background: rgba(16, 156, 238, 0.06)' : 'background: #FAFAFA'
              "
            >
              <div class="header">
                <div class="header_left">
                  <el-checkbox
                    v-model="checked[index]"
                    @change="handleCheckedChange(index)"
                    style="background: #ffffff"
                  ></el-checkbox>
                  {{ item.name }}
                </div>
                <div class="header_right" @click="handleView(item.ruleId)">
                  {{ $t('public.particulars') }}
                </div>
              </div>
              <div class="content">
                <div class="content_left">
                  <div class="borderAll">
                    <div class="border_content" v-if="item.type == 0">
                      {{ $t('algoTemplate.areaIdentification') }}
                    </div>
                    <div
                      class="border_content"
                      :title="`${$t('algoTemplate.region')}${
                        item.roi.num === 5 ? $t('algoTemplate.noLimited1') : item.roi.num
                      }`"
                      v-if="item.type == 0 && item.roi.status == 1"
                    >
                      {{ $t('algoTemplate.region')
                      }}{{ item.roi.num === 5 ? $t('algoTemplate.noLimited1') : item.roi.num }}
                    </div>
                    <div class="border_content" v-if="item.type == 0 && item.roi.status == 1">
                      {{
                        item.roi.type == 0
                          ? $t('algoTemplate.rectangle')
                          : $t('algoTemplate.polygon')
                      }}
                    </div>
                    <div class="border_content" v-if="item.type == 1">
                      {{ $t('algoTemplate.lineMarking') }}
                    </div>
                    <div
                      class="border_content"
                      v-if="item.type == 1"
                      :title="judgeDraw(item.line.type)"
                    >
                      {{ judgeDraw(item.line.type) }}
                    </div>
                    <div class="border_content" v-if="item.type == 2">
                      {{ $t('algoTemplate.fullScreen') }}
                    </div>
                  </div>
                  <div
                    style="
                      margin-top: 10px;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    "
                    v-if="item.type == 0 && item.nRoi && item.nRoi.status == 1"
                  >
                    <el-tooltip placement="top" effect="light">
                      <template #content>
                        <div>
                          {{ getText(1, item.nRoi) }}
                        </div>
                      </template>

                      <span>
                        {{ getText(1, item.nRoi) }}
                      </span>
                    </el-tooltip>
                  </div>
                  <div
                    style="
                      margin-top: 10px;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                    "
                    v-if="item.type != 2"
                  >
                    <span v-if="item.maxTarget && item.maxTarget.status == 1">
                      <el-tooltip placement="top" effect="light">
                        <template #content>
                          <div>
                            {{ getText(2, item.maxTarget) }}
                          </div>
                        </template>

                        <span>
                          {{ getText(2, item.maxTarget) }}
                        </span>
                      </el-tooltip>
                    </span>
                    <span v-if="item.minTarget && item.minTarget.status == 1">
                      <el-tooltip placement="top" effect="light">
                        <template #content>
                          <div>
                            {{ getText(3, item.minTarget) }}
                          </div>
                        </template>

                        <span>
                          {{ getText(3, item.minTarget) }}
                        </span>
                      </el-tooltip>
                    </span>
                  </div>
                </div>
                <div class="content_right">
                  <div class="img">
                    <img
                      src="@/assets/img/common/template_failed.png"
                      alt=""
                      v-if="item.status == 0"
                    />
                    <img
                      src="@/assets/img/common/template_success.png"
                      alt=""
                      v-if="item.status == 1"
                    />
                  </div>
                  <p
                    style="text-align: center; margin-top: 10px; color: #06cc60"
                    v-if="item.status == 1"
                  >
                    {{ $t('algoTemplate.enabling') }}
                  </p>
                  <p
                    style="text-align: center; margin-top: 10px; color: red"
                    v-if="item.status == 0"
                  >
                    {{ $t('algoTemplate.disabling') }}
                  </p>
                </div>
              </div>
              <div class="bottom">
                <div class="bottom_left">{{ $t('public.createTime') }}：{{ item.createTime }}</div>
                <div class="bottom_right"></div>
              </div>
            </div>
          </el-col>
          <el-col
            v-if="pageInfo ? groupList.length != pageInfo.totalNum : false"
            :span="24"
            style="color: #53a7ec; text-align: right; margin-top: 10px; cursor: pointer"
          >
            <span @click="moreTemplate">>>>{{ $t('alarmList.loadMore') }}</span>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="margin-top: 20px">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <template-detail></template-detail>
  </div>
</template>

<script>
import templateDetail from './template_detail'
export default {
  components: {
    'template-detail': templateDetail
  },
  data() {
    return {
      dialogFormVisible_detail: false,
      queryParams: {
        taskName: undefined
      },
      groupList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 2,
        totalNum: 0
      },
      checked: [],
      selectTemplate: {},
      detailData: {
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
          type: 1,
          status: 0
        },
        maxTarget: {
          type: 0,
          status: 0
        },
        minTarget: {
          type: 0,
          status: 0
        }
      },
      rules: {}
    }
  },

  mounted() {
    this.setFormRules()
  },

  methods: {
    dialogOpen() {
      if (this.$refs.queryForm) {
        this.$nextTick(() => {
          this.$refs.queryForm.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.selectTemplate = this.$parent.selectRow
        this.getGroupList()
      })
    },

    dialogClosed() {
      this.$parent.selectTemplateVisible = false
      this.groupList = []
      this.pageInfo = {
        pageNum: 1,
        pageSize: 2
      }
      this.checked = []
      this.selectTemplate = {}
      this.queryParams = {
        taskName: undefined
      }
    },
    setFormRules() {
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
      var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\] ]/im
      var validatePass1 = (rule, value, callback) => {
        if (regEn.test(value) || regCn.test(value)) {
          callback(new Error(this.$t('repo.cantContainSpecial')))
        }
        if (value ? value.length > 64 : false) {
          callback(new Error(this.$t('algoTemplate.requires64')))
        }
        callback()
      }
      this.rules = {
        taskName: [{ validator: validatePass1, trigger: 'change' }]
      }
    },
    getGroupList() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.checked = []
          let useId = ''
          if (JSON.stringify(this.$parent.selectRow) !== '{}') {
            useId = this.$parent.selectRow.ruleId
          }
          this.pageInfo = {
            pageNum: 1,
            pageSize: 2,
            totalNum: 0
          }
          let obj = {
            name: this.queryParams.taskName,
            status: 1,
            pageInfo: this.pageInfo,
            useId: useId
          }
          this.$api
            .queryAlgorithmRule(obj)
            .then(res => {
              this.groupList = res.ruleConfigInfoList ? res.ruleConfigInfoList : []
              this.groupList.forEach(element => {
                this.checked.push(false)
              })
              this.pageInfo = res.pageInfo
              this.groupList.forEach((element, i) => {
                if (element.ruleId == this.selectTemplate.ruleId) {
                  this.checked[i] = true
                }
              })
            })
            .catch(error => {
              this.pageInfo = {
                pageNum: 1,
                pageSize: 2,
                totalNum: 0
              }
              this.groupList = []
            })
        }
      })
    },
    // 表单提交
    submitForm() {
      this.$parent.form.ruleId = this.selectTemplate.name
      this.$parent.selectRow = this.selectTemplate
      this.$parent.selectTemplateVisible = false
    },
    //跳转到模板界面
    addTemplate() {
      this.$router.push('/algorithm/identification-template')
    },
    // 详情按钮操作
    async handleView(id) {
      let res = await this.$api.searchAlgorithmRuleById({ ruleId: id })
      this.detailData = res.info
      this.dialogFormVisible_detail = true
    },
    //判断画线标识形状
    judgeDraw(type) {
      let line = ''
      if (type % 2 == 1) {
        line += this.$t('algoTemplate.noDirection') + ' '
      }
      if ((type >> 1) % 2 == 1) {
        line += this.$t('algoTemplate.forward') + ' '
      }
      if ((type >> 2) % 2 == 1) {
        line += this.$t('algoTemplate.reverse') + ' '
      }
      if ((type >> 3) % 2 == 1) {
        line += this.$t('algoTemplate.twoWay') + ' '
      }
      return line
    },
    moreTemplate() {
      this.pageInfo.pageNum++
      this.checked = []
      let useId = ''
      if (JSON.stringify(this.$parent.selectRow) !== '{}') {
        useId = this.$parent.selectRow.ruleId
      }
      let obj = {
        name: this.queryParams.taskName,
        status: 1,
        pageInfo: this.pageInfo,
        useId: useId
      }
      this.$api.queryAlgorithmRule(obj).then(res => {
        this.groupList.push(...res.ruleConfigInfoList)
        this.groupList.forEach(element => {
          this.checked.push(false)
        })
        this.groupList.forEach((element, i) => {
          if (element.ruleId == this.selectTemplate.ruleId) {
            this.checked[i] = true
          }
        })
      })
    },
    handleCheckedChange(i) {
      this.checked.forEach((element, m) => {
        this.checked[m] = false
      })
      this.checked[i] = true
      this.selectTemplate = this.groupList[i]
    },
    getText(val, i) {
      let content
      const num = val === 1 && i.num === 5 ? this.$t('algoTemplate.noLimited') : i.num
      switch (val) {
        case 1:
          content =
            '#' +
            this.$t('algoTemplate.exclusionArea1') +
            ' ' +
            this.$t('algoTemplate.allowableQuantity') +
            ' ' +
            num +
            ' ' +
            (i.type == 0 ? this.$t('algoTemplate.rectangle1') : this.$t('algoTemplate.polygon1'))
          break
        case 2:
          content =
            '#' +
            this.$t('algoTemplate.maximumTarget') +
            ' ' +
            (i.type == 0 ? this.$t('algoTemplate.rectangle') : this.$t('algoTemplate.polygon'))
          break
        case 3:
          content =
            '#' +
            this.$t('algoTemplate.minimumTarget') +
            ' ' +
            (i.type == 0 ? this.$t('algoTemplate.rectangle') : this.$t('algoTemplate.polygon'))
          break
      }
      return content
    }
  }
}
</script>

<style lang="scss">
.addAlgorithmDialog {
  .el-dialog__body {
    .el-date-editor {
      .el-range-input,
      .el-range-separator {
        color: #262626;
      }
    }
    .tip {
      background: #fffbe8;
      height: 36px;
      line-height: 36px;
      margin-bottom: 20px;
      padding-left: 10px;
    }
    .groupList {
      border: 1px solid #f2f2f2;
      height: 240px;
      margin-top: 20px;
      padding: 20px;
      border-radius: 4px;
      .header {
        display: flex;
        justify-content: space-between;
        .header_left {
          font-size: 14px;
          font-weight: 400;
          color: #262626;
        }
        .header_right {
          cursor: pointer;
          font-size: 14px;
          font-weight: 400;
          color: #262626;
        }
      }
      .content {
        height: 166px;
        display: flex;
        .content_left {
          width: 60%;
          color: #04a1ff;
          padding: 20px 0;
          .borderAll {
            height: 70px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .border_content {
              width: 40%;
              height: 30px;
              text-align: center;
              line-height: 30px;
              background: rgb(196 230 251);
              border: 1px solid #04a1ff;
              color: #109cee;
              border-radius: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding-left: 10px;
              padding-right: 10px;
            }
            .border_content:nth-child(3) {
              margin-top: 10px;
            }
          }
        }
        .content_right {
          width: 40%;
          .img {
            width: 30px;
            margin: auto;
            margin-top: 50px;
          }
        }
      }
      .bottom {
        display: flex;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        .bottom_left {
          width: 70%;
        }
        .bottom_right {
          width: 30%;
          text-align: right;
        }
      }
    }
    .groupList:nth-child(4n + 2) {
      margin: 0 2% 1.5% 4%;
    }
    .groupList:nth-child(4n + 3) {
      margin: 0 4% 1.5% 2%;
    }
  }
}
</style>
