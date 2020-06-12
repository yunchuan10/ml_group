/**
 * 图片引入
 */
const path = `${process.env.BASE_URL}static/icon/default`;
const pathHeader = `${process.env.BASE_URL}static/images/head`;
const pathHome = `${process.env.BASE_URL}static/images/home`;

const imgPath = {
  namespaced:true,
  state: {
    pathHeader: pathHeader + '/national-emblem.png', // 国徽
    homePage: pathHome + '/home.png', // 我的主页图片
    meetRoom: pathHome + '/meet-room.jpg', // 我的主页图片
    userGroupFill: pathHome + '/user-group-fill.png', // 今日会议数量
    paperPlaneFill: pathHome + '/paper-plane-fill.png', // 我的主页图片
    edit: pathHome + '/edit.png', // 我的主页图片

    // 菜单
    nationalEblem: path + '/head/national-emblem.png', // 国徽
    // 对话框
    dialogCavert: path + '/dialog/dialog-cavert.png', // 警告
    dialogSuccess: path + '/dialog/dialog-success.png', // 成功
    dialogError: path + '/dialog/dialog-error.png', // 错误

    home: path + '/menu/home.png', // 我的主页
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
    queryregister: path + '/query/register.png', // 综合查询图标- 登记
    queryregisterh: path + '/query/register-hover.png', // 综合查询图标- 登记
    comimg: path + '/testImg/111.jpg',
    picDetail: path + '/pic/pic-detail.png', // 详情图标
    picEdit: path + '/pic/pic-edit.png', // 修改图标
    picDelete: path + '/pic/pic-delete.png', // 编辑图标
    picVr: path + '/pic/pic-vr.png', // VR图标

    // 预约统计
    iconStatistic: path + '/icon/icon-statistic.png', // 统计图标
    iconMoney: path + '/icon/icon-money.png', // 营收图标
    iconEquipment: path + '/icon/icon-equipment.png' // 设备图标
  }
};

export default imgPath;
