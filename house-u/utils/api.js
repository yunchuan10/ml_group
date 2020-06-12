import paths from '@/utils/baseUrl'; // 后端地址

// 静态资源服务器地址

const path = paths.path();
const apiPath = paths.path() + "/house-service"; //测试环境
// const apiPath = paths.path() + "/mlyun-yys-service";
// const apiPath = paths.path() + '/mlyun-gcy-service';
// const apiPath = paths.path() + '/mlyun-lbf-service';
// const apiPath = paths.path() + "/ch-house-service";

export default {
  // /**
  //  * 基础类接口
  //  */
  // memberImage_ajaxUploadInfo: path + '/api/file/getUploadToken', // 上传 - 获取token
  user_detail: apiPath + '/user/detail', //replace空白页接口
  memberImage_ajaxUploadInfo: apiPath + '/api/file/getUploadToken', // 上传 - 获取token
  resources_getResources: apiPath + '/resources/getResources', // 菜单
  resources_checkHasProject: apiPath + '/resources/checkHasProject', // 判断是否有权限登录平台
  resources_getDetail: apiPath + '/resources/getDetail', // replace获取一级菜单id 菜单详情

  // jcaptcha_jpeg_imageCaptcha: path + '/api/jcaptcha/jpeg/imageCaptcha?id=1491897656', //登录验证码
  house_logout: path + '/house/logOut', //退出登录
  house_doLogin: path + '/house/doLogin', //登录
  house_auth: path + '/mlyun-auth/server/auth/login', //登录新
  memberUser_reqUserInfo: apiPath + '/memberUser/reqUserInfo', // 用户信息
  memberPower_reqMenus: apiPath + '/memberPower/reqMenus', // 左侧菜单
  memberOrder_obtTopMenus: apiPath + '/api/memberOrder/obtTopMenus', // 头部-订单数量
  memberOrder_whetherReceiveNewOrder: apiPath + '/memberOrder/whetherReceiveNewOrder', // 首页-是否有新订单
  flie_getUploadToken: apiPath + '/file/getUploadToken', // 上传 - 获取token
  yardSearch_headerArea: apiPath + '/yardSearch/headerArea', // 切换地区
  file_uploadBase64EncodedFile: apiPath + '/file/uploadBase64EncodedFile', // 上传PDF
  courtYard_getAreaName: apiPath + '/courtYard/getAreaName', // 获取地区

  //平面图
  plan_getOrganCourtyardTree: apiPath + '/plan/getOrganCourtyardTree', // 平面图-左侧树型菜单
  plan_listRoom: apiPath + '/plan/listRoom', //获取平面图 - 房间列表信息
  plan_toBase64: apiPath + '/plan/toBase64', // 图片转base64编码

  // 用房申请
  officeapply_officeApplyList: apiPath + '/officeapply/officeApplyList', // 用房申请 - 列表页
  officeapply_getOrderStatus: apiPath + '/officeapply/getOrderStatus', // 用房申请 - 列表页状态下拉框
  organSearch2_getOrderStatus: apiPath + '/organSearch2/getOrderStatus', //房屋概览 - 订单统计状态下拉框
  officeapply_initOfficeApply: apiPath + '/officeapply/initOfficeApply', // 用房申请 - 办公用房申请单初始化
  officeapply_doApply: apiPath + '/officeapply/doApply', // 用房申请 - 提交办公用房申请
  officeapply_getApplyDetail: apiPath + '/officeapply/getApplyDetail', // 用房申请 - 审批单详情
  officeapply_watingApply: apiPath + '/officeapply/watingApply', // 用房申请 - 待处理
  officeapply_hisApply: apiPath + '/officeapply/hisApply', // 用房申请 - 已处理
  officeapply_cancelApply: apiPath + '/officeapply/cancelApply', // 用房申请 - 撤回订单
  officeapply_getDetail: apiPath + '/officeapply/getDetail', // 用房申请 - 申请单详情
  officeapply_getUpdateDetail: apiPath + '/officeapply/getUpdateDetail', // 用房申请 - 修改审批单详情获取
  officeapply_completeHouseOfficeTask: apiPath + '/officeapply/completeHouseOfficeTask', // 用房申请 - 审批提价
  officeapply_getTotalApply: apiPath + '/officeapply/getTotalApply', // 查询待办和已办任务数量

  //房屋概览
  useSummary_getOrganLevelTree: apiPath + '/useSummary/getOrganLevelTree', //总体概览-左侧树菜单
  useSummary_getUseCourtyardTree: apiPath + '/useSummary/getUseCourtyardTree', // 房屋概览-获取左侧菜单房屋树状图信息
  useSummary_getPublicData: apiPath + '/useSummary/getPublicData', // 房屋概览-获取右侧公用数据
  useSummary_roomList: apiPath + '/useSummary/roomList', // 房屋概览-获取房间列表信息
  useSummary_getEchartData: apiPath + '/useSummary/getEchartData', // 房屋概览-获取echart图表数据
  useSummary_roomDetail: apiPath + '/useSummary/roomDetail', // 房屋概览-房间详情
  room_getSelect: apiPath + '/room/getSelect', // 房间管理 - 房间列表一级类型
  useManage_getAllRoomType: apiPath + '/useManage/getAllRoomType', // 房间管理 - 房间列表全部类型包含一级二级
  useSummary_findOrganDutiesByOrganId: apiPath + '/useSummary/findOrganDutiesByOrganId', // 房屋概览 - organId获取所有的职级
  useSummary_assign: apiPath + '/useSummary/assign', // 房屋概览 - 使用分配保存提交
  useSummary_getUserRoomAssignBase: apiPath + '/useSummary/getUserRoomAssignBase', // 房屋概览 - 每个房间使用状态（超标统计 ）
  useManage_assignCheck: apiPath + '/useManage/assignCheck', // 房屋概览 -判断是否超标

  //房屋维修
  userplatform_maintainApplyList: apiPath + '/userplatform/maintainApplyList', // 房屋维修 - 年度计划列表
  userplatform_doMaintainApply: apiPath + '/userplatform/doMaintainApply', // 房屋维修 - 年度计划申请表
  userplatform_detail: apiPath + '/userplatform/detail', // 房屋维修 - 年度计划详情
  userplatform_doMaintainApplyUpdate: apiPath + '/userplatform/doMaintainApplyUpdate', // 房屋维修 - 年度计划申请修改
  userplatform_updateDetail: apiPath + '/userplatform/updateDetail', // 房屋维修 - 年度计划申请修改详情获取
  userplatform_completeMaintainTask: apiPath + '/userplatform/completeMaintainTask', // 房屋维修 - 年度计划审核
  userplatform_watingApprovalApplyList: apiPath + '/userplatform/watingApprovalApplyList', // 房屋维修 - 计划审核-待审核
  userplatform_doApprovalApplyList: apiPath + '/userplatform/doApprovalApplyList', // 房屋维修 - 计划审核-已审核
  userplatform_getApprovalApplyDetailList: apiPath + '/userplatform/getApprovalApplyDetailList', // 房屋维修 - 计划审核详情回显
  userplatform_queryOrderStatusAndBiddingType: apiPath + '/userplatform/queryOrderStatusAndBiddingType', // 房屋维修 - 中标方式下拉框
  userplatform_maintainResultDetail: apiPath + '/userplatform/maintainResultDetail', // 房屋维修 -维修台账详情
  userplatform_score: apiPath + '/userplatform/score', // 房屋维修 -评分
  yardSearch2_getTable3Select: apiPath + '/yardSearch2/getTable3Select', //  综合查询 - 工程类型,被监管单位，年度下拉选
  manageMaintain_queryOrderStatusAndBiddingType: apiPath + '/manageMaintain/queryOrderStatusAndBiddingType', // 房屋维修 -状态下拉选
  userplatform_maintainResultList: apiPath + '/userplatform/maintainResultList', // 房屋维修 - 维修结果列表查询

  //房屋维修2版
  // manageMaintain_maintainParameterList: apiPath + '/manageMaintain/maintainParameterList', // 房屋维修 - 维修台账列表
  userplatform_maintainParameterList: apiPath + '/userplatform/maintainParameterList', // 房屋维修 - 维修台账列表

  manageMaintain_maintainParameterDetail: apiPath + '/manageMaintain/maintainParameterDetail', // 房屋维修 -维修台账详情

  //经营性房产 - 房屋概览
  generaloverview_getGeneralOverview: apiPath + '/generaloverview/getGeneralOverview', // 房屋概览- 经营性房产首页

  //经营性房产 - 承租人管理
  lessee_list: apiPath + '/lessee/list', // 承租人管理 -承租人列表
  lessee_queryOrganizationalNatureList: apiPath + '/lessee/queryOrganizationalNatureList', // 承租人管理 -获取组织性质的下拉框
  lessee_doAdd: apiPath + '/lessee/doAdd', // 承租人管理 -新增承租人
  lessee_doUpdate: apiPath + '/lessee/doUpdate', // 承租人管理 -修改承租人（黑名单）
  lessee_detail: apiPath + '/lessee/detail', // 承租人管理 -修改详情回显承租人（黑名单）
  lessee_doDelete: apiPath + '/lessee/doLogicDelete', // 承租人管理 -删除承租人（黑名单）
  lessee_existBlacklist: apiPath + '/lessee/existBlacklist', // 承租人管理 -列入黑名单（黑名单）
  lessee_blacklist: apiPath + '/lessee/blacklist', // 承租人管理 -黑名单列表
  lessee_removeBlacklist: apiPath + '/lessee/removeBlacklist', // 承租人管理 -黑名单列表-移除黑名单

  // 经营性房产- 系统设置
  sysmanage_getRentSet: apiPath + '/sysmanage/getRentSet', // 系统设置 -费用标准
  sysmanage_updateRentSet: apiPath + '/sysmanage/updateRentSet', // 系统设置 -修改租金设置
  sysmanage_getRemindInfo: apiPath + '/sysmanage/getRemindInfo', // 系统设置 -获取到期提醒页面设置
  sysmanage_getRemindBaseSet: apiPath + '/sysmanage/getRemindBaseSet', // 系统设置 -获取租金到期提醒设置信息
  sysmanage_updateRemindBaseSet: apiPath + '/sysmanage/updateRemindBaseSet', // 系统设置 -修改租金到期提醒
  sysmanage_onOrOffRemindBaseSet: apiPath + '/sysmanage/onOrOffRemindBaseSet', // 系统设置 -修改租金到期提醒-开关

  //经营性房产- 基础信息
  dealhouse_list: apiPath + '/dealhouse/list', // 基础信息 -基础信息列表
  dealhouse_queryStatusAndWarrantList: apiPath + '/dealhouse/queryStatusAndWarrantList', // 基础信息 -获取下拉选房屋状态和产权情况和闲置原因
  dealhouse_lesseeList: apiPath + '/dealhouse/lesseeList', // 基础信息 -新增经营性房产承租人下拉框获取
  dealhouse_rentList: apiPath + '/dealhouse/rentList', // 基础信息 -新增经营性房产-租金入账列表
  dealhouse_doAdd: apiPath + '/dealhouse/doAdd', // 基础信息 -新增经营性房产
  dealhouse_doUpdate: apiPath + '/dealhouse/doUpdate', // 基础信息 -修改经营性房产
  dealhouse_updateDetail: apiPath + '/dealhouse/updateDetail', // 基础信息 -修改经营性房产详情回显
  dealhouse_detail: apiPath + '/dealhouse/detail', // 基础信息 - 经营性房产详情获取
  dealhouse_doLogicDelete: apiPath + '/dealhouse/doLogicDelete', // 基础信息 - 删除经营性房产
  dealhouse_doUpdateIdleReason: apiPath + '/dealhouse/doUpdateIdleReason', // 基础信息 - 闲置原因补录
  dealhouse_idleReasonDetail: apiPath + '/dealhouse/idleReasonDetail', // 基础信息 - 闲置原因补录详情回显

  //经营性房产- 基础信息版本2
  dealhouse_queryStatusAndAcquisitionList: apiPath + '/dealhouse/queryStatusAndAcquisitionList', // 基础信息 -获取下拉选房屋状态和取得方式

  //经营性房产-租金管理
  rent_findRentalInfoOfNo: apiPath + '/rent/findRentalInfoOfNo', // 基础信息 - 租金管理未入账租金列表
  rent_findRentalInfoOfYes: apiPath + '/rent/findRentalInfoOfYes', // 基础信息 - 租金管理已入账租金列表
  rent_getRentStatusAndInformationSelect: apiPath + '/rent/getRentStatusAndInformationSelect', // 基础信息 - 租金管理-获取租金状态下拉框
  rent_getRentalInformationSelect: apiPath + '/rent/getRentalInformationSelect', // 基础信息 - 租金管理-获取租金入账情况下拉框
  rent_addOverdueNote: apiPath + '/rent/addOverdueNote', // 基础信息 - 租金管理-获取租金逾期备注
  rent_addRentalInfomation: apiPath + '/rent/addRentalInfomation', // 基础信息 - 租金管理-租金入账弹框
  rent_sendRentRemind: apiPath + '/rent/sendRentRemind', // 基础信息 - 租金管理-缴租提醒发送短信
  rent_getRentRemind: apiPath + '/rent/getRentRemind', // 基础信息 - 租金管理-缴租提醒承租人获取
  rent_getDetail: apiPath + '/rent/getDetail', // 基础信息 - 租金管理-详情

  //经营性房产-出租申请
  userplathouserent_rentApplyList: apiPath + '/userplathouserent/rentApplyList', // 出租申请 - 出租申请列表
  userplathouserent_doRentApply: apiPath + '/userplathouserent/doRentApply', // 出租申请 - 出租申请提交
  userplathouserent_queryOrderStatusAndPayWay: apiPath + '/userplathouserent/queryOrderStatusAndPayWay', // 出租申请 - 下拉框获取
  userplathouserent_dealHouseList: apiPath + '/userplathouserent/dealHouseList', // 出租申请 - 申请单页面 获取所有经营性房产
  userplathouserent_withdrawApply: apiPath + '/userplathouserent/withdrawApply', // 出租申请 - 申请列表 撤回
  userplathouserent_doRentApplyUpdate: apiPath + '/userplathouserent/doRentApplyUpdate', // 出租申请 - 出租申请修改
  userplathouserent_detail: apiPath + '/userplathouserent/detail', // 出租申请列表 - 出租申请详情获取
  userplathouserent_watingApprovalApplyList: apiPath + '/userplathouserent/watingApprovalApplyList', // 出租审批 - 待审批列表
  userplathouserent_doApprovalApplyList: apiPath + '/userplathouserent/doApprovalApplyList', // 出租审批 - 已审批列表
  userplathouserent_completeMaintainTask: apiPath + '/userplathouserent/completeMaintainTask', // 出租审批 - 审批
  userplathouserent_doAdditionalRecording: apiPath + '/userplathouserent/doAdditionalRecording', // 出租申请-申请补录

  //经营性房产-出租申请2版
  userplathouserent_dealHouseListOfUpdate: apiPath + '/userplathouserent/dealHouseListOfUpdate', // 出租申请 - 申请单页面 修改页面获取所有经营性房产

  // 数据上报
  report_getArea: apiPath + '/report/getArea', // 获取行政区域
  report_getReportOrder: apiPath + '/report/getReportOrder', // 获取上报列表
  report_getDic: apiPath + '/report/getDic', // 获取数据字典
  report_addReportArea: apiPath + '/report/addReportArea', // 第一张表新增/修改-行政区划信息
  report_getReportAreaDetail: apiPath + '/report/getReportAreaDetail', // 第一张表详情-行政区划信息
  report_getReportOfficeHouseList: apiPath + '/report/getReportOfficeHouseList', // 第二张表详情-列表
  report_addReportOfficeHouse: apiPath + '/report/addReportOfficeHouse', // 第二张表详情-新增/修改-办公用房
  report_getReportOfficeHouseDetail: apiPath + '/report/getReportOfficeHouseDetail', // 第二张表详情-详情-办公用房
  report_delReportOfficeHouse: apiPath + '/report/delReportOfficeHouse', // 第二张表详情-删除
  report_getReportTechHouseList: apiPath + '/report/getReportTechHouseList', // 第三张表详情-列表
  report_addReportTechHouse: apiPath + '/report/addReportTechHouse', // 第三张表详情-新增/修改-技术用房
  report_delReportTechHouse: apiPath + '/report/delReportTechHouse', // 第三张表详情-删除
  report_getReportTechHouseDetail: apiPath + '/report/getReportTechHouseDetail', // 第三张表详情-详情-办公用房
  report_getReportBuildProjectList: apiPath + '/report/getReportBuildProjectList', // 第四张表详情-列表
  report_addReportBuildProject: apiPath + '/report/addReportBuildProject', // 第四张表详情-新增/修改
  report_getReportBuildProjectDetail: apiPath + '/report/getReportBuildProjectDetail', // 第四张表详情-详情
  report_delReportBuildProject: apiPath + '/report/delReportBuildProject', // 第四张表详情-删除
  report_startReport: apiPath + '/report/startReport', // 发起上报
  report_getFile: apiPath + '/report/getFile', // 获取上报附件

  //经营性房产-合同管理
  contract_findPage: apiPath + '/contract/findPage', // 合同管理-列表数据
  // contract_toAddContract: apiPath + '/contract/toAddContract', // 合同管理-合同状态下拉选项

  contract_toAddContract: apiPath + '/contract/queryContractStatus', // 合同管理-合同状态下拉选项
  contract_getLesseeList: apiPath + '/contract/getLesseeList', // 合同管理-承租人下拉选项
  contract_getReleasedSelect: apiPath + '/contract/getReleasedSelect', // 合同管理-结合合同原因下拉选项

  // contract_addContract: apiPath + '/contract/addContract', // 合同管理-新增合同基本信息
  contract_addContract: apiPath + '/contract/doAdd', // 合同管理-新增合同基本信息

  contract_addContractFile: apiPath + '/contract/addContractFile', //合同管理-新增合同-正文
  user_register: apiPath + '/user/register', // 合同管理-新增合同-附件
  // contract_getDealRoomInfo: apiPath + '/contract/getDealRoomInfo', // 合同管理-新增合同基本信息-合同标的物
  // contract_addContractFile: apiPath + '/contract/addContractFile', // 合同管理-新增合同-正文
  contract_addContractRemind: apiPath + '/contract/addContractRemind', // 合同管理-新增合同-过期提醒
  rent_getContractRental: apiPath + '/rent/getContractRental', // 合同管理-新增合同-租金入账情况
  rent_queryRemindBaseSet: apiPath + '/rent/queryRemindBaseSet', //合同管理-到期提醒
  contract_addContractImage: apiPath + '/contract/addContractImage', // 合同管理-新增合同-附件
  contract_getContractWithSubject: apiPath + '/contract/getContractWithSubject', // 合同管理-获取合同基本信息
  contract_getDealRoomInfoOfUpdate: apiPath + '/contract/getDealRoomInfoOfUpdate', // 合同管理-修改-获取合同信息-合同标的物
  contract_updateContract: apiPath + '/contract/updateContract', //合同管理-修改-基础信息
  contract_getContractProper: apiPath + '/contract/getContractProper', //合同管理-获取-合同正文
  contract_updateContractProper: apiPath + '/contract/updateContractProper', //合同管理-修改-合同正文
  contract_getContractImages: apiPath + '/contract/getContractImages', //合同管理-获取-合同附件
  contract_updateContractImage: apiPath + '/contract/updateContractImage', //合同管理-修改-合同附件
  contract_getContractRemind: apiPath + '/contract/getContractRemind', //合同管理-获取-合同到期提醒
  contract_updateContractRemind: apiPath + '/contract/updateContractRemind', //合同管理-修改-合同到期提醒
  contract_doDeleteContract: apiPath + '/contract/doDeleteContract', // 合同管理-删除合同
  contract_doReleasedContract: apiPath + '/contract/doReleasedContract', // 合同管理-解除合同

  //合同改版接口
  contract_getDealRoomInfo: apiPath + '/contract/getDealRoomInfo', // 合同管理-新增-选择房屋
  // contract_getContractDetails: apiPath + '/contract/getContractDetails', // 合同管理-获取合同详情信息
  contract_getContractDetails: apiPath + '/contract/getContractDetail', // 合同管理-获取合同详情信息-2.0

  //结束

  // 超标预警
  warning_getDutyLevel: apiPath + '/warning/getDutyLevel', // 获取职务级别
  warning_getWarningStatusDic: apiPath + '/warning/getWarningStatusDic', // 获取职务级别
  warning_userList: apiPath + '/warning/userList', // 超标预警列表页获取
  warning_doBack: apiPath + '/warning/doBack', // 超标预警备案
  warning_detail: apiPath + '/warning/detail', // 超标信息详情

  // 系统设置
  person_getDeptTree: apiPath + '/person/getDeptTree', // 获取部门树形菜单下拉框
  person_findOrganDutiesByOrganId: apiPath + '/person/findOrganDutiesByOrganId', // 获取职务级别下拉框
  resources_query: apiPath + '/resources/query', // 获取菜单
  role_add: apiPath + '/role/add', // 新增角色
  role_getDetail: apiPath + '/role/getDetail', // 新增角色
  role_delete: apiPath + '/role/delete', // 新增角色
  role_query: apiPath + '/role/query', // 角色列表
  person_query: apiPath + '/person/query', // 人员列表
  person_bindRole: apiPath + '/person/bindRole', // 绑定人员
  // sysmanage_getDutySelect: apiPath + '/sysmanage/getDutySelect', // 获取职务级别下拉选
  sysmanage_getDutiesName: apiPath + '/sysmanage/getDutiesName', // 获取职务级别下拉选
  sysmanage_getFormation: apiPath + '/sysmanage/getFormation', // 获取单位编制管理信息
  sysmanage_updateFormation: apiPath + '/sysmanage/updateFormation', // 修改单位下编制管理
  sysmanage_getVerticalTree: apiPath + '/sysmanage/getVerticalTree', // 查询编制管理树

  // 通知公告
  publish_add: apiPath + '/publish/add', // 新增--通知公告
  publish_getNoticeDetail: apiPath + '/publish/getNoticeDetail', // 公告详情
  publish_getOrganList: apiPath + '/publish/getOrganList', // 新增--获取单位
  publish_getUserList: apiPath + '/publish/getUserList', // 新增--获取人员
  publish_getDic: apiPath + '/publish/getDic', // 数据字典获取
  publish_receivePublish: apiPath + '/publish/receivePublish', // 我接受的-通知公告列表
  publish_myPublish: apiPath + '/publish/myPublish', // 我的发送列表-草稿/已发布
  publish_delPublish: apiPath + '/publish/delPublish', // 我的发送列表-删除--通知公告
  publish_publishDraft: apiPath + '/publish/publishDraft', // 草稿--转为已发布
  publish_delReceive: apiPath + '/publish/delReceive', // 我接受的-删除通知公告
  publish_updateIsRead: apiPath + '/publish/updateIsRead', // 我接受的-增加查看次数

  //系统日志
  userLog_addLoginLog: apiPath + '/userLog/addLoginLog', //系统日志 - 登陆日志 - 新增
  userLog_pageOfLoginLog: apiPath + '/userLog/pageOfLoginLog', //系统日志 - 登陆日志 - 列表
  userLog_pageOfOperationLog: apiPath + '/userLog/pageOfOperationLog', //系统日志 - 操作日志 - 列表
  userLog_treeOfSysDic: apiPath + '/userLog/treeOfSysDic', //系统日志 - 操作日志 - 查询项
  userLog_addOperationLog: apiPath + '/userLog/addOperationLog', //系统日志 - 操作日志 - 新增
  // 日常上报
  commonReport_listUserReport: apiPath + '/commonReport/listUserReport', // 日常上报列表
  commonReport_getSettingDetail: apiPath + '/commonReport/getSettingDetail', // 日常上报详情
  commonReport_doReport: apiPath + '/commonReport/doReport', // 日常上报-上报
  commonReport_listComment: apiPath + '/commonReport/listComment', // 日常上报-上报记录
  commonReport_commonReportStatus: apiPath + '/commonReport/commonReportStatus', // 上报状态查询

  //综合查询2版
  yardSearch2_table1Data: apiPath + '/yardSearch2/table1Data', // 综合查询 - 按院落查询中,table1的数据获取  院落概览
  yardSearch2_countUseOrgan: apiPath + '/yardSearch2/countUseOrgan', // 综合查询 - 按院落查询中,table1的数据获取  院落概览-使用单位echart图表
  yardSearch2_organList: apiPath + '/yardSearch2/organList', // 综合查询 - 按院落查询中,院落概览-点击几家单位子页面的单位列表
  yardSearch2_organUseRoomList: apiPath + '/yardSearch2/organUseRoomList', // 综合查询 - 按院落查询中,院落概览-点击房间子页面的房间列表
  yardSearch2_roomDetail: apiPath + '/yardSearch2/roomDetail', // 综合查询 - 按院落查询中,院落概览-点击房间子页面的房间列表详情
  yardSearch2_floorDetail: apiPath + '/yardSearch2/floorDetail', // 综合查询 - 按院落查询中,点击楼座出现的详情
  yardSearch2_countHasAssign: apiPath + '/yardSearch2/countHasAssign', // 综合查询 - 按院落查询中,房屋概览-房屋分配及处置情况
  yardSearch2_listRoom: apiPath + '/yardSearch2/listRoom', // 综合查询 - 按院落查询中,房屋概览-房间列表各个状态下的房间列表
  yardSearch2_getTable1Select: apiPath + '/yardSearch2/getTable1Select', // 综合查询 - 按院落查询中,房屋概览-所有下拉选的内容
  yardSearch2_table3Data: apiPath + '/yardSearch2/table3Data', // 综合查询 - 按院落查询中,房屋维修菜单的echart图表
  organSearch2_table1Data: apiPath + '/organSearch2/table1Data', // 综合查询 - 按单位查询中,单位概览 单位信息
  organSearch2_listOrder: apiPath + '/organSearch2/listOrder', // 综合查询 - 按单位列表信息
  organSearch2_countOrder: apiPath + '/organSearch2/countOrder', // 综合查询 - 按单位查询中,订单统计
  // officeapply_getOrderStatus: apiPath + '/officeapply/getOrderStatus', // 综合查询 - 按单位查询中,订单统计-订单状态下拉框
  organSearch2_getTable2Data: apiPath + '/organSearch2/getTable2Data', // 综合查询 - 按单位查询中,面积核定 三方核定

  yardSearch2_table2Data: apiPath + '/yardSearch2/table2Data', // 综合查询 - 按院落查询模块,table2中echart图中所需的数据
  yardSearch2_getTable2Select: apiPath + '/yardSearch2/getTable2Select', // 综合查询 - 按院落查询模块,table2中权属登记方式下拉框的集合
  yardSearch2_listOwner: apiPath + '/yardSearch2/listOwner', // 综合查询 - 按院落查询模块,table2中列表数据

  organSearch2_table1eChart: apiPath + '/organSearch2/table1eChart', // 综合查询 - 按单位查询模块,table1中各房间数据
  organSearch2_getCourtyard: apiPath + '/organSearch2/getCourtyard', // 综合查询 - 按单位查询模块,table1中院落下拉选
  organSearch2_countOfficeEChart: apiPath + '/organSearch2/countOfficeEChart', // 综合查询 - 按单位查询模块 - 办公室数据
  organSearch2_getFloorAndStoreys: apiPath + '/organSearch2/getFloorAndStoreys', // 综合查询 - 按单位查询模块,table1房屋位置下拉
  organSearch2_listUser: apiPath + '/organSearch2/listUser', // 综合查询 - 按单位查询模块,table1中人员信息 - 列表
  organSearch2_listRoom: apiPath + '/organSearch2/listRoom', // 综合查询 - 按单位查询模块,table1中办公室信息 - 列表
  organSearch2_roomDetail: apiPath + '/organSearch2/roomDetail', // 综合查询 - 按单位查询模块,table1中办公室信息 - 列表 - 详情
  organSearch2_getRoomType: apiPath + '/organSearch2/getRoomType', // 综合查询 - 按单位查询模块,table1中房间类型下拉
  organSearch2_countByDutyLevel: apiPath + '/organSearch2/countByDutyLevel', // 综合查询 - 按单位查询中,table1中人员信息echart图表

  //使用管理-分房调配管理
  useManage_getDutyTree: apiPath + '/useManage/getDutyTree', // 房屋概览 - 获取职别职级树菜单
  useManage_getOrganTree: apiPath + '/useManage/getOrganTree', //使用管理-分房调配-管理树菜单
  useManage_getOrganLevelTree: apiPath + '/useManage/getOrganLevelTree', // 使用管理-分房调配-分房调配管理Tree
  useManage_roomList: apiPath + '/useManage/roomList', // 使用管理-分房调配-房间列表
  useManage_unmannedOfficeList: apiPath + '/useManage/unmannedOfficeList', // 使用管理-无人办公室列表
  useManage_roomDetail: apiPath + '/useManage/roomDetail', // 使用管理-分房调配-房间详情
  useManage_cancelAssign: apiPath + '/useManage/cancelAssign', // 使用管理-分房调配-取消分配
  useManage_getPublicData: apiPath + '/useManage/getPublicData', // 使用管理-分房调配-公共数据
  useManage_oneMoreRoomList: apiPath + '/useManage/oneMoreRoomList', // 使用管理-一人多室列表
  useManage_assign: apiPath + '/useManage/assign', // 使用管理-分房调配-分配和修改
  useManage_userDetail: apiPath + '/useManage/userDetail', // 使用管理-分房调配-分配和修改
  useManage_addUserRecord: apiPath + '/useManage/addUserRecord', // 使用管理-一人多室查询-新增人员备案
  useManage_updateUserRecord: apiPath + '/useManage/updateUserRecord', // 使用管理-一人多室查询-修改人员备案
  useManage_userRecordDetail: apiPath + '/useManage/userRecordDetail', // 使用管理-一人多室查询-人员备案详情
  useManage_queryRoomAddress: apiPath + '/useManage/queryRoomAddress', // 使用管理-房间位置下拉
  useManage_useManageSelect: apiPath + '/useManage/useManageSelect', //使用管理-下拉选
  useManage_excessiveRoomList: apiPath + '/useManage/excessiveRoomList', // 使用管理-超标房间查询 - 列表
  useManage_addRoomRecord: apiPath + '/useManage/addRoomRecord', // 使用管理-超标房间查询 - 新增备案
  useManage_updateRoomRecord: apiPath + '/useManage/updateRoomRecord', // 使用管理-超标房间查询 - 修改备案
  useManage_roomRecordDetail: apiPath + '/useManage/roomRecordDetail', // 使用管理-超标房间查询 - 备案详情

  //系统管理
  sysmanage_getOrganTree: apiPath + '/sysmanage/getOrganTree', // 到期提醒部门人员
  sysmanage_getDutyTree: apiPath + '/sysmanage/getDutyTree', //到期提醒职务级别人员

  //数据字典
  sysmanage_getOrganHouseRoomType: apiPath + '/sysmanage/getOrganHouseRoomType', //数据字典 - 查询房间类型
  sysmanage_addOrganHouseRoomType: apiPath + '/sysmanage/addOrganHouseRoomType', //数据字典 - 新增/修改房间类型
  sysmanage_delOrganHouseRoomType: apiPath + '/sysmanage/delOrganHouseRoomType', //数据字典 - 删除房间类型
};