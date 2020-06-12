<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="detail-top-table h-tab-content">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">会议室名称</th>
              <td colspan="3">{{data.name}}</td>
            </tr>
            <tr>
              <th class="f-text-right">容纳人数</th>
              <td>{{data.capacity}}人</td>
              <th class="f-text-right">会议室面积</th>
              <td>{{data.area}}㎡</td>
            </tr>
            <tr>
              <th class="f-text-right">设备</th>
              <td colspan="3">{{data.equip}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地区</th>
              <td colspan="3">{{data.address}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{data.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">会议室封面</th>
              <td colspan="3">
                <viewer>
                  <img :src="data.attachImg" style="width:130px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">会议室图片</th>
              <td colspan="3">
                <viewer :images="data.attachmentList">
                  <img v-for="(img, imgIndex) in data.attachmentList" :key="imgIndex" v-show="img.attachUrl" :src="img.attachUrl" style="width:120px;height:100px;margin:5px;" />
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
      carDetailShow: false, // 弹出框开关
      data: {},
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.getDataRequest(id);
      this.carDetailShow = true;
    },
    getDataRequest(id) {
      let params = {
        meetingId: id
      };
      this.$axiosGet(API.roomInfo_roomInfoDetail, params).then(res => {
        if (res.status === 200 && res.data) {
          this.data = res.data;
          console.log(data)
        }
      })
    }
  }
};
</script>

<style lang="scss">
</style>

