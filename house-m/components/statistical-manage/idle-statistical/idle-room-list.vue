<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="闲置情况统计" :item="['闲置情况统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/statistical-manage/idle-statistical/idle-courtyard-list',query:{areaId:this.$route.query.areaId, areaName: this.$route.query.areaName, currentPage:Hpage}}">
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div class="h-table f-relative">
        <h2 class="u-table-title">{{pushdate}}-{{courtyardName}}办公用房闲置情况一览表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" type="index" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="userArea" label="使用面积（m²）">
          </el-table-column>
          <el-table-column prop="buildArea" label="建筑面积（m²）">
          </el-table-column>
          <el-table-column prop="useStatus" label="房间状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.useStatus)">{{scope.row.useStatus || '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useOrganName" label="使用单位">
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      courtyardName: '', //院落名称
      message: '', // 确认信息
      areaName: '', //地区名称
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      Hpage: 0, //记录传过来的页数
      pushdate: '',
      courtyardId: '',
      list: []
    };
  },
  activated() {
    if (this.$route.query) {
      this.courtyardName = this.$route.query.courtyardName,
      this.courtyardId = this.$route.query.courtyardId;
      this.pushdate = this.$route.query.queryTime;
      this.areaName = this.$route.query.areaName;
      this.Hpage = this.$route.query.currentPage;
    }
    this.getDataRequest();
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    checkStatus(value) {
      if (value === '闲置') { // 闲置中
        return 's-state-success'
      } else if (value === '已分配') {
        return 's-state-prohibited'
      } else if (value === '已拆除' || value === '处置中' || value === '已出租' || value === '已转换用途') {
        return 's-state-fail'
      } else if (value === '调配中') {
        return 's-state-prohibited'
      } else {
        return 's-state-caveat'
      }
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        useStatus: '',
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.aggregateUsage_idleStatisticsRoomList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.list;
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
      });
    },
    exportClick() {  //导出
      let params = {
        courtyardId: this.courtyardId,
        useStatus: '',
        exportFlag: 'YES',
        courtyardName: this.courtyardName,
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.aggregateUsage_idleStatisticsRoomList, params).then(res => {
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
