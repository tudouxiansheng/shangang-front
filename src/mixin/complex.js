import { getPasswordComplex } from '@/utils/api'
// 密码检验规则
var complex = {
  data() {
    return {
      //密码复杂度校验是否开启
      isEnable: 0,
      // 密码最小长度
      minLength: 0,
      rulesLength: [],
      // 首次登录修改密码是否开启
      modifyOnFirstLogin: 0,
      rulesPassword: null,
    }
  },

  methods: {
    /*
     * 获取系统密码配置
     * */
    async getComplexity_rules() {
      const res = getPasswordComplex({})
      if (res.resultCode == 0) {
        this.isEnable = res.isEnable
        this.modifyOnFirstLogin = res.modifyOnFirstLogin
        //新的密码规则校验规则生成
        this.minLength = res.isEnable === 1 ? res.minLength : 8
        this.rulesPassword = res.complexity
        this.rulesLength = this.getComplex(res)
      }
    },
    /**
     * 生成密码校验规则提示
     */
    getComplex(res) {
      let rulesLength = []
      let inDex = res.minLength ? 2 : 1
      for (let i = 0; i < Object.keys(res.complexity).length; i++) {
        const objKey = Object.keys(res.complexity)[i],
          objVal = Object.values(res.complexity)[i]
        if (objKey == 'containsUppercase' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule: this.$t('changePwd.mustCaps'),
          })
        } else if (objKey == 'containsLowercase' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule: this.$t('changePwd.mustLower'),
          })
        } else if (objKey == 'containsDigital' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule: this.$t('changePwd.mustNum'),
          })
        } else if (objKey == 'containsSpecialCharacters' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule:
              this.$t('changePwd.mustSpecial') +
              "([ _`~!@#$%^&*()+=|{}':;,\\[\\].<>/?！￥…（）—【】‘；：”“’。，、？]|\n|\r|\t)",
          })
        } else if (objKey == 'containsNoRepeatLetter' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule: this.$t('changePwd.cantThreeRepeat'),
          })
        } else if (objKey == 'containsNoKeyboardRepeatLetter' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule: this.$t('changePwd.cantThreeKeyBoard'),
          })
        } else if (objKey == 'containsNoAccount' && objVal == 1) {
          rulesLength.push({
            inDex,
            rule: this.$t('changePwd.cantAcc'),
          })
        }
        inDex = inDex + 1
      }
      return rulesLength
    },

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
    },
  },
}

export default complex
