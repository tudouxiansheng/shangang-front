<template>
    <!-- 告警类型管理 -->
    <div
        class="content"
        v-loading="loading"
        :element-loading-text="$t('public.loading')"
        element-loading-spinner="el-icon-loading"
    >
        <!-- 查询和其他操作 -->
        <div class="search-form">
            <el-form
                :inline="true"
                class="searchForm"
                ref="form"
                :model="searchForm"
                label-position="right"
                label-suffix="："
                inline
            >
                <!-- <el-form-item :label="$t('AlarmType.Table.alarmType')" prop="alarmGroup">
                    <el-select
                        clearable
                        :popper-append-to-body="false"
                        v-model="searchForm.alarmGroup"
                        :placeholder="$t('public.select', { type: $t('AlarmType.Table.alarmType') })"
                    >
                        <el-option :label="$t('public.all')" value=""></el-option>
                        <el-option
                            v-for="(item, index) in alarmSource"
                            :key="index"
                            :label="item.groupName"
                            :value="item.groupCode"
                        ></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item :label="$t('AlarmType.Table.alarmLevel')" prop="alarmLevel">
                    <el-select
                        :popper-append-to-body="false"
                        clearable
                        v-model="searchForm.alarmLevel"
                        :placeholder="$t('public.select', { type: $t('AlarmType.Table.alarmLevel') })"
                    >
                        <el-option :label="$t('public.all')" value=""></el-option>
                        <el-option
                            v-for="(item, index) in alarmLevelList"
                            :key="index"
                            :label="item.alarmLevelName"
                            :value="item.alarmLevelId"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('AlarmType.Table.alarmSituationType')" prop="alarmSituationType">
                    <el-select
                        :popper-append-to-body="false"
                        clearable
                        v-model="searchForm.alarmSituation"
                        :placeholder="$t('public.select', { type: $t('AlarmType.Table.alarmSituationType') })"
                    >
                        <el-option :label="$t('public.all')" value=""></el-option>
                        <el-option
                            v-for="(item, index) in alarmSituationData"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item
            :label="$t('alarmTypeManage.whetherToEnable') + '：'"
            prop="enable"
            class="flex-item">
            <el-select
              :popper-append-to-body="false"
              v-model="searchForm.enable"
              :placeholder="$t('alarmTypeManage.selectWhetherToEnable')">
              <el-option :label="$t('public.all')" value="2"></el-option>
              <el-option :label="$t('alarmTypeManage.yes')" value="1"></el-option>
              <el-option :label="$t('alarmTypeManage.no')" value="0"></el-option>
            </el-select>
          </el-form-item> -->

                <div style="float: right">
                    <el-button type="primary" @click="handleFind" class="miniBtn">
                        {{ $t('public.search') }}
                    </el-button>
                    <el-button @click="handleReset" class="miniBtn">
                        {{ $t('public.reset') }}
                    </el-button>
                </div>
            </el-form>
        </div>
        <div class="content-table">
            <cus-table
                :column="tableColumn"
                :dataList="tableData"
                @handleSelectionChange="handleSelectionChange"
                :maxHeight="600"
                :showCheck="false"
                :pageNum="pageNum"
                :pageSize="pageSize"
            >
                <template v-slot:operate="slot">
                    <el-button type="text" @click="handleEdit(slot.row)" v-if="PermissionManage">
                        {{ $t('public.edit') }}
                    </el-button>
                    <el-button type="text" @click="handleInfo(slot.row)" v-if="PermissionManage" class="table-btn_info">
                        {{ $t('public.particulars') }}
                    </el-button>
                    <el-button type="text" @click="handleSet(slot.row)" v-if="PermissionManage">
                        {{ $t('AlarmType.Button.alarmSet') }}
                    </el-button>
                </template>
            </cus-table>
            <!--分页-->
            <Pagin
                :total="totalNum"
                :pageNum="pageNum"
                :limit="pageSize"
                @sizeChange="numberChange"
                @currentChange="handleCurrentChange"
            ></Pagin>
        </div>

        <alarm-type-detail></alarm-type-detail>
        <alarm-type-modify></alarm-type-modify>
        <alarm-setting ref="alarmSet"></alarm-setting>
    </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
const AlarmTypeDetail = () => import('@/containers/AlarmManage/AlarmType/AlarmTypeDetail')
const AlarmTypeModify = () => import('@/containers/AlarmManage/AlarmType/AlarmTypeModify')
const AlarmSetting = () => import('@/containers/AlarmManage/AlarmType/AlarmSetting')
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        AlarmTypeDetail,
        AlarmTypeModify,
        AlarmSetting,
    },

    data() {
        return {
            tableColumn: [
                {
                    label: 'AlarmType.Table.alarmTypeName',
                    prop: localStorage.getItem('locale') == 'en' ? 'alarmEnName' : 'alarmName',
                },
                {
                    label: 'AlarmType.Table.alarmType',
                    prop: 'alarmGroup',
                    format: this.setGroup,
                },
                {
                    label: 'AlarmType.Table.alarmLevel',
                    prop: 'alarmLevel',
                    format: (val) => {
                        let data = ''
                        this.alarmLevelList.forEach((element) => {
                            if (val == element.alarmLevelId) {
                                data = element.alarmLevelName
                            }
                        })
                        return data
                    },
                    fontColor: (val) => {
                        let data = ''
                        this.alarmLevelList.forEach((element) => {
                            if (val == element.alarmLevelId) {
                                data = element.color
                            }
                        })
                        return data
                    },
                },
                {
                    label: 'AlarmType.Table.alarmSituationType',
                    prop: localStorage.getItem('locale') == 'en' ? 'scene' : 'sceneName',
                    format: this.setSituation,
                },
                {
                    label: 'public.createTime',
                    prop: 'createTime',
                },
            ],
            alarmTypeDetailVisible: false,
            //用户权限判断
            PermissionInfo: true,
            PermissionManage: true,
            th: window.innerHeight - 70,

            // 条件搜索
            searchForm: {
                // alarmGroup: '',
                alarmLevel: '',
                // enable: '2',
                alarmSituation: '',
            },
            startBtn: true, //批量启用
            stopBtn: true, //批量停用
            multipleSelection: [], //表格选中状态存放数组
            // 表格数据
            tableData: [],
            loading: true,
            dataText: '',
            pageNum: 1,
            pageSize: 10,
            totalNum: 0, // 总数量
            number: 0,
            numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,
            operation: false, // true:新增, false:编辑
            dialogFormVisible: false, // 添加或者编辑
            // 添加修改框表单
            dataForm: {
                alarmName: '', //告警类型名称
                alarmEnName: '', //告警类型英文名称
                alarmGroup: '', //告警类型英文名称
                alarmType: '', //告警来源
                alarmLevel: 2, //告警级别
                canQuery: 1, //是否可查询
                canLinkage: 1, //是否可联动
                enable: 1, //是否启用
            },
            //告警级别列表
            alarmLevelList: [],
            alarmSceneList: [],
        }
    },
    async created() {
        await this.getPermissions()
        this.getAlarmSource()
        await this.getDictionaryList()
    },
    mounted() {
        this.getAlarmTypeList()
        this.getGroups()
    },
    computed: {
        ...mapState({
            alarmSource: (state) => state.alarmSource, // 告警来源组
            alarmSituationData: (state) => state.dict['ecs-alarm-type-scene'], // 告警场景
        }),
    },
    methods: {
        ...mapActions(['getAlarmSource']),
        ...mapActions('dict', ['getSysDictData']),
        getDictionaryList() {
            this.getSysDictData(['ecs-alarm-type-scene'])
        },
        //用户权限判断
        async getPermissions() {
            this.PermissionInfo = await permissions(85)
            this.PermissionManage = await permissions(86)
        },
        getGroups() {
            // 请求
            let data = {
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100,
                },
            }
            this.$api.listAlarmLevelByPage(data).then((res) => {
                if (res.alarmLevelList) {
                    this.alarmLevelList = res.alarmLevelList
                }
            })
        },
        setSituation(val) {
            return val == '' || val == null ? '其他告警' : ''
        },
        getAlarmTypeList() {
            let obj = {
                pageInfo: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                },
                searchInfo: {
                    // alarmGroup: this.searchForm.alarmGroup,
                    alarmLevel: this.searchForm.alarmLevel,
                    scene: this.searchForm.alarmSituation,
                    // enable: this.searchForm.enable != 2 ? this.searchForm.enable : null
                },
            }
            this.dataText = ''
            this.loading = true
            this.$api.getAlarmTypes(obj).then((res) => {
                if (res.alarmTypeList && res.alarmTypeList.length) {
                    this.tableData = res.alarmTypeList
                    this.totalNum = res.pageInfo.totalNum
                    // this.$nextTick(() => {
                    //   this.$refs.multipleTable.bodyWrapper.scrollTop = 0
                    // })
                } else {
                    this.tableData = []
                    this.totalNum = 0
                    this.dataText = this.$t('public.noData')
                }
                this.loading = false
            })
        },
        setGroup(val) {
            let list = val.split(',')
            let str = ''
            list.forEach((l) => {
                let nm = this.alarmSource.find((a) => a.groupCode == l)?.groupName
                if (nm) {
                    str += nm
                    str += '、'
                }
            })
            return str.slice(0, -1)
        },
        setstatus(val) {
            let data = { value: '', color: '' }
            this.alarmLevelList.forEach((element) => {
                if (val == element.alarmLevelId) {
                    data.value = element.alarmLevelName
                    data.color = element.color
                }
            })
            return data
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
            this.getAlarmTypeList()
        },
        // 分页
        handleCurrentChange(val) {
            this.pageNum = val
            this.getAlarmTypeList()
        },

        // 添加告警类型
        handleAdd() {
            this.dataForm = {
                alarmName: '', //告警类型名称
                alarmEnName: '', //告警类型英文名称
                alarmGroup: '', //告警类型英文名称
                alarmType: '', //告警来源
                alarmLevel: 1, //告警级别
                canQuery: 1, //是否可查询
                canLinkage: 1, //是否可联动
                enable: 1, //是否启用
            }
            this.operation = true
            this.dialogFormVisible = true
        },

        // 批量启用
        handelStart() {
            this.startOrStop(1, this.$t('public.batchEnableSuccess'))
        },

        // 批量停用
        handelStop() {
            this.startOrStop(0, this.$t('public.batchDeactivationSuccess'))
        },
        startOrStop(enable, title) {
            this.loading = true
            let item = this.multipleSelection
            this.multipleSelection.forEach((item, index) => {
                let obj = {
                    alarmCode: item.alarmType,
                    enable,
                }
                this.$api.enableAlarmType(obj).then((res) => {
                    if (res.resultCode == 0 && index == this.multipleSelection.length - 1) {
                        this.$message({
                            type: 'success',
                            message: title,
                        })
                        this.getAlarmTypeList()
                        this.loading = false
                    }
                })
            })
        },

        // 表格列表选中
        handleSelectionChange(val) {
            this.multipleSelection = val

            // 判断选中的数据中status是否都为true,用于批量启用，批量停用
            var b = val.every((item) => {
                return item.enable == true
            })
            var c = val.every((item) => {
                return item.enable == false
            })

            // 如果数据不为空 状态都为true，可以批量启用，批量组织变更
            if (val.length != 0 && b == true) {
                this.startBtn = true
                this.stopBtn = false
            }

            // 如果数据不为空 状态都为false，可以批量停用，批量组织变更
            else if (val.length != 0 && c == true) {
                this.startBtn = false
                this.stopBtn = true
            }
            // 如果数据为空，都禁用状态
            else {
                this.startBtn = true
                this.stopBtn = true
            }
        },

        // 搜索
        handleFind() {
            this.pageNum = 1
            this.getAlarmTypeList()
        },
        handleReset() {
            // this.searchForm.alarmGroup = ''
            this.searchForm.alarmLevel = ''
            this.searchForm.alarmSituation = ''
            // this.searchForm.enable = '2'
            this.pageNum = 1
            this.getAlarmTypeList()
        },
        // 删除
        // handleDelete(row) {
        //   this.$confirm(this.$t('AlarmType.Form.deleteTips'), this.$t('public.prompt'), {
        //     confirmButtonText: this.$t('public.confirm'),
        //     cancelButtonText: this.$t('public.cancel'),
        //     type: 'warning'
        //   }).then(
        //     () => {
        //       this.$api.delAlarmType({ alarmTypeCode: row.alarmType,alarmLevel: row.alarmLevel}).then((res) => {
        //         if (res.resultCode == 0) {
        //           this.$message.success(this.$t('public.delSuccess'))
        //           this.handleReset()
        //         }
        //       })
        //     },
        //     () => {
        //       this.$message.info(this.$t('public.canceledDelete'))
        //     }
        //   )
        // },

        // 详情
        handleInfo(row) {
            this.getAlarmTypeInfo(row.alarmType, 0)
        },
        // 编辑
        handleEdit(row) {
            this.getAlarmTypeInfo(row.alarmType, 1)
        },
        // 设置告警
        handleSet(row) {
            let obj = {
                alarmType: row.alarmType,
            }
            if (row.alarmType == 'STRANGER_HIGH_FREQUENCY_PERSONNEL_ALARM') {
                obj.alarmDefinitionConfig = {
                    alarmType: 'STRANGER_ALERT',
                }
            }
            this.$api.getAlarmConfig(obj).then((res) => {
                if (res.resultCode == 0) {
                    this.dataForm = {
                        ...res,
                        alarmName: row.alarmName,
                        alarmEnName: row.alarmEnName,
                        alarmType: row.alarmType,
                    }
                    this.$refs.alarmSet.show = true
                }
            })
        },
        async getAlarmTypeInfo(alarmTypeCode, flag) {
            let res = await this.$api.getAlarmType({ alarmTypeCode })
            if (res.resultCode != 0) return
            this.dataForm = res.alarmTypeInfo
            if (flag) {
                this.operation = false
                this.dialogFormVisible = true
            } else {
                this.alarmTypeDetailVisible = true
            }
        },
        // 是否启用
        handleUsing(row) {
            let enable = 0
            enable = row.enable ? 0 : 1
            let ifUseObj = {
                alarmCode: row.alarmType,
                enable,
            }
            this.$api.enableAlarmType(ifUseObj).then((res) => {
                if (res.resultCode == 0) {
                    row.enable = enable
                    this.$refs.multipleTable.clearSelection()
                    this.$message({
                        message: this.$t('public.operatingSuccess'),
                        type: 'success',
                    })
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import './AlarmType.scss';
</style>
