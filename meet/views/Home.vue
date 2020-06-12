<template>
  <div id="main-default" :class="cssName">
    <y-header class="g-head" :class="collapse ? 'g-head-bar': ''" :loginStatu="loginStatu" :debug="debug" :roleMenuList="toRoleMenuList"></y-header>
    <y-left :defaultActive="defaultActive" class="g-left" :class="collapse ? 'g-left-bar': ''"  v-model="collapse" :loginStatu="loginStatu" :roleMenuList="toRoleMenuList"></y-left>
    <div class="g-content" :class="collapse ? 'g-main-bar': ''">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view class="g-main"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      defaultActive: this.$route.path,
      cssName: 'main-default',
      collapse: false, // 左侧菜单默认展示
      // loginStatu: null, // 登录信息
      ipPort: 'http://10.5.4.236:4903', // 外部文件地址
      debug: process.env.NODE_ENV === 'production', // 判断生产环境还是开发环境
      toRoleMenuList:[],
    };
  },
  computed: {
    ...mapState('mainData', [
      'loginStatu',
      'roleMenuList',
    ])
  },
  activated() {
    this.defaultActive = this.$route.path;
    this.getToken();
    this.getLeftCollapse();
    this.getRoleMenuList();
    // this.userRequest();
    this.ipPort = 'http://localhost:8089';
    // this.getSkin('a');
    // this.geti18n('en');
    // console.log('roleMenuList',this.roleMenuList)
  },
  watch: {
    // roleMenuList(){
    //   // console.log('roleMenuList')
    // }
  },
  methods: {
    // 获取token
    getToken() {
      if (this.$route.query.token) {
        this.$store.dispatch('tokenActions', this.$route.query.token); // token
      }
    },
    // 获取左侧菜单收缩状态
    getLeftCollapse() {
      this.collapse = this.$store.state.mainData.leftCollapse || false;
    },

    // 获取用户信息
    // userRequest() {
    //   this.$axiosGet(API.currentBase_getUser, {}).then(res => {
    //     document.title = res.model.organName || '';
    //     this.loginStatu = res.model;
    //     this.$store.dispatch('loginStatuActions', res.model);
    //     // this.$store.commit('realNameMutations', res.model.userRealName);
    //     // this.$store.commit('organNameMutations', res.model.organName);
    //     // this.$store.commit('organIdMutations', res.model.organId);
    //     // this.$store.commit('userIdMutations', res.model.userId);
    //   });
    // },

    // 获取左侧菜单数据
    getRoleMenuList(){

      if( this.roleMenuList && this.roleMenuList.length>0 ){
        this.toRoleMenuList = this.roleMenuList;
      }else{
        this.$axiosGet(API.sysMenu_getLoginUserMenuTree, {}).then(res => {
          if(res.status === 200){
            this.toRoleMenuList = res.data || [];
            let roleMenuList = this.toRoleMenuList;
            if( roleMenuList && roleMenuList.length>0 ){
              let res = roleMenuList.some( role => (role.res=='0') );
              if( !res  && ( this.$route.fullPath=='/' || this.$route.fullPath == '/home' ) ){
                this.$router.replace('/meet-service/conference-service')
              }
            }

          }
        });
      }

    },

    // 获取皮肤
    getSkin(name) {
      let url = `${this.ipPort}/meet-ui/css/${name}.css`;
      this.$loadCss(url).then(res => {
        if (res === 'success') {
          this.cssName = `main-${name}`;
        }
      })
    },
    // 获取语言包
    geti18n(name) {
      let url = `${this.ipPort}/meet-ui/locale/meet-${name}.umd.min.js`;
      this.$loadJs(url).then(res => {
        if (res === 'success') {
          let messages = {};
          for (let i = 0, len = meetI18n.length; i < len; i++) {
            if (name === meetI18n[i].name) {
              messages = meetI18n[i].value;
              break;
            }
          }
          $i18n.setLocaleMessage(name, messages);
          $i18n.locale = name;
        }
      })
    }
  },
  mounted() {
    
  }
};
</script>

<style lang="scss" scoped>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-5px);
}
.fade-transform-leave-to {
  opacity: 0.1;
  transform: translateX(0px);
}
</style>
