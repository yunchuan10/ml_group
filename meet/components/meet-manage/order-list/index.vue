<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单信息" :item="['订单信息']"></zl-breadcrumb>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="searchClick">
          <el-form-item label="申请人">
            <el-input clearable v-model="search.applyName" placeholder="请输入名称申请人"></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input clearable v-model="search.order" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select clearable filterable v-model="search.applyStatus" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="(item,index) in dictApplyStatusList" :key="index" :value="item.value" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户单位">
            <el-select clearable filterable v-model="search.organ" placeholder="请选择客户单位">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="(item,index) in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="search.startTime" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
            <span style="padding: 0 5px;color: #ccc">-</span>
            <el-date-picker v-model="search.endTime" type="datetime" placeholder="选择结束时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <div class="h-table f-relative">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="MEET_MANAGE">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column fixed="left" label="序号" width="50px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>
          <el-table-column label="订单号" v-if="listTableListBol[0].show" prop="applyNo"></el-table-column>
          <el-table-column label="会议名称" v-if="listTableListBol[1].show" prop="conferenceName"></el-table-column>
          <el-table-column label="申请人" v-if="listTableListBol[2].show" prop="applyRealName"></el-table-column>
          <el-table-column label="联系方式" v-if="listTableListBol[3].show" prop="applyRealPhone"></el-table-column>
          <el-table-column label="客户单位" v-if="listTableListBol[4].show" prop="organName"></el-table-column>
          <el-table-column label="会议室" v-if="listTableListBol[5].show" prop="roomName"></el-table-column>
          <el-table-column label="会议室类型" v-if="listTableListBol[6].show" prop="meetingRoomType">
            <template slot-scope="scope">
              <label class="el-tag-item">{{$handleDictsStatus(dictMeetRoomLevelList,scope.row.meetingRoomType)}}</label>
            </template>
          </el-table-column>
          <el-table-column label="使用时间" v-if="listTableListBol[7].show" prop="beginTime"></el-table-column>
          <el-table-column label="费用" v-if="listTableListBol[8].show" prop="meetingCost"></el-table-column>
          <el-table-column label="单据状态" v-if="listTableListBol[9].show" prop="orderStatus">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" v-if="$handleDictsStatus(dictApplyStatusList,scope.row.status)" :type="handleReturnStatus(scope.row.status)" size="medium" disable-transitions>{{$handleDictsStatus(dictApplyStatusList,scope.row.status)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="客服经理" v-if="listTableListBol[10].show" prop="serverUserName"></el-table-column>

          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="applyFormDetail(scope.row.id)">详情</el-button>
              <el-button type="text" size="small" @click="returnBack(scope.row.id)">退回</el-button>
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

    <!-- 详情弹出框 -->
    <apply-detail ref="appDetail"></apply-detail>

    <!--退回提示框-->
    <zl-confirm v-model="YConfirmShow" title="退回" @click="YReturnClick">
      <span class="f-message">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span class="f-message-text">确认退回吗？</span>
      </span>
    </zl-confirm>
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
import applyDetail from "@/components/resource-manage/resource-info/apply-detail" // 申请详情信息页
import { mapState } from 'vuex'

export default {
  components: {
    'apply-detail': applyDetail,
  },
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      confirmTitle: "",
      confirmMessage: "",
      isBol: false,
      search: {
        applyName: '', // 申请人姓名
        order: '', // 订单号
        applyStatus: null, // 状态
        organ: '', // 客户单位
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      departmentList: [], // 部门
      orderId: "",  // 订单id
      dictApplyStatusList: [], // 单据状态字典数据
      dictMeetRoomLevelList: [], // 会议室类型字典数据
    }
  },
  computed: {
    ...mapState('searchTableListBol', [
      'tableListBol',
    ]),
    ...mapState('testData', [
      'orderList',
    ]),

    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["MEET_MANAGE"];
      // return this.searchTableListBol.tableListBol["MEET_MANAGE"];
    }
  },
  activated() {
    this.getDictApplyStatus();
    this.getMeetRoomLevel();

  },
  methods: {
    // 获取字典单据状态
    getDictApplyStatus(){
      let params = {};
      let code = 'applyStatusForManage';
      this.$axiosGet(API.dict_sysDictsByCode + '/' + code, params).then(res => {
        if (res.status === 200) {
          this.dictApplyStatusList = res.data;
          this.getDataRequest();
        }
      })
    },
    // 获取会议室类型
    getMeetRoomLevel(){
      let params = {};
      let code = 'meetingRoomType';
      this.$axiosGet(API.dict_sysDictsByCode + '/' + code, params).then(res => {
        if (res.status === 200) {
          this.dictMeetRoomLevelList = res.data;
        }
      })
    },
    getDataRequest() {
      let params = {
        applyType: 0,
        applyRealName: this.search.applyName, // 申请人姓名
        applyNo: this.search.order, // 订单号
        applyStatus: this.search.applyStatus, // 订单状态
        arrangeStatus: 0, // 分配状态
        deptId: null, // 申请人部门id
        organId: this.search.organ, // 申请单位id
        beginTime: this.search.startTime, // 开始时间
        endTime: this.search.endTime, // 结束时间
        pageSize: this.pageSize,
        pageStart: this.page - 1
      }
      this.$axiosJsonPost(API.roomApply_applyPageForManage, params).then(res => {
        if (res.status === 200) {
          this.departmentList = res.data.deptList || [];
          this.list = res.data.applyResponsePage.list || [];
          this.total = res.data.applyResponsePage.total || 0;
        }
      })
    },
    // 查询
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    // 申请单详情
    applyFormDetail(orderId) {
      this.$refs.appDetail.applyDetailShow = true;
      this.$refs.appDetail.title = '订单详情';
      this.$refs.appDetail.getDataRequest(orderId);
    },
    // 退回
    returnBack(id) {
      // console.log(id, 11111111);
      this.YConfirmShow = true;
      this.orderId = id;
    },
    YReturnClick() {
      // console.log(this.orderId, 222222222);
      let params = {
        applyId: this.orderId
      }
      this.$axiosPost(API.roomApply_cancelApply, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        // 判断删除的数据是不是当前页最后一条
        let totalNo = ((this.total - 1) / this.pageSize).toString().indexOf('.');
        if (totalNo === -1) {
          this.page = this.page - 1;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
    },
    // 处理状态返回值
    handleReturnStatus(status){
      let type = '';
      switch (status) {
        case 0:
          type = 'warning';
          break;
        case 1:
        case 2:
        case 3:
          type = 'success';
          break;
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
          type = 'info';
          break;
        case 9:
        case 10:
          type = 'danger';
          break;
        default:
          type = '';
      }
      return type;
    },

  },
}
</script>

<style lang="scss" scoped>
.el-tag-item {
  display: inline-block;
  width: 90px;
  text-align: center;
  border-radius: 12px;
}
</style>
