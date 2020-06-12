import baseUtils from '@/utils/baseUtils'; // 底层工具包
const ss = baseUtils.ss;
const ls = baseUtils.ls;

// Vuex存储登录状态
const store = {
  state: {
    isCollapse: ls.getItem('ZKML_onlinecar_isCollapse') === 'true' || false, // 菜单栏是否折叠
    routerTitle: ss.getItem('routerTitle') || {}, // 账号路由
    defaultActive: ss.getItem('defaultActive') || '/home', // 保存选中路由
    loginStatu: ss.getItem('LOGINSTATU') || false, // 登录状态，默认否
    menuStatu: ss.getItem('menuStatu') || '', // 选择的一级菜单
    uploadProgress: 0, // 上传进度条
    token: ss.getItem('token') || '',
    oldToken: ss.getItem('oldToken') || '', //导出需要的token值
    courtyardId: ss.getItem('courtyardId') || '', // 房屋概览院落Id
    organId: ss.getItem('organId') || '', // 综合查询单位Id
    loginOrganId: ss.getItem('loginOrganId') || '', //登录单位Id
    areaName: ss.getItem('areaName') || '', // 登录的区域名称
    areaLevel: ss.getItem('areaLevel') || '', // 登录的区域等级
    areaId: ss.getItem('areaId') || '', // 登录的区域Id
    realName: ss.getItem('realName') || '', // 登录的用户名
    organName: ss.getItem('organName') || '', // 登录的单位名称
    organSpecification: ss.getItem('organSpecification') || '', // 登录的单位类别
    adminDivisionLevel: ss.getItem('adminDivisionLevel') || '', // 登录的行政区划级别
    reportAreaLevel: ss.getItem('reportAreaLevel') || '', // 新登录的行政区划级别
    navName: ss.getItem('navName') || '', //一级菜单
    navId: ss.getItem('navId') || '', //一级菜单Id
    userId: ss.getItem('userId') || '', //登录用户名的id
    isMajor: ss.getItem('isMajor') || '', //是否是管理员
    reportPageStatus: ss.getItem('reportPageStatus') || '', // 数据上报当前页，控制主页的新增按钮跳转
    dataReportOrderId: ss.getItem('dataReportOrderId') || '', // 数据上报id
    reportOperatStatus: ss.getItem('reportOperatStatus') || '', // 数据上报操作状态，详情还是新增修改
    myPlanPageUpdate: ss.getItem('myPlanPageUpdate') || '',
    generalOrganId: ss.getItem('generalOrganId') || '', //总体概览树型菜单单位id
    commonReportId: ss.getItem('commonReportId') || '', // 日常上报ID
    commonReportOrganId: ss.getItem('commonReportOrganId') || '' // 日常记录主键
  },
  // 方法
  mutations: {
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
    oldTokenMutations(state, data) {
      state.oldToken = data;
    },
    courtyardIdMutations(state, data) {
      state.courtyardId = data;
    },
    // 按使用单位查询id
    organIdMutations(state, data) {
      state.organId = data;
    },
    // 总体概览树型菜单单位id
    generalOrganIdMutations(state, data) {
      state.generalOrganId = data;
      ss.setItem('generalOrganId', data);
    },
    // 保存登录的区域Id
    areaIdMutations(state, data) {
      state.areaId = data;
    },
    // 保存登录的区域名称
    areaNameMutations(state, data) {
      state.areaName = data;
      ss.setItem('areaName', data);
    },
    //保存二级菜单
    navNameMutations(state, data) {
      state.navName = data;
      ss.setItem('navName', data);
    },
    // 头部菜单ID
    navIdMutations(state, data) {
      if (data) {
        state.navId = data;
        ss.setItem('navId', data);
      }
    },
    // 保存登录的区域等级
    areaLevelMutations(state, data) {
      state.areaLevel = data;
      ss.setItem('areaLevel', data);
    },
    realNameMutations(state, data) {
      if (data) {
        state.realName = data;
        ss.setItem('realName', data);
      }
    },
    organNameMutations(state, data) {
      state.organName = data;
      ss.setItem('organName', data);
    },
    organSpecificationMutations(state, data) {
      state.organSpecification = data;
      ss.setItem('organSpecification', data);
    },
    //行政区划级别
    adminDivisionLevelMutations(state, data) {
      state.adminDivisionLevel = data;
      ss.setItem('adminDivisionLevel', data);
    },

    // 新行政区划级别
    reportAreaLevelMutations(state, data) {
      state.reportAreaLevel = data;
      ss.setItem('reportAreaLevel', data);
    },

    //保存登录的用户名id
    userIdMutations(state, data) {
      state.userId = data;
      ss.setItem('userId', data);
    },
    // 是否是管理员
    isMajorMutations(state, data) {
      state.isMajor = data;
      ss.setItem('isMajor', data);
    },
    //保存登录的单位id
    loginOrganIdMutations(state, data) {
      state.loginOrganId = data;
      ss.setItem('loginOrganId', data);
    },
    reportPageStatusMutations(state, data) {
      state.reportPageStatus = data;
      ss.setItem('reportPageStatus', data);
    },
    dataReportOrderIdMutations(state, data) {
      state.dataReportOrderId = data;
      ss.setItem('dataReportOrderId', data);
    },
    reportOperatStatusMutations(state, data) {
      state.reportOperatStatus = data;
      ss.setItem('reportOperatStatus', data);
    },
    myPlanPageUpdateMutations(state, data) {
      state.myPlanPageUpdate = data;
      ss.setItem('myPlanPageUpdate', data);
    },
    commonReportIdMutations(state, data) {
      state.commonReportId = data;
      ss.setItem('commonReportId', data);
    },
    commonReportOrganIdMutations(state, data) {
      state.commonReportOrganId = data;
      ss.setItem('commonReportOrganId', data);
    }
  },
  actions: {
    // 修改菜单栏是否折叠
    isCollapseActions({
      commit
    }, value) {
      commit('isCollapseMutations', value);
      ls.setItem('ZKML_onlinecar_isCollapse', value);
    },
    // 保存选中路由
    defaultActiveActions({
      commit
    }, value) {
      commit('defaultActiveMutations', value);
      ss.setItem('defaultActive', value);
    },
    //保存二级菜单
    navNameActions({
      commit
    }, value) {
      commit('navNameMutations', value);
      ss.setItem('navName', value);
    },
    // 保存登录的区域Id
    areaIdActions({
      commit
    }, value) {
      commit('areaIdMutations', value);
      ss.setItem('areaId', value);
    },
    // 账号路由
    // routerTitleActions({
    //   commit
    // }, value) {
    //   commit('routerTitle', value);
    //   ss.setItem('routerTitle', value);
    // },
    // 登录状态
    // loginStatuActions({
    //   commit
    // }, value) {
    //   commit('loginStatu', value);
    //   if (value) {
    //     ss.setItem('LOGINSTATU', value);
    //   } else {
    //     ss.removeItem('LOGINSTATU');
    //   }
    // },
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
    tokenActions({
      commit
    }, value) {
      commit('tokenMutations', value);
      ss.setItem('token', value);
    },
    oldTokenActions({
      commit
    }, value) {
      commit('oldTokenMutations', value);
      ss.setItem('oldToken', value);
    },
    courtyardIdActions({
      commit
    }, value) {
      commit('courtyardIdMutations', value);
      ss.setItem('courtyardId', value);
    },
    organIdActions({
      commit
    }, value) {
      commit('organIdMutations', value);
      ss.setItem('organId', value);
    },
    //总体使用概览树型菜单单位id缓存
    generalOrganIdActions({
      commit
    }, value) {
      commit('generalOrganIdMutations', value);
      ss.setItem('generalOrganId', value);
    },
    //用户名id
    userIdActions({
      commit
    }, value) {
      commit('userIdMutations', value);
      ss.setItem('userId', value);
    }
  }
};

export default store;