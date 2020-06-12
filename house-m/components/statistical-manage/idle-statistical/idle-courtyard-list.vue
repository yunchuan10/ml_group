<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="闲置情况统计" :item="['闲置情况统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/statistical-manage/idle-statistical/idle-list',query:{areaId:this.$route.query.areaId}}">
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
                  <span>房间号</span>
                  <el-input v-model="roomNumber" clearable placeholder="请输入房间号"></el-input>                  
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
        <h2 class="u-table-title">{{courtyardName}}院落闲置办公用房明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <!-- <template slot-scope="scope">
              <a @click="courtyardNamesClick()">{{scope.row.roomNo}}</a>
            </template> -->
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="buildArea" label="建筑面积（㎡）">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积（㎡）">
          </el-table-column>
          <el-table-column prop="useStatusName" label="房间状态">
          </el-table-column>
        </el-table>
        <!-- <div class="remark">说明：闲置用房是指各地区各院落内目前没有单位在使用的房间</div> -->
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
          <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <rooms-details ref="roomsdetails"></rooms-details>
  </div>
</template>
<script>
import roomsdetails from '@/components/disposal-manage/rooms-details'; // 详情弹出框
export default {
  components: {
    'rooms-details': roomsdetails
  },
  data() {
    return {
      roomNumber: '',
      roomLocation: '',
      pushdate: '',
      courtyardName: '',
      roomLocations: [],
      areaName: '',
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      areaId: '',
      list: [] // 列表数据集合    
    };
  },
  activated() {
    if (this.$route.query.courtyardName) {
      this.courtyardName = this.$route.query.courtyardName;
    }
    if (this.$route.query.organId) {
      this.organId = this.$route.query.organId;
    }
    if (this.$route.query.courtyardId) {
      this.courtyardId = this.$route.query.courtyardId;
    }
    this.roomNumber = '',
    this.getDataRequest();
  },
  mounted() {
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  methods: {
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //获取列表数据
    getDataRequest() {
      let params = {
        organId: this.loginOrganId,
        courtyardId: this.courtyardId,
        roomNo: this.roomNumber || '',
        roomAddress: this.roomLocation,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.idle_execIdleRoomList, params).then(res => {
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
    getSelectRequest() {
      let param = {
        organId: this.loginOrganId
      }
      this.$axiosGet(API.totalusage_execTotalUsageSelect, param).then(res => {
        this.roomLocations = res.data.treeResponseAddress;
      });
    },
    exportClick() {
      let params = {
        areaId: this.areaId,
        areaType: this.areaType,
        queryTime: this.pushdate,
        areaName: this.areaName,
        exportFlag: 'YES',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.aggregateUsage_idleStatisticsAreaList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      });
    },
    courtyardNamesClick(id) {
      this.$refs.roomsdetails.openModal(id);
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