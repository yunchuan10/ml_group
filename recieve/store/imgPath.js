/**
 * 图片引入
 */
const path = `${process.env.BASE_URL}static/icon/default`;

const imgPath = {
  state: {

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
    iconLeft: path + '/pic/icon-left.png', // 左
    iconRight: path + '/pic/icon-right.png', // 右
    picDefault: path + '/pic/pic-default.png', // 默认图片

    // 主题
    themeLeft: path + '/theme/icon-left.png', // 主题左
    themeRight: path + '/theme/icon-right.png', // 主题右
    themeBg: path + '/theme/theme-bg.png', // 主题介绍背景图

    // 徽风皖韵
    picTheme: path + '/pic/pic-column.png', // 栏目背景图
    iconTitle: path + '/pic/icon-title.png',

    programmeNull: path + '/pic/programme-null.png', // 子方案为空

  }
};

export default imgPath;