<template>
  <div
    :class="[
      'select-tag-wrapper',
      inline && !onlyShowChecked ? 'select-tag-inline' : '',
      !showCheckAll ? 'select-no-all' : ''
    ]"
    :style="marginLeft"
  >
    <div v-if="tagMode">
      <el-checkbox-group
        v-if="showCheckAll && !onlyShowChecked"
        class="tags-group check-all"
        v-model="checkAll"
        :text-color="textColor"
        :fill="fill"
        :size="size"
        :disabled="disabled"
        @change="handleCheckAllChange"
      >
        <el-checkbox-button :indeterminate="isIndeterminate">
          {{ $t('repo.allSelect1') }}
        </el-checkbox-button>
      </el-checkbox-group>
      <div v-for="item in optionData" :key="item.id">
        <span class="select-tag-group-title" v-if="group">{{ item.name }}</span>
        <el-checkbox-group
          class="tags-group"
          v-model="selectedVal"
          :text-color="textColor"
          :fill="fill"
          :size="size"
          :min="min"
          :max="max"
          :disabled="disabled"
          @change="handleCheckedCitiesChange"
        >
          <template v-for="(option, i) in item.data">
            <el-checkbox-button
              v-if="onlyShowChecked ? value.includes(option[label]) : true"
              :label="option[label]"
              :key="i"
            >
              {{ option[text] }}
            </el-checkbox-button>
          </template>
        </el-checkbox-group>
      </div>
    </div>

    <div v-else>
      <el-checkbox-group
        v-if="showCheckAll && !onlyShowChecked"
        class="check-all"
        v-model="checkAll"
        :text-color="textColor"
        :fill="fill"
        :size="size"
        :disabled="disabled"
        @change="handleCheckAllChange"
      >
        <el-checkbox :indeterminate="isIndeterminate">{{ $t('repo.allSelect') }}</el-checkbox>
      </el-checkbox-group>
      <div v-for="item in optionData" :key="item.id">
        <span class="select-tag-group-title" v-if="group">{{ item.name }}</span>
        <el-checkbox-group
          v-if="!tagMode"
          v-model="selectedVal"
          :disabled="disabled"
          @change="handleCheckedCitiesChange"
        >
          <template v-for="(option, i) in item.data">
            <el-checkbox
              v-if="onlyShowChecked ? value.includes(option[label]) : true"
              :label="option[label]"
              :key="i"
            >
              {{ option[text] }}
            </el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/common/utils'

export default {
  name: 'select-tag',
  props: {
    tagMode: {
      // 是否开启tag模式 默认为checkbox模式
      type: Boolean,
      default: false
    },
    inline: {
      // tag模式设置全选是否内联 默认为不内联
      type: Boolean,
      default: false
    },
    group: {
      // 是否开启分组模式
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    label: {
      // 选中的值字段名
      type: String,
      default: 'dictItemValue'
    },
    text: {
      // 展示的文字字段名
      type: String,
      default: 'dictItemName'
    },
    groupId: {
      // 分组id字段名
      type: String,
      default: 'dictItemGroupCode'
    },
    groupName: {
      // 分组名称字段名
      type: String,
      default: 'dictItemGroupName'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onlyShowChecked: {
      type: Boolean,
      default: false
    },
    min: Number,
    max: Number,
    size: {
      type: String,
      default: 'small'
    },
    fill: {
      type: String,
      default: '#e9f0fa'
    },
    textColor: {
      type: String,
      default: '#2C6DD2'
    },
    showCheckAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      checkAll: false,
      isIndeterminate: false,
      optionData: []
    }
  },
  created() {
    this.selectedVal.length && this.handleCheckedCitiesChange(this.selectedVal)
  },
  watch: {
    options: {
      handler(newV) {
        this.optionData = this.normalizeData(newV)
      },
      deep: true,
      immediate: true
    },
    selectedVal(newV) {
      this.$emit('change', newV)
      this.checkAll = newV.length === this.options.length
    }
  },
  computed: {
    selectedVal: {
      get: function () {
        return this.value
      },
      set: function (e) {
        this.$emit('input', e)
      }
    },
    marginLeft() {
      return {
        '--button-medium-margin-left': this.locale == 'en' ? '120px' : '78px',
        '--button-small-margin-left': this.locale == 'en' ? '95px' : '58px'
      }
    }
  },
  methods: {
    /** 格式化分组数据 */
    normalizeData(data) {
      let newData = deepClone(data)
      let map = {},
        dest = []
      if (this.group) {
        newData.forEach((item, index) => {
          if (!map[item[this.groupId]]) {
            dest.push({
              id: item[this.groupId],
              name: item[this.groupName],
              checkAll: false,
              isIndeterminate: false,
              selectedVal: [],
              data: [item]
            })
            map[item[this.groupId]] = item
          } else {
            for (let i = 0; i < dest.length; i++) {
              let value = dest[i]
              if (value.id == item[this.groupId]) {
                value.data.push(item)
                break
              }
            }
          }
        })
      } else {
        dest.push({
          checkAll: false,
          isIndeterminate: false,
          selectedVal: [],
          data: data
        })
      }
      return dest
    },
    /** 全选按钮点击操作 */
    handleCheckAllChange(val) {
      this.selectedVal = val ? this.options.map(item => item[this.label]) : []
      this.isIndeterminate = false
    },
    /** checkbox点击操作 */
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.options.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length
    }
  }
}
</script>

<style lang="scss" scoped>
.select-tag-wrapper {
  position: relative;

  &.select-tag-inline .check-all.el-checkbox-group,
  &.select-tag-inline .check-all.el-checkbox {
    position: absolute;
    left: 0;
    top: 0;
  }

  &.select-tag-inline:not(.select-no-all) .el-checkbox-group:not(.check-all) {
    .el-checkbox-button--small:first-of-type {
      margin-left: var(--button-small-margin-left);
    }

    .el-checkbox-button--medium:first-of-type {
      margin-left: var(--button-medium-margin-left);
    }

    .el-checkbox:first-of-type {
      margin-left: 130px;
    }
  }

  .el-checkbox-button {
    margin: 0 10px 0 0;
  }

  :deep(.el-checkbox-button__inner) {
    border: 1px solid #c1c7d0;
    background: #fff;
    color: #c1c7d0;
    border-radius: 4px !important;
  }

  :deep(.el-checkbox-button--medium) .el-checkbox-button__inner {
    padding: 8px 19px;
  }

  .el-checkbox {
    width: 100px;
  }

  .select-tag-group-title {
    font-weight: bold;
  }
}
</style>
