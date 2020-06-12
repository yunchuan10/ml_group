<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>申请单号</span>
                <el-input clearable v-model="search.order" placeholder="请输入申请单号"></el-input>
              </li>
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
        <el-table-column prop="date" fixed="left" label="序号" width="50" type="index">
          <!-- <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>-->
        </el-table-column>
        <el-table-column label="申请单号" prop="orderNo"></el-table-column>
        <el-table-column label="申请单位" prop="organName"></el-table-column>
        <el-table-column label="申请调配面积（㎡）" prop="applyArea"></el-table-column>
        <el-table-column label="申请时间" prop="createdAt">
          <template slot-scope="scope">{{ checkApplyTime(scope.row.createdAt )}}</template>
        </el-table-column>
        <el-table-column label="审批状态" prop="orderStatus">
          <template slot-scope="scope">
            <span
              class="z-state"
              :class="checkStatus(scope.row.orderStatus)"
            >{{checkStatusName(scope.row.orderStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <a
              @click="approvalInfoClick(scope.row.id, scope.row.formKey)"
              v-show="scope.row.formKey === 'manageFirst'"
            >审批</a>
            <a
              @click="approvalInfoPlanClick(scope.row.id, scope.row.formKey)"
              v-show="scope.row.formKey === 'manageAfterMakePlan'"
            >审批</a>
            <a @click="approvalDetailClick(scope.row.id,scope.row.formKey)">详情</a>
            <router-link
              v-show="scope.row.formKey == 'manageMakePlan'"
              :to="{path:'/configure-manage-v2/room-approval/allocation-scheme', query: {id: scope.row.id, formKey: scope.row.formKey}}"
            >制定调配方案</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-btns f-pull-left">
        <!-- <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出
        </button>-->
      </div>
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <approval-detail ref="approvalDetail"></approval-detail>
    <approval-info ref="approvalInfo" @update="updatePage"></approval-info>
    <approval-infoplan ref="approvalInfoplan" @updateplan="updatePageplan"></approval-infoplan>
  </div>
</template>
<script>
import approvalInfo from "@/components/configure-manage-v2/room-approval/approval-info"; // 审批弹出框
import approvalInfoplan from "@/components/configure-manage-v2/room-approval/approval-infoplan"; // 制定调配方案之后的审批弹出框
import approvalDetail from "@/components/configure-manage-v2/room-approval/approval-detail"; // 详情弹出框
export default {
  components: {
    "approval-detail": approvalDetail,
    "approval-info": approvalInfo,
    "approval-infoplan": approvalInfoplan //制定调配方案之后的审批
  },
  data() {
    return {
      search: {
        order: "",
        organName: ""
      },
      keyWay: "",
      dateCreated: "", // 申请时间
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [], // 列表数据集合
      waitTotal: 0, // 待处理订单总数
      planTotal: 0 // 已处理订单总数
    };
  },
  activated() {
    this.getDataRequest();
  },
  deactivated() {
    this.search.order = "";
    this.search.organName = "";
  },
  methods: {
    updatePage() {
      this.$store.commit("myPlanPageUpdateMutations", "YES");
      this.getDataRequest();
    },
    updatePageplan() {
      this.$store.commit("myPlanPageUpdateMutations", "YES");
      this.getDataRequest();
    },
    // 订单状态类
    checkStatus(value) {
      if (value == "1" || value == "2") {
        return "s-state-caveat";
      } else if (value == "0") {
        return "s-state-apply";
      } else if (value == "3") {
        return "s-state-success";
      } else if (value == "-1" || value == "-2") {
        return "s-state-fail";
      }
    },
    checkStatusName(value) {
      if (value == "1" || value == "2") {
        return "审批中";
      } else if (value == "0") {
        return "新提交申请";
      } else if (value == "3") {
        return "已通过";
      } else if (value == "-1") {
        return "已撤回";
      } else if (value == "-2") {
        return "已驳回";
      }
    },
    // 审批
    approvalInfoClick(id, formKey) {
      this.$refs.approvalInfo.openModal(id, formKey);
    },
    // 制定调配方案之后的审批
    approvalInfoPlanClick(id, formKey) {
      this.$refs.approvalInfoplan.openModal(id, formKey);
    },
    // 详情
    approvalDetailClick(id, formkey) {
      this.$refs.approvalDetail.openModal(id, formkey);
    },
    // 时间格式format
    checkApplyTime(value) {
      return value.substr(0, 19);
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取表格未处理列表信息
    getDataRequest() {
      let params = {
        businessCode: "CONFIGURATION",
        platForm: "manageSystem",
        orderNo: this.search.order,
        organName: this.search.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.officeapply_watingApply, params).then(res => {
        if (res.result == "success" && res.data) {
          let list = res.data.data || [];
          this.total = res.data.total;
          // list.forEach((item, index) => {
          //   list[index].num = index + 1;
          // })
          this.list = list;
          res.data.data.forEach(item => {
            if (item == null) {
              this.list = [];
            }
          });
        } else {
          this.list = [];
          this.total = 0;
        }
      });
    },
    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>
<style lang="scss">
</style>
