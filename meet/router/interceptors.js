/**
 * 路由拦截器
 */

import store from '@/store/'; // Vuex文件

const interceptorsRouter = (to, from, next) => {

  let roleMenuList = store.state.mainData.roleMenuList || [];
  if( roleMenuList && roleMenuList.length>0 ){
    let res = roleMenuList.some( role => (role.res=='0') );
    if( !res  && ( to.fullPath=='/' || to.fullPath == '/home' ) ){
      next({
        path: '/meet-service/conference-service',
      });
      return;
    }
  }

  Vue.prototype.$interceptorsRouter(to, from, next, store);
}

export default interceptorsRouter;