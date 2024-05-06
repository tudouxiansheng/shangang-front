<template>
  <div class="share-management" ref="shareManagement" v-if="isRouterAlive">
    <div class="share-management-device">
      <div>
        <el-button type="primary" class="btn" @click="handleShareDevice">
          {{ txt.deviceShare }}
        </el-button>
      </div>
      <lazy-search-tree
        :planeType="1"
        id="shareDevTree"
        ref="shareDevTree"
        @initList="initList"
        @nodeClick="obj => nodeClick(obj, '01')"
        @nodeCheck="obj => nodeCheck(obj, '01')"
      />
    </div>
    <div class="share-management-person">
      <div>
        <el-button type="danger" class="btn" @click="handleCancelShare">
          {{ txt.cancelShare }}
        </el-button>
        <el-button
          type="primary"
          class="btn"
          :disabled="currentId.length > 10"
          @click="handleshareAuth"
        >
          {{ txt.setShareAuth }}
        </el-button>
      </div>
      <search-tree
        :planeType="2"
        id="shareUserTree"
        ref="shareUserTree"
        treeApi="getUserTree"
        :currentId="currentId"
        :showCheckbox="true"
      />
    </div>

    <device-share v-model:visible="shareDeviceDialogVisible" @optioncb="optioncb" />
    <cancel-share
      v-model:visible="cancelShareDialogVisible"
      :currentId="currentId"
      :checkedNodes="checkedNodes"
      @optioncb="optioncb"
    />
    <share-permission
      :node="currentDeviceNode"
      @optioncb="optioncb"
      :isShow="false"
    ></share-permission>
  </div>
</template>
<script>
import shareManagementMixin from './mixin/shareManagementMixin'
import constantsMixin from './mixin/constantsMixin'
export default {
  name: 'shareManagement',
  mixins: [shareManagementMixin, constantsMixin],
  data() {
    return {
      isRouterAlive: true
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
@import './shareManagement.scss';
</style>
