<template>
  <!-- 快捷生成国标目录 -->
  <div id="quickly-generate">
    <el-form
      ref="quicklyForm"
      :model="quicklyForm"
      :rules="rules2"
      :label-width="locale == 'en' ? '260px' : '115px'"
      label-position="left"
    >
      <el-form-item :label="$t('newOrg.directoryTopLevel') + '：'" prop="areaCode">
        <div v-show="!areaCodeNoMatch">
          <el-cascader
            ref="areaCascader"
            v-model="quicklyForm.areaCode"
            :options="areaCodeOptions"
            :props="areaCodeProps"
            clearable
            popper-class="cascader-class"
            :placeholder="$t('organizationManage.PleaseChooseOrganizationCode')"
            @change="areaChange"
          />
        </div>

        <el-input
          v-show="areaCodeNoMatch"
          v-model="quicklyForm.areaCode"
          :placeholder="$t('organizationManage.PleaseChooseOrganizationCode')"
          readonly
        />
        <div v-show="areaCodeNoMatch" style="color: #f56c6c; font-size: 12px">
          {{ $t('organizationManage.PleaseImportOrganizationCode') }}
        </div>
      </el-form-item>

      <el-form-item :label="$t('newOrg.levelConfiguration') + '：'" prop="targetAreaLevel">
        <el-checkbox-group v-model="quicklyForm.targetAreaLevel">
          <el-checkbox-button
            v-for="(city, index) in cities"
            :key="index"
            :label="city.level"
            :disabled="city.level <= disabledLevel - 1"
          >
            {{ city.name }}
          </el-checkbox-button>
        </el-checkbox-group>

        <div v-show="quicklyForm.targetAreaLevel.length != 0" class="info">
          <el-icon style="color: #2c6dd2"><el-icon-info /></el-icon>
          <span>{{ $t('newOrg.levelChoose') }}：</span>
          <span style="color: #fc9f19">{{ chooseLevel }}&nbsp;{{ $t('newOrg.level') }}</span>
          <span>，{{ $t('newOrg.levelConent') }}：</span>
          <span style="color: #fc9f19" v-html="$xss(levelStr)"></span>
        </div>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button @click="cancelForm">
        {{ $t('public.cancel') }}
      </el-button>
      <el-button type="primary" @click="resetForm">
        {{ $t('public.reset') }}
      </el-button>
      <el-button type="primary" :loading="maskloading" @click="confirmForm">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { InfoFilled as ElIconInfo } from '@element-plus/icons-vue'
import api from '@/api'
export default {
  components: {
    ElIconInfo
  },
  props: ['parentId'],
  data() {
    let _this = this
    return {
      locale: localStorage.getItem('locale'),
      areaCodeOptions: [], //组织区号级联列表
      areaCodeProps: {
        checkStrictly: true,
        emitPath: false,
        value: 'areaCode',
        label: 'areaName',
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          let parentCode = level == 0 ? '' : node.value
          api.querySubArea({ parentCode, includeParent: false }).then(res => {
            if (res) {
              const nodes = res.subAreaList
                ? res.subAreaList.map(item => ({
                    ...item,
                    leaf: item.areaLevel > 3
                  }))
                : []
              if (_this.firstRequest) {
                if (nodes.length === 0) {
                  _this.areaCodeNoMatch = true
                }
                _this.firstRequest = false
              }
              resolve(nodes)
            }
          })
        }
      },
      areaCodeNoMatch: false,
      firstRequest: true,
      cities: [
        { name: this.$t('newOrg.provincial'), level: 1 },
        { name: this.$t('newOrg.cityLevel'), level: 2 },
        { name: this.$t('newOrg.countyLevel'), level: 3 },
        { name: this.$t('newOrg.townshipLevel'), level: 4 }
      ],
      cities1: [
        this.$t('newOrg.provincial'),
        this.$t('newOrg.cityLevel'),
        this.$t('newOrg.countyLevel'),
        this.$t('newOrg.townshipLevel')
      ],
      cities2: [1, 2, 3, 4],
      chooseLevel: 0,
      disabledLevel: 0, // 禁选级别
      levelStr: '',
      quicklyForm: {
        targetAreaLevel: [], //当前选择级别
        areaCode: ''
      },
      rules2: {},
      maskloading: false
    }
  },
  created() {
    this.setFormRule()
  },
  methods: {
    setFormRule() {
      let validateLevel = (rule, value, callback) => {
        if (this.quicklyForm.areaCode == '') {
          callback(this.$t('newOrg.levelPrompt1'))
        } else {
          if (value.findIndex(val => val == this.disabledLevel) == -1) {
            callback(this.cities1[this.disabledLevel - 1] + this.$t('newOrg.levelPrompt2'))
          } else {
            if (!this.isContinuationInteger(value)) {
              callback(this.$t('newOrg.levelPrompt3'))
            } else {
              this.areaLevelChange(value)
              callback()
            }
          }
        }
      }
      this.rules2 = {
        areaCode: [
          {
            required: true,
            message: this.$t('organizationManage.PleaseChooseOrganizationCode'),
            trigger: 'change'
          }
        ],
        targetAreaLevel: [
          {
            required: true,
            validator: validateLevel,
            trigger: 'change'
          }
        ]
      }
    },
    isContinuationInteger(arr) {
      let a = JSON.parse(JSON.stringify(arr))
      a.sort()
      let b = []
      for (let i = a[0]; i <= a[a.length - 1]; i++) {
        b.push(i)
      }

      if (a.toString() === b.toString()) {
        return true
      } else {
        return false
      }
    },
    areaChange() {
      let areaLevel = this.$refs['areaCascader'].getCheckedNodes()[0].data.areaLevel
      this.quicklyForm.targetAreaLevel = this.cities2.slice(areaLevel - 1)
      this.disabledLevel = areaLevel
      this.chooseLevel = 4
      this.levelStr = this.cities1.slice(areaLevel - 1).join('>')
    },
    areaLevelChange(val) {
      let arr = JSON.parse(JSON.stringify(val))
      arr.sort()
      this.chooseLevel = arr[arr.length - 1]
      const newData = this.cities.filter(l2 => arr.findIndex(l1 => l2.level === l1) !== -1)
      this.levelStr = newData
        .map(obj => {
          return obj.name
        })
        .join('>')
    },
    cancelForm() {
      this.$emit('cancelForm')
    },
    // 重置表单
    resetForm() {
      if (this.$refs.quicklyForm) {
        this.$nextTick(() => {
          this.$refs.quicklyForm.resetFields()
        })
      }
      this.quicklyForm = {
        targetAreaLevel: [],
        areaCode: ''
      }
      this.levelStr = ''
      this.disabledLevel = 0
      this.chooseLevel = 0
    },
    confirmForm() {
      this.$refs['quicklyForm'].validate(async valid => {
        if (valid) {
          this.maskloading = true

          let data = {
            areaCode: this.quicklyForm.areaCode,
            targetAreaLevel: this.chooseLevel,
            replaceParent: false,
            parentId: this.parentId
          }
          const res = await this.$api.quickCreateArea(data)
          this.maskloading = false
          if (res.resultCode == 0) {
            this.$message.success(this.$t('newOrg.quickCreateSuccess'))
            this.$emit('redisplayTree')
            this.resetForm()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
#quickly-generate {
  .el-checkbox-button {
    margin-right: 20px;
  }

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    border: none;
  }

  .el-checkbox-button__inner {
    min-width: 100px;
    height: 36px;
    line-height: 36px;
    padding: 0 !important;
    border-radius: 4px !important;
    border: 1px solid #c1c7d0;
    box-shadow: none !important;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 400;
  }

  .info {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #7a869a;
  }
}
.cascader-class {
  .el-cascader-panel .el-scrollbar:first-child .el-radio {
    display: none;
  }
}
</style>
