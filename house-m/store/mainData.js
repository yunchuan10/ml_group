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
    courtyardId: ss.getItem('courtyardId') || '', // 综合查询院落Id
    storeysId: ss.getItem('storeysId') || '', //平面图楼层id
    organId: ss.getItem('organId') || '', // 综合查询单位Id
    loginOrganId: ss.getItem('loginOrganId') || '', //登录单位Id
    areaName: ss.getItem('areaName') || '', // 登录的区域名称
    areaLevel: ss.getItem('areaLevel') || '', // 登录的区域等级
    areaType: ss.getItem('areaType') || '', //登录的区域类型
    areaId: ss.getItem('areaId') || '', // 登录的区域Id
    realName: ss.getItem('realName') || '', // 登录的用户名
    organName: ss.getItem('organName') || '', // 登录的单位名称
    organSpecification: ss.getItem('organSpecification') || '', // 登录的单位类别
    adminDivisionLevel: ss.getItem('adminDivisionLevel') || '', // 登录的行政区划级别
    reportAreaLevel: ss.getItem('reportAreaLevel') || '', // 新登录的行政区划级别
    userId: ss.getItem('userId') || '', //登录用户名的id
    superSearch: ss.getItem('superSearch') || '', //头部超级搜索字段
    threeUrl: ss.getItem('threeUrl') || '', //3D图地址
    operateOrganId: ss.getItem('operateOrganId') || '', //经营性房产 -综合查询单位id
    operateStreet: ss.getItem('operateStreet') || '', //经营性房产 -综合查询单位-按街道查询
    navId: ss.getItem('navId') || '', //一级菜单
    navName: ss.getItem('navName') || '', //一级菜单
    isMajor: ss.getItem('isMajor') || '', //是否是管理员
    reportPageStatus: ss.getItem('reportPageStatus') || '', // 数据上报当前页，控制主页的新增按钮跳转
    dataReportOrderId: ss.getItem('dataReportOrderId') || '', // 数据上报id
    reportOperatStatus: ss.getItem('reportOperatStatus') || '', // 数据上报操作状态，详情还是新增修改
    reportReviewPage: '', // 数据上报审核页面
    reportBackPage: ss.getItem('reportBackPage') || '', // 数据上报返回到哪个页面
    myPlanPageUpdate: ss.getItem('myPlanPageUpdate') || '', // 配置管理数据量角标
    commonReportId: ss.getItem('commonReportId') || '', // 日常上报ID
    systemAreaPageName: ss.getItem('systemAreaPageName') || '', // 系统设置面积
    systemAreaOpen: ss.getItem('systemAreaOpen') || '', // 系统设置面积修改弹出框打开状态
    floorName: ss.getItem('floorName') || '', //综合查询楼座页面的楼面名称


    headeRouteActive: '', // 头部菜单点击同步到左侧菜单选中

  },
  // 方法
  mutations: {
    // 头部菜单点击同步到左侧菜单选中
    headeRouteActiveMutations(state, value) {
      state.headeRouteActive = value;
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
    oldTokenMutations(state, data) {
      state.oldToken = data;
    },
    courtyardIdMutations(state, data) {
      state.courtyardId = data;
    },
    //平面图楼层id
    storeysIdMutations(state, data) {
      state.storeysId = data;
    },
    //经营性房产 -按单位查询 单位id
    operateOrganIdMutations(state, data) {
      state.operateOrganId = data;
      ss.setItem('operateOrganId', data);
    },
    //经营性房产 -按街道查询 街道名称
    operateStreetMutations(state, data) {
      state.operateStreet = data;
      ss.setItem('operateStreet', data);
    },
    // 按使用单位查询id
    organIdMutations(state, data) {
      state.organId = data;
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
    // 保存登录的区域类型
    areaTypeMutations(state, data) {
      state.areaType = data;
      ss.setItem('areaType', data);
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
    //楼座名称保存
    floorNameMutations(state, data) {
      state.floorName = data;
      ss.setItem('floorName', data);
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
    //保存登录的单位id
    loginOrganIdMutations(state, data) {
      state.loginOrganId = data;
      ss.setItem('loginOrganId', data);
    },
    //保存登录的3d图路径
    threeUrlMutations(state, data) {
      state.threeUrl = data;
      ss.setItem('threeUrl', data);
    },
    //保存头部超级搜索的字段
    superSearchMutations(state, data) {
      state.superSearch = data;
      ss.setItem('superSearch', data);
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
    // 是否是管理员
    isMajorMutations(state, data) {
      state.isMajor = data;
      ss.setItem('isMajor', data);
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
    reportReviewPageMutations(state, data) {
      state.reportReviewPage = data;
    },
    reportBackPageMutations(state, data) {
      state.reportBackPage = data;
      ss.setItem('reportBackPage', data);
    },
    myPlanPageUpdateMutations(state, data) {
      state.myPlanPageUpdate = data;
      ss.setItem('myPlanPageUpdate', data);
    },
    commonReportIdMutations(state, data) {
      state.commonReportId = data;
      ss.setItem('commonReportId', data);
    },
    systemAreaPageNameMutations(state, data) {
      state.systemAreaPageName = data;
      ss.setItem('systemAreaPageName', data);
    },
    systemAreaOpenMutations(state, data) {
      state.systemAreaOpen = data;
      ss.setItem('systemAreaOpen', data);
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

    //保存经营性房产 -按单位查询 单位id
    operateOrganIdActions({
      commit
    }, value) {
      commit('operateOrganIdMutations', value);
      ss.setItem('operateOrganId', value);
    },
    //保存经营性房产 -按街道查询 单位id
    operateStreetActions({
      commit
    }, value) {
      commit('operateStreetMutations', value);
      ss.setItem('operateStreet', value);
    },
    //保存二级菜单
    navNameActions({
      commit
    }, value) {
      commit('navNameMutations', value);
      ss.setItem('navName', value);
    },
    // 保存选中路由
    defaultActiveActions({
      commit
    }, value) {
      commit('defaultActiveMutations', value);
      ss.setItem('defaultActive', value);
    },
    // 保存登录的区域Id
    areaIdActions({
      commit
    }, value) {
      commit('areaIdMutations', value);
      ss.setItem('areaId', value);
    },
    //保存区域的名称
    areaNameActions({
      commit
    }, value) {
      commit('areaNameMutations', value);
      ss.setItem('areaName', value);
    },

    //保存楼座的名称
    floorNameActions({
      commit
    }, value) {
      commit('floorNameMutations', value);
      ss.setItem('floorName', value);
    },

    // 保存头部超级搜索的字段
    superSearchActions({
      commit
    }, value) {
      commit('superSearchMutations', value);
      ss.setItem('superSearch', value);
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
    storeysIdActions({
      commit
    }, value) {
      commit('storeysIdMutations', value);
      ss.setItem('storeysId', value);
    },
    organIdActions({
      commit
    }, value) {
      commit('organIdMutations', value);
      ss.setItem('organId', value);
    },
    // 用户登录单位organId
    loginOrganIdActions({
      commit
    }, value) {
      commit('loginOrganIdMutations', value);
      ss.setItem('loginOrganId', value);
    },
    // 用户登录单位名称
    organNameActions({
      commit
    }, value) {
      commit('organNameMutations', value);
      ss.setItem('organName', value);
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