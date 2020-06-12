<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="总体使用统计" :item="['总体使用统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="backHandle">
            返回
          </button>
        </div>
      </div>
       <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>房间号</span>
                  <el-input clearable placeholder="请输入房间号" v-model="roomNo"></el-input>
                </li>
                 <li>
                      <span>房间位置：</span>
                      <el-cascader placeholder="请选择房间位置" v-model="roomLocation" clearable :options="roomList" filterable change-on-select></el-cascader>
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
        <h2 class="u-table-title">{{organName}}-{{type}}房间明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="80">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号" width="160">
              <template slot-scope="scope">
                <a @click="roomDetailInfoClick(scope.row.id,type,'','1')">{{scope.row.roomNo}}</a>
              </template>
          </el-table-column>

          <el-table-column prop="useArea" label="使用面积(㎡)">
          </el-table-column>  
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column label="使用状态" prop="useClientStatusName" key="useClientStatusName">
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
     <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>
<script>
import roomDetail from '@/components/basic-information/query-manage/view/addressnum-sub-detail'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      useClientStatus: '',//房间使用状态
      roomNo:'', //房间号
      organName: '',
      organId: '', //单位id
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomTypeId: '',
      roomLocation:[], //房屋位置
      roomList:[],
      type:'空置', //房间类型
      list: [], // 列表数据集合    

    };
  },
  activated() {
    if (this.$route.query) {
      this.roomTypeId = this.$route.query.roomTypeId;
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
    }
    this.roomLocation = [];
    this.roomNo = '';
    this.getAddress();
    this.getDataRequest();   
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
    //房屋位置下拉
    getAddress() {
      let params = {
        organId: this.organId
      }
      this.$axiosGet(API.totalusage_execTotalUsageSelect, params).then(res => {
        if (res.data) {
          this.roomList = res.data.treeResponseAddress || [];
        } else {
          this.roomList = [];
        }
      })
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    // 详情
    roomDetailInfoClick(id, type,chao,houseStatus) {
      this.$refs.roomDetail.openModal(id, type,chao,houseStatus);
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        useOrganId: this.organId,
        courtyardId:this.roomLocation[0] || '',
        floorId:this.roomLocation[1] || '',
        storeysId:this.roomLocation[2] || '',
        roomNo: this.roomNo,
        roomTypeId: this.roomTypeId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      // this.$axiosGet(API.totalusage_execTotalUsageEmptyRoomList, params).then(res => {
      this.$axiosGet(API.totalusage_execTotalUsageOfficeRoomList, params).then(res => {
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
    //导出功能
    // exportClick() {
    //   let params = {
    //     organId: this.organId,
    //     useClientStatus: this.useClientStatus || '',
    //     roomTypeId: this.roomTypeId || '',
    //     exportFlag: 'YES',
    //     organName: this.organName,
    //     queryTime: this.pushdate,
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_aggregateUsageStatisticsRoomList, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   });
    // },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();     
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest()
    }
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
