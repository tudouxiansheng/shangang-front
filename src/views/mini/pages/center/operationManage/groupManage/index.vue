<template>
  <div class="p-5" ref="groupManage" v-if="isRouterAlive">
    <div id="goBack">
      <el-page-header @back="goBack" :content="$t('operateManage.groupMange')"></el-page-header>
      <el-row class="mt-5">
        <el-button type="primary" @click="addGroup">{{ $t('operateManage.addGroup') }}</el-button>
      </el-row>
      <div class="mt-5">
        <el-table border v-loading="loading" :data="tableData" :row-class-name="tableRowClassName">
          <el-table-column type="index" width="50" :label="$t('public.sn')" />
          <el-table-column prop="groupName" :label="$t('operateManage.groupName')" />
          <el-table-column prop="totalDeviceNum" :label="$t('operateManage.devNumber')">
            <template #default="{ row }">
              <span>{{ row.totalDeviceNum }}/500</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" :label="$t('public.createTime')" />
          <el-table-column :label="$t('public.operating')">
            <template #default="{ row }">
              <span class="cursor-pointer text-detail" @click="editeGroup(row)">
                {{ $t('public.edit') }}
              </span>
              <span class="ml-5 text-red-400 cursor-pointer" @click="deleteGroup(row)">
                {{ $t('public.delete') }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <addGroup />
  </div>
</template>

<script>
import addGroup from './component/addGroup.vue'

export default {
  name: 'GroupManagement',
  components: { addGroup },
  data() {
    return {
      isRouterAlive: true,
      loading: false,
      tableData: [],
      dialogVisible: false,
      dialogType: 0, //0添加 1：编辑
      groupId: ''
    }
  },
  computed: {
    streamTypeList() {
      let arr = []
      if (this.dialogVisible) {
        arr = [
          {
            name: this.$t('operateManage.streamType1'),
            value: 1
          },
          {
            name: this.$t('operateManage.streamType2'),
            value: 2
          },
          {
            name: this.$t('operateManage.streamType3'),
            value: 3
          }
        ]
      }
      return arr
    }
  },
  mounted() {
    this.getGroupList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 获取所有分组
    async getGroupList() {
      this.loading = true
      let res = await this.$api.getGroupList()
      if (res.resultCode == 0) {
        this.loading = false
        this.tableData = res.groupList
      }
    },
    addGroup() {
      this.dialogType = 0
      this.dialogVisible = true
    },
    editeGroup(row) {
      this.groupId = row.groupId
      this.dialogType = 1
      this.dialogVisible = true
    },
    deleteGroup(row) {
      this.$confirm(this.$t('operateManage.deleteGroup'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deletePatrolGroupInfo({ groupId: row.groupId }).then(res => {
            if (res.resultCode == 0) {
              this.getGroupList()
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess') + '!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete') + '!'
          })
        })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-page-header__content) {
  color: #fff;
}
</style>
