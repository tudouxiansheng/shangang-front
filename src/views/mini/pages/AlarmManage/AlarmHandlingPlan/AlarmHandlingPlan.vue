<template>
    <div class="base" >
        <el-form class="searchForm" inline v-model="searchForm" ref="sform" :model="searchForm" label-suffix="：">
            <el-form-item :label="$t('AlarmHandlingPlanForm.planName')" prop="planName">
                <el-input
                    :placeholder="$t('public.input', { type: $t('AlarmHandlingPlanForm.planName') })"
                    v-model="searchForm.planName"
                    clearable=""
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('AlarmHandlingPlanForm.alarmType')" prop="alarmType">
                <el-select v-model="searchForm.alarmType" clearable filterable>
                    <el-option :label="$t('public.all')" value=""></el-option>
                    <el-option
                        v-for="(item, index) in alarmList"
                        :label="locale == 'en' ? item.alarmEnName : item.alarmName"
                        :value="item.alarmType"
                        :key="index"
                    ></el-option>
                </el-select>
            </el-form-item>
            <div style="float: right">
                <el-button type="primary" @click="handleFind">{{ $t('public.search') }}</el-button>
                <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
            </div>
        </el-form>
        <div class="btnMargin">
            <el-button type="primary" @click="addPlan">
                {{ $t('AlarmHandlingPlanButton.addPlan') }}
            </el-button>
        </div>
           <div style="height: 600px;margin-top:18px;" v-loading="loading" :element-loading-text="$t('public.loading')">
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt style="margin-top: 0px" />
        <p>{{ $t('public.noData') }}</p>
      </div>
        <el-table
           v-if="!loading && tableData.length"
           :loading="loading"
           :row-class-name="tableRowClassName"
           ref="multipleTable"
           :data="tableData"
           border
        >       
        <el-table-column
          :label="$t('AlarmHandlingPlanForm.planName')"
          prop="disposalPlanName"
          show-overflow-tooltip
        />
        <el-table-column
          :label="$t('AlarmHandlingPlanForm.planDesc')"
          prop="disposalPlanDesc"
          show-overflow-tooltip
        />
  
     
        <el-table-column :label="$t('AlarmHandlingPlanForm.alarmType')" prop="alarmType">
          <template #default="{ row }">
            <span>
              {{ setStatus(row.alarmType) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('public.createTime')" prop="createTime">
        </el-table-column>
        <el-table-column :label="$t('public.operating')" min-width="90">
         <template v-slot:operate="slot" #default="{ row }">
                    <el-button type="text" @click="handleEdit(slot.row)" v-if="PermissionManage">
                        {{ $t('public.edit') }}
                    </el-button>
                    <el-button
                        type="text"
                        @click="handleDelete(slot.row)"
                        v-if="PermissionManage"
                        class="table-btn_warn"
                    >
                        {{ $t('public.delete') }}
                    </el-button>
                    <el-button type="text" @click="handleView(slot.row)" v-if="PermissionManage" class="table-btn_info">
                        {{ $t('public.particulars') }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
</div>
        <pagination
        v-show="!loading && tableData.length"
        :total="totalNum"
        :pageNum="pageNum"
        :limit="pageSize"
        @pagination="handleCurrentChange"
      />
        <!-- 新增/编辑 -->
        <PlanAdd :sceneList="sceneList"></PlanAdd>
        <!-- 详情 -->
        <PlanInfo :sceneList="sceneList"></PlanInfo>
    </div>
</template>

<script>
import PlanAdd from '@/components/AlarmManage/AlarmHandlingPlan/PlanAdd.vue'
import PlanInfo from '@/components/AlarmManage/AlarmHandlingPlan/PlanInfo.vue'
import { mapState, mapActions } from 'vuex'
export default {
    data() {
        return {
            PermissionManage: true,
            loading: true,
            pageNum: 1,
            pageSize: 10,
            totalNum: 0,
            searchForm: {
                planName: '',
                alarmType: '',
            },
            tableData: [],
            alarmList: [], //回显告警类型
            alarmData: [], //告警类型数据
            addVisible: false,
            infoVisible: false,
            operation: '', //0:添加/1：编辑
            planInfoData: null,
        }
    },
    components: {
        PlanAdd,
        PlanInfo,
    },
    computed: {
        ...mapState({
            sceneList: (state) => state.dict['ecs-alarm-type-scene'],
        }),
    },
    async created() {
        await this.getAlarmType()
        this.getPlanList()
        this.getSysDictData(['ecs-alarm-type-scene'])
    },
    methods: {
        setStatus(val) {
            return this.alarmList.find((t) => t.alarmType == val)?.alarmName
        },
        ...mapActions('dict', ['getSysDictData']),
        // 获取告警类型 并分类
        async getAlarmType() {
            let res = await this.$api.getAlarmTypes({
                pageInfo: {
                    pageNum: 1,
                },
            })
            if (res.resultCode == 0) {
                this.alarmList = res.alarmTypeList
                let obj = {}
                if (res.alarmTypeList && res.alarmTypeList.length) {
                    res.alarmTypeList.forEach((al) => {
                        if (!obj[al.scene]) obj[al.scene] = []
                        obj[al.scene].push(al)
                    })
                    this.alarmData = Object.keys(obj).map((k) => {
                        return {
                            key: k,
                            value: obj[k],
                        }
                    })
                }
            }
        },
        //获取列表
        getPlanList() {
            this.loading = true
            this.$api
                .getAlarmPlanList({
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    searchInfo: {
                        disposalPlanName: this.searchForm.planName,
                        alarmType: this.searchForm.alarmType,
                    },
                })
                .then((res) => {
                    this.loading = false
                    this.tableData = [{}]
                    this.totalNum = 0
                    if (res.resultCode == 0) {
                        if (res.disposalPlanList?.length) {
                            this.tableData = res.disposalPlanList
                            this.totalNum = res.pageInfo.totalNum
                        }
                    }
                })
        },
        //新增
        addPlan() {
            this.addVisible = true
            this.operation = 0
        },
            // 表格斑马纹
        tableRowClassName({ rowIndex }) {
          return rowIndex % 2 == 1 ? '' : 'success-row'
        },
        // 分页每页条数
        numberChange(val) {
            this.pageSize = val
            // 如果数量小于分页*每页条数，分页恢复为1
            if (this.totalNum < this.pageSize * this.pageNum) {
                this.pageNum = 1
            }
            this.getPlanList()
        },
        // 分页
        handleCurrentChange(val) {
            this.pageNum = val
            this.getPlanList()
        },
        handleReset() {
            this.$refs.sform.resetFields()
            this.handleFind()
        },
        handleFind() {
            this.pageNum = 1
            this.getPlanList()
        },
        // 详情
        async handleView(row) {
            this.planInfoData = {
                disposalPlanName: row.disposalPlanName,
                disposalPlanDesc: row.disposalPlanDesc,
                alarmType: !!row.alarmType ? row.alarmType.split(',') : [],
            }
            let info = await this.getPlanInfo(row.id)
            this.planInfoData.planStep = info.planStepList.sort((a, b) => a.sort - b.sort)
            this.infoVisible = true
        },
        // 编辑
        async handleEdit(row) {
            this.planInfoData = {
                disposalPlanName: row.disposalPlanName,
                disposalPlanDesc: row.disposalPlanDesc,
                alarmType: !!row.alarmType ? row.alarmType.split(',') : [],
                id: row.id,
            }
            let info = await this.getPlanInfo(row.id)
            this.planInfoData.planStep = info.planStepList.sort((a, b) => a.sort - b.sort)

            this.operation = 1
            this.addVisible = true
        },
        // 获取详情
        async getPlanInfo(id) {
            this.loading = true
            let res = await this.$api.getAlarmPlanInfo({
                id,
            })
            this.loading = false
            if (res.resultCode == 0) return res.disposalPlanInfo
        },
        // 删除
        handleDelete(row) {
            this.$confirm(
                this.$t('AlarmHandlingPlan.Tips.deletePrompt', { name: row.disposalPlanName }),
                this.$t('public.prompt'),
                {
                    confirmButtonText: `${this.$t('public.confirm')}`,
                    cancelButtonText: `${this.$t('public.cancel')}`,
                    type: 'warning',
                    closeOnClickModal: false,
                }
            )
                .then(() => {
                    this.$api.delAlarmPlan({ id: row.id }).then((res) => {
                        if (res.resultCode == 0) {
                            this.$message.success(this.$t('public.delSuccess'))
                            this.pageNum = 1
                            this.getPlanList()
                        }
                    })
                })
                .catch(() => {
                    this.$message.info(this.$t('public.canceledDelete'))
                })
        },
    },
}
</script>

<style lang="scss" scoped>
@import './AlarmHandlingPlan.scss';
</style>
