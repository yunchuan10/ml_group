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
  component: () => import('@/views/Login')
},
{
  path: '/plane/Sketchpad-department', // 分房调配-平面图模式
  component: () => import('@/components/plane/Sketchpad-department'),
},
{
  path: '/', // 主页面布局结构
  component: Main,
  children: [
    // {
    //   path: '/', // 我的主页
    //   redirect: '/home'
    // },
    {
      path: 'home', // 我的主页
      component: Home
    },
    {
      path: '/', // 我的主页
      redirect: '/general-overview/query-company-list'
    },  
    {
      path: 'replace', // 空白页
      component: () => import('@/components/main/replace')
    }, 
    {
      path: 'query-manage/query-company-list', // 房屋概览-房屋概览
      component: () => import('@/components/query-manage/query-company-list'),
    },
    {
      path: 'skin', // 皮肤设置
      component: () => import('@/components/skin')
    },
    {
      path: 'jurisdiction', //无权限跳出页面
      component: () => import('@/views/jurisdiction')
    },
    {
      path: 'apply-manage/room-approval/approval-list', //用房申请-用房申请
      component: () => import('@/components/apply-manage/room-approval/approval-list')
    },
    {
      path: 'apply-manage/room-approval/allocation-scheme-first', //用房申请-制定调配方案
      component: () => import('@/components/apply-manage/room-approval/allocation-scheme-first')
    },
    {
      path: 'apply-manage/room-approval/allocation-scheme', //用房申请-制定调配方案第二步
      component: () => import('@/components/apply-manage/room-approval/allocation-scheme')
    },
    {
      path: 'apply-manage/my-plan/myplan-list', //用房申请-申请审批
      component: () => import('@/components/apply-manage/my-plan/myplan-list'),
      children: [{
        path: '/', // 参数设置 - 默认
        redirect: 'wait'
      },
      {
        path: 'wait',
        component: () => import('@/components/apply-manage/my-plan/wait')
      },
      {
        path: 'plan',
        component: () => import('@/components/apply-manage/my-plan/plan')
      }
      ]
    },
    {
      path: 'query-manage/query-company-list', // 房屋概览-房屋概览
      component: () => import('@/components/query-manage/query-company-list'),
      children: [{
        path: '/', // 参数设置 - 默认
        redirect: 'addressnum'
      },
      {
        path: 'addressnum',
        component: () => import('@/components/query-manage/view/addressnum')
      },
      {
        path: 'realnum',
        component: () => import('@/components/query-manage/view/realnum')
      }
      ]
    },

    //总体概览
    {
      path: 'general-overview/query-company-list', // 总体概览-按使用单位查询
      component: () => import('@/components/general-overview/query-company-list'),
      children: [{
        path: '/', // 参数设置 - 默认
        redirect: 'addressnum'
      },
      {
        path: 'addressnum',
        component: () => import('@/components/general-overview/view/addressnum')
      },
      {
        path: 'realnum',
        component: () => import('@/components/general-overview/view/realnum')
      },
      {
        path: 'ordernum',
        component: () => import('@/components/general-overview/view/ordernum')
      }
      ]
    },


    {
      path: 'query-manage/view/allocation', //房屋概览-使用分配
      component: () => import('@/components/query-manage/view/allocation')
    },
    {
      path: 'maintenance-manage/annualplan-list', //房屋维修-年度计划
      component: () => import('@/components/maintenance-manage/annualplan/annualplan-list')
    },
    {
      path: 'maintenance-manage/annualplan-apply/:type', //房屋维修-年度计划申请
      component: () => import('@/components/maintenance-manage/annualplan/annualplan-apply')
    },
    {
      path: 'maintenance-manage/planexam-list', //房屋维修-计划审核
      component: () => import('@/components/maintenance-manage/planexam/planexam-list')
    },
    {
      path: 'maintenance-manage/accounts-list', //房屋维修-维修台账
      component: () => import('@/components/maintenance-manage/accounts/accounts-list')
    },
    // 公房系统整体权限配置，包括菜单，开户，权限
    {
      path: 'system-config/character-list', //系统配置 - 角色管理
      component: () => import('@/components/system-config-manage/character-list')
    },
    {
      path: 'system-config/user-list', //系统配置 - 人员管理
      component: () => import('@/components/system-config-manage/user-list')
    },
    {
      path: 'system-config/preparation_manage', //系统配置 - 人员编制管理
      component: () => import('@/components/system-config-manage/preparation_manage')
    },
    //使用管理
    {
      path: 'office-use-manage/deployment-list', //使用管理 -分房调配管理
      component: () => import('@/components/office-use-manage/deployment-list')
    },
    {
      path: 'office-use-manage/multi-room', //使用管理 -一人多室查询
      component: () => import('@/components/office-use-manage/multi-room')
    },
    {
      path: 'office-use-manage/exceed-room', //使用管理 -超标房间查询
      component: () => import('@/components/office-use-manage/exceed-room')
    },
    {
      path: 'office-use-manage/unmaned-office', //使用管理 -无人办公室查询
      component: () => import('@/components/office-use-manage/unmaned-office')
    },
    // 超标预警开始
    {
      path: 'excess-warning-manage/excess-warning-list', //超标预警 - 超标预警列表
      component: () => import('@/components/excess-warning-manage/excess-warning-list')
    },
    // 超标预警结束
    // 数据上报
    {
      path: 'report-manage/report-list', // 数据上报列表
      component: () => import('@/components/report-manage/report-list')
    },
    {
      path: 'report-manage/report',
      component: () => import('@/components/report-manage/report'),
      children: [{
        path: '/', // 参数设置 - 默认
        redirect: 'administrative-division'
      },
      {
        path: 'administrative-division', // 行政区划信息
        component: () => import('@/components/report-manage/report/administrative-division')
      },
      {
        path: 'office-house', // 办公用房
        component: () => import('@/components/report-manage/report/office-house')
      },
      {
        path: 'technology-house', // 技术业务用房
        component: () => import('@/components/report-manage/report/technology-house')
      },
      {
        path: 'construction-project', // 办公用房建设项目
        component: () => import('@/components/report-manage/report/construction-project')
      }
      ]
    },
    {
      path: 'report-manage/report/office-house-update/:type', // 新增办公用房
      component: () => import('@/components/report-manage/report/office-house-manage/office-house-update')
    },
    {
      path: 'report-manage/report/technology-house-update', // 新增技术业务用房
      component: () => import('@/components/report-manage/report/technology-house-manage/technology-house-update')
    },
    {
      path: 'report-manage/report/construction-project-update', // 新增办公用房建设项目
      component: () => import('@/components/report-manage/report/construction-project-manage/construction-project-update')
    },
    //经济性房产路由开始
    {
      path: 'operate/system-manage/supervise-unit/office-list', //系统设置 - 被监管单位
      component: () => import('@/components/operate/system-manage/supervise-unit/office-list')
    },
    {
      path: 'operate/system-manage/reminder-list', //系统设置 - 到期提醒
      component: () => import('@/components/operate/system-manage/reminder-list')
    },
    {
      path: 'operate/system-manage/cost-standard', //系统设置 - 费用标准
      component: () => import('@/components/operate/system-manage/cost-standard')
    },
    {
      path: 'operate/system-manage/data-dictionary', //系统设置 - 数据字典
      component: () => import('@/components/operate/system-manage/data-dictionary')
    },

    //经济性房产 -基础信息
    {
      path: 'operate/basic-information/basic-list', //基础信息 - 基础信息列表
      component: () => import('@/components/operate/basic-information/basic-list')
    },
    {
      path: 'operate/basic-information/basic-update/:type', //基础信息 - 新增经营性房产
      component: () => import('@/components/operate/basic-information/basic-update')
    },
    {
      path: 'operate/contract-manage/contract-detail', //基础信息 - 新增经营性房产-详情-合同详情
      component: () => import('@/components/operate/contract-manage/contract-detail')
    },

    //经济性房产 -申请审批
    {
      path: 'operate/approval-manage/rent-apply-list', //申请审批 - 出租申请列表
      component: () => import('@/components/operate/approval-manage/rent-apply-list')
    },
    {
      path: 'operate/approval-manage/rent-apply-list-sub/:type', //申请审批 - 出租申请
      component: () => import('@/components/operate/approval-manage/rent-apply-list-sub')
    },
    {
      path: 'operate/approval-manage/rent-applydetail', //申请审批 - 出租申请-详情
      component: () => import('@/components/operate/approval-manage/rent-applydetail')
    },
    {
      path: 'operate/approval-manage/rent-apply-list-approval', //申请审批 - 出租审批
      component: () => import('@/components/operate/approval-manage/rent-apply-list-approval')
    },
    {
      path: 'operate/approval-manage/rent-apply-approval-info', //申请审批 - 审批
      component: () => import('@/components/operate/approval-manage/rent-apply-approval-info')
    },

    //经济性房产 -合同管理
    {
      path: 'operate/contract-manage/contractinfo-list', //合同管理 - 合同信息
      component: () => import('@/components/operate/contract-manage/contractinfo-list')
    },
    {
      path: 'operate/contract-manage/contract-update/contract-add', //合同管理 - 新增-v2
      component: () => import('@/components/operate/contract-manage/contract-update/contract-add')
    },
    {
      path: 'operate/contract-manage/contract-update/contract-tab', //合同管理 - 新增合同
      component: () => import('@/components/operate/contract-manage/contract-update/contract-tab'),
      children: [{
        path: '', //基本信息
        component: () => import('@/components/operate/contract-manage/contract-update/view/info')
      },
      {
        path: 'info', //基本信息
        component: () => import('@/components/operate/contract-manage/contract-update/view/info')
      },
      {
        path: 'content', //合同正文
        component: () => import('@/components/operate/contract-manage/contract-update/view/content')
      },
      {
        path: 'remind', //合同到期提醒
        component: () => import('@/components/operate/contract-manage/contract-update/view/remind')
      },
      {
        path: 'rental', //租金入账情况
        component: () => import('@/components/operate/contract-manage/contract-update/view/rental')
      },
      {
        path: 'file', //附件
        component: () => import('@/components/operate/contract-manage/contract-update/view/file')
      }
      ]
    },

    //经济性房产 -租金管理
    {
      path: '/operate/reprises-manage/reprises-list', //租金管理 - 租金管理列表
      component: () => import('@/components/operate/reprises-manage/reprises-list')
    },
    {
      path: '/operate/reprises-manage/reprises-applydetail', //租金管理 - 租金管理列表
      component: () => import('@/components/operate/reprises-manage/reprises-applydetail')
    },
    //经济性房产 -承租人管理
    {
      path: 'operate/lessee-manage/lessee-list', //合同管理 - 承租人管理列表
      component: () => import('@/components/operate/lessee-manage/lessee-list')
    },
    {
      path: 'operate/lessee-manage/lessee-update/:type', //合同管理 - 新增承租人 /修改承租人
      component: () => import('@/components/operate/lessee-manage/lessee-update')
    },
    {
      path: 'operate/lessee-manage/blacklist-list', //合同管理 - 黑名单管理
      component: () => import('@/components/operate/lessee-manage/blacklist-list')
    },
    {
      path: 'operate/lessee-manage/blacklist-contract-detail', //合同管理 - 黑名单详情-合同信息详情
      component: () => import('@/components/operate/lessee-manage/blacklist-contract-detail')
    },
    {
      path: 'operate/query-manage/query-courtyard-list', // 综合查询-按院落查询
      component: () => import('@/components/operate/query-manage/query-courtyard-list'),
      children: [{
        path: '/', // 参数设置 - 默认 -派车单结束任务设置
        redirect: 'roomnum'
      },
      {
        path: 'roomnum',
        component: () => import('@/components/operate//query-manage/view/roomnum')
      },
      {
        path: 'companynum',
        component: () => import('@/components/operate//query-manage/view/companynum')
      },
      {
        path: 'registernum',
        component: () => import('@/components/operate//query-manage/view/registernum')
      }
      ]
    },
    {
      path: 'operate/query-manage/query-company-list', // 综合查询-按使用单位查询
      component: () => import('@/components/operate/query-manage/query-company-list'),
      children: [{
        path: '/', // 参数设置 - 默认
        redirect: 'addressnum'
      },
      {
        path: 'addressnum',
        component: () => import('@/components/operate/query-manage/view/addressnum')
      },
      {
        path: 'realnum',
        component: () => import('@/components/operate/query-manage/view/realnum')
      },
      {
        path: 'repairtimes',
        component: () => import('@/components/operate/query-manage/view/repairtimes')
      }
      ]
    },

    // 通知公告开始
    {
      path: '/notice-manage/notice-list', //  通知公告列表
      component: () => import('@/components/notice-manage/notice-list')
    },
    {
      path: '/notice-manage/notice-list-send/:type', //  我发送的公告列表
      component: () => import('@/components/notice-manage/notice-list-send')
    },
    {
      path: '/notice-manage/notice-update/:type', // 编辑通知公告
      component: () => import('@/components/notice-manage/notice-update')
    },
    {
      path: '/notice-manage/detail', // 通知公告详情
      component: () => import('@/components/notice-manage/detail')
    },
    // 通知公告结束
    // 系统日志
    {
      path: 'system-log/log-in-log', //登陆日志
      component: () => import('@/components/system-log/log-in-log')
    },
    {
      path: 'system-log/operational-log', //操作日志
      component: () => import('@/components/system-log/operational-log')
    },
    //档案管理
    {
      path: 'operate/archives-manage/archives', // 档案管理
      component: () => import('@/components/operate//archives-manage/archives'),
      children: [{
        path: '/', // 参数设置 - 默认 -档案管理 - 列表
        redirect: 'list-of-files'
      },
      {
        path: 'list-of-files',
        component: () => import('@/components/operate/archives-manage/view/list-of-files')
      }
      ]
    },
    {
      path: 'file-manage/add-file-manage', // 档案管理 - 新建档案
      component: () => import('@/components/file-manage/add-file-manage')
    },
    // 日常上报开始
    {
      path: 'daily-report/report-list', // 日常上报设置列表
      component: () => import('@/components/daily-report/report-list')
    },
    {
      path: 'daily-report/detail', // 日常上报详情
      component: () => import('@/components/daily-report/detail'),
      children: [{
        path: '/', // 参数设置 - 默认
        redirect: 'info'
      },
      {
        path: 'info',
        component: () => import('@/components/daily-report/detail/detail-info')
      },
      {
        path: 'history',
        component: () => import('@/components/daily-report/detail/history-info')
      }
      ]
    },
    // 日常上报结束
  ]
}
];