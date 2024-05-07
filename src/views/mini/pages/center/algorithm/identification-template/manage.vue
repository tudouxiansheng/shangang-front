<template>
  <!-- 算法标识模板 -->
  <div id="identificationTemplate" v-if="isRouterAlive" ref="identificationTemplate">
    <el-form
      class="advanced-query-form"
      label-width="90px"
      ref="queryForm"
      :rules="rules"
      :model="queryParams"
      label-position="left"
      style="display: flex"
    >
      <el-row :gutter="20" style="width: 100%">
        <el-col :span="8">
          <el-form-item
            :label-width="locale == 'en' ? '205px' : '130px'"
            :label="$t('algoTemplate.templateName') + ':'"
            prop="taskName"
          >
            <el-input
              v-model="queryParams.taskName"
              clearable
              :placeholder="$t('algoTemplate.inputTemplateName')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('public.createTime') + ':'" prop="createTime">
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="timeRange"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              value-format="YYYY-MM-DD"
              @change="dateRangeChange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item :label="$t('public.state') + ':'" prop="taskState">
            <el-select clearable v-model="queryParams.taskState">
              <el-option :label="$t('public.enable')" :value="1"></el-option>
              <el-option :label="$t('public.deactivate')" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button type="primary" class="initial-width" @click="handleQuery">
            {{ $t('public.search') }}
          </el-button>
          <el-button class="initial-width" @click="resetQuery">
            {{ $t('public.reset') }}
          </el-button>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" class="initial-width" @click="addTemplate">
            {{ $t('algoTemplate.createTemplate') }}
          </el-button>
        </el-col>
        <div v-show="!loadingList && !groupList.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt />
          <p>{{ $t('public.noData') }}</p>
        </div>
        <el-col :span="6" v-for="(item, index) in groupList" :key="index">
          <div class="groupList">
            <div class="header">
              <div class="header_left">
                <el-tooltip placement="top" :content="item.name">
                  <div class="item-name">
                    {{ item.name }}
                  </div>
                </el-tooltip>
              </div>
              <div class="header_right" @click="handleView(item.ruleId)">
                {{ $t('public.particulars') }}
              </div>
            </div>
            <div class="content">
              <div class="content_left">
                <div class="borderAll">
                  <div
                    class="border_content"
                    :title="$t('algoTemplate.areaIdentification')"
                    v-if="item.type == 0"
                  >
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
                  <div
                    class="border_content"
                    :title="
                      item.roi.type == 0 ? $t('algoTemplate.rectangle') : $t('algoTemplate.polygon')
                    "
                    v-if="item.type == 0 && item.roi.status == 1"
                  >
                    {{
                      item.roi.type == 0 ? $t('algoTemplate.rectangle') : $t('algoTemplate.polygon')
                    }}
                  </div>
                  <div
                    class="border_content"
                    :title="$t('algoTemplate.lineMarking')"
                    v-if="item.type == 1"
                  >
                    {{ $t('algoTemplate.lineMarking') }}
                  </div>
                  <div
                    class="border_content"
                    v-if="item.type == 1"
                    :title="judgeDraw(item.line.type)"
                  >
                    {{ judgeDraw(item.line.type) }}
                  </div>
                  <div
                    class="border_content"
                    :title="$t('algoTemplate.fullScreen')"
                    v-if="item.type == 2"
                  >
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
                  <el-tooltip placement="top">
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
                    <el-tooltip placement="top">
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
                    <el-tooltip placement="top">
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
                <p style="text-align: center; margin-top: 10px; color: red" v-if="item.status == 0">
                  {{ $t('algoTemplate.disabling') }}
                </p>
              </div>
            </div>
            <div class="bottom">
              <div class="bottom_left nowrap" :title="item.createTime">
                {{ $t('public.createTime') }}：{{ item.createTime }}
              </div>

              <el-dropdown
                class="bottom_right nowrap"
                :title="$t('public.moreActions')"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <span style="cursor: pointer; color: #cccccc">
                    {{ $t('public.moreActions') }}
                  </span>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :command="beforeHandleCommand(item.ruleId, 'enable')"
                      v-if="item.status == 0"
                    >
                      {{ $t('public.enable') }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      :command="beforeHandleCommand(item.ruleId, 'deactivate')"
                      v-if="item.status == 1"
                    >
                      {{ $t('public.deactivate') }}
                    </el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(item, 'del')">
                      {{ $t('public.delete') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <div class="pagination1" v-show="!loadingList && groupList.length">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-size="8"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalNum"
      ></el-pagination>
    </div>
    <template-detail></template-detail>
    <add-template></add-template>
  </div>
</template>

<script>
import templateDetail from './component/template_detail'
import templateAdd from './component/addTemplate'
export default {
  name: 'AlgorithmIdentificationConfiguration',
  components: {
    'template-detail': templateDetail,
    'add-template': templateAdd
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      queryParams: {
        taskName: undefined,
        taskState: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      timeRange: [],
      groupList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 8
      },
      loading: false,
      totalNum: 0,
      loadingList: false,
      dialogFormVisible_detail: false, //详情弹窗显示
      detailData: {}, //详情数据
      dialogFormVisible_add: false, //创建弹窗显示
      addForm: {}, //创建表单数据
      maskloading: false, //创建模板按钮状态
      operation: true, //判断创建、修改
      selectId: '',
      rules: {}
    }
  },
  created() {},
  mounted() {
    this.getGroupList()
    this.setFormRules()
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: this.$t('public.nearlyThreeDays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearlySevenSays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearly30Days'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              return [start, end]
            }
          }
        ]
      }
    }
  },
  methods: {
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
    },
    dateRangeChange(val) {
      this.queryParams.beginTime = val != null ? val[0] + ' 00:00:00' : undefined
      this.queryParams.endTime = val != null ? val[1] + ' 23:59:59' : undefined
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.pageInfo = {
            pageNum: 1,
            pageSize: 8
          }
          this.getGroupList()
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        taskName: undefined,
        taskState: undefined,
        beginTime: undefined,
        endTime: undefined
      }
      this.timeRange = []
      this.$resetForm('queryForm')
      this.pageInfo = {
        pageNum: 1,
        pageSize: 8
      }
      this.getGroupList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val
      this.getGroupList()
    },
    getGroupList() {
      this.loadingList = true
      let obj = {
        name: this.queryParams.taskName,
        status: this.queryParams.taskState,
        startTime: this.queryParams.beginTime,
        endTime: this.queryParams.endTime,
        pageInfo: this.pageInfo
      }
      this.$api
        .queryAlgorithmRule(obj)
        .then(res => {
          this.totalNum = res.pageInfo.totalNum
          this.groupList = res.ruleConfigInfoList ? res.ruleConfigInfoList : []
          this.loadingList = false
        })
        .catch(error => {
          this.totalNum = 0
          this.groupList = []
          this.loadingList = false
        })
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
    //判断画线标识形状
    //判断画线标识形状
    judgeDraw2(type) {
      let type2 = []
      if (type % 2 == 1) {
        type2.push(1)
      }
      if ((type >> 1) % 2 == 1) {
        type2.push(2)
      }
      if ((type >> 2) % 2 == 1) {
        type2.push(4)
      }
      if ((type >> 3) % 2 == 1) {
        type2.push(8)
      }
      return type2
    },
    // 详情按钮操作
    async handleView(id) {
      let res = await this.$api.searchAlgorithmRuleById({ ruleId: id })
      this.detailData = res.info
      this.dialogFormVisible_detail = true
    },
    //创建算法识别模板
    addTemplate() {
      this.operation = true
      this.addForm = {
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
      }
      this.dialogFormVisible_add = true
    },
    // 更多操作
    handleCommand(command) {
      switch (command.command) {
        case 'enable':
          this.enableGroup(command.row)
          break
        case 'deactivate':
          this.deactivateGroup(command.row)
          break
        case 'modify':
          this.modifyGroup(command.row)
          break
        case 'del':
          this.delGroup(command.row)
          break
      }
    },
    beforeHandleCommand(row, command) {
      return {
        row: row,
        command: command
      }
    },
    //启用模板
    enableGroup(id) {
      this.$api
        .changeAlgorithmRuleStatus({
          ruleId: id,
          status: 1
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.getGroupList()
            this.$message({
              type: 'success',
              message: this.$t('algoGuard.startSucc')
            })
          }
        })
    },
    //停用模板
    deactivateGroup(id) {
      this.$api
        .changeAlgorithmRuleStatus({
          ruleId: id,
          status: 0
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.getGroupList()
            this.$message({
              type: 'success',
              message: this.$t('algoGuard.stopSucc')
            })
          }
        })
    },
    //修改
    async modifyGroup(id) {
      this.operation = false
      this.selectId = id
      let res = await this.$api.searchAlgorithmRuleById({ ruleId: id })
      if (res.info.line) {
        res.info.line.type = this.judgeDraw2(res.info.line.type)
      }
      this.addForm = {
        name: res.info.name,
        type: res.info.type,
        remark: res.info.remark,
        roi: res.info.roi
          ? res.info.roi
          : {
              type: 0,
              status: 1,
              num: 1
            },
        nRoi: res.info.nRoi
          ? res.info.nRoi
          : {
              type: 0,
              status: 0,
              num: 1
            },
        line: res.info.line
          ? res.info.line
          : {
              type: [1],
              status: 1
            },
        maxTarget: res.info.maxTarget
          ? res.info.maxTarget
          : {
              type: 0,
              status: 0
            },
        minTarget: res.info.minTarget
          ? res.info.minTarget
          : {
              type: 0,
              status: 0
            }
      }
      this.dialogFormVisible_add = true
    },
    // 删除模板
    delGroup(row) {
      if (row.status == 1) {
        this.$message({
          type: 'error',
          message: this.$t('algoTemplate.onlyDeleted')
        })
        return
      }
      this.$confirm(this.$t('algoTemplate.continueDelete'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let obj = {}
          obj.ruleId = row.ruleId
          this.$api.deleteAlgorithmRule(obj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getGroupList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#identificationTemplate {
  padding: 20px 20px;

  .el-date-editor {
    width: 100%;
  }

  .el-select {
    width: 100%;
  }

  .groupList {
    background-color: #0d354e;
    height: 240px;
    margin-top: 20px;
    padding: 20px;
    border-radius: 4px;

    .header {
      display: flex;
      justify-content: space-between;

      .header_left {
        width: calc(100% - 50px);
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
      }

      .header_right {
        width: 50px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        color: #cccccc;
        text-align: right;
      }
    }

    .content {
      height: 166px;
      display: flex;

      .content_left {
        width: 64%;
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
            border-radius: 4px;
            text-align: center;
            line-height: 30px;
            background: rgba(54, 150, 229, 0.4);
            border: 1px solid #53a7ec;
            color: #ffffff;
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
        width: 36%;

        .img {
          width: 30px;
          margin: auto;
          margin-top: 50px;
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 400;
      color: #cccccc;

      .bottom_left {
        width: 68%;
      }

      .bottom_right {
        width: 30%;
        text-align: right;
      }

      .nowrap {
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
        vertical-align: bottom;
      }
    }
  }

  .pagination1 {
    width: 100%;
    text-align: right;
    margin-top: 20px;

    .el-pagination__total,
    .el-pagination__jump {
      color: #fff;
    }

    .el-input__inner {
      background-color: transparent;
      border: 1px solid #aaaaaa;
    }
  }

  .groupList:nth-child(4n + 2) {
    margin: 0 2% 1.5% 4%;
  }

  .groupList:nth-child(4n + 3) {
    margin: 0 4% 1.5% 2%;
  }

  :deep(.item-name) {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
