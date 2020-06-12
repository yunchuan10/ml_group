import Vue from 'vue';
import VueRouter from 'vue-router'; // 路由组件
import store from '@/store'; // Vuex
import routes from '@/router'; // 路由地址

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes
});

// 登录状态
const loginRouter = (to, from, next) => {
  // 未登录状态
  if (!store.state.mainData.loginStatu) {
    // 跳过登录页、忘记密码
    if (to.path === BUTILS.getUrl() || to.path === '/forget-password') {
      return '';
    } else {
      return BUTILS.getUrl();
    }
  } else {
    return '';
  }
};

/**
 * 路由拦截器
 */
router.beforeEach((to, from, next) => {
  // let path = loginRouter(to, from, next);
  // if (path === '') {
  //   // 返回首页时刷新左侧菜单动态
  //   if (to.path === '/home') {
  //     store.dispatch('defaultActiveActions', to.path);
  //   }
  next();
  // } else {
  //   window.location.href = path; // 跳转登录页
  // }
});

export default router;
