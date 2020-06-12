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
        <h2 class="u-table-title">{{organName}}-{{type}}使用明细表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" type='index' width="80">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <template slot-scope="scope">
              <a  @click="roomDetailInfoClick(scope.row.id,type,'','1')">{{scope.row.roomNo}}</a>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="roomTypeNameString" label="房间类型">
          </el-table-column> -->

          <el-table-column label="房间用途" prop="roomUseNameString" key="roomUseNameString" v-if="roomTypeId =='OFFICEHOUSE' || roomTypeId =='SERVICEHOUSE' || roomTypeId =='EQUIPHOUSE' || roomTypeId =='AFFILIATEDHOUSE' || roomTypeId =='TECHHOUSE'">
            </el-table-column>

          <el-table-column prop="useArea" label="使用面积(㎡)" v-if="roomTypeId ==='OFFICEHOUSE' || roomTypeId ==='SERVICEHOUSE' || roomTypeId ==='EQUIPHOUSE'">
          </el-table-column>
           <el-table-column prop="useArea" label="建筑面积(㎡)" v-if="roomTypeId ==='AFFILIATEDHOUSE' || roomTypeId ==='TECHHOUSE' ">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>

          <el-table-column prop="useUsers" label="使用人" v-if="roomTypeId ==='OFFICEHOUSE'">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.useUserList" :key="index">
                <span v-show="index > 0">，</span>{{ item.realName }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="excessive" label="超标情况" width="120" v-if="roomTypeId ==='OFFICEHOUSE'">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.excessive)">{{checkStatusName(scope.row.excessive)}}</span>
            </template>
          </el-table-column> -->
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
    <v-office-detail ref="roomOfficeDetail"></v-office-detail>
  </div>
</template>

<script>
// import roomDetail from '@/components/statistical-manage/overall-statistical/view/overall-record-detail'; // 详情弹出框
import roomDetail from '@/components/basic-information/query-manage/view/addressnum-sub-detail'; // 详情弹出框

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
      roomNo: '', //房间号
      type: '', //房间类型
      roomList: [], //房间位置下拉
      roomLocation: [], //房间位置
      roomTypeId: '', //房间类型
      realName: '', //使用人
      organId: '', //单位id
      houseStatus:false,
      organName: '' //单位名称
    };
  },
  activated() {
    this.page = 1;
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
    this.roomLocation = [];
    this.roomNo = '';
    this.getDataRequest();
    this.getAddress();
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //使用状态
    UserStatus(value) {
      if (value === 'USE') {
        return '在用'
      } else {
        return '空置'
      }
    },
    checkStatus(value) {
      if (value == 'YES') {
        return 's-state-prohibited'
      } else {
        return 's-state-success'
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
          this.roomList = res.data.treeResponseAddress || [];
        } else {
          this.roomList = [];
        }
      })
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        useOrganId: this.organId,
        courtyardId: this.roomLocation[0] || '',
        floorId: this.roomLocation[1] || '',
        storeysId: this.roomLocation[2] || '',
        roomNo: this.roomNo || '',
        roomTypeId: this.roomTypeId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
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
    // 详情
    roomDetailInfoClick(id, type,chao,houseStatus) {
      this.$refs.roomDetail.openModal(id, type,chao,houseStatus);
    },
    // 办公室详情
    officeDetailInfoClick(id, type, exceed) {
      this.$refs.roomOfficeDetail.openModal(id, type, exceed);
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
      this.getDataRequest();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
