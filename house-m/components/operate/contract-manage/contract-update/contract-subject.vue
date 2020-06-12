<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <!--  tab切换 -->

        <ul class="house-nav-tab">

          <li @click="pageSelect = 'remind'" :class="{'active':pageSelect=='remind'}">
            <a>经营性房产</a>
          </li>
          <li @click="pageSelect = 'rental'" :class="{'active':pageSelect=='rental'}">
            <a>其他</a>
          </li>
        </ul>
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <div class="h-tab-content" v-show="pageSelect=='remind'">
            <div class="h-table">
              <!-- <el-table :data="list" stripe ref="multipleTable" style="width: 100%"> -->
              <!-- <th class="m-list-head-sel-all-th" nowrap>
                    <span class="minimal i-minimal fl">
                      <i @click="selectAll($event)" class="minimal-hide"></i>
                    </span>
                  </th>
                   <td class="m-list-content-sel-all-th">
                    <span class="minimal i-minimal fl">
                      <i @click="selectOwn($event)" class="minimal-hide" :data-id="li.contractBusinessDTO.contractId"></i>
                    </span>
                  </td> -->
              <el-table :data="list" stripe style="width: 100%" ref="multipleTable">
                <el-table-column fixed="left" type="selection" label="全选" width="50">
                </el-table-column>
                <el-table-column fixed="left" type="index" label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="房屋地址" key='3' prop="roomAddress">
                </el-table-column>
                <el-table-column label="建筑面积" prop="buildArea">
                </el-table-column>
                <el-table-column label="房屋状态" prop="houseStatus">
                </el-table-column>
                <el-table-column label="产权办理情况" prop="warrantSituationName">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="h-tab-content" v-show="pageSelect=='rental'">
            <div class="h-table f-relative">
              <span>提示：当前房屋为办公用房转换用途后用于出租的房屋</span>
              <!-- <el-table :data="list" stripe ref="multipleTable" style="width: 100%"> -->
              <el-table :data="list" stripe style="width: 100%">
                <el-table-column fixed="left" type="selection" label="全选" width="50">

                </el-table-column>
                <el-table-column fixed="left" type="index" label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="房间号" key='3' prop="roomNo">
                </el-table-column>
                <el-table-column label="房屋地址" prop="roomAddress">
                </el-table-column>
                <el-table-column label="建筑面积" prop="buildArea">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="table-bottom-btns f-hidden">
            <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">
              取消
            </el-button>
            <!-- <el-button class="u-submit-btn submit-btn" :loading="loading">保存</el-button> -->
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getAddDataRequest">保存</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      loading: false,
      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      ruleForm: {},
      rules: {},
      list: [], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      pageSelect: "",
      courtyardName: '', // 院落数据名称
      courtyardAddress: '', // 院落数据地址
      imgUrl: [], // 院落数据图片
      // dealRoomList: [], //经营性房产房屋列表
      // officeRoomList: [], //其他房屋列表
      // tableData: ''
      cstr: ''

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      // this.getDataRequest()
      this.getTableData()
      this.getList()
      this.carDetailShow = true;
      this.pageSelect = "remind";
    },
    // getDataRequest() {
    //   let params = {
    //     courtyardId: this.id,
    //     courtyardName: "",
    //   };
    //   this.$axiosPost(API.courtYard_queryDetail, params).then(res => {
    //     this.courtyardAddress = res.data.courtyardAddress;
    //     this.courtyardName = res.data.courtyardName;
    //     this.imgUrl = res.data.fileResponse || [];
    //   });
    // },
    // 获取经营性房产房屋列表数据
    getList() {
      let params = {
        // courtyardId: this.id,
        // currentPage: this.page,
        // pageSize: this.pageSize
      }
      this.$axiosPost(API.contract_getDealRoomInfo, params).then(res => {
        // this.total = res.data.total;

        let list = res.data.dealRoomList;
        if (list.length > 0) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;

      })

    },
    // 获取其他房屋的列表数据
    getTableData() {
      let params = {
        // courtyardId: this.id,
        // currentPage: this.roompage,
        // pageSize: this.roompageSize
      }
      this.$axiosPost(API.contract_getDealRoomInfo, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.officeRoomList || [];
          // this.roomtotal = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.roomlist = list;
        } else {
          this.roomlist = [];
          this.roomtotal = 0;
        }

      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getList();
    },
    handleSizeChange1(i) { // 切换数据条数
      this.roompageSize = i;
      this.getTableData()
    },
    handleCurrentChange1(i) { // 切换数据页数
      this.roompage = i;
      this.getTableData()
    },

    getAddDataRequest(row) {
      // this.$emit('getMsgFormSon', this.cstr);
      this.$emit('getMsgFormSon', this.$refs.multipleTable.store.states.selection);
      this.carDetailShow = false;

      // handleSelectionChange(val) {
      //   this.multipleSelection = val;

      // },
      // onTableSelect(rows, row) {
      //   let selected = rows.length && rows.indexOf(row) !== -1
      // }
    },
  }
};
</script>

<style lang="scss" scoped>
.house-nav-tab {
  margin-top: 0 !important;
}
</style>

