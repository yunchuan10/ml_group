<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>申请人</span>
                <el-input clearable v-model="search.userName" placeholder="请输入申请人"></el-input>
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
        <el-table-column label="申请人" prop="realName">
        </el-table-column>
        <el-table-column label="申请调配面积（㎡）" prop="applyArea">
        </el-table-column>
        <el-table-column label="申请时间" prop="dateCreated">
          <template slot-scope="scope">{{ checkApplyTime(scope.row.createdAt )}}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <a @click="approvalInfoClick(scope.row.id, scope.row.formKey)">审批</a>
            <a @click="approvalDetailClick(scope.row.id)">详情</a>
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
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <approval-detail ref="approvalDetail"></approval-detail>
    <approval-info ref="approvalInfo" @update="updatePage"></approval-info>
  </div>
</template>
<script>
import approvalInfo from '@/components/apply-manage/room-approval/approval-info'; // 审批弹出框
import approvalDetail from '@/components/apply-manage/room-approval/approval-detail'; // 详情弹出框
export default {
  components: {
    'approval-detail': approvalDetail,
    'approval-info': approvalInfo
  },
  data() {
    return {
      search: {
        userName: ''
      },
      dateCreated: '', // 申请时间
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [] // 列表数据集合
    };
  },
  activated() {
    this.page = 1;
    this.getDataRequest();
  },
  deactivated() {
    this.search.userName = '';

  },
  methods: {
    updatePage() {
      this.$store.commit('myPlanPageUpdateMutations', 'YES');
      this.getDataRequest();
    },
    // 订单状态类
    checkStatus(value) {
      if (value == '1' || value == '2' || value == '0') {
        return 's-state-apply'
      } else if (value == '3') {
        return 's-state-success'
      } else if (value == '-1' || value == '-2') {
        return 's-state-fail'
      }
    },
    checkStatusName(value) {
      if (value == '1' || value == '2' || value == '0') {
        return '审批中'
      } else if (value == '3') {
        return '已通过'
      } else if (value == '-1') {
        return '已撤回'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    // 审批
    approvalInfoClick(id, formKey) {
      this.$refs.approvalInfo.openModal(id, formKey);
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.approvalDetail.openModal(id);
    },
    // 时间格式format
    checkApplyTime(value) {
      return value.substr(0, 19)
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取表格未处理列表信息
    getDataRequest() {
      let params = {
        businessCode: 'HOUSE',
        realName: this.search.userName,
        platForm: 'userSystem',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.officeapply_watingApply, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.data || [];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
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
<style lang="scss">
</style>
