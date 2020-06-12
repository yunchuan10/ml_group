/**
 * 跳转页面数据传递
 */
import baseUtils from '@/utils/baseUtils' // 底层工具包
const ls = baseUtils.ls

const jumpModules = {
  state: { // 唯一数据源
    carId: ls.getItem('carIdMutations') || ''
  },
  mutations: { // 修改数据
    carIdMutations(state, value) { // 车辆主键
      state.carId = value
    }
  },
  actions: { // 数据异步处理
    carIdActions({
      commit
    }, value) { // 车辆主键
      commit('carIdMutations', value)
      ls.setItem('carIdMutations', value)
    }
  }
}

export default jumpModules