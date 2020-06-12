<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="出租审批" :item="['出租审批']" type="2"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click="changeActive('wait')" :class="{'active':pageSelect=='wait'}">
          <a>待处理
            <i class="f-weight-bold">（{{waitTotal}}）</i>
          </a>
        </li>
        <li @click="changeActive('plan')" :class="{'active':pageSelect=='plan'}">
          <a>已处理
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
                  <span>申请单位</span>
                  <el-input clearable v-model="search.organName" placeholder="请输入申请单位"></el-input>
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
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="申请单号" prop="orderNo" width='100px'>
          </el-table-column>
          <el-table-column label="申请单位" prop="applyOrganName">
          </el-table-column>
          <el-table-column label="经办人" prop="agentName">
          </el-table-column>
          <el-table-column label="拟出租开始日期" prop="proposedRentStartDate" :formatter="dateFormat">
          </el-table-column>
          <el-table-column label="招租形式" prop="rentWayName">
          </el-table-column>
          <el-table-column label="审批状态" prop="orderStatusName">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{scope.row.orderStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="approvalInfoClick(scope.row.id, scope.row.manageProcInstId, scope.row.taskId)" v-show="pageSelect === 'wait'">审批</a>
              <a @click="approvalDetailClick(scope.row.id,scope.row.additionRecording)">详情</a>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <!-- <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出
          </button> -->
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <approval-detail ref="approvalDetail"></approval-detail>
    <approval-info ref="approvalInfo" @update="updatePage"></approval-info>
  </div>
</template>

<script>
import approvalInfo from '@/components/operate/approval-manage/rent-apply-approval-info'; // 审批弹出框
import approvalDetail from '@/components/operate/approval-manage/rent-applydetail'; // 详情弹出框
export default {
  components: {
    'approval-detail': approvalDetail,
    'approval-info': approvalInfo,
  },
  data() {
    return {
      search: {
        organName: ''
      },
      pageSelect: 'wait',
      dateCreated: '', // 申请时间
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      waitOrderList: [], // 待审批订单列表
      planOrderList: [], // 已处理订单列表
      waitTotal: 0, // 待处理订单总数
      planTotal: 0, // 已处理订单总数
      list: [] // 列表数据集合
    };
  },
  activated() {
    if (this.$route.query.id) {
      this.$store.commit('navIdMutations', this.$route.query.id);
    }
    this.getDataRequest();
    this.getTotalApply();
  },
  deactivated() {
    this.pageSelect = 'wait';
    this.search.organName = '';
  },
  computed: {
    userId() {
      return this.$store.state.mainData.userId;
    }
  },
  methods: {
    getTotalApply() {
      let params = {
        // businessCode: 'MANAGE_RENT_APPROVAL',
        applyOrganName: this.search.organName,
        // userId: this.userId,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.managehouserent_doApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.total = res.data.total;
          this.planTotal = this.total;
        }
      })
    },
    updatePage() {
      this.getTotalApply();
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    // 选择页面激活状态
    changeActive(pageName) {
      this.pageSelect = pageName;
      this.search.organName = '';
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    },
    // 订单状态类
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
      } else if (value == '-1') {
        return '已撤回'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    // 审批
    approvalInfoClick(id, manageProcInstId, taskId) {
      this.$refs.approvalInfo.openModal(id, manageProcInstId, taskId);
    },
    // 详情
    approvalDetailClick(id, record) {
      this.$refs.approvalDetail.openModal(id, record);
    },
    getSearch() {
      this.page = 1;
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    },
    //获取表格未处理列表信息
    getDataRequest() {
      let params = {
        // businessCode: 'MANAGE_RENT_APPROVAL',
        applyOrganName: this.search.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.managehouserent_watingApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.data;
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.list = list;
          this.waitTotal = this.total;
        } else {
          this.list = [];
          this.total = 0;
          this.waitTotal = 0;
        }
      })
    },
    //获取表格已处理列表信息
    getDataPlanRequest() {
      let params = {
        // businessCode: 'MANAGE_RENT_APPROVAL',
        applyOrganName: this.search.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.managehouserent_doApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.data || [];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.list = list;
          this.planTotal = this.total;
        } else {
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

<style lang="scss">
</style>
