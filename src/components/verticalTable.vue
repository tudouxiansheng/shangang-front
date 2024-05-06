<template>
  <!-- 纵向表头表格 -->
  <table class="mailTable" :style="styleObject" v-if="s_showByRow">
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{ tableData[index * 3 - 3].key }}</td>
      <td style="padding-left: 30px">
        <span
          v-if="
            tableData[index * 3 - 3].key != $t('algoGuard.guardLib') &&
            tableData[index * 3 - 3].key != $t('algoGuard.runningPeriod')
          "
        >
          {{ tableData[index * 3 - 3].value }}
        </span>

        <el-dropdown
          trigger="hover"
          v-if="
            tableData[index * 3 - 3].key == $t('algoGuard.guardLib') &&
            tableData[index * 3 - 3].value &&
            tableData[index * 3 - 3].value.length != 0
          "
        >
          <span class="el-dropdown-link">
            {{ tableData[index * 3 - 3].value[0].repositoryName }}
            <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in tableData[index * 3 - 3].value"
                :key="index"
              >
                {{ item.repositoryName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown
          trigger="hover"
          v-if="tableData[index * 3 - 3].key == $t('algoGuard.runningPeriod')"
        >
          <span class="el-dropdown-link">
            {{ tableData[index * 3 - 3].value[0] ? tableData[index * 3 - 3].value[0].dayType : '' }}
            {{ tableData[index * 3 - 3].value[0] ? tableData[index * 3 - 3].value[0].time : '' }}
            <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in tableData[index * 3 - 3].value"
                :key="index"
              >
                {{ item.dayType }} {{ item.time }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </td>
      <td class="column">
        {{ tableData[index * 3 - 2] !== undefined ? tableData[index * 3 - 2].key : '' }}
      </td>
      <td style="padding-left: 30px">
        {{ tableData[index * 3 - 2] !== undefined ? tableData[index * 3 - 2].value : '' }}
      </td>
      <td class="column">
        {{ tableData[index * 3 - 1] !== undefined ? tableData[index * 3 - 1].key : '' }}
      </td>
      <td style="padding-left: 30px">
        {{ tableData[index * 3 - 1] !== undefined ? tableData[index * 3 - 1].value : '' }}
      </td>
    </tr>
  </table>

  <table class="mailTable" :style="styleObject" v-else>
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{ tableData[index - 1].key }}</td>
      <td style="padding-left: 30px">{{ tableData[index - 1].value }}</td>
      <td class="column">
        {{
          tableData[rowCount + index - 1] !== undefined ? tableData[rowCount + index - 1].key : ''
        }}
      </td>
      <td style="padding-left: 30px">
        {{
          tableData[rowCount + index - 1] !== undefined ? tableData[rowCount + index - 1].value : ''
        }}
      </td>
    </tr>
  </table>
</template>

<script>
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
export default {
  components: {
    ElIconArrowDown
  },
  data() {
    return {
      styleObject: {},
      s_showByRow: true
    }
  },
  props: ['tableData', 'tableStyle', 'showByRow'],
  computed: {
    rowCount: function () {
      return Math.ceil(this.tableData.length / 3)
    }
  },
  created() {
    this.styleObject = this.tableStyle
    if (this.showByRow !== undefined) {
      this.s_showByRow = this.showByRow
    }
  }
}
</script>

<style lang="scss" scoped>
.mailTable {
  font-size: 14px;
  color: #4d4d4d;
  border-collapse: collapse;

  tr td {
    border: 1px solid #bebebe;
    width: 150px;
    height: 35px;
    line-height: 35px;
    box-sizing: border-box;
    padding: 0 10px;
  }

  tr td.column {
    background-color: #eff3f6;
    color: #191919;
    text-align: center;
    width: 58px;
  }

  .el-dropdown {
    cursor: pointer;
  }
}
</style>
