<template>
  <el-dialog
    :title="$t('lensTranscodingTask.chooseTranscodeNode')"
    v-model="$parent.selectDialogVisible"
    width="1250px"
    top="10vh"
    :close-on-click-modal="false"
    class="open_select_dialog"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <div class="search-form">
      <el-form
        :inline="true"
        class="demo-form-inline"
        ref="form"
        :rules="rules"
        :model="searchForm"
        label-position="left"
      >
        <div class="flexstart">
          <el-form-item :label="$t('lensTranscodingTask.nodeIp') + '：'" class="flex-item">
            <el-input
              v-model="searchForm.nodeIp"
              auto-complete="off"
              :placeholder="$t('lensTranscodingTask.inputNodeIp')"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('lensTranscodingTask.loadValue') + '：'"
            class="flex-item"
            props="loadValue"
          >
            <el-input
              v-model="searchForm.loadValue"
              auto-complete="off"
              type="number"
              :placeholder="$t('lensTranscodingTask.inputLoadValue')"
              clearable
            />
          </el-form-item>
        </div>
        <div class="search-btn">
          <el-button type="primary" class="miniBtn" @click="handleFind">
            {{ $t('public.search') }}
          </el-button>
          <el-button @click="handleRest">{{ $t('public.reset') }}</el-button>
        </div>
      </el-form>
    </div>
    <no-table
      :tableLoading="loading"
      :tableData="transcodeList"
      style="max-height: 485px; height: auto"
    >
      <el-table
        v-if="!loading && transcodeList.length"
        max-height="600"
        ref="multipleTable"
        :data="transcodeList"
        :row-class-name="tableRowClassName"
        border
      >
        <el-table-column label="" width="40">
          <template #default="{ row, $index }">
            <el-radio
              v-if="row.totalTask > row.nowTask"
              :label="row.nodeIp"
              v-model="radio"
              @change.native="getCurrentRow(row)"
              style="color: rgba(0, 0, 0, 0) !important; padding-left: 3px"
            ></el-radio>
            <el-radio
              v-else
              :label="row.nodeIp"
              v-model="radio"
              disabled
              style="color: rgba(0, 0, 0, 0) !important; padding-left: 3px"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('lensTranscodingTask.mediaNodeId')"
          show-overflow-tooltip
          min-width="180"
        >
          <template #default="{ row }">
            <span>{{ row.mediaNodeId }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('lensTranscodingTask.nodeIp')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.nodeIp }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('lensTranscodingTask.taskNum')" show-overflow-tooltip>
          <template #default="{ row }">
            <span>
              {{ row.nowTask + '/' + row.totalTask }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('lensTranscodingTask.loadValue')"
          min-width="80"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span
              :class="
                row.loadValue >= 80
                  ? 'danger'
                  : row.loadValue >= 60 && row.loadValue < 80
                  ? 'warning'
                  : row.loadValue < 60
                  ? 'success'
                  : ''
              "
            >
              {{ row.loadValue }}%
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('lensTranscodingTask.cpuValue')"
          min-width="80"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.cpuValue }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('lensTranscodingTask.memoryValue')"
          min-width="80"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.memoryValue }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('lensTranscodingTask.diskValue')"
          min-width="80"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>{{ row.diskValue }}%</span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <pagination
        v-if="!loading && transcodeList.length"
        :total="totalNum"
        v-model:pageNum="pageNum"
        v-model:limit="pageSize"
        @pagination="getListByPage"
      />
    </no-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>

    <div style="color: #e6a23c; margin-top: 10px; display: flex; align-items: center">
      <el-icon class="warning" style="font-size: 26px; margin-right: 10px">
        <el-icon-warning-outline />
      </el-icon>
      <div>
        <span>{{ $t('lensTranscodingTask.transcodingNodesTips') }}</span>
        <div>
          {{ $t('lensTranscodingTask.loadValueTips') }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { Warning as ElIconWarningOutline } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconWarningOutline
  },
  props: {
    transcodeNodeInfo: {
      type: Object,
      default() {
        return {
          transcodeNode: ''
        }
      }
    },
    nodeArr: {
      type: Array
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      searchForm: {
        nodeIp: '',
        loadValue: ''
      },
      loading: false,
      transcodeList: [],
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      transcodeNodeRow: null,
      rules: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  computed: {
    radio: {
      get() {
        return this.transcodeNodeInfo.transcodeNode
      },
      set(value) {
        this.transcodeNodeInfo.transcodeNode = value
      }
    }
  },
  methods: {
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    dialogClosed() {
      this.$parent.selectDialogVisible = false
    },
    dialogOpen() {
      this.$nextTick(async () => {
        this.setDialogCss()
        this.getTranscodeNodes()
      })
    },
    getTranscodeNodes() {
      //获取转码节点列表
      this.loading = true
      //如果搜索条件负载值为空 则不给后台传这个参的字段
      let searchInfo = {}
      if (this.searchForm.loadValue == '') {
        searchInfo = {
          nodeIp: this.searchForm.nodeIp
        }
      } else {
        searchInfo = {
          nodeIp: this.searchForm.nodeIp,
          loadValue: Number(this.searchForm.loadValue)
        }
      }
      let obj = {
        type: 'transcode',
        pageInfo: {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        },
        searchInfo: {
          ...searchInfo
        }
      }
      this.$api.getTranscodeNodes(obj).then(res => {
        if (res.resultCode == 0) {
          if (res.nodes && res.nodes.length) {
            this.transcodeList = res.nodes
            this.totalNum = res.pageInfo.totalNum

            //将转码任务选择的节点塞进列表中
            if (this.nodeArr) {
              for (let i = 0; i < this.nodeArr.length; i++) {
                for (let j = 0; j < res.nodes.length; j++) {
                  if (this.nodeArr[i] == res.nodes[j].nodeIp) {
                    res.nodes[j].nowTask++
                  }
                }
              }
            }

            this.$nextTick(() => {
              this.$refs.multipleTable?.setScrollTop(0);
            });
          } else {
            this.transcodeList = []
            this.totalNum = 0
            this.dataText = this.$t('public.noData')
          }
          this.loading = false
        }
      })
    },
    handleFind() {
      this.pageNum = 1
      this.getTranscodeNodes()
    },
    // 分页
    getListByPage() {
      this.getTranscodeNodes()
    },
    getCurrentRow(row) {
      this.transcodeNodeRow = row
    },
    submitForm() {
      if (!this.transcodeNodeRow) {
        if (!this.radio) {
          this.$message.warning(this.$t('lensTranscodingTask.pleaseSelectTranscodingNodes') + '！')
          return
        } else {
          this.transcodeNodeRow = {
            nodeIp: this.transcodeNodeInfo.transcodeNode,
            mediaNodeId: this.transcodeNodeInfo.transcodeNodeId
          }
        }
      }
      this.$emit('getTranscodeNodeItem', this.transcodeNodeRow)
    },
    handleRest() {
      this.searchForm.nodeIp = ''
      this.searchForm.loadValue = ''
    }
  }
}
</script>

<style lang="scss">
.open_select_dialog {
  .el-dialog__body {
    padding: 15px 30px 5px 30px;
  }
  .el-radio__input.is-checked + .el-radio__label {
    opacity: 0;
  }
}
</style>
