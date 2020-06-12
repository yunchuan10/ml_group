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
        <div class="h-tab-content">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">合同编号</th>
              <td style="width: 292px">
                <a @click="disposalDetailInfoClick(dealRentDetail.contractId)">{{dealRentDetail.contractNo}}</a>
              </td>
              <th class="f-text-right">合同开始日期</th>
              <td>{{contractStartDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同结束日期</th>
              <td>{{contractEndDate}}</td>
              <th class="f-text-right">出租方</th>
              <td>{{dealRentDetail.organName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">承租人</th>
              <td>{{dealRentDetail.lesseeName}}</td>
              <th class="f-text-right">合同租金</th>
              <td>{{dealRentDetail.contractRental}}元/年</td>
            </tr>
            <tr>
              <th class="f-text-right">租金起止日期</th>
              <td>{{startDate}}—{{endDate}}</td>
              <th class="f-text-right">应交租金</th>
              <td>{{dealRentDetail.money}}元</td>
            </tr>
            <tr>
              <th class="f-text-right">缴纳时长</th>
              <td>{{dealRentDetail.duration}}</td>
              <th class="f-text-right" v-if="dealRentDetail.information !=='YES'">状态</th>
              <td v-if="dealRentDetail.information !=='YES'">
                <span class="z-state" :class="checkStatus(dealRentDetail.informationName)">{{dealRentDetail.informationName}}</span>
              </td>
              <th class="f-text-right" v-if="dealRentDetail.information ==='YES'">状态</th>
              <td v-if="dealRentDetail.information ==='YES'">
                <span class="z-state" :class="checkStatus(dealRentDetail.informationName)">{{dealRentDetail.informationName}}</span>
              </td>
            </tr>
            <tr v-if="dealRentDetail.information !=='YES'">
              <th class="f-text-right">租金到期提醒</th>
              <td colspan="3">{{dealRentDetail.rentStatusName == '即将到期' ? dealRentDetail.remainingDays ? '剩余：'+dealRentDetail.remainingDays+'天' : '' : dealRentDetail.remainingDays ? '逾期：'+dealRentDetail.remainingDays+'天' : '' }}</td>
            </tr>
            <tr v-if="dealRentDetail.information ==='YES'">
              <th class="f-text-right">交租日期</th>
              <td>{{checkTime(dealRentDetail.payDate) || ''}}</td>
              <th class="f-text-right">开票单位</th>
              <td>{{dealRentDetail.issuingOrganName || ''}}</td>
            </tr>

            <!-- <tr v-if="dealRentDetail.information ==='YES'">
              <th class="f-text-right">入账时间</th>
              <td>{{rentPayDate|| ''}}</td>
            </tr>-->
            <!-- <tr v-if="dealRentDetail.information ==='NO'">
              <th class="f-text-right">未入账原因</th>
              <td>{{dealRentDetail.overdueNote || ''}} </td>
            </tr> -->
          </table>

        </div>

      </div>
    </el-dialog>
    <disposal-detail ref="disposalDetail"></disposal-detail>

  </div>
</template>

<script>
import disposalDetail from '@/components/operate/contract-manage/contract-detail'; // 详情弹出框

export default {
  components: {
    'disposal-detail': disposalDetail,
    // 'approval-info': approvalInfo,
  },
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      dealId: '',
      contractStartDate: '', //合同开始日期
      contractEndDate: '', //合同结束日期
      startDate: '', //租金开始日期
      endDate: '', //租金结束日期
      rentPayDate: '', //入账时间
      dealRentDetail: {}, //详情集合
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.dealId = id;
      this.getDataRequest()
    },
    checkTime(value) {
      if (value) {
        return value.substr(0, 10);
      }
    },
    getDataRequest() {
      let params = {
        rentalInformationId: this.dealId
      };
      this.$axiosGet(API.rent_getDetail, params).then(res => {
        this.dealRentDetail = res.data;
        if (res.data.contractStartDate) {
          this.contractStartDate = res.data.contractStartDate.substr(0, 10);
        } else {
          this.contractStartDate = '';
        }
        if (res.data.contractEndDate) {
          this.contractEndDate = res.data.contractEndDate.substr(0, 10);
        } else {
          this.contractEndDate = '';
        }
        if (res.data.startDate) {
          this.startDate = res.data.startDate.substr(0, 10);
        } else {
          this.startDate = '';
        }
        if (res.data.endDate) {
          this.endDate = res.data.endDate.substr(0, 10);
        } else {
          this.endDate = '';
        }
        if (res.data.payDate) {
          this.payDate = res.data.payDate.substr(0, 10);
        } else {
          this.payDate = '';
        }
      });
    },
    checkStatus(value) {
      if (value == '即将到期') {
        return 's-state-caveat'
      } else if (value == '已入账') {
        return 's-state-success'
      } else if (value == '未入账') {
        return 's-state-prohibited'
      }
    },
    // 详情连接合同详情
    disposalDetailInfoClick(id) {
      this.$refs.disposalDetail.openModal(id);
    },
  }
};
</script>

<style lang="scss">
.h-tab-content .h-table-info tr th {
  width: 147px;
}
</style>

