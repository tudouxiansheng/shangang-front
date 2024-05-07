<template>
  <el-dialog
    :title="$t('accessPlatform.vpaasAccessPlatformDetail')"
    :visible.sync="$parent.dialogFormVisible_detail"
    top="10vh"
    :width="locale == 'en' ? '1400px' : '1000px'"
    id="vpaasAccessPlatformDetailDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :draggable="false"
  >
    <el-form
      :model="form"
      :inline="true"
      :label-width="locale == 'en' ? '320px' : '175px'"
      label-position="left"
    >
      <!-- 基本信息 -->
      <collapse-card :title="$t('accessPlatform.essentialInformation')" v-model:collapse="show1">
        <div class="grid-container">
          <el-form-item :label="$t('accessPlatform.organization') + '：'">
            <span>{{ form.organizationName }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.accessPlatformName') + '：'">
            <span>{{ form.platName }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.vpaasPlatform') + '：'">
            <span>{{ setVpaasPlatId(this.form.vpaasPlatId) }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.accessPlatformLevel') + '：'">
            <span>{{ $parent.setPlatType(this.form.platType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.domainList') + '：'">
            <span>{{ setDomainCode(form.domainCode) }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.accessScale') + '：'">
            <span>{{ form.accessScale }}</span>
          </el-form-item>
        </div>
      </collapse-card>
      <!-- 平台对接信息 -->
      <collapse-card :title="$t('accessPlatform.platAccessInfo')" v-model:collapse="show2">
        <div class="grid-container">
          <el-form-item :label="$t('accessPlatform.ownerCode') + '：'">
            <span>{{ form.ownerCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.accessCode') + '：'">
            <span>{{ form.accessCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.platformIp') + '：'">
            <span>{{ form.platIp }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.platformPort') + '：'">
            <span>{{ form.platPort }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.authenticationMode') + '：'">
            <span>{{ setAccessAuthType(form.accessAuthType) }}</span>
          </el-form-item>
        </div>
      </collapse-card>

      <!-- 平台配置 -->
      <collapse-card
        :title="$t('accessPlatform.platformConfigurationInfo')"
        v-model:collapse="show3"
      >
        <div class="grid-container">
          <el-form-item
            v-if="form.platType === 1"
            :label="$t('accessPlatform.keepaliveTime') + '：'"
          >
            <span>{{ form.keepaliveTime }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.platType === 2"
            :label="$t('accessPlatform.keepaliveTime') + '：'"
          >
            <span>{{ form.catalogInterval }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.platType === 2"
            :label="$t('accessPlatform.subscribeCycleForCatalog') + '：'"
          >
            <span>{{ form.subscribeCycleForCatalog }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.platType === 1"
            :label="$t('accessPlatform.registerValidity') + '：'"
          >
            <span>{{ form.registerValidity }}</span>
          </el-form-item>
          <el-form-item
            :label="
              form.platType === 1
                ? $t('accessPlatform.transProtocol1') + '：'
                : $t('accessPlatform.transProtocol') + '：'
            "
          >
            <span>{{ setTransProtocol(form.transProtocol) }}</span>
          </el-form-item>
          <el-form-item :label="$t('accessPlatform.characterSet') + '：'">
            <span>{{ setCharacterSet(form.characterSet) }}</span>
          </el-form-item>
          <el-form-item v-if="form.platType === 1" :label="$t('accessPlatform.catalogSize') + '：'">
            <span>{{ form.catalogSize }}</span>
          </el-form-item>
          <el-form-item v-if="form.platType === 1" :label="$t('accessPlatform.streamNet') + '：'">
            <span>{{ setStreamNet(form.streamNet) }}</span>
          </el-form-item>
          <el-form-item
            v-if="form.platType === 1"
            :label="$t('accessPlatform.platRecordFromCenter') + '：'"
          >
            <el-switch v-model="form.platRecordFromCenter" disabled></el-switch>
          </el-form-item>
          <el-form-item v-if="form.platType === 2" :label="$t('accessPlatform.networkName') + '：'">
            <span>{{ setStreamNet(form.networkName) }}</span>
          </el-form-item>
        </div>
      </collapse-card>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$parent.dialogFormVisible_detail = false">
          {{ $t('public.cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import CollapseCard from '@/components/collapse-card.vue'

export default {
  name: 'VpaasAccessPlatformDetail',
  components: {
    CollapseCard
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      show1: true,
      show2: true,
      show3: true,
      loading: false,
      form: {
        organizationId: undefined,
        organizationName: undefined,
        platName: undefined,
        vpaasPlatId: undefined,
        platType: undefined,
        domainCode: undefined,
        accessScale: undefined,
        ownerCode: undefined,
        accessCode: undefined,
        platIp: undefined,
        platPort: undefined,
        accessPassword: undefined,
        accessAuthType: undefined,
        keepaliveTime: undefined,
        registerValidity: undefined,
        transProtocol: undefined,
        characterSet: undefined,
        catalogSize: undefined,
        streamNet: undefined,
        platRecordFromCenter: undefined,
        networkName: undefined,
        subscribeCycleForCatalog: undefined
      },
      vpaasPlatIdList: [],
      domainList: [],
      accessAuthTypeList: []
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(async () => {
        
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
        await this.$parent.getVpaasPlatIdList(this.form.organizationId, '')
        await this.getDomainQueryList()
      })
    },
    setVpaasPlatId(val) {
       return this.$parent.vpaasPlatIdList.find((t) => t.platformId == val)?.platformName

    },
    async getDomainQueryList() {
      let vType = undefined
      if (this.form.platType === 1) {
        vType = 3
        this.accessAuthTypeList = [
          {
            name: 'MD5',
            value: 1
          },
          {
            name: 'SHA-1',
            value: 2
          },
          {
            name: 'SHA-256',
            value: 3
          }
        ]
      } else {
        vType = 2
        this.accessAuthTypeList = [
          {
            name: this.$t('accessPlatform.accessAuthType0'),
            value: 0
          },
          {
            name: 'MD5',
            value: 1
          },
          {
            name: 'SHA-1',
            value: 2
          }
        ]
      }
      const res = await this.$api.getDomainQueryList({
        vpaasType:vType,
        organizationId: this.form.organizationId,
        platId: this.form.vpaasPlatId,
        pageInfo: { pageNum: 1, pageSize: 5000 }
      })
      if (res.resultCode === 0 && res.domainList) {
        this.domainList = res.domainList
      } else {
        this.domainList = []
      }
    },
    setDomainCode(val) {
        return this.domainList.find((t) => t.domainCode == val)?.domainName
    },
    setAccessAuthType(val) {
      return this.accessAuthTypeList.find((t) => t.value == val)?.name
    },
    setTransProtocol(val) {
       return this.$parent.transProtocolList.find((t) => t.value == val)?.name
    
    },
    setCharacterSet(val) {
      return this.$parent.characterSetList.find((t) => t.value == val)?.name
    
    },
    setStreamNet(val) {
      return this.$parent.networkTypeList.find((t) => t.value == val)?.name
     
    }
  }
}
</script>

<style lang="scss">
#vpaasAccessPlatformDetailDialog {
  .el-dialog__body {
    padding: 20px;
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 20px;
      .access-scale {
        width: 70%;
      }
    }
  }
}
</style>
