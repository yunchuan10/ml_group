<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="计划审批" :item="['计划审批']" type="1"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click='changeActive("wait")' :class="{'active':pageSelect=='wait'}">
          <a>待审批
            <i class="f-weight-bold">（{{waitTotal}}）</i>
          </a>
        </li>
        <li @click='changeActive("plan")' :class="{'active':pageSelect=='plan'}">
          <a>已审批
            <i class="f-weight-bold">（{{planTotal}}）</i>
          </a>
        </li>
      </ul>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="yearValue" type="year" placeholder="选择年">
                  </el-date-picker>
                </li>
                <li>
                  <span>申请单位</span>
                  <el-select v-model="organId" filterable clearable placeholder="请选择申请单位">
                    <el-option v-for="item in organList" :key="item.organId" :label="item.organName" :value="item.organId">
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
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template> -->
          </el-table-column>
          <el-table-column label="申请单位" prop="applyOrganName"></el-table-column>
          <el-table-column label="计划年度" prop="planYear" :formatter="dateFormatY"></el-table-column>
          <el-table-column label="计划总额度" prop="budgetTotalMoney" :formatter="dataValue">
          </el-table-column>
          <el-table-column label="计划制定时间" prop="createdAt" :formatter="dateFormat"></el-table-column>
          <el-table-column label="状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="annualInfoClick(scope.row.taskId, scope.row.manageProcInstId, scope.row.id)" v-show="pageSelect == 'wait'">审批</a>
              <a @click="annualDetailClick(scope.row.id)">详情</a>
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
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 详情弹出框 -->
    <annualplan-detail ref="annualDetail"></annualplan-detail>
    <!-- 审批弹框 -->
    <annualplan-info ref="annualInfo" @update='updatePage'></annualplan-info>
  </div>
</template>

<script>
import annualplanDetail from '@/components/maintenance-manage/annualplan/annualplan-detail'; // 详情弹出框
import annualplanInfo from '@/components/maintenance-manage/annualplan/annualplan-info'; // 审核弹出框
export default {
  components: {
    'annualplan-detail': annualplanDetail,
    'annualplan-info': annualplanInfo
  },
  data() {
    return {
      yearValue: '', //年度
      pageSelect: 'wait',//tab切换选中
      id: '',
      orderNo: '',//申请单号
      organId: '', //申请单位
      status: '',
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      statusSelectList: [],//状态下拉列表查询
      organList: [], //申请单位
      waitOrderList: [], // 待审批订单列表
      planOrderList: [], // 已处理订单列表  
      waitTotal: 0, // 待处理订单总数
      planTotal: 0 // 已处理订单总数
    };
  },
  activated() {
    if (this.$route.query.id) {
      this.$store.commit('navIdMutations', this.$route.query.id);
    }
    this.organId = '';
    this.getDataRequest();
    this.getDataPlanRequest()
    this.getSelect()
  },
  deactivated() {
    this.orderNo = '';
    this.status = '';
  },
  methods: {
    updatePage() {
      this.getDataRequest();
      this.getDataPlanRequest();
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    dataValue(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue + '万元'
      } else {
        return ''
      }
    },
    dateFormatY(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return DATEFORMAT.dateReturnY(new Date(date));
    },
    checkStatus(value) {
      if (value == '1') {
        return 's-state-caveat'
      } else if (value == '0') {
        return 's-state-apply'
      } else if (value == '2') {
        return 's-state-success'
      } else if (value == '-1' || value == '-2') {
        return 's-state-fail'
      }
    },
    checkStatusName(value) {
      if (value == '1') {
        return '审批中'
      } else if (value == '0') {
        return '新提交申请'
      } else if (value == '2') {
        return '已通过'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    // 确认弹出框操作
    YConfirmClick() {
      let params = {
        officeApplyId: this.id
      }
      this.$axiosPost(API.officeapply_cancelApply, params).then(res => {
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
    // 选择页面激活状态
    changeActive(pageName) {
      this.pageSelect = pageName;
      if (pageName === 'wait') {
        this.getDataRequest();
        this.list = this.waitOrderList;
        this.total = this.waitTotal;
      } else {
        this.getDataPlanRequest()
        this.list = this.planOrderList;
        this.total = this.planTotal;
      }
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    // 时间格式format
    checkApplyTime(value) {
      return DATEFORMAT.dateReturnYMDHMS(new Date(value))
    },
    //查询
    getSearch() {
      this.page = 1;
      if (this.pageSelect == 'wait') {
        this.getDataRequest();
      } else {
        this.getDataPlanRequest()
      }
    },
    // 详情
    annualDetailClick(id) {
      this.$refs.annualDetail.openModal(id);
    },
    // 审批
    annualInfoClick(taskId, manageProcInstId, id) {
      this.$refs.annualInfo.openModal(taskId, manageProcInstId, id);
    },
    //状态下拉框
    getSelect() {
      this.$axiosGet(API.manageMaintain_queryOrderStatusAndBiddingType, {}).then(res => {
        this.organList = res.data.organBaseList;
        this.statusSelectList = res.data.sysDicOrderStatusResponseList;
      })
    },
    //获取表格列表信息
    getDataRequest() {
      let params = {
        // organId: this.organId,
        applyOrganId: this.organId,
        planYear: DATEFORMAT.dateReturnY(this.yearValue),
        // businessCode: 'HOUSE_REPAIR',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.manageMaintain_watingApprovalApplyList, params).then(res => {
        if (res.result === 'success' && res.data) {
          let list = res.data.data || [];
          this.waitTotal = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.waitOrderList = list;
          if (this.pageSelect == 'wait') {
            this.list = this.waitOrderList;
            this.waitTotal = res.data.total;
            this.total = res.data.total;
          }
        } else {
          this.list = [];
          this.total = 0;
          this.waitTotal = 0;
        }
      })
    },
    //获取表格列表信息 已处理
    getDataPlanRequest() {
      let params = {
        // organId: this.organId || '',
        applyOrganId: this.organId || '',
        planYear: DATEFORMAT.dateReturnY(this.yearValue),
        // businessCode: 'HOUSE_REPAIR',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.manageMaintain_doApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.data;
          if (list) {
            this.planTotal = res.data.total;
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }        
          this.planOrderList = list;
          if (this.pageSelect == 'plan') {
            this.list = this.planOrderList;
            this.planTotal = res.data.total;
            this.total = res.data.total;
          }
        } else {
          this.planOrderList = [];
          this.list = [];
          this.total = 0;
          this.planTotal = 0;
        }
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
</style>
