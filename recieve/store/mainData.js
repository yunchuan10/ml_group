import baseUtils from '@/utils/baseUtils'; // 底层工具包
const ss = baseUtils.ss;
const ls = baseUtils.ls;

// Vuex存储登录状态
const store = {
  state: {
    isCollapse: ls.getItem('ZKML_onlinecar_isCollapse') === 'true' || false, // 菜单栏是否折叠
    routerTitle: ss.getItem('routerTitle') || {}, // 账号路由
    defaultActive: ss.getItem('defaultActive') || '/home', // 保存选中路由
    loginStatu: JSON.parse(ss.getItem('LOGINSTATU')||"{}") || {}, // 登录状态，默认否
    menuStatu: ss.getItem('menuStatu') || '', // 选择的一级菜单
    uploadProgress: 0, // 上传进度条
    token: ss.getItem('token') || '',
    courtyardId: ss.getItem('courtyardId') || '', // 综合查询院落Id
    navJump: ss.getItem('navJump'), // 主题类型
    themeInfo: ss.getItem('themeInfo'), // 主题信息

    roleMenuList: [], // 角色左侧菜单

    fileBeforeUrl: 'http://10.5.4.60:41002'

  },
  // 方法
  mutations: {
    navJump(state, data) {
      state.navJump = data;
    },
    themeInfo(state, data) {
      state.themeInfo = data;
    },
    isCollapseMutations(state, value) {
      // 修改菜单栏折叠
      state.isCollapse = value;
    },
    defaultActiveMutations(state, value) {
      // 保存选中路由
      state.defaultActive = value;
    },
    // 账号路由
    routerTitle(state, data) {
      state.routerTitle = data;
    },
    // 登录状态
    loginStatu(state, data) {
      state.loginStatu = data;
    },
    // 选择的一级菜单
    menuStatu(state, data) {
      state.loginStatu = data;
    },
    // 上传进度
    uploadProgressMutations(state, data) {
      state.uploadProgress = data;
    },
    tokenMutations(state, data) {
      state.token = data;
    },
    courtyardIdMutations(state, data) {
      state.courtyardId = data;
    },

    // 角色左侧菜单
    roleMenuListMutations(state,value){
      // state.roleMenuList = value;
    },


  },
  actions: {
    // 修改菜单栏是否折叠
    isCollapseActions({ commit }, value) {
      commit('isCollapseMutations', value);
      ls.setItem('ZKML_onlinecar_isCollapse', value);
    },
    // 保存选中路由
    defaultActiveActions({ commit }, value) {
      commit('defaultActiveMutations', value);
      ss.setItem('defaultActive', value);
    },
    // 账号路由
    // routerTitleActions({
    //   commit
    // }, value) {
    //   commit('routerTitle', value);
    //   ss.setItem('routerTitle', value);
    // },
    // 登录状态
    loginStatuActions({
      commit
    }, value) {
      commit('loginStatu', value);
      if (value) {
        ss.setItem('LOGINSTATU', JSON.stringify(value));
      } else {
        ss.removeItem('LOGINSTATU');
      }
    },
    // 选择的一级菜单
    // menuStatuActions({
    //   commit
    // }, value) {
    //   commit('menuStatu', value);
    //   if (value) {
    //     ss.setItem('menuStatu', value);
    //   } else {
    //     ss.removeItem('menuStatu');
    //   }
    // },
    tokenActions({ commit }, value) {
      commit('tokenMutations', value);
      ss.setItem('token', value);
    },
    courtyardIdActions({ commit }, value) {
      commit('courtyardIdMutations', value);
      ss.setItem('courtyardId', value);
    }
  }
};

export default store;
