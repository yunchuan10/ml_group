/**
 * 本地检索项
 */
// import baseUtils from '@/utils/baseUtils' // 底层工具包
import Vue from 'vue';
const ls = Vue.prototype.$ls;
// const ls = baseUtils.ls

// 管理平台
// 订单信息
const MEET_MANAGE = [
  { show: true, label: '订单号', sign: 'order' },
  { show: true, label: '会议名称', sign: 'meetName' },
  { show: true, label: '申请人', sign: 'applyName' },
  { show: true, label: '联系方式', sign: 'tel' },
  { show: true, label: '客户单位', sign: 'customerOrgan' },
  { show: true, label: '会议室', sign: 'meetRoom' },
  { show: true, label: '会议室类型', sign: 'meetRoomType' },
  { show: true, label: '使用时间', sign: 'useTime' },
  { show: true, label: '费用', sign: 'meetingCost' },
  { show: true, label: '单据状态', sign: 'status' },
  { show: true, label: '客服经理', sign: 'manage' }
];

// 结算统计
// 制作结算单
const FINANCE_STATISTIC = [
  { show: true, label: '订单号', sign: 'order' },
  { show: true, label: '会议名称', sign: 'meetName' },
  { show: true, label: '申请人', sign: 'applyName' },
  { show: true, label: '联系方式', sign: 'tel' },
  { show: true, label: '申请单位', sign: 'courtyardAddress' },
  { show: true, label: '会议室', sign: 'meetRoom' },
  { show: true, label: '会议室类型', sign: 'meetRoomType' },
  { show: true, label: '使用时间', sign: 'useTime' },
  { show: true, label: '费用', sign: 'meetingCost' },
  { show: true, label: '单据状态', sign: 'status' },
];
// 结算单管理
const FINANCE_MANAGE = [
  { show: true, label: '结算单号', sign: 'staNo' },
  { show: true, label: '开户行', sign: 'bank' },
  { show: true, label: '账号', sign: 'account' },
  { show: true, label: '编制人', sign: 'prepare' },
  { show: true, label: '编制时间', sign: 'prepareTime' },
  { show: true, label: '付款单位', sign: 'payerName' },
  { show: true, label: '总次数', sign: 'totalCites' },
  { show: true, label: '总费用', sign: 'totalCost' },
  { show: true, label: '状态', sign: 'status' },
];

// 客户管理
const CLIENT_MANAGE = [
  { show: true, label: '单位名称', sign: 'organizationName' },
  { show: true, label: '可使用会议室', sign: 'useRoom' }
];

// 设备信息
const DEVICE_LIST = [
  { show: true, label: '编号', sign: 'equipNo' },
  { show: true, label: '名称', sign: 'equipName' },
  { show: true, label: '型号', sign: 'equipModel' },
  { show: true, label: '品牌', sign: 'equipBrand' },
  { show: true, label: '价格（元）', sign: 'singlePrice' },
  { show: true, label: '购买时间', sign: 'buyTime' },
  { show: true, label: '状态', sign: 'status' },
  { show: true, label: '使用年限', sign: 'eqpUseYears' },
];

// 角色管理
const ROLE_MANAGE = [
  { show: true, label: '角色名称', sign: 'roleName' },
  { show: true, label: '已配置人数', sign: 'count' },
  { show: true, label: '添加时间', sign: 'dateCreated' },
  { show: true, label: '描述', sign: 'remark' }
];

// 菜单管理
const MENU_MANAGE = [
  { show: true, label: '菜单名称', sign: 'menuName' },
  { show: true, label: '菜单地址', sign: 'menuAddress' },
  { show: true, label: '排序值', sign: 'sort' }
];

// 用户平台
// 结算统计
const SETTLEMENT_STATISTICAL = [
  { show: true, label: '结算单号', sign: 'staNo' },
  { show: true, label: '开户行', sign: 'bankName' },
  { show: true, label: '账号', sign: 'bankNo' },
  { show: true, label: '编制人', sign: 'prepare' },
  { show: true, label: '发送时间', sign: 'prepareTime' },
  { show: true, label: '收款单位', sign: 'toOrganName' },
  { show: true, label: '状态', sign: 'status' },
];
// 服务中心申请单
const CONFERENCE_ORDER = [
  { show: true, label: '申请单号', sign: 'order' },
  { show: true, label: '会议名称', sign: 'meetName' },
  { show: true, label: '申请人', sign: 'applyName' },
  { show: true, label: '承办人', sign: 'agent' },
  { show: true, label: '部门', sign: 'customerOrgan' },
  { show: true, label: '服务单位', sign: 'serveUnit' },
  { show: true, label: '会议室', sign: 'meetRoom' },
  { show: true, label: '提交申请时间', sign: 'applyTime' },
  { show: true, label: '使用时间', sign: 'useTime' },
  { show: true, label: '费用', sign: 'meetingCost' },
  { show: true, label: '单据状态', sign: 'status' },
  { show: true, label: '客服经理', sign: 'manage' }
];
// 自有申请单
const OWN_ORDER = [
  { show: true, label: '申请单号', sign: 'order' },
  { show: true, label: '会议名称', sign: 'meetName' },
  { show: true, label: '申请人', sign: 'applyName' },
  { show: true, label: '部门', sign: 'customerOrgan' },
  { show: true, label: '提交申请时间', sign: 'applyTime' },
  { show: true, label: '使用时间', sign: 'useTime' },
  { show: true, label: '单据状态', sign: 'status' },
];

const searchTableListBol = {
  // 唯一数据源
  state: {
    tableListBol: {
      MEET_MANAGE, // 订单信息
      FINANCE_STATISTIC, //制作结算单
      FINANCE_MANAGE, //结算单管理
      CLIENT_MANAGE, //客户管理
      DEVICE_LIST, //设备信息
      ROLE_MANAGE, //角色管理
      MENU_MANAGE, //菜单管理

      SETTLEMENT_STATISTICAL, //结算统计
      CONFERENCE_ORDER, //服务中心申请单
      OWN_ORDER, //自有申请单

    }
  },
  // 过滤数据
  getters: {
    // 获取检索项缓存数据
    tableListBol: state => isTableListBol => {
      let tableListBol = ls.get(`${CON.cacheName}listTableListBol`);
      // let tableListBol = JSON.parse(ls.getItem('zkml_searchTableListBol'));
      let data = {};
      try {
        data = tableListBol[isTableListBol];
        if (data) state.tableListBol[isTableListBol] = data;
        else data = state.tableListBol[isTableListBol];
      } catch (e) {
        data = state.tableListBol[isTableListBol];
      }
      return data;
    }
  },
  // 修改数据
  mutations: {
    listTableListBolMutations(state, data) {
      state.tableListBol[data.name] = data.data;
      ls.set(`${CON.cacheName}listTableListBol`, state.tableListBol);
      // ls.setItem('zkml_searchTableListBol', JSON.stringify(state.tableListBol));
    }
  }
};

export default searchTableListBol;
