<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单审核" :item="['订单审核']"></zl-breadcrumb>
      </div>
      <!-- tab切换 -->
      <ul class="house-nav-tab">
        <li @click="getclick(0)" :class="{'active':search.status===0}">
          <a>待审核</a>
        </li>
        <li @click="getclick(1)" :class="{'active':search.status===1}">
          <a>审核通过</a>
        </li>
        <li @click="getclick(2)" :class="{'active':search.status===2}">
          <a>审核不通过</a>
        </li>
      </ul>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="申请人">
            <el-input clearable v-model="search.applyName" placeholder="请输入名称申请人"></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input clearable v-model="search.applyNum" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="search.startTime" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
            <span style="padding: 0 5px;color: #ddd">-</span>
            <el-date-picker v-model="search.endTime" type="datetime" placeholder="选择结束时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>

      <div class="h-table">
        <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column v-if="search.status===0" type="selection" width="55"></el-table-column>
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="订单号" prop="applyNo"></el-table-column>
          <el-table-column label="会议名称" prop="conferenceName"></el-table-column>
          <el-table-column label="申请单位" prop="organName"></el-table-column>
          <el-table-column label="申请人" prop="applyRealName"></el-table-column>
          <el-table-column label="使用时间" prop="beginTime"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-show="search.status===0" type="text" size="small" @click="orderReview(scope.row.id)">审核</el-button>
              <el-button  type="text" size="small" @click="applyFormDetail(scope.row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="f-pull-left" v-if="search.status===0">
          <el-button size="medium" @click="batchGenerateStatement" icon="el-icon-circle-check">批量审核</el-button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>

    <!-- 审核弹出框 -->
    <!--<resource-detail ref="resourceDetail"></resource-detail>-->
    <resource-review ref="resourceReview" :resourceSuc="resourceSuc"></resource-review>
    <apply-detail ref="appDetail"></apply-detail>
    <!--批量审核提示框-->
    <zl-confirm v-model="YBatchSendShow" title="提示">
      <span class="f-message">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span class="f-message-text">请选择要审核的订单!</span>
      </span>
    </zl-confirm>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>

  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import resourceReview from "@/components/resource-manage/resource-info/resource-review" // 订单审核弹窗
import applyDetail from "@/components/resource-manage/resource-info/apply-detail" // 申请详情信息页

export default {
  components: {
    'resource-detail': resourceDetail,
    'resource-review': resourceReview,
    'apply-detail': applyDetail,
  },
  data() {
    return {
      search: {
        status: 0, // 订单状态
        applyName: null, // 申请人姓名
        applyNum: null, // 订单号
        dept: null, // 单位名称
        startTime: null, // 开始时间
        endTime: null, // 结束时间
      },
      tabSel: '', // tab切换
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      departmentList: [],
      YBatchSendShow: false,
      applyIds: [],

      YPromptShow: false,
      isBol: false,

    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {

    resourceSuc(){
      this.getDataRequest();
    },
    getclick(type) {
      this.page = 1;
      this.list = [];
      this.total = 0;
      this.search.status = type;
      this.getDataRequest();
    },
    getDataRequest() {
      let params = {
        verifyStatus:this.search.status,
        applyRealName: this.search.applyName, // 申请人姓名
        applyNo: this.search.applyNum, // 订单号
        deptId: this.search.dept ? this.search.dept : null, // 部门
        beginTime: this.search.startTime, // 开始时间
        endTime: this.search.endTime, // 结束时间
        pageSize: this.pageSize,
        pageStart: this.page - 1
      }
      // console.log('订单审核 params',params)
      this.$axiosJsonPost(API.applyVerify_verifyPageForManage, params).then(res => {
        // console.log('申请单审核',res)
        if(res.status === 200){
          this.departmentList = res.data.deptList || [];
          this.list = res.data.applyResponsePage.list || [];
          this.total = res.data.applyResponsePage.total || 0;
        }
      })

      // this.list = [{
      //   id:"11111",
      //   applyNo:'367939200325161150005',
      //   conferenceName:'测试会议',
      //   organName:'开发部',
      //   applyRealName:'吴桐',
      //   beginTime:'2020-03-25 ',
      // },{
      //   id:"222222",
      //   applyNo:'367939200325161150005',
      //   conferenceName:'测试会议',
      //   organName:'开发部',
      //   applyRealName:'吴桐',
      //   beginTime:'2020-03-25 ',
      // }]

    },
    // tab点击
    tabSelect(type) {
      this.tabSel = type;
    },

    // 审核
    orderReview(orderId){
      // console.log('review',orderId)
      this.$refs.resourceReview.title = '申请单详情';
      this.$refs.resourceReview.openModal(orderId);
    },
    // 详情
    applyFormDetail(orderId){
      // console.log('申请单管理详情 orderId',orderId)
      this.$refs.appDetail.applyDetailShow = true;
      this.$refs.appDetail.title = '申请单详情';
      this.$refs.appDetail.getDataRequest(orderId);
    },
    // 表格变化
    handleSelectionChange(value){
      if(!value) {return}
      let selectApplyIds = value.map(item => {
        return item.id
      })
      // console.log('selectApplyIds',selectApplyIds)
      this.applyIds = selectApplyIds
      // console.log('this.applyIds',this.applyIds)
    },

    //批量审核
    orderReviewBatch(ids) {
      let params = {
        applyIdList : ids,
      };
      this.$axiosJsonPost(API.applyVerify_batchVerifyByManage, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    // 批量审核
    batchGenerateStatement(){
      if(this.applyIds.length > 0 ){
        // console.log('批量审核',this.applyIds)
        this.orderReviewBatch(this.applyIds)
      }else{
        this.YBatchSendShow = true
      }
    },

    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
        this.YPromptShow = false;
      }
    },

  }
}
</script>

<style></style>


