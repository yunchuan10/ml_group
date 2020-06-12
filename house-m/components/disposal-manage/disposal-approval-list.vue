<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置审批" :item="['处置审批']" type="1"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click='changeActive("wait")' :class="{'active':pageSelect=='wait'}">
          <a>待处理
            <i class="f-weight-bold">（{{waitTotal}}）</i>
          </a>
        </li>
        <li @click='changeActive("plan")' :class="{'active':pageSelect=='plan'}">
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
                  <span>申请单号</span>
                  <el-input clearable v-model="orderNo" placeholder="请输入申请单号"></el-input>
                </li>
                <li>
                  <span>项目名称</span>
                  <el-input v-model="itemName" clearable placeholder="请输入项目名称"></el-input>
                </li>
                <li>
                  <span>处置方式</span>
                  <el-select v-model="handleType" filterable clearable placeholder="请选择处置方式">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in handleTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
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
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="申请单号" prop="orderNo">
          </el-table-column>
          <el-table-column label="项目名称" prop="itemName">
          </el-table-column>
          <el-table-column label="拟处置房间数量（间）" prop="planHandleRoomNum">
          </el-table-column>
          <el-table-column label="拟处置面积（㎡）" prop="buildArea">
          </el-table-column>
          <el-table-column label="处置方式" prop="handleTypeName">
          </el-table-column>
          <el-table-column label="申请提交时间" prop="dateCreated">
            <template slot-scope="scope">
           {{scope.row.createdAt ?scope.row.createdAt.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a v-show='pageSelect=="wait"' @click="approvalInfoClick(scope.row.id)">审批</a>
              <a @click="approvalDetailClick(scope.row.id)">详情</a>
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
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <disposal-info ref="disposalInfo" @update="updatePage"></disposal-info>
  </div>
</template>

<script>
import disposalInfo from '@/components/disposal-manage/disposal-info'; // 审批弹出框
import disposalDetail from '@/components/disposal-manage/disposal-applydetail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
    'disposal-info': disposalInfo,
  },
  data() {
    return {
      pageSelect: 'wait',//tab切换选中
      handleApplyId: '', //申请单id
      orderNo: '', //申请单号
      itemName: '', //项目名称
      handleType: '', //处置方式
      orderStatus: '', //订单状态
      dateCreated: '', //申请提交日期
      buildArea: '', //	拟处置房间建筑面积
      planHandleRoomNum: '', //	拟处置房间数量
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      handleTypeList: [], //处置方式的集合
      waitOrderList: [], // 待审批订单列表
      planOrderList: [], // 已处理订单列表
      waitTotal: 0, // 待处理订单总数
      planTotal: 0 // 已处理订单总数
    };
  },
  activated() {
    this.handleType = '';
    if (this.$route.query.id) {
      this.$store.commit('navIdMutations', this.$route.query.id);
    }
    this.getDataRequest();
    this.getDataPlanRequest();
    this.getSelectRequest();
  },

  computed: {

  },
  methods: {
    updatePage() {
      this.getDataRequest();
      this.getDataPlanRequest();
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
    // 审批
    approvalInfoClick(id) {
      this.$refs.disposalInfo.openModal(id);
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
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
        businessCode: 'HOUSE_HANDLE',
        orderNo: this.orderNo,
        itemName: this.itemName, //项目名称
        orderStatus: '', //订单状态
        handleType: this.handleType || '', //处置方式
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.handleapply_watingApprovalApplyList, params).then(res => {
        if (res.data && res.data.data) {
          let list = res.data.data;
          this.waitTotal = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.waitOrderList = list;
          if (this.pageSelect == 'wait') {
            this.list = list;
            this.total = this.waitTotal;
          }
        } else {
          this.waitOrderList = [];
          this.list = [];
          this.total = 0;
          this.waitTotal = 0;
        }
      })
    },

    //获取表格列表信息 已处理
    getDataPlanRequest() {
      let params = {
        businessCode: 'HOUSE_HANDLE',
        orderNo: this.orderNo,
        itemName: this.itemName, //项目名称
        orderStatus: '', //订单状态
        handleType: this.handleType || '', //处置方式
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.handleapply_doApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.data;
          this.planTotal = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.planOrderList = list;
          if (this.pageSelect == 'plan') {
            this.list = list;
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
    // 获取下拉选处置方式和订单状态
    getSelectRequest() {
      this.$axiosGet(API.handleapply_queryHandleTypeAndOrderStatusList, {}).then(res => {
        this.handleTypeList = res.data.sysDicHandleTypeResponseList;
      });
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
    },

  },

};
</script>

<style lang="scss">
</style>
