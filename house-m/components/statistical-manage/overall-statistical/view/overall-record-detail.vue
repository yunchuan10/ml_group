<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1000px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{roomData.roomNo}}</td>
              <th class="f-text-right">房间位置</th>
              <td style="word-break:break-all">{{roomData.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea: '0'}}㎡</td>
              <th class="f-text-right">使用面积</th>
              <td>{{roomData.userArea ? roomData.userArea: '0'}}㎡</td>
            </tr>
            <tr>
              <th class="f-text-right">房间类型</th>
              <td colspan="3">{{roomData.roomTypeNameString}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间照片</th>
              <td colspan="3">
                <viewer :images="roomData.fileResponseList">
                  <img v-for="(item, index) in roomData.fileResponseList" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSelect: '',
      roomData: {}, // 房间详情数据
      handleType: '',
      list: [],
      roomId: '', //房间id
      organId: '', //单位id
      carDetailShow: false, // 弹出框开关
      isCompany: false,
      domains: [], // 附件
      messageFee: '', //情况说明
      roomRecordId: ''//备案id
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, type) {
      this.carDetailShow = true;
      this.pageSelect = 'basic';
      this.roomRecordId = type;
      this.roomId = id;
      this.getDetail();
    },
    getDetail() {
      let params = {
        roomId: this.roomId,
      }
      this.$axiosGet(API.totalusage_queryServiceRoomdetail, params).then(res => {
        if (res.data) {
          this.roomData = res.data;
          this.list = res.data.excessivePersonResponseList;
        } else {
          this.roomData = {};
          this.list = []
        }
        if (res.data.roomRecordResponse) {
          if (res.data.roomRecordResponse.fileResponseList) {
            this.domains = res.data.roomRecordResponse.fileResponseList;
          } else {
            this.domains = [];
          }
        }
      })
    },
    checkStatus(value) {
      if (value == 'YES') {
        return 's-state-prohibited'
      } else {
        return 's-state-success'
      }
    },
    checkStatusName(value) {
      if (value == 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0;
}
</style>

