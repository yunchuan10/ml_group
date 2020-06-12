<template>
  <div class="zkml-login" @keyup.enter="login">
    <div class="m-content f-clearfix">
      <div class="login-banner"></div>
      <div class="login-form-content">
        <i class="login-icon"></i>
        <form class="loginForm">
          <p class="login-title">中科美络公务接待平台</p>
          <p class="login-title-en">Zhongke meiluo intelligent meeting management platform</p>
          <p class="login-word">账号</p>
          <div class="input-item input-item-user">
            <input
              class="login-text"
              type="text"
              ref="name"
              v-model="name"
              placeholder="请输入用户名或手机号"
            />
          </div>
          <p class="login-word">密码</p>
          <div class="input-item input-item-password">
            <input
              class="login-text"
              type="password"
              ref="password"
              v-model="password"
              placeholder="请输入密码"
            />
          </div>
          <div v-if="verification" class="login-verification">
            <input
              class="login-verification-text"
              type="text"
              v-model="loginValidCode"
              placeholder="验证码"
            />
            <span class="login-verification-imageCaptcha">
              <img :src="loginValidCodeImg" />
            </span>
            <a class="login-verification-next" href="javascript:;" @click="yzmChange">换一张</a>
          </div>
          <el-button
            class="login-button"
            type="primary"
            :loading="loginButtonValue"
            @click="login"
          >{{loginButtonValue?'登录中':'登录'}}</el-button>
          <div class="login-bottom">
            <el-checkbox class="login-remember" v-model="rememberChecked">记住密码</el-checkbox>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions,mapMutations } from "vuex";
import baseUtils from '@/utils/baseUtils'; // 底层工具包
const ss = baseUtils.ss;
const ls = baseUtils.ls;

export default {
  data() {
    return {
      name: "", // 用户名或手机号
      password: "", // 密码
      loginValidCode: "", // 验证码输入框的值，默认为空
      verification: false, // 显示验证码
      loginValidCodeImg: "", // 验证码图片
      loginButtonValue: false, // 登录按钮状态
      rememberChecked: false // 记住密码
    };
  },
  created() {
    document.title = "中科美络公务接待管理平台";
    this.getCheck(); // 勾选记住密码
    this.verification = false; // 默认不显示验证码
    this.loginButtonValue = false; // 登录按钮状态
  },
  activated() {},
  methods: {
    ...mapActions("mainData", [
      "loginStatuActions",
      "tokenActions",
    ]),
    ...mapMutations("mainData", [
      "roleMenuListMutations",
    ]),
    // 是否勾选记住密码
    getCheck() {
      this.rememberChecked = false;
      this.name = this.$getCookie("name");
      this.password = this.$base64.decode(this.$getCookie("psd"));
      this.password = this.password.substr(20);
      if (this.name && this.password) this.rememberChecked = true;
    },
    // 登录
    login() {
      if (!this.name) {
        this.$message({
          message: "用户名不能为空！",
          type: 'warning'
        });
      } else if (!this.password) {
        // this.$YTips("密码不能为空！");
        this.$message({
          message: "密码不能为空！",
          type: 'warning'
        });
      } else {
        this.loginButtonValue = true;
        let params = {
          username: this.name,
          password: this.$md5(this.password)
        };
        this.$refs.name.blur();
        this.$refs.password.blur();

        this.$axiosJsonPost(API.reception_doLogin, params).then(res => {
          this.loginButtonValue = false;
          // if (res.code === 'success') {
          if (res.success) {
            // 登录成功
            this.$store.dispatch('loginStatuActions',res.data);
            this.$store.commit('loginStatu',res.data);
            this.$store.commit('tokenMutations',res.data.token);
            ss.setItem('token', res.data.token);
            this.setCookieInfo(); // 记住密码

            this.$router.push({ path: "/" });

            // this.$axiosGet(API.sysMenu_getLoginUserMenuTree, {}).then(res => {
            //   if(res.status === 200){
            //     this.roleMenuListMutations( res.data )
            //   }
            // }).catch(err=>{

            // }).finally( () => {
            //   this.$router.push({ path: "/" });
            // });

          } else {
            // 登录失败
            this.$message({
              message: res.message || "暂时无法登陆！",
              type: 'warning'
            });
  
          }
        });
      }
    },
    // 记住密码
    setCookieInfo() {
      if (this.rememberChecked) {
        this.$setCookie("name", this.name, 5);
        this.$setCookie(
          "psd",
          this.$base64.encode(`${this.$getUUID()}${this.password}`),
          5
        );
      } else {
        this.$setCookie("name", this.name, -1);
        this.$setCookie(
          "psd",
          this.$base64.encode(`${this.$getUUID()}${this.password}`),
          -1
        );
      }
    },
    // 切换验证码
    yzmChange() {
      this.loginValidCodeImg = "";
      setTimeout(() => {
        this.loginValidCodeImg = API.jcaptcha_jpeg_imageCaptcha;
      }, 0);
    }
  }
};
</script>

<style scoped src="@/assets/css/login.css"></style>










