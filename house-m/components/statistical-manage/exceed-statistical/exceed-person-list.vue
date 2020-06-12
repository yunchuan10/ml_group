<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标情况统计" :item="['超标情况统计']" type="1"></Y-Breadcrumb>
        <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-list',query:{areaId:areaId,areaName: this.$route.query.areaName,currentPage:Hpage}}">
          <button class="f-pull-right u-bread-btn">
            返回
          </button>
        </router-link>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>姓名</span>
                  <el-input clearable v-model="realName" placeholder="请输入姓名"></el-input>
                </li>
                <li>
                  <span>职务级别</span>
                  <el-select v-model="dutiesLevelId" clearable filterable placeholder="请选择职务级别">
                    <el-option v-for="(item, index) in dutyList" :key="index" :label="item.dutiesLevelName" :value="item.dutiesLevelId"></el-option>
                  </el-select>
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
        <h2 class="u-table-title">{{organName}}办公室超标人员明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="dutiesLevelName" label="职务级别">
          </el-table-column>
          <!-- <el-table-column prop="dutyName" label="职务名称">
          </el-table-column> -->
          <!-- <el-table-column prop="established" label="编制情况">
          </el-table-column> -->
          <el-table-column prop="roomNo" label="房间号">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房屋位置">
          </el-table-column>
          <el-table-column prop="userNum" label="当前使用人数">
          </el-table-column>
          <el-table-column prop="standardArea" label="标准面积（m²）">
          </el-table-column>
          <el-table-column prop="realShareArea" label="实际分摊面积（m²）" width='155px'>
            <template slot-scope="scope">{{scope.row.realShareArea | dot2}}</template>
          </el-table-column>
          <el-table-column prop="standard" label="超标情况" width="150">
            <span class="z-state s-state-prohibited">超标</span>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
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
      duty: '', // 职务级别
      realName: '', //姓名
      dutyList: [],
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      Hpage: 0, //记录传过来的页数   
      pushdate: '',
      areaId: '',
      organName: '',// 单位名称   
      dutiesLevelId: ''
    };
  },
  activated() {
    if (this.$route.query) {
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
      this.Hpage = this.$route.query.currentPage;
    }
    this.dutiesLevelId = '';
    this.getDataRequest();
    this.getduty()
  },
  mounted() {
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    }
  },
  methods: {
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //获取职务级别
    getduty() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.useSummary_findOrganDutiesByOrganId, params).then(res => {
        if (res.data) {
          this.dutyList = res.data;
        } else {
          this.dutyList = [];
        }
      })
    },

    //状态判断
    checkStatus(value) {
      // if (value == '3') {
      if (value == '上报中') {
        return 's-state-apply'
      } else if (value == '已完结') {
        return 's-state-success'
      } else {
        return 's-state-fail'
      }
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        organId: this.organId,
        dutiesLevelId: this.dutiesLevelId || '',
        realName: this.realName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.excessvie_excessiveUserList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.list.excessive = '超标'
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
    // exportClick() {
    //   let params = {
    //     organId: this.organId,
    //     queryTime: this.pushdate,
    //     dutiesLevelName: this.duty || '',
    //     realName: this.realName,
    //     organName: this.organName,
    //     exportFlag: 'YES',
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_getExcessivePersonData, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   });
    // },
    //后退
    backHandle() {
      this.$router.back()
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
.icon-gantanhao {
  color: #c0c4cc;
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
