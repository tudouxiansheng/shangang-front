<template>
  <div
    id="person-recognition"
    v-if="isRouterAlive"
    ref="personRecognition"
    
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <div class="search-form">
      <el-form :inline="true" ref="form" :model="searchForm" label-position="left">
        <div class="flexstart">
          <el-form-item
            :label="$t('iotPersonAccess.personId') + '：'"
            prop="personId"
            :class="screenFlag ? 'screenthree' : 'flex-item'"
          >
            <el-input
              v-model="searchForm.personId"
              auto-complete="off"
              :placeholder="$t('iotPersonAccess.personIdPrompt')"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('iotPersonAccess.authType') + '：'"
            prop="authType"
            :class="screenFlag ? 'screenthree' : 'flex-item'"
          >
            <el-select
              v-model="searchForm.authType"
              :placeholder="$t('iotPersonAccess.authTypePrompt')"
              clearable
            >
              <el-option
                v-for="item in authTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('iotPersonAccess.temperatureStatus') + '：'"
            prop="temperatureStatus"
            :class="screenFlag ? 'screenthree' : 'flex-item'"
          >
            <el-select
              v-model="searchForm.temperatureStatus"
              :placeholder="$t('iotPersonAccess.temperaturePrompt')"
              clearable
            >
              <el-option
                v-for="item in temperatureStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-show="showManyCondition">
          <el-form-item
            :label="$t('iotPersonAccess.deviceSn') + '：'"
            prop="deviceSn"
            :class="screenFlag ? 'screenthree' : 'flex-item'"
          >
            <el-input
              v-model="searchForm.deviceSn"
              auto-complete="off"
              :placeholder="$t('iotPersonAccess.deviceSnPrompt')"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('iotPersonAccess.statisticalPeriod') + '：'"
            prop="personId"
            :class="screenFlag ? 'screenthree' : 'flex-item'"
          >
            <el-date-picker
              v-model="time"
              type="datetimerange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" @click="getPersonRecognitionList" class="miniBtn">
          {{ $t('public.search') }}
        </el-button>
        <div @click="manyCondition" class="manyCondition inputMiddle">
          <span>{{ $t('public.manyCondition') }}</span>
          <span :class="iconName"></span>
        </div>
      </div>
    </div>

    <div
      style="height: 600px"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
      
    >
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt />
        <p>{{ $t('public.noData') }}</p>
      </div>

      <!-- 表格 -->

      <el-table
        :max-height="tableHeight"
        v-if="!loading && tableData.length"
        :row-class-name="tableRowClassName"
        ref="multipleTable"
        :data="tableData"
        border
      >
        <template #empty>
          <span>{{ dataText }}</span>
        </template>
        <el-table-column :label="$t('iotPersonAccess.snapPhoto')">
          <template #default="{ row }">
            <el-image
              fit="scale-down"
              :src="row.snapPhoto"
              :preview-src-list="[row.snapPhoto]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('iotPersonAccess.backPhoto')"
          show-overflow-tooltip
          prop="backPhoto"
        >
          <template #default="{ row }">
            <el-image
              fit="scale-down"
              :src="row.backPhoto"
              :preview-src-list="[row.backPhoto]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('iotPersonAccess.authType')"
          show-overflow-tooltip
          :formatter="authTypeFormatter"
        />
        <el-table-column
          :label="$t('iotPersonAccess.inOutType')"
          show-overflow-tooltip
          :formatter="inOutTypeFormatter"
        />
        <el-table-column
          :label="$t('iotPersonAccess.temperature')"
          show-overflow-tooltip
          prop="temperature"
        />
        <el-table-column
          :label="$t('iotPersonAccess.temperatureStatus')"
          show-overflow-tooltip
          :formatter="temperatureStatusFormatter"
        />
        <el-table-column
          :label="$t('iotPersonAccess.eventTime')"
          show-overflow-tooltip
          prop="eventTime"
        />
        <el-table-column
          :label="$t('iotPersonAccess.deviceSn')"
          show-overflow-tooltip
          prop="deviceSn"
        />
        <el-table-column
          :label="$t('iotPersonAccess.installLocate')"
          show-overflow-tooltip
          prop="installLocate"
        />
      </el-table>

      <!--分页-->
      <pagination
        v-if="!loading && tableData.length"
        :total="totalNum"
        v-model:pageNum="searchForm.pageInfo.pageNum"
        v-model:limit="searchForm.pageInfo.pageSize"
        @pagination="getPersonRecognitionList"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PersonnelEntryAndExitRecords',
  data() {
    return {
      isRouterAlive: true,
      screenFlag: true,
      locale: localStorage.getItem('locale'),
      showManyCondition: false,
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标
      tableHeight: 630,
      dataText: '',
      searchForm: {
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      totalNum: 0,
      time: '',
      loading: false,
      tableData: [],
      src: '',
      list: [this.src]
    }
  },
  computed: {
    ...mapState({
      authTypeList: state => state.dict['auth_type'],
      temperatureStatusList: state => state.dict['temperature_status'],
      inOutTypeList: state => state.dict['inOut_type']
    })
  },
  mounted() {
    this.getDictData()
    this.getPersonRecognitionList()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    // 获取字典表
    getDictData() {
      this.getSysDictData(['auth_type', 'temperature_status', 'inOut_type'])
    },
    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight = this.showManyCondition ? 556 : 630
    },
    async getPersonRecognitionList() {
      this.loading = true
      if (this.time) {
        this.searchForm.beginTime = this.time[0]
        this.searchForm.endTime = this.time[1]
      } else {
        this.searchForm.beginTime = ''
        this.searchForm.endTime = ''
      }

      let res = await this.$api.getPersonRecognitionList(this.searchForm)
      this.loading = false
      if (res.resultCode == 0 && res.recognitionList) {
        this.totalNum = res.pageInfo.totalNum
        this.tableData = res.recognitionList
      } else {
        this.totalNum = res.pageInfo.totalNum
        this.tableData = []
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    authTypeFormatter(row) {
      return this.selectDictLabel(this.authTypeList, row.authType, {
        key: 'name',
        value: 'code'
      })
    },
    inOutTypeFormatter(row) {
      return this.selectDictLabel(this.inOutTypeList, row.inOutType, {
        key: 'name',
        value: 'code'
      })
    },
    temperatureStatusFormatter(row) {
      return this.selectDictLabel(this.temperatureStatusList, row.temperatureStatus, {
        key: 'name',
        value: 'code'
      })
    },
    snapPhotoSrcFormatter(row) {
      let index = row.snapPhoto.indexOf('?')
      if (index !== -1) {
        return row.snapPhoto.slice(0, index)
      }
    }
  }
}
</script>

<style lang="scss">
#person-recognition {
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;

  .flex-item {
    width: 42%;
  }
  .screenthree {
    width: 29%;
  }
}
</style>
