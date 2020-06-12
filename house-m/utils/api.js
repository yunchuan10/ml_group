import paths from '@/utils/baseUrl'; // 后端地址
// 静态资源服务器地址
const path = paths.path();
const apiPath = paths.path() + '/house-service'; //测试环境
// const apiPath = paths.path() + '/mlyun-yys-service';
// const apiPath = paths.path() + '/mlyun-gcy-service';
// const apiPath = paths.path() + '/mlyun-lbf-service';
// const apiPath = paths.path() + "/ch-house-service"; //国产化
export default {
  // /**
  //  * 基础类接口
  //  */
  house_logout: path + '/house/logOut', //退出登录
  house_doLogin: path + '/house/doLogin', //登录
  house_auth: path + '/mlyun-auth/server/auth/login', //登录
  user_detail: apiPath + '/user/detail', //replace空白页接口
  memberUser_reqUserInfo: apiPath + '/memberUser/reqUserInfo', // 用户信息
  resources_getResources: apiPath + '/resources/getResources', // 左侧菜单
  flie_getUploadToken: apiPath + '/file/getUploadToken', // 上传 - 获取token
  yardSearch_headerArea: apiPath + '/yardSearch/headerArea', // 切换地区
  file_uploadBase64EncodedFile: apiPath + '/file/uploadBase64EncodedFile', // 上传PDF
  // resources_getDetail: apiPath + '/resources/getDetail', // 根据path 来判断一级菜单高亮

  //我的主页
  index_countApplyWait: apiPath + '/index/countApplyWait', // 我的主页 -待办查询
  index_countHouse: apiPath + '/index/countHouse', // 我的主页 -房产状态统计
  index_countUseHouse: apiPath + '/index/countUseHouse', // 我的主页 -总体使用统计

  // 办公用房首页
  index_queryAllData: apiPath + '/index/queryAllData', //办公用房首页数据统计
  index_getCountYard: apiPath + '/index/getCountYard', //办公用房首页-按院落查询-获取地图上的聚合统计
  index_getCountYardDetail: apiPath + '/index/getCountYardDetail', //办公用房首页-按院落查询-获取地图上院落详情
  index_getCountOrgan: apiPath + '/index/getCountOrgan', //办公用房首页-按单位查询-获取地图上的聚合统计
  index_getUseOrgan: apiPath + '/index/getUseOrgan', //办公用房首页-按单位查询-获取院落单位 左侧的单位列表
  index_countConfirmationRights: apiPath + '/index/countConfirmationRights', //办公用房首页-确权数据表

  //经营性房产首页2版
  index_getDealCountData: apiPath + '/index/getDealCountData', //经营性房产首页-数据统计
  index_getAssetsIncome: apiPath + '/index/getAssetsIncome', //经营性房产首页-资产收益
  index_getWarnRemind: apiPath + '/index/getWarnRemind', //经营性房产首页-预警提醒

  //平面图
  plan_getCourtyardTree: apiPath + '/plan/getCourtyardTree', //获取平面图 - 按院落 树型菜单
  plan_listRoom: apiPath + '/plan/listRoom', //获取平面图 - 房间列表信息
  plan_bindRoomWithPoints: apiPath + '/plan/bindRoomWithPoints', //获取平面图 - 绑定房间坐标
  plan_getOrganCourtyardTree: apiPath + '/plan/getOrganCourtyardTree', // 平面图-左侧树型菜单
  plan_getHasPlanPicStoreys: apiPath + '/plan/getHasPlanPicStoreys', // 平面图-获取楼层有哪些可复制兄弟楼层
  plan_cancelRoomWithPoints: apiPath + '/plan/cancelRoomWithPoints', // 平面图-取消楼层房间坐标
  plan_toBase64: apiPath + '/plan/toBase64', // 图片转base64编码
  plan_bindEmptyPoint: apiPath + '/plan/bindEmptyPoint', // 平面图-新增空置图形坐标
  plan_moveEmptyPoint: apiPath + '/plan/moveEmptyPoint', // 平面图-移动空置图形坐标
  plan_deleteEmptyPoint: apiPath + '/plan/deleteEmptyPoint', // 平面图-删除空置图形坐标
  plan_moveUsePoint: apiPath + '/plan/moveUsePoint', // 平面图-移动在用图形坐标

  // 基础信息
  courtYard_getAreaName: apiPath + '/courtYard/getAreaName', // 根据区域ID获取区域名称
  courtYard_query: apiPath + '/courtYard/query', // 院落管理 - 列表院落
  courtYard_export: apiPath + '/courtYard/export', // 院落管理 - 列表院落 - 导出
  courtYard_add: apiPath + '/courtYard/add', // 院落管理 - 新增院落
  courtYard_manageCompanyStatus: apiPath + '/courtYard/manageCompanyStatus', // 院落管理 - 新增院落-物业管理
  courtYard_delete: apiPath + '/courtYard/delete', // 院落管理 - 删除院落
  courtYard_update: apiPath + '/courtYard/update', // 院落管理 - 修改院落
  courtYard_getCourtySelect: apiPath + '/courtYard/getCourtySelect', // 院落管理 - 查询下拉框
  courtYard_queryDetail: apiPath + '/courtYard/queryDetail', //院落管理- 查询院落详情
  courtYard_updateDetail: apiPath + '/courtYard/updateDetail', // 楼座管理 - 修改院落详情获取
  floor_query: apiPath + '/floor/query', // 楼座管理 - 查询楼座
  floor_export: apiPath + '/floor/export', //楼座管理 - 查询楼座 - 导出
  floor_queryFloorSelect: apiPath + '/floor/queryFloorSelect', // 楼座管理 - 查询下拉框列表
  floor_getAddSelect: apiPath + '/floor/getAddSelect', // 楼座管理 - 新增楼座下拉框
  floor_updateDetail: apiPath + '/floor/updateDetail', // 楼座管理 - 修改-详情回显楼座
  floor_update: apiPath + '/floor/update', // 楼座管理 - 修改楼座
  floor_add: apiPath + '/floor/add', // 楼座管理 - 新增楼座
  floor_queryDetail: apiPath + '/floor/queryDetail', // 楼座管理 - 楼座详情
  floor_delete: apiPath + '/floor/delete', // 楼座管理 - 删除楼座
  storeys_query: apiPath + '/storeys/query', // 楼层管理 - 楼层列表
  storeys_export: apiPath + '/storeys/export', // 楼层管理 - 楼层列表 - 导出
  storeys_delete: apiPath + '/storeys/delete', // 楼层管理 - 删除楼层
  storeys_getStoreysNumSelect: apiPath + '/storeys/getStoreysNumSelect', // 楼层管理 - 新增楼层数量下拉框
  storeys_add: apiPath + '/storeys/add', // 楼层管理 - 新增楼层
  storeys_batchAdd: apiPath + '/storeys/batchAdd', // 楼层管理 - 批量新增楼层
  storeys_queryDetail: apiPath + '/storeys/queryDetail', // 楼层管理 - 详情
  storeys_updateDetail: apiPath + '/storeys/updateDetail', // 楼层管理 - 修改详情
  storeys_update: apiPath + '/storeys/update', // 楼层管理 - 修改楼层
  room_query: apiPath + '/room/query', // 房间管理 - 房间列表
  room_export: apiPath + '/room/export', // 房间管理 - 房间列表 - 导出
  room_getSelect: apiPath + '/room/getSelect', // 房间管理 - 房间列表
  room_add: apiPath + '/room/add', // 房间管理 - 创建房间
  room_update: apiPath + '/room/update', // 房间管理 - 修改房间
  room_updateDetail: apiPath + '/room/updateDetail', // 房间管理 - 房间详情
  room_delete: apiPath + '/room/delete', // 房间管理 - 删除房间
  room_queryDetail: apiPath + '/room/queryDetail', // 房间管理 - 房间详情
  room_getAssignSelect: apiPath + '/room/getAssignSelect', // 房间管理 - 分配房间模块下拉选
  room_assign: apiPath + '/room/assign', // 房间管理 - 分配房间
  room_cancelAssign: apiPath + '/room/cancelAssign', // 房间管理 - 取消已分配的房间
  room_downLoad: apiPath + '/room/downLoad', // 房间管理 - 批量导入 - 下载
  room_import: apiPath + '/room/import', // 房间管理 - 批量导入 - 上传
  floor_import: apiPath + '/floor/import', // 楼座管理 - 批量导入 - 上传

  // 权属管理
  ownershipFirst_updateDetail: apiPath + '/ownershipFirst/updateDetail', // 权属管理 - 权属详情
  ownershipFirst_doDelete: apiPath + '/ownershipFirst/doDelete', // 权属管理 - 删除
  ownershipFirst_list: apiPath + '/ownershipFirst/list', // 权属管理 - 权属列表页
  ownershipFirst_queryList: apiPath + '/ownershipFirst/queryList', // 权属管理 - 综合查询
  ownershipFirst_detail: apiPath + '/ownershipFirst/detail', // 权属管理 - 权属详情页
  ownershipTransfer_doAdd: apiPath + '/ownershipTransfer/doAdd', // 权属管理 - 产权转移
  ownershipFirst_queryOwnershipFirstSelect: apiPath + '/ownershipFirst/queryOwnershipFirstSelect', // 权属管理 - 下拉框
  ownershipFirst_doAdd: apiPath + '/ownershipFirst/doAdd', // 权属管理 - 新增权属登记
  ownershipFirst_doUpdate: apiPath + '/ownershipFirst/doUpdate', // 权属管理 - 修改权属
  ownershipFirst_queryFloor: apiPath + '/ownershipFirst/queryFloor', // 权属管理 - 根据floorId查询楼座信息

  // 权属管理 2.0
  landArchives_querySelect: apiPath + '/landArchives/querySelect', // 权属管理 - 土地档案下拉选
  landArchives_courtyardAddressList: apiPath + '/landArchives/courtyardAddressList', // 权属管理 - 选择坐落位置
  landArchives_detail: apiPath + '/landArchives/detail', // 权属管理 - 土地档案详情（修改土地档案详情获取）
  landArchives_doAdd: apiPath + '/landArchives/doAdd', // 权属管理 - 新增土地档案
  landArchives_doUpdate: apiPath + '/landArchives/doUpdate', // 权属管理 - 修改土地档案
  landArchives_landArchivesChartList: apiPath + '/landArchives/landArchivesChartList', // 权属管理 - 获取土地档案图表数据
  landArchives_landArchivesList: apiPath + '/landArchives/landArchivesList', // 权属管理 - 土地档案列表（导出）
  landArchives_doDelete: apiPath + '/landArchives/doDelete', // 权属管理 - 删除土地档案
  housePropertyArchives_housePropertyArchivesChartList: apiPath + '/housePropertyArchives/housePropertyArchivesChartList', // 权属管理 - 获取房产档案图表数据
  housePropertyArchives_doDelete: apiPath + '/housePropertyArchives/doDelete', // 权属管理 - 删除土地档案
  housePropertyArchives_housePropertyArchivesList: apiPath + '/housePropertyArchives/housePropertyArchivesList', // 权属管理 - 房产档案列表（导出）
  housePropertyArchives_doUpdate: apiPath + '/housePropertyArchives/doUpdate', // 权属管理 - 修改房产档案
  housePropertyArchives_detail: apiPath + '/housePropertyArchives/detail', // 权属管理 - 删除房产档案
  housePropertyArchives_doAdd: apiPath + '/housePropertyArchives/doAdd', // 权属管理 - 新增房产档案
  estateCertificate_doDelete: apiPath + '/estateCertificate/doDelete', // 权属管理 - 删除不动产档案
  estateCertificate_detail: apiPath + '/estateCertificate/detail', // 权属管理 - 不动产档案详情（修改不动产档案详情获取）
  estateCertificate_estateCertificateList: apiPath + '/estateCertificate/estateCertificateList', // 权属管理 - 不动产档案列表（导出）
  estateCertificate_doUpdate: apiPath + '/estateCertificate/doUpdate', // 权属管理 - 修改不动产档案
  estateCertificate_estateCertificateChartList: apiPath + '/estateCertificate/estateCertificateChartList', // 权属管理 - 获取不动产档案图表数据
  estateCertificate_doAdd: apiPath + '/estateCertificate/doAdd', // 权属管理 - 新增不动产档案
  ownershipParameter_ownershipParameterList: apiPath + '/ownershipParameter/ownershipParameterList', // 权属管理 - 权属台账列表（导出）
  ownershipParameter_estateList: apiPath + '/ownershipParameter/estateList', // 权属管理 - 权属台账列表（导出）
  ownershipParameter_houseList: apiPath + '/ownershipParameter/houseList', // 权属管理 - 权属台账列表（导出）
  ownershipParameter_landList: apiPath + '/ownershipParameter/landList', // 权属管理 - 权属台账列表（导出）
  no_certificate_getTypeList: apiPath + '/no-certificate/getTypeList', //未办证下拉选
  no_certificate_getCourtyardAddressList: apiPath + '/no-certificate/getCourtyardAddressList', //未办证获取地址坐落下拉
  no_certificate_getPages: apiPath + '/no-certificate/getPages', //未办证列表
  no_certificate_getWarrantSituationList: apiPath + '/no-certificate/getWarrantSituationList', //获取权属登记情况下拉
  no_certificate_add: apiPath + '/no-certificate/add', //新增未办证
  no_certificate_update: apiPath + '/no-certificate/update', //更新未办证
  no_certificate_detail: apiPath + '/no-certificate/detail', //未办证详情
  no_certificate_delete: apiPath + '/no-certificate/delete', //未办证删除

  // 综合查询
  yardSearch_yardTreeList: apiPath + '/yardSearch/yardTreeList', // 综合查询 - 按院落查询中,中间查询树的数据
  yardSearch_getYardata: apiPath + '/yardSearch/getYardata', // 综合查询 - 安院落查询获取三个table控件上的数据
  yardSearch_roomCount: apiPath + '/yardSearch/roomCount', // 综合查询 - 按院落查询模块,table1中echart图中所需的数据
  yardSearch_ownerCount: apiPath + '/yardSearch/ownerCount', // 综合查询 - 按院落查询,table3中echart图所需数据
  yardSearch_organCount: apiPath + '/yardSearch/organCount', // 综合查询 - 按院落查询模块,table2中echart图中所需的数据
  yardSearch_organList: apiPath + '/yardSearch/organList', //  综合查询 - 按院落查询模块,table2中表格信息
  yardSearch_roomList: apiPath + '/yardSearch/roomList', // 综合查询 - 按院落查询页面talbe1 中的房间列表数据获取
  organSearch_getOrganTree: apiPath + '/organSearch/getOrganTree', // 综合查询 - 按使用单位查询中,中间查询树的数据
  organSearch_organPageData: apiPath + '/organSearch/organPageData', // 综合查询 - 按使用单位查询获取三个table控件上的数据
  organSearch_table1Data: apiPath + '/organSearch/table1Data', // 综合查询 - 按使用单位查询模块,table1中下拉框的集合
  organSearch_getTable1Chart: apiPath + '/organSearch/getTable1Chart', // 综合查询 - 按使用单位查询模块,table1中echart图表所需数据
  organSearch_roomList: apiPath + '/organSearch/roomList', // 综合查询 - 按使用单位查询模块,table1中列表页
  organSearch_getBzNum: apiPath + '/organSearch/getBzNum', // 综合查询 - 按使用单位查询模块,table2中实际人数
  useSummary_getUserRoomAssignBase: apiPath + '/useSummary/getUserRoomAssignBase', // 房屋概览 - 每个房间使用状态（超标统计 ）
  useSummary_getOrganTree: apiPath + '/useSummary/getOrganTree', // 房屋概览 - 获取单位和人员树菜单

  dealhouse_queryStatusAndAcquisitionList: apiPath + '/dealhouse/queryStatusAndAcquisitionList', // 综合查询 - lable1 获取下拉选房屋状态和产权情况和闲置原因
  comprehensive_getHousePage: apiPath + '/comprehensive/getHousePage', //综合查询 - 按单位查询 - 房屋列表信息
  dealhouse_detail: apiPath + '/dealhouse/detail', // 综合查询 - 按单位查询 - 房屋列表 - 详情
  comprehensive_getContractPage: apiPath + '/comprehensive/getContractPage', // 综合查询 - 按单位查询 - 合同列表
  contract_queryContractStatus: apiPath + '/contract/queryContractStatus', // 综合查询 - 按单位查询 - 合同下拉状态
  rent_getContractRental: apiPath + '/rent/getContractRental', // 综合查询-按单位查询-租金入账情况

  comprehensive_getStreetListByRequest: apiPath + '/comprehensive/getStreetListByRequest', // 综合查询-按街道查询-左侧树结构
  comprehensive_getStreetTotalData: apiPath + '/comprehensive/getStreetTotalData', // 综合查询-按街道查询-获取合同、租金、房屋总计
  comprehensive_getStreetHousePage: apiPath + '/comprehensive/getStreetHousePage', // 综合查询-按街道查询-获取房屋信息列表
  comprehensive_getStreetHouseEchart: apiPath + '/comprehensive/getStreetHouseEchart', // 综合查询-按街道查询-获取房屋信息Echart图
  comprehensive_getStreetContractPage: apiPath + '/comprehensive/getStreetContractPage', // 综合查询-按街道查询-获取合同列表分页
  comprehensive_getStreetContractEchart: apiPath + '/comprehensive/getStreetContractEchart', // 综合查询-按街道查询-获取合同信息Echart图
  comprehensive_getStreetRentalPage: apiPath + '/comprehensive/getStreetRentalPage', // 综合查询-按街道查询-获取租金信息列表
  comprehensive_getStreetRentEchart: apiPath + '/comprehensive/getStreetRentEchart', // 综合查询-按街道查询-获取租金信息Echart图

  //综合查询2版
  yardSearch2_yardTreeList: apiPath + '/yardSearch2/yardTreeList', // 综合查询 - 按院落查询中,中间查询树的数据
  organSearch2_getOrganTree: apiPath + '/organSearch2/getOrganTree', // 综合查询 - 按使用单位查询中,中间查询树的数据
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
  organSearch2_getOrderStatus: apiPath + '/organSearch2/getOrderStatus', // 综合查询 - 按单位查询中,订单统计-订单状态下拉框
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
  organSearch2_getDutiesLevelSelect: apiPath + '/organSearch2/getDutiesLevelSelect', // 综合查询 - 按单位查询中,table1中人员信息职务级别下拉表

  // 合同管理 - 合同列表
  contract_getContractDetail: apiPath + '/contract/getContractDetail', //合同信息详情获取
  contract_getContractWithSubject: apiPath + '/contract/getContractWithSubject', // 合同管理-获取合同基本信息
  contract_getDealRoomInfoOfUpdate: apiPath + '/contract/getDealRoomInfoOfUpdate', // 合同管理-修改-获取合同信息-合同标的物
  contract_getContractProper: apiPath + '/contract/getContractProper', //合同管理-获取-合同正文
  contract_getContractImages: apiPath + '/contract/getContractImages', //合同管理-获取-合同附件
  contract_getContractRemind: apiPath + '/contract/getContractRemind', //合同管理-获取-合同到期提醒
  comprehensive_getRentalPage: apiPath + '/comprehensive/getRentalPage', //综合查询 - 按单位查询 - 租金列表
  rent_getRentalInformationSelect: apiPath + '/rent/getRentalInformationSelect', //综合查询 - 按单位查询 - 租金-状态查询下拉
  rent_getDetail: apiPath + '/rent/getDetail', //综合查询 - 按单位查询 - 租金列表 - 详情
  comprehensive_getHouseEchart: apiPath + '/comprehensive/getHouseEchart', //综合查询 - 按单位查询 - 获取 - 房屋Echart
  comprehensive_getContractEchart: apiPath + '/comprehensive/getContractEchart', //综合查询 - 按单位查询 - 获取 - 合同Echart
  comprehensive_getRentEchart: apiPath + '/comprehensive/getRentEchart', //综合查询 - 按单位查询 - 获取 - 租金Echart

  //使用管理
  certificateRoom_list: apiPath + '/certificateRoom/list', // 使用管理 - 发放凭证概览中列表页
  certificateRoom_detail: apiPath + '/certificateRoom/detail', // 使用管理 - 发放凭证详情
  certificateRoom_doAdd: apiPath + '/certificateRoom/doAdd', // 使用管理 - 发放凭证新增
  certificateRoom_getUserInfoByOrganId: apiPath + '/certificateRoom/getUserInfoByOrganId', // 使用管理 - 领取人/发放人下拉框
  certificateRoom_getOrganByOrganId: apiPath + '/certificateRoom/getOrganByOrganId', // 使用管理 - 领取单位下拉框
  certificateRoom_getUserInfoByUserId: apiPath + '/certificateRoom/getUserInfoByUserId', // 使用管理 - 根据userId获取人员联系方式
  certificateRoom_archivesList: apiPath + '/certificateRoom/archivesList', // 使用管理 - 打印凭证列表页
  certificateRoom_certificateRoomBaseDetail: apiPath + '/certificateRoom/certificateRoomBaseDetail', // 使用管理 - 办公用房明细列表页
  certificateRoom_doAddCertificatePrint: apiPath + '/certificateRoom/doAddCertificatePrint', // 使用管理 - 新增打印凭证
  certificateRoom_certificateOrganBase: apiPath + '/certificateRoom/certificateOrganBase', // 使用管理 - 样式预览单位基本信息以及办公用房编制核定情况

  //配置管理
  officeapply_getCourtyardRoomData: apiPath + '/officeapply/getCourtyardRoomData', //配置管理- 用房审批- 制定调配方案院落获取
  officeapply_roomList: apiPath + '/officeapply/roomList', //配置管理- 用房审批- 制定调配方案房间获取
  officeapply_completeHouseOfficeTask: apiPath + '/officeapply/completeHouseOfficeTask', //配置管理- 用房审批- 制定调配方案提交信息
  officeapply_getApplyDetail: apiPath + '/officeapply/getApplyDetail', // 用房审批 - 审批单详情回显
  officeapply_getDetail: apiPath + '/officeapply/getDetail', // 用房审批 - 申请单详情
  officeapply_watingApply: apiPath + '/officeapply/watingApply', // 用房审批 - 待处理
  officeapply_hisApply: apiPath + '/officeapply/hisApply', // 用房审批 - 已处理
  officeapply_getTotalApply: apiPath + '/officeapply/getTotalApply', // 查询待办和已办任务数量

  //配置管理2版 多套分配方案
  officeapply_addPlan: apiPath + '/officeapply/addPlan', // 新增/修改方案
  officeapply_addPlanRoom: apiPath + '/officeapply/addPlanRoom', //给方案增加房间
  officeapply_delPlan: apiPath + '/officeapply/delPlan', //删除分配方案
  officeapply_getPlanDetail: apiPath + '/officeapply/getPlanDetail', //刷新分配方案
  officeapply_getRoomSelect: apiPath + '/officeapply/getRoomSelect', //获取房间地址集合
  officeapply_listAccessApplyOrder: apiPath + '/officeapply/listAccessApplyOrder', //配置台账

  //处置利用
  handleapply_handleApplyList: apiPath + '/handleapply/handleApplyList', // 处置利用 - 处置申请列表
  handleapply_watingApprovalApplyList: apiPath + '/handleapply/watingApprovalApplyList', // 处置利用 - 处置待处理列表
  handleapply_doApprovalApplyList: apiPath + '/handleapply/doApprovalApplyList', // 处置利用 - 处置已处理列表
  handleapply_doApply: apiPath + '/handleapply/doApply', // 处置利用 - 处置利用申请单提交
  handleapply_doHandleApplyUpdate: apiPath + '/handleapply/doHandleApplyUpdate', // 处置利用 - 修改处置利用申请单
  handleapply_queryHouseCourtyardBaseList: apiPath + '/handleapply/queryHouseCourtyardBaseList', // 处置利用 - 处置利用申请单 根据organId获取所有的院落信息
  handleapply_queryHouseRoomBaseList: apiPath + '/handleapply/queryHouseRoomBaseList', // 处置利用 - 处置利用申请单 根据院落Id获取所有的闲置房间信息
  handleapply_getApprovalApplyDetailList: apiPath + '/handleapply/getApprovalApplyDetailList', // 处置利用 -审批- 处置申请单审批详情回显
  handleapply_detail: apiPath + '/handleapply/detail', // 处置利用 -处置审批- 详情
  handleapply_withdrawApply: apiPath + '/handleapply/withdrawApply', // 处置利用 -处置申请-撤回
  handleapply_queryHandleTypeAndOrderStatusList: apiPath + '/handleapply/queryHandleTypeAndOrderStatusList', // 处置利用 -获取下拉选处置方式和订单状态
  handleapply_updateDetail: apiPath + '/handleapply/updateDetail', // 处置利用 -处置申请修改获取详情
  handleapply_doUpdateRoomStatus: apiPath + '/handleapply/doUpdateRoomStatus', // 处置利用 -处置申请修改房间信息 删除

  handleapply_completeHandleApprovalTask: apiPath + '/handleapply/completeHandleApprovalTask', // 处置利用 -处置审批-审批提交
  handleapply_handlePerformList: apiPath + '/handleapply/handlePerformList', // 处置利用 -处置执行-列表
  handleapply_doHandlePerformResultEntry: apiPath + '/handleapply/doHandlePerformResultEntry', // 处置利用 -处置执行结果录入
  handleapply_handlePerformTableList: apiPath + '/handleapply/handlePerformTableList', // 处置利用 - 处置执行结果3个tab的值
  handleapply_handlePerformResultEntryDetail: apiPath + '/handleapply/handlePerformResultEntryDetail', // 处置利用 -处置执行-处置执行结果录入详情页面获取
  handleapply_handlePerformResultUpdateDetail: apiPath + '/handleapply/handlePerformResultUpdateDetail', // 处置利用 -处置执行-处置执行结果修改的详情页面获取
  handleapply_doUpdateHandlePerformResult: apiPath + '/handleapply/doUpdateHandlePerformResult', // 处置利用 -处置执行-处置执行结果修改
  handleapply_listAccessApplyOrder: apiPath + '/handleapply/listAccessApplyOrder', // 处置利用 -处置台账
  handleapply_listAccessHandlerResultOrder: apiPath + '/handleapply/listAccessHandlerResultOrder', // 处置利用-处置台账-处置结果信息

  // 3d图
  storeys_getFloorCount: apiPath + '/storeys/getFloorCount', // 3D图 -获取楼座下的楼层列表
  room_3dRoomDetail: apiPath + '/room/3dRoomDetail', // 3D图 -获取房间详情
  yardSearch_getViewUrl: apiPath + '/yardSearch/getViewUrl', // 3D图 -获取房间详情

  //统计分析
  aggregateUsage_aggregateUsageStatisticsAreaList: apiPath + '/aggregateUsage/aggregateUsageStatisticsAreaList', // 统计分析 - 总体使用统计-地区
  aggregateUsage_aggregateUsageStatisticsUserList: apiPath + '/aggregateUsage/aggregateUsageStatisticsUserList', // 统计分析 - 总体使用统计-人员
  aggregateUsage_aggregateUsageStatisticsRoomList: apiPath + '/aggregateUsage/aggregateUsageStatisticsRoomList', // 统计分析 - 总体使用统计-房间
  aggregateUsage_idleStatisticsAreaList: apiPath + '/aggregateUsage/idleStatisticsAreaList', // 统计分析 - 闲置情况统计-地区
  idle_execIdleRoomList: apiPath + '/idle/execIdleRoomList', // 统计分析 - 闲置情况统计-房间
  idle_execIdleCourtyardList: apiPath + '/idle/execIdleCourtyardList', // 统计分析 - 闲置情况统计-院落
  useSummary_findOrganDutiesByOrganId: apiPath + '/useSummary/findOrganDutiesByOrganId', // 统计分析 - 人员信息organId获取所有的职级
  aggregateUsage_getExcessiveAreaData: apiPath + '/aggregateUsage/getExcessiveAreaData', // 统计分析 - 超标统计-地区
  aggregateUsage_getExcessiveOrganData: apiPath + '/aggregateUsage/getExcessiveOrganData', // 统计分析 - 超标统计-单位
  aggregateUsage_getExcessivePersonData: apiPath + '/aggregateUsage/getExcessivePersonData', // 统计分析 - 超标统计-人员

  //统计分析2版

  totalusage_findEmptyRoomDetail: apiPath + '/totalusage/findEmptyRoomDetail', // 统计分析 - 总体使用统计-空置房间详情
  totalusage_execTotalUsageOrganList: apiPath + '/totalusage/execTotalUsageOrganList', // 统计分析 - 总体使用统计-单位
  totalusage_execTotalUsageEmptyRoomList: apiPath + '/totalusage/execTotalUsageEmptyRoomList', // 统计分析 - 总体使用统计-空置房间
  totalusage_execTotalUsageOfficeRoomList: apiPath + '/totalusage/execTotalUsageOfficeRoomList', // 统计分析 - 总体使用统计-办公室(服务，设备，附属，技术业务)房间
  totalusage_execTotalUsageSelect: apiPath + '/totalusage/execTotalUsageSelect', // 统计分析 - 总体使用统计-房间位置下拉框2版
  useManage_roomList: apiPath + '/useManage/roomList', // 统计分析-总体使用统计-总体使用明细表
  useManage_roomDetail: apiPath + '/useManage/roomDetail', // 统计分析-总体使用统计-总体使用明细表-详情
  totalusage_queryServiceRoomdetail: apiPath + '/totalusage/queryServiceRoomdetail', // 统计分析-总体使用统计-服务（设备，附属，技术业务）用房详情
  totalusage_findExceOfficeRoomDetail: apiPath + '/totalusage/findExceOfficeRoomDetail', // 统计分析-总体使用统计-办公室超标房间详情
  totalusage_findNoExceOfficeRoomDetail: apiPath + '/totalusage/findNoExceOfficeRoomDetail', // 统计分析-总体使用统计-办公室不超标房间详情
  excessvie_excessiveOrganList: apiPath + '/excessvie/excessiveOrganList', // 统计分析-超标情况统计
  excessvie_excessiveOfficeRoomList: apiPath + '/excessvie/excessiveOfficeRoomList', // 统计分析-办公室超标明细表
  excessvie_excessiveUserList: apiPath + '/excessvie/excessiveUserList', //统计分析-人员超标明细表
  excessvie_excessiveOtherRoomList: apiPath + '/excessvie/excessiveOtherRoomList', //统计分析--服务（设备，附属）用房明细表
  excessvie_getOrganLevel: apiPath + '/excessvie/getOrganLevel', //超标单位所在层级下拉选
  //超级搜索
  search_organFileList: apiPath + '/search/organFileList', // 超级搜索 - 根据单位查询文件列表查询
  search_userSearchList: apiPath + '/search/userSearchList', // 超级搜索 -根据人员查询 使用人
  search_queryUserDetail: apiPath + '/search/queryUserDetail', //超级搜索 -人员详情
  search_queryRoomDetail: apiPath + '/search/queryRoomDetail', //超级搜索 -房间详情
  search_officceHouseUserList: apiPath + '/search/officceHouseUserList', // 超级搜索 -办公用房使用列表
  search_fileList: apiPath + '/search/fileList', // 超级搜索 -文件搜索列表

  //超标预警
  warning_count: apiPath + '/warning/count', // 超级预警 -信息条数获取
  warning_list: apiPath + '/warning/list', // 超级预警 -信息列表
  warning_setting: apiPath + '/warning/setting', // 超级预警 -创建或者修改预警设置
  warning_getSetting: apiPath + '/warning/getSetting', // 超级预警 -获取超标预警设置参数
  warning_nochange: apiPath + '/warning/nochange', // 超级预警 -暂不整改
  warning_organList: apiPath + '/warning/organList', // 超级预警 -管理平台获取单位列表
  warning_getDutyLevel: apiPath + '/warning/getDutyLevel', // 获取职务级别
  warning_getWarningStatusDic: apiPath + '/warning/getWarningStatusDic', // 获取职务级别
  warning_userList: apiPath + '/warning/userList', // 超标预警列表页获取
  warning_doBack: apiPath + '/warning/doBack', // 超标预警备案
  warning_detail: apiPath + '/warning/detail', // 超标信息详情

  // 数据上报
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
  report_getAreaApply: apiPath + '/report/getAreaApply', // 获取下级区域申请单列表
  report_getOrganApply: apiPath + '/report/getOrganApply', // 获取本级单位审批单列表
  report_auditApplyOrder: apiPath + '/report/auditApplyOrder', // 审批申请单
  report_syncReportData: apiPath + '/report/syncReportData', // 获取数据
  user_register: apiPath + '/user/register', // 审批单个记录
  report_orderQuery: apiPath + '/report/orderQuery', // 数据查询
  report_addReportSetting: apiPath + '/report/addReportSetting', // 添加上报年度
  report_getFile: apiPath + '/report/getFile', // 获取上报附件
  report_getSettingList: apiPath + '/report/getSettingList', // 上报设置列表
  report_getSettingDetail: apiPath + '/report/getSettingDetail', // 获取上报设置详情

  //房屋维修
  // manageMaintain_queryOrderStatusAndBiddingType: apiPath + '/manageMaintain/queryOrderStatusAndBiddingType', // 房屋维修 -中标方式,申请单位,工程类型,被监管单位，年度下拉选
  yardSearch2_getTable3Select: apiPath + '/yardSearch2/getTable3Select', //  综合查询 - 工程类型,被监管单位，年度下拉选
  manageMaintain_queryOrderStatusAndBiddingType: apiPath + '/manageMaintain/queryOrderStatusAndBiddingType', // 房屋维修 -中标方式,申请单位,工程类型,被监管单位，年度下拉选

  manageMaintain_doApprovalApplyList: apiPath + '/manageMaintain/doApprovalApplyList', // 房屋维修 -已审批列表
  manageMaintain_watingApprovalApplyList: apiPath + '/manageMaintain/watingApprovalApplyList', // 房屋维修 -待审批列表
  manageMaintain_getApprovalApplyDetailList: apiPath + '/manageMaintain/getApprovalApplyDetailList', // 房屋维修 -审批详情获取
  manageMaintain_completeMaintainTask: apiPath + '/manageMaintain/completeMaintainTask', // 房屋维修 -年度计划审批
  userplatform_maintainResultDetail: apiPath + '/userplatform/maintainResultDetail', // 房屋维修 -维修台账详情
  manageMaintain_detail: apiPath + '/manageMaintain/detail', // 房屋维修 -年度计划详情
  manageMaintain_maintainResultDetail: apiPath + '/manageMaintain/maintainResultDetail', // 房屋维修 -维修结果录入详情获取
  manageMaintain_doMaintainResult: apiPath + '/manageMaintain/doMaintainResult', // 房屋维修 -维修结果录入
  manageMaintain_maintainResultList: apiPath + '/manageMaintain/maintainResultList', // 房屋维修 -维修台账待处理
  //房屋维修2 改版
  manageMaintain_doMaintainParameter: apiPath + '/manageMaintain/doMaintainParameter', // 房屋维修 -新建维修台账
  manageMaintain_updateMaintainParameter: apiPath + '/manageMaintain/updateMaintainParameter', // 房屋维修 -修改维修台账
  manageMaintain_queryPlanYear: apiPath + '/manageMaintain/queryPlanYear', // 房屋维修 -新建维修台账-获取年度计划下拉框
  manageMaintain_queryCourtyardAndFloorAndStoreysAndRooms: apiPath + '/manageMaintain/queryCourtyardAndFloorAndStoreysAndRooms', // 房屋维修 -新建维修台账-获取房屋信息
  // manageMaintain_maintainParameterList: apiPath + '/manageMaintain/maintainParameterList', // 房屋维修 -维修台账列表
  yardSearch2_listMaintain: apiPath + '/yardSearch2/listMaintain', // 综合查询 -维修台账列表
  manageMaintain_maintainParameterList: apiPath + '/manageMaintain/maintainParameterList', // 房屋维修 -维修台账列表

  manageMaintain_maintainParameterDetail: apiPath + '/manageMaintain/maintainParameterDetail', // 房屋维修 -维修台账修改详情回显
  manageMaintain_deleteMaintainParameter: apiPath + '/manageMaintain/deleteMaintainParameter', // 房屋维修 -删除维修台账
  userplatform_detail: apiPath + '/userplatform/detail', // 房屋维修 - 年度计划详情

  // 系统设置
  person_getDeptTree: apiPath + '/person/getDeptTree', // 获取部门树形菜单下拉框
  person_findOrganDutiesByOrganId: apiPath + '/person/findOrganDutiesByOrganId', // 获取职务级别下拉框
  resources_query: apiPath + '/resources/query', // 获取菜单
  resources_add: apiPath + '/resources/add', // 新增菜单
  resources_delete: apiPath + '/resources/delete', // 删除菜单
  resources_disabled: apiPath + '/resources/disabled', //禁用菜单
  resources_enable: apiPath + '/resources/enable', //启用菜单
  resources_getDetail: apiPath + '/resources/getDetail', // 菜单详情
  resources_getProjectCode: apiPath + '/resources/getProjectCode', //项目名称
  organ_query: apiPath + '/organ/query', // 获取菜单
  organ_add: apiPath + '/organ/add', // 新增菜单
  organ_delete: apiPath + '/organ/delete', // 删除菜单
  organ_getDetail: apiPath + '/organ/getDetail', // 菜单详情
  report_getArea: apiPath + '/report/getArea', // 获取区域ID
  organ_changeStatus: apiPath + '/organ/changeStatus', // 获取区域ID
  organ_configAdminOrgan: apiPath + '/organ/configAdminOrgan', // 设置主管单位
  organ_cancelAdminOrgan: apiPath + '/organ/cancelAdminOrgan', // 取消主管单位
  organ_configSupervisedOrgan: apiPath + '/organ/configSupervisedOrgan', // 设置被监管单位
  organ_cancelSupervisedOrgan: apiPath + '/organ/cancelSupervisedOrgan', // 取消被监管单位
  organ_getProDic: apiPath + '/organ/getProDic', // 获取字典
  organ_bindProject: apiPath + '/organ/bindProject', // 给单位绑定项目
  organ_getOrganProject: apiPath + '/organ/getOrganProject', // 获取单位绑定项目
  organ_getOrganLevel: apiPath + '/organ/getOrganLevel', // 获取单位级别列表
  role_add: apiPath + '/role/add', // 新增角色
  role_getDetail: apiPath + '/role/getDetail', // 新增角色
  role_delete: apiPath + '/role/delete', // 新增角色
  role_query: apiPath + '/role/query', // 角色列表
  person_query: apiPath + '/person/query', // 人员列表
  person_bindRole: apiPath + '/person/bindRole', // 绑定人员
  organ_getOrganDic: apiPath + '/organ/getOrganDic', //单位级别or行政区划级别下拉
  sysmanage_getDutiesLevelGroup: apiPath + '/sysmanage/getDutiesLevelGroup', // 获取办公室配置标准
  sysmanage_getAreaVerificationOfficeRoom: apiPath + '/sysmanage/getAreaVerificationOfficeRoom', // 获取办公室配置修改回显
  sysmanage_updateAreaVerificationOfficeRoom: apiPath + '/sysmanage/updateAreaVerificationOfficeRoom', // 修改办公室面积标准
  sysmanage_getAreaVerificationServiceRoom: apiPath + '/sysmanage/getAreaVerificationServiceRoom', // 获取服务用房核定面积配置标准
  sysmanage_updateAreaVerificationServiceRoom: apiPath + '/sysmanage/updateAreaVerificationServiceRoom', // 修改服务用房核定面积标准
  organ_detail: apiPath + '/organ/detail', // 获取单位详情接口
  sysmanage_getColourOfRoomType: apiPath + '/sysmanage/getColourOfRoomType', // 获取房间类型色值
  sysmanage_updateColourOfRoomType: apiPath + '/sysmanage/updateColourOfRoomType', // 修改房间类型色值
  sysmanage_getExcessParameter: apiPath + '/sysmanage/getExcessParameter', //获取超标参数配置
  sysmanage_updateExcessParameter: apiPath + '/sysmanage/updateExcessParameter', // 修改（新增）超标参数
  sysmanage_getColourOfUseOrgan: apiPath + '/sysmanage/getColourOfUseOrgan', // 获取使用单位配色色值
  sysmanage_updateColourOfUseOrgan: apiPath + '/sysmanage/updateColourOfUseOrgan', // 修改使用单位配色列表
  sysmanage_sysFormSetList: apiPath + '/sysmanage/sysFormSetList', // 获取表单设置列表
  sysmanage_updateFormSet: apiPath + '/sysmanage/updateFormSet', // 修改修改表单设置开关项
  organTree_listOrgan: apiPath + '/organTree/listOrgan', // 组织树管理
  organTree_addRoot: apiPath + '/organTree/addRoot', //保存组织
  organTree_delete: apiPath + '/organTree/delete', //删除组织列表
  organTree_getOrganTree: apiPath + '/organTree/getOrganTree', //组织列表原始树
  organTree_addChildren: apiPath + '/organTree/addChildren', //提交新增树节点

  //经营性房产 - 主页
  mainPage_getMainPageData: apiPath + '/mainPage/getMainPageData', // 主页
  mainPage_getHouseDate: apiPath + '/mainPage/getHouseDate', // 按单位和地址查询的房屋信息
  mainPage_getHouseDetail: apiPath + '/mainPage/getHouseDetail', //经营性房产查询的房屋信息详情

  //经营性房产 - 综合查询
  comprehensive_getOrganListByRequest: apiPath + '/comprehensive/getOrganListByRequest', // 按单位查询 - 树型菜单获取
  comprehensive_getTotalData: apiPath + '/comprehensive/getTotalData', // 按单位查询 - 获取房屋、合同、租金总计
  // comprehensive_getRentEchart: apiPath + '/comprehensive/getRentEchart', // 按单位查询 - 获取租金echart表

  //经营性房产 - 申请审批
  managehouserent_doApprovalApplyList: apiPath + '/managehouserent/doApprovalApplyList', // 申请审批列表 - 已审批
  managehouserent_watingApprovalApplyList: apiPath + '/managehouserent/watingApprovalApplyList', // 申请审批列表 - 待审批
  managehouserent_completeMaintainTask: apiPath + '/managehouserent/completeMaintainTask', // 申请审批列表 - 审核
  managehouserent_detail: apiPath + '/managehouserent/detail', // 申请审批列表 - 审批详情获取

  //经营性房产 - 统计分析
  dealstatistical_rentStatisticsOrganList: apiPath + '/dealstatistical/rentStatisticsOrganList', // 统计分析 - 地区列表获取
  dealstatistical_findSupervisedOrganListByOrganId: apiPath + '/dealstatistical/findSupervisedOrganListByOrganId', //统计分析 - 单位列表获取
  dealstatistical_rentStatisticsRoomList: apiPath + '/dealstatistical/rentStatisticsRoomList', //统计分析 - 出租中房间信息
  dealstatistical_rentStatisticsMoneyList: apiPath + '/dealstatistical/rentStatisticsMoneyList', //统计分析 - 总租金
  dealstatistical_doExporRentRoomList: apiPath + '/dealstatistical/doExporRentRoomList', //统计分析 - 出租中房间信息 - 导出

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
  manageLog_addLoginLog: apiPath + '/manageLog/addLoginLog', //系统日志 - 登陆日志 - 新增
  manageLog_pageOfLoginLog: apiPath + '/manageLog/pageOfLoginLog', //系统日志 - 登陆日志 - 列表
  manageLog_pageOfOperationLog: apiPath + '/manageLog/pageOfOperationLog', //系统日志 - 操作日志 - 列表
  manageLog_treeOfSysDic: apiPath + '/manageLog/treeOfSysDic', //系统日志 - 操作日志 - 查询项
  manageLog_addOperationLog: apiPath + '/manageLog/addOperationLog', //系统日志 - 操作日志 - 新增

  // 日常上报
  commonReport_listSetting: apiPath + '/commonReport/listSetting', // 上报设置列表
  commonReport_saveSetting: apiPath + '/commonReport/saveSetting', // 新增日常上报
  commonReport_getSettingDetail: apiPath + '/commonReport/getSettingDetail', // 日常上报详情
  commonReport_return: apiPath + '/commonReport/return', // 日常上报退回
  commonReport_listFile: apiPath + '/commonReport/listFile', // 日常上报下载表格
  commonReport_listMangeReport: apiPath + '/commonReport/listMangeReport', // 上报统计
  commonReport_commonReportStatus: apiPath + '/commonReport/commonReportStatus', // 上报状态查询

  // 建设项目分页列表
  buildingProject_pageOfBuildingProject: apiPath + '/buildingProject/pageOfBuildingProject', // 建设项目列表
  buildingProject_addBuildingProject: apiPath + '/buildingProject/addBuildingProject', // 新增建设项目
  buildingProject_updateBuildingProject: apiPath + '/buildingProject/updateBuildingProject', // 修改建设项目
  // buildingProject_deleteBuildiingProject: apiPath + '/buildingProject/deleteBuildiingProject', // 删除建设项目
  buildingProject_deleteBuildiingProject: apiPath + '/buildingProject/deleteBuildingProject', // 删除建设项目
  buildingProject_getBuildingProjectDetails: apiPath + '/buildingProject/getBuildingProjectDetails', // 建设项目详情
  buildingProject_addMilePost: apiPath + '/buildingProject/addMilePost', // 新增里程碑
  buildingProject_updateMilePost: apiPath + '/buildingProject/updateMilePost', // 修改里程碑
  buildingProject_getMilePostDetails: apiPath + '/buildingProject/getMilePostDetails', // 获取里程碑详请
  buildingProject_pageOfMilePost: apiPath + '/buildingProject/pageOfMilePost', // 里程碑列表分页
  buildingProject_deleteMilePost: apiPath + '/buildingProject/deleteMilePost', // 删除里程碑
  buildingProject_getBuildingProjectList: apiPath + '/buildingProject/getBuildingProjectList', // 获取建设项目下拉
  buildingProject_getHouseStructure: apiPath + '/buildingProject/getHouseStructure', // 获取建设项目建筑结构下拉

  //巡检管理
  specialInspection_specialInspectionList: apiPath + '/specialInspection/specialInspectionList', //巡检管理 - 列表
  specialInspection_querySelect: apiPath + '/specialInspection/querySelect', //巡检管理 - 列表查询-下拉
  specialInspection_detail: apiPath + '/specialInspection/detail', //巡检管理 - 列表查询-详情
  specialInspection_doAdd: apiPath + '/specialInspection/doAdd', //巡检管理 - 新增
  specialInspection_doUpdate: apiPath + '/specialInspection/doUpdate', //巡检管理 - 修改
  specialInspection_doDelete: apiPath + '/specialInspection/doDelete', //巡检管理 - 删除
};