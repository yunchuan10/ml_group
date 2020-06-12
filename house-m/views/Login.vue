<template>
  <div class="onlinecar-login" @keydown="$keydown($event, keydown)">
    <div class="m-content">
      <div class="g-login-banner">
        <img :src="loginLbg" width="800">
      </div>
      <div class="login-form-content">
        <form id="loginForm" class="loginForm">
          <span class="login-title">办公用房信息管理平台</span>
          <div class="msg-warn">欢迎登录</div>
          <div class="login-form f-relative">
            <label for="usename" class="for-label"></label>
            <input type="text" v-model="name" class="login-input" name="usename" @focus="inputFocusVal" placeholder="请输入用户名或手机号" /></div>
          <div class="login-form f-relative">
            <label for="usename" class="for-label pwd-label"></label>
            <input type="password" v-model="password" class="login-input" @focus="inputFocusVal" placeholder="请输入密码"></div>
          <span class="login-messages" v-show="inputFocus">{{messages}}</span>
          <input type="button" class="login-button" id="loginBtn" @click="login" :disabled="loginButtonValue != '登录'" :value="loginButtonValue">
          <div class="f-text-center">
            <!-- <el-checkbox v-model="rememberChecked" class="loginbtn-wj-pwd">记住密码</el-checkbox> -->
            <!-- <router-link to="/forget-password" class="f-forget">忘记密码？</router-link> -->
          </div>
        </form>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="dialogVisibleClick">
      <span>{{message}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleClick">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="dialogVisibleClick">确 定</el-button>
      </span>
    </el-dialog>
    <div class="backstretch">
      <img :src="loginBg">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputFocus: false,
      loginBg: require('../../public/static/images/login/gf-bg.png'),
      loginLbg: require('../../public/static/images/login/gf-left-img.png'),
      name: '', // 用户名或手机号
      password: '', // 密码
      verification: false, // 显示验证码
      loginValidCodeImg: '', // 验证码图片
      loginButtonValue: '登录', // 登录按钮文字
      rememberChecked: false, // 记住密码
      dialogVisible: false, // 操作提示框
      message: '', // 提示框消息内容
      messages: '', // 提示秘密账号是否正确
      loginValidCode: '', // 验证码输入框的值，默认为空
      ip: '', //用户登陆的ip地址
    }
  },
  created() {
    document.title = '公房';
  },
  activated() {
    this.topMenuList = [];
    this.dialogVisible = false;
    this.verification = false;
    this.loginButtonValue = '登录';
    this.getCheck(); // 勾选记住密码
    this.ip = '';
    // if (returnCitySN["cip"]) {
    //   this.ip = returnCitySN["cip"]
    // }
  },
  deactivated() {
    this.dialogVisible = false;
    this.verification = false;
  },
  methods: {
    getCheck() { // 是否勾选记住密码
      this.rememberChecked = false
      this.name = this.$getCookie('name');
      this.password = this.$getCookie('psd');
      if (this.name && this.password) this.rememberChecked = true;
    },
    login() { // 登录
      this.loginButtonValue = '登录中';
      if (!this.name) {
        this.tipShow('用户名不能为空！');
      } else if (!this.password) {
        this.tipShow('密码不能为空！');
      } else {
        let params = {
          username: this.name,
          password: this.$md5(this.password)
        }
        this.$axiosJsonPost(API.house_auth, params).then(res => {
          // this.$axiosPost(API.house_doLogin, params).then(res => {
          if (res.success === true) { // 登录成功
            this.$store.dispatch('tokenActions', res.data.token); // token
            this.$store.dispatch('oldTokenActions', res.data.oldToken); // 导出按钮用的值
            this.$store.commit('realNameMutations', res.data.realName);
            this.$store.commit('isMajorMutations', res.data.major);
            this.$store.commit('organNameMutations', res.data.currentOrgName);
            this.$store.dispatch('areaIdActions', res.data.currentOrgAreaId);
            // this.$store.commit('areaIdMutations', res.userInfoDTO.userOrganRelationList[0].organInfoBase.areaId);
            this.$store.commit('loginOrganIdMutations', res.data.orgIds);
            // this.getAreaName(res.data.areaId)
            this.setCookieInfo(); // 记住密码
            this.dialogVisibleClick(); // 清除
            this.deviceInformation();

            // this.
            this.$router.push({ path: '/homepage' });
          } else if (res.success === false) { // 登录成功
            this.tipShow(res.message);
            if (res.model.failcount >= 3) {
              this.verification = true;
            }
          } else {
            this.messages = res.message
            this.loginButtonValue = '登录';
            this.inputFocus = true;
          }
        });
      }
    },
    setCookieInfo() { // 记住密码
      let d = new Date();
      if (this.rememberChecked) {
        this.$setCookie('name', this.name, 5);
        this.$setCookie('psd', this.password, 5);
      } else {
        this.$setCookie('name', this.name, -1);
        this.$setCookie('psd', this.password, -1);
      }
    },
    tipShow(mes) { // 打开操作提示框
      this.message = mes;
      this.dialogVisible = true;
    },
    dialogVisibleClick() { // 关闭操作提示框
      this.loginButtonValue = '登录';
      this.dialogVisible = false;
    },
    keydown() {
      this.login();
    },
    deviceInformation() {
      let params = {
        loginEquipment: navigator.userAgent,
        ip: this.ip
      }
      this.$axiosPost(API.manageLog_addLoginLog, params).then(res => {

      });
    },
    inputFocusVal() {
      this.inputFocus = false;
    }
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
}
.g-login-banner {
  margin-top: 180px;
  float: left;
  width: 800px;
  height: 410px;
}
@media screen and (max-width: 1600px) {
   .g-login-banner {
      width: 600px;
      margin-left: 10%;
      img{
        width: 100%;
        height:auto;
      }
   }
}
.backstretch {
  left: 0px;
  top: 0px;
  overflow: hidden;
  height: 100%;
  width: 100%;
  z-index: -999999;
  position: fixed;
}
.backstretch img {
  width: 100%;
  height: 100%;
}
.onlinecar-login {
  height: 100%;
  width: 100%;
  .m-content {
    background-size: cover;
    height: 100%;
    margin: 0 auto;
    width: 1300px;
    .login-form-content {
      padding: 10px;
      border-radius: 4px;
      -webkit-border-radius: 4px;
      background: transparent;
      background-color: rgba(255, 255, 255, 0.5);
      float: right;
      margin: 235px 0 auto 15px;
      padding: 10px;
      .loginForm {
        width: 360px;
        height: auto;
        padding: 50px 30px 80px 30px;
        background-color: #fff;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        box-sizing: border-box;
      }
      .login-title {
        font-size: 28px;
        color: #1e75f0;
        text-align: left;
        font-weight: 600;
      }
      .msg-warn {
        text-align: left;
        padding: 10px 10px 10px 0;
        line-height: 18px;
        color: #4d5f83;
      }
      .for-label {
        position: absolute;
        top: 11px;
        left: 1px;
        background: url(../../public/static/images/login/yh-icon.png) 10px
          center no-repeat;
        background-size: 20px auto;
        width: 0;
        height: 40px;
        padding: 0 0 0 38px;
        overflow: hidden;
        z-index: 20;
      }
      .pwd-label {
        background: url(../../public/static/images/login/mm-icon.png) 10px
          center no-repeat;
        background-size: 20px auto;
      }
      input:-webkit-autofill,
      select:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset !important;
      }

      input {
        outline-color: invert;
        outline-style: none;
        outline-width: 0px;
        border: none;
        border-style: none;
        text-shadow: none;
        -webkit-appearance: none;
        -webkit-user-select: text;
        outline-color: transparent;
        box-shadow: none;
      }

      .login-input {
        box-sizing: border-box;
        width: 100%;
        border-radius: 3px;
        line-height: 16px;
        padding: 12px 0px 12px 40px;
        margin-top: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        color: #595959;
        vertical-align: middle;
      }
      .login-button {
        width: 100%;
        height: 45px;
        line-height: 45px;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        background: linear-gradient(to right, #379aff, #1e64f4);
        background: -moz-linear-gradient(
          right,
          #379aff 0%,
          #1e64f4 100%
        ); /* firefox */
        background: -webkit-linear-gradient(
          left,
          #379aff 0%,
          #1e64f4 100%
        ); /* chrome */
        background: -o-linear-gradient(
          right,
          #379aff 0%,
          #1e64f4 100%
        ); /* opera */
        background: -ms-linear-gradient(
          right,
          #379aff 0%,
          #1e64f4 100%
        ); /* ie */
        box-shadow: none;
        margin-top: 25px;
        color: #fff;
      }
      .f-text-center {
        font-size: 14px;
        margin-top: 10px;
        overflow: hidden;
        .f-remember {
          float: left;
        }
        .f-forget {
          float: right;
        }
      }
    }
  }
}
</style>