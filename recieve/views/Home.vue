<template>
  <div id="main-default" class="main-default">
    <v-header class="g-head" :realname="realname" :propertyOrganName="propertyOrganName"></v-header>
    <div class="g-content f-clearfix">
      <v-left class="g-left" :class="collapse ? 'g-left-bar': ''" v-model="collapse"></v-left>
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <router-view class="g-main" :class="collapse ? 'g-main-bar': ''"></router-view>
        </keep-alive>
      </transition>
    </div>
    <v-footer class="g-foot" v-if="typeFlag == 'type'"></v-footer>
  </div>
</template>

<script>
import header from '@/components/main/header';
import left from '@/components/main/left';
import footer from '@/components/main/footer';

export default {
  data() {
    return {
      typeFlag: '',
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
    'v-left': left,
    'v-footer': footer
  },
  activated() {
    this.typeFlag = '';
    if (this.$route.query.type == 'famous') {
      this.typeFlag = 'type';
    } else {
      this.typeFlag = '';
    }
    this.DataRequest();
    if (this.$route.query.token) {
      this.$store.dispatch('tokenActions', this.$route.query.token); // token
    }
  },
  methods: {
    DataRequest() {
      // let params = {};
      // this.$axiosPost(API.reception_userInfo, params).then(res => {
      // });
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
