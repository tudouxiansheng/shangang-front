import {
  getPasswordComplex
} from "./api";
import i18n from "@/i18n/";

export async function getComplexity_complex() {
  let res = await getPasswordComplex({})
  if (res.resultCode == 0) {
    if (res.minLength) {
      // console.log(res.minLength)
      return res.minLength;
    }
  }
}

export async function getComplexity_rules() {
  let res = await getPasswordComplex({})
  if (res.resultCode == 0) {
    if (res.minLength) {
      //新的密码规则校验规则生成
      let rulesLength = [];
      let inDex = 2;
      // console.log(res.complexity)
      // console.log(Object.keys(res.complexity).length)
      for (let i = 0; i < Object.keys(res.complexity).length; i++) {
        if (
          Object.keys(res.complexity)[i] == "containsUppercase" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule = i18n.t("changePwd.mustCaps");
          rulesLength.push(obj);
        } else if (
          Object.keys(res.complexity)[i] == "containsLowercase" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule = i18n.t("changePwd.mustLower");
          rulesLength.push(obj);
        } else if (
          Object.keys(res.complexity)[i] == "containsDigital" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule = i18n.t("changePwd.mustNum");
          rulesLength.push(obj);
        } else if (
          Object.keys(res.complexity)[i] == "containsSpecialCharacters" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule =
            i18n.t("changePwd.mustSpecial") +
            "([ _`~!@#$%^&*()+=|{}':;,\\[\\].<>/?！￥…（）—【】‘；：”“’。，、？]|\n|\r|\t)";
          rulesLength.push(obj);
        } else if (
          Object.keys(res.complexity)[i] == "containsNoRepeatLetter" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule = i18n.t("changePwd.cantThreeRepeat");
          rulesLength.push(obj);
        } else if (
          Object.keys(res.complexity)[i] ==
          "containsNoKeyboardRepeatLetter" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule = i18n.t("changePwd.cantThreeKeyBoard");
          rulesLength.push(obj);
        } else if (
          Object.keys(res.complexity)[i] == "containsNoAccount" &&
          Object.values(res.complexity)[i] == 1
        ) {
          let obj = {};
          obj.inDex = inDex;
          inDex = inDex + 1;
          obj.rule = i18n.t("changePwd.cantAcc");
          rulesLength.push(obj);
        }
      }
      // console.log(rulesLength)
      return rulesLength
    }
  }
}
