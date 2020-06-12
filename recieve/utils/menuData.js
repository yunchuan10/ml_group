export default [{
    menuName: '首页',
    menuClass: 'fa-home',
    path: '/home',
    menuLevel: '1',
    menuId: '00',
    childrenList: [{
      childrenList: [],
      menuName: '首页',
      menuClass: 'fa-ownership',
      path: '/home',
      menuLevel: '2',
      menuId: '01'
    }]
  },
  {
    menuName: '接待方案',
    menuClass: 'fa-basic-search',
    path: '无',
    menuLevel: '1',
    menuId: '10',
    childrenList: [{
      childrenList: [],
      menuName: '方案申请',
      menuClass: 'fa-ownership',
      path: '/reception-manage/receptionplan-list',
      menuLevel: '2',
      menuId: '11'
    }, {
      childrenList: [],
      menuName: '方案审核',
      menuClass: 'fa-ownership',
      path: '/reception-manage/examine-list',
      menuLevel: '2',
      menuId: '12'
    }, ],
  },

  {
    menuName: '定点酒店接待任务',
    aliasName: '接待任务(定点酒店)',
    menuClass: 'fa-basic-search',
    path: '无',
    menuLevel: '1',
    menuId: '20',
    childrenList: [{
      childrenList: [],
      menuName: '定点酒店接待任务',
      aliasName: '接待任务(定点酒店)',
      menuClass: 'fa-ownership',
      path: '/old-manage/receptionTest/tab/hotel-plan-list',
      menuLevel: '2',
      menuId: '21'
    }]
  },

  {
    menuName: '接待车队接待任务',
    aliasName: '接待任务(接待车队)',
    menuClass: 'fa-basic-search',
    path: '无',
    menuLevel: '1',
    menuId: '30',
    childrenList: [{
      childrenList: [],
      menuName: '接待车队接待任务',
      aliasName: '接待任务(接待车队)',
      menuClass: 'fa-ownership',
      path: '/old-manage/receptionTest/tab/car-plan-list',
      menuLevel: '2',
      menuId: '31'
    }]
  },

  {
    menuName: '费用结算',
    menuClass: 'fa-basic-search',
    path: '无',
    menuLevel: '1',
    menuId: '40',
    childrenList: [
    {
      childrenList: [],
      menuName: '申请人费用审核',
      aliasName: '费用审核(申请人)',
      menuClass: 'fa-ownership',
      path: '/expenses-manage/apply-review-list',
      menuLevel: '2',
      menuId: '41'
    },{
      childrenList: [],
      menuName: '财务费用审核',
      aliasName: '费用审核(财务)',
      menuClass: 'fa-ownership',
      path: '/expenses-manage/finance-review-list',
      menuLevel: '2',
      menuId: '42'
    },{
      childrenList: null,
      menuName: '酒店费用结算',
      aliasName: '费用结算(酒店)',
      menuClass: 'fa-ownership',
      path: '/expenses-manage/hotel-expenses-list',
      menuLevel: '2',
      menuId: '43'
    },
    {
      childrenList: null,
      menuName: '车队费用结算',
      aliasName: '费用结算(车队)',
      menuClass: 'fa-ownership',
      path: '/expenses-manage/car-expenses-list',
      menuLevel: '2',
      menuId: '44'
    }]
  },

  {
    menuName: '系统管理',
    menuClass: 'fa-basic-search',
    path: '无',
    menuLevel: '1',
    menuId: '60',
    childrenList: [{
        childrenList: null,
        menuName: '角色管理',
        menuClass: 'fa-ownership',
        path: '/reception-manage/basic-info/role-manage',
        menuLevel: '2',
        menuId: '61'
      },
      {
        childrenList: null,
        menuName: '通讯录',
        menuClass: 'fa-ownership',
        path: '/reception-manage/basic-info/mail-list/index/visiting-unit',
        menuLevel: '2',
        menuId: '62'
      },
      

    ]
  },
  


]




