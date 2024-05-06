<template>
  <div style="padding: 30px" v-if="isRouterAlive" ref="deviceInformation">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-position="left"
      v-loading="allLoading"
      :element-loading-text="$t('public.loading')"
      
    >
      <ul>
        <li>
          <el-form-item :label="$t('imageInformation.selectPlatform') + '：'">
            <el-select
              @change="platformListChange"
              v-model="form.platId"
              :placeholder="$t('imageInformation.pleaseplatform')"
            >
              <el-option
                v-for="item in platformList"
                :key="item.accessId"
                :label="item.accessName"
                :value="item.accessId"
              ></el-option>
            </el-select>
          </el-form-item>
        </li>
      </ul>

      <ul class="headtop">
        <li class="container">
          <div>
            <el-form-item
              :label="$t('imageInformation.retentionDatabase')"
              prop="faceDbDataValidity"
            >
              <span class="content-styles">
                {{ $t('imageInformation.theValue') }}
              </span>
              <el-input
                style="margin-top: 10px"
                v-model="form.faceDbDataValidity"
                :placeholder="$t('imageInformation.pleaseRetentionDatabase')"
              ></el-input>
            </el-form-item>
          </div>
        </li>
        <li class="container-left">
          <el-form-item
            :label="$t('imageInformation.retentionPeriogDatabase')"
            prop="lprDbDataValidity"
          >
            <span class="content-styles">{{ $t('imageInformation.theValue') }}</span>
            <el-input
              style="margin-top: 10px"
              v-model="form.lprDbDataValidity"
              :placeholder="$t('imageInformation.pleaseRetentionPeriogDatabase')"
            ></el-input>
          </el-form-item>
        </li>
      </ul>

      <ul class="headtop-top">
        <li class="container">
          <el-form-item
            :label="$t('imageInformation.retentionPeriodDocuments')"
            prop="faceFileDataValidity"
          >
            <span class="content-styles">{{ $t('imageInformation.theValue') }}</span>
            <el-input
              style="margin-top: 10px"
              v-model="form.faceFileDataValidity"
              :placeholder="$t('imageInformation.pleaseRetentionPeriodDocuments')"
            ></el-input>
          </el-form-item>
        </li>
        <li class="container-left">
          <el-form-item
            :label="$t('imageInformation.retentionDocuments')"
            prop="lprFileDataValidity"
          >
            <span class="content-styles">{{ $t('imageInformation.theValue') }}</span>
            <el-input
              style="margin-top: 10px"
              v-model="form.lprFileDataValidity"
              :placeholder="$t('imageInformation.pleaseRetentionDocuments')"
            ></el-input>
          </el-form-item>
        </li>
      </ul>

      <ul class="headtop-top">
        <li class="container">
          <el-form-item :label="$t('imageInformation.retentionData')" prop="lprFeatureDataValidity">
            <span class="content-styles">{{ $t('imageInformation.theValue') }}</span>
            <el-input
              style="margin-top: 10px"
              v-model="form.lprFeatureDataValidity"
              :placeholder="$t('imageInformation.pleaseRetentionData')"
            ></el-input>
          </el-form-item>
        </li>

        <li class="container-left">
          <el-form-item
            :label="$t('imageInformation.retentionFeature')"
            prop="faceFeatureDataValidity"
          >
            <span class="content-styles">{{ $t('imageInformation.theValue') }}</span>
            <el-input
              style="margin-top: 10px"
              v-model="form.faceFeatureDataValidity"
              :placeholder="$t('imageInformation.pleaseRetentionFeature')"
            ></el-input>
          </el-form-item>
        </li>
      </ul>

      <div style="margin-top: 61px; margin-left: 660px">
        <el-button @click="resetClick">{{ $t('public.reset') }}</el-button>
        <el-button
          @click="saveClick"
          :loading="loadingReset"
          style="margin-left: 100px"
          type="primary"
        >
          {{ $t('public.save') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ImageInformationBase',
  data() {
    var regMaxSessionNum = /^([12]\d\d|[1-9]\d?|3[0-5]\d|(36[0-5]|-1))$/
    var validateMaxSessionNum = (rule, value, callback) => {
      if (value == '') {
        callback(new Error(this.$t('imageInformation.pleaseEnterValue')))
      } else if (!regMaxSessionNum.test(value)) {
        callback(new Error(this.$t('imageInformation.pleaseContent')))
      } else {
        callback()
      }
    }
    return {
      isRouterAlive: true,
      totalNum: 10,
      platformList: [],
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      disabled: false,

      allLoading: false,
      loadingReset: false,
      form: {
        platId: '',
        faceDbDataValidity: '',
        lprDbDataValidity: '',
        faceFeatureDataValidity: '',
        lprFeatureDataValidity: '',
        faceFileDataValidity: '',
        lprFileDataValidity: '',
        baAlarmDbDataValidity: '',
        baAlarmFileDataValidity: ''
      },
      rules: {
        faceDbDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        lprDbDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        faceFeatureDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        lprFeatureDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        faceFileDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        lprFileDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        baAlarmDbDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ],
        baAlarmFileDataValidity: [
          {
            required: true,
            validator: validateMaxSessionNum,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.selectAdapterGateways()
  },
  methods: {
    selectAdapterGateways(val) {
      this.$api
        .getAlgorithmAccessList({
          pageInfo: {
            pageNum: 1,
            pageSize: 10
          },
          searchInfo: {
            accessPlatType: '',
            gatewayName: '',
            gatewayStatus: null
          }
        })
        .then(res => {
          if (res && res.resultCode == 0) {
            if (res.algorithmAccessList.length > 0) {
              res.algorithmAccessList.forEach(item => {
                if (item.platformType == 16) {
                  this.platformList.push(item)
                }
              })
            }
            if (res.pageInfo.totalNum > this.totalNum) {
              this.queryParams.pageInfo.pageNum++
              this.totalNum += 10
              this.selectAdapterGateways(val)
            }
          }
        })
    },

    //重置
    resetClick() {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
      this.form = {
        platId: '',
        faceDbDataValidity: '',
        lprDbDataValidity: '',
        faceFeatureDataValidity: '',
        lprFeatureDataValidity: '',
        faceFileDataValidity: '',
        lprFileDataValidity: '',
        baAlarmDbDataValidity: '',
        baAlarmFileDataValidity: ''
      }
    },
    //保存
    saveClick() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.platId == '') {
            this.$message({
              showClose: true,
              message: this.$t('imageInformation.pleaseplatform'),
              type: 'warning'
            })
            return
          }
          this.loadingReset = true
          let data = {
            platId: this.form.platId,
            faceDbDataValidity: this.form.faceDbDataValidity,
            lprDbDataValidity: this.form.lprDbDataValidity,
            faceFeatureDataValidity: this.form.faceFeatureDataValidity,
            lprFeatureDataValidity: this.form.lprFeatureDataValidity,
            faceFileDataValidity: this.form.faceFileDataValidity,
            lprFileDataValidity: this.form.lprFileDataValidity,
            baAlarmDbDataValidity: this.form.baAlarmDbDataValidity,
            baAlarmFileDataValidity: this.form.baAlarmFileDataValidity
          }
          this.$api.getConfigSet(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                showClose: true,
                message: this.$t('imageInformation.savingSucceeded'),
                type: 'success'
              })
              this.loadingReset = false
              this.getConfig(this.form.platId)
            }
          })
        }
      })
    },

    platformListChange(val) {
      this.getConfig(val)
    },
    getConfig(val) {
      this.allLoading = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
      let data = {
        platId: val
      }

      this.$api.getConfig(data).then(res => {
        if (res.resultCode == 0) {
          this.form = {
            platId: val,
            faceDbDataValidity: res.faceDbDataValidity,
            lprDbDataValidity: res.lprDbDataValidity,
            faceFeatureDataValidity: res.faceFeatureDataValidity,
            lprFeatureDataValidity: res.lprFeatureDataValidity,
            faceFileDataValidity: res.faceFileDataValidity,
            lprFileDataValidity: res.lprFileDataValidity,
            baAlarmDbDataValidity: res.baAlarmDbDataValidity,
            baAlarmFileDataValidity: res.baAlarmFileDataValidity
          }
        }
        this.allLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headtop {
  display: flex;
}
.headtop-top {
  display: flex;
  margin-top: 61px;
}
.container {
  max-width: 490px;
}
.container-min {
  min-width: 490px;
}
.container-left {
  margin-left: 200px;
  max-width: 490px;
}
.container-left-min {
  margin-left: 100px;
  min-width: 490px;
}
.content-styles {
  font-size: 12px;
  font-family: Microsoft YaHei;
  color: #17a1ff;
  margin-left: 20px;
}
</style>
