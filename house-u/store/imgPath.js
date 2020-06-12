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
    jurisdiction: path + '/home/jurisdiction.png', //无权限图片
    loginIcon: path + '/menu/default-login-icon.png', // 默认登录人头像
    pencilSquareO: path + '/menu/pencil-square.png', // 用车申请
    bars: path + '/menu/bars.png', // 基础信息
    cog: path + '/menu/cog.png', // 系统管理
    unfold: path + '/menu/unfold.png', // 展开
    collapse: path + '/menu/collapse.png', // 收起
    queryroom: path + '/query/room.png', // 综合查询图标- 房间
    queryroomh: path + '/query/room-hover.png', // 综合查询图标- 房间
    querycompany: path + '/query/company.png', // 综合查询图标- 单位
    querycompanyh: path + '/query/company-hover.png', // 综合查询图标- 单位
    queryexceed: path + '/query/exceed-person.png', //综合查询图标 -核定面积-超标人数
    queryregister: path + '/query/register.png', // 综合查询图标- 登记
    queryregisterh: path + '/query/register-hover.png', // 综合查询图标- 登记
    queryaddress: path + '/query/address.png', // 综合查询图标- 单位地址
    queryaddressh: path + '/query/address-hover.png', // 综合查询图标- 单位地址
    querypeople: path + '/query/people.png', // 综合查询图标- 实际人数
    querypeopleh: path + '/query/people-hover.png', // 综合查询图标- 实际人数
    queryrepair: path + '/query/repair.png', // 综合查询图标- 维修次数
    queryrepairh: path + '/query/repair-hover.png', // 综合查询图标- 维修次数
    userstyle1: path + '/user/style-1.png', // 使用管理- 样式预览图1
    userstyle2: path + '/user/style-2.png', // 使用管理- 样式预览图2
    userstyle3: path + '/user/style-3.png', // 使用管理- 样式预览图3
    userstyle4: path + '/user/style-4.png', // 使用管理- 样式预览图4  
    querymianji: path + '/query/mianji.png', // 综合查询图标- 面积图标
    querymianjibul: path + '/query/mianji-bul.png', // 综合查询图标- 面积图标-bul
    querydingdan: path + '/query/dingdan.png', // 综合查询图标- 订单图标
    querydingdanbul: path + '/query/dingdan-bul.png', // 综合查询图标- 订单图标-bul
  }
};

export default imgPath;