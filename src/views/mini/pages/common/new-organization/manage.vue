<template>
  <div id="organization_manage" v-if="isRouterAlive" ref="organizationManage">
    <!-- 组织管理 -->
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 4px">
          <lazy-search-tree
            v-if="orgTreeShow"
            ref="lazyTree"
            @initList="initData"
            @autoDev="autoDev"
            @nodeClick="treeNodeClick"
            :placeholderTitle="placeholderTitle"
            :treeApi="treeApi"
            :searchApi="searchApi"
            :locateApi="locateApi"
            :withTenant="1"
          />
        </el-scrollbar>
      </el-col>
      <el-col v-show="onlyRoot" :span="20" class="el-row20" style="padding: 20px 20px 0">
        <div class="noData">
          <img src="@/assets/img/common/noData1.png" alt="" />
          <p>{{ $t('newOrg.noData') }}</p>
        </div>

        <div class="contents-btns">
          <el-button class="add-manully" type="primary" @click="manullyAdd">
            {{ $t('newOrg.manullyAdd') }}
          </el-button>
          <el-button
            v-if="locale == 'zh'"
            class="quickly-generate"
            type="primary"
            @click="quicklyGenerate"
          >
            {{ $t('newOrg.quicklyGenerate') }}
          </el-button>
        </div>
      </el-col>
      <el-col v-show="!onlyRoot" :span="20" class="el-row20" style="padding: 20px 20px 0">
        <div v-show="goBackShow" class="goBack" @click="goBack">
          <el-icon><el-icon-arrow-left /></el-icon>
          <span>{{ $t('newOrg.goBack') }}</span>
        </div>
        <div v-show="goBackShow" class="title">
          {{ $t('newOrg.directoryCreation') }}
        </div>

        <div v-show="manullyShow">
          <!-- //面包屑 -->
          <div v-show="!goBackShow">
            <breadcrumb ref="breadcrumb" @changeTree="tree_change" />
          </div>
          <el-form
            ref="dataForm"
            :model="dataForm"
            :rules="rules2"
            size="small"
            :label-width="locale == 'en' ? '195px' : '95px'"
            label-position="left"
            v-loading="formLoading"
            :element-loading-text="$t('public.loading')"
          >
            <el-form-item :label="$t('public.organizationName') + ' ：'" prop="organizationName">
              <el-input
                v-model="dataForm.organizationName"
                auto-complete="off"
                :placeholder="$t('public.pleaseInputorganizationName')"
              />
            </el-form-item>

            <el-radio-group
              v-model="cascaderShow"
              @change="radioChange"
              :style="{ marginLeft: locale == 'en' ? '195px' : '95px' }"
              v-if="locale == 'zh'"
            >
              <el-radio-button :label="1">{{ $t('newOrg.manualInput') }}</el-radio-button>
              <el-radio-button :label="0">
                {{ $t('newOrg.cascadeSelection') }}
              </el-radio-button>
            </el-radio-group>
            <el-form-item
              v-show="locale == 'zh' && cascaderShow"
              :label="$t('organizationManage.organizationAreaCode') + ' ：'"
              prop="areaCode1"
            >
              <el-input
                v-model="dataForm.areaCode1"
                auto-complete="off"
                :placeholder="$t('organizationManage.PleaseEnterOrganizationCode')"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="locale == 'zh' && !cascaderShow"
              :label="$t('organizationManage.organizationAreaCode') + ' ：'"
              prop="areaCode"
            >
              <el-cascader
                v-model="dataForm.areaCode"
                :key="areaCascaderKey"
                :options="areaCodeOptions"
                :props="areaCodeProps"
                :show-all-levels="false"
                clearable
                :placeholder="$t('organizationManage.PleaseChooseOrganizationCode')"
              >
                <template #default="{ node }">
                  <span>{{ node.data.areaName }}</span>
                </template>
              </el-cascader>
            </el-form-item>

            <el-form-item :label="$t('public.createTime') + ' ：'">
              <el-input v-model="dataForm.createTime" auto-complete="off" disabled />
            </el-form-item>

            <el-form-item :label="$t('public.updateTime') + ' ：'">
              <el-input v-model="dataForm.updateTime" auto-complete="off" disabled />
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
              {{ $t('organizationManage.addOrganization') }}
            </el-button>
            <el-button
              type="primary"
              @click="editOrganization"
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
        </div>
        <!-- 快捷生成国标目录 -->
        <quickly-generate
          v-if="locale == 'zh'"
          ref="quicklyGenerate"
          v-show="!manullyShow"
          :parentId="rootId"
          @cancelForm="goBack"
          @redisplayTree="redisplayTree"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <add-info />
    <!-- 组织变更弹框 -->
    <org-change />
  </div>
</template>

<script>
import { ArrowLeft as ElIconArrowLeft } from '@element-plus/icons-vue'
import { permissions } from '@/utils/common/permissions'
import api from '@/api'
import getLazyTree from '@/mixin/getLazyTree.js'
import treeBread from '@/mixin/treeBread.js'
import areaCodeBackfill from '@/mixin/areaCodeBackfill'
import orgChange from './component/orgChange'
import addInfo from './component/addInfo'
import quicklyGenerate from './component/quickly-generate.vue'
import breadcrumb from '@/components/breadcrumb' //面包屑
import LazySearchTree from '@/components/lazy-search-tree'

export default {
  components: {
    'org-change': orgChange,
    'add-info': addInfo,
    'quickly-generate': quicklyGenerate,
    breadcrumb,
    LazySearchTree,
    ElIconArrowLeft
  },
  name: 'OrganizationManagement',
  mixins: [getLazyTree, treeBread, areaCodeBackfill],
  data() {
    return {
      PermissionManage: true, //用户权限判断
      isRouterAlive: true,
      locale: localStorage.getItem('locale'), //判断国际化

      orgTreeShow: true,
      onlyRoot: false, // 只有根组织
      rootId: null, //根组织id
      manullyShow: true, // 手动生成
      goBackShow: false, // 返回
      movedOrgId: '',
      showOrgTree: true,
      cantMoveArr: [], //不能移动的组织数组

      organizationId: '',

      cascaderShow: 1,
      areaCascaderKey: 0,
      areaCodeOptions: [], //组织区号级联列表
      areaCodeProps: {
        checkStrictly: true,
        value: 'areaCode',
        label: 'areaCode',
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          let parentCode = level == 0 ? '' : node.value
          api.querySubArea({ parentCode, includeParent: false }).then(res => {
            if (res) {
              const nodes = res.subAreaList
                ? res.subAreaList.map(item => ({
                    ...item,
                    leaf: item.areaLevel > 4
                  }))
                : []
              resolve(nodes)
              let timer = setTimeout(() => {
                const $el = document.querySelectorAll(
                  '.el-cascader-panel .el-cascader-node[aria-owns]'
                )
                Array.from($el).map(item => item.removeAttribute('aria-owns'))
                clearTimeout(timer)
              }, 200)
            }
          })
        }
      },

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
        areaCode: [],
        areaCode1: ''
      },
      addDataForm: {
        organizationName: '', // 组织名称
        parentId: 0,
        parentName: '', // 上级组织名称
        areaCode: [],
        areaCode1: ''
      },
      rawInfo: {},
      rules2: {},
      maskloading: false,
      placeholderTitle: this.$t('public.pleaseEnterOrg'),
      treeApi: 'getOrganizationTree',
      searchApi: 'searchInOrganizationTree',
      locateApi: 'locateInOrganizationTree'
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
      let reg = /^\d{6,12}$/
      let validateName = (rule, value, callback) => {
        if (this.cascaderShow) {
          if (value === '') {
            callback(new Error(this.$t('organizationManage.areaCodeRegExp')))
          } else {
            if (!reg.test(value)) {
              callback(new Error(this.$t('organizationManage.areaCodeRegExp1')))
            }
            callback()
          }
        } else {
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
        areaCode: [
          {
            required: true,
            message: this.$t('organizationManage.PleaseChooseOrganizationCode'),
            trigger: 'change'
          }
        ],
        areaCode1: [{ required: true, validator: validateName, trigger: 'change' }]
      }
      this.locale = localStorage.getItem('locale')
    },
    radioChange(val) {
      if (val) {
        this.rules2.areaCode[0].required = false
        this.rules2.areaCode1[0].required = true
      } else {
        this.rules2.areaCode[0].required = true
        this.rules2.areaCode1[0].required = false
      }
    },
    autoDev (list) {
      if (list) {
        this.onlyRoot = list.length == 0 ? true : false
        this.goBackShow = list.length == 0 ? true : false
        this.manullyShow = !this.onlyRoot ? true : false
        list.length == 0 ? null : this.handleFind()
      }
    },
    // 树加载完初始化表格
    initData(list) {
      if (list.length == 0) {
        this.treeEmptyText = this.$t('public.noData')
      } else {
        this.$nextTick().then(() => {
          this.idArr = [list[0].id]
          this.$refs.lazyTree.$refs.treeList.setCurrentKey(list[0].id)
          this.rootId = list[0].payload.organizationId
          this.organizationId = this.rootId
          //初始化面包屑
          setTimeout(() => {
            this.$refs.breadcrumb.initBread(list)
          }, 100)
        })
      }
      if (this.appendId) {
        this.organizationId = this.appendId
        this.$refs.lazyTree.$refs.treeList.setCurrentKey(this.appendId)
        this.handleFind()
        this.appendId = null
      }
    },
    // 点击树节点
    treeNodeClick(obj) {
      this.cantMoveArr = []
      this.cantMoveArr.push(obj.data.id)
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      // 点击树联动面包屑
      obj.node
        ? this.$refs.breadcrumb.treeLinkBread(obj.data, obj.node)
        : this.$refs.breadcrumb.treeLinkBread(obj.data, obj)
      this.organizationId = obj.data.payload.organizationId
      this.handleFind()
    },
    // 面包屑联动树
    tree_change(data) {
      this.$refs.lazyTree.handleNodeClick(
        this.$refs.lazyTree.$refs.treeList.getNode(data.id).data,
        this.$refs.lazyTree.$refs.treeList.getNode(data.id)
      )
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(data.id)
    },
    // 手动添加国标目录
    manullyAdd() {
      this.onlyRoot = false
      this.manullyShow = true
      this.handleFind()
    },
    // 快捷生成国标目录
    quicklyGenerate() {
      this.onlyRoot = false
      this.manullyShow = false
    },
    // 返回
    goBack() {
      this.$refs.quicklyGenerate && this.$refs.quicklyGenerate.resetForm()
      this.onlyRoot = true
      this.manullyShow = false
    },
    //展示组织信息表单
    handleFind() {
      let obj = { organizationId: this.organizationId }
      this.formLoading = true
      this.$api.getOrganizationInfo(obj).then(res => {
        if (res && res.organizationInfo) {
          let info = res.organizationInfo
          Object.assign(this.dataForm, {
            organizationId: info.organizationId,
            organizationName: info.organizationName,
            areaCode: info.areaCode,
            areaCode1: info.areaCode,
            createTime: info.createTime,
            updateTime: info.updateTime,
            parentId: info.parentId
          })
          info.areaCode1 = info.areaCode
          let areaCode = this.getAreaCodeList(this.dataForm.areaCode)
          this.dataForm.areaCode = areaCode.length == 0 ? [info.areaCode] : areaCode
          this.areaCascaderKey++
          this.rawInfo = { ...info }
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
      const node = this.$refs.lazyTree.$refs.treeList.getNode(id)

      const parent = node.parent
      const childNodes = parent.childNodes
      const index = childNodes.findIndex(d => d.data.payload.organizationId === id)
      childNodes.splice(index, 1)

      const node1 = this.$refs.lazyTree.$refs.treeList.getNode(this.appendId)
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

      let movedNode = this.$refs.lazyTree.$refs.treeList.getNode(this.movedOrgId)
      this.$refs.lazyTree.$refs.treeList.setCurrentKey(node1.data.id)
      //更新面包屑
      this.treeNodeClick(node1)
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
                  const node = this.$refs.lazyTree.$refs.treeList.getNode(
                    this.dataForm.organizationId
                  )
                  const parent = node.parent
                  const childNodes = parent.childNodes
                  const index = childNodes.findIndex(
                    d => d.data.payload.organizationId === this.dataForm.organizationId
                  )
                  childNodes.splice(index, 1)
                  this.appendId = node.parent.data.payload.organizationId.toString()
                  parent.loaded = false
                  parent.loadData()
                  this.$refs.lazyTree.$refs.treeList.setCurrentKey(parent.data.id)

                  //更新面包屑
                  this.treeNodeClick(parent)
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
            areaCode: !this.cascaderShow ? form.areaCode[form.areaCode.length - 1] : form.areaCode1
          }
          this.$api.modifyOrganizationInfo(obj).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              this.$nextTick(() => {
                let node = this.$refs.lazyTree.$refs.treeList.getNode(this.dataForm.organizationId)
                //更新面包屑
                this.treeNodeClick(node)
                node.data.label = this.dataForm.organizationName
                node.data.payload.areaCode = !this.cascaderShow
                  ? this.dataForm.areaCode[form.areaCode.length - 1]
                  : this.dataForm.areaCode1
              })
            }
            this.organizationId = this.dataForm.organizationId
          })
        }
      })
    },

    // 添加
    handleAdd() {
      this.addDataForm = {
        organizationName: '', // 组织名称
        parentId: this.rawInfo.organizationId,
        parentName: this.rawInfo.organizationName, // 上级组织名称
        areaCode: this.rawInfo.areaCode,
        areaCode1: this.rawInfo.areaCode1
      }
      this.dialogFormVisible = true
    },

    // 重新渲染树
    redisplayTree() {
      this.orgTreeShow = false
      this.$nextTick(() => {
        this.orgTreeShow = true
      })
    }
  }
}
</script>

<style lang="scss">
#organization_manage {
  width: 100%;
  height: 100%;

  .el-row20 {
    .noData {
      margin: 150px auto 80px;
      text-align: center;

      img {
        margin: 0 auto;
      }

      p {
        margin-top: 80px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #c1c7d0;
      }
    }

    .contents-btns {
      text-align: center;

      .add-manully {
        margin-right: 60px;
      }

      .quickly-generate {
        margin-left: 60px;
      }
    }

    .goBack {
      font-size: 16px;
      font-weight: 400;
      cursor: pointer;
    }

    .title {
      margin: 40px 0 100px;
      font-size: 16px;
      font-weight: 400;
      position: relative;
      padding-left: 15px;

      &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 16px;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
        background: #2c6dd2;
      }
    }

    .breadcrumb {
      margin: 0 0 20px;
      height: 34px;
      line-height: 34px;
    }

    .el-form {
      margin: 0px auto;
      width: 66%;

      .el-form-item {
        margin-bottom: 45px;
      }

      .el-radio-group {
        margin-bottom: 10px;
      }

      .el-input.is-disabled .el-input__inner {
        color: #999;
      }
    }

    .btns {
      text-align: center;

      .el-button {
        margin: 0 15px;
      }
    }
  }

  .el-cascader {
    width: 100%;
  }
}
</style>
