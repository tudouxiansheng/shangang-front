<template>
  <!-- 组织管理 -->
  <div id="organization_manage" v-if="isRouterAlive" ref="organizationManage">
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :props="organizationTreeProps"
              :load="loadNode"
              lazy
              v-loading="treeLoading"
              :default-expanded-keys="idArr"
              :empty-text="treeEmptyText"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="el-row20">
        <!-- //面包屑 -->
        <breadcrumb ref="breadcrumb" @changeTree="tree_change" />

        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="rules2"
          :label-width="locale == 'en' ? '188px' : '95px'"
          label-position="left"
          :validate-on-rule-change="false"
          style="margin: 20px auto 0; width: 720px"
          v-loading="formLoading"
          :element-loading-text="$t('public.loading')"
          
        >
          <el-form-item :label="$t('public.organizationName') + ' ：'" prop="organizationName">
            <el-input
              v-model="dataForm.organizationName"
              auto-complete="off"
              :placeholder="$t('public.pleaseInputorganizationName')"
              :disabled="dataForm.organizationId == rootId"
            />
          </el-form-item>

          <el-form-item
            :label="$t('organizationManage.organizationAreaCode') + ' ：'"
            prop="areaCode"
          >
            <el-input
              v-model="dataForm.areaCode"
              auto-complete="off"
              :placeholder="$t('organizationManage.PleaseEnterOrganizationCode')"
              clearable
              :disabled="dataForm.organizationId == rootId"
            />
          </el-form-item>

          <div class="disabledInput">
            <el-form-item :label="$t('public.createTime') + ' ：'" prop>
              <el-input v-model="dataForm.createTime" auto-complete="off" disabled />
            </el-form-item>

            <el-form-item :label="$t('public.updateTime') + ' ：'" prop>
              <el-input v-model="dataForm.updateTime" auto-complete="off" disabled />
            </el-form-item>
          </div>
        </el-form>
        <div style="text-align: center; margintop: 35px">
          <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
            {{ $t('organizationManage.addOrganization') }}
          </el-button>
          <el-button
            type="primary"
            @click="editOrganization"
            :disabled="dataForm.organizationId == rootId"
            v-preventReClick
            v-if="PermissionManage"
          >
            {{ $t('organizationManage.editOrganization') }}
          </el-button>
          <el-button
            type="primary"
            @click="moveOrganization"
            :disabled="dataForm.organizationId == rootId"
            v-preventReClick
            v-if="PermissionManage"
          >
            {{ $t('public.orgChange') }}
          </el-button>
          <el-button
            type="danger"
            @click="delOrganization"
            :disabled="dataForm.organizationId == rootId"
            v-if="PermissionManage"
          >
            {{ $t('organizationManage.delOrganization') }}
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <add-info></add-info>

    <!-- 组织变更弹框 -->
    <org-change class="org_change"></org-change>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import getLazyTree from '@/mixin/getLazyTree.js'
import treeBread from '@/mixin/treeBread.js'

import orgChange from './component/orgChange'
import addInfo from './component/addInfo'
import breadcrumb from '@/components/breadcrumb' //面包屑

export default {
  mixins: [getLazyTree, treeBread],
  components: {
    'org-change': orgChange,
    'add-info': addInfo,
    breadcrumb
  },
  data() {
    return {
      isRouterAlive: true,
      PermissionManage: true, //用户权限判断
      locale: localStorage.getItem('locale'), //判断国际化

      movedOrgId: '',
      showOrgTree: true,
      cantMoveArr: [], //不能移动的组织数组

      organizationId: '',
      rootId: null, //根组织id
      orgChangeShow: false, //组织变更弹框
      loading: true,
      formLoading: false,

      appendId: null,

      dialogFormVisible: false, // 添加

      // 添加修改框表单
      dataForm: {
        organizationId: 0,
        organizationName: '', // 组织名称
        parentId: 0,
        parentName: '', // 上级组织名称
        areaCode: ''
      },
      addDataForm: {
        organizationName: '', // 组织名称
        parentId: 0,
        parentName: '', // 上级组织名称
        areaCode: ''
      },
      rules2: {},
      maskloading: false
    }
  },

  async created() {
    await this.setFormRules()
    await this.getPermissions()
  },
  activated() {
    
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.setFormRules()
    }
  },

  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(10)
    },
    setFormRules() {
      // 验证组织名
      var reg = /^\d{6,12}$/
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('organizationManage.areaCodeRegExp')))
        } else {
          if (!reg.test(value)) {
            callback(new Error(this.$t('organizationManage.areaCodeRegExp1')))
          }
          callback()
        }
      }
      this.rules2 = {
        // 组织名称
        organizationName: [
          {
            required: true,
            message: this.$t('organizationManage.organizationRegExp'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('organizationManage.lessThanEighteen'),
            trigger: 'blur'
          }
        ],
        areaCode: [{ required: true, validator: validateName, trigger: 'change' }]
      }
      this.locale = localStorage.getItem('locale')
    },

    // 加载树
    async getTree(level, parentId, resolve) {
      var list = []
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parseInt(parentId)) : null
      await this.$api.getOrganizationTree(data).then(res => {
        list = res.nodeList || []
        // 下级租户管理
        const query = this.$route.query
        if (level == 0 && query.tenantName) {
          list = [
            {
              id: query.organizationId.toString(),
              label: query.tenantName,
              leaf: false,
              type: '1',
              payload: {
                organizationId: query.organizationId,
                organizationName: query.tenantName,
                parents: String(query.organizationId),
                type: 1,
                areaCode: query.areaCode
              }
            }
          ]
        }

        this.treeLoading = false
        return resolve(list)
      })
      if (level == 0 && list.length) {
        this.$nextTick().then(async () => {
          this.idArr = [list[0].id]
          this.$refs.treeList.setCurrentKey(list[0].id)
          this.rootId = list[0].payload.organizationId
          this.organizationId = this.rootId
          //初始化面包屑
          setTimeout(() => {
            this.$refs.breadcrumb.initBread(list)
          }, 100)
          await this.handleFind()
        })
      } else if (level == 0 && list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      }
      if (this.appendId) {
        this.organizationId = this.appendId
        this.$refs.treeList.setCurrentKey(this.appendId)
        this.handleFind()
        this.appendId = null
      }
    },
    // 点击树节点
    handleNodeClick(data, node) {
      this.cantMoveArr = []
      this.cantMoveArr.push(data.id)
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      //点击树联动面包屑
      this.$refs.breadcrumb.treeLinkBread(data, node)

      this.organizationId = data.payload.organizationId
      this.handleFind()
    },
    // 面包屑联动树
    tree_change(data) {
      this.handleNodeClick(
        this.$refs.treeList.getNode(data.id).data,
        this.$refs.treeList.getNode(data.id)
      )
      this.$refs.treeList.setCurrentKey(data.id)
    },

    //展示组织信息表单
    handleFind() {
      let obj = { organizationId: this.organizationId }
      this.formLoading = true
      this.$api.getOrganizationInfo(obj).then(res => {
        let info = res.organizationInfo
        if (info) {
          Object.assign(this.dataForm, {
            organizationId: info.organizationId,
            organizationName: info.organizationName,
            areaCode: info.areaCode,
            createTime: info.createTime,
            updateTime: info.updateTime,
            parentId: info.parentId
          })

          this.addDataForm.parentId = info.organizationId
        }
        this.formLoading = false
      })
    },

    //组织变更弹框
    moveOrganization() {
      this.showOrgTree = false
      this.$nextTick(() => {
        this.showOrgTree = true
      })
      this.orgChangeShow = true
    },
    treeChange() {
      let id = this.dataForm.organizationId
      const node = this.$refs.treeList.getNode(id)

      const parent = node.parent
      const childNodes = parent.childNodes
      const index = childNodes.findIndex(d => d.data.payload.organizationId === id)
      childNodes.splice(index, 1)

      const node1 = this.$refs.treeList.getNode(this.appendId)
      const data = node1.data.payload.parents
      const arr = data.split(',')
      this.idArr = arr.slice(0, -1)
      this.appendId = id.toString()
      if (node1.expanded) {
        node1.loaded = false
      } else {
        node1.expanded = true
      }
      node1.loadData()

      let movedNode = this.$refs.treeList.getNode(this.movedOrgId)

      //更新面包屑
      this.handleNodeClick(node1.data, node1)
      this.breadcrumbList.push(movedNode.data)
      this.getBreadCopy()
    },
    //删除组织
    delOrganization() {
      this.$confirm(this.$t('organizationManage.ifDelOrganization'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api
            .deleteOrganizationInfo({
              organizationId: this.dataForm.organizationId
            })
            .then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.delSuccess')
                })

                this.$nextTick(() => {
                  const node = this.$refs.treeList.getNode(this.dataForm.organizationId)
                  const parent = node.parent
                  const childNodes = parent.childNodes
                  const index = childNodes.findIndex(
                    d => d.data.payload.organizationId === this.dataForm.organizationId
                  )
                  childNodes.splice(index, 1)
                  this.appendId = node.parent.data.payload.organizationId.toString()
                  parent.loaded = false
                  parent.loadData()

                  //更新面包屑
                  this.handleNodeClick(parent.data, parent)
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },
    //修改组织
    editOrganization() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let form = this.dataForm
          let obj = {
            organizationName: form.organizationName,
            organizationId: form.organizationId,
            areaCode: form.areaCode
          }
          this.$api.modifyOrganizationInfo(obj).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              this.$nextTick(() => {
                let node = this.$refs.treeList.getNode(this.dataForm.organizationId)
                this.handleNodeClick(node.data, node)
                node.data.label = this.dataForm.organizationName
                node.data.payload.areaCode = this.dataForm.areaCode
              })
            }
            this.organizationId = this.dataForm.organizationId
            this.handleFind()
          })
        }
      })
    },

    // 添加
    handleAdd() {
      this.addDataForm.areaCode = ''
      this.addDataForm.organizationName = ''
      this.addDataForm.parentName = this.dataForm.organizationName

      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss">
#organization_manage {
  width: 100%;
  height: 100%;
  .org_change .el-dialog__body {
    padding: 15px 125px 5px;
  }
  .el-cascader--small {
    width: 100%;
  }
  .disabledInput .el-input__inner {
    color: #999;
  }
  .el-breadcrumb {
    margin-top: 20px;
  }
}
</style>
