<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="计划申请" :item="['计划申请']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/maintenance-manage/annualplan-apply/add">
            <button class="f-pull-right u-bread-btn">
              年度计划申请
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
          <el-table-column label="计划总额度（万元）" prop="budgetTotalMoney"></el-table-column>
          <el-table-column label="计划制定时间" prop="createdAt" :formatter="dateFormat"></el-table-column>
          <el-table-column label="状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="approvalDetailClick(scope.row.id)">详情</a>
              <router-link v-show="scope.row.orderStatus == '-2'" :to="{path:'/maintenance-manage/annualplan-apply/edit',query:{maintainPlanApplyId:scope.row.id}}">修改</router-link>
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
    <annualplan-detail ref="approvalDetail"></annualplan-detail>
  </div>
</template>
<script>
import annualplanDetail from '@/components/maintenance-manage/annualplan/annualplan-detail'; // 详情弹出框
export default {
  components: {
    'annualplan-detail': annualplanDetail
  },
  data() {
    return {
      yearValue: '', //年度
      id: '',
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [] // 列表数据集合   
    };
  },
  activated() {
    this.getDataRequest();
  },
  deactivated() {
    this.yearValue = '';
  },
  methods: {
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    dateFormatY(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return DATEFORMAT.dateReturnY(new Date(date));
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
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.approvalDetail.openModal(id);
    },
    // dataValue(row, column, cellValue, index) {
    //   if (cellValue) {
    //     return cellValue + '万年'
    //   } else {
    //     return ''
    //   }
    // },
    //获取表格列表信息
    getDataRequest() {
      let params = {
        planYear: DATEFORMAT.dateReturnY(this.yearValue),
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.userplatform_maintainApplyList, params).then(res => {
        if (res.result === 'success' && res.data) {
          let list = res.data.data;
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
        }
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数0
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>

