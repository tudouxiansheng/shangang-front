<template>
  <div>
    <el-dialog
      :title="$t('videoQualityPatrol.cameraListTitle')"
      v-model="isVisible"
      top="10vh"
      width="800px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            :placeholder="$t('videoQualityPatrol.cameraNameProp')"
            v-model="cameraName"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="getVideoQualityMainTaskCameraList">
            {{ $t('public.search') }}
          </el-button>
        </el-col>
      </el-row>
      <el-table class="mt-10" :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column
          prop="cameraName"
          :label="$t('videoQualityPatrol.cameraName')"
          show-overflow-tooltip
        />
        <el-table-column
          prop="cameraId"
          :label="$t('videoQualityPatrol.cameraId')"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span class="cursor-pointer" @click="handleDetail(row)">
              {{ $t('videoQualityPatrol.check') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['dialogVisible', 'taskId', 'taskName'],
  data() {
    return {
      cameraName: undefined,
      loading: false,
      tableData: [],
      cuType: sessionStorage.getItem('cuType'),
      key: sessionStorage.getItem('key'),
      language: sessionStorage.getItem('language')
    }
  },
  computed: {
    ...mapState({
      clientNonce: state => state.auth.clientNonce,
      token: state => state.auth.accessToken,
    }),
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  mounted() {},
  methods: {
    dialogOpen() {
      this.getVideoQualityMainTaskCameraList()
    },
    async getVideoQualityMainTaskCameraList() {
      this.loading = true
      let res = await this.$api.getVideoQualityMainTaskCameraList({
        taskId: this.taskId,
        cameraName: this.cameraName
      })
      if (res.resultCode == 0) {
        this.loading = false
        this.tableData = res.cameras
      }
    },
    handleDetail(row) {
      this.isVisible = false
      this.$router.push({
        name: 'CameraQualityDetail',
        params: {
          id: row.cameraId,
          name: row.cameraName,
          type: 2
        }
      })
    },
    dialogClosed() {
      this.cameraName = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
  .el-table__empty-block {
    background: #fff;
  }
  .el-table tr {
    background: #fff !important;
  }
}
:deep(.el-input .el-input__inner) {
  background: transparent;
  border: none;
}
:deep(.el-table) {
  --el-table-border-color: rgb(229, 231, 235);
}
</style>
