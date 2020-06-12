<template>
  <div class="onlinecar-login" @keydown="$keydown($event, keydown)">
    <div class="m-content">
      <div class="login-form-content">
        <form id="loginForm">
          <span style="font-size: 32px;color: #5f6468;">开发者登录页</span>
          <p class="word">账号</p>
          <input type="text" v-model="name" class="text" placeholder="请输入用户名或手机号">
          <p class="word">密码</p>
          <input type="password" v-model="password" class="text" placeholder="请输入密码">
          <input type="button" class="login-button" @click="login" :disabled="loginButtonValue != '登录'" :value="loginButtonValue" />
          <div class="f-text-center">
            <el-checkbox v-model="rememberChecked" class="f-remember">记住密码</el-checkbox>
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '', // 用户名或手机号
      password: '', // 密码
      verification: false, // 显示验证码
      loginValidCodeImg: '', // 验证码图片
      loginButtonValue: '登录', // 登录按钮文字
      rememberChecked: false, // 记住密码
      dialogVisible: false, // 操作提示框
      message: '', // 提示框消息内容
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
    if (returnCitySN["cip"]) {
      this.ip = returnCitySN["cip"]
    }
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
          password: this.password
        }
        this.$axiosJsonPost(API.house_auth, params).then(res => {
          // this.$axiosPost(API.house_doLogin, params).then(res => {
          if (res.success) { // 登录成功
            this.$store.dispatch('tokenActions', res.data.token); // token
            this.$store.commit('realNameMutations', res.data.realName);
            this.$store.commit('isMajorMutations', res.data.major);
            this.$store.commit('organNameMutations', res.data.currentOrgName);
            this.$store.dispatch('areaIdActions', res.data.currentOrgAreaId);
            // this.$store.commit('areaIdMutations', res.userInfoDTO.userOrganRelationList[0].organInfoBase.areaId);
            this.$store.commit('loginOrganIdMutations', res.data.orgIds);
            this.setCookieInfo(); // 记住密码
            this.dialogVisibleClick(); // 清除
            this.deviceInformation();
            // this.
            this.$router.push({ path: '/general-overview/query-company-list/addressnum' });
          } else if (res.result === 'fail') { // 登录成功
            this.tipShow(res.message);
            if (res.model.failcount >= 3) {
              this.verification = true;
            }
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
      this.$axiosPost(API.userLog_addLoginLog, params).then(res => {
      });
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
.onlinecar-login {
  background-color: #2c6dd9;
  height: 100%;
  width: 100%;
  .m-content {
    background: url(../../public/static/images/img_banner.png) left top
      no-repeat;
    background-size: cover;
    height: 100%;
    margin: 0 auto;
    width: 1300px;
    .login-form-content {
      background-color: #ffffff;
      border-radius: 6px;
      float: right;
      height: 400px;
      margin-top: 100px;
      padding: 50px 35px 50px 30px;
      width: 340px;
      .word {
        color: #5f6468;
        margin-top: 40px;
      }
      .text {
        background: #f2f2f2;
        border: none;
        height: 40px;
        line-height: 40px;
        margin: 0;
        padding-left: 10px;
        width: 335px;
      }
      .u-verification {
        margin: 20px 0 5px;
        input {
          width: 100px;
        }
        .imageCaptcha {
          display: inline-block;
          height: 38px;
          margin-left: 10px;
          width: 80px;
          img {
            height: 38px;
            vertical-align: middle;
            width: 80px;
          }
        }
        .f-next {
          margin-left: 30px;
          &:hover {
            color: #23527c;
            text-decoration: underline;
          }
          &:focus {
            color: #333333;
          }
        }
      }
      .login-button {
        background: #f4bd37;
        border: none;
        border-radius: 4px;
        color: #ffffff;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        margin-top: 20px;
        text-align: center;
        width: 335px;
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
