<template>
  <div>
    <div id="floor-list-detail">
      <el-dialog custom-class="m-detail-dialog" append-to-body :show-close="false" width="950px" :visible.sync="roomDetailShow">
        <div class="u-detail-dialog-header" style="background-color: #202122;color:#fff;" slot="title">
          <span>楼座列表</span>
          <div class="f-detail-dialog-header-close" @click="roomDetailShow = false">
            <i class="el-icon-close "></i>
          </div>
        </div>
        <div class="u-detail-dialog-content" style="background-color: #202122;color:#fff;">
          <table class="floot-list-table">
            <tr>
              <th>序号</th>
              <th>房间号</th>
              <th>房间状态</th>
              <th>房间类型</th>
              <th>建筑面积</th>
              <th>使用面积</th>
              <th>使用单位</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.roomNo}}</td>
              <td>{{item.useStatusName}}</td>
              <td>{{item.roomBaseTypes}}</td>
              <td>{{item.buildArea}}</td>
              <td>{{item.userArea}}</td>
              <td>{{item.useOrganName}}</td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomDetailShow: false, // 弹出框开关
      id: '',
      list: []
    };
  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.roomDetailShow = true;
      this.id = id;
      this.getRoomList();
    },
    // 获取楼层下的房间列表
    getRoomList() {
      let params = {
        storeysId: this.id
      }
      this.$axiosPost(API.room_query, params).then(res => {
        this.list = res.data.data || [];
      })
    }
  }
};
</script>

<style lang="scss">
.floot-list-table {
  width: 100%;
  border: 1px solid #fff;
  tr,
  th,
  td {
    border: 1px solid #fff;
  }
  th,
  td {
    padding: 8px 15px;
    text-align: left;
    font-weight: normal;
  }
  th {
    background: #323941;
  }
}
</style>

