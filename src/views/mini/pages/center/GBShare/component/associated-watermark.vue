<template>
  <!-- 关联水印 -->
  <el-dialog
    :title="$t('GBShare.associatedWatermark')"
    v-model="$parent.batchAssociatedVisible"
    top="20vh"
    :width="'600px'"
    id="associatedWatermark"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    :validate-on-rule-change="false"
    :label-width="locale == 'en' ? '147px' : '86px'"
    label-position="right"
  >
    <el-form-item
      :label="$t('GBShare.watermarkName') + '：'"
      auto-complete="off"
      prop="watermarkName"
    >
      <el-select
        v-model="form.watermarkName"
        :placeholder="$t('GBShare.pleaseSelectWatermarkName')"
        class="select-lazy-loading"
        value-key="watermarkId"
        clearable
      >
        <div class="select-input-wrapper">
          <el-input
            v-model="selectContent"
            :placeholder="$t('GBShare.pleaseInput')"
            @input="searchWatermarkName"
            clearable
            @clear="clearSelect"
          ></el-input>
        </div>
        <el-option
          v-for="(item, index) in watermarkNameList"
          :key="index"
          :label="item.content"
          :value="item.watermarkId"
        />
        <el-option v-if="loading || !hasMore" ref="el" class="el-select-loading" value="">
          <template v-if="loading">
            <i class="el-icon-loading"></i>
            <span class="el-select-loading__tips">{{ loadingText || this.$t('public.loading') }}</span>
          </template>
          <template v-else-if="!hasMore">{{ noMoreText || this.$t('alarmList.moMoreNums') }}</template>
        </el-option>
        <div class="select-input-btn" v-else @click="loadMoreData">{{ this.$t('alarmList.loadMore') }}</div>
      </el-select>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="submitForm">
        {{ $t('public.confirm') }}
      </el-button>
    </span>
  </template>
</el-dialog>
</template>

<script>
export default {
  props: {
    // 弹框打开关闭
    visible: {
      type: Boolean,
      default: false
    },
    // 当前选择设备
    watermarkDataForm: {
      type: Array,
      default: () => []
    },
    correlationOperate: {
      type: Number
    }
  },
  data() {
    return {
      form: {
        watermarkName: ''
      },
      locale: localStorage.getItem('locale'),
      submitLoading: false,
      pageNum: 1,
      pageSize: 10,
      searchParam: {
        systemType: 3, //系统类型
        tenantName: '', //客户名称
        status: '', //水印状态
        content: '' //水印名称
      },
      loading: false,
      watermarkNameList: [],
      allowSearchFlag: false,
      selectContent: '',
      hasMore: true,
      loadingText: '',
      noMoreText: '',
      choosedWatermarkNameList: [],
      currentForm: {
        watermarkName: '',
        watermarkId: ''
      },
      watermarkNameRequired: false
    }
  },
  computed: {
    rules() {
      return {
        watermarkName: [
          {
            required: this.watermarkNameRequired,
            message: this.$t('GBShare.pleaseSelectWatermarkName'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    },
    pageNum: {
      // 当前页数改变时, 重新触发查询
      handler(val) {
        if (val) {
          // this.queryParam.xPage = val
          this.getWatermarkList(true)
        }
      }
    }
  },
  methods: {
    dialogOpen() {
      this.$nextTick(async () => {
        
        // 批量关联的时候水印必填
        if (this.correlationOperate === 1) {
          this.watermarkNameRequired = true
        } else {
          this.watermarkNameRequired = false
        }
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
        this.choosedWatermarkNameList = []
        this.watermarkDataForm.forEach(item => {
          this.choosedWatermarkNameList.push({
            watermarkId: item.watermarkId,
            watermarkName: item.watermarkContent
          })
        })
        const isWatermarkIdSame = this.choosedWatermarkNameList.every((item, index, array) => {
          return item.watermarkId === array[0].watermarkId
        })

        if (isWatermarkIdSame && this.choosedWatermarkNameList.length) {
          // 数组对象choosedWatermarkNameList中的watermarkId值都相同
          this.currentForm = {
            watermarkName: this.choosedWatermarkNameList[0].watermarkName || '',
            watermarkId: this.choosedWatermarkNameList[0].watermarkId || ''
          }
        } else {
          // 数组对象choosedWatermarkNameList中的watermarkId值不完全相同
          this.currentForm = {
            watermarkName: '',
            watermarkId: ''
          }
        }
        this.form = {
          watermarkName: this.currentForm.watermarkId
        }
        await this.getWatermarkList()
      })
    },
    dialogClosed() {
      this.$parent.batchAssociatedVisible = false
      this.submitLoading = false
      this.form = {}
      this.choosedWatermarkNameList = []
      this.selectContent = ''
    },
    loadMoreData() {
      // 数据到底部继续滑动,会自动触发页数+1
      if (this.hasMore) {
        this.pageNum += 1
      }
    },
    async getWatermarkList(appendFlag) {
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchParam: {
          systemType: this.searchParam.systemType,
          tenantName: this.searchParam.tenantName,
          status: this.searchParam.status,
          content: this.searchParam.content
        }
      }
      this.loading = true
      await this.$api.getWatermarkInfoListByPage(data).then(res => {
        if (res.watermarkInfoList && res.watermarkInfoList.length) {
          if (appendFlag) {
            this.watermarkNameList = this.watermarkNameList.concat(res.watermarkInfoList)
          } else {
            this.watermarkNameList = res.watermarkInfoList
            if (this.currentForm.watermarkId) {
              if (this.searchParam.content == '') {
                this.watermarkNameList.unshift({
                  content: this.currentForm.watermarkName,
                  watermarkId: this.currentForm.watermarkId
                })
              } else {
                let keySome = this.watermarkNameList.some(item => {
                  if (item.watermarkId == this.currentForm.watermarkId) {
                    return true
                  }
                })
                if (keySome) {
                  this.watermarkNameList.unshift({
                    content: this.currentForm.watermarkName,
                    watermarkId: this.currentForm.watermarkId
                  })
                }
              }
            }
          }
          this.watermarkNameList = this.watermarkNameList.filter(
            (obj, index) =>
              this.watermarkNameList.findIndex(item => item.watermarkId === obj.watermarkId) ===
              index
          )
          this.hasMore = this.watermarkNameList.length < res.pageInfo.totalNum
        } else {
          this.hasMore = false
        }
        this.loading = false
      })
    },
    async searchWatermarkName(val) {
      if (val) {
        this.searchParam.content = val
        this.watermarkNameList = []
        this.pageNum = 1
        await this.getWatermarkList()
      } else {
        await this.clearSelect()
      }
    },
    async clearSelect() {
      // 清空下拉框选中的值,会向后端重新查询第一页的数据
      this.searchParam.content = ''
      this.pageNum = 1
      this.watermarkNameList = []
      await this.getWatermarkList()
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.submitLoading = true
          let cameraIds = []
          let platId = ''
          this.watermarkDataForm.forEach(item => {
            cameraIds.push(item.cameraId)
            platId = item.platID
          })
          if (this.form.watermarkName) {
            let data = {
              watermarkId: this.form.watermarkName,
              cameraIds: cameraIds,
              platId: platId
            }
            this.$api.linkWatermarkCamera(data).then(res => {
              this.submitLoading = false
              if (res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('GBShare.correlationSuccess')
                })
                this.$parent.batchAssociatedVisible = false
                this.$parent.$refs.multipleTable.clearSelection()
                this.$parent.delShow = true
                this.$parent.getList()
              }
            })
          } else {
            let data = {
              cameraIds: cameraIds,
              platId: platId
            }
            this.$api.unlinkWatermarkCamera(data).then(res => {
              this.submitLoading = false
              if (res.resultCode == 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('GBShare.cancelCorrelationSuccess')
                })
                this.$parent.batchAssociatedVisible = false
                this.$parent.$refs.multipleTable.clearSelection()
                this.$parent.delShow = true
                this.$parent.getList()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
#associatedWatermark {
  .el-dialog__body {
    padding: 15px 70px 5px !important;
  }
}
</style>
<style lang="scss" scoped>
.el-select-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: initial;
  pointer-events: none;
  color: var(--el-color-info);
  font-size: 14px;

  &__icon {
    font-size: 16px;
    animation: rotate 1.5s linear infinite;
  }

  &__tips {
    margin-left: 6px;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.select-input-btn {
  font-size: var(--el-font-size-base);
  padding: 0 32px 0 20px;
  box-sizing: border-box;
  height: 34px;
  line-height: 34px;
  color: violet;
  cursor: pointer;
  text-align: center;
}
</style>
