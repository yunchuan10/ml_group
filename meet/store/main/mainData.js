// 数据状态存储

const mainData = {
  namespaced:true,
  state: {
    token: Vue.prototype.$ss.get(`${CON.cacheName}token`) || null, // token
    loginStatu: Vue.prototype.$ss.get(`${CON.cacheName}loginStatu`) || null, // 登录状态
    leftData: Vue.prototype.$ss.get(`${CON.cacheName}leftData`) || [], // 左侧树结构缓存
    currentRouter: '', // 当前路由
    leftCollapse: Vue.prototype.$ss.get(`${CON.cacheName}leftCollapse`) || false, // 左侧菜单收缩状态
    burningTime:[], // 自定义时长
    meetRoomName:[], // 会议室名称
    meetSelectBoard:Vue.prototype.$ss.get(`${CON.cacheName}meetSelectBoard`) || [], // 选中会议室看板
    roleMenuList: [], // 角色左侧菜单
  },
  mutations: {
    // token
    tokenMutations(state, data) {
      state.token = data;
    },
    // 登录状态
    loginStatuMutations(state, value) {
      state.loginStatu = value;
    },
    // 左侧树结构缓存
    leftDataMutations(state, value) {
      state.leftData = value;
    },
    // 当前路由
    currentRouterMutations(state, value) {
      state.currentRouter = value;
    },
    // 左侧菜单收缩状态
    leftCollapseMutations(state, value) {
      state.leftCollapse = value;
    },
    // 自定义时长
    burningTimeMutations(state,value){
      state.burningTime = value;
    },
    // 会议室名称
    meetRoomNameMutations(state,value){
      state.meetRoomName = value;
    },
    // 选中会议室看板
    meetSelectBoardMutations(state,value){
      state.meetSelectBoard = value;
    },
    // 角色左侧菜单
    roleMenuListMutations(state,value){
      state.roleMenuList = value;
    },
  },
  actions: {
    // token
    tokenActions({ commit }, value) {
      commit('tokenMutations', value);
      Vue.prototype.$ss.set(`${CON.cacheName}token`, value);
    },
    // 登录状态
    loginStatuActions({ commit }, value) {
      commit('loginStatuMutations', value);
      Vue.prototype.$ss.set(`${CON.cacheName}loginStatu`, value);
    },
    // 左侧树结构缓存
    leftDataActions({ commit }, value) {
      commit('leftDataMutations', value);
      Vue.prototype.$ss.set(`${CON.cacheName}leftData`, value);
    },
    // 左侧菜单收缩状态
    leftCollapseActions({ commit }, value) {
      commit('leftCollapseMutations', value);
      Vue.prototype.$ss.set(`${CON.cacheName}leftCollapse`, value);
    },
    // 自定义时长
    burningTimeActions({commit},value){
      commit('burningTimeMutations', value);
    },
    // 会议室名称
    meetRoomNameActions({commit},value){
      commit('meetRoomNameMutations', value);
    },
    // 选中会议室看板
    meetSelectBoardActions({commit},value){
      commit('meetSelectBoardMutations', value);
      Vue.prototype.$ss.set(`${CON.cacheName}meetSelectBoard`, value);
    },
    // 角色左侧菜单
    roleMenuListActions({commit},value){
      commit('roleMenuListMutations', value);
      Vue.prototype.$ss.set(`${CON.cacheName}roleMenuList`, value);
    },
  }
}

export default mainData;
