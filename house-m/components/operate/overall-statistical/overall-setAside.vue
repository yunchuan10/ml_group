<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="统计分析" :item="['统计分析']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <!-- <router-link :to="{path:'/operate/overall-statistical/overall-company-list',query:{areaId:areaId,currentPage:Hpage}}">
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link> -->
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
                  <span>街道</span>
                  <el-input clearable filterable placeholder="请输入街道名称" v-model="street">
                  </el-input>
                </li>
                <li>
                  <span>门牌号</span>
                  <el-input clearable filterable placeholder="请输入门牌号" v-model="houseNo">
                  </el-input>
                </li>
                <li>
                  <span>取得方式</span>
                  <el-select v-model="acquisitionMode" clearable filterable placeholder="请选择取得方式">
                    <!-- <el-option label="全部" value=''></el-option> -->
                    <el-option v-for="(iten, index) in acquisitionModeList" :key="index" :label="iten.dicName" :value="iten.dicValue"></el-option>
                  </el-select>
                </li>
                <!-- <li>
                  <span>房屋状态</span>
                  <el-select v-model="houseStatus" filterable placeholder="请选择房屋状态">
                    <el-option label="全部" value=''></el-option>
                    <el-option v-for="(iten, index) in houseStatusList" :key="index" :label="iten.dicName" :value="iten.dicValue"></el-option>
                  </el-select>
                </li> -->
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
        <h2 class="u-table-title">{{pushdate}} {{organName}}—闲置经营性房产明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="street" label="街道">
          </el-table-column>
          <el-table-column prop="houseNo" label="门牌号">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.id)">{{scope.row.houseNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="houseAddress" label="地址坐落" width="250">
          </el-table-column>
          <el-table-column prop="organName" label="管理单位">
          </el-table-column>
          <el-table-column prop="area" label="经营面积（㎡）">
          </el-table-column>
          <el-table-column prop="acquisitionModeName" label="取得方式">
          </el-table-column>
          <el-table-column prop="statusName" label="房屋状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.statusName)"> {{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="picture" label="房间照片">
            <template slot-scope="scope">
              <div class="u-picture-house">
                <i :class="scope.row.picture == 'YES' ? 'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="idleReason" label="闲置原因">
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
    <!-- 详情 -->
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>

<script>
import roomDetail from '@/components/operate/room-manage-street/room-roomnum'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      useClientStatus: '',//房间使用状态
      pushdate: '', //查询时间
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
      list: [], // 列表数据集合    
      areaId: '',
      Hpage: 1, //记录传过来的页数
      roomAddress: '', //地址
      personName: '', //闲置原因
      personNameList: [], //闲置原因集合
      storeysName: '',
      street: '',
      houseNo: '',
      acquisitionMode: '',
      acquisitionModeList: [],
      houseStatus: '',
      houseStatusList: [],
    };
  },
  activated() {
    if (this.$route.query) {
      this.roomTypeId = this.$route.query.roomTypeId;
      // this.useClientStatus = this.$route.query.useClientStatus;
      this.pushdate = this.$route.query.queryTime;
      this.organId = this.$route.query.organId;
      this.areaId = this.$route.query.areaId;
      this.organName = this.$route.query.organName;
      // this.Hpage = this.$route.query.currentPage;
    }
    this.page = 1;
    this.street = '';
    this.houseNo = '';
    this.acquisitionMode = '';
    this.houseStatus = '';
    this.getDataRequest();
    this.getCourtyardName();
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
    checkStatus(value) {
      if (value == '闲置') {
        return 's-state-success'
      } else {
        return 's-state-prohibited'
      }
    },

    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
      // this.getRoomDataRequest();
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        organId: this.organId || '',
        street: this.street || '', //地址
        houseNo: this.houseNo || '', //闲置原因
        acquisitionMode: this.acquisitionMode || '',
        // houseStatus: this.houseStatus == '' ? this.roomTypeId : this.houseStatus, //合同默认为闲置状态
        // houseStatus: this.houseStatus || '',
        houseStatus: this.roomTypeId, //合同默认为闲置状态
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.$axiosGet(API.dealstatistical_rentStatisticsRoomList, params).then(res => {
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
    // getRoomDataRequest() {
    //   let params = {
    //     organId: this.organId,
    //     useClientStatus: this.useClientStatus,
    //     roomTypeId: '',
    //     queryTime: this.pushdate,
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_aggregateUsageStatisticsRoomList, params).then(res => {
    //     let list = [];
    //     if (res.data) {
    //       list = res.data.list;
    //       this.total = res.data.total;
    //     }
    //     if (list) {
    //       list.forEach((item, index) => {
    //         list[index].num = index + 1;
    //       });
    //     }
    //     this.list = list;
    //   });
    // },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    getCourtyardName() {
      // let params = {
      //   // areaId: this.areaId,
      // }
      // this.$axiosPost(API.dealhouse_queryStatusAndWarrantList, params).then(res => {
      //   if (res.data) {
      //     this.personNameList = res.data.sysIdleReasonResponseList; //闲置原因集合
      //   }
      // })
      this.$axiosGet(API.dealhouse_queryStatusAndAcquisitionList, {}).then(res => {
        this.houseStatusList = res.data.houseStatusList || []; //房屋出租状态集合
        this.acquisitionModeList = res.data.acquisitionModeList; //取得方式集合
      })
    },
    exportClick() { // 导出
      let params = {
        areaId: this.areaId || '',
        organId: this.organId || '',
        street: this.street || '', //地址
        houseNo: this.houseNo || '', //闲置原因
        acquisitionMode: this.acquisitionMode || '',
        // houseStatus: this.houseStatus || '',
        houseStatus: this.roomTypeId,
        // roomAddress: this.roomAddress || '', //地址
        // idleReason: this.personName || '', //闲置原因
        // houseStatus: this.roomTypeId, //合同默认为闲置状态
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize,
        exportFlag: 'YES',
        organName: this.organName
      };
      this.$axiosPost(API.dealstatistical_rentStatisticsRoomList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      })
    },
    // 详情
    roomDetailInfoClick(roomId) {
      this.$refs.roomDetail.openModal(roomId);
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
.u-picture-house {
  line-height: 30px;
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
