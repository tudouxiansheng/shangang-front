<template>
  <div class="strength-meter-bar-wrapper">
    <div class="strength-meter-bar">
      <div class="strength-meter-bar--fill" :data-score="getPasswordStrength.score"></div>
    </div>
    <span class="strength-meter-text" :data-score="getPasswordStrength.score">
      {{ getPasswordStrength.text }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'strength-meter',
  props: {
    password: {
      type: String,
      default: ''
    },
    minLength: {
      type: Number,
      default: 8
    }
  },
  computed: {
    getPasswordStrength() {
      let score = this.password ? this.checkPwdStrength(this.password) : 0
      let text =
        score === 1
          ? this.$t('changePwd.risk')
          : score === 2
          ? this.$t('changePwd.weak')
          : score === 3
          ? this.$t('changePwd.middle')
          : score === 4
          ? this.$t('changePwd.powerful')
          : ''
      return {
        score,
        text
      }
    }
  },
  methods: {
    /**
     * 密码强度检测
     */
    checkPwdStrength(pwd) {
      let score = 0
      let isaz = /[a-z]/.test(pwd),
        isAZ = /[A-Z]/.test(pwd),
        isNum = /[0-9]/.test(pwd),
        isChat = /[^a-zA-Z0-9]/.test(pwd)
      if (pwd.length < this.minLength) {
        score = 1
      } else {
        score = isaz + isAZ + isNum + isChat
      }
      return score
    }
  }
}
</script>

<style scoped lang="scss">
.strength-meter-bar-wrapper {
  display: flex;
  align-items: center;
  .strength-meter-bar {
    flex: 1 1 0;
    background-color: #d1d5db;
    position: relative;
    height: 6px;
    border-radius: 6px;
    margin: 8px 0;
    &::before,
    &::after {
      position: absolute;
      z-index: 10;
      display: block;
      box-sizing: border-box;
      width: 25%;
      height: inherit;
      border-color: #ffffff;
      background-color: transparent;
      border-style: solid;
      border-width: 0 5px;
      content: '';
    }
    &::before {
      left: 25%;
      border-width: 0 2.5px 0 5px;
    }
    &::after {
      right: 25%;
      border-width: 0 5px 0 2.5px;
    }
    &--fill {
      position: absolute;
      width: 0;
      height: inherit;
      background-color: transparent;
      border-radius: inherit;
      transition: width 0.5s ease-in-out, background 0.25s;
      &[data-score='1'] {
        width: 25%;
        background-color: #ed6f6f;
      }
      &[data-score='2'] {
        width: 50%;
        background-color: #efbd47;
      }
      &[data-score='3'] {
        width: 75%;
        background-color: darken(#55d187, 10%);
      }
      &[data-score='4'] {
        width: 100%;
        background-color: #55d187;
      }
    }
  }
  .strength-meter-text {
    font-size: 12px;
    line-height: 24px;
    padding: 0 5px;
    &[data-score='1'] {
      color: #ed6f6f;
    }
    &[data-score='2'] {
      color: #efbd47;
    }
    &[data-score='3'] {
      color: darken(#55d187, 10%);
    }
    &[data-score='4'] {
      color: #55d187;
    }
  }
}
</style>
