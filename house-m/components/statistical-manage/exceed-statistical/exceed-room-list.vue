<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标明细表" :item="['超标明细表']" type="1"></Y-Breadcrumb>
        <router-link :to="{path:'/statistical-manage/exceed-statistical/exceed-list',}">
          <button class="f-pull-right u-bread-btn">
            返回
          </button>
        </router-link>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>房间位置</span>
                  <el-cascader placeholder="请选择房间位置" v-model="roomLocation" clearable :options="roomList" filterable change-on-select></el-cascader>
                </li>
                <li>
                  <span>房间号</span>
                  <el-input clearable placeholder="请输入房间号" v-model="addressId"></el-input>
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
        <h2 class="u-table-title">{{organName}}{{type}}超标情况一览表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.id,type)">{{scope.row.roomNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomTypeNameString" label="房间类型">
          </el-table-column>
          <el-table-column prop="name" label="房间名称">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积（㎡）">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="userNum" label="使用人数">
          </el-table-column>
          <el-table-column prop="realNameString" label="当前使用人">
          </el-table-column>
          <el-table-column prop="excessiveArea" label="超标面积（㎡）">
          </el-table-column>
          <el-table-column prop="record" label="状态">
            <template slot-scope="scope">
              {{scope.row.record == 'YES' ? '已备案':'未备案'}}
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
    <basic-detail ref="basicDetail"></basic-detail>
    <!--操作提示框-->
    <!-- <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt> -->

  </div>
</template>

<script>
import basicDetail from '@/components/basic-information/query-manage/view/addressnum-sub-detail'; // 详情弹出框
export default {
  components: {
    'basic-detail': basicDetail,
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      rentEntryVisible: false, //闲置原因补录弹框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      roomList: [],//房间位置集合
      addressId: '', //房间号
      roomLocation: [],//房间位置
      roomTypeList: [], //房间类型下拉
      roomType: [], //房间类型
      roomId: '',//房间id
      type: '办公室', //房间类型
      organName: ''
    };
  },
  activated() {
    if (this.$route.query) {
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
      this.Hpage = this.$route.query.currentPage;
    }
    this.roomLocation = [];
    this.addressId = '';
    // this.userName = '';
    this.roomType = [];
    this.getDataRequest();
    this.getAddress()
  },
  computed: {

    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  methods: {
    // 详情
    basicInfoClick(id, type) {
      this.$refs.basicDetail.openModal(id, type);
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
        this.rentEntryVisible = false;
      }
    },
    exportClick() { },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
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
        courtyardId: this.roomLocation[0] || '',
        floorId: this.roomLocation[1] || '',
        storeysId: this.roomLocation[2] || '',
        roomNo: this.addressId || '',
        organId: this.organId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.excessvie_excessiveOfficeRoomList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total; //分页数据数量回显
          this.list = list;
          this.roomTypeList = res.data.roomTypeList || [];
          if (res.data.excessiceRoomList) {
            res.data.excessiceRoomList.forEach((item, inNa) => {
              let useUsers = '';
              item.useUsers.forEach((row, index) => {
                if (index == item.useUsers.length - 1) {
                  useUsers += row.realName;
                } else {
                  useUsers += row.realName + ',';
                }
              })
              this.list[inNa].useUsers = useUsers;
            })
          }
        } else {
          this.list = [];
          // this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
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
    },
    //获取备案信息
    getkeepOnRecord(roomRecordId) {
      let params = {
        roomRecordId: roomRecordId,
      };
      this.$axiosPost(API.useManage_roomRecordDetail, params).then(res => {
        this.ruleForm.messageFee = res.data.situationDescription;
        this.ruleForm.domains = res.data.sysAttachmentInfoList;
      })
    }
  }
};
</script>

<style lang="scss">
.tdstyle .el-form-item {
  margin-bottom: 0px;
}
.tdstyle .el-form-item__error {
  top: 66%;
}
.u-table {
  font-size: 18px;
  text-align: center;
  margin: 10px 0 20px 0;
}
</style>
