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
              <th class="f-text-right">院落名称</th>
              <td>{{courtyardName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">楼座名称</th>
              <td>{{floorName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">楼层名称</th>
              <td>{{storeysName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">楼层平面图</th>
              <td>
                <viewer :images="(storeysPlanImgUrls && storeysPlanImgUrls.length )>0?storeysPlanImgUrls:[]">
                  <img v-for="(item, index) in storeysPlanImgUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
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
      id: '', //详情
      carDetailShow: false, // 弹出框开关
      storeysId: '', //楼层id
      courtyardName: '',//院落名称
      storeysName: '', // 楼层名称
      floorName: '', // 楼座名称
      storeysPlanImgUrls: [] //楼层平面图
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
        id: id
      };
      this.$axiosGet(API.storeys_queryDetail, params).then(res => {
        this.courtyardName = res.data.courtyardName;
        this.floorName = res.data.floorName;
        this.storeysName = res.data.name;
        this.storeysPlanImgUrls = res.data.fileResponseList || [];
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0 !important;
}
</style>

