import paths from '@/api/baseUrl'; // 后端地址

// 静态资源服务器地址
const path = paths.path();

const mark = '/meeting-2.0';
// const mark = '/meetinglzy';
// const mark = '/meeting-test';
// const commonPath = `${path}/meeting-test`;
const commonPath = `${path}${mark}`;


export default {
	/**
	 * 基础类接口
	 */

	// govMeeting_doLogin: path + '/sso-server/sso/loginAPI', //登录
	// jcaptcha_jpeg_imageCaptcha: path + '/api/jcaptcha/jpeg/imageCaptcha?id=1491897656', //登录验证码
	// baseUtils_getUserInfo: commonPath + '/baseUtils/getUserInfo', // 用户信息
	// fileLoad_uploadRequest: commonPath + '/fileLoad/uploadRequest', // 上传 - 获取token

	govMeeting_doLogin: path + '/mlyun-auth/server/auth/login', //登录
	house_logout: path + '/house/logOut', //退出登录
	currentBase_getUser: commonPath + '/currentBase/getUser', // 用户信息
	file_uploadFileToServer: commonPath + '/file/uploadFileToServer', // 上传 - 获取token
	roomApply_deleteApplyAttachment: commonPath + '/roomApply/deleteApplyAttachment', // 附件删除

	/**
	 * 会议管理
	 */

	// 会议看板
	applyBoard_publicApplyBoard: commonPath + '/applyBoard/publicApplyBoard', // 会议看板
	roomApply_toSaveApply: commonPath + '/roomApply/toSaveApply', // 申请填写页面回显数据
	roomApply_doSaveApply: commonPath + '/roomApply/doSaveApply', // 提交申请单(包括会务中心申请单和自有会议室申请单)
	roomApply_updateApply: commonPath + '/roomApply/updateApply', // 修改申请单(包括会务中心申请单和自有会议室申请单)

	// 订单信息
	roomApply_applyPageForManage: commonPath + '/roomApply/applyPageForManage', // 订单信息-分页列表

	// 订单审核管理
	applyVerify_verifyPageForManage: commonPath + '/applyVerify/verifyPageForManage', // 订单审核列表
	applyVerify_doVerifyApplyByManage: commonPath + '/applyVerify/doVerifyApplyByManage', // 订单id审核
	applyVerify_batchVerifyByManage: commonPath + '/applyVerify/batchVerifyByManage', // 管理端批量审核通过

	// 会务安排
	meetArrange_findApplyVerifyListWithPage: commonPath + '/meetArrange/findApplyVerifyListWithPage', // 会务安排分页列表
	meetArrange_doMeetArrange: commonPath + '/meetArrange/doMeetArrange', // 会务分配
	meetArrange_toMeetArrange: commonPath + '/meetArrange/toMeetArrange', // 回显本单位会务配置情况

	/**
	 * 会议服务
	 */

	// 申请单管理用户
	roomApply_applyPageForUser: commonPath + '/roomApply/applyPageForUser', // 申请单管理分页列表
	roomApply_getApplyById: commonPath + '/roomApply/getApplyById', // 申请单详情页数据回显
	roomApply_cancelApply: commonPath + '/roomApply/cancelApply', // 取消申请单
	roomApply_deleteApply: commonPath + '/roomApply/deleteApply', // 删除申请单
	evaluate_create: commonPath + '/evaluate/create', // 新增评价

	// 申请审核用户
	applyVerify_verifyPageForUser: commonPath + '/applyVerify/verifyPageForUser', // 申请审核列表
	applyVerify_doVerifyApplyByUser: commonPath + '/applyVerify/doVerifyApplyByUser', // 申请id审核
	applyVerify_batchVerifyByUser: commonPath + '/applyVerify/batchVerifyByUser', // 用户端批量审核申请单

	/**
	 * 财务结算
	 */

	// 结算统计
	settlement_detail_list: commonPath + '/settlement/detail/list', // 结算统计-制作结算单页面列表
	settlement_createBills: commonPath + '/settlement/createBills', // 创建结算单
	settlement_list: commonPath + '/settlement/list', // 结算统计-结算单管理
	settlement_detail: commonPath + '/settlement/detail/', // 结算统计详情
	settlement_changeState: commonPath + '/settlement/changeState/', // 结算统计发送
	settlement_butchUpdateState: commonPath + '/settlement/butchUpdateState/', // 批量修改结算单
	settlement_deleteSettlement: commonPath + '/settlement/deleteSettlement', // 删除结算单

	// 费用设置
	standard_standardList: commonPath + '/standard/standardList', // 费用标准列表
	standard_toCreateStandard: commonPath + '/standard/toCreateStandard', // 新增费用标准(跳转)
	standard_doCreateStandard: commonPath + '/standard/doCreateStandard', // 费用新增标准 提交
	standard_toUpdateStandard: commonPath + '/standard/toUpdateStandard', // 修改费用标准(跳转）
	standard_doUpdateStandard: commonPath + '/standard/doUpdateStandard', // 费用修改标准 提交
	standard_deleteStandard: commonPath + '/standard/deleteStandard/', // 费用标准删除

	// 费用模板
	standardTemplate_standardTemplateList: commonPath + '/standardTemplate/standardTemplateList', // 费用标准模板列表
	standardTemplate_createStandardTemplate: commonPath + '/standardTemplate/createStandardTemplate', // 新增费用标准模板
	standardTemplate_getStandardTemplateDetail: commonPath + '/standardTemplate/getStandardTemplateDetail', // 费用标准模板详情
	standardTemplate_updateStandardTemplate: commonPath + '/standardTemplate/updateStandardTemplate', // 修改费用标准模板
	standardTemplate_deleteStandardTemplate: commonPath + '/standardTemplate/deleteStandardTemplate/', // 删除费用标准模板

	//账户管理
	account_accountList: commonPath + '/account/accountList', // 账户管理列表
	account_toUpdateAccount: commonPath + '/account/toUpdateAccount', // 账户管理修改跳转
	account_doUpdateAccount: commonPath + '/account/doUpdateAccount', // 账户管理修改提交
	account_deleteAccount: commonPath + '/account/deleteAccount', // 账户管理删除

	// 客户管理
	customer_customerRoomPageList: commonPath + '/customer/customerRoomPageList', // 客户管理分页列表
	customer_toUpdateCustomerRoom: commonPath + '/customer/toUpdateCustomerRoom', // 客户管理修改跳转
	customer_doUpdateCustomerRoom: commonPath + '/customer/doUpdateCustomerRoom', // 客户管理修改提交

	/**
	 * 会议室管理
	 */

	// 会议室信息
	roomInfo_roomInfoPageList: commonPath + '/roomInfo/roomInfoPageList', // 会议室信息-列表
	roomInfo_doCreateRoomInfo: commonPath + '/roomInfo/doCreateRoomInfo', // 会议室信息-新增
	roomInfo_toUpdateRoomInfo: commonPath + '/roomInfo/toUpdateRoomInfo', // 会议室信息-修改回显
	roomInfo_doUpdateRoomInfo: commonPath + '/roomInfo/doUpdateRoomInfo', // 会议室信息-修改
	roomInfo_roomInfoDetail: commonPath + '/roomInfo/roomInfoDetail', // 会议室信息-详情
	roomInfo_deleteRoomInfo: commonPath + '/roomInfo/deleteRoomInfo/', // 会议室信息-删除

	// 设备信息
	equipInfo_equipPageList: commonPath + '/equipInfo/equipPageList', // 设备信息-列表
	equipInfo_createEquip: commonPath + '/equipInfo/createEquip', // 设备信息-新增
	equipInfo_toUpdateEquip: commonPath + '/equipInfo/toUpdateEquip', // 设备信息-修改回显
	equipInfo_doUpdateEquip: commonPath + '/equipInfo/doUpdateEquip', // 设备信息-修改
	equipInfo_deleteEquip: commonPath + '/equipInfo/deleteEquip/', // 设备信息-删除

	/**
	 * 统计分析
	 */

	// 预约统计
	meetingRoomStatistics_organMeetingApplyCountByYear: commonPath + '/meetingRoomStatistics/organMeetingApplyCountByYear', //  年度预约次数统计（次）
	meetingRoomStatistics_appointTotleByYear: commonPath + '/meetingRoomStatistics/appointTotleByYear', //  会议室预约次数统计
	meetingRoomStatistics_appointRoomTotleByYear: commonPath + '/meetingRoomStatistics/appointRoomTotleByYear', //  各会议室预约次数
	meetingRoomStatistics_appointDeptTotleByYear: commonPath + '/meetingRoomStatistics/appointDeptTotleByYear', // 客户预约次数排行榜

	/**
	 * 基础配置
	 */

	// 角色管理
	sysRole_getRoleList: commonPath + '/sysRole/getRoleList', // 角色管理-分页列表
	sysRole_addRole: commonPath + '/sysRole/addRole', // 角色管理-新增
	sysRole_updateRole: commonPath + '/sysRole/updateRole', // 角色管理-修改
	sysRole_deleteRole: commonPath + '/sysRole/deleteRole', // 角色管理-删除
	sysRole_toRoleBatchUser : commonPath + '/sysRole/toRoleBatchUser',//添加人员-跳转列表数据
	sysRole_doRoleBatchUser : commonPath + '/sysRole/doRoleBatchUser',//添加人员提交
	sysRole_toRoleBatchMenu : commonPath + '/sysRole/toRoleBatchMenu',//权限配置-跳转列表数据
	sysRole_doRoleBatchMenu : commonPath + '/sysRole/doRoleBatchMenu',//权限配置-提交


	// 审核配置
	verifyConfig_verifyConfigList: commonPath + '/verifyConfig/verifyConfigList', // 审核配置-列表
	verifyConfig_toAddApplyVerifyConfig: commonPath + '/verifyConfig/toAddApplyVerifyConfig', // 审核配置-添加跳转
	verifyConfig_doAddApplyVerifyConfig: commonPath + '/verifyConfig/doAddApplyVerifyConfig', // 审核配置-添加提交
	verifyConfig_toUpdateApplyVerifyConfig: commonPath + '/verifyConfig/toUpdateApplyVerifyConfig', // 审核配置-修改跳转
	verifyConfig_doUpdateApplyVerifyConfig: commonPath + '/verifyConfig/doUpdateApplyVerifyConfig', // 审核配置-修改提交
	verifyConfig_deleteVerifyConfig: commonPath + '/verifyConfig/deleteVerifyConfig', //审核配置-删除

	//审核配置-用户
	customerVerifyConfig_verifyConfigList: commonPath + '/customerVerifyConfig/verifyConfigList', // 审核配置-列表
	customerVerifyConfig_toAddApplyVerifyConfig: commonPath + '/customerVerifyConfig/toAddApplyVerifyConfig', // 审核配置-添加跳转
	customerVerifyConfig_doAddApplyVerifyConfig: commonPath + '/customerVerifyConfig/doAddApplyVerifyConfig', // 审核配置-添加提交
    customerVerifyConfig_toUpdateApplyVerifyConfig: commonPath + '/customerVerifyConfig/toUpdateApplyVerifyConfig', // 审核配置-修改跳转
	customerVerifyConfig_doUpdateApplyVerifyConfig: commonPath + '/customerVerifyConfig/doUpdateApplyVerifyConfig', // 审核配置-修改提交
	customerVerifyConfig_deleteVerifyConfig: commonPath + '/customerVerifyConfig/deleteVerifyConfig', //审核配置-删除

	// 看板配置
	boardConfig_BoardTemplateList: commonPath + '/boardConfig/BoardTemplateList', // 看板配置-详情
	boardConfig_doUpdateBoardTemplate: commonPath + '/boardConfig/doUpdateBoardTemplate', // 看板配置-修改
	boardConfig_doSaveBoardTemplate: commonPath + '/boardConfig/doSaveBoardTemplate', // 看板配置-新增
	//看板配置-子项
	boardConfig_getBoardDetailList: commonPath + '/boardConfig/getBoardDetailList', // 看板配置-子项详情
	boardConfig_doSaveBoardDetail: commonPath + '/boardConfig/doSaveBoardDetail', // 看板配置-子项-新增
	boardConfig_doUpdateBoardDetail: commonPath + '/boardConfig/doUpdateBoardDetail', // 看板配置-子项-修改
	boardConfig_deleteBoardDetail: commonPath + '/boardConfig/deleteBoardDetail', // 看板配置-子项-删除

	// 菜单管理
	sysMenu_getAllMenuTree: commonPath + '/sysMenu/getAllMenuTree', //菜单列表
	sysMenu_getParentMenuList:commonPath + '/sysMenu/getParentMenuList',//父菜单列表
	sysMenu_addMenu: commonPath + '/sysMenu/addMenu', //新增菜单
	sysMenu_editMenu : commonPath + '/sysMenu/editMenu',//修改菜单
	sysMenu_deleteMenu: commonPath + '/sysMenu/deleteMenu/',//删除菜单
	sysMenu_getLoginUserMenuTree: commonPath + '/sysMenu/getLoginUserMenuTree', // 获取登录用户菜单树

	// 会务配置
	managerService_serviceManagerList: commonPath + '/managerService/serviceManagerList', // 会务配置-列表
	managerService_doSaveServiceManager: commonPath + '/managerService/doSaveServiceManager', //保存会务配置

	// 预约统计
	statisticAnalysis_organMeetingApplyCountByYear: commonPath + '/meetingRoomStatistics/organMeetingApplyCountByYear', //  年度预约次数统计（次）
	statisticAnalysis_appointTotleByYear: commonPath + '/meetingRoomStatistics/appointTotleByYear', //  会议室预约次数统计
	statisticAnalysis_appointRoomTotleByYear: commonPath + '/meetingRoomStatistics/appointRoomTotleByYear', //  各会议室预约次数
	statisticAnalysis_appointDeptTotleByYear: commonPath + '/meetingRoomStatistics/appointDeptTotleByYear', // 客户预约次数排行榜
	//预约统计用户
	meetingRoomStatistics_toOrganMeetingApplyCountByYear: commonPath + '/meetingRoomStatistics/toOrganMeetingApplyCountByYear', // 年度预约次数统计（次）
	//预约统计-用户-自用
	meetingRoomStatistics_toOrganSelfMeetingApplyCountByYear: commonPath + '/meetingRoomStatistics/toOrganSelfMeetingApplyCountByYear', //年度预约次数统计（次）
	meetingRoomStatistics_applySelfTotleByYear: commonPath + '/meetingRoomStatistics/applySelfTotleByYear', //自用各部门预约统计分析

	/**
	 * 字典
	 */
	dict_sysDictsByCode: commonPath + '/sys/dict/sysDictsByCode', // 获取系统字典菜单

};
