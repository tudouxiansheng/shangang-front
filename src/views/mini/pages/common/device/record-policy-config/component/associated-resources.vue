<template>
  <div>
    <el-dialog
      title="关联可选资源"
      v-model="$parent.associatedResourcesVisible"
      top="10vh"
      :width="locale == 'en' ? '1350px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="associatedResourcesDialog"
    >
      <div v-loading="loading" :element-loading-text="$t('public.loading')">
        <div v-if="!loading && !tableData.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt />
          <p>{{ $t('public.noData') }}</p>
        </div>

        <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
        >
          <el-table-column label="序号" width="50"></el-table-column>
          <el-table-column label="设备ID" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="摄像机名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="存储留存期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="存储码流" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column label="已占用空间" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>

        <!--分页-->
        <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
        ></pagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="addMainDevSubmit"
            :loading="$parent.maskloading"
          >
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {
  InfoFilled as ElIconInfo,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp,
  Delete as ElIconDelete
} from '@element-plus/icons-vue'
import pagination from "@components/pagination.vue";

export default {
  components: {pagination},
  data() {
    return {
      ElIconDelete,
      locale: localStorage.getItem('locale'),
      dialogClose: false,

      form: {
      },


      // 表格数据
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
    }
  },
  computed: {
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.$parent.associatedResourcesVisible = false
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('添加确认按钮事件')
        }
      })
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    // 分页
    getListByPage() {
    },
  }
}
</script>

<style lang="scss">
.associatedResourcesDialog {
  .clear {
    margin-left: 20px;
  }
}
#recordPolicyConfig .el-step__icon.is-text {
  background: #fff !important;
}
</style>
