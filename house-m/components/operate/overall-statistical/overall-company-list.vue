<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="统计分析" :item="['统计分析']" type="2"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>单位</span>
                  <el-select v-model="courtyardId" clearable filterable placeholder="请选择单位名称">
                    <el-option v-for="item in courtySelectList" :key="item.organId" :label="item.organName" :value="item.organName">
                    </el-option>
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
      <div class="h-table f-relative" id="m-padding-l">
        <h2 class="u-table-title">{{areaName}}—经营性房产租赁信息统计表</h2>
        <el-table :data="list" stripe style="width: 100%" show-summary header-align="center">
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="organName" label="单位名称" width="170">
          </el-table-column>
          <el-table-column prop="totalHouse" label="总房产数（处）" width="150">
            <template slot-scope="scope">
              <router-link :to="{path:'/operate/overall-statistical/overall-person-list',query:{areaId: scope.row.areaId, organName:scope.row.organName,organId: scope.row.organId,currentPage: page}}">{{scope.row.totalHouse}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="totalBuildArea" label="总经营面积（㎡）" width="170">
          </el-table-column>
          <el-table-column prop="rentHouse" label="出租中（处）" width="140">
            <template slot-scope="scope">
              <router-link :to="{path:'/operate/overall-statistical/overall-vacantDetail',query:{areaId: scope.row.areaId, organName:scope.row.organName,organId: scope.row.organId,useClientStatus:'RENTING',currentPage:page}}">{{scope.row.rentHouse}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="rentArea" label="出租面积（㎡）" width="140">
          </el-table-column>
          <!-- <el-table-column prop="totalRentMoney" label="总租金（元）" width="130">
          </el-table-column> -->
          <el-table-column prop="beenBookedRentMoney" label="已入账租金（元）" width="170">
            <template slot-scope="scope">
              <router-link :to="{path:'/operate/overall-statistical/overall-totalRent',query:{areaId: scope.row.areaId, organName:scope.row.organName,organId:scope.row.organId,roomTypeId:'OFFICEHOUSE', currentPage:page}}">{{scope.row.beenBookedRentMoney}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="maturityNotBookedRentMoney" label="逾期租金（元）" width="170">
          </el-table-column>
          <el-table-column prop="notMaturityRentMoney" label="即将到期租金（元）" width="170">
          </el-table-column>
          <el-table-column prop="idleHouse" label="闲置房产（处）" width="140">
            <template slot-scope="scope">
              <router-link :to="{path:'/operate/overall-statistical/overall-setAside',query:{areaId: scope.row.areaId,organName:scope.row.organName,organId:scope.row.organId,roomTypeId:'DEALIDLE', currentPage:page}}">{{scope.row.idleHouse}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="idleArea" label="闲置面积（㎡）" width="140">
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <!-- <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button> -->
          <!-- <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button> -->
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :current-page="page" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合  
      areaType: '',
      // queryId: '', //导出单位id
      areaName: '市直机关', //地区名称
      pushdate: '', //查询时间
      courtyardId: '', //全部定义
      courtySelectList: [] //单位下拉
    };
  },
  activated() {
    // if (Object.keys(this.$route.query).length != 0) {
    //   this.organId = this.$route.query.organId;
    // }
    this.courtyardId = '';
    this.getDataRequest();
    this.unitDropDown();
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
      this.getDataRequest();
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        organId: this.loginOrganId,
        organName: this.courtyardId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.dealstatistical_rentStatisticsOrganList, params).then(res => {
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
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    getCourtyardName() {
    },
    unitDropDown() {
      this.$axiosGet(API.dealstatistical_findSupervisedOrganListByOrganId, {}).then(res => {
        this.courtySelectList = res.data || []; //单位下拉
      })
    },
    exportClick() { // 导出
      let params = {
        areaId: this.areaId,
        areaType: this.areaType,
        queryTime: this.pushdate, //查询时间  
        organId: this.courtyardId || '',
        // organId: this.queryId || '',
        areaName: this.areaName,
        pageNum: this.page,
        pageSize: this.pageSize,
        exportFlag: 'YES'
      };
      this.$axiosPost(API.dealstatistical_rentStatisticsOrganList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      })
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
#m-padding-l {
  a {
    padding: 0 !important;
  }
}
</style>
