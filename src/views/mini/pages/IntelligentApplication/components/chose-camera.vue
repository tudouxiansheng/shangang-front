<template>
    <!--选择摄像机-->
    <div class="choseCamera">
        <div class="title2">
            <span>{{ $t('public.selectCamera') }}</span>
            <img class="closeImg" src="../images/close.png" alt @click="handleClose" />
        </div>
        <div class="content">
            <div class="contentleft">
                <div class="titlebox">{{ $t('application.deviceList') }}</div>
                <div class="inputSelect">
                    <el-input placeholder="请输入设备名称" v-model="filterText"></el-input>
                    <!-- <img src="../images/search.png" style="width: 17px; cursor: pointer" @click="treeFilter" class="search" /> -->
                    <div class="line"></div>
                    <img
                        src="../images/refresh.png"
                        style="width: 16px; cursor: pointer"
                        class="refresh"
                        @click="refreshTreeData"
                    />
                </div>
                <div id="orgTree">
                    <!-- 切换两棵树实现懒加载搜索 -->
                    <el-tree
                        v-show="lazyTree"
                        ref="lTree"
                        lazy
                        :load="loadNode"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        class="tree-line"
                        :default-checked-keys="choseDeviceIds"
                        :default-expanded-keys="expandedKeys"
                        :check-strictly="true"
                        @check-change="handleNodeCheck"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <i :class="iconStyUser(data)" class="iconCss"></i>
                            <span class="label" :title="node.label">{{ node.label }}</span>
                        </span>
                    </el-tree>
                    <el-tree
                        v-show="!lazyTree"
                        ref="tree"
                        lazy
                        :load="loadNode"
                        show-checkbox
                        node-key="id"
                        :props="defaultProps"
                        class="tree-line"
                        :default-checked-keys="choseDeviceIds"
                        default-expand-all
                        :check-strictly="true"
                        @check-change="handleNodeCheck"
                        :filter-node-method="filterNode"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <i :class="iconStyUser(data)" class="iconCss"></i>
                            <span class="label" :title="node.label">{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="centerRightImg">
                <img src="../images/rightTo.png" style="height: 18px" />
            </div>
            <div class="contentRight">
                <div class="titlebox">
                    {{ $t('application.selectedDevice') }}
                    <div class="rightclear" @click="handleClearDevice">
                        <img src="../images/rubbish.png" />
                        <span>{{ $t('application.clear') }}</span>
                    </div>
                </div>
                <div class="choseDevice">
                    <div
                        v-for="(device, index) in deviceList"
                        :key="index"
                        style="height: 40px; line-height: 40px; color: #fff"
                    >
                        <i :class="iconStyUser(device)" class="iconCss" v-if="choseDeviceList.length == 0"></i>
                        <img src="../images/camera.png" style="width: 17px; vertical-align: middle" v-else />
                        <span
                            style="display: inline-block;
                  width: 70%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  vertical-align: bottom;
              }"
                            :title="device.label"
                            >{{ device.label }}</span
                        >
                        <i
                            class="iconCss el-icon-close"
                            style="float: right; cursor: pointer; line-height: 40px"
                            @click.stop="delDevice(device)"
                        ></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottomSure">
            <div class="sure centerItem">
                <div class="btnsure centerItem" @click="handleClose">{{ $t('public.confirm') }}</div>
            </div>
            <div class="chongzhi centerItem">
                <div class="btnclear centerItem" @click="handleClearDevice">{{ $t('public.reset') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDeviceTree } from '@/utils/api'

export default {
    name: 'chose-camera',
    props: {
        choseDeviceList: {
            type: Array,
            default() {
                return []
            },
        },
        devType: {
            type: Number,
            default: 1,
        },
    },
    watch: {
        filterText(val) {
            // if (!!val) this.$refs.tree.root.store.lazy = true
            // this.$refs.tree.root.store.lazy = false
            // this.$refs.tree.filter(val)
            if (!val) {
                return (this.lazyTree = true)
            }
            this.lazyTree = false
            this.$refs.tree.filter(val)
        },
    },
    data() {
        return {
            organizationTreeProps: {
                children: 'children',
                isLeaf: 'leaf',
                label: 'label',
                pageNum: 1,
                pageSize: 10,
            },
            expandedKeys: [],
            treeEmptyText: '无摄像设备',
            treeLoading: true,
            defaultCheckedKeys: [],
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'leaf',
                disabled(data, node) {
                    return data.type == 1
                },
            },
            filterText: '', //树过滤
            deviceList: [], //设备数组
            checkedDevice: [],
            lazyTree: true,
        }
    },
    computed: {
        choseDeviceIds() {
            console.log(this.choseDeviceList.map((item) => item.id))
            return this.choseDeviceList.map((item) => item.id)
        },
        iconStyUser(node) {
            return (node) => {
                if (node.type == 1) {
                    return 'iconfont icon-tree'
                } else if (node.type == 2) {
                    if (node.payload.type == 1) {
                        //摄像机
                        if (node.payload.status == 1) {
                            if (node.payload.deviceType == 1) return 'icon-shexiangtou iconfont'
                            if (node.payload.deviceType == 3) return 'icon-qiuji iconfont'
                        } else if (node.payload.status != 1) {
                            if (node.payload.deviceType == 1) return 'icon-shexiangtou-close iconfont'
                            if (node.payload.deviceType == 3) return 'icon-qiuji-close iconfont'
                            return 'icon-shexiangtou iconfont'
                        }
                        return 'icon-shexiangtou iconfont'
                    } else if (node.payload.type == 4) {
                        // 道闸
                        if (node.payload.status == 1) {
                            return 'aci aci-road online'
                        } else {
                            return 'aci aci-road'
                        }
                    } else if (node.payload.type == 5) {
                        // 门禁
                        if (node.payload.status == 1) {
                            return 'aci aci-lock online'
                        } else {
                            return 'aci aci-lock'
                        }
                    }
                }
            }
        },
    },
    created() {
        if (this.choseDeviceList.length) {
            this.replayCamera()
        }
        console.log(123, this.choseDeviceList)
    },
    mounted() {},
    methods: {
        // 回显的摄像机数据
        replayCamera() {
            this.$nextTick(() => {
                this.deviceList = [...this.choseDeviceList]
                this.$refs.tree.setCheckedKeys(this.choseDeviceIds)
            })
            console.log(this.choseDeviceIds)
        },
        loadNode(node, resolve) {
            if (node?.data?.leaf) return resolve([])
            let { level } = node
            if (level == 0) {
                this.findTreeData(node.level, 0, resolve)
            } else {
                this.findTreeData(level, node.data.id, resolve)
            }
        },
        //选中节点
        //共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、
        //节点本身是否被选中、节点的子树中是否有被选中的节点
        handleNodeCheck(node, isCheck) {
            console.log(node, isCheck)
            // 两棵树联动
            if (this.lazyTree) this.$refs.tree.setChecked(node.id, isCheck)
            if (!this.lazyTree) this.$refs.lTree.setChecked(node.id, isCheck)
            if (node.type == 2) {
                if (isCheck) {
                    // 两棵树联动过滤
                    if (!this.deviceList.some((d) => d.id == node.id)) this.deviceList.push(node)
                } else {
                    if (this.deviceList.some((d) => d.id == node.id))
                        this.deviceList.splice(this.deviceList.map((item) => item.id).indexOf(node.id), 1)
                }
            }
        },
        //清空已选设备
        handleNodeClick() {},
        handleClearDevice() {
            this.deviceList = [] //右边删除所有设备
            this.$refs.tree.setCheckedKeys([]) //左边清除选中状态
            this.$refs.lTree.setCheckedKeys([]) //左边清除选中状态
        },
        async findTreeData(level, parentId, resolve) {
            let params = {
                parentId: parentId,
                type: 1,
                defaultType: 1,
                deviceType: 1,
            }
            let res = await getDeviceTree(params)
            if (res.resultCode == 0) {
                this.treedata = res.nodeList
                return resolve(this.treedata)
            } else {
                resolve([])
            }
        },
        refreshTreeData() {
            this.filterText = ''
            // this.treeFilter()
        },
        // treeFilter() {
        //   if (!this.filterText) {
        //     return (this.lazyTree = true)
        //   }
        //   this.lazyTree = false
        //   // this.$refs.tree.filter(this.filterText)
        // },

        handleSelectCheckbox(index) {
            return
            console.log(index, 'index')
            let hash = {}
            const data2 = this.deviceList.reduce((preVal, curVal) => {
                hash[curVal.id] ? '' : (hash[curVal.id] = true && preVal.push(curVal))
                return preVal
            }, [])
            this.deviceList = data2
            if (this.deviceList[index].checked) {
                this.$set(this.deviceList, index, {
                    checked: false,
                    id: this.deviceList[index].id,
                    label: this.deviceList[index].label,
                })
            } else {
                this.$set(this.deviceList, index, {
                    checked: true,
                    id: this.deviceList[index].id,
                    label: this.deviceList[index].label,
                })
            }
        },
        //确定选择摄像机
        handleClose() {
            this.$emit('close', this.deviceList.length, this.deviceList)
        },
        delDevice(device) {
            if (device.id) {
                let node = this.$refs.tree.getNode(device.id)
                let node2 = this.$refs.lTree.getNode(device.id)
                if (node) this.$refs.tree.setChecked(device.id, false)
                if (node2) this.$refs.lTree.setChecked(device.id, false)
                if (this.deviceList.some((d) => d.id == device.id))
                    this.deviceList.splice(this.deviceList.map((item) => item.id).indexOf(device.id), 1)
                this.$emit('updateChoseDevice', this.deviceList)
            }
        },
        handleCheckedDevice() {},
        //树节点过滤
        filterNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },
    },
}
</script>

<style lang="scss">
.custom-tree-node {
    font-size: 14px;
    display: inline-block;
    width: calc(100% - 44px);
    .iconCss {
        margin-right: 5px;
    }
    .online {
        color: #00ccff;
    }
    .label {
        width: calc(100% - 24px);
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
    }
}
.choseCamera {
    position: fixed;
    top: 50%;
    z-index: 9999;
    margin-top: -326px;
    width: 1000px;
    height: 653px;
    background: rgba(20, 47, 72, 0.65);
    border-radius: 8px;
    right: 530px;
    padding: 20px 23px 18px 19px;
    background: url('../images/1000.png');
    background-size: 100% 100%;
    font-size: 14px;
    .title2 {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #1efffc;
        .closeImg {
            float: right;
            cursor: pointer;
        }
    }
    .content {
        display: flex;
        .contentleft,
        .contentRight {
            flex: 1;
            padding: 18px 26px 0 17px;
            width: 467px;
            height: 524px;
            background: rgba(32, 75, 116, 0.65);
            border-radius: 8px;
            margin-top: 19px;

            .titlebox {
                font-size: 14px;
                font-weight: 400;
                color: #ffffff;
                display: flex;
            }
            .choseDevice {
                margin-top: 31px;
                margin-left: 7px;
                height: 400px;
                overflow-y: auto;
                .el-checkbox__input {
                    display: none;
                }
                .el-checkbox__input.is-checked + .el-checkbox__label {
                    color: white;
                }
            }
            .choseDevice .el-checkbox-group {
                display: flex;
                flex-direction: column;
            }
            .choseDevice .el-checkbox {
                margin-bottom: 24px;
            }
        }
        .inputSelect {
            margin-top: 18px;
            position: relative;
            .search {
                position: absolute;
                top: 10px;
                right: 53px;
                z-index: 1000;
            }
            .line {
                position: absolute;
                right: 39px;
                top: 2px;
                width: 1px;
                height: 28px;
                background: #2e7198;
            }
            .refresh {
                position: absolute;
                top: 11px;
                right: 11px;
                z-index: 1000;
            }
        }
        .rightclear {
            right: 40px;
            position: absolute;
            cursor: pointer;
            img {
                width: 18px;
                margin-right: 5px;
                font-size: 0;
                vertical-align: middle;
            }
            span {
                font-size: 14px;
                color: #00ccff;
            }
        }
        .centerRightImg {
            position: relative;
            width: 24px;
            img {
                position: absolute;
                top: 50%;
                margin-top: -50%;
                left: 4px;
            }
        }
        #orgTree {
            margin-top: 18px;
            overflow-x: scroll;
            overflow-y: scroll;
            height: 410px;
            .tree-line {
                .el-tree-node {
                    position: relative;
                    padding-left: 16px; // 缩进量
                }
                .el-tree-node__children {
                    padding-left: 16px; // 缩进量
                }

                // 竖线
                .el-tree-node::before {
                    content: '';
                    height: 100%;
                    width: 1px;
                    position: absolute;
                    left: -3px;
                    top: -26px;
                    border-width: 1px;
                    border-left: 1px dashed #ffffff;
                }
                // 当前层最后一个节点的竖线高度固定
                .el-tree-node:last-child::before {
                    height: 38px; // 可以自己调节到合适数值
                }

                // 横线
                .el-tree-node::after {
                    content: '';
                    width: 24px;
                    height: 20px;
                    position: absolute;
                    left: -3px;
                    top: 12px;
                    border-width: 1px;
                    border-top: 1px dashed #ffffff;
                }

                // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
                & > .el-tree-node::after {
                    border-top: none;
                }
                & > .el-tree-node::before {
                    border-left: none;
                }

                // 展开关闭的icon
                .el-tree-node__expand-icon {
                    font-size: 16px;
                    // 叶子节点（无子节点）
                    &.is-leaf {
                        color: transparent;
                        // display: none; // 也可以去掉
                    }
                }
                //点击之后树节点内容不显示白色
                .el-tree-node:focus > .el-tree-node__content {
                    background-color: transparent;
                }
            }
        }
        #orgTree .el-tree {
            background: transparent;
            color: white;
            display: inline-block;
        }
        #orgTree .el-tree-node__content:hover {
            background-color: #00ccff !important;
        }
        #orgTree .el-tree-node__content:focus {
            background-color: #00ccff;
        }
    }
    .bottomSure {
        position: absolute;
        bottom: 18px;
        display: flex;
        align-items: center;
        left: 50%;
        margin-left: -180px;
        .sure,
        .chongzhi {
            flex: 1;
        }
        .sure {
            margin-right: 40px;
        }
        .btnsure {
            width: 160px;
            height: 40px;
            background: #00ccff;
            border-radius: 4px;
            color: #ffffff;
            cursor: pointer;
        }
        .btnclear {
            width: 160px;
            height: 40px;
            border: 1px solid #b5bdbf;
            border-radius: 4px;
            color: #ffffff;
            cursor: pointer;
        }
    }
}
.centerItem {
    display: flex;
    align-items: center;
    justify-content: center;
}
.icon-camera {
    background-image: url('../images/camera.png');
}
</style>
