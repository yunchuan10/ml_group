/**
 * 本地检索项
 */
import baseUtils from '@/utils/baseUtils' // 底层工具包
const ss = baseUtils.ss
const ls = baseUtils.ls

// 调度派车
const DISPATCH_CAR = [{
  show: true,
  label: '订单类型',
  sign: 'productType'
},
{
  show: true,
  label: '订单号',
  sign: 'orderSn'
},
{
  show: true,
  label: '订单状态',
  sign: 'orderStatus'
},
{
  show: true,
  label: '补录登记',
  sign: 'orderEntry'
},
{
  show: true,
  label: '用车单位',
  sign: 'clientName'
},
{
  show: true,
  label: '车牌号',
  sign: 'dispatchedCarNo'
},
{
  show: true,
  label: '用车时间',
  sign: 'carTime'
},
{
  show: false,
  label: '申请人',
  sign: 'applyCarName'
},
{
  show: false,
  label: '用车人',
  sign: 'userCarName'
},
{
  show: false,
  label: '用车范围',
  sign: 'useCarArea'
},
{
  show: false,
  label: '用车类型',
  sign: 'useCarType'
}
];

// 交车审核
const CHECK_CAR = [{
  show: true,
  label: '订单类型',
  sign: 'productType'
},
{
  show: true,
  label: '订单号',
  sign: 'orderSn'
},
{
  show: true,
  label: '交车状态',
  sign: 'status'
},
{
  show: true,
  label: '补录登记',
  sign: 'orderEntry'
},
{
  show: true,
  label: '车牌号',
  sign: 'carNo'
}
];

// 派车信息
const SEND_CAR = [{
  show: true,
  label: '订单类型',
  sign: 'productType'
},
{
  show: true,
  label: '订单号',
  sign: 'orderSn'
},
{
  show: true,
  label: '任务状态',
  sign: 'status'
},
{
  show: true,
  label: '补录登记',
  sign: 'orderEntry'
},
{
  show: true,
  label: '车牌号',
  sign: 'carNo'
},
{
  show: true,
  label: '驾驶员',
  sign: 'driver'
},
{
  show: false,
  label: '用车单位',
  sign: 'clientName'
},
{
  show: false,
  label: '用车类型',
  sign: 'useCarType'
},
{
  show: false,
  label: '预约用车时间',
  sign: 'appointmentTime'
},
{
  show: false,
  label: '转入单位',
  sign: 'transferInOrganName'
}
];

// 院落管理
const COURTYARD_INFO = [{
  id: 0,
  show: true,
  label: '院落3D图',
  sign: 'courtyardImage'
},
{
  id: 1,
  show: true,
  label: '院落名称',
  sign: 'courtyardName'
},
{
  id: 2,
  show: true,
  label: '院落地址',
  sign: 'courtyardAddress'
}
];

// 院落管理
const FLOOR_INFO = [{
  show: true,
  label: '院落名称',
  sign: 'courtyardName'
},
{
  show: true,
  label: '楼座名称',
  sign: 'bulidingName'
},
{
  show: true,
  label: '楼层名称',
  sign: 'floorName'
},
{
  show: true,
  label: '楼层平面图',
  sign: 'floorPlane'
},
{
  show: true,
  label: '楼层CAD图',
  sign: 'floorCad'
}
];

// 楼座管理
const BULIDING_INFO = [{
  show: true,
  label: '楼座名称',
  sign: 'bulidingName'
},
{
  show: true,
  label: '院落名称',
  sign: 'courtyardName'
},
{
  show: true,
  label: '建筑面积',
  sign: 'area'
},
{
  show: true,
  label: '建造年份',
  sign: 'floorPlane'
},

{
  show: true,
  label: '地上建筑层数',
  sign: 'upfloorNum'
},
{
  show: true,
  label: '地下建筑层数',
  sign: 'downfloorNum'
}
];
// 房间管理
const ROOM_INFO = [{
  show: true,
  label: '房间号',
  sign: 'courtyardName'
},
{
  show: true,
  label: '建筑面积（㎡）',
  sign: 'bulidingName'
},
{
  show: true,
  label: '使用面积（㎡）',
  sign: 'floorName'
},
{
  show: true,
  label: '使用方式',
  sign: 'floorPlane'
},
{
  show: true,
  label: '使用状态',
  sign: 'area'
},
{
  show: true,
  label: '使用单位',
  sign: 'upfloorNum'
}
];



const searchTableListBol = {
  state: { // 唯一数据源
    tableListBol: {
      DISPATCH_CAR, // 调度派车
      CHECK_CAR, // 交车审核
      SEND_CAR, // 派车信息
      COURTYARD_INFO, //院落管理
      FLOOR_INFO, //楼层管理
      BULIDING_INFO, //楼座管理
      ROOM_INFO, //房间信息

    }
  },
  getters: { // 过滤数据
    // 获取检索项缓存数据
    tableListBol: state => isTableListBol => {
      let tableListBol = JSON.parse(ls.getItem('zkml_searchTableListBol'));
      let data = {};
      try {
        data = tableListBol[isTableListBol];
        if (data) {
          state.tableListBol[isTableListBol] = data;
        } else {
          data = state.tableListBol[isTableListBol];
        }
      } catch (e) {
        data = state.tableListBol[isTableListBol];
      }
      return data;
    }
  },
  mutations: { // 修改数据
    searchTableListBolMutations(state, data) {
      state.tableListBol[data.name] = data.data;
      ls.setItem('zkml_searchTableListBol', JSON.stringify(state.tableListBol));
    }
  }
}

export default searchTableListBol;