import App from '@/App.vue';
import '@/utils/'; // 基础工具包
import '@/api/'; // 接口文件
import router from '@/router/'; // 路由文件
import store from '@/store/'; // Vuex文件
import '@/utils/'; // 基础工具包
import i18n from '@/utils/i18n/'; // 国际化插件
import basicComponent from '@/assembly/basic-component/'; // 平台基础组件
import Viewer from 'v-viewer'; // 图片查看插件
import 'viewerjs/dist/viewer.css'; // 图片查看插件样式

import md5 from 'js-md5';
import base64 from 'js-base64';

Vue.prototype.$md5 = md5;
Vue.prototype.$base64 = base64.Base64;

Vue.use(basicComponent);
Vue.use(Viewer, {
  // 图片查看插件配置
  defaultOptions: {
    zIndex: 9999
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
