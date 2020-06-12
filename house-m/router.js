/**
 * 路由
 *
 * 该文件不须格式化代码
 *
 */
import Main from '@/views/Home';
import Home from '@/components/main/home';

export default [{
  path: '/login', // 默认登录页
  component: () => import('@/views/Login'),
},
  //平面图
{
  path: '/plane/Sketchpad',
  name: 'Sketchpad',
  component: () => import('@/components/plane/Sketchpad'),
},
{
  path: '/plane/Sketchpad-company', //按单位查询-平面图模式
  component: () => import('@/components/plane/Sketchpad-company'),
},
{
  path: '/plane/plane-print', //平面图打印
  name: 'print',
  component: () => import('@/components/plane/view/plane-print'),
},
{
  path: '/threeD', // 3D
  component: () => import('@/components/3dMap/threeD'),
},
{
  path: '/', // 主页面布局结构
  component: Main,
  children: [{
    path: '/', // 我的主页
    redirect: '/homepage',
  },
    // {
    //   path: 'home', // 我的主页
    //   component: Home
    // },
  {
    path: 'replace', // 空白页
    component: () => import('@/components/main/replace'),
  },
  {
    path: 'homepage', // 我的主页
    component: () => import('@/components/homepage/home-page'),
  },
  {
    path: 'home', // 办公用房-我的主页
    component: () => import('@/components/main/homemap/map-courtyard'),
  },
    // eslint-disable-next-line indent
      {
    path: 'jurisdiction', //无权限跳出页面
    component: () => import('@/views/jurisdiction'),
  },
    // {
    //   path: 'main/homemap/map-courtyard', // 院落地图
    //   component: () => import('@/components/main/homemap/map-courtyard')
    // },
  {
    path: 'main/homemap/map-company', // 按单位查询地图
    component: () => import('@/components/main/homemap/map-company'),
  },
  {
    path: 'skin', // 皮肤设置
    component: () => import('@/components/skin'),
  },
  {
    path: 'basic-information/front-manage/street-front', // 临街门面
    component: () => import('@/components/basic-information/front-manage/street-front'),
  },
  {
    path: 'basic-information/courtyard-manage/courtyard-list', // 院落管理
    component: () => import('@/components/basic-information/courtyard-manage/courtyard-list'),
  },
  {
    path: 'basic-information/courtyard-manage/courtyard-update/:type', // 院落管理修改及新增
    component: () => import('@/components/basic-information/courtyard-manage/courtyard-update'),
  },
  {
    path: 'basic-information/floor-manage/floor-list', // 楼层管理
    component: () => import('@/components/basic-information/floor-manage/floor-list'),
  },
  {
    path: 'basic-information/floor-manage/floor-update/:type', // 楼层管理-新增楼层/修改楼层
    component: () => import('@/components/basic-information/floor-manage/floor-update'),
  },
  {
    path: 'basic-information/building-manage/building-list', // 楼座管理
    component: () => import('@/components/basic-information/building-manage/building-list'),
  },
  {
    path: 'basic-information/building-manage/building-update/:type', // 楼座管理-新增楼座/修改楼座
    component: () => import('@/components/basic-information/building-manage/building-update'),
  },
  {
    path: 'basic-information/room-manage/room-list', // 房间管理
    component: () => import('@/components/basic-information/room-manage/room-list'),
  },
  {
    path: 'basic-information/room-manage/room-update/:type', // 房间新增与修改
    component: () => import('@/components/basic-information/room-manage/room-update'),
  },
  {
    path: 'basic-information/ownership-manage/ownership-list', // 权属管理
    component: () => import('@/components/basic-information/ownership-manage/ownership-list'),
  },
  {
    path: 'basic-information/ownership-manage/ownership-registration', // 权属管理-权属登记
    component: () => import('@/components/basic-information/ownership-manage/ownership-registration'),
  },
  {
    path: 'basic-information/ownership-manage/ownership-detail', // 权属管理-权属详情
    component: () => import('@/components/basic-information/ownership-manage/ownership-detail'),
  },
    // 权属管理2.0开始
  {
    path: '/ownership-manage/land-certificate/list', // 综合查询-权属管理-土地证
    component: () => import('@/components/ownership-manage-v2/land-certificate/list'),
  },
  {
    path: 'ownership-manage/land-certificate/update', // 综合查询-权属管理-编辑土地证
    component: () => import('@/components/ownership-manage-v2/land-certificate/update'),
  },
  {
    path: '/ownership-manage/house-certificate/list', // 综合查询-权属管理-房产证
    component: () => import('@/components/ownership-manage-v2/house-certificate/list'),
  },
  {
    path: 'ownership-manage/house-certificate/update', // 综合查询-权属管理-编辑房产证
    component: () => import('@/components/ownership-manage-v2/house-certificate/update'),
  },
  {
    path: '/ownership-manage/immovables-certificate/list', // 综合查询-权属管理-不动产证
    component: () => import('@/components/ownership-manage-v2/immovables-certificate/list'),
  },
  {
    path: 'ownership-manage/immovables-certificate/update', // 综合查询-权属管理-编辑不动产证
    component: () => import('@/components/ownership-manage-v2/immovables-certificate/update'),
  },
  {
    path: '/ownership-manage/ownership-account/account-list', // 综合查询-权属管理-台账列表
    component: () => import('@/components/ownership-manage-v2/ownership-account/account-list'),
  },
  {
    path: '/ownership-manage/undocumented/undocumented-list', // 未办证登记
    component: () => import('@/components/ownership-manage-v2/undocumented/undocumented-list'),
  },
  {
    path: '/ownership-manage/undocumented/addUndocumented/:type', // 未办证登记新增
    component: () => import('@/components/ownership-manage-v2/undocumented/addUndocumented'),
  },
  {
    path: '/ownership-manage/undocumented/undocumented-list', // 未办证登记
    component: () => import('@/components/ownership-manage-v2/undocumented/undocumented-list')
  },
  {
    path: '/ownership-manage/undocumented/addUndocumented/:type', // 未办证登记新增
    component: () => import('@/components/ownership-manage-v2/undocumented/addUndocumented')
  },
  {
    path: 'ownership-manage/ownership-account/detail-list', // 综合查询-权属管理-台账详情列表
    component: () => import('@/components/ownership-manage-v2/ownership-account/detail-list'),
  },
    // 权属管理2.0结束

    //综合查询2版
  {
    path: 'basic-information/query-manage/query-courtyard-list', // 综合查询-按院落查询
    component: () => import('@/components/basic-information/query-manage/query-courtyard-list'),
    children: [{
      path: '/', // 参数设置 - 默认 -派车单结束任务设置
      redirect: 'query-courtyard',
    },
    {
      path: 'query-courtyard',
      component: () => import('@/components/basic-information/query-manage/query-courtyard'),
      children: [{
        path: '/', // 参数设置 - 默认 -派车单结束任务设置
        redirect: 'roomnum',
      },
      {
        path: 'roomnum',
        component: () => import('@/components/basic-information/query-manage/view/roomnum'),
      },
      {
        path: 'companynum',
        component: () => import('@/components/basic-information/query-manage/view/companynum'),
      },
      {
        path: 'registernum',
        component: () => import('@/components/basic-information/query-manage/view/registernum'),
      },
      ],
    },
    {
      path: 'floor', // 综合查询-权属详情
      component: () => import('@/components/basic-information/query-manage/query-floor-list'),
    },
    ],
  },

  {
    path: 'basic-information/query-manage/query-company-list', // 综合查询-按使用单位查询
    component: () => import('@/components/basic-information/query-manage/query-company-list'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'addressnum',
    },
    {
      path: 'addressnum',
      component: () => import('@/components/basic-information/query-manage/view/addressnum'),
    },
    {
      path: 'realnum',
      component: () => import('@/components/basic-information/query-manage/view/realnum'),
    },
    {
      path: 'ordernum',
      component: () => import('@/components/basic-information/query-manage/view/ordernum'),
    },
    ],
  },
  {
    path: 'use-manage/use-list', //使用管理-发放凭证概览
    component: () => import('@/components/use-manage/use-list'),
    children: [{
      path: '', //使用管理-凭证发放概览
      component: () => import('@/components/use-manage/view/voucher-list'),
    },
    {
      path: 'voucher-list', //使用管理-凭证发放概览
      component: () => import('@/components/use-manage/view/voucher-list'),
    },
    {
      path: 'style-list', //使用管理-样式预览
      component: () => import('@/components/use-manage/view/style-list'),
    },
    {
      path: 'archives-list', //使用管理-档案库
      component: () => import('@/components/use-manage/view/archives-list'),
    },
    ],
  },
  {
    path: 'configure-manage/room-approval/approval-list', //配置管理-用房审批
    component: () => import('@/components/configure-manage/room-approval/approval-list'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'wait',
    },
    {
      path: 'wait',
      component: () => import('@/components/configure-manage/room-approval/wait'),
    },
    {
      path: 'plan',
      component: () => import('@/components/configure-manage/room-approval/plan'),
    },
    ],
  },
  {
    path: 'configure-manage/room-approval/allocation-scheme-first', //配置管理-制定调配方案
    component: () => import('@/components/configure-manage/room-approval/allocation-scheme-first'),
  },
  {
    path: 'configure-manage/room-approval/allocation-scheme', //配置管理-制定调配方案第二步
    component: () => import('@/components/configure-manage/room-approval/allocation-scheme'),
  },
    //配置管理2版
  {
    path: 'configure-manage-v2/room-approval/approval-list', //配置管理-用房审批
    component: () => import('@/components/configure-manage-v2/room-approval/approval-list'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'wait',
    },
    {
      path: 'wait',
      component: () => import('@/components/configure-manage-v2/room-approval/wait'),
    },
    {
      path: 'plan',
      component: () => import('@/components/configure-manage-v2/room-approval/plan'),
    },
    ],
  },
  {
    path: 'configure-manage-v2/room-approval/allocation-scheme', //配置管理-制定调配方案
    component: () => import('@/components/configure-manage-v2/room-approval/allocation-scheme-copy'),
  },
  {
    path: 'configure-manage-v2/configure-ledger/ledger-list', //配置管理-配置台账
    component: () => import('@/components/configure-manage-v2/configure-ledger/ledger-list'),
  },
    // {
    //   path: 'configure-manage/plan-approval/plan-list', //配置管理-方案审批
    //   component: () => import('@/components/configure-manage/plan-approval/plan-list')
    // },
  {
    path: 'disposal-manage/disposal-apply-list', //处置利用-处置申请
    component: () => import('@/components/disposal-manage/disposal-apply-list'),
  },
  {
    path: 'disposal-manage/disposal-approval-list', //处置利用-处置审批
    component: () => import('@/components/disposal-manage/disposal-approval-list'),
  },
  {
    path: 'disposal-manage/disposal-apply/:type', //处置利用-处置审批
    component: () => import('@/components/disposal-manage/disposal-apply'),
  },
  {
    path: 'disposal-manage/disposal-execution/execution-result/:type', //处置利用-处置执行结果录入
    component: () => import('@/components/disposal-manage/disposal-execution/execution-result'),
  },
  {
    path: 'disposal-manage/disposal-ledger/disposal-ledger-list', //处置利用-处置台账
    component: () => import('@/components/disposal-manage/disposal-ledger/disposal-ledger-list'),
  },
  {
    path: 'disposal-manage/disposal-ledger/ledger-rent-list', //处置利用-处置台账-出租房间列表
    component: () => import('@/components/disposal-manage/disposal-ledger/ledger-rent-list'),
  },
  {
    path: 'disposal-manage/disposal-execution/execution-list', //处置利用-处置执行
    component: () => import('@/components/disposal-manage/disposal-execution/execution-list'),
    children: [{
      path: '', //出租
      component: () => import('@/components/disposal-manage/disposal-execution/view/rent'),
    },
    {
      path: 'rent', //出租
      component: () => import('@/components/disposal-manage/disposal-execution/view/rent'),
    },
    {
      path: 'auction', //拍卖
      component: () => import('@/components/disposal-manage/disposal-execution/view/auction'),
    },
    {
      path: 'demolish', //拆除
      component: () => import('@/components/disposal-manage/disposal-execution/view/demolish'),
    },
    {
      path: 'purpose', //转换用途
      component: () => import('@/components/disposal-manage/disposal-execution/view/purpose'),
    },
    ],
  },
  {
    path: 'statistical-manage/overall-statistical/overall-list', //统计分析-总体使用统计-地区
    component: () => import('@/components/statistical-manage/overall-statistical/overall-list'),
  },
  {
    path: 'statistical-manage/overall-statistical/overall-company-list', //统计分析-总体使用统计-单位
    component: () => import('@/components/statistical-manage/overall-statistical/overall-company-list'),
  },
  {
    path: 'statistical-manage/overall-statistical/overall-person-list', //统计分析-总体使用统计-人员编制
    component: () => import('@/components/statistical-manage/overall-statistical/overall-person-list'),
  },
  {
    path: '/statistical-manage/overall-statistical/overall-vacantDetail', //统计分析--总体使用统计-空置房间信息
    component: () => import('@/components/statistical-manage/overall-statistical/overall-vacantDetail'),
  },
  {
    path: '/statistical-manage/overall-statistical/overall-total-list', //统计分析--总体使用统计-总体办公用房使用
    component: () => import('@/components/statistical-manage/overall-statistical/overall-total-list'),
  },
  {
    path: 'statistical-manage/idle-statistical/idle-list', //统计分析--闲置情况统计-地区
    component: () => import('@/components/statistical-manage/idle-statistical/idle-list'),
  },
  {
    path: 'statistical-manage/idle-statistical/idle-courtyard-list', //统计分析--闲置情况统计-院落
    component: () => import('@/components/statistical-manage/idle-statistical/idle-courtyard-list'),
  },
  {
    path: 'statistical-manage/idle-statistical/idle-room-list', //统计分析--闲置情况统计-房间信息
    component: () => import('@/components/statistical-manage/idle-statistical/idle-room-list'),
  },
  {
    path: 'statistical-manage/exceed-statistical/exceed-list', //统计分析--超标情况统计-地区
    component: () => import('@/components/statistical-manage/exceed-statistical/exceed-list'),
  },
  {
    path: 'statistical-manage/exceed-statistical/exceed-company-list', //统计分析--超标情况统计-单位
    component: () => import('@/components/statistical-manage/exceed-statistical/exceed-company-list'),
  },
  {
    path: 'statistical-manage/exceed-statistical/exceed-person-list', //统计分析--超标情况统计-人员信息
    component: () => import('@/components/statistical-manage/exceed-statistical/exceed-person-list'),
  },
  {
    path: 'statistical-manage/exceed-statistical/exceed-room-list', //统计分析--超标情况统计-明细表
    component: () => import('@/components/statistical-manage/exceed-statistical/exceed-room-list'),
  },
  {
    path: 'statistical-manage/exceed-statistical/exceed-housing-list', //统计分析--超标情况统计-明细表
    component: () => import('@/components/statistical-manage/exceed-statistical/exceed-housing-list'),
  },
    // 超标预警路由开始
  {
    path: 'warning-manage/organ-list', //超标预警-单位列表
    component: () => import('@/components/warning-manage/organ-list'),
  },
  {
    path: 'warning-manage/warning-list', //超标预警-列表
    component: () => import('@/components/warning-manage/warning-list'),
  },
    // 超标预警路由结束
  {
    path: 'super-search/search-list', //超级搜索--搜索的一级tab
    component: () => import('@/components/super-search/search-list'),
    children: [{
      path: '/', //使用人
      redirect: 'person-search-list',
    },
    {
      path: 'person-search-list', //人员
      component: () => import('@/components/super-search/person-search/person-search-list'),
      children: [{
        path: '/', //使用人
        redirect: 'user-search-list',
      },
      {
        path: 'user-search-list', //使用人
        component: () => import('@/components/super-search/person-search/user-search-list'),
      },
      {
        path: 'approval-search-list', //使用人
        component: () => import('@/components/super-search/person-search/approval-search-list'),
      },
      ],
    },
    {
      path: 'file-search-list', //文件集合
      component: () => import('@/components/super-search/file-search-list'),
    },
    {
      path: 'company-search-list', //单位
      component: () => import('@/components/super-search/company-search/company-search-list'),
      children: [{
        path: '/', //使用人
        redirect: 'used-search-list',
      },
      {
        path: 'used-search-list', //办公用房使用
        component: () => import('@/components/super-search/company-search/view/used-search-list'),
      },
      {
        path: 'deployment-search-list', //审批调配
        component: () => import('@/components/super-search/company-search/view/deployment-search-list'),
      },
      {
        path: 'repair-search-list', //大中修
        component: () => import('@/components/super-search/company-search/view/repair-search-list'),
      },
      {
        path: 'cfile-search-list', //文件
        component: () => import('@/components/super-search/company-search/view/cfile-search-list'),
      },
      ],
    },
    ],
  },
    // 数据上报
  {
    path: 'report-manage/config-list', // 数据上报参数设置列表
    component: () => import('@/components/report-manage/config/config-list'),
  },
  {
    path: 'report-manage/config-update', // 参数设置
    component: () => import('@/components/report-manage/config/config-update'),
  },
  {
    path: 'report-manage/report-list', // 数据上报列表
    component: () => import('@/components/report-manage/report-list'),
  },
  {
    path: 'report-manage/report',
    component: () => import('@/components/report-manage/report'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'administrative-division',
    },
    {
      path: 'administrative-division', // 行政区划信息
      component: () => import('@/components/report-manage/report/administrative-division'),
    },
    {
      path: 'office-house', // 办公用房
      component: () => import('@/components/report-manage/report/office-house'),
    },
    {
      path: 'technology-house', // 技术业务用房
      component: () => import('@/components/report-manage/report/technology-house'),
    },
    {
      path: 'construction-project', // 办公用房建设项目
      component: () => import('@/components/report-manage/report/construction-project'),
    },
    ],
  },
  {
    path: 'report-manage/report/office-house-update/:type', // 新增办公用房
    component: () => import('@/components/report-manage/report/office-house-manage/office-house-update'),
  },
  {
    path: 'report-manage/report/technology-house-update', // 新增技术业务用房
    component: () => import('@/components/report-manage/report/technology-house-manage/technology-house-update'),
  },
  {
    path: 'report-manage/report/construction-project-update', // 新增办公用房建设项目
    component: () => import('@/components/report-manage/report/construction-project-manage/construction-project-update'),
  },
  {
    path: 'report-manage/review', // 数据上报审核
    component: () => import('@/components/report-manage/review/review'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'next-level-list',
    },
    {
      path: 'next-level-list', // 下级单位审核
      component: () => import('@/components/report-manage/review/next-level-list'),
    },
    {
      path: 'same-level-list', // 统计单位审核
      component: () => import('@/components/report-manage/review/same-level-list'),
    },
    ],
  },
  {
    path: 'report-manage/search/search-list', // 数据上报数据查询列表
    component: () => import('@/components/report-manage/search/search-list'),
  },
    // 数据上报结束
  {
    path: 'inspection-manage/inspection', //巡检通知
    component: () => import('@/components/inspection-manage/inspection'),
  },
  {
    path: 'inspection-manage/inspection-list', //巡检通知列表
    component: () => import('@/components/inspection-manage/inspection-list'),
  },
  {
    path: 'maintenance-manage/annualplan-list', //房屋维修-年度计划
    component: () => import('@/components/maintenance-manage/annualplan/annualplan-list'),
  },
  {
    path: 'maintenance-manage/accounts-apply/:type', //房屋维修-维修台账录入
    component: () => import('@/components/maintenance-manage/accounts/accounts-apply'),
  },
  {
    path: 'maintenance-manage/accounts-list', //房屋维修-维修台账
    component: () => import('@/components/maintenance-manage/accounts/accounts-list'),
  },
  {
    path: 'inspection-manage/inspection', //巡检通知
    component: () => import('@/components/inspection-manage/inspection'),
  },
  {
    path: 'inspection-manage/inspection-list', //巡检通知列表
    component: () => import('@/components/inspection-manage/inspection-list'),
  },
  {
    path: 'maintenance-manage/annualplan-list', //房屋维修-年度计划
    component: () => import('@/components/maintenance-manage/annualplan/annualplan-list'),
  },
  {
    path: 'maintenance-manage/accounts-apply', //房屋维修-维修台账录入
    component: () => import('@/components/maintenance-manage/accounts/accounts-apply'),
  },
  {
    path: 'maintenance-manage/accounts-list', //房屋维修-维修台账
    component: () => import('@/components/maintenance-manage/accounts/accounts-list'),
  },
    // 公房系统整体权限配置，包括菜单，开户，权限
  {
    path: 'system-config/menu-list', //系统配置 - 菜单管理
    component: () => import('@/components/system-config-manage/menu-list'),
  },
  {
    path: 'system-config/organ-tree', //系统配置 - 组织树管理
    component: () => import('@/components/system-config-manage/organ-tree'),
  },
  {
    path: 'system-config/addorgan-tree', //系统配置 - 组织树管理
    component: () => import('@/components/system-config-manage/addorgan-tree'),
  },
  {
    path: 'system-config/account-list', //系统配置 - 账号管理
    component: () => import('@/components/system-config-manage/account-list'),
  },
  {
    path: 'system-config/character-list', //系统配置 - 角色管理
    component: () => import('@/components/system-config-manage/character-list'),
  },
  {
    path: 'system-config/user-list', //系统配置 - 人员管理
    component: () => import('@/components/system-config-manage/user-list'),
  },
  {
    path: 'system-config/user-area', // 系统配置 - 配置管理
    component: () => import('@/components/system-config-manage/user-area-manage/area-manage'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'office',
    },
    {
      path: 'office', // 办公用房
      component: () => import('@/components/system-config-manage/user-area-manage/office'),
    },
    {
      path: 'serve', // 服务方法
      component: () => import('@/components/system-config-manage/user-area-manage/serve'),
    },
    ],
  },
  {
    path: 'system-color/room-type', // 系统配置 - 系统配色
    component: () => import('@/components/system-color-manage/room-type-manage/type-manage'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'type',
    },
    {
      path: 'type', // 按照房间类型来配色
      component: () => import('@/components/system-color-manage/room-type-manage/type'),
    },
    {
      path: 'company', // 按照使用单位配色
      component: () => import('@/components/system-color-manage/room-type-manage/company'),
    },
    ],
  },
    //系统配置 - 超标参数
  {
    path: 'system-param/set-param', //系统设置 - 超标参数
    component: () => import('@/components/system-param/set-param'),
  },
    //系统配置 - 表单设置
  {
    path: 'system-form-manage/form-manage', //统配置 - 表单设置
    component: () => import('@/components/system-form-manage/form-manage'),
  },
    //经济性房产
  {
    path: 'operate/system-manage/supervise-unit/office-list', //系统设置 - 被监管单位
    component: () => import('@/components/operate/system-manage/supervise-unit/office-list'),
  },
  {
    path: 'operate/system-manage/reminder-list', //系统设置 - 到期提醒
    component: () => import('@/components/operate/system-manage/reminder-list'),
  },
  {
    path: 'operate/system-manage/cost-standard', //系统设置 - 费用标准
    component: () => import('@/components/operate/system-manage/cost-standard'),
  },
    //经济性房产 -申请审批
  {
    path: 'operate/approval-manage/rent-applydetail', //申请审批 - 出租申请-详情
    component: () => import('@/components/operate/approval-manage/rent-applydetail'),
  },
  {
    path: 'operate/approval-manage/rent-apply-list-approval', //申请审批 - 出租审批
    component: () => import('@/components/operate/approval-manage/rent-apply-list-approval'),
  },
  {
    path: 'operate/approval-manage/rent-apply-approval-info', //申请审批 - 审批
    component: () => import('@/components/operate/approval-manage/rent-apply-approval-info'),
  },
    //经济性房产 -合同管理
  {
    path: 'operate/contract-manage/contractinfo-list', //合同管理 - 合同信息
    component: () => import('@/components/operate/contract-manage/contractinfo-list'),
  },
    //经济性房产 -统计分析
  {
    path: 'operate/overall-statistical/overall-list', //经济性房产 -统计分析
    component: () => import('@/components/operate/overall-statistical/overall-list'),
  },
  {
    path: 'operate/overall-statistical/overall-company-list', //经济性房产 -统计分析-单位
    component: () => import('@/components/operate/overall-statistical/overall-company-list'),
  },
  {
    path: 'operate/overall-statistical/overall-person-list', //经济性房产 -统计分析-总房产
    component: () => import('@/components/operate/overall-statistical/overall-person-list'),
  },
  {
    path: 'operate/overall-statistical/overall-vacantDetail', //经济性房产 -统计分析-出租中
    component: () => import('@/components/operate/overall-statistical/overall-vacantDetail'),
  },
  {
    path: 'operate/overall-statistical/overall-totalRent', //经济性房产 -统计分析-总租金
    component: () => import('@/components/operate/overall-statistical/overall-totalRent'),
  },
  {
    path: 'operate/overall-statistical/overall-setAside', //经济性房产 -统计分析-闲置
    component: () => import('@/components/operate/overall-statistical/overall-setAside'),
  },
  {
    path: 'operate/home', //经济性房产-首页
    // component: () => import('@/components/home/home')
    component: () => import('@/components/operate/main/home'),
  },
  {
    path: 'operate/homemap/map-courtyard', // 经济性房产-首页-院落地图
    component: () => import('@/components/operate/main/homemap/map-courtyard'),
  },
  {
    path: 'operate/homemap/map-company', // 经济性房产-首页-按单位查询地图
    component: () => import('@/components/operate/main/homemap/map-company'),
  },
    // 经营性房产 - 综合查询
  {
    path: 'operate/query-manage/query-courtyard-list', // 综合查询-按院落查询
    component: () => import('@/components/operate/query-manage/query-courtyard-list'),
    children: [{
      path: '/', // 参数设置 - 默认 -派车单结束任务设置
      redirect: 'roomnum',
    },
    {
      path: 'roomnum',
      component: () => import('@/components/operate/query-manage/view/roomnum'),
    },
    {
      path: 'companynum',
      component: () => import('@/components/operate/query-manage/view/companynum'),
    },
    {
      path: 'registernum',
      component: () => import('@/components/operate/query-manage/view/registernum'),
    },
    ],
  },
  {
    path: 'operate/query-manage-street/query-street-list', // 综合查询-按街道查询
    component: () => import('@/components/operate/query-manage-street/query-street-list'),
    children: [{
      path: '/', // 参数设置 - 默认
      redirect: 'roomnum',
    },
    {
      path: 'roomnum',
      component: () => import('@/components/operate/query-manage-street/view/roomnum'),
    },
    {
      path: 'companynum',
      component: () => import('@/components/operate/query-manage-street/view/companynum'),
    },
    {
      path: 'registernum',
      component: () => import('@/components/operate/query-manage-street/view/registernum'),
    },
    ],
  },
    // 通知公告开始
  {
    path: '/notice-manage/notice-list', //  通知公告列表
    component: () => import('@/components/notice-manage/notice-list'),
  },
  {
    path: '/notice-manage/notice-list-send/:type', //  我发送的公告列表
    component: () => import('@/components/notice-manage/notice-list-send'),
  },
  {
    path: '/notice-manage/notice-update/:type', // 编辑通知公告
    component: () => import('@/components/notice-manage/notice-update'),
  },
  {
    path: '/notice-manage/detail', // 通知公告详情
    component: () => import('@/components/notice-manage/detail'),
  },
    // 通知公告结束
    // 系统日志
  {
    path: '/system-log/log-in-log', //登陆日志
    component: () => import('@/components/system-log/log-in-log'),
  },
  {
    path: '/system-log/operational-log', //操作日志
    component: () => import('@/components/system-log/operational-log'),
  },
    //建设项目管理
  {
    path: 'construction-manage/construction-project', // 建设项目管理
    component: () => import('@/components/construction-manage/construction-project'),
  },
  {
    path: 'construction-manage/construction-project-details', // 建设项目管理 - 详情
    component: () => import('@/components/construction-manage/construction-project-details'),
  },
  {
    path: 'construction-manage/new-construction', // 建设项目管理 - 新建
    component: () => import('@/components/construction-manage/new-construction'),
  },

  {
    path: 'milestone-manage/milestone-project', // 档案管理 - 里程碑管理
    component: () => import('@/components/milestone-manage/milestone-project'),
  },
  {
    path: 'milestone-manage/new-milestone', // 档案管理 - 里程碑管理 - 新建
    component: () => import('@/components/milestone-manage/new-milestone'),
  },
  {
    path: 'milestone-manage/milestone-details', // 档案管理 - 里程碑管理 - 详情
    component: () => import('@/components/milestone-manage/milestone-details'),
  },
    // 日常上报开始
  {
    path: 'daily-report/daily-report-list', // 日常上报设置列表
    component: () => import('@/components/daily-report/daily-report-list'),
  },
  {
    path: 'daily-report/update', // 日常上报填报
    component: () => import('@/components/daily-report/update'),
  },
  {
    path: 'daily-report/detail', // 日常上报详情
    component: () => import('@/components/daily-report/detail'),
    children: [{
      path: '/', // 参数设置-默认
      redirect: 'info',
    },
    {
      path: 'info',
      component: () => import('@/components/daily-report/detail/detail-info'),
    },
    {
      path: 'list',
      component: () => import('@/components/daily-report/detail/detail-list'),
    },
    ],
  },
    // 日常上报结束

    //巡检管理
  {
    path: 'operate/patrol-manage/special-inspection/:type', //  巡检管理 - 专项巡检
    component: () => import('@/components/operate/patrol-manage/special-inspection'),
  },
  {
    path: 'operate/patrol-manage/patrol-account', //  巡检管理 - 巡检台账
    component: () => import('@/components/operate/patrol-manage/patrol-account'),
  },
  {
    path: 'operate/patrol-manage/account-details', //  巡检管理 - 巡检台账 - 详情
    component: () => import('@/components/operate/patrol-manage/account-details'),
  },
  ],
},
];