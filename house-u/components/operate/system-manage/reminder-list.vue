<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="到期提醒" :item="['到期提醒']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column prop="description" label="描述">
          </el-table-column>
          <el-table-column prop="remindSwitch" label="是否启用">
            <template slot-scope="scope">
              <el-switch class="switchStyle" active-text="开" inactive-text="关" v-model="scope.row.remindSwitch" @change="switchControl(scope.row.remindSwitch,scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="updatedAt" label="启用/停用时间">
            <template slot-scope="scope">
              {{scope.row.updatedAt}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <!-- <a @click="deleteClick(scope.row.storeysId)">停用</a> -->
              <a v-show="scope.row.flag ==='RENT'" @click="rentalExpiredClick('RENT')">修改</a>
              <a v-show="scope.row.flag ==='CONTRACT'" @click="contractExpiredClick('CONTRACT')">修改</a>
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
    <!-- 租金到期提醒 -->
    <rental-expired ref="rentalExpired"></rental-expired>
    <!-- 合同到期提醒 -->
    <contract-expired ref="contractExpired"></contract-expired>

    <!-- <building-detail ref="buildingDetail"></building-detail> -->
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
// import buildingDetail from '@/components/basic-information/building-manage/building-detail'; // 详情弹出框
import contractExpired from '@/components/operate/system-manage/reminder-message/contract-expired'; // 合同到期弹出框
import rentalExpired from '@/components/operate/system-manage/reminder-message/rental-expired'; // 租金到期弹出框
export default {
  components: {
    // 'building-detail': buildingDetail,
    'contract-expired': contractExpired,
    'rental-expired': rentalExpired,

  },
  data() {
    return {
      courtyardId: '', // 院落ID
      floorId: '', //楼座Id
      id: '', // 详情id
      deleteYardId: '',//删除id
      floorName: '', // 楼座名称
      courtyardName: '',// 院落名称
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 合同列表数据集合
      courtySelectList: [],//院落下拉列表查询
      floorSelectList: []//楼座下拉列表查询
    };
  },
  activated() {
    this.list = [];
    this.getContractRceminders();
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  methods: {
    //获取合同/租金提醒信息
    getContractRceminders() {
      let params = {
        // flag: 'CONTRACT',
        organId: this.loginOrganId,
      };
      this.$axiosGet(API.sysmanage_getRemindBaseSet, params).then(res => {
        if (res.data) {
          this.list = res.data;
          this.list.forEach((item, index) => {
            item.dateUpdate = DATEFORMAT.dateReturnYMDHMS(new Date(item.dateUpdate));
            if (item.remindSwitch == 'ON') {
              item.remindSwitch = true;
            } else {
              item.remindSwitch = false;
            }
            this.list[index].num = index + 1;
          });
        }
      })
    },
    //获取租金提醒信息
    // getRentReminder() {
    //   let params = {
    //     // flag: 'RENT',
    //     organId: this.loginOrganId,
    //   };
    // this.$axiosPost(API.sysmanage_getRemindBaseSet, params).then(res => {
    //   if (res.data) {
    //     let list = [];
    //     list.push(res.data)
    //     list.forEach((item) => {
    //       if (item.remindSwitch == 'ON') {
    //         item.remindSwitch = true;
    //       } else {
    //         item.remindSwitch = false;
    //       }
    //     })
    //     this.list.push(...list)
    //     this.list.forEach((item, index) => {
    //       this.list[index].num = index + 1;
    //     });
    //   }
    // })
    // },
    switchControl(type, row) {
      let params = {};
      if (row.flag == 'RENT') {
        params = {
          flag: 'RENT',
          organId: this.loginOrganId,
          id: row.id,
          startDate: row.startDate,
          title: row.title,
          text: row.text,
          remindType: row.remindType,
          remindSwitch: type == true ? 'ON' : 'OFF',
          type: row.type
        };
      }
      if (row.flag == 'CONTRACT') {
        params = {
          flag: 'CONTRACT',
          organId: this.loginOrganId,
          id: row.id,
          startDate: row.startDate,
          title: row.title,
          text: row.text,
          remindType: row.remindType,
          remindSwitch: type == true ? 'ON' : 'OFF',
          type: row.type
        };
      }
      this.$axiosJsonPost(API.sysmanage_onOrOffRemindBaseSet, params).then(res => {
        // console.log(params)
        // this.list = [];
        this.YPromptShow = true;
        if (res.result === "success") {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
        this.getContractRceminders();
        // this.getRentReminder();
      })
    },
    contractExpiredClick(id) {
      this.$refs.contractExpired.openModal(id);
    },
    rentalExpiredClick(id) {
      this.$refs.rentalExpired.openModal(id);
    },
    // 详情
    // buildingInfoClick(id) {
    //   this.$refs.buildingDetail.openModal(id);
    // },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除楼座将会连同该楼座下的楼层、房间一并删除，确认删除吗？'
    },
    // 删除
    YDeleteClick() {
      let params = {
        floorId: this.deleteYardId
      }
      this.$axiosPost(API.floor_delete, params).then(res => {
        this.getSelectRequest();
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        // this.getDataRequest();
      }
    },

    //获取表格列表信息
    // getDataRequest() {
    //   let params = {
    //     courtyardId: this.courtyardId,
    //     courtyardName: '',
    //     floorName: this.floorName,
    //     floorId: this.floorId,
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.floor_query, params).then(res => {
    //     let list = [];
    //     list = res.data.data;
    //     this.total = res.data.total;
    //     list.forEach((item, index) => {
    //       list[index].num = index + 1;
    //     });
    //     this.list = list;
    //   });
    // },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      // this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      // this.getDataRequest();
    },
  },

};
</script>

<style lang="scss">
.switchStyle {
  .el-switch__label {
    position: absolute;
    display: none;
    font-weight: normal;
  }
  .el-switch__label * {
    font-size: 12px;
  }
  .el-switch__label--left {
    z-index: 9;
    left: 26px;
    color: #999;
  }
  .el-switch__label--right {
    z-index: 9;
    left: -2px;
    color: #fff;
  }
  .el-switch__label.is-active {
    display: block;
    height: 26px;
    line-height: 26px;
  }
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
.el-switch,
.el-switch__core {
  height: 26px;
  line-height: 26px;
}
.el-switch__core {
  border-radius: 15px;
  &:after {
    width: 20px;
    height: 20px;
    top: 2px;
    left: 3px;
    z-index: 10;
  }
}
.el-switch.is-checked .el-switch__core::after {
  margin-left: -23px;
}
</style>
