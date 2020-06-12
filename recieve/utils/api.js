import paths from '@/utils/baseUrl'; // 后端地址

// 静态资源服务器地址
const path = paths.path();
// const mark = '/receptionxw';
// const mark = '/reception-cd';
const mark = '/reception';
const apiPath = path + mark;

export default {

  /**
    * 基础类接口
  */

  // 登录
  reception_doLogin: path + '/mlyun-auth/server/auth/login', //登录
  house_logout: path + '/house/logOut', //退出登录
  jcaptcha_jpeg_imageCaptcha: path + '/api/jcaptcha/jpeg/imageCaptcha?id=1491897656', //登录验证码


  // 基础模块接口
  file_uploadFileToServer: apiPath + '/file/uploadFileToServer', // 上传

  // 字典查询
  sysDicItem_getItemList: apiPath + '/sysDicItem/getItemList',          //接待方案-方案申请-获取查询字典/sysDicItem/getList/{code}

  

  // 系统管理
  // 系统管理--菜单管理模块
  sysMenus_getLoginUserMenuTree: apiPath + '/sysMenus/getLoginUserMenuTree', //菜单列表
  unitInfo_findOnePage: apiPath + '/unitInfo/findOnePage',//获取单位信息分页
  unitInfo_add:apiPath + '/unitInfo/add',//新增单位信息
  unitInfo_update:apiPath + '/unitInfo/update',//修改单位信息
  unitInfo:apiPath + '/unitInfo',//删除回显单位信息
  // 系统管理--角色模块
  sysRoles_getOnePage: apiPath + '/sysRoles/get-onePage',//角色分页列表
  sysRoles_toRoleBatchUser: apiPath + '/sysRoles/toRoleBatchUser',// 配置权限-跳转 
  sysRoles_doRoleBatchMenu:apiPath + '/sysRoles/doRoleBatchMenu',//配置权限提交
  // sysRoles_toRoleBatchUser: '/api/meeting-2.0' + '/sysRole/toRoleBatchUser',// 获取人员  /sysRoles/toRoleBatchUser/{id}
  sysRoles_doRoleBatchUser: apiPath + '/sysRoles/doRoleBatchUser',// 添加人员
  sysRoles_toRoleBatchMenu: apiPath + '/sysRoles/toRoleBatchMenu',// 获取人员
  sysRoles:apiPath+'/sysRoles',   //新增/修改角色





  
  // plans_getPlanSubInfoList: apiPath + '/plans/getPlanSubInfoList',//接待方案列表展示
  // plan_addNewBasePlan: apiPath + '/plan/addNewBasePlan',
  

  //接待任务模块开始

  //接待任务信息类接口 
  plans_getSysPlanInfoList: apiPath+'/plans/getSysPlanInfoList',//接待任务列表展示
  planSub_findOnePageForHotel: apiPath+'/planSub/findOnePageForHotel',//定点酒店-子方案分页
  planSub_findOnePageForCar: apiPath + '/planSub/findOnePageForCar',//接待车队-子方案分页
  planAccommodation_handlePlanAccommodation: apiPath + '/planAccommodation/handlePlanAccommodation',//住宿方案办理


  //接待任务模块结束
  





  // 接待方案模块开始

  //接待方案-方案申请
  plans_getPlanInfoList: apiPath + '/plans/getPlanInfoList',    //接待方案-方案申请
  plans_getPlanInfoListAudit: apiPath + '/plans/getPlanInfoListAudit',    //接待方案-方案申请-审核列表
  plans_applyFlow: apiPath + '/plans/applyFlow',    //接待方案-方案申请-申请人提交/plans/applyFlow/{planNo}
  plans_flowApproval: apiPath + '/plans/flowApproval',    //接待方案-方案申请-申请人提交  /plans/flowApproval/{instanceId}

  
  // 接待方案-基础信息
  plans: apiPath + '/plans',  //接待方案-基础信息-方案详情  /plans/{id}
  // /plans/getPlanInfoList
  plans_updatePlans: apiPath + '/plans/updatePlans',     // 接待方案-基础信息-修改
  plans_deleteUnit: apiPath + '/plans/deleteUnit',      // 接待方案-基础信息-修改---删除单位
  plans_deleteFile: apiPath + '/plans/deleteFile',      // 接待方案-基础信息-修改---删除文件
  plans_historyListByInstanceId: apiPath + '/plans/historyListByInstanceId',      // 接待方案-基础信息-预览-历史审批记录/plans/historyListByInstanceId/{instanceId}
  plans_getSelectPerson: apiPath + '/plans/getSelectPerson',      // 接待方案-基础信息-获取子方案人员
  

  
  // 接待方案-子方案模块
  planSub_findOnePage: apiPath + '/planSub/findOnePage',      // 接待方案-子方案列表
  planSub_updateState: apiPath + '/planSub/updateState',      // 接待方案-子方案操作 /planSub/updateState/{planSubId}/{state}
  planSub_getSubPlanNos: apiPath + '/planSub/getSubPlanNos',      // 根据主订单号获取所有子订单
  

  
  // 接待方案-子方案-人员配置
  planPerson_getPlanPersonList: apiPath + '/planPerson/getPlanPersonList',      // 来访人员列表   /planPerson/getPlanPersonList/{planId}
  planPerson_getPlanMealsList: apiPath + '/planPerson/getPlanMealsList',      // 用餐人员列表     /planPerson/getPlanMealsList/{planId}
  planPerson_getAccompanyPersonList: apiPath + '/planPerson/getAccompanyPersonList',      // 陪餐人员列表   /planPerson/getAccompanyPersonList/{planId}


  // 子方案模块--用车
  planCars_batchInsert: apiPath + '/planCars/batchInsert',      // 子方案--新增用车
  planCars: apiPath + '/planCars',      // 子方案--用车详情,编辑   /planCars/{planSubId}
  planCars_getSysAllPlanCarInfoList: apiPath + '/planCars/getSysAllPlanCarInfoList',      // 接待任务--用车列表详情
  planCars_getAllPlanCarInfoList: apiPath + '/planCars/getAllPlanCarInfoList',      // 子方案--全部-用车列表详情
  planCars_handlePlanCar:apiPath + '/planCars/handlePlanCar',//办理
  

  
  // 子方案模块--会议室
  planMeetings: apiPath + '/planMeetings',      // 子方案--新增会议室, 详情（/planMeetings/{planSubId}）
  planMeetings_updatePlanMeetings: apiPath + '/planMeetings/updatePlanMeetings',      // 子方案--修改会议室
  planMeetings_getMeetingList: apiPath + '/planMeetings/getMeetingList',      // 接待任务--会议详情列表/planMeetings/getMeetingList/{planId}
  planMeetings_getAllMeetingList: apiPath + '/planMeetings/getAllMeetingList',      // 子方案--全部-会议详情列表
  
  

  
  // 子方案模块--住宿
  planAccommodation: apiPath + '/planAccommodation',      // 子方案--新增住宿 详情列表（/planAccommodation/{planId}）
  planAccommodation_echo: apiPath + '/planAccommodation/echo',      // 子方案--住宿编辑回显 /planAccommodation/echo/{planSubId}
  planAccommodation_updatePlanAccommodation: apiPath + '/planAccommodation/updatePlanAccommodation',      // 子方案--住宿编辑

  
  // 子方案模块--用餐
  planMeals_batchInsert: apiPath + '/planMeals/batchInsert',      // 子方案--新增用餐
  planMeals: apiPath + '/planMeals',      // 子方案--用餐，编辑     /planMeals/{planSubId}
  planMeals_getSysAllPlanMealsList: apiPath + '/planMeals/getSysAllPlanMealsList',      // 酒店--用餐详情列表
  planMeals_getAllPlanMealsList: apiPath + '/planMeals/getAllPlanMealsList',      // 子方案--全部-用餐详情列表
  planMeals_handlePlanMeals:apiPath + '/planMeals/handlePlanMeals',//办理


  // 接待方案模块结束



  // 酒店模块
  hotelInfo_getList: apiPath + '/hotelInfo/getList',  //获取酒店列表


  // 单位模块开始
  unitInfo_getList: apiPath + '/unitInfo/getList',  //获取单位列表
  // 单位模块结束

  


  // 费用结算模块开始
  settlements_pageListForChecker: apiPath + '/settlements/pageListForChecker',  // 费用结算-申请人-审核列表
  settlements_pageListForFinance: apiPath + '/settlements/pageListForFinance',  // 费用结算-申请人-审核列表
  settlements_flowExamApproval: apiPath + '/settlements/flowExamApproval',  // 费用结算-申请人-审批
  settlements_flowFinaceApproval: apiPath + '/settlements/flowFinaceApproval',  // 费用结算-财务-审批

  



  //费用结算-第三方
  settlements_pageListForThirdParty: apiPath + '/settlements/pageListForThirdParty',//费用结算列表展示

  
  



  // 费用结算模块结束

  




};