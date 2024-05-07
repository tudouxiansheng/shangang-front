<template>
  <div>
    <el-dialog
      title="重点视频质量诊断"
      v-model="$parent.exportdialogVisible"
      class="dialogWithCard"
      top="10vh"
      width="1200px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <div class="mt-5">
        <el-table border v-loading="loading" :data="tableData" stripe>
          <el-table-column prop="groupName" label="巡检任务Id" />
          <el-table-column prop="totalDeviceNum" label="巡检组织" />
          <el-table-column prop="createTime" label="任务内容" />
          <el-table-column prop="createTime" label="任务状态" />
          <el-table-column prop="createTime" label="触发时间" />
          <el-table-column prop="createTime" label="巡检数" />
          <el-table-column prop="createTime" label="巡检时长" />
          <el-table-column prop="createTime" label="完成时间" />
          <el-table-column :label="$t('public.operating')">
            <template>
              <span class="cursor-pointer text-detail" @click="download">下载</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:pageNum="searchForm.pageInfo.pageNum"
          v-model:limit="searchForm.pageInfo.pageSize"
          @pagination="dialogOpen"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      loading: false,
      total: 0,
      tableData: []
    }
  },
  methods: {
    async dialogOpen() {
      let res = await this.$api.getTaskList(this.searchForm)
    },
    async download(row) {
      await this.$api.exportMajorResult(row.taskId)
    },
    dialogClosed() {}
  }
}
</script>
