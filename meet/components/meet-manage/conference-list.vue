<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会务安排" :item="['会务安排']"></zl-breadcrumb>
      </div>

      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="申请人">
            <el-input clearable v-model="search.applyName" placeholder="请输入名称申请人"></el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input clearable v-model="search.order" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="分配状态">
            <el-select clearable filterable v-model="search.distribution" placeholder="请选择">
              <el-option :value="0" label="未分配"></el-option>
              <el-option :value="1" label="已分配"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker v-model="search.startTime" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
            <span style="padding: 0 5px;color: #D0D2D9">-</span>
            <el-date-picker v-model="search.endTime" type="datetime" placeholder="选择结束时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>

      <div class="h-table">
        <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" :selectable="selectAble"></el-table-column>
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="订单号" prop="applyNo"></el-table-column>
          <el-table-column label="客户单位" prop="organName"></el-table-column>
          <el-table-column label="会议室" prop="roomName"></el-table-column>
          <el-table-column label="申请人" prop="applyRealName"></el-table-column>
          <el-table-column label="使用时间" prop="beginTime"></el-table-column>
          <el-table-column label="状态" prop="hasArrange">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" v-if="scope.row.hasArrange === 0" type="warning" size="medium" disable-transitions>未分配</el-tag>
              <el-tag class="el-tag-item" v-if="scope.row.hasArrange === 1" type="success" size="medium" disable-transitions>已分配</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="applyFormDetail(scope.row.id)">详情</el-button>
              <el-button type="text" v-if="scope.row.hasArrange != 1" size="small" @click="distributionClick(scope.row.id)">分配</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="h-table-bottom f-clearfix">
        <div class="f-pull-left">
          <!--<el-button size="medium"><i class="iconfont icon-daochu"></i>导出</el-button>-->
          <el-button size="medium" @click="batchGenerateStatement" icon="el-icon-circle-check">批量分配</el-button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 详情弹出框 -->
    <!--<resource-detail ref="resourceDetail"></resource-detail>-->
    <apply-detail ref="appDetail"></apply-detail>
    <!--会议人员选择-->
    <zl-confirm v-model="waiterShow" title="会务人员选择" @click="YCheckClick">
      <el-radio-group v-model="serverUserId" @change="onRadioChange">
        <el-radio v-for="item in meetPersonList" :label="item.staffId" :key="item.staffId">{{item.realName}}</el-radio>
      </el-radio-group>
    </zl-confirm>
    <!--批量分配提示框-->
    <zl-confirm v-model="YBatchSendShow" title="提示">
      <span class="f-message">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span class="f-message-text">至少选择一个订单进行分配!</span>
      </span>
    </zl-confirm>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import applyDetail from "@/components/resource-manage/resource-info/apply-detail" // 申请详情信息页
import { mapState } from 'vuex'
export default {
  components: {
    'resource-detail': resourceDetail,
    'apply-detail': applyDetail,
  },
  data() {
    return {
      search: {
        applyName: null, // 申请人姓名
        order: null, // 订单号
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        distribution: '' // 分配状态
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      meetPersonList: [], // 会务人员安排
      applyIds: [],
      YBatchSendShow: false,
      isBatch: false,
      serverUserId: null,
      waiterShow: false,
      YPromptShow: false,
      isBol: false,
    }
  },
  activated() {
    this.getDataRequest();
    this.getMeetDataRequest();
  },
  deactivated() {
    this.search = {
      applyName: null, // 申请人姓名
      order: null, // 订单号
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      distribution: '' // 分配状态
    }
  },
  methods: {
    // 详情
    applyFormDetail(orderId) {
      this.$refs.appDetail.applyDetailShow = true;
      this.$refs.appDetail.title = '订单详情';
      this.$refs.appDetail.getDataRequest(orderId);
    },
    // 分页数据
    getDataRequest() {
      let params = {
        applyRealName: this.search.applyName, // 申请人姓名
        applyNo: this.search.order, // 订单号
        arrangeStatus: this.search.distribution, // 分配状态
        beginTime: this.search.startTime, // 开始时间
        endTime: this.search.endTime, // 结束时间
        pageSize: this.pageSize,
        pageStart: this.page - 1
      }
      this.$axiosJsonPost(API.meetArrange_findApplyVerifyListWithPage, params).then(res => {
        if (res.status === 200) {
          this.list = res.data.list || [];
          this.total = res.data.total || 0;
        }
      })

      // this.list = [{
      //   orderName:'367939200325161150005',
      //   meetName:'测试会议',
      //   applyCompany:'安徽省教育厅',
      //   meetRoom:'1号会议室',
      //   applyName:'吴桐',
      //   userTime:'2020-03-27',
      //   status:'未分配',
      // },{
      //   orderName:'367939200325161150005',
      //   meetName:'测试会议',
      //   applyCompany:'安徽省教育厅',
      //   meetRoom:'1号会议室',
      //   applyName:'吴桐',
      //   userTime:'2020-03-27',
      //   status:'已分配',
      // }]
    },
    // 回显本单位会务配置情况
    getMeetDataRequest() {
      let params = {}
      this.$axiosGet(API.meetArrange_toMeetArrange, params).then(res => {
        if (res.status === 200) {
          this.meetPersonList = res.data;
        }
      })
    },
    // 会议人员切换
    onRadioChange(value) {
      this.serverUserId = value
    },
    // 分配
    distributionClick(value) {
      this.waiterShow = true
      this.applyIds = value.split(',')
    },
    YCheckClick() {
      let params = {
        serverUserId: this.serverUserId, // 客服经理用户id
        applyIds: this.applyIds, // 申请单ids
      }
      this.$axiosJsonPost(API.meetArrange_doMeetArrange, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.waiterShow = false;
        this.YPromptShow = true;
      })
    },
    // 列表选中
    selectAble(row) {
      if (row.hasArrange === 0) {
        return true
      } else {
        return false
      }
    },
    // 表格变化
    handleSelectionChange(value) {
      if (!value) { return }
      let selectApplyIds = value.map(item => {
        return item.id
      })
      this.applyIds = selectApplyIds
    },
    // 批量生成结算单
    batchGenerateStatement() {
      if (this.applyIds.length > 0) {
        this.waiterShow = true;
      } else {
        this.YBatchSendShow = true
      }
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                