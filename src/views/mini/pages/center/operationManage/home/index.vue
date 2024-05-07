<template>
  <div class="operation-home" ref="operationHome" v-if="isRouterAlive">
    <!-- 头部 操作区 -->
    <div class="flex items-center justify-between p-5">
      <div class="treeselect">
        <treeselect
          :options="organizationOption"
          :load-options="loadOptions"
          :clearable="false"
          :placeholder="$t('organizationManage.chooseArea')"
          v-model="organizationId"
        />
      </div>
      <div>
        <el-button v-show="isEnable" type="primary" @click="toPatrol">
          {{ $t('operateManage.patrol') }}
        </el-button>
      </div>
    </div>
    <div class="box-container">
      <div class="flex-1 mr-3">
        <left-part1 class="part-item" :organizationId="organizationId"></left-part1>
        <left-part2 class="part-item" :organizationId="organizationId"></left-part2>
        <left-part3 class="part-item" :organizationId="organizationId"></left-part3>
      </div>
      <div class="right-part">
        <right-part1 class="part-item"></right-part1>
        <right-part2 class="part-item"></right-part2>
        <right-part3 class="part-item"></right-part3>
        <right-part4></right-part4>
      </div>
    </div>
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import leftPart1 from './components/left-part1.vue'
import leftPart2 from './components/left-part2.vue'
import leftPart3 from './components/left-part3.vue'
import rightPart1 from './components/right-part1.vue'
import rightPart2 from './components/right-part2.vue'
import rightPart3 from './components/right-part3.vue'
import rightPart4 from './components/right-part4.vue'
export default {
  name: 'OperationAndMaintenanceOverview',
  components: {
    Treeselect,
    leftPart1,
    leftPart2,
    leftPart3,
    rightPart1,
    rightPart2,
    rightPart3,
    rightPart4
  },
  data() {
    return {
      isRouterAlive: true,
      isEnable: true,
      organizationOption: null,
      organizationId: undefined
    }
  },
  mounted() {
    this.getpatrolEnable()
  },
  methods: {
    async getpatrolEnable() {
      let res = await this.$api.getpatrolEnable({})
      if (res.resultCode == 0) {
        this.isEnable = res.enable
      }
    },
    toPatrol() {
      this.$router.push('/devOps/patrol')
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api.getOrganizationTree({ parentId: parentNode?.id, type: 1 }).then(res => {
        if (res.resultCode === 0) {
          if (action === LOAD_ROOT_OPTIONS) {
            this.organizationOption = this.normalizeChildren(res.nodeList)
            this.organizationId = this.organizationOption[0].id
          } else {
            parentNode.children = this.normalizeChildren(res.nodeList)
          }
        }
        callback()
      })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) return {}
      return data.map(item => {
        let obj = {
          id: item.payload.organizationId,
          label: item.label,
          children: null
        }
        if (item.leaf === true) {
          delete obj.children
        }
        return obj
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-container {
  height: 1292.5px;
  @apply flex mt-3;
}
.right-part {
  width: 500px;
  overflow: hidden;
}
.vue-treeselect {
  display: inline-block;
  width: 202px;
}
.part-item {
  @apply mb-3;
}
</style>
