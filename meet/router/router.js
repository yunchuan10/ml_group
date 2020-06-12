/**
 * 路由
 */

import HOME from '@/views/Home';

export default [
  {
    path: '/login', // 默认登录页
    component: () => import('@/views/Login')
  }, {
    path: '/',
    component: HOME,
    children: [{
      path: '', // 我的主页
      redirect: '/home'
    }, {
      name: 'home', // 我的主页
      path: 'home',
      component: () => import('@/components/home/home')
    }, {
      name: 'calendar-list', // 会议管理-会议看板
      path: 'meet-manage/calendar-list',
      component: () => import('@/components/meet-manage/calendar-list')
    }, {
      name: 'application-order', // 会议管理-会议室申请单新增/修改
      path: 'meet-manage/application-order/:applyId',
      component: () => import('@/components/meet-manage/application-order')
    }, {
      name: 'order-list', // 会议管理-订单信息
      path: 'meet-manage/order-list',
      component: () => import('@/components/meet-manage/order-list')
    }, {
      path: 'meet-manage/review-list', // 会议管理-订单审核
      name: 'review-list',
      component: () => import('@/components/meet-manage/review-list')
    }, {
      path: 'meet-manage/conference-list', // 会议管理-会务安排
      component: () => import('@/components/meet-manage/conference-list')
    }, {
      name: 'conference-service', // 会议服务-会务中心会议室
      path: 'meet-service/conference-service',
      component: () => import('@/components/meet-service/conference-service')
    }, {
      path: 'meet-service/free-meet', // 会议服务-自有会议室
      component: () => import('@/components/meet-service/free-meet')
    }, {
      name: 'application-order-user', // 会议服务-用户中心申请单新增/修改
      path: 'meet-service/application-order-user/:applyId',
      component: () => import('@/components/meet-service/application-order-user')
    }, {
      name: 'apply-manage', // 会议服务-申请单管理
      path: 'meet-service/apply-manage',
      component: () => import('@/components/meet-service/apply-manage'),
      children: [{
        name: 'conference-order', // 会议服务-申请单管理-会务中心订单
        path: 'conference-order',
        component: () => import('@/components/meet-service/apply-manage/conference-order')
      }, {
        name: 'own-order', // 会议服务-申请单管理-自有订单
        path: 'own-order',
        component: () => import('@/components/meet-service/apply-manage/own-order')
      }]
    }, {
      name: 'meet-summary', // 会议服务-申请单管理-会议纪要
      path: 'meet-service/meet-summary',
      component: () => import('@/components/meet-service/meet-summary')
    }, {
      name: 'apply-review', // 会议服务-申请审核
      path: 'meet-service/apply-review',
      component: () => import('@/components/meet-service/apply-review')
    }, {
      path: 'finance-manage/finance-statistic', // 财务结算-结算统计
      component: () => import('@/components/finance-manage/finance-statistic')
    }, {
      path: 'finance-manage/finance-statistic-user', // 财务结算-结算统计用户
      component: () => import('@/components/finance-manage/finance-statistic-user')
    }, {
      path: 'finance-manage/fee-set', // 财务结算-费用设置
      component: () => import('@/components/finance-manage/fee-set')
    }, {
      path: 'finance-manage/fee-add', // 财务结算-费用新增修改
      name:'fee-add',
      component: () => import('@/components/finance-manage/fee-add')
    }, {
      path: 'finance-manage/account-manage', // 财务结算-账户管理
      component: () => import('@/components/finance-manage/account-manage')
    }, {
      path: 'finance-manage/client-manage', // 财务结算-客户管理
      component: () => import('@/components/finance-manage/client-manage')
    }, {
      name: 'meet-room-list',
      path: 'meet-room-manage/meet-room-list', // 会议室管理-会议室信息
      component: () => import('@/components/meet-room-manage/meet-room-list')
    }, {
      name: 'meet-room',
      path: 'meet-room-manage/meet-room-list/meet-room/:type', // 会议室管理-会议室信息-新增/修改
      component: () => import('@/components/meet-room-manage/meet-room-list/meet-room')
      // }, {
      //   path: 'meet-apply/meet-apply', // 会议室管理-新增会议
      //   component: () => import('@/components/meet-apply/meet-apply')
    }, {
      name: 'device-list',
      path: 'meet-room-manage/device-list', // 会议室管理-设施信息
      component: () => import('@/components/meet-room-manage/device-list')
    }, {
      name: 'device',
      path: 'meet-room-manage/device-list/device/:type', // 会议室管理-设施信息
      component: () => import('@/components/meet-room-manage/device-list/device')
    }, {
      path: 'statistic-analysis/reserve-user', // 统计分析-会务预约统计用户
      component: () => import('@/components/statistic-analysis/reserve-user')
    }, {
      path: 'statistic-analysis/reserve-own-user', // 统计分析-自有预约统计用户
      component: () => import('@/components/statistic-analysis/reserve-own-user')
    }, {
      path: 'statistic-analysis/reserve', // 统计分析-预约统计
      component: () => import('@/components/statistic-analysis/reserve')
    }, {
      path: 'statistic-analysis/revenue', // 统计分析-营收统计
      component: () => import('@/components/statistic-analysis/revenue')
    }, {
      path: 'statistic-analysis/equipment', // 统计分析-设备统计
      component: () => import('@/components/statistic-analysis/equipment')
    }, {
      path: 'statistic-analysis/evaluation', // 统计分析-会务分析统计
      component: () => import('@/components/statistic-analysis/evaluation')
    }, {
      name: 'role-manage', // 基础信息-角色管理
      path: 'basic-info/role-manage',
      component: () => import('@/components/basic-info/role-manage')
    }, {
      name: 'role', // 基础信息-角色管理-新增/修改
      path: 'basic-info/role-manage/role/:type',
      component: () => import('@/components/basic-info/role-manage/role')
    }, {
      name: 'review-manage', // 基础信息-审核配置
      path: 'basic-info/review-manage',
      component: () => import('@/components/basic-info/review-manage')
    }, {
      name: 'review', // 基础信息-审核配置-新增/修改
      path: 'basic-info/review-manage/review/:type',
      component: () => import('@/components/basic-info/review-manage/review')
    }, {
      name: 'review-manage-user', // 基础信息-审核配置用户
      path: 'basic-info/review-manage-user',
      component: () => import('@/components/basic-info/review-manage-user')
    }, {
      name: 'review-user', // 基础信息-审核配置用户-新增/修改
      path: 'basic-info/review-manage-user/review-user/:type',
      component: () => import('@/components/basic-info/review-manage-user/review-user')
    }, {
      name: 'board', // 基础信息-看板配置
      path: 'basic-info/board',
      component: () => import('@/components/basic-info/board')
    }, 
    {
      name: 'boardAdd', // 基础信息-看板配置-新增/修改
      path: 'basic-info/board/boardAdd',
      component: () => import('@/components/basic-info/board/boardAdd')
    }, 
    {
      name: 'boardList', // 基础信息-看板配置-看板子项列表
      path: 'basic-info/board/boardList',
      component: () => import('@/components/basic-info/board/boardList')
    }, 
    {
      name: 'boardListAdd', // 基础信息-看板配置-看板子项列表/新增
      path: 'basic-info/board/boardListAdd',
      component: () => import('@/components/basic-info/board/boardListAdd')
    }, 
    {
      name: 'menu-manage', // 基础信息-菜单管理
      path: 'basic-info/menu-manage',
      component: () => import('@/components/basic-info/menu-manage')
    }, {
      name: 'menu', // 基础信息-菜单管理-新增/修改
      path: 'basic-info/menu-manage/menu/:type',
      component: () => import('@/components/basic-info/menu-manage/menu')
    }, {
      name: 'evaluate', // 基础信息-会务配置
      path: 'basic-info/evaluate',
      component: () => import('@/components/basic-info/evaluate')
    }]
  }
]
