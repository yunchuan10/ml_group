<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="总体使用统计" :item="['总体使用统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/statistical-manage/overall-statistical/overall-list'}">
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
                  <el-input clearable placeholder="请输入房间号" v-model="search.roomNo"></el-input>
                </li>
                <li>
                  <span>房间位置</span>
                  <el-cascader style="padding-top:0;" placeholder="请选择房间位置" v-model="search.roomPos" clearable :options="roomLocationList" filterable change-on-select></el-cascader>
                </li>
                <li>
                  <span>房间类型</span>
                  <el-cascader style="padding-top:0;" :options="roomTypeList" v-model="search.houseType" filterable clearable change-on-select placeholder="请选择房间类型">
                  </el-cascader>
                </li>
                <li>
                  <span>使用状态</span>
                  <el-select v-model="search.roomStatus" filterable clearable placeholder="请选择使用状态">
                    <el-option v-for="item in houseUseStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
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
        <h2 class="u-table-title">{{organName}}-办公用房总体使用明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" type='index' width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.roomId)">{{scope.row.roomNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomBaseTypes" label="房间类型">
          </el-table-column>
          <el-table-column prop="userArea" label="使用面积(㎡)">
          </el-table-column>
          <el-table-column prop="useClientStatusName" label="使用状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.useClientStatusName)">{{scope.row.useClientStatusName || '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="useUserNum" label="使用人数">
          </el-table-column>
          <el-table-column prop="excessivePersonResponseList" label="当前使用人">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.excessivePersonResponseList" :key="index">
                <span v-show="index > 0">，</span>{{ item.realName }}
              </span>
            </template>
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
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>
<script>
import roomDetail from '@/components/statistical-manage/overall-statistical/view/room-detail'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      Hpage: 1, //记录传过来的页数
      list: [], // 列表数据集合  
      search: {
        roomStatus: '', //使用状态
        roomPos: [], // 房间位置
        roomNo: '', // 房屋号
        houseType: [], //房间类型
        useOrganName: '' //使用单位
      },
      type: '', //房间类型
      roomLocationList: [], //房间位置
      houseUseStatusList: [], //房屋使用状态
      roomTypeList: [], //房间类型
      roomTypeId: '', //房间类型
      realName: '', //使用人
      organId: '', //单位id
      organName: '' //单位名称
    };
  },
  activated() {
    if (this.$route.query) {
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
      this.type = this.$route.query.type;
    }
    if (this.$route.query.roomTypeId) {
      this.roomTypeId = this.$route.query.roomTypeId;
    } else {
      this.roomTypeId = ''
    }
    if (this.$route.query.currentPage) {
      this.Hpage = this.$route.query.currentPage;
    }
    this.search.roomPos = [];
    this.search.houseType = [];
    this.search.roomStatus = '';
    this.search.roomNo = '';
    this.getDataRequest();
    this.getAddress();
  },
  mounted() {
  },
  computed: {
  },
  destroyed() {
    this.search.roomPos = [];
    this.search.houseType = [];
    this.search.roomStatus = '';
    this.search.roomNo = ''
  },

  methods: {
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //使用状态
    checkStatus(value) {
      if (value === '空置') {
        return 's-state-success'
      } else if (value === '在用') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    checkStatusName(value) {
      if (value == 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    },
    //房屋位置下拉
    getAddress() {
      let params = {
        organId: this.organId
      }
      this.$axiosGet(API.totalusage_execTotalUsageSelect, params).then(res => {
        if (res.data) {
          this.roomLocationList = res.data.treeResponseAddress || [];
          this.houseUseStatusList = res.data.UseClientStatusList || [];
          this.roomTypeList = res.data.treeResponsesType || [];
        }
      })
    },
    // 获取列表数据
    //获取列表信息
    getDataRequest() {
      let roomTypeIds = [];
      if (this.search.houseType.length == 2) {
        roomTypeIds.push(this.search.houseType[1]);
      } else if (this.search.houseType.length == 1) {
        roomTypeIds.push(this.search.houseType[0]);
      } else {
        roomTypeIds = [];
      }
      let params = {
        courtyardId: this.search.roomPos[0] || '',
        floorId: this.search.roomPos[1] || '',
        storeysId: this.search.roomPos[2] || '',
        roomTypeIds: JSON.stringify(roomTypeIds), //房间使用类型,
        roomNo: this.search.roomNo, //房间号
        useClientStatus: this.search.roomStatus || '', //使用状态
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.useManage_roomList, params).then(res => {
        if (res.data) {

          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.houseUseStatusList = [];
          this.roomTypeList = [];
          this.list = [];
          this.total = 0;
        }
      })
    },
    // 详情
    roomDetailInfoClick(id) {
      this.$refs.roomDetail.openModal(id);
    },
    // exportClick() {
    //   let params = {
    //     areaId: this.areaId,
    //     areaType: this.areaType,
    //     queryTime: this.pushdate, //查询时间  
    //     areaName: this.areaName,
    //     exportFlag: 'YES',
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_aggregateUsageStatisticsAreaList, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   })
    // }, // 导出按钮

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
