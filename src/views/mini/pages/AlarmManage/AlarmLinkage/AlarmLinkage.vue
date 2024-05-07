<template>
    <div class="content">
        <el-form class="searchForm" inline :model="searchForm" ref="sform" label-suffix="：">
            <el-form-item :label="$t('AlarmLinkage.Form.deviceName')" prop="deviceName">
                <el-input
                    :placeholder="$t('AlarmLinkage.Form.deviceName')"
                    v-model="searchForm.deviceName"
                    clearable=""
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('AlarmLinkage.Form.alarmType')" prop="alarmType">
                <el-select v-model="searchForm.alarmType" filterable>
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
            <el-button type="primary" @click="addLinkage">
                {{ $t('AlarmPushRule.Button.addRule') }}
            </el-button>
        </div>
        <div
            class="content-table"
            v-loading="loading"
            :element-loading-text="$t('public.loading')"
            element-loading-spinner="el-icon-loading"
        >
            <cus-table
                :column="tableColumn"
                :dataList="tableData"
                :maxHeight="600"
                :pageNum="pageNum"
                :pageSize="pageSize"
            >
                <template v-slot:operate="slot">
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
            </cus-table>
            <Pagin
                :total="totalNum"
                :pageNum="pageNum"
                :limit="pageSize"
                @sizeChange="numberChange"
                @currentChange="handleCurrentChange"
            ></Pagin>
        </div>
        <!-- 新增/编辑 -->
        <LinkageAdd
            :operation="operation"
            :visible.sync="addVisible"
            :deviceType="deviceType"
            :videoType="videoType"
            :dataInfo="ruleInfoData"
            :sceneList="sceneList"
            :alarmData="alarmData"
            @backToList="backToList"
            @viewInfo="viewInfo"
        ></LinkageAdd>
        <!-- 详情 -->
        <LinkageInfo
            :visible.sync="infoVisible"
            :videoType="videoType"
            :sceneList="sceneList"
            :dataInfo="ruleInfoData"
            :alarmList="alarmList"
        ></LinkageInfo>
    </div>
</template>

<script>
import LinkageAdd from '@/containers/AlarmManage/AlarmLinkage/LinkageAdd.vue'
import LinkageInfo from '@/containers/AlarmManage/AlarmLinkage/LinkageInfo.vue'
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        LinkageAdd,
        LinkageInfo,
    },
    data() {
        return {
            PermissionManage: true,
            loading: false,
            pageNum: 1,
            pageSize: 10,
            totalNum: 0,
            searchForm: {
                deviceName: '',
                alarmType: '',
            },
            tableData: [],
            tableColumn: [
                {
                    label: 'AlarmLinkage.Form.deviceType',
                    prop: 'deviceType',
                    format: (val, row) => {
                        row.deviceTypeName = this.deviceType.find((d) => d.value == val)?.name
                        return row.deviceTypeName
                    },
                },
                {
                    label: 'AlarmLinkage.Form.alarmDev',
                    prop: 'deviceName',
                },
                {
                    label: 'AlarmLinkage.Form.alarmType',
                    prop: 'alarmType',
                    format: (val) => {
                        if (this.locale == 'en') {
                            return val
                        } else {
                            let arr = val.split(',')
                            let nmArr = arr.map((a) => {
                                return this.alarmList.find((al) => al.alarmType == a)?.alarmName
                            })
                            return nmArr.join('，')
                        }
                    },
                },
                {
                    label: 'public.createTime',
                    prop: 'createTime',
                },
            ],
            addVisible: false,
            infoVisible: false,
            operation: 0,
            alarmList: [],
            alarmData: [],
            ruleInfoData: {},
        }
    },
    async created() {
        this.getAlarmSource()
        await this.getAlarmType()
        await this.getDictionaryList()
        this.getLinkList()
    },
    computed: {
        ...mapState({
            videoType: (state) => state.dict['alarm-video-type'],
            deviceType: (state) => state.dict['rule-device-type'],
            sceneList: (state) => state.dict['ecs-alarm-type-scene'],
        }),
    },
    methods: {
        ...mapActions(['getAlarmSource']),
        ...mapActions('dict', ['getSysDictData']),
        getDictionaryList() {
            this.getSysDictData(['alarm-video-type', 'rule-device-type', 'ecs-alarm-type-scene'])
        },
        // 获取告警类型 并分类
        async getAlarmType() {
            let res = await this.$api.getAlarmTypes({
                pageInfo: {
                    pageNum: 1,
                    pageSize: 1000,
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
        // 分页每页条数
        numberChange(val) {
            this.pageSize = val
            // 如果数量小于分页*每页条数，分页恢复为1
            if (this.totalNum < this.pageSize * this.pageNum) {
                this.pageNum = 1
            }
            this.getLinkList()
        },
        // 分页
        handleCurrentChange(val) {
            this.pageNum = val
            this.getLinkList()
        },
        handleReset() {
            this.$refs.sform.resetFields()
            this.handleFind()
        },
        handleFind() {
            this.pageNum = 1
            this.getLinkList()
        },
        viewInfo(data) {
            this.addVisible = false
            this.handleFind()
            this.handleView(data)
        },
        backToList() {
            this.addVisible = false
            this.handleFind()
        },
        //获取列表
        getLinkList() {
            this.loading = true
            this.$api
                .getLinkageRuleList({
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    searchInfo: this.searchForm,
                })
                .then((res) => {
                    this.loading = false
                    this.tableData = []
                    this.totalNum = 0
                    if (res.resultCode == 0) {
                        if (res.linkageRuleInfoList?.length) {
                            this.tableData = res.linkageRuleInfoList
                            this.totalNum = res.pageInfo.totalNum
                        }
                    }
                })
        },
        //新增
        addLinkage() {
            this.operation = 0
            this.addVisible = true
        },
        // 删除
        handleDelete(row) {
            this.$confirm(this.$t('AlarmLinkage.Tips.deletePrompt'), this.$t('public.prompt'), {
                confirmButtonText: `${this.$t('public.confirm')}`,
                cancelButtonText: `${this.$t('public.cancel')}`,
                type: 'warning',
                closeOnClickModal: false,
            })
                .then(() => {
                    this.$api.delLinkageRule({ id: row.id }).then((res) => {
                        if (res.resultCode == 0) {
                            this.$message.success(this.$t('public.delSuccess'))
                            this.pageNum = 1
                            this.getLinkList()
                        }
                    })
                })
                .catch(() => {
                    this.$message.info(this.$t('public.canceledDelete'))
                })
        },
        // 详情
        async handleView(row) {
            let res = await this.getRuleInfo(row.id)
            row.ptzType = res?.linkageRuleInfo?.ptzType
            this.ruleInfoData = {
                alarmType: row.alarmType.split(','),
                deviceId: row.deviceId,
                deviceName: row.deviceName,
                ptzType: row.ptzType || 1,
                deviceType: row.deviceType,
                deviceTypeName: row.deviceTypeName,
                linkageAction: JSON.parse(row.linkageAction),
                cameraInfoList: res.cameraInfoList,
                iotDeviceInfoList: res.iotDeviceInfoList,
                ptzType: row.ptzType,
            }
            this.infoVisible = true
        },
        // 编辑
        async handleEdit(row) {
            if (!row.ptzType) {
                let res = await this.getRuleInfo(row.id)
                row.ptzType = res?.linkageRuleInfo?.ptzType
            }
            this.operation = 1
            this.ruleInfoData = {
                id: row.id,
                alarmType: row.alarmType.split(','),
                deviceId: row.deviceId,
                deviceName: row.deviceName,
                ptzType: row.ptzType || 1,
                deviceType: row.deviceType,
                linkageAction: JSON.parse(row.linkageAction),
            }
            this.addVisible = true
        },
        // 获取详情
        async getRuleInfo(id) {
            this.loading = true
            let res = await this.$api.getLinkageRuleInfo({
                id,
            })
            this.loading = false
            if (res.resultCode == 0) return res
        },
    },
}
</script>

<style lang="scss" scoped>
@import './AlarmLinkage.scss';
</style>
