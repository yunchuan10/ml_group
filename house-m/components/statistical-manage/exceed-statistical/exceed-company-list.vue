<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标情况统计" :item="['超标情况统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-list',query:{areaId:this.$route.query.areaId}}">
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>单位名称</span>
                  <el-input clearable placeholder="请输入单位名称" v-model="organName"></el-input>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <h2 class="u-table-title">{{pushdate}}—{{areaName}}办公用房超标情况一览表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="单位">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-person-list',query:{areaId: scope.row.areaId,areaName:areaName,organName:scope.row.organName,organId: scope.row.organId, queryTime: pushdate,currentPage:page}}">{{scope.row.organName}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="excessivePersonNum" label="超标人数">
          </el-table-column>
          <el-table-column prop="excessiveArea" label="超标面积">
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>
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
    let date = new Date() - 24 * 60 * 60 * 1000;
    return {
      organName: '', // 单位名称
      defaultTime: date,
      showDate: '',
      pushdate: '',
      areaName: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      areaId: ''
    };
  },
  activated() {
    if (this.$route.query.areaType) {
      this.areaType = this.$route.query.areaType;
    }
    if (this.$route.query.areaName) {
      this.areaName = this.$route.query.areaName;
    }
    if (this.$route.query.areaId) {
      this.areaId = this.$route.query.areaId;
    }
    if (this.$route.query.queryTime) {
      this.pushdate = this.$route.query.queryTime;
    }
    if (this.$route.query.currentPage) {
      this.page = this.$route.query.currentPage;
    }
    this.getDataRequest();
  },
  deactivated() {
    this.organName = '';
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    //后退
    backHandle() {
      this.$router.back()
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        areaId: this.areaId,
        organName: this.organName,
        queryTime: this.pushdate, //查询时间  
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.aggregateUsage_getExcessiveOrganData, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    exportClick() {  //导出
      let params = {
        areaId: this.areaId,
        queryTime: this.pushdate, //查询时间  
        exportFlag: 'YES',
        areaName: this.areaName,
        organName: this.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.aggregateUsage_getExcessiveOrganData, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      });
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
.main-default {
  .g-content {
    .m-main {
      .g-main {
        .h-table {
          .el-table thead th {
            .cell {
              border-left: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>
