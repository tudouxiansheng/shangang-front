<template>
    <CusDialog
        title="选择设备"
        :visible="visible"
        :width="500"
        @close="handleClose"
        @open="handleOpen"
        @submit="submitFn"
    >
        <template slot="body">
            <el-tree
                v-if="showTree"
                class="areaTree"
                ref="areaTree"
                node-key="id"
                :props="treeProps"
                :load="loadNode"
                lazy
                expand-on-click-node
                :default-expanded-keys="defaultExpendsId"
                v-loading="treeLoading"
                :check-strictly="true"
                @node-click="handleNodeClick"
            >
                <template slot-scope="{ node, data }">
                    <span
                        class="custom-tree-node"
                        :class="[data.type == 2 && selectedDev.length >= limitNum && !data.checked ? 'disable' : '']"
                    >
                        <el-checkbox v-if="data.type == 2 && disableId == data.id" disabled></el-checkbox>
                        <el-checkbox v-if="data.type == 2 && disableId != data.id" v-model="data.checked"></el-checkbox>
                        <i v-if="data.type == 2" :class="classOf(data.payload)"></i>
                        <span class="tree-label" :title="data.label">{{ data.label }}</span>
                    </span>
                </template>
            </el-tree>
        </template>
    </CusDialog>
</template>

<script>
export default {
    props: {
        devList: {
            type: Array,
        },
        visible: {
            type: Boolean,
        },
        devType: {
            type: String,
        },
        disableId: {
            type: String,
        },
        selectedList: {
            type: Array,
        },
        limitNum: {
            type: Number,
            default: Infinity,
        },
    },
    data() {
        return {
            treeProps: {
                label: 'areaName',
                children: [],
                isLeaf: 'leaf',
            },
            curNode: null, //判断是添加子集还是编辑
            treeLoading: false,
            checkedValue: [],
            showTree: true,
            defaultExpendsId: [],
            selectedDev: [],
        }
    },
    watch: {
        // 存在未分组的，需要回显处理
        // checkedValue(val) {
        //     if (val.length) {
        //         val.forEach((v) => {
        //             let node = this.$refs.areaTree.getNode(v)
        //             node && node.data && (node.data.checked = true)
        //         })
        //         this.expandNode(val)
        //     }
        // },
        selectedList(val) {
            // 先取消所有的勾选
            if (this.$refs.areaTree) {
                let keys = Object.keys(this.$refs.areaTree?.store?.nodesMap)
                keys.forEach((k) => (this.$refs.areaTree.store.nodesMap[k].data.checked = false))
            }
            this.defaultExpendsId = []
            if (val.length) {
                val.forEach((v) => {
                    if (v.parents) {
                        var parents = v.parents.slice(0, -1)
                        var _ps = parents.split(',')
                        if (_ps.length >= 2) {
                            this.defaultExpendsId = [...new Set([..._ps, ...this.defaultExpendsId])]
                        }
                    }
                })
            }
        },
    },
    methods: {
        handleClose() {
            if (this.selectedList.length < this.selectedDev.length) {
                // 比较多选的 并取消勾选
                let ids = this.selectedList.map((s) => s.id)
                this.selectedDev.forEach((d) => {
                    if (!ids.includes(d.id)) {
                        d.checked = false
                    }
                })
            }
            this.checkedValue = []
            this.selectedDev = []
            this.$emit('update:visible', false)
        },
        handleOpen() {
            if (this.selectedList.length) {
                this.checkedValue = this.selectedList.map((c) => c.id)
                this.selectedDev = this.selectedList.map((s) => s)
                this.selectedList.forEach((l) => {
                    let node = this.$refs.areaTree.store.nodesMap[l.id]
                    if (node && node.data) {
                        node.data.checked = true
                    }
                })
            }
        },
        /****************树操作 */
        expandNode(val) {
            this.$api.getRoleUserCameraOrgRequest({ cameraIdList: val }).then((res) => {
                if (res.resultCode == 0) {
                    let ids = []
                    res.cameraInfoList?.forEach((item) => {
                        var parents = item.parents.split(',').slice(0, -1)
                        ids = [...ids, ...parents]
                    })
                    this.defaultExpendsId = Array.from(new Set(ids))
                }
            })
        },
        // 加载树
        loadNode(node, resolve) {
            let { level } = node
            if (level == 0) {
                this.getTree(level, 0, resolve)
            } else {
                this.getTree(level, node.data.id, resolve)
            }
        },
        // 懒加载加载树
        getTree(level, parentId, resolve) {
            var list = []
            let data = {
                type: 1,
                subType: 2, //区域
                parentId,
                defaultType: 1,
            }
            data.parentId = !!parentId ? parentId : 0
            this.$api.getDeviceTree(data).then((res) => {
                list = res.nodeList || []
                list.map((l) => {
                    if (l.type == 2) {
                        if (this.checkedValue.includes(l.id)) {
                            l.checked = true
                        } else l.checked = false
                    }
                })
                //初始化面包屑
                this.treeLoading = false
                return resolve(list)
            })
        },
        // 点击设备
        handleNodeClick(data, node) {
            if (!data.checked && this.selectedDev.length >= this.limitNum) return
            if (data.type == 2) {
                if (data.id != this.disableId) {
                    data.checked = !data.checked
                    if (data.checked) {
                        this.selectedDev.push(data)
                    } else {
                        this.selectedDev = this.selectedDev.filter((s) => s.id != data.id)
                    }
                } else {
                    this.$message.info('不能选择和告警设备相同的摄像机')
                }
            }
        },
        // 确认设备
        submitFn() {
            this.$emit('selDevice', this.selectedDev)
            this.handleClose()
        },
        refresh() {
            this.showTree = false
            this.$nextTick(() => {
                this.showTree = true
            })
        },
        classOf(data) {
            let cls = 'iconCss2'
            if (data.status == 1) cls = 'iconCss'
            cls += ' '
            if (data.ptzType == 1) {
                return cls + 'aci-camera-gun'
            } else if (data.ptzType == 2) {
                return cls + 'aci-camera-ptz'
            } else if (data.ptzType == 3) {
                return cls + 'aci-camera-ball'
            } else if (data.ptzType == 4) {
                return cls + 'aci-camera-hemisphere'
            } else if (data.ptzType == 5) {
                return cls + 'aci-camera-collect'
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.areaTree {
    height: calc(100% - 40px) !important;
    background: #136087;
    ::v-deep .custom-tree-node {
        width: 100%;
        .el-checkbox {
            margin-right: 5px !important;
            pointer-events: none;
        }
        // .tree-label{
        //   width: ;
        // }
    }
    ::v-deep .el-tree-node__content,
    .el-tree-node__content:hover {
        background: transparent !important;
    }

    .disable {
        cursor: no-drop;
    }
    .el-checkbox.is-disabled {
        cursor: no-drop;
    }
}
</style>
