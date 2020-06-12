/**
 * 图片引入
 */
const path = `${process.env.BASE_URL}static/icon/default`

const imgPath = {
  state: {
    // 菜单
    nationalEblem: path + '/head/national-emblem.png', // 国徽
    // 对话框
    dialogCavert: path + '/dialog/dialog-cavert.png', // 警告
    dialogSuccess: path + '/dialog/dialog-success.png', // 成功
    dialogError: path + '/dialog/dialog-error.png', // 错误

    home: path + '/menu/home.png', // 我的主页
    homeitem1: path + '/index/home-item1.png', // 我的主页 -配置管理
    homeitem2: path + '/index/home-item2.png', // 我的主页 -处置利用   
    homeitem3: path + '/index/home-item3.png', // 我的主页 -数据上报
    homeitem4: path + '/index/home-item4.png', // 我的主页 -房屋维修 
    homeitem5: path + '/index/home-item5.png', // 我的主页 -出租申请   
    index_warndefault: path + '/index/warn_01.png', //我的主页- 预警提醒  
    index_waitdefault: path + '/index/wait_01.png', //我的主页- 待办事项
    loginIcon: path + '/menu/default-login-icon.png', // 默认登录人头像
    jurisdiction: path + '/home/jurisdiction.png', //无权限图片
    pencilSquareO: path + '/menu/pencil-square.png', // 用车申请
    bars: path + '/menu/bars.png', // 基础信息
    cog: path + '/menu/cog.png', // 系统管理
    unfold: path + '/menu/unfold.png', // 展开
    collapse: path + '/menu/collapse.png', // 收起
    yldefault: path + '/index/yl-default.png', // 首页- 院落默认图片
    closeIcon: path + '/index/closeIcon.png', //首页-地图上信息框的删除图标
    queryroom: path + '/query/room.png', // 综合查询图标- 房间
    queryroomh: path + '/query/room-hover.png', // 综合查询图标- 房间
    querycompany: path + '/query/company.png', // 综合查询图标- 单位
    indexdedault: path + '/index/data-default.png', // 首页地图上-没有信息默认图片
    querycompanyh: path + '/query/company-hover.png', // 综合查询图标- 单位
    queryregister: path + '/query/register.png', // 综合查询图标- 登记
    queryregisterh: path + '/query/register-hover.png', // 综合查询图标- 登记
    queryaddress: path + '/query/address.png', // 综合查询图标- 单位地址
    queryaddressh: path + '/query/address-hover.png', // 综合查询图标- 单位地址
    querypeople: path + '/query/people.png', // 综合查询图标- 实际人数
    querypeopleh: path + '/query/people-hover.png', // 综合查询图标- 实际人数
    querymianji: path + '/query/mianji.png', // 综合查询图标- 面积图标
    querymianjibul: path + '/query/mianji-bul.png', // 综合查询图标- 面积图标-bul
    querydingdan: path + '/query/dingdan.png', // 综合查询图标- 订单图标
    querydingdanbul: path + '/query/dingdan-bul.png', // 综合查询图标- 订单图标-bul
    queryrepair: path + '/query/repair.png', // 综合查询图标- 维修次数
    queryred: path + '/query/red.png', // 综合查询图标- 地图背景色
    queryyl: path + '/query/yl.jpg', // 综合查询- 院落图片
    queryrepairh: path + '/query/repair-hover.png', // 综合查询图标- 维修次数
    queryexceed: path + '/query/exceed-person.png', //综合查询图标 -核定面积-超标人数
    userstyle1: path + '/user/style-1.png', // 使用管理- 样式预览图1
    userstyle2: path + '/user/style-2.png', // 使用管理- 样式预览图2
    userstyle3: path + '/user/style-3.png', // 使用管理- 样式预览图3
    userstyle4: path + '/user/style-4.png', // 使用管理- 样式预览图4
    disposal_area: path + '/disposal/area.png', // 处置利用- 出租面积
    disposal_auction: path + '/disposal/auction.png', // 处置利用- 拍卖
    disposal_money: path + '/disposal/money.png', // 处置利用- 金额
    disposal_transfor: path + '/disposal/transfor.png', // 处置利用- 转换用途
    index_pointicon: path + '/index/point-icon.png', // 首页- 院落查询icon图标
    index_default: path + '/index/index-default.jpg', // 首页- 院落查询默认图片   
    //经营性房产图片
    house_num: path + '/operate/house-num.png', //经营性房产 - 综合查询-房屋重数量
    house_numh: path + '/operate/house-numh.png', //经营性房产 - 综合查询-房屋重数量
    contract_num: path + '/operate/contract-num.png', //经营性房产 - 综合查询-合同数量
    contract_numh: path + '/operate/contract-numh.png', //经营性房产 - 综合查询-合同数量
    accounting_rent: path + '/operate/accounting-rent.png', //经营性房产 - 综合查询-入账租金
    accounting_renth: path + '/operate/accounting-renth.png', //经营性房产 - 综合查询-入账租金
    //平面图图片
    plane_on: path + '/plane/plane-on.png', //平面图-开关图片-开
    plane_off: path + '/plane/plane-off.png', //平面图-开关图片-关
    plane_remark: path + '/plane/plane-remark.png', //平面图-快捷键说明    
  }
};

export default imgPath;