import Vue from "vue";
import Vuex from "vuex";
import mainData from '@/store/mainData'; // 主数据
import imgPath from '@/store/imgPath'; // 图标
import jumpModules from '@/store/jumpModules'; // 跳转页面数据传递
import searchTableListBol from '@/store/searchTableListBol'; // 表格选择字段

Vue.use(Vuex);

export default new Vuex.Store({
  externals: {
    echarts: "echarts"
  },
  modules: {
    mainData,
    imgPath,
    jumpModules,
    searchTableListBol
  }
});
