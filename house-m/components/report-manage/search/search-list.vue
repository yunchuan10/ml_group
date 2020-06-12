<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="数据查询" :item="['数据查询']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group" v-show="areaIdList.length > 0">
          <button class="f-pull-right u-bread-btn" @click="goBack">
            返回
          </button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="search.year" type="year" placeholder="请选择年度"></el-date-picker>
                </li>
                <li>
                  <span>状态</span>
                  <el-select v-model="search.status" filterable clearable placeholder="请选择状态">
                    <el-option v-for="(item, index) in dataReportOrderStatus" :label="item.dicName" :value="item.dicValue" :key="index"></el-option>
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
        <el-table :data="list">
          <el-table-column label="序号" width="60px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="areaName" label="地区">
            <template slot-scope="scope">
              <a @click="setAreaList(scope.row)">{{scope.row.areaName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="createOrganName" label="填报人单位"></el-table-column>
          <el-table-column prop="createRealName" label="填报人"></el-table-column>
          <el-table-column prop="createdAt" label="上报时间">
            <template slot-scope="scope">
              {{getTime(scope.row.createdAt)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkClassName(scope.row.status)">
                {{scope.row.statusName}}
              </span>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        year: '',
        status: ''
      },
      dataReportOrderStatus: [],
      list: [],
      areaIdList: [],
      originPage: 0
    }
  },
  activated() {
    this.$store.commit('reportBackPageMutations', 'search');
    this.search.status = '';
    this.beginTime();
    this.getPic();
  },
  methods: {
    checkClassName(value) {
      if (value == '0') {
        return 's-state-apply'
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
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'dataReportOrderStatus'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.dataReportOrderStatus = res.data.dataReportOrderStatus;
        }
      })
    },
    getTime(value) {
      if (value) {
        return value.substr(0,10);
      } else {
        return ''
      }
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    beginTime() {
      this.search.year = new Date();
      this.getDataRequest();
    },
    getDataRequest() {
      if (this.search.status == null) {
        this.search.status = '';
      }
      let params = {
        reportYear: DATEFORMAT.dateReturnY(this.search.year),
        status: this.search.status,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      if (this.areaIdList.length > 0) {
        this.$set(params, 'areaId', this.areaIdList[this.areaIdList.length - 1])
      }
      this.$axiosGet(API.report_orderQuery, params).then(res => {
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
    setAreaList(scope) {
      this.originPage = this.page;
      if (scope.areaType !== '1') {
        this.page = 1;
        this.areaIdList.push(scope.areaId)
        this.getDataRequest();
      } else {
        this.$store.commit('dataReportOrderIdMutations', scope.id);
        this.$store.commit('reportOperatStatusMutations', 'detail');
        this.$router.push({ path: '/report-manage/report' })
      }
    },
    goBack() {
      this.areaIdList.splice(this.areaIdList.length - 1, 1);
      this.page = this.originPage;
      this.getDataRequest();
    }
  }
}
</script>