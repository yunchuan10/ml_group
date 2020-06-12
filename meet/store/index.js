/**
 * Vuex 状态管理
 */

import mainData from '@/store/main/mainData'; // 主数据
import imgPath from '@/store/main/imgPath'; // 图标
import searchTableListBol from '@/store/main/searchTableListBol'; // 表格列筛选
import testData from '@/store/main/testData'; // 表格列筛选

export default new Vuex.Store({
  modules: {
    mainData,
    imgPath,
    searchTableListBol,
    testData,
  }
});
