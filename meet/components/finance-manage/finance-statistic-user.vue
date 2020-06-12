<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="结算统计" :item="['财务结算']"></zl-breadcrumb>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="收款单位">
            <el-input clearable v-model="search.paymentDept" placeholder="请输入收款单位"></el-input>
          </el-form-item>
          <el-form-item label="结算单号">
            <el-input clearable v-model="search.settlementNo" placeholder="请输入结算单号"></el-input>
          </el-form-item>
          <el-form-item label="结算状态">
            <el-select clearable filterable v-model="search.settleType" placeholder="请选择结算状态">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="(item,index) in dictSettlementStatusList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送时间">
            <el-date-picker v-model="search.startTime" type="date" placeholder="选择开始时间"></el-date-picker>
            <span style="padding: 0 5px;color: #ddd">-</span>
            <el-date-picker v-model="search.endTime" type="date" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>

      <div class="h-table f-relative">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="SETTLEMENT_STATISTICAL">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="selectAble">
          </el-table-column>
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="结算单号" prop="settlementNo" v-if="listTableListBol[0].show"></el-table-column>
          <el-table-column label="开户行" prop="bankName" v-if="listTableListBol[1].show"></el-table-column>
          <el-table-column label="账号" prop="bankNo" v-if="listTableListBol[2].show"></el-table-column>
          <el-table-column label="编制人" prop="writeuser" v-if="listTableListBol[3].show"></el-table-column>
          <el-table-column label="发送时间" prop="writeTime" v-if="listTableListBol[4].show"></el-table-column>
          <el-table-column label="收款单位" prop="organName" v-if="listTableListBol[5].show"></el-table-column>
          <el-table-column label="状态" v-if="listTableListBol[6].show" prop="status">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" v-if="scope.row.status" :type="handleReturnStatus(scope.row.status)" size="medium" disable-transitions>{{$handleDictsStatus(dictSettlementStatusList,scope.row.status)}}</el-tag>
<!--              <el-tag class="el-tag-item" v-if="scope.row.status === 0" type="warning" size="medium" disable-transitions>待发送</el-tag>-->
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="settlementDetail(scope.row.id)">详情</el-button>
              <el-button type="text" size="small" @click="settlementSend(scope.row.settleType,scope.row.id)">确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="f-pull-left">
          <el-button size="medium" type="primary" @click="batchGenerateStatement">批量确认</el-button>
          <!--          <el-button size="medium"><i class="iconfont icon-daochu">导出</i></el-button>-->
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

    <!--确认提示框-->
    <zl-confirm v-model="YConfirmShow" :title="confirmTitle"  @click="YSendClick">
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
    'resource-detail': resourceDetail,
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
        applyName: '', // 申请人姓名
        orderNum: '', // 订单号
        dept: '', // 申请单位
        paymentDept: '', // 付款单位
        settlementNo: '', // 结算单号
        settleType: null, // 结算状态
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      selectStatus: 0, // 选中的状态
      selectId: 0, // 选中的id
      batchSelectIds: [], // 批量选中的ids
      sendTipText: '',

      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [], // 制作结算单
      manageList: [], // 结算单 管理
      dictSettlementStatusList: [], // 结算状态字典数据
    }
  },
  activated() {
    this.getDataRequest();
    this.getSettlementStatus();
  },
  computed: {
    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["SETTLEMENT_STATISTICAL"];
    },
  },
  methods: {
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
    getDataRequest() {
      let params = {
        status: this.search.settleType, // 订单状态
        startBeginTime: DATE.dateReturnYMD(this.search.startTime), // 开始时间
        sendBeforeTime: DATE.dateReturnYMD(this.search.endTime), // 结束时间
        organName: this.search.paymentDept,
        settlementNo: this.search.settlementNo,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      this.$axiosJsonPost(API.settlement_list, params).then(res => {
        if (res.status === 200) {
          this.list = res.data.rows || [];
          this.total = res.data.total || 0;
        }
      })

      // this.list = [{
      //   id: '1c953dc6-7548-4da7-',
      //   staNo: '257588200324172913001',
      //   bankName: '广大银行',
      //   bankNo: '6214232568687889520',
      //   prepare: '周国九',
      //   prepareTime: '2020-03-24 17:29:13',
      //   toOrganName: '广西柳城测试单位',
      //   settleType: 1,
      // }, {
      //   id: '1c953dc6-7548-4da7-8bc2-209df0cabfc5',
      //   staNo: '257588200324172913001',
      //   bankName: '广大银行',
      //   bankNo: '6214232568687889520',
      //   prepare: '周国九',
      //   prepareTime: '2020-03-24 17:29:13',
      //   toOrganName: '广西柳城测试单位',
      //   settleType: 2,
      // }]

    },
    // 列表选中
    selectAble(row) {
      if (row.status === 1) {
        return true
      } else {
        return false
      }
    },
    // 表格变化
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
    // 确认
    settlementSend(status, id) {
      this.YConfirmShow = true;
      this.selectStatus = status;
      this.selectId = id;
      this.confirmTitle = '确认';
      this.confirmMessage = '确认付款吗？';
    },
    // 确认/批量确认
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

    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
    },
    // 批量生成结算单
    batchGenerateStatement() {
      if (this.batchSelectIds.length > 0) {
        this.confirmTitle = '批量确认';
        this.confirmMessage = '确认批量付款吗？';
        this.YConfirmShow = true;
      } else {
        this.confirmTitle = '批量确认';
        this.confirmMessage = '至少选择一个结算单!';
        this.YConfirmShow = true;
      }
    },
    // 处理状态返回值
    handleReturnStatus(status){
      let type = '';
      switch (status) {
        case 0:
        case 1:
          type = 'warning';
          break;
        case 2:
          type = 'success';
          break;
        case 3:
          type = 'info';
          break;
        case 4:
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
</style>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                