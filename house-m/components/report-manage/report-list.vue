<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="数据上报" :item="['数据上报']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="search.year" type="year" placeholder="选择年度"></el-date-picker>
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
        <el-table :data="list">
          <el-table-column label="序号" width="60px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="reportYear" label="年度"></el-table-column>
          <el-table-column prop="reportStartTime" label="数据上报开始日期">
            <template slot-scope="scope">
              {{getTime(scope.row.reportStartTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="reportEndTime" label="数据上报截止日期">
            <template slot-scope="scope">
              {{getTime(scope.row.reportEndTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkClassName(scope.row.status)">
                {{scope.row.statusName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- scope.row.status == '0' || scope.row.status == '3' -->
              <a v-show="getReportShow(scope.row)" @click="goRepoatPage(scope.row.id, 'add')">{{scope.row.status == '0'?'数据填报':'修改'}}</a>
              <a @click="goRepoatPage(scope.row.id, 'detail')">详情</a>
              <a v-show="scope.row.status != '1' && scope.row.status != -1 " @click="getNextLevelData(scope.row.id)">获取数据</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" message="您确定要获取数据吗？" @click="YConfirmClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        year: ''
      },
      list: [],
      id: ''
    }
  },
  activated() {
    if(this.$route.query.id){
      this.$store.commit('navIdMutations',  this.$route.query.id);
    }
    this.getDataRequest();
    this.$store.commit('reportBackPageMutations', 'report');
  },
  methods: {
    getReportShow(reportMap) {
      if (reportMap.status == '0' || reportMap.status == '3') {
        let dataNow = new Date();
        let reportEndTime = new Date(reportMap.reportEndTime);
        if (reportEndTime.getTime() + 24 * 3600 * 1000 < dataNow.getTime()) {
          return false;
        } else {
          return true;
        }
      }
    },
    checkClassName(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '-1') {
        return 's-state-fail'
      } else if (value == '1') {
        return 's-state-caveat'
      } else if (value == '2') {
        return 's-state-success'
      } else if (value == '3') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    getTime(value) {
      return value.substr(0, 10);
    },
    goRepoatPage(dataReportOrderId, status) {
      this.$store.commit('dataReportOrderIdMutations', dataReportOrderId);
      this.$store.commit('reportOperatStatusMutations', status);
      this.$router.push({ path: '/report-manage/report' })
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    getDataRequest() {
      let params = {
        plateForm: 'manageSystem',
        reportYear: DATEFORMAT.dateReturnY(this.search.year),
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.report_getReportOrder, params).then(res => {
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
    handleCurrentChange(i) {
      this.page = i;
      this.getDataRequest();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getDataRequest()
    },
    getNextLevelData(id) { // 获取下级上报数据-打开弹出框
      this.YConfirmShow = true;
      this.id = id;
    },
    YConfirmClick() {
      let params = {
        id: this.id
      }
      this.$axiosGet(API.report_syncReportData, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '数据上报', '获取数据')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    }
  }
}
</script>