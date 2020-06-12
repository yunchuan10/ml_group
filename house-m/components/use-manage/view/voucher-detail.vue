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
        <el-timeline>
          <el-timeline-item v-for="(item,index) in list" :key='index' :timestamp="item.grantDateString.substr(0,10)" placement="top">
            <div class="h-tab-content" style="margin-top:0;">
              <table class="h-table-info">
                <tr>
                  <th class="f-text-right">发放单位</th>
                  <td>{{item.grantOrganName}}</td>
                  <th class="f-text-right">领取单位</th>
                  <td>{{item.receiveOrganName }}</td>
                </tr>
                <tr>
                  <th class="f-text-right">发放人</th>
                  <td>{{item.grantUserName}}</td>
                  <th class="f-text-right">领取人</th>
                  <td>{{item.receiveUserName}}</td>
                </tr>
                <tr>
                  <th class="f-text-right">发放人联系方式</th>
                  <td>{{item.grantUserPhone}}</td>
                  <th class="f-text-right">领取人联系方式</th>
                  <td>{{item.receiveUserPhone}}</td>
                </tr>
                <tr>
                  <th class="f-text-right">领取人手写签名</th>
                  <td colspan="3">{{item.location}}</td>
                </tr>
              </table>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      organId: '', //单位id
      id: '',
      grantOrganName: '',//发放单位名称
      grantUserName: '', //发放人名称
      grantUserPhone: '',//发放人联系方式
      receiveOrganName: '',//领取单位名称
      receiveUserPhone: '', //领取人联系方式
      receiveUserName: '', //领取人名称
      lastUpdated: '', // 最新更新日期
      location: '', //图片url
      list: [], //数据集合
    };
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.getDataRequest(id)
      this.carDetailShow = true;
    },
    getDataRequest(id) {
      let params = {
        organId: id,
      }
      this.$axiosGet(API.certificateRoom_detail, params).then(res => {
        let list = [];
        if (res.data.length > 0) {
          this.grantOrganName = res.data[0].grantOrganName;
          this.receiveOrganName = res.data[0].receiveOrganName;
          this.grantUserName = res.data[0].grantUserName;
          this.receiveUserName = res.data[0].receiveUserName;
          this.grantUserPhone = res.data[0].grantUserPhone;
          this.receiveUserPhone = res.data[0].receiveUserPhone;
          this.lastUpdated = res.data[0].lastUpdated;
          this.location = res.data[0].location;
          list = res.data;
        }
        this.list = list;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
.h-table-subtitle {
  margin: 0;
}
</style>

