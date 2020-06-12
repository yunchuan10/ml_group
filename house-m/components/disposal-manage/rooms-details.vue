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

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">房间号</th>
              <td>{{data.projectName}}</td>
              <th class="f-text-right">房间位置</th>
              <td>{{data.milepostName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用面积</th>
              <td>{{checkTime(data.startDate)}}</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{checkTime(data.endDate)}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间状态</th>
              <td colspan="3">{{data.remarks}}</td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="imgBeforeUrls">
                  <img v-for="(item, index) in imgBeforeUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
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
      imgBeforeUrls: [],
      active: 1,
      pageSelect: '',
      carDetailShow: false, // 弹出框开关
      data: {}
    };
  },
  activated() { },
  methods: {
    checkTime(value) {
      if (value) {
        return value.substr(0, 10);
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.getDataRequest(id)
    },
    getDataRequest(id) {
      let params = {
        id: id
      };
      this.$axiosGet(API.buildingProject_getMilePostDetails, params).then(res => {
        this.data = { ...res.data }
      });
    }
  }
};
</script>

<style lang="scss">
.h-tab-content .h-table-info tr th {
  width: 147px;
}
</style>