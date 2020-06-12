<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="结算统计" :item="['财务结算']"></zl-breadcrumb>
      </div>
      <!-- tab切换 -->
      <ul class="house-nav-tab">
        <li @click="getclick('makeBill')" :class="{'active':search.status=='makeBill'}">
          <a>制作结算单</a>
        </li>
        <li @click="getclick('billManage')" :class="{'active':search.status=='billManage'}">
          <a>结算单管理</a>
        </li>
      </ul>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item v-if="search.status == 'makeBill'" label="申请人">
            <el-input clearable v-model="search.applyName" placeholder="请输入申请人"></el-input>
          </el-form-item>
          <el-form-item v-if="search.status == 'makeBill'" label="申请单位">
            <el-input clearable v-model="search.dept" placeholder="请输入申请单位"></el-input>
          </el-form-item>
          <el-form-item v-if="search.status == 'makeBill'" label="订单号">
            <el-input clearable v-model="search.applyId" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item v-if="search.status == 'billManage'" label="付款单位">
            <el-input clearable v-model="search.paymentDept" placeholder="请输入付款单位"></el-input>
          </el-form-item>
          <el-form-item v-if="search.status == 'billManage'" label="结算单号">
            <el-input clearable v-model="search.settlementNo" placeholder="请输入结算单号"></el-input>
          </el-form-item>
          <el-form-item v-if="search.status == 'billManage'" label="结算状态">
            <el-select clearable filterable v-model="search.settleType" placeholder="请选择结算状态">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="(item,index) in dictSettlementStatusList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="search.status == 'makeBill'?'使用时间':'时间'">
            <el-date-picker v-model="search.startTime" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
            <span style="padding: 0 5px;color: #ccc">-</span>
            <el-date-picker v-model="search.endTime" type="datetime" placeholder="选择结束时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <!-- 制作结算单 -->
      <div class="h-table f-relative" v-if="search.status == 'makeBill'">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="FINANCE_STATISTIC">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChangeMake">
          <el-table-column type="selection" width="55" ></el-table-column>
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="订单号" v-if="listTableListBol[0].show" prop="applyNo"></el-table-column>
          <el-table-column label="会议名称" v-if="listTableListBol[1].show" prop="conferenceName"></el-table-column>
          <el-table-column label="申请人" v-if="listTableListBol[2].show" prop="applyRealName"></el-table-column>
          <el-table-column label="联系方式" v-if="listTableListBol[3].show" prop="applyUserPhone"></el-table-column>
          <el-table-column label="申请单位" v-if="listTableListBol[4].show" prop="organName"></el-table-column>
          <el-table-column label="会议室" v-if="listTableListBol[5].show" prop="meetingName"></el-table-column>
          <el-table-column label="会议室类型" v-if="listTableListBol[6].show" prop="roomType">
            <template slot-scope="scope">
              <label class="el-tag-item">{{$handleDictsStatus(dictMeetRoomLevelList,scope.row.roomType)}}</label>
<!--              <label class="el-tag-item" v-if="scope.row.roomType === 0" type="warning" size="medium" disable-transitions>超大型</label>-->
            </template>
          </el-table-column>
          <el-table-column label="使用时间" v-if="listTableListBol[7].show" prop="beginTime"></el-table-column>
          <el-table-column label="费用" v-if="listTableListBol[8].show" prop="cost"></el-table-column>
          <el-table-column label="单据状态" v-if="listTableListBol[9].show" prop="applyStatus">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" :type="handleReturnStatus(scope.row.applyStatus)" size="medium" disable-transitions>{{$handleDictsStatus(dictApplyStatusList,scope.row.applyStatus)}}</el-tag>
<!--              <el-tag class="el-tag-item" v-if="scope.row.applyStatus === 0" type="warning" size="medium" disable-transitions>新提交申请</el-tag>-->
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="settlementDetail(scope.row.id)">详情</el-button>
              <el-button type="text" size="small" @click="payConfirmClick">结算</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 结算单管理 -->
      <div class="h-table f-relative" v-if="search.status == 'billManage'">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="FINANCE_MANAGE">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>

        <el-table :data="manageList" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="selectAble"></el-table-column>
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="结算单号" prop="settlementNo" v-if="ManListTableListBol[0].show"></el-table-column>
          <el-table-column label="开户行" prop="bankName" v-if="ManListTableListBol[1].show"></el-table-column>
          <el-table-column label="账号" prop="bankNo" v-if="ManListTableListBol[2].show"></el-table-column>
          <el-table-column label="编制人" prop="writeuser" v-if="ManListTableListBol[3].show"></el-table-column>
          <el-table-column label="编制时间" prop="writeTime" v-if="ManListTableListBol[4].show"></el-table-column>
          <el-table-column label="付款单位" prop="toOrganName" v-if="ManListTableListBol[5].show"></el-table-column>
          <el-table-column label="总次数" prop="count" v-if="ManListTableListBol[6].show"></el-table-column>
          <el-table-column label="总费用" prop="allCost" v-if="ManListTableListBol[7].show"></el-table-column>
          <el-table-column label="状态" prop="status" v-if="ManListTableListBol[8].show">
            <template slot-scope="scope">
              <label class="el-tag-item">{{$handleDictsStatus(dictSettlementStatusList,scope.row.status)}}</label>
              <!--<el-tag class="el-tag-item" v-if="scope.row.status === 0" type="warning" size="medium" disable-transitions>待发送</el-tag>-->
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="settlementDetail(scope.row.id)">详情</el-button>
              <el-button type="text" size="small" @click="settlementSend(scope.row.status,scope.row.id)">发送</el-button>
              <el-button type="text" size="small" @click="settlementDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="f-pull-left">
          <el-button size="medium" v-if="search.status == 'makeBill'" @click="batchStatement" icon="el-icon-circle-check">批量生成结算单</el-button>
          <el-button size="medium" v-if="search.status == 'billManage'" @click="batchGenerateStatement" icon="el-icon-circle-check">批量发送结算单</el-button>
          <!--<el-button size="medium" v-if="search.status == 'billManage'"><i class="iconfont icon-daochu">导出</i></el-button>-->
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>

    <!-- 结算详情弹出框 -->
    <settlement-detail ref="settlementDetail"></settlement-detail>

    <!--结算/发送/批量发送/删除 提示框-->
    <zl-confirm v-model="YConfirmShow" :title="confirmTitle"  @click="YConfirmClick">
      <span class="f-message">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span class="f-message-text">{{confirmMessage}}</span>
      </span>
    </zl-confirm>

    <!-- 操作成功提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>

  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import settlementDetail from "@/components/resource-manage/resource-info/settlement-detail" // 结算详情信息页

export default {
  components: {
    // 'resource-detail': resourceDetail,
    'settlement-detail': settlementDetail,
  },
  data() {
    return {
      settlement: true, // 结算平台切换
      YPromptShow: false,
      isBol: false,
      YConfirmShow: false,
      confirmTitle: "",
      confirmMessage: "",
      search: {
        status: 'makeBill', // tab
        applyName: '', // 申请人姓名
        applyId: '', // 订单号
        orderNum: '', // 订单号
        dept: '', // 申请单位
        paymentDept: '', // 付款单位
        settlementNo: '', // 结算单号
        settleType: '', // 结算状态
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      selectStatus: 0, // 选中的状态
      selectId: 0, // 选中的id
      batchMakeSelectIds: [], // 批量结算单选中的ids
      batchSelectIds: [], // 批量发送选中的ids
      sendTipText: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [], // 制作结算单
      manageList: [], // 结算单 管理
      dictApplyStatusList: [], // 单据状态字典数据
      dictSettlementStatusList: [], // 结算状态字典数据
      dictMeetRoomLevelList: [], // 会议室状态字典数据
    }
  },
  activated() {
    this.getDataRequest();
    this.getDictApplyStatus();
    this.getSettlementStatus();
    this.getMeetingRoomType();
  },
  computed: {
    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["FINANCE_STATISTIC"];
    },
    ManListTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["FINANCE_MANAGE"];
    }
  },
  methods: {
    // 获取字典单据状态
    getDictApplyStatus(){
      let params = {};
      let code = 'applyStatusForManage';
      this.$axiosGet(API.dict_sysDictsByCode + '/' + code, params).then(res => {
        if (res.status === 200) {
          this.dictApplyStatusList = res.data;
        }
      })
    },
    // 获取字典结算状态
    getSettlementStatus(){
      let params = {};
      let code = 'settlementStatus';
      this.$axiosGet(API.dict_sysDictsByCode + '/' + code, params).then(res => {
        if (res.status === 200) {
          this.dictSettlementStatusList = res.data;
        }
      })
    },
    // 获取会议室状态
    getMeetingRoomType(){
      let params = {};
      let code = 'meetingRoomType';
      this.$axiosGet(API.dict_sysDictsByCode + '/' + code, params).then(res => {
        if (res.status === 200) {
          this.dictMeetRoomLevelList = res.data;
        }
      })
    },
    // tab切换
    getclick(type) {
      this.search.status = type;
      if(this.search.status === 'makeBill' ){
        this.getDataMakeRequest();
      }else{
        this.getDataSettleRequest();
      }
    },
    // 获取结算，发送单列表数据
    getDataRequest(){
      if(this.search.status === 'makeBill' ){
        this.getDataMakeRequest();
      }else{
        this.getDataSettleRequest();
      }
    },
    // 制作单
    getDataMakeRequest() {
      let params = {
        applyRealName: this.search.applyName, // 申请人姓名
        applyId: this.search.applyId, // 订单号
        status: 0, // 结算状态
        startBeginTime: this.search.startTime, // 开始时间
        sendBeforeTime: this.search.endTime, // 结束时间
        organName: this.search.dept,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      this.$axiosJsonPost(API.settlement_detail_list, params).then(res => {
        if (res.status === 200) {
          this.list = res.data.rows || [];
          this.total = res.data.total || 0;
        }
      })

    },
    // 结算单
    getDataSettleRequest() {
      let params = {
        status: this.search.settleType, // 结算状态
        startBeginTime: this.search.startTime, // 开始时间
        sendBeforeTime: this.search.endTime, // 结束时间
        organName: this.search.paymentDept,
        settlementNo: this.search.settlementNo,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      this.$axiosJsonPost(API.settlement_list, params).then(res => {
        if (res.status === 200) {
          this.manageList = res.data.rows || [];
          this.total = res.data.total || 0;
        }
      })

    },
    // 列表选中
    selectAble(row) {
      if(row.status === 0) {
        this.selectStatus = row.status
        return true
      } else {
        return false
      }
    },
    // 制作端表格变化
    handleSelectionChangeMake(val){
      let selectId = []
      if (val) {
        val.forEach(item => {
          selectId.push(item.id)
        })
        this.batchMakeSelectIds = selectId;
      }
    },
    // 结算单表格变化
    handleSelectionChange(val) {
      let selectId = []
      if (val) {
        val.forEach(item => {
          selectId.push(item.id)
        })
        this.batchSelectIds = selectId;
      }
    },
    // 结算详情
    settlementDetail(orderId) {
      this.$refs.settlementDetail.title = '结算单详情';
      this.$refs.settlementDetail.openModal(orderId);
    },
    // 发送
    settlementSend(status, id) {
      this.YConfirmShow = true;
      this.selectStatus = status;
      this.selectId = id;
      this.confirmTitle = '发送';
      this.confirmMessage = '确认发送结算单吗？';
    },
    // 发送/批量发送确认
    YSendClick() {
      let params,url;
      // let handleArr = params.push(this.selectId)
      if (this.batchSelectIds.length > 0) {
        params = this.batchSelectIds
        // console.log('批量参数',params)
        url = API.settlement_butchUpdateState + this.selectStatus;
        this.$axiosJsonPost(url, params).then(res => {
          if (res.status === 200) {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          this.YConfirmShow = false;
          this.YPromptShow = true;
        })
      }else{
        url = API.settlement_changeState + this.selectId +"/" + this.selectStatus;
        this.$axiosPut(url, params).then(res => {
          if (res.status === 200) {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          this.YConfirmShow = false;
          this.YPromptShow = true;
        })
      }

    },
    // 删除
    settlementDelete(id){
      this.selectId = id;
      this.YConfirmShow = true;
      this.confirmTitle = '删除';
      this.confirmMessage = '确认删除结算单吗？';
    },
    // 删除确认
    deleteConfirmSubmit(){
      let params = {
        id: this.selectId,
      }
      this.$axiosJsonPost(API.settlement_deleteSettlement, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.YConfirmShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    // 结算
    payConfirmClick() {
      this.YConfirmShow = true;
      this.confirmTitle = '结算';
      this.confirmMessage = '确认生成结算单吗？';
    },
    // 确认结算
    payConfirmSubmit() {
      let params = {}
      this.$axiosJsonPost(API.settlement_createBills, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.YConfirmShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    // 批量结算
    batchStatement() {
      if (this.batchMakeSelectIds.length > 0) {
        this.YConfirmShow = true;
        this.confirmTitle = '批量付款';
        this.confirmMessage = '确认批量付款吗？';
      } else {
        this.confirmTitle = '批量付款';
        this.confirmMessage = '至少选择一个结算单!';
        this.YConfirmShow = true;
      }
    },
    // 批量发送
    batchGenerateStatement() {
      if (this.batchSelectIds.length > 0) {
        this.confirmTitle = '批量发送';
        this.confirmMessage = '确认批量发送吗？';
        this.YConfirmShow = true;
      } else {
        this.confirmTitle = '批量发送';
        this.confirmMessage = '至少选择一个结算单!';
        this.YConfirmShow = true;
      }
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
    },
    // confirm确认统计处理
    YConfirmClick(){
      if (this.confirmTitle === '结算' || this.confirmTitle === '批量结算'){
        this.payConfirmSubmit();
      }else if(this.confirmTitle === '发送' || this.confirmTitle === '批量发送'){
        this.YSendClick()
      }else if(this.confirmTitle === '删除'){
        this.deleteConfirmSubmit()
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

  }
}
</script>

<style lang="scss" scoped>
.el-tag-item {
  display: inline-block;
  width: 80px;
  text-align: center;
  border-radius: 12px;
}
</style>