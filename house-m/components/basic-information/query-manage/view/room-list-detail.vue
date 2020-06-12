<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1400px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>房间列表</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="padding-top: 0px">
        <div class="h-tab-content">
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
                      <el-cascader placeholder="请选择房间位置" style="padding-top: 0;" v-model="search.roomPos" clearable :options="roomList" filterable change-on-select></el-cascader>
                    </li>
                    <li>
                      <span>房间类型</span>
                      <el-cascader :options="roomTypeList" style="padding-top: 0;" v-model="search.houseType" filterable clearable placeholder="请选择房间类型" change-on-select>
                      </el-cascader>
                    </li>                   
                  </ul>
                </td>
                <!--搜索按钮-->
                <td class="u-search-but">
                  <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column label="房间号" prop="roomNo" width="120">
              <template slot-scope="scope">
                <a @click="roomDetailInfoClick(scope.row.id,organId,'','1')">{{scope.row.roomNo}}</a>
              </template>
            </el-table-column>
            <el-table-column label="房间位置" prop="roomAddress">
            </el-table-column>
            <el-table-column label="建筑面积（㎡）" prop="buildArea" width="150">
            </el-table-column>
            <el-table-column label="使用面积（㎡）" prop="useArea" width="150">
            </el-table-column>
            <el-table-column label="使用单位" prop="useOrganName" width="130">
            </el-table-column>
            <el-table-column label="房间类型" prop="roomTypeNameString" width="130">
            </el-table-column>
            <el-table-column label="使用状态" prop="useClientStatusName" width="120">
            </el-table-column>
            <el-table-column label="使用人数" prop="userNum" width="110">
            </el-table-column>
            <el-table-column label="超标情况" width="120">
              <template slot-scope="scope">
                <span class="z-state" :class="checkStatus(scope.row.excessive)">{{checkStatusName(scope.row.excessive)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="h-table-bottom f-clearfix">
          <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
          <div class="h-table-pages f-pull-right">
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>

      </div>
    </el-dialog>
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>
<script>
import roomDetail from './addressnum-sub-detail'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      roomData: {}, // 房间详情数据
      search: {
        roomNo: '', //房间号     
        roomPos: [], // 房间位置
        houseType: [] // 房间类型绑定的值
      },
      roomList: [],
      roomTypeList: [], // 房间类型集合
      roomUser: [],
      courtyardId: '',
      organId: '',
      myChart2: {},
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [],
      floorName: '',
      carDetailShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(id, cid) {
      this.carDetailShow = true;
      this.courtyardId = cid;
      this.organId = id;
      this.getDetail();
      this.getSearchDate();
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
    //下拉选
    getSearchDate() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.yardSearch2_getTable1Select, params).then(res => {
        this.roomList = res.data.floorAndStoreys;  //房屋位置
        this.houseUseStatusList = res.data.useStatusList; //房间使用状态
        this.roomTypeList = res.data.roomTypes;
      })
    },
    getDetail() {
      let params = {
        courtyardId: this.courtyardId,
        useOrganId: this.organId,
        roomNo: this.search.roomNo,
        floorId: this.search.roomPos[1] || '',
        storeysId: this.search.roomPos[2] || '', //根据房间位置查询
        roomTypeIds: this.search.houseType,
        pageNum: this.page,
        pageSize: this.pageSize
      }


      this.$axiosGet(API.yardSearch2_organUseRoomList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
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
        this.list = list;
      })
    },
    searchClick() {
      this.page = 1;
      this.getDetail();
    },
    // 详情
    roomDetailInfoClick(id, gid,chao,houseStatus) {
      this.$refs.roomDetail.openModal(id, gid,chao,houseStatus);
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDetail();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDetail();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-search {
  margin-bottom: 10px;
  span {
    float: left;
    padding: 10px 5px 0 0;
  }
  .el-input {
    float: left;
    width: auto;
  }
  li {
    float: left;
    margin: 5px 30px 5px 0;
  }
}
</style>

