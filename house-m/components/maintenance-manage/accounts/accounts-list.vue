<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="维修台账" :item="['维修台账']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to='/maintenance-manage/accounts-apply/add'>
            <button class="f-pull-right u-bread-btn">
              新增台账
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="search.planYear" type="year" placeholder="选择年">
                  </el-date-picker>
                </li>
                <li>
                  <span>采购方式</span>
                  <el-select v-model="search.winBiddingType" filterable clearable placeholder="请选择采购方式">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in bidSelectList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>申请单位</span>
                  <el-select v-model="search.applyOrganId" filterable clearable placeholder="请选择申请单位">
                    <el-option v-for="item in organList" :key="item.organId" :label="item.organName" :value="item.organId">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>工程级别</span>
                  <el-select v-model="search.projectLevel" filterable clearable placeholder="请选择工程级别">
                    <el-option v-for="item in projectLevelList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>工程类型</span>
                  <el-select v-model="search.projectType" clearable placeholder="请选择工程类型">
                    <el-option v-for="item in projectTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" type="index" width="60">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="工程名称" prop="projectName"></el-table-column>
          <el-table-column label="申请单位" prop="maintainOrganName" width="130px"></el-table-column>
          <el-table-column label="所属计划年度" prop="planYear" width="130px">
          </el-table-column>
          <el-table-column label="工程级别" prop="projectLevelName" width="130px"></el-table-column>
          <el-table-column label="工程类型" prop="projectTypeName" width="160px"></el-table-column>
          <el-table-column label="施工单位" prop="constructionOrganName" width="200px"></el-table-column>
          <el-table-column label="采购方式" prop="winBiddingTypeName" width="130px"></el-table-column>
          <el-table-column fixed="right" label="操作" width="180px">
            <template slot-scope="scope">
              <a @click="accountsDetailClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/maintenance-manage/accounts-apply/edit', query: {id:scope.row.id}}">
                修改
              </router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 详情弹出框 -->
    <accounts-detail ref="accountsDetail"></accounts-detail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import accountsDetail from '@/components/maintenance-manage/accounts/accounts-detail'; // 详情弹出框
export default {
  components: {
    'accounts-detail': accountsDetail
  },
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      message: '',
      isBol: false,
      search: {
        projectType: '', //工程类型
        projectLevel: '', //工程级别
        planYear: '', //年度
        winBiddingType: '', //中标方式
        applyOrganId: '', // 申请单位ID
        maintenanceResultStatus: '' // 状态
      },
      deleteYardId: '', //删除id
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      maintenCompanyList: [], //维修单位集合
      projectTypeList: [], //工程类型集合
      projectLevelList: [], //工程级别集合
      planYearList: [], //计划年度集合
      organList: [],
      statusSelectList: [],
      bidSelectList: [],
      list: []
    };
  },
  activated() {
    this.search = {
      projectType: '', //工程类型
      projectLevel: '', //工程级别
      planYear: '', //年度
      winBiddingType: '', //中标方式
      applyOrganId: '', // 申请单位ID
      maintenanceResultStatus: '' // 状态
    };
    this.getSelectData();
    this.getDataRequest();
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    },
    userId() {
      return this.$store.state.mainData.userId  //登录单位id
    },
  },
  methods: {
    //获取状态值
    getName(value) {
      if (value == 'NO') {
        return '未处理'
      } else {
        return '已处理'
      }
    },
    getClassName(value) {
      if (value == 'NO') {
        return 's-state-apply'
      } else {
        return 's-state-success'
      }
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    // 详情
    accountsDetailClick(id) {
      this.$refs.accountsDetail.openModal(id);
    },
    // 获取下拉选
    getSelectData() {
      this.$axiosGet(API.manageMaintain_queryOrderStatusAndBiddingType, {}).then(res => {
        this.organList = res.data.organBaseList;
        this.bidSelectList = res.data.sysDicBiddingTypeResponseList;
        this.projectTypeList = res.data.sysProjectTypeResponseList;
        this.projectLevelList = res.data.sysProjectLevelResponseList; //工程级别
      })
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
    },
    // 删除
    YDeleteClick() {
      let params = {
        maintainParameterId: this.deleteYardId
      }
      this.$axiosPost(API.manageMaintain_deleteMaintainParameter, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    //获取表格列表信息
    getDataRequest() {
      if (this.search.applyOrganId == null) {
        this.search.applyOrganId = '';
      }
      if (this.search.winBiddingType == null) {
        this.search.winBiddingType = '';
      }
      let params = {
        planYear: DATEFORMAT.dateReturnY(this.search.planYear),
        winBiddingType: this.search.winBiddingType || '',
        maintainOrganId: this.search.applyOrganId || '',
        organId: this.loginOrganId,
        createUserId: this.userId,
        projectLevel: this.search.projectLevel || '',
        projectType: this.search.projectType || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.manageMaintain_maintainParameterList, params).then(res => {
        if (res.result === 'success') {
          let list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>
<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
</style>
