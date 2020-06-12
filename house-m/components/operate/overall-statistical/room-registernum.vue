<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="800px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <table class="h-table-info">
            <!-- <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px" style="padding: 0 0 10px 0">
                <h2 class="h-table-subtitle">
                  <span></span>基本信息</h2>
              </td>
            </tr> -->
            <tr>
              <th class="f-text-right">合同编号</th>
              <td style="width: 243px;">{{roomData.contractNo}}</td>
              <th class="f-text-right">合同开始日期</th>
              <td>{{roomData.contractStartDate ? formartDate(roomData.contractStartDate):'-'}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同结束日期</th>
              <td>{{roomData.contractEndDate ? formartDate(roomData.contractEndDate):'-'}}</td>
              <th class="f-text-right">出租方</th>
              <td>{{roomData.organName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">承租人</th>
              <td>{{roomData.lesseeName}}</td>
              <th class="f-text-right">合同租金</th>
              <td>{{roomData.contractRental?roomData.contractRental+'元/年' : ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">租金起止日期：</th>
              <td>{{roomData.startDate ? formartDate(roomData.startDate):'-'}}—{{roomData.endDate ? formartDate(roomData.endDate):'-'}}</td>
              <th class="f-text-right">应缴租金</th>
              <td>{{roomData.money}}元/年</td>
            </tr>
            <tr>
              <th class="f-text-right">缴纳时长</th>
              <td>{{roomData.duration}}</td>
              <th class="f-text-right">状态</th>
              <td>
                <span class="z-state" :class="checkStatus(roomData.information == 'YES' ? roomData.informationName : roomData.statusName)">{{roomData.information == 'YES' ? roomData.informationName : roomData.statusName}}</span>
              </td>
            </tr>
            <tr v-if="roomData.rentalInformation ==='YES'">
              <th class="f-text-right">交租时间：</th>
              <td>{{roomData.payDate ? formartDate(roomData.payDate):''}}</td>
              <th class="f-text-right">开票单位：</th>
              <td>{{roomData.issuingOrganName}}</td>
            </tr>
            <tr v-if="roomData.rentalInformation ==='NO'">
              <th class="f-text-right">租金到期提醒：</th>
              <td colspan="3">{{roomData.statusName == "即将到期" ? '剩余：'+roomData.remainingDays+'天' : '逾期：'+roomData.remainingDays+'天'}}</td>
            </tr>

          </table>
        </div>
      </div>
    </el-dialog>
    <!-- <vuePopupPicture ref="Vpicture"></vuePopupPicture> -->
  </div>
</template>

<script>
// import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
export default {
  // components: {
  //   vuePopupPicture // 看大图
  // },
  data() {
    return {
      roomData: {}, // 房间详情数据
      carDetailShow: false, // 弹出框开关
      list: [],
      id: '', //详情数据ID

    };
  },
  activated() { },
  methods: {
    formartDate(value) {
      if (value) {
        return value.substr(0, 10);
      } else {
        return '';
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      this.carDetailShow = true;
      this.getDetail();
    },
    getDetail() {
      let params = {
        rentalInformationId: this.id
      }
      this.$axiosGet(API.rent_getDetail, params).then(res => {
        if (res.data) {
          this.roomData = res.data;
        }

      })
    },
    checkStatus(value) {
      if (value == '即将到期') {
        return 's-state-caveat'
      } else if (value == '逾期') {
        return 's-state-prohibited'
      } else if (value == '已入账') {
        return 's-state-apply'
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0;
}
</style>

