<template>
  <div id="recordPolicyManage" v-if="isRouterAlive" ref="recordPolicyManage">
    <el-form
      :inline="true"
      ref="form"
      :model="searchForm"
      label-position="left"
      style="position: relative"
      :label-width="locale == 'en' ? '180px' : '84px'"
    >
      <div>
        <el-form-item label="资源类型：" class="flex-item">
          <el-input placeholder="Please input" />
        </el-form-item>
        <el-form-item label="IP：" auto-complete="off" lass="flex-item">
          <el-input placeholder="Please input" />
        </el-form-item>
      </div>

      <div class="search-btn">
        <el-button type="primary" @click="handleQuery" class="miniBtn">
          {{ $t('public.search') }}
        </el-button>
        <el-button @click="handleReset" class="miniBtn">
          {{ $t('public.reset') }}
        </el-button>
        <el-button  type="primary" @click="addStorageResVisible = true" class="miniBtn">
          新增
        </el-button>
      </div>
    </el-form>
    <div class="contentBox">
      <div v-loading="loading" :element-loading-text="$t('public.loading')">
        <div v-if="!loading && !tableData.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt />
          <p>{{ $t('public.noData') }}</p>
        </div>

        <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
        >
          <el-table-column label="序号" width="50"></el-table-column>
          <el-table-column label="资源类型" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="IP" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="端口" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="集群编码" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column :label="$t('public.operating')" min-width="150">
            <template #default="{ row }">
              <span class="cell-operate" style="word-break: break-word"> {{ $t('public.particulars') }} </span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
        ></pagination>
      </div>
    </div>
    <storage-resources-add></storage-resources-add>
  </div>
</template>
<script>
import pagination from "@components/pagination.vue";
import storageResourcesAdd from "./component/storage-resources-add"
export default {
  name: 'VideoRecordPolicyManage',
  components: {
    pagination,
    'storage-resources-add': storageResourcesAdd
  },
  data() {
    return {
      isRouterAlive: true,
      cuType: sessionStorage.getItem('cuType'),
      locale: localStorage.getItem('locale'),
      // 条件搜索
      searchForm: {
        systemType: '',
        tenantName: '',
        status: ''
      },
      // 表格数据
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      // 新增/编辑存储资源
      addStorageResVisible: false
    }
  },
  async mounted () {
  },
  destroyed() {
  },
  watch: {
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    },
  },
  computed: {
  },
  methods: {
    // 搜索
    handleQuery() {
      this.pageNum = 1
    },
    //重置
    handleReset() {
      this.searchForm = {
        systemType: '',
        platType: '',
        status: ''
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    // 分页
    getListByPage() {
    },
  }
}
</script>
<style lang="scss">
#recordPolicyManage {
  box-sizing: border-box;
  padding: 20px 20px 0;
  height: 100%;
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .contentBox {

  }
  .flex-item {
    width: 36%;
  }
  //一排三表单
  .screenthree {
    width: 25% !important;
  }

  .searchSelect {
    .el-select {
      width: 100%;
    }
  }

  .el-dialog__body {
    padding: 15px 0 5px;

    .el-form-item--small.el-form-item {
      margin-bottom: 28px;
    }
  }
}

</style>
