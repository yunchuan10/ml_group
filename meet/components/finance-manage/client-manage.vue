<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单信息" :item="['客户管理']"></zl-breadcrumb>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="单位名称">
            <el-input clearable v-model="search.dept" placeholder="请输入单位名称"></el-input>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <div class="h-table f-relative">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="CLIENT_MANAGE">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="单位名称" v-if="listTableListBol[0].show" prop="customerName"></el-table-column>
          <el-table-column label="可使用会议室" v-if="listTableListBol[1].show" prop="roomInfoList">
            <template slot-scope="scope">
              <span style="padding: 0 3px" v-for="(item,index) in scope.row.roomInfoList" :key="index">{{item.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="listItemEdit(scope.row.customerOrganId)">修改</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>

    <!--修改客户管理信息-->
    <zl-confirm v-model="confirmShow" title="修改客户管理信息" @click="confirmClick">
      <div class="client-check-box">
        <el-checkbox-group v-model="checkedRooms" @change="handleCheckChange">
          <el-checkbox v-for="item in checkList" :label="item" :key="item.meeting_id">{{item.meeting_name}}</el-checkbox>
          <!--          <el-checkbox v-for="item in checkList" :label="item.meeting_name" :key="item.meeting_id" :checked="item.flag" @change="handleCheckChange">{{item.meeting_name}}</el-checkbox>-->

        </el-checkbox-group>
      </div>
    </zl-confirm>

    <!-- 详情弹出框 -->
    <resource-detail ref="resourceDetail"></resource-detail>
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页

export default {
  components: {
    'resource-detail': resourceDetail
  },
  data() {
    return {
      confirmShow: false,
      checkedRooms: [],
      checkedRoomsList: '', // 选中的会议室
      checkList: [],
      customerId: '',
      search: {
        dept: '', // 单位名称
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],

      YPromptShow: false,
      message: '',
      isBol: false,
    }
  },
  activated() {
    this.getDataRequest();
  },
  computed: {
    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["CLIENT_MANAGE"];
    }
  },
  methods: {
    getDataRequest() {
      // let params = {
      //   max: this.pageSize,
      //   offset: (this.page - 1) * this.pageSize,
      // };
      let params = {
        pageSize: this.pageSize,
        pageStart: this.page,
        customerName: this.search.dept,
      };
      this.$axiosJsonPost(API.customer_customerRoomPageList, params).then(res => {
        if (res.status === 200) {
          this.list = res.data.list;
          this.total = res.data.total;
        }
      })
      // this.list = [{
      //   name:'创新院',
      //   meetRoom:'第一会议室 第二会议室 第三会议室 第四会议室 第五会议室 第六会议室 第七会议室 第八会议室 会议会室1 会议室2',
      // }]
    },
    // edit
    listItemEdit(id) {
      this.confirmShow = true;
      this.customerId = id;
      let params = {
        customerOrganId: id,
      };
      this.$axiosGet(API.customer_toUpdateCustomerRoom, params).then(res => {
        if (res.status === 200) {
          this.checkList = res.data
          let handleCheckedRoom = res.data.filter(item => {
            return item.flag === true;
          })
          this.checkedRooms = handleCheckedRoom
          // this.checkedRooms = handleCheckedRoom.map(item=>{
          //   return item.meeting_name;
          // }).join(',').split(',');
        }
      })
    },
    // 多选会议室
    handleCheckChange(val) {
      if (val) {
        let checkedList = val.map(item => {
          return item.meeting_id
        }).join(',');
        this.checkedRoomsList = checkedList;
      }
    },
    // edit conform
    confirmClick() {
      this.confirmShow = false;
      let params = {
        customerOrganId: this.customerId,
        meetingIds: this.checkedRoomsList,
      };
      this.$axiosJsonPost(API.customer_doUpdateCustomerRoom, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.YPromptShow = true;
        this.message = res.message;
      })
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.client-check-box {
  text-align: center;
  .el-checkbox-group {
    display: inline-block;
    text-align: left;
    width: 300px;
    .el-checkbox {
      margin-bottom: 15px;
    }
  }
}
</style>
