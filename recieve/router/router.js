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
    path: '/', // 主页面布局结构
    component: Main,
    children: [{
        path: '/', // 我的主页
        redirect: '/home'
      },
      {
        path: 'home', // 我的主页
        component: Home
      },
      {
        path: 'skin', // 皮肤设置
        component: () => import('@/components/skin')
      },

      {
        path: 'reception-manage/receptionplan-list', // 接待方案-申请列表
        component: () => import('@/components/reception-manage/receptionplan-list')
      },
      {
        path: 'reception-manage/reception-reveal', // 接待方案-基础信息-tab页面
        component: () => import('@/components/reception-manage/reception-reveal'),
        children: [{
            path: '/', // 参数设置 - 默认 -派车单结束任务设置
            redirect: 'reception-informat',
          },
          {
            path: 'reception-informat', // 接待方案-基础信息-编写
            component: () => import('@/components/reception-manage/reception-reveal-tabs/reception-informat')
          },
          // {
          //   path: 'reception-informat-read', // 接待方案-基础信息-查看
          //   component: () => import('@/components/reception-manage/reception-reveal-tabs/reception-informat-read')
          // },
          {
            path: 'subschemes-list', // 接待方案-方案列表
            component: () => import('@/components/reception-manage/reception-reveal-tabs/subschemes-list')
          },
        ]
      },

      { // 接待方案-新增子方案
        path: 'reception-manage/add-serve',
        component: () => import('@/components/reception-manage/add-serve'),
        children: [{
            path: '/', // 参数设置 - 默认 -派车单结束任务设置
            redirect: 'car-use-edit',
          },
          {
            path: 'car-use-edit', // 新增子方案-用车方案-编辑
            component: () => import('@/components/reception-manage/reception-subschemes/car-use-edit'),
          },
          {
            path: 'meeting-edit', // 新增子方案-会议方案-编辑
            component: () => import('@/components/reception-manage/reception-subschemes/meeting-edit'),
          },
          {
            path: 'accommodation-edit', // 新增子方案-住宿方案-编辑
            component: () => import('@/components/reception-manage/reception-subschemes/accommodation-edit'),
          },
          {
            path: 'meals-edit', // 新增子方案-用餐方案-编辑
            component: () => import('@/components/reception-manage/reception-subschemes/meals-edit'),
          },
        ]

      },

      { // 接待方案-子方案详情
        path: 'reception-manage/read-serve',
        component: () => import('@/components/reception-manage/read-serve'),
        children: [{
            path: '/', // 参数设置 - 默认 -派车单结束任务设置
            redirect: 'car-use',
          },
          {
            path: 'car-use', // 新增子方案-用车方案
            component: () => import('@/components/reception-manage/reception-subschemes/car-use'),
          },
          {
            path: 'meeting', // 新增子方案-会议方案
            component: () => import('@/components/reception-manage/reception-subschemes/meeting'),
          },

          {
            path: 'accommodation', // 新增子方案-住宿方案
            component: () => import('@/components/reception-manage/reception-subschemes/accommodation'),
          },
          {
            path: 'meals', // 新增子方案-用餐方案
            component: () => import('@/components/reception-manage/reception-subschemes/meals'),
          },
        ]

      },

      {
        path: 'reception-manage/examine-list', // 接待方案-方案审核表
        component: () => import('@/components/reception-manage/examine-list')
      },

      //  接待方案模块结束
      

      {
        path: 'old-manage/receptionTest/tab/hotel-plan-list', // 定点酒店-接待任务列表
        component: () => import('@/components/old-manage/receptionTest/tab/hotel-plan-list')
      },
      {
        path: 'old-manage/receptionTest/tab/car-plan-list', // 接待车队-接待任务列表
        component: () => import('@/components/old-manage/receptionTest/tab/car-plan-list')
      },
      {
        path: 'old-manage/receptionTest/tab-select', //接待方案tab主页
        component: () => import('@/components/old-manage/receptionTest/tab-select'),
        children: [{
            path: '', //子方案
            component: () => import('@/components/old-manage/receptionTest/tab/receptionTestList'),
          },
          {
            path: 'receptionTestList', //方案列表
            component: () => import('@/components/old-manage/receptionTest/tab/receptionTestList'),
          },
          {
            path: 'basic-info', //基础信息
            component: () => import('@/components/old-manage/receptionTest/tab/basic-info'),
          },

        ],
      },
      {
        path: 'old-manage/receptionTest/child-tab-select', //接待子方案tab主页
        component: () => import('@/components/old-manage/receptionTest/child-tab-select'),
        children: [{
            path: '', //子方案
            component: () => import('@/components/old-manage/receptionTest/tab/meeting-list'),
          },
          {
            path: 'meeting-list', //会议子方案
            component: () => import('@/components/old-manage/receptionTest/tab/meeting-list'),
          },
          {
            path: 'accommodation-list', //住宿子方案
            component: () => import('@/components/old-manage/receptionTest/tab/accommodation-list'),
          },
          {
            path: 'meals-list', //用餐子方案
            component: () => import('@/components/old-manage/receptionTest/tab/meals-list'),
          },
        ],
      },
      {
        path: '/old-manage/receptionTest/tab/toDoPlan', // 接待任务办理
        component: () => import('@/components/old-manage/receptionTest/tab/toDoPlan')
      },
      {
        path: '/old-manage/receptionTest/tab/car-list', // 用车方案预览
        component: () => import('@/components/old-manage/receptionTest/tab/car-list')
      },
      {
        path: '/old-manage/receptionTest/tab/basic-info', //基础信息
        component: () => import('@/components/old-manage/receptionTest/tab/basic-info'),
      },
      {
        path: '/old-manage/receptionTest/tab/receptionTestList', //子方案列表
        component: () => import('@/components/old-manage/receptionTest/tab/receptionTestList'),
      },
      {
        path: '/old-manage/receptionTest/tab/receptionTestList', //住宿子方案详情
        component: () => import('@/components/old-manage/receptionTest/tab/accommodation-list'),
      },
      {
        path: '/old-manage/receptionTest/tab/receptionTestList', //用餐子方案详情
        component: () => import('@/components/old-manage/receptionTest/tab/meals-list'),
      },
      {
        path: '/old-manage/receptionTest/tab/receptionTestList', //会议子方案详情
        component: () => import('@/components/old-manage/receptionTest/tab/meeting-list'),
      },
      {
        path: '/old-manage/receptionTest/tab/receptionTestList', //用车子方案详情
        component: () => import('@/components/old-manage/receptionTest/tab/car-list'),
      },


      // 费用结算模块
      {
        path: '/expenses-manage/apply-review-list', //申请人-费用审核
        component: () => import('@/components/expenses-manage/apply-review-list'),
      },
      {
        path: '/expenses-manage/finance-review-list', //财务-费用审核
        component: () => import('@/components/expenses-manage/finance-review-list'),
      },

      //费用结算
      {
        path: '/expenses-manage/hotel-expenses-list', //费用结算-酒店端
        component: () => import('@/components/expenses-manage/hotel-statement/hotel-expenses-list'),
      },
      {
        path: '/expenses-manage/hotel-statement', //费用结算-酒店端-生成结算单
        component: () => import('@/components/expenses-manage/hotel-statement/hotel-statement'),
      },

      {
        path: '/expenses-manage/car-expenses-list', //费用结算-车队端
        component: () => import('@/components/expenses-manage/car-statement/car-expenses-list'),
      },







      //系统管理
      {
        name: 'role-manage', // 基础信息-角色管理
        path: '/reception-manage/basic-info/role-manage',
        component: () => import('@/components/reception-manage/basic-info/role-manage')
      }, {
        name: 'role', // 基础信息-角色管理-新增/修改
        path: '/reception-manage/basic-info/role-manage/role/:type',
        component: () => import('@/components/reception-manage/basic-info/role-manage/role')
      },
      
      {
        path: '/reception-manage/basic-info/mail-list/index/visiting-unit', //通讯录-来访单位
        component: () => import('@/components/reception-manage/basic-info/mail-list/index/visiting-unit'),
      },
      
    ]
  }
];