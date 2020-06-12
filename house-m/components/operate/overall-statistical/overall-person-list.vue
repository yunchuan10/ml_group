<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <!-- 总房产 -->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="统计分析" :item="['统计分析']" type="2"></Y-Breadcrumb>
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
                  <el-select v-model="acquisitionMode" filterable clearable placeholder="请选择取得方式">
                    <el-option v-for="item in acquisitionModeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>房屋状态</span>
                  <el-select v-model="houseStatus" clearable placeholder="请选择房屋状态">
                    <el-option v-for="item in houseStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
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
      <div class="h-table f-relative">
        <h2 class="u-table-title">{{pushdate}} {{organName}}—经营性房产明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" type='index' width="100">
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
              <i :class="scope.row.picture == 'YES' ? 'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
            </template>
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
      duty: '', //产权办理情况
      exceed: '', //房屋状态
      personName: '', //闲置原因
      areaId: '',
      pushdate: '', //时间
      organName: '',
      myChart: {}, //统计表
      Hpage: 1, //记录传过来的页数
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合   
      dutyList: [], //产权集合
      exceedList: [], //房屋状态集合
      personNameList: [], //闲置原因集合
      street: '',
      houseNo: '',
      acquisitionMode: '',
      houseStatus: '',
      acquisitionModeList: [],
      houseStatusList: []
    };
  },
  activated() {
    if (Object.keys(this.$route.query).length != 0) {
      this.organId = this.$route.query.organId;
      this.areaId = this.$route.query.areaId;
      this.pushdate = this.$route.query.queryTime;
      this.organName = this.$route.query.organName;
      this.Hpage = this.$route.query.currentPage;
    }
    this.acquisitionMode = '';
    this.houseStatus = '';
    this.houseNo = '';
    this.street = '';
    this.getDataRequest();
    this.getHousingStatus();
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
        organId: this.organId,
        street: this.street,
        houseNo: this.houseNo,
        acquisitionMode: this.acquisitionMode || '',
        houseStatus: this.houseStatus || '',//房屋状态
        queryTime: this.pushdate,
        pageNum: this.page,
        pageSize: this.pageSize
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
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    exportClick() { // 导出
      let params = {
        areaId: this.areaId,
        organId: this.organId,
        street: this.street,
        houseNo: this.houseNo,
        acquisitionMode: this.acquisitionMode,
        houseStatus: this.houseStatus,//房屋状态
        // warrantSituation: this.duty,//产权办理情况
        // idleReason: this.personName,//闲置原因
        // houseStatus: this.exceed,//房屋状态
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
    getHousingStatus() {
      this.$axiosGet(API.dealhouse_queryStatusAndAcquisitionList, {}).then(res => {
        this.houseStatusList = res.data.houseStatusList || []; //房屋出租状态集合
        this.acquisitionModeList = res.data.acquisitionModeList; //取得方式集合
      })
    },
    checkStatus(value) {
      if (value == '闲置') {
        return 's-state-success'
      } else {
        return 's-state-prohibited'
      }
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
