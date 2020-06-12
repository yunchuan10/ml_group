<template>
  <div>
    <div id="floor-list-detail">
      <el-dialog custom-class="m-detail-dialog" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
        <div class="u-detail-dialog-header" style="background-color: #202122;color:#fff;" slot="title">
          <span>楼座列表</span>
          <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
            <i class="el-icon-close "></i>
          </div>
        </div>
        <div class="u-detail-dialog-content" style="background-color: #202122;color:#fff;">
          <table class="floot-list-table">
            <tr>
              <th>序号</th>
              <th>楼层</th>
              <th>办公室</th>
              <th>服务用房</th>
              <th>设备用房</th>
              <th>附属用房</th>
              <th>技术用房</th>
              <th>空置房间</th>
              <th>使用单位</th>
            </tr>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{index + 1}}</td>
              <td>
                <a @click="sendFloor(item.floorId, item.storeysId)">{{item.storeysName}}</a>
              </td>
              <td>{{item.officeNum}}</td>
              <td>{{item.serviceNum}}</td>
              <td>{{item.equipNum}}</td>
              <td>{{item.affiliatedNum}}</td>
              <td>{{item.techNum}}</td>
              <td>{{item.typeNullNum}}</td>
              <td>{{item.organNum}}</td>
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
      carDetailShow: false, // 弹出框开关
      id: '',
      ws: null,
      list: []
    };
  },
  methods: {
    // 初始化弹出框
    openModal(id, ws) {
      this.carDetailShow = true;
      this.id = id;
      this.ws = ws;
      this.getFloorList();
    },
    getFloorList() {
      let params = {
        floorId: this.id
      }
      this.$axiosPost(API.storeys_getFloorCount, params).then(res => {
        this.list = res.data || []
      })
    },
    sendFloor(floorId, storeysId) {
      this.$emit('sendFloor', {
        floorId: floorId,
        storeysId: storeysId
      })
      this.carDetailShow = false;
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

