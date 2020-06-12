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
        <!-- <p class="u-detail-p">申请单号{{applydetailList.orderNo}}</p>
        <p class="u-detail-p">申请提交时间{{dateCreated}}</p> -->
        <!-- <div class="el-steps-item">
          <el-steps :active="checkHightlight(orderStatus,disposalOfPerform)" align-center>
            <el-step title="提交申请" description=""></el-step>
            <el-step title="审批" description=""></el-step>
            <el-step title="处置执行" description=""></el-step>
          </el-steps>
        </div> -->
        <!--  tab切换 -->

        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>出租申请单</a>
          </li>
          <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
            <a>审批流程</a>
          </li>
          <li @click="pageSelect = 'recording'" v-show="recording === 'YES'" :class="{'active':pageSelect=='recording'}">
            <a>财政审批意见</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info" style="padding: 0">
            <tr>
              <th class="f-text-right">申请单位</th>
              <td colspan="1">{{rentalDetailList.applyOrganName}}</td>
              <th class="f-text-right">申请单位责任人</th>
              <td colspan="1">{{rentalDetailList.applyResponsible}}</td>
            </tr>
            <tr>
              <th class="f-text-right">经办人</th>
              <td>{{rentalDetailList.agentName}}</td>
              <th class="f-text-right">经办人电话</th>
              <td colspan="3">{{rentalDetailList.agentPhone}}</td>
            </tr>
            <tr>
              <th class="f-text-right">拟出租开始日期</th>
              <td>{{proposedRentStartDate}}</td>
              <th class="f-text-right">乙方支付租金方式</th>
              <td colspan="3">{{rentalDetailList.rentPayWayName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">招租形式</th>
              <td>{{rentalDetailList.rentWayName}}</td>
              <th class="f-text-right">拟出租用途</th>
              <td colspan="3">{{rentalDetailList.proposedRentPurpose}}</td>
            </tr>

            <tr>
              <th class="f-text-right">拟出租年限</th>
              <td>
                <span>{{rentalDetailList.proposedRentYear?rentalDetailList.proposedRentYear+'年':''}}</span>
              </td>
              <th class="f-text-right">备注</th>
              <td>{{rentalDetailList.remark}}</td>
            </tr>
          </table>
          <table class="h-table-info" style="margin: 0">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left">
                <h2 class="h-table-subtitle">
                  <span></span>拟出租经营性房产明细</h2>
              </td>
            </tr>
          </table>
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="date" fixed="left" type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column label="街道" prop="street">
            </el-table-column>
            <el-table-column label="门牌号" prop="houseNo" width="70">
            </el-table-column>
            <el-table-column label="坐落位置" prop="houseAddress">
            </el-table-column>
            <el-table-column label="经营面积（㎡）" prop="dealArea" width='120'>
            </el-table-column>
            <el-table-column label="房屋状态" prop="houseStatusName" width="80">
            </el-table-column>
            <el-table-column label="合同结束日期" prop="contractEndDate" :formatter="dateFormat" width='120'>
            </el-table-column>
            <el-table-column label="评估租金（元/月/平方米）" prop="estimateRentPrice" width="190">
            </el-table-column>
            <el-table-column label="租赁保证金" prop="rentDeposit">
            </el-table-column>
          </el-table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='houseinfo'">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in personList" :key="index" :timestamp="item.createTime" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state" :class="checkStatus(item.flowLabel)">{{checkName(item.flowLabel)}}</span>
                </div>
                <h4>{{item.userName}}</h4>
                <p v-show='item.flowLabel ==="已通过" || item.flowLabel ==="已驳回" || item.flowLabel ==="退回"'>备注{{item.comment || '待审批'}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

        <div class="h-tab-content" v-if=" recording === 'YES'" v-show="pageSelect=='recording'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">审批时间</th>
              <td>{{time}}</td>
            </tr>
            <tr>
              <th class="f-text-right">审批人</th>
              <td>{{recordingList.applyRealName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">审批意见</th>
              <td>{{recordingList.result}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td>{{recordingList.remark || ''}}</td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect == 'file'">
          <el-table :data="fileList" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_block">预览</a>
                <!-- <a :href="scope.row.url" target="_block" download>下载</a> -->
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      carDetailShow: false, // 弹出框开关
      dealRentApplyId: '', //出租申请id
      remark: '', // 备注
      taskId: '', //任务id
      taskName: '', //任务名称
      formKey: '', //流程
      name: '', // 文件名
      url: '', //文件路径
      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      listfile: [], //数据集合
      recordingList: [], //财政补录意见
      time: '', //补录日期
      recording: '', //是否补录
      list: [], // table2列表数据集合
      pageSelect: "",
      imgUrl: [], // 院落数据图片
      rentalDetailList: {}, //详情集合
      houseDetailList: [], //房间明细
      fileList: [], //文件附件
      personList: [], //人员信息
      orderStatus: '', //订单状态
      proposedRentStartDate: '', // 拟出租日期

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, record) {
      this.dealRentApplyId = id;
      this.recording = record;
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.getDataRequest()
    },

    checkHightlight(value, status) {
      if ((value == '0' || value == '-1') && status == 'NO') {
        return 1
      } else if ((value == '1' || value == '-2') && status == 'NO') {
        return 2
      } else if (value == '2' && status == 'YES') {
        return 3
      }
    },

    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    // 审批流程节点状态
    checkStatus(value) {
      if (value) {
        return 's-state-apply'
      } else if (value == null || value == '') {
        return 's-state-fail'
      }
    },
    checkName(value) {
      if (value) {
        return value
      } else if (value == null || value == '') {
        return '待审批'
      }
    },
    getDataRequest(id) {
      let params = {
        rentApplyId: this.dealRentApplyId
      };
      this.$axiosGet(API.userplathouserent_detail, params).then(res => {
        if (res.data) {
          this.rentalDetailList = res.data.rentApplyResponse;
          this.houseDetailList = res.data.rentApplyResponse.rentHouseDetailResponse;
          if (this.recording === 'YES') {
            this.recordingList = res.data.additionalRecording;
            if (res.data.additionalRecording.applyTime) {
              this.time = res.data.additionalRecording.applyTime.substr(0, 10);
            } else {
              this.time = '';
            };
          }
          if (res.data.commentBOList) {
            this.personList = res.data.commentBOList;
          }
          if (res.data.rentApplyResponse.proposedRentStartDate) {
            this.proposedRentStartDate = res.data.rentApplyResponse.proposedRentStartDate.substr(0, 10);
          } else {
            this.proposedRentStartDate = '';
          };
          this.fileList = res.data.fileResponseAdapterList;
          // this.orderStatus = res.data.handleApplyResponseDetail.orderStatus;
          // this.disposalOfPerform = res.data.handleApplyResponseDetail.disposalOfPerform
        } else {
          this.recordingList = []
        }
        if (this.houseDetailList) {
          this.houseDetailList.forEach((item, index) => {
            this.houseDetailList[index].num = index + 1;
          });
        }
        this.list = this.houseDetailList
      });
    },
  }
};
</script>

<style lang="scss">
.h-tab-content .h-table-info tr th {
  width: 147px;
}
</style>

