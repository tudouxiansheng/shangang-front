<template>
  <el-dialog
    :title="txt.deviceShare"
    v-model="dialogVisible"
    top="10vh"
    width="1500px"
    :close-on-click-modal="false"
    class="share"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <div class="share-device">
      <div class="share-device-title">
        <i class="el-icon-warning-outline" style="color: rgba(244, 160, 94, 1)"></i>
        <span>{{ txt.tips }}</span>
      </div>
      <div class="share-device-card">
        <div class="share-device-left">
          <tree-item
            class="tree-item"
            ref="deviceTree"
            :isShowChecked="true"
            :v-model:myChecked="myChecked"
            @cb="data => cb('01', data)"
          />
          <div class="line"></div>
          <tree-item
            class="tree-item"
            treeApi="getUserTree"
            ref="userTree"
            :lazy="false"
            :chooseLabel="txt.chooseUserShare"
            :isGroupId="false"
          />
        </div>
        <div class="share-device-center">
          <el-button type="primary" :loading="shareLoading" class="btn" @click="handleShare">
            {{ txt.share }}
          </el-button>
        </div>
        <div class="share-device-right">
          <div class="share-list-tree">
            <list-item
              class="list-item"
              ref="preShare"
              @handleDelete="handleDelete"
              @handleDeleteUser="handleDeleteUser"
              :chooseUserDevList="chooseUserDevList"
            />
          </div>
        </div>
      </div>
      <share-fail
        :title="txt.title"
        v-model:visible="shareErrorDialogVisible"
        :list="resultList"
        @surecb="dialogClosed"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submit">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import treeItem from './tree-item'
import listItem from './list-item'
import shareFail from './share-fail'
import constantsMixin from '../mixin/constantsMixin'
export default {
  name: 'device-share',
  mixins: [constantsMixin],
  components: {
    treeItem,
    listItem,
    shareFail
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      shareLoading: false,
      shareOrg: true,
      myChecked: true,
      chooseDeviceArr: [],
      chooseUserArr: [],
      chooseUserDevList: [],
      halfCheckedNodesArr: [], // 左侧每次设备半选nodes 用于右侧去重
      resultList: [],
      shareErrorDialogVisible: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {},
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {
      this.resetForm()
      this.chooseUserDevList = []
      this.$refs.preShare.selectedId = ''
      this.dialogVisible = false
    },
    resetForm() {
      this.$refs.deviceTree.$refs.shareDialogTree.$refs.treeList?.setCheckedKeys([])
      this.$refs.userTree.$refs.shareUserTree.$refs.treeList?.setCheckedKeys([])
      this.chooseUserArr = []
      this.chooseDeviceArr = []
      this.halfCheckedNodesArr = []
    },
    cb(type, data) {
      const { node } = data
      if (type == '01') {
        const checkedArr = node.checkedNodes || []
        this.halfCheckedNodesArr = node.halfCheckedNodes || []
        this.chooseDeviceArr = this.mergeCheckedTree('01', checkedArr)
      }
    },
    /**
     * @param {result} 设备
     * @param {result1} 组织
     */
    mergeCheckedTree(type, checkedArr, result = [], result1 = []) {
      // 例如选中1,12,14,16,xxxxx 右侧1,12,14 去掉左侧这个对象 ;选中1,12 则去掉右侧这个对象
      // 相当于 每个节点中解析祖先节点是否存在与数组中，如果该节点的所有祖先都不存在与数组中，则增加该节点到结果数组，最终返回 0,1,2,3  0,1  0,1,2 数组中id为
      const orgArr = checkedArr.filter(i => String(i.id).length < 10) || []

      JSON.parse(JSON.stringify(checkedArr)).forEach(i => {
        if (i.payload.parentId == undefined) {
          if (orgArr.length) {
            if (!orgArr.some(j => j.id == String(i.payload.organizationId))) {
              result.push({ ...i, type: 0 })
            }
          } else {
            result.push({ ...i, type: 0 })
          }
        }
      })

      if (orgArr.length) {
        const index = orgArr.findIndex(i => String(i.id) == '0')
        if (index !== -1) {
          result1 = [{ ...orgArr[index], type: this.myChecked ? 1 : 0 }]
        } else {
          orgArr.forEach(item => {
            if (!result1.length) {
              result1.push({ ...item, type: this.myChecked ? 1 : 0 })
            } else {
              if (!result1.some(j => j.id == String(item.payload.parentId))) {
                result1.push({ ...item, type: this.myChecked ? 1 : 0 })
              }
            }
          })
          if (type == '02') {
            result1 = result1.filter(
              item => !result1.some(i => i.id == String(item.payload.parentId))
            )
          }
        }
      }

      for (const i of [...result1, ...result]) {
        i.pid =
          i.payload.parents.length - 1 == i.payload.parents.lastIndexOf(',')
            ? i.payload.parents.slice(0, i.payload.parents.length - 1)
            : i.payload.parents
        i.pid = i.pid
          .split(',')
          .filter(j => j != i.id)
          .join(',')
      }

      return this.filterArr([...result1, ...result])
    },

    filterArr(nodes) {
      let result = []
      const ids = nodes.map(node => node.id)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const ancestors = node.pid.split(',')
        let ancestorExists = false
        for (let j = 0; j < ancestors.length; j++) {
          if (ids.indexOf(ancestors[j]) !== -1) {
            ancestorExists = true
            break
          }
        }
        if (!ancestorExists) {
          result.push(node)
        }
      }
      return result
    },

    async handleShare() {
      this.chooseUserArr = this.$refs.userTree.checkedNodes
      const arr = []
      if (!this.chooseUserArr.length) {
        this.$message.warning(this.$t('shareDevice.pleaseChooseUser'))
        return false
      } else if (this.chooseUserArr.length > 500) {
        this.$message.warning(this.$t('shareDevice.max500User'))
        return false
      }
      if (!this.chooseDeviceArr.length) {
        this.$message.warning(this.$t('shareDevice.pleaseOrg'))
        return false
      } else if (this.chooseDeviceArr.length > 500) {
        this.$message.warning(this.$t('shareDevice.max500Dev'))
        return false
      }
      this.shareLoading = true
      this.chooseUserArr.forEach(i => {
        let obj = {
          ...i,
          list: this.chooseDeviceArr
        }
        arr.push(obj)
      })
      setTimeout(() => {
        this.chooseUserDevList = this.assemblyData(
          JSON.parse(JSON.stringify([...this.chooseUserDevList, ...arr]))
        )
        this.resetForm()
        this.shareLoading = false
      }, 0)
    },

    assemblyData(arr) {
      let result = [] // 合并子级
      arr.forEach(i => {
        let index = result.findIndex(item => i.id == item.id)
        if (index === -1) {
          result.push(i)
        } else {
          result[index].list = this.mergeList(result[index].list, i.list)
        }
      })

      result.forEach(item => {
        item.list = this.mergeCheckedTree('02', item.list)
      })

      return result
    },

    mergeList(list1, list2) {
      list2.forEach(obj2 => {
        let index = list1.findIndex(obj1 => obj1.id == obj2.id)
        if (index === -1) {
          list1.push(obj2)
        }
      })
      return list1
    },
    handleDelete(id, i) {
      const index = this.chooseUserDevList.findIndex(item => item.id == id)
      this.chooseUserDevList[index]['list'].splice(i, 1)
      // 用户下没有设备时，删除用户
      if (!this.chooseUserDevList[index]['list'].length) {
        this.$refs.preShare.selectedId = ''
        this.chooseUserDevList.splice(index, 1)
      }
    },
    // 删除用户
    handleDeleteUser(index) {
      this.$refs.preShare.selectedId = ''
      this.chooseUserDevList.splice(index, 1)
    },
    submit() {
      if (!this.chooseUserDevList.length) {
        this.$message.warning(this.$t('shareDevice.pleasePreShare'))
        return false
      }
      this.loading = true
      const allocateList = []
      this.chooseUserDevList.forEach(item => {
        let obj = {
          userId: item.id,
          deviceOrgList: []
        }
        item.list.forEach(dev => {
          let devObj = {
            deviceIds: []
          }
          devObj.type = dev.type
          if (String(dev.id).length < 10) {
            devObj.groupId = dev.id
          } else {
            if (obj.deviceOrgList.length) {
              const currIndex = obj.deviceOrgList.findIndex(
                current => String(current.groupId) == String(dev.payload.organizationId)
              )
              if (currIndex !== -1) {
                obj.deviceOrgList[currIndex].deviceIds.push(dev.id)
              } else {
                devObj.groupId = dev.payload.organizationId
                devObj.deviceIds.push(dev.id)
              }
            } else {
              devObj.groupId = dev.payload.organizationId
              devObj.deviceIds.push(dev.id)
            }
          }
          if (devObj.groupId !== undefined) {
            obj.deviceOrgList.push(devObj)
          }
        })
        allocateList.push(obj)
      })

      this.$api.addDeviceToUser({ allocateList }).then(res => {
        try {
          if (!res.resultList || (res.resultList && !res.resultList.length)) {
            this.$message({
              message: this.$t('public.operatingSuccess'),
              type: 'success'
            })
            this.dialogClosed()
            this.$emit('optioncb')
          } else {
            this.resultList = res.resultList
            this.shareErrorDialogVisible = true
          }
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped></style>
