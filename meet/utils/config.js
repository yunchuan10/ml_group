/**
 * 公用常量
 */

const config = {
  cacheName: 'zkml_gov_meet_', // 缓存名称
  pageSizes: [10, 20, 50] // 分页-每页显示个数
}

export default {
  CON: config,
  install(Vue) {
    Vue.prototype.$CON = config;
  }
};
