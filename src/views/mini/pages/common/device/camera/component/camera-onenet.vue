<template>
  <!-- 镜头onenet配置 -->
  <el-dialog
    :title="$t('deviceCamera.onenet')"
    v-model="$parent.cameraOnenet"
    class="onenetDialog"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="86px" label-position="left">
      <el-form-item :label="$t('deviceCamera.cameraName') + '：'" prop="cameraName">
        <el-input v-model="form.cameraName" auto-complete="off" disabled />
      </el-form-item>

      <el-form-item :label="$t('deviceCamera.product') + '：'" auto-complete="off" prop="masterKey">
        <el-select
          :popper-append-to-body="false"
          v-model="form.masterKey"
          :placeholder="$t('deviceCamera.pleaseInputproduct')"
          @change="masterKeyChange"
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :label="item.productName"
            :value="item.masterKey"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('primaryDevice.Device') + '：'"
        prop="onenetDevId"
        v-show="form.masterKey"
      >
        <el-select
          :popper-append-to-body="false"
          v-model="form.onenetDevId"
          :placeholder="$t('primaryDevice.DevicePrompt')"
        >
          <el-option
            v-for="(item, index) in deviceList"
            :key="index"
            :label="item.deviceName"
            :value="item.oneNetDevId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="addOnenetSubmit" :loading="$parent.maskloading">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        cameraName: '',
        masterKey: '',
        onenetDevId: ''
      },
      rules: {},
      productList: [],
      deviceList: []
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    async dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.form = this.$parent.onenetForm
      })
      await this.get_OnenetProductList()
      if (this.form.masterKey) {
        await this.get_OnenetDeviceList()
      }
    },
    dialogClosed() {
      this.$parent.cameraOnenet = false
      this.$parent.maskloading = false
      this.$parent.onenetForm = {}
    },
    get_OnenetProductList() {
      this.$api.getOnenetProductList({}).then(res => {
        if (res.onenetProductList) {
          this.productList = res.onenetProductList
        }
      })
    },
    masterKeyChange(val) {
      if (val != '') {
        this.deviceList = []
        this.form.onenetDevId = ''
        this.get_OnenetDeviceList()
      }
    },
    get_OnenetDeviceList() {
      this.$api
        .getOnenetDeviceList({
          masterKey: this.form.masterKey
        })
        .then(res => {
          if (res.deviceList) {
            this.deviceList = res.deviceList
          }
        })
    },
    addOnenetSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let data = {
            cameraId: this.form.cameraId,
            masterKey: this.form.masterKey,
            onenetDevId: this.form.onenetDevId
          }
          this.$api.addOnetConfig(data).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('deviceCamera.deviveOnenetSuccess')
              })
              this.dialogClosed()
              this.$parent.search_clear()
              this.$parent.handleFind()
            }
            this.$parent.maskloading = false
          })
        }
      })
    },
    setFormRules() {
      this.rules = {
        cameraName: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        masterKey: [
          {
            required: true,
            message: this.$t('deviceCamera.pleaseInputproduct'),
            trigger: 'blur'
          }
        ],
        onenetDevId: [
          {
            required: true,
            message: this.$t('primaryDevice.DevicePrompt'),
            trigger: 'blur'
          }
        ]
      }
    }
  }
}
</script>
