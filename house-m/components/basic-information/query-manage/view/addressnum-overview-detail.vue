<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1040px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>{{type}}列表</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <!-- <el-row :gutter="20" v-if="type =='OFFICEHOUSE'">
            <el-col :span="8">
              <div class="grid-content u-grid-content f-relative f-clearfix">
                <el-col :span="10">
                  <div class="u-query-icons">
                    <img  :src="$store.state.imgPath.queryroom">
                  </div>
                </el-col>
                <el-col :span="14">
                  <div class="u-query-txt">
                    <p>实际人数</p>
                    <h2 class="u-query-h2">{{officeList.realUserNum ? officeList.realUserNum : '0'}}人</h2>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="8">
              <div  class="grid-content u-grid-content f-relative f-clearfix">
                <el-col :span="10">
                  <div class="u-query-icons">
                    <img  :src="$store.state.imgPath.queryexceed">
                  </div>
                </el-col>
                <el-col :span="14">
                  <div class="u-query-txt">
                    <p>超标人数</p>
                    <h2 class="u-query-h2">{{officeList.excessiveUserNum ? officeList.excessiveUserNum : '0'}}人</h2>
                  </div>
                </el-col>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content u-grid-content f-relative f-clearfix">
                <el-col :span="10">
                  <div class="u-query-icons">
                    <img  :src="$store.state.imgPath.queryregister">
                  </div>
                </el-col>
                <el-col :span="14">
                  <div class="u-query-txt">
                    <p>超标面积</p>
                    <h2 class="u-query-h2">{{officeList.excessiveAreaSum ? officeList.excessiveAreaSum: '0'}}㎡</h2>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row> -->
          <div class="m-search">
            <table>
              <tr>
                <td>
                  <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                    <li>
                      <span>房间号：</span>
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
                  <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <!-- 办公室 -->
          <el-table :data="oppList" stripe style="width: 100%">
            <el-table-column fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column label="房间号">
              <template slot-scope="scope">
                 <a @click="roomDetailInfoClick(scope.row.id,type,'','1')">{{scope.row.roomNo}}</a>
               </template>
            </el-table-column>
            <el-table-column label="房间用途" prop="roomUseNameString" key="roomUseNameString" v-if="roomTypeId =='OFFICEHOUSE' || roomTypeId =='SERVICEHOUSE' || roomTypeId =='EQUIPHOUSE' || roomTypeId =='AFFILIATEDHOUSE' || roomTypeId =='TECHHOUSE'">
            </el-table-column>
            <el-table-column label="使用面积（㎡）" prop="useArea" v-if="roomTypeId =='OFFICEHOUSE' || roomTypeId =='EQUIPHOUSE' || roomTypeId =='SERVICEHOUSE' || roomTypeId == 'TYPENULL'">
            </el-table-column>
            <el-table-column label="建筑面积（㎡）" prop="buildArea" key="buildArea" v-if="roomTypeId =='AFFILIATEDHOUSE' || roomTypeId =='TECHHOUSE'" >
            </el-table-column>
            <el-table-column label="房间位置" prop="roomAddress">
            </el-table-column>
            <el-table-column label="使用人" prop="useUserList" key="useUserList" v-if="roomTypeId =='OFFICEHOUSE'">
            </el-table-column>
            <el-table-column label="使用状态" prop="useClientStatusName" key="useClientStatusName" v-if="roomTypeId =='TYPENULL'">
            </el-table-column>           
          </el-table>
        </div>
        <div class="h-table-bottom f-clearfix">
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
import roomDetail from '@/components/basic-information/query-manage/view/addressnum-sub-detail'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      roomData: {}, // 房间详情数据
      roomUser: [],
      myChart2: {},
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      carDetailShow: false, // 弹出框开关
      isShowLeftBannel: false,
      isCompany: false,
      roomList: [], //房间位置下拉
      roomLocation: [], //房间位置
      roomNo: '', //房间号
      oppList: [], //办公室列表数据
      useUserList: '', //使用人集合
      officeList: [], //办公室Table卡集合
      type: '', //房间类型
      organId: '', //单位id
      courtyardId: '', //院落id
      roomTypeId: '' //房间编码
    };
  },
  activated() {
  },
  methods: {
    // 初始化弹出框
    openModal(id, courtyardId, type, roomTypeId) {
      this.roomNo = '';
      this.roomLocation = [];
      this.organId = id;
      this.courtyardId = courtyardId;
      this.type = type;
      this.roomTypeId = roomTypeId;
      this.carDetailShow = true;
      this.pageSize = 10, // 数据最大值
      this.page = 1; // 当前页
      this.getDetail();
      this.getOfficeList();
      this.getDataRequest()
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
    getDetail() {
      let params = {
        useOrganId: this.organId,
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.organSearch2_getFloorAndStoreys, params).then(res => {
        if (res.data) {
          this.roomList = res.data || [];
        } else {
          this.roomList = [];
        }
      })
    },
    //办公室表头数据
    getOfficeList() {
      let params = {
        useOrganId: this.organId,
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.organSearch2_countOfficeEChart, params).then(res => {
        if(res.result ==='success' && res.data) {
          this.officeList = res.data || [];
          if (!this.officeList.excessiveAreaSum) {
            this.officeList.excessiveAreaSum = 0;
          }
        }
      })
    },
    //办公室列表
    getDataRequest() {
      let params = {
        useOrganId: this.organId,
        roomNo: this.roomNo || '',
        roomTypeId: this.roomTypeId === 'TYPENULL' ? '' : this.roomTypeId,
        courtyardId: this.courtyardId || '',
        floorId: this.roomLocation[1] || '',
        storeysId: this.roomLocation[2] || '',
        useClientStatus: this.roomTypeId === 'TYPENULL' ? 'EMPTY' : '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.organSearch2_listRoom, params).then(res => {
        if (res.data) {
          let list = [];
          let useUserList = ''
          list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              useUserList = ''
              list[index].num = index + 1;
              item.useUserList.forEach((it, ix) => {
                if ((item.useUserList.length - 1) == ix) {
                  useUserList += it.realName;
                } else {
                  useUserList += it.realName + ',';
                }
              })
              item.useUserList = useUserList
            });
            this.oppList = list;
          } else {
            this.oppList = [];
          }
        }
      })
    },
    // 详情
    roomDetailInfoClick(id, type, chao,houseStatus) {
      this.$refs.roomDetail.openModal(id, type, chao,houseStatus);
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest()
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
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
.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 25px 0;
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-query-icons {
    width: 60px;
    height: 64px;
    margin: 5px auto 0;
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    font-size: 16px;
    margin-top: 15px;
  }
}
.el-row {
  margin: 20px 0;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  a {
    color: #303133;
  }
}
.el-col a p {
  color: #606266;
}
.el-cascader {
  padding: 0 !important;
}
.u-detail-dialog-content {
  padding: 0 15px 0 15px !important;
  .h-tab-content {
    margin-top: 0px !important;
  }
}
.f-clearfix {
  margin-top: 10px;
}
</style>

