<template>
  <div id="templateDetailDialog">
    <el-dialog
      :title="$t('algoTemplate.templateDetails')"
      v-model="$parent.dialogFormVisible_detail"
      top="30vh"
      width="600px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      draggable
    >
      <el-form
        :model="form"
        :inline="true"
        :label-width="locale == 'en' ? '265px' : '100px'"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <el-row style="padding: 10px">
          <el-col :span="24">
            <el-form-item :label="$t('algoTemplate.templateName2') + ':'">
              <span>{{ form.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('public.createTime') + ':'">
              <span>{{ form.createTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('algoTemplate.algorithmProperties') + ':'">
              <span v-if="form.type == 0">{{ $t('algoTemplate.areaIdentification') }}</span>
              <span v-if="form.type == 1">{{ $t('algoTemplate.lineMarking') }}</span>
              <span v-if="form.type == 2">{{ $t('algoTemplate.fullScreen') }}</span>
              <div class="content_font" v-if="form.type == 0 && form.roi && form.roi.status == 1">
                #{{ $t('algoTemplate.identificationArea1') }}&nbsp;&nbsp;{{
                  $t('algoTemplate.allowableQuantity')
                }}：{{ form.roi.num }}&nbsp;&nbsp;{{
                  form.roi.type == 0 ? $t('algoTemplate.rectangle1') : $t('algoTemplate.polygon1')
                }}
              </div>
              <div class="content_font" v-if="form.type == 0 && form.nRoi && form.nRoi.status == 1">
                #{{ $t('algoTemplate.exclusionArea1') }}&nbsp;&nbsp;{{
                  $t('algoTemplate.allowableQuantity')
                }}：{{ form.nRoi.num }}&nbsp;&nbsp;{{
                  form.nRoi.type == 0 ? $t('algoTemplate.rectangle1') : $t('algoTemplate.polygon1')
                }}
              </div>
              <div class="content_font" v-if="form.type != 2 && form.maxTarget.status == 1">
                #{{ $t('algoTemplate.maximumTarget') }}&nbsp;&nbsp;{{
                  form.maxTarget.type == 0
                    ? $t('algoTemplate.rectangle')
                    : $t('algoTemplate.polygon')
                }}
              </div>
              <div class="content_font" v-if="form.type != 2 && form.minTarget.status == 1">
                #{{ $t('algoTemplate.minimumTarget') }}&nbsp;&nbsp;{{
                  form.minTarget.type == 0
                    ? $t('algoTemplate.rectangle')
                    : $t('algoTemplate.polygon')
                }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$parent.dialogFormVisible_detail = false">
            {{ $t('public.cancel') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'templateDetail',
  components: {},

  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        name: '',
        type: 0,
        roi: {
          type: 0,
          status: 1,
          num: 1
        },
        nRoi: {
          type: 0,
          status: 0,
          num: 1
        },
        line: {
          type: 1,
          status: 0
        },
        maxTarget: {
          type: 0,
          status: 0
        },
        minTarget: {
          type: 0,
          status: 0
        }
      }
    }
  },
  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.gatewayGroup))
    }
  },
  methods: {
    async dialogOpen() {
      this.$nextTick(() => {
        this.form = this.$parent.detailData
      })
    }
  }
}
</script>

<style lang="scss">
#templateDetailDialog {
  .el-dialog__body {
    padding: 0 20px;
    font-size: 14px;
    font-weight: 400;
    color: #2e2e2e;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }
    .content_font {
      font-size: 14px;
      font-weight: 400;
      color: #3696e5;
    }
    .el-form-item__content {
      max-width: 430px;
    }
  }
}
</style>
