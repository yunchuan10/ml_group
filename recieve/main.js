import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/index.js';
import store from '@/store'; // Vuex
import VueResouse from 'vue-resource'; // 旧接口请求
import jsonHttp from '@/utils/jsonHttp'; // 接口请求
import api from '@/utils/api'; // 接口地址
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import "@/assets/css/dialog.css"; // 修改dialog样式
import '@/utils/filter.js'; // 过滤器
import '@/lib/iconfont.js';
import '@/lib/iconfont.css';
import '@/lib/menufont.css';
import utils from '@/utils/utils'; // 基础工具包
import baseUtils from '@/utils/baseUtils'; // 底层工具包
import assemblyComponents from '@/assembly'; // 自定义组件
import formatGMT from '@/utils/formatGMT'; // 日期格式转换
import dateFormat from '@/utils/dateFormat'; // 日期格式转换
import echarts from 'echarts'; // echarts引入
import Viewer from 'v-viewer'; // 图片查看插件
import 'viewerjs/dist/viewer.css'; // 图片查看插件样式

import md5 from 'js-md5';
import base64 from 'js-base64';

Vue.prototype.$md5 = md5;
Vue.prototype.$base64 = base64.Base64;

Vue.use(VueResouse);
Vue.use(jsonHttp);
Vue.use(ElementUI);
Vue.use(utils);
Vue.use(assemblyComponents);
Vue.use(Viewer, {
  // 图片查看插件配置
  defaultOptions: {
    zIndex: 9999
  }
});

require("@/utils/httpInterceptor"); // 接口拦截器

global.BUTILS = baseUtils;
global.API = api;
global.FORMATGET = formatGMT;
global.DATE = dateFormat;
global.echarts = echarts;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');


