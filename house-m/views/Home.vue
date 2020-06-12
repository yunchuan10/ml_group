<template>
  <div id="main-default" class="main-default">
    <v-header class="g-head" :realname="realname" :propertyOrganName="propertyOrganName"></v-header>
    <div class="g-content" v-if="this.$route.path != '/homepage'">
      <v-left v-if="(jurisdiction!='error') && (this.$route.path !='/homepage')" class="g-left" :class="collapse ? 'g-left-bar': ''" v-model="collapse"></v-left>
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view class="g-main" :class="collapse ? 'g-main-bar': ''"></router-view>
        </keep-alive>
      </transition>
    </div>
    <div class="g-content" v-if="this.$route.path === '/homepage'">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view :class="collapse ? 'g-main-bar': ''"></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import header from '@/components/main/header';
import left from '@/components/main/left';

export default {
  data() {
    return {
      jurisdiction: '',//权限判断
      Tips: '',//提示语
      collapse: false, // 左侧菜单默认展示
      realname: '',
      propertyOrganName: '',
      count: 0, // 报警信息
      instance: null, // 报警右下角弹出框
      isCustomerService: '', // 是否客服标识
      isMajor: '' // 是否管理员标识
    };
  },
  components: {
    'v-header': header,
    'v-left': left
  },
  computed: {
    navId() {
      return this.$store.state.mainData.navId;
    },
  },
  watch: {
    navId(val) {
      this.menuRequest();
    },
  },
  activated() {
    // this.DataRequest();
    this.menuRequest()

    if (this.$route.query.token) {
      this.$store.dispatch('tokenActions', this.$route.query.token); // token
    }
  },
  methods: {
    DataRequest() {
      // let params = {};
      // this.$axiosPost(API.house_userInfo, params).then(res => {
      // });
    },
    menuRequest() {
      let params = {
        projectCode: 'HOUSE-ADMIN',
        id: this.navId,
        type: 'LEFT'
      }
      this.$axiosGet(API.resources_getResources, params).then(res => {
        this.jurisdiction = res.result;
        if (this.jurisdiction == 'error') {
          this.Tips = res.message;
          this.$router.push({ path: '/jurisdiction', query: { Tips: this.Tips } })
        }
      })
    },
  }
  // watch: {
  //   collapse: function (val) {
  //     this.$store.dispatch('isCollapseActions', val);
  //   }
  // }
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
