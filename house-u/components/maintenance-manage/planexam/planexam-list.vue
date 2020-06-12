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
          <el-table-column label="计划年度" prop="planYear" :formatter="dateFormatY"></el-table-column>
          <el-table-column label="计划总额度" prop="budgetTotalMoney"></el-table-column>
          <el-table-column label="计划制定时间" prop="createdAt" :formatter="dateFormat"></el-table-column>
          <el-table-column label="状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a v-show='pageSelect=="wait"' @click="planexamInfoClick(scope.row.taskId, scope.row.userProcInstId,scope.row.id)">审批</a>
              <a @click="planexamDetailClick(scope.row.id)">详情</a>
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
    <planexam-detail ref="planexamDetail"></planexam-detail>
    <planexam-info ref="planexamInfo" @update="updatePage"></planexam-info>
  </div>
</template>
<script>
import planexamInfo from '@/components/maintenance-manage/planexam/planexam-info'; // 审批弹出框
import planexamDetail from '@/components/maintenance-manage/planexam/planexam-detail'; // 详情弹出框
export default {
  components: {
    'planexam-detail': planexamDetail,
    'planexam-info': planexamInfo
  },
  data() {
    return {
      pageSelect: 'wait',//tab切换选中
      yearValue: '',
      maintenanceResultStatus: '', //状态
      handleApplyId: '', //申请单id
      orderNo: '', //申请单号
      itemName: '', //项目名称
      orderStatus: '', //订单状态
      dateCreated: '', //申请提交日期
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      statusSelectList: [], //状态
      waitOrderList: [], // 已处理订单列表
      waitTotal: 0, // 待处理订单总数
      planTotal: 0 // 已处理订单总数
    };
  },
  activated() {
    this.pageSelect="wait";
    this.getDataRequest();
    this.getDataPlanRequest();
    this.getSelect();
  },
  computed: {

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
      return date.substr(0,10);
    },
    dateFormatY(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return DATEFORMAT.dateReturnY(new Date(date));
    },
    // 订单状态类
    checkStatus(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-caveat'
      }
      else if (value == '2') {
        return 's-state-success'
      } else if (value == '-1' || value == '-2') {
        return 's-state-fail'
      }
    },
    checkStatusName(value) {
      if (value == '0') {
        return '新提交申请'
      } else if (value == '1') {
        return '审批中'
      }
      else if (value == '2') {
        return '已通过'
      } else if (value == '-1') {
        return '已撤回'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    // 选择页面激活状态
    changeActive(pageName) {
      this.pageSelect = pageName;
      if (pageName === 'wait') {
        this.list = this.waitOrderList;
        this.total = this.waitTotal;
      } else {
        this.list = this.planOrderList;
        this.total = this.planTotal;
      }
    },
    //状态下拉框
    getSelect() {
      this.$axiosGet(API.manageMaintain_queryOrderStatusAndBiddingType, {}).then(res => {
        this.statusSelectList = res.data.sysDicOrderStatusResponseList;
      })
    },
    // 审批
    planexamInfoClick(taskId, userProcInstId, id) {
      this.$refs.planexamInfo.openModal(taskId, userProcInstId, id);
    },
    // 详情
    planexamDetailClick(id) {
      this.$refs.planexamDetail.openModal(id);
    },
    getSearch() {
      this.page = 1;
      if (this.pageSelect == 'wait') {
        this.getDataRequest();
      } else {
        this.getDataPlanRequest();
      }
    },
    //获取表格列表信息 待处理
    getDataRequest() {
      let params = {
        // businessCode: 'HOUSE_REPAIR_PLAN',
        planYear: DATEFORMAT.dateReturnY(this.yearValue),
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.userplatform_watingApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          if(res.data.data && res.data.data !=null){
            let list = res.data.data;
            this.waitTotal = res.data.total;
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
            this.waitOrderList = list;   
            if(this.pageSelect =='wait'){
              this.list = this.waitOrderList;
              this.total = this.waitTotal;   
            }             
          }  else{
            this.waitOrderList = [];
            this.waitTotal = 0;
            this.list = [];
            this.total = 0;
          }  
       
        } else {
          // this.waitOrderList = [];
          // this.list = [];
          this.total = 0;
          this.waitTotal = 0;
        }
      })
    },
    //获取表格列表信息 已处理
    getDataPlanRequest() {
      let params = {
        // businessCode: 'HOUSE_REPAIR_PLAN',
        planYear: DATEFORMAT.dateReturnY(this.yearValue),
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.userplatform_doApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data && res.data.data) {      
          let list = res.data.data || [];
          this.planTotal = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.planOrderList = list; 
          if(this.pageSelect =='plan'){
            this.list = this.planOrderList;
            this.total = this.planTotal;    
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

