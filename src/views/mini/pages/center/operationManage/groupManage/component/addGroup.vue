<template>
  <div>
    <el-dialog
      :title="
        $parent.dialogType == 0 ? $t('operateManage.addGroup') : $t('operateManage.editGroup')
      "
      v-model="$parent.dialogVisible"
      top="10vh"
      width="1200px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-row class="flex">
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formData"
          label-width="80px"
          label-position="left"
        >
          <el-form-item :label="$t('operateManage.groupName') + ':'" prop="name">
            <el-input
              v-model="formData.name"
              :placeholder="$t('operateManage.pleaseInputGroupName')"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <collapse-card :title="$t('operateManage.selectDevice')" hideCollapse>
        <el-row class="pt-5 border-t border-gray-200">
          <el-button type="primary" @click="selectDevice">
            {{ $t('operateManage.selectDevice') }}
          </el-button>
          <el-button type="danger" @click="batchDel" :disabled="delShow">
            {{ $t('public.batchDeletion') }}
          </el-button>
        </el-row>

        <el-row class="mt-5">
          <el-table
            border
            v-loading="loading"
            :data="cameraList"
            max-height="300"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column
              :label="$t('deviceInfo.deviceID')"
              prop="devId"
              show-overflow-tooltip
            />
            <el-table-column
              :label="$t('deviceInfo.deviceName')"
              prop="devName"
              show-overflow-tooltip
            />
            <el-table-column
              show-overflow-tooltip
              :label="$t('operateManage.videoStream')"
              min-width="80"
            >
              <template #default="{ row }">
                <el-select v-model.number="row.streamType">
                  <el-option
                    v-for="item in $parent.streamTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="mt-5 text-center">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submit">{{ $t('public.confirm') }}</el-button>
        </el-row>
      </collapse-card>
    </el-dialog>
    <device-tools
      :dialogDeviceVisible="dialogDeviceVisible"
      @getChooseCameras="getCameras"
      :currentChooseCameras="currentChooseCameras"
      :title="$t('operateManage.selectDevice')"
      type="1"
      :ifJudgeAiType="true"
      :maxSelect="500"
    ></device-tools>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import collapseCard from '../../component/collapse-card.vue'
import DeviceTools from '@/components/device-tools'

export default {
  components: { collapseCard, DeviceTools },

  data() {
    return {
      loading: false,
      delShow: true,
      devName: '',
      multipleSelection: [],
      cameraList: [],
      total: 0,
      currentChooseCameras: [],
      camerasArray: [],
      dialogDeviceVisible: false,
      formData: {
        name: ''
      },
      formRules: {
        name: [
          {
            required: true,
            message: this.$t('workOrder.ticketNamePrompt'),
            trigger: 'blur'
          }
        ]
      },
      searchForm: {
        groupId: '',
        devName: '',
        devId: '',
        pageInfo: {
          pageNum: 1,
          pageSize: 500
        }
      }
    }
  },
  computed: {
    tableData() {
      let list = []
      return list
    }
  },
  methods: {
    async dialogOpen() {
      if (this.$parent.dialogType == 1) {
        // 获取详情

        await this.getDetail()
      }
    },
    // 获取详情
    async getDetail() {
      this.loading = true
      this.searchForm.groupId = this.$parent.groupId
      let res = await this.$api.getGroupInfo(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        this.total = res.pageInfo.totalNum
        this.formData.name = res.groupName
        this.cameraList = res.devList
        this.cameraList.forEach(item => {
          item.cameraName = item.devName
          item.cameraId = item.devId
        })
      }
    },
    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.getDetail()
    },
    async getCameras(cameras) {
      let cameraList = []
      let camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        cameraList.push({
          devName: cameras[i].label,
          devId: cameras[i].id,
          streamType: 1,
          cameraName: cameras[i].label,
          cameraId: cameras[i].id
        })
        camerasArray.push(cameras[i].id)
      }
      this.cameraList = this.unique(cameraList, this.cameraList)
      this.camerasArray = camerasArray
      this.currentChooseCameras = JSON.parse(JSON.stringify(cameras))
    },
    unique(arr1, arr2) {
      //去掉重复选取的数据
      for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
          if (arr1[i].cameraId == arr2[j].cameraId) {
            //通过cameraId属性进行匹配；
            arr1[i] = arr2[j]
          }
        }
      }
      return arr1
    },
    // 批量删除
    batchDel() {
      let list = this.cameraList.filter(items => {
        if (!this.multipleSelection.includes(items)) return items
      })
      this.cameraList = list
    },
    // 获取摄像机信息
    async getCameraInfo(id) {
      let res = await this.$api.getCameraInfo({ cameraId: id })
      if (res.resultCode == 0) {
        return res.cameraDirectionInfo.installLocate
      }
    },
    selectDevice() {
      this.dialogDeviceVisible = true
    },
    handleSelectionChange(val) {
      if (val.length != 0) {
        this.delShow = false
      } else {
        this.delShow = true
      }
      this.multipleSelection = val
    },
    submit() {
      this.$refs['formData'].validate(valid => {
        if (this.cameraList.length == 0) {
          this.$message({
            message: this.$t('primaryDevice.DevicePrompt'),
            type: 'warning'
          })
        } else if (valid && this.cameraList.length > 0) {
          let obj = {
            name: this.formData.name,
            devList: []
          }
          this.cameraList.map(item => {
            obj.devList.push({
              devId: item.devId,
              streamType: item.streamType
            })
          })

          if (this.$parent.dialogType == 0) {
            this.$api.addPatrolGroupInfo(obj).then(res => {
              if (res.resultCode == 0) {
                this.$parent.dialogVisible = false
                this.$parent.getGroupList()
                this.$message({
                  message: this.$t('operateManage.addGroupSuccess'),
                  type: 'success'
                })
              }
            })
          } else if (this.$parent.dialogType == 1) {
            obj.groupId = this.$parent.groupId
            this.$api.modifyPatrolGroupInfo(obj).then(res => {
              if (res.resultCode == 0) {
                this.$parent.dialogVisible = false
                this.$parent.getGroupList()
                this.$message({
                  message: this.$t('operateManage.editGroupSuccess'),
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },
    dialogClosed() {
      this.$refs['formData'].resetFields()
      this.cameraList = []
      this.dialogDeviceVisible = false
      this.$parent.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 20px;
}
:deep(.card-header-title) {
  span {
    color: #000 !important;
  }
}
</style>
