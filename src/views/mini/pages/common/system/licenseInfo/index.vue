<template>
  <div id="licenseInfo" ref="licenseInfo">
    <el-button v-if="PermissionLicenseManage" type="primary" @click="importAgain">
      {{ $t('license.reimport') }}
    </el-button>

    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '320px' : '166px'"
      label-position="left"
      class="licenseInfoForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('license.name') + '：'">
            <el-input v-model="form.name" clearable readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="Service ID：">
            <el-input v-model="form.serviceId" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('license.expiryDate') + '：'">
            <el-date-picker
              v-model="dateVal"
              type="daterange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              value-format="YYYY-MM-DD"
              readonly
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="tableDataLoading"
      v-show="tableData.length"
      :data="tableData"
      border
      style="width: 100%"
      class="mt-10"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="code" :label="$t('license.code')" :formatter="codeFormat" />
      <el-table-column
        prop="description"
        :label="$t('license.description')"
        :formatter="descriptionFormat"
      />
      <el-table-column prop="total" :label="$t('license.total')"></el-table-column>
      <el-table-column prop="used">
        <template #header>
          {{ $t('license.used') }}
          <el-tooltip effect="dark" :content="$t('license.usedTips')" placement="bottom">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="$t('license.remaining')">
        <template #default="scope">
          {{ this.remainingNum(scope.row.total, scope.row.used) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- //license -->
    <license :license-data="form" :isAppendBody="false" @getLicense="initLicense"></license>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import license from '@/components/license'
import { permissions } from '@/utils/common/permissions'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    license,
    QuestionFilled
  },
  name: 'LicenseInfo',
  data() {
    return {
      dateVal: [],
      form: {},
      tableDataLoading: false,
      dialogVisible_license: false,
      PermissionLicenseManage: false
    }
  },
  computed: {
    ...mapState({
      codeList: state => state.dict['license-code'], // 控制项
      describeList: state => state.dict['license-describe']
    }),
    tableData() {
      return this.form?.licenseCapacity ? this.form?.licenseCapacity : []
    }
  },
  async created() {
    await this.getPermissions()
    this.getSysDictData(['license-code', 'license-describe'])
    this.initLicense()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    //用户权限判断
    async getPermissions() {
      this.PermissionLicenseManage = await permissions(359)
    },
    remainingNum(total, used) {
      const num = total - used
      if (num < 0) {
        return 0
      } else {
        return num
      }
    },
    initLicense() {
      this.tableDataLoading = true
      this.$api
        .getLicenseInfo({})
        .then(res => {
          if (res.resultCode == 0) {
            this.form = res
            this.form.name = this.form.serviceId + '.license'
            this.dateVal =
              this.form.generateTime && this.form.expireTime
                ? [this.form.generateTime, this.form.expireTime]
                : []
          }
        })
        .finally(() => {
          this.tableDataLoading = false
        })
    },
    importAgain() {
      this.$confirm(this.$t('license.ifImport'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.dialogVisible_license = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('license.importCancel')
          })
        })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    codeFormat(row) {
      return this.selectDictLabel(this.codeList, row.code, {
        key: 'name',
        value: 'value'
      })
    },
    descriptionFormat(row) {
      return this.selectDictLabel(this.describeList, row.code, {
        key: 'name',
        value: 'value'
      })
    }
  }
}
</script>

<style lang="scss">
#licenseInfo {
  padding: 20px;
  .dialog-footer {
    text-align: center;
  }
  .licenseInfoForm {
    padding: 50px 30% 0px;
  }
  .el-date-editor {
    width: 100% !important;
  }
}
</style>
