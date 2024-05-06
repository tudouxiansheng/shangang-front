<template>
  <!-- 短信模板管理 -->
  <div id="messageTemplate-manage" v-if="isRouterAlive" ref="messageTemplateManage">
    <el-row>
      <el-col :span="24" class="el-row20" :style="{ minHeight: th + 'px' }">
        <div style="position: relative; min-height: 38px">
          <div class="btnMargin">
            <el-button type="primary" @click="handleAdd">
              {{ $t('messageTemplate.addTemplate') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 0px; right: -8px">
            <el-form
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
              ref="form"
              label-position="left"
            >
              <el-form-item>
                <el-input
                  v-model="searchWord"
                  clearable
                  size="small"
                  class="filter-item inputMiddle"
                  :placeholder="$t('messageTemplate.inputTemplateName')"
                  @keyup.enter.native="handleFind"
                  :style="locale == 'en' ? { width: '260px' } : ''"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFind" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            max-height="408"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              :label="$t('messageTemplate.templateId')"
              min-width="70"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.templateId }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('messageTemplate.templateName')"
              min-width="70"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.templateName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('messageTemplate.remark')"
              min-width="80"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.remark }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="110" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.updateTime')" min-width="110" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleEdit(row)">
                  {{ $t('public.modify') }}
                </span>

                <span
                  :class="row.enable == '0' ? 'blue' : 'danger'"
                  style="margin-right: 7px; cursor: pointer; color: #f56c6c"
                  @click="handleDelete(row)"
                >
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div class="pagination" v-if="!loading && tableData.length">
            <div class="paging">
              <span>{{ $t('public.everyPageShows') }}</span>
              <el-select v-model="number" @change="numberChange">
                <el-option
                  v-for="(item, index) in numberList"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ $t('public.records') }}</span>
            </div>
            <div>
              <el-pagination
                v-model:current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalNum"
                @current-change="handleCurrentChange"
                background
              />
            </div>
          </div>
        </div>

        <!-- 添加或修改对话框 -->

        <el-dialog
          draggable
          :title="
            operation == 1
              ? $t('messageTemplate.addTemplate')
              : operation == 2
              ? $t('messageTemplate.templateDetail')
              : $t('messageTemplate.modifyTemplate')
          "
          v-model="dialogFormVisible"
          top="10vh"
          width="1000px"
          :close-on-click-modal="false"
        >
          <el-form
            ref="dataForm"
            :model="dataForm"
            :rules="rules2"
            :label-width="locale == 'zh' ? '150px' : '240px'"
            size="small"
            label-position="left"
            :style="locale == 'en' ? { marginLeft: '-50px' } : ''"
          >
            <el-form-item :label="$t('messageTemplate.thirdTemplateId') + ':'">
              <el-input
                v-model="dataForm.thirdTemplateId"
                auto-complete="off"
                :placeholder="$t('messageTemplate.inputThirdTemplateId')"
                :disabled="operation == 2"
              />
            </el-form-item>

            <el-form-item :label="$t('messageTemplate.templateName') + ':'" prop="templateName">
              <el-input
                v-model="dataForm.templateName"
                auto-complete="off"
                :placeholder="$t('messageTemplate.inputTemplateName')"
                :disabled="operation == 2"
              />
            </el-form-item>

            <el-form-item :label="$t('messageTemplate.templateType') + ':'" prop="templateType">
              <el-select
                :popper-append-to-body="false"
                v-model="dataForm.templateType"
                :placeholder="$t('messageTemplate.chooseTemplateType')"
                :disabled="operation == 2"
              >
                <el-option :label="$t('messageTemplate.templateType0')" :value="0"></el-option>
                <el-option :label="$t('messageTemplate.templateType1')" :value="1"></el-option>
                <el-option :label="$t('messageTemplate.templateType2')" :value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('messageTemplate.templateContent') + ':'"
              prop="templateContent"
            >
              <el-popover placement="bottom" width="200" trigger="hover" v-if="operation != 1">
                <div>
                  <span>{{ dataForm.templateContent }}</span>
                </div>
                <template #reference>
                  <el-input
                    v-model="dataForm.templateContent"
                    auto-complete="off"
                    :placeholder="$t('messageTemplate.inputTemplateContent')"
                    :disabled="operation == 2"
                  />
                </template>
              </el-popover>

              <el-input
                v-if="operation == 1"
                v-model="dataForm.templateContent"
                auto-complete="off"
                :placeholder="$t('messageTemplate.inputTemplateContent')"
                :disabled="operation == 2"
              />
            </el-form-item>

            <el-form-item :label="$t('messageTemplate.remark') + ':'" prop="remark">
              <el-input
                v-model="dataForm.remark"
                auto-complete="off"
                :placeholder="$t('messageTemplate.inputRemark')"
                :disabled="operation == 2"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">{{ $t('public.cancel') }}</el-button>
              <el-button type="primary" @click="submitForm" v-if="operation != 2">
                {{ $t('public.confirm') }}
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'SMSTemplateManagement',
  data() {
    return {
      isRouterAlive: true,
      searchWord: '',
      locale: localStorage.getItem('locale'),
      th: window.innerHeight - 70,

      // 表格数据
      tableData: [],
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      organizationId: 0,

      operation: 1, // true:新增, false:编辑
      dialogFormVisible: false, // 添加或者编辑

      // 添加修改框表单
      dataForm: {
        templateId: '',
        templateName: '',
        templateContent: '',
        remark: '',
        thirdTemplateId: ''
      },

      loading: true,

      rules2: {
        templateName: [
          {
            required: true,
            message: this.$t('messageTemplate.inputTemplateName'),
            trigger: 'blur'
          }
        ],
        templateType: [
          {
            required: true,
            message: this.$t('messageTemplate.chooseTemplateType'),
            trigger: 'blur'
          }
        ],
        templateContent: [
          {
            required: true,
            message: this.$t('messageTemplate.inputTemplateContent'),
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: this.$t('messageTemplate.inputRemark'),
            trigger: 'blur'
          }
        ]
      }
    }
  },

  mounted() {
    this.getTemplateList()
  },
  methods: {
    getTemplateList() {
      this.dataText = ''
      this.loading = true
      let obj = {}
      obj.pageInfo = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      obj.templateName = this.searchWord
      this.$api.getSmsTemplateList(obj).then(res => {
        if (res.templateList && res.templateList.length) {
          this.tableData = res.templateList
          this.totalNum = res.pageInfo.totalNum
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0);
          });
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getTemplateList()
    },
    // 分页
    handleCurrentChange: function (val) {
      this.pageNum = val
      this.getTemplateList()
    },

    handleAdd() {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.operation = 1
      this.dataForm = {
        userName: '',
        alarmType: '', //告警分类
        alarmLevel: '', //告警级别
        canLinkage: '1', //是否可联动
        canQuery: '1', //是否可查询
        enable: '', //是否启用
        pass: '',
        checkPass: '',
        roleName: '',
        isLocked: '' + 0,

        email: '',
        address: '',
        remark: ''
      }
      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getTemplateList()
    },

    //删除
    handleDelete(row) {
      this.$confirm(this.$t('messageTemplate.deleteTemplateWarning'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let obj = {}
          obj.templateId = row.templateId
          this.$api.deleteSmsTemplateInfo(obj).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('messageTemplate.deleteSuccess')
              })
              this.getTemplateList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    //详情
    async handleInfo(row) {
      await this.$api.getSmsTemplateInfo({ templateId: row.templateId }).then(res => {
        if (res.resultCode == 0) {
          this.dataForm = res.templateInfo
        }
      })
      this.dialogFormVisible = true

      this.operation = 2
    },

    // 编辑
    async handleEdit(row) {
      this.dataForm.templateId = row.templateId

      await this.$api.getSmsTemplateInfo({ templateId: row.templateId }).then(res => {
        if (res.resultCode == 0) {
          this.dataForm = res.templateInfo
        }
      })
      this.dialogFormVisible = true

      this.operation = 3
    },

    // 表单提交
    submitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.operation == 1) {
            let addObj = {}
            addObj.thirdTemplateId = this.dataForm.thirdTemplateId
            addObj.templateName = this.dataForm.templateName
            addObj.templateType = this.dataForm.templateType
            addObj.templateContent = this.dataForm.templateContent
            addObj.remark = this.dataForm.remark

            this.$api.addSmsTemplateInfo(addObj).then(res => {
              if (res.resultCode == 0) {
                this.getTemplateList()
                this.dialogFormVisible = false

                this.$message({
                  type: 'success',
                  message: this.$t('messageTemplate.addSuccess')
                })
              }
            })
          } else if (this.operation == 3) {
            let modifyObj = {}
            modifyObj.templateId = this.dataForm.templateId
            modifyObj.thirdTemplateId = this.dataForm.thirdTemplateId
            modifyObj.templateName = this.dataForm.templateName
            modifyObj.templateType = this.dataForm.templateType
            modifyObj.templateContent = this.dataForm.templateContent
            modifyObj.remark = this.dataForm.remark

            this.$api.modifySmsTemplateInfo(modifyObj).then(res => {
              if (res.resultCode == 0) {
                this.getTemplateList()
                this.dialogFormVisible = false
                this.$message({
                  type: 'success',
                  message: this.$t('messageTemplate.modifySuccess')
                })
              }
            })
          }
        }
      })
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.locale = localStorage.getItem('locale')
    }
  }
}
</script>

<style lang="scss">
#messageTemplate-manage {
  height: 100%;

  .highSearch .el-form-item__content {
    display: flex;
    align-items: center;
  }
}
</style>
