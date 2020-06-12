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
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{roomData.roomNo}}</td>
              <th class="f-text-right">房间位置</th>
              <td style="word-break:break-all">{{roomData.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用面积</th>
              <td>{{roomData.useArea ? roomData.useArea+'㎡': ''}}</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用方式</th>
              <td>{{roomData.userModeName}}</td>
              <th class="f-text-right">分配时间</th>
              <td>{{roomData.dataAssign?roomData.dataAssign.substr(0, 10):''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">退房时间</th>
              <td>{{roomData.dateCheckOut?roomData.dateCheckOut.substr(0, 10):''}}</td>
              <th class="f-text-right" v-show="!isCompany">房间状态</th>
              <td v-show="!isCompany">{{roomData.useStatusName}}</td>
              <th v-show="isCompany" class="f-text-right">使用状态</th>
              <td v-show="isCompany">{{roomData.useClientStatusName }}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间类型</th>
              <td>{{roomData.roomTypeName}}</td>
              <th class="f-text-right">使用单位</th>
              <td>{{roomData.useOrganName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
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
      roomData: {}, // 房间详情数据
      carDetailShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, pageName) {
      this.carDetailShow = true;
      if (pageName) {
        this.isCompany = true;
      } else {
        this.isCompany = false;
      }
      this.getDetail(id);
    },
    getDetail(id) {
      let params = {
        id: id
      }
      this.$axiosGet(API.room_queryDetail, params).then(res => {
        this.roomData = res.data;
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0;
}
</style>

