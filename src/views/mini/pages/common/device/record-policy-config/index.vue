<template>
  <div id="recordPolicyConfig" v-if="isRouterAlive" ref="recordPolicyConfig">
    <el-form
      :inline="true"
      ref="form"
      :model="searchForm"
      label-position="left"
      style="position: relative"
      :label-width="locale == 'en' ? '180px' : '84px'"
    >
      <div>
        <el-form-item label="存储域：" class="flex-item">
          <el-input placeholder="Please input" />
        </el-form-item>
        <el-form-item label="IP：" auto-complete="off" lass="flex-item">
          <el-input placeholder="Please input" />
        </el-form-item>
        <el-form-item label="节点状态：" auto-complete="off" lass="flex-item">
          <el-select clearable :placeholder="$t('systemTatermarkManage.pleaseSelectUsageStatus')">
            <el-option label="全部" value=""></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="search-btn">
        <el-button type="primary" @click="handleQuery" class="miniBtn">
          {{ $t('public.search') }}
        </el-button>
        <el-button @click="handleReset" class="miniBtn">
          {{ $t('public.reset') }}
        </el-button>
        <el-button  type="primary" @click="addStorageNodesVisible = true" class="miniBtn">
          新增节点
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
          <el-table-column label="设备ID" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="摄像机名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="存储留存期" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="存储码流" show-overflow-tooltip min-width="80"></el-table-column>
          <el-table-column label="已占用空间" min-width="100" show-overflow-tooltip></el-table-column>
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
    <storage-nodes-add></storage-nodes-add>
  </div>
</template>
<script>
import pagination from "@components/pagination.vue";
import StorageNodesAdd from "./component/storage-nodes-add"

export default {
  name: 'VideoRecordPolicyConfig',
  components: {
    'storage-nodes-add': StorageNodesAdd,
    pagination
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

      // 新增/编辑节点
      addStorageNodesVisible: false,
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
#recordPolicyConfig {
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
