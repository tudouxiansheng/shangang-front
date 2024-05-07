<template>
    <div
        class="content"
        v-loading="loading"
        :element-loading-text="$t('public.loading')"
        element-loading-spinner="el-icon-loading"
    >
        <el-form label-suffix="：" inline class="searchForm" ref="sform">
            <el-form-item :label="$t('AlarmPushRule.Form.ruleName')">
                <el-input
                    v-model="keyWord"
                    :placeholder="$t('public.input', { type: $t('AlarmPushRule.Form.ruleName') })"
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('AlarmType.Form.alarmTypeName')">
                <el-select
                    clearable
                    v-model="alarmType"
                    :popper-append-to-body="false"
                    :placeholder="$t('public.select', { type: $t('AlarmType.Form.alarmTypeName') })"
                >
                    <el-option :label="$t('public.all')" value=""></el-option>
                    <el-option
                        v-for="(item, index) in alarmOption"
                        :label="locale == 'en' ? item.labelEn : item.label"
                        :value="item.value"
                        :key="index"
                    ></el-option>
                </el-select>
            </el-form-item>
            <div style="float: right">
                <el-button type="primary" @click="handleFind">{{ $t('public.search') }}</el-button>
                <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
            </div>
        </el-form>
        <el-button type="primary" @click="addRule" class="btnMargin">
            {{ $t('AlarmPushRule.Button.addRule') }}
        </el-button>
        <div class="content-table">
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
        <AlarmPushRuleAdd
            ref="ruleAddPop"
            :datas="ruleInfo"
            :operation="operation"
            :sceneList="sceneList"
        ></AlarmPushRuleAdd>
        <AlarmPushDetail ref="ruleDetail" :sceneList="sceneList" :infoData="ruleInfo"></AlarmPushDetail>
    </div>
</template>

<script>
import AlarmPushRuleAdd from '@/containers/AlarmManage/AlarmPushRule/AlarmPushRuleAdd'
import AlarmPushDetail from '@/containers/AlarmManage/AlarmPushRule/AlarmPushDetail'
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        AlarmPushRuleAdd,
        AlarmPushDetail,
    },
    data() {
        return {
            PermissionManage: true,
            tableColumn: [
                {
                    label: 'AlarmPushRule.Form.ruleName',
                    prop: 'ruleName',
                },
                {
                    label: 'AlarmPushRule.Form.associatedCamera',
                    prop: 'deviceSum',
                },
                {
                    label: 'AlarmPushRule.Form.associatedAlarm',
                    prop: 'alarmTypeSum',
                },
                {
                    label: 'public.createTime',
                    prop: 'createTime',
                },
            ],
            tableData: [],
            loading: false,
            pageSize: 10,
            pageNum: 1,
            totalNum: 0,
            keyWord: '',
            alarmType: '',
            operation: 0, // 0:新增，1：编辑
            ruleInfo: null, //详情信息
            alarmOption: [],
        }
    },
    created() {
        this.getDictionaryList()
        this.getAlarmTypes()
        this.getListData()
    },
    computed: {
        ...mapState({
            sceneList: (state) => state.dict['ecs-alarm-type-scene'],
        }),
    },
    methods: {
        ...mapActions('dict', ['getSysDictData']),
        getDictionaryList() {
            this.getSysDictData(['ecs-alarm-type-scene'])
        },
        // 分页每页条数
        numberChange(val) {
            this.pageSize = val
            // 如果数量小于分页*每页条数，分页恢复为1
            if (this.totalNum < this.pageSize * this.pageNum) {
                this.pageNum = 1
            }
            this.getListData()
        },
        // 分页
        handleCurrentChange(val) {
            this.pageNum = val
            this.getListData()
        },
        getAlarmTypes() {
            this.$api
                .getAlarmTypes({
                    pageInfo: {
                        pageNum: 1,
                    },
                })
                .then((res) => {
                    if (res?.resultCode == 0) {
                        res.alarmTypeList.forEach((a, i) => {
                            this.alarmOption.push({
                                label: a.alarmName,
                                labelEn: a.alarmEnName,
                                value: a.alarmType,
                            })
                        })
                    }
                })
        },
        // 添加
        addRule() {
            this.operation = 0
            this.$refs.ruleAddPop.show = true
        },
        // 编辑
        handleEdit(row) {
            this.operation = 1
            this.$api
                .getLinkagePolicyInfo({
                    policyId: row.policyId,
                })
                .then((res) => {
                    if (res.resultCode == 0) {
                        this.ruleInfo = res.alarmLinkageActionInfo
                        this.$refs.ruleAddPop.show = true
                    }
                })
        },
        // 删除
        handleDelete(row) {
            this.$confirm(
                this.$t('AlarmPushRule.Tips.deletePrompt', { name: row.ruleName }),
                this.$t('public.prompt'),
                {
                    confirmButtonText: `${this.$t('public.confirm')}`,
                    cancelButtonText: `${this.$t('public.cancel')}`,
                    type: 'warning',
                    closeOnClickModal: false,
                }
            )
                .then(() => {
                    this.$api.deleteLinkagePolicyInfo({ policyIds: [row.policyId] }).then((res) => {
                        if (res.resultCode == 0) {
                            this.$message.success(this.$t('public.delSuccess'))
                            this.pageNum = 1
                            this.getListData()
                        }
                    })
                })
                .catch(() => {
                    this.$message.info(this.$t('public.canceledDelete'))
                })
        },
        // 查看详情
        handleView(row) {
            this.$api
                .getLinkagePolicyInfo({
                    policyId: row.policyId,
                })
                .then((res) => {
                    if (res.resultCode == 0) {
                        this.ruleInfo = res.alarmLinkageActionInfo
                        this.$refs.ruleDetail.show = true
                    }
                })
        },
        //获取表格数据
        handleFind() {
            this.pageNum = 1
            this.getListData()
        },
        getListData() {
            this.loading = true
            this.$api
                .getLinkagePolicyList({
                    pageInfo: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    ruleName: this.keyWord,
                    alarmType: this.alarmType,
                })
                .then((res) => {
                    this.loading = false
                    if (res.resultCode == 0) {
                        if (res.policyList && res.policyList.length) {
                            this.tableData = res.policyList
                            this.totalNum = res.pageInfo.totalNum
                        } else {
                            this.tableData = []
                            this.totalNum = 0
                        }
                    }
                })
        },
        handleReset() {
            this.keyWord = ''
            this.alarmType = ''
            this.pageNum = 1
            this.handleFind()
        },
    },
}
</script>

<style lang="scss" scoped>
@import './AlarmPushRule.scss';
</style>
