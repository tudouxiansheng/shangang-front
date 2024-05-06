<template>
  <div style="width: 100%">
    <el-input
      class="pwd-input"
      ref="pwd-input"
      key="pwd-input"
      :size="size"
      :type="getIptType"
      autocomplete="off"
      :model-value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
    >
      <slot name="prefix"></slot>
      <i v-if="(showAble && permCode) || (showAble && hasPermission)" name="suffix">
        <img :class="['suffix-img']" :src="getImgSrc" />
      </i>

      <slot name="suffix"></slot>
    </el-input>
    <strength-meter
      v-if="strength && isEnable"
      :password="modelValue"
      :minLength="minLength"
      class="password"
    ></strength-meter>
  </div>
</template>

<script>
import { permissions } from '@/utils/common/permissions'
import StrengthMeter from '@/components/strength-meter'
import complex from '@/mixin/complex'
export default {
  mixins: [complex],
  name: 'PwdInput',
  props: {
    size: {
      type: String,
      default: 'small',
      validator: value => {
        const methodTypes = ['large', 'medium', 'small', 'mini']
        const valid = methodTypes.indexOf(value) !== -1
        if (!valid) {
          throw new Error(`size must be one of large / medium / small / mini`)
        }
        return valid
      }
    },
    showAble: {
      type: Boolean,
      default: false
    },
    permCode: {
      default: ''
    },
    strength: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  components: {
    StrengthMeter
  },
  data() {
    return {
      showPassword: false,
      img1: require('@/assets/img/common/EYE3.png'),
      img2: require('@/assets/img/common/eye.png'),
      hasPermission: false
    }
  },
  computed: {
    getImgSrc() {
      return this.showPassword ? this.img2 : this.img1
    },
    getIptType() {
      return this.showPassword ? 'text' : 'password'
    }
  },
  async created() {
    await this.getPermission()
    this.strength && (await this.getComplexity_rules())
  },
  methods: {
    async getPermission() {
      if (this.permCode != '') {
        this.hasPermission = await permissions(this.permCode)
      }
    },
    handleInput($event) {
      this.$emit('update:modelValue', $event)
    },
    handleFalse(e) {
      e.preventDefault()
      return false
    },
    handleShow() {
      this.showPassword = true
    },
    handleHide() {
      this.showPassword = false
    }
  }
}
</script>

<style lang="scss" scoped>
.pwd-input {
  .suffix-img {
    cursor: pointer;
    width: 20px;
    height: 20px;
    position: absolute;
    right: 2px;
    top: 8px;
  }
}
</style>
