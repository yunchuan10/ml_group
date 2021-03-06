import Vue from 'vue';
import App from '@/App.vue';
import router from '@/utils/routerInterceptor';
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
import utils from '@/utils/utils'; // 基础工具包
import baseUtils from '@/utils/baseUtils'; // 底层工具包
import assemblyComponents from '@/assembly'; // 自定义组件
import formatGMT from '@/utils/formatGMT'; // 日期格式转换
import dateFormat from '@/utils/dateFormat'; // 日期格式转换
import echarts from 'echarts'; // echarts引入
import Viewer from 'v-viewer'; // 图片查看插件
import 'viewerjs/dist/viewer.css'; // 图片查看插件样式
import buryingPoint from '@/utils/buryingPoint'; // 埋点
import EVueContextmenu from 'e-vue-contextmenu'; //画布右键插件
import md5 from 'js-md5'; //登录密码加密

// import BaiduMap from 'vue-baidu-map'
// import {
//   BmlMarkerClusterer
// } from 'vue-baidu-map'

// Vue.use(BaiduMap, {
//   // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//   ak: '53m98SAj8hztsGODp4jETAqnDGIhl5vy'
// })

Vue.use(Viewer, {
  // 图片查看插件配置
  defaultOptions: {
    zIndex: 9999
  }
});
// Vue.component('bml-marker-cluster', BmlMarkerClusterer)

Vue.use(VueResouse);
Vue.use(jsonHttp);
Vue.use(ElementUI);
Vue.use(utils);
Vue.use(assemblyComponents);
Vue.use(EVueContextmenu)

require('@/utils/httpInterceptor'); // 接口拦截器

global.BUTILS = baseUtils;
global.API = api;
global.FORMATGET = formatGMT;
global.DATEFORMAT = dateFormat;
global.echarts = echarts;
global.BURYINGPOINT = buryingPoint;
Vue.prototype.$md5 = md5;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');