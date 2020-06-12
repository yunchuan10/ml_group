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
              <th class="f-text-right">职务级别</th>
              <th class="f-text-right">批复编制人数（人）</th>
              <th class="f-text-right">标准面积（㎡/人）</th>
              <th class="f-text-right">核定面积（㎡）</th>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
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
      roomUser: [],
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
        roomId: id
      }
      this.$axiosPost(API.room_queryDetail, params).then(res => {
        if (res.data) {
          this.roomData = res.data;
          this.roomUser = res.data.useUsers;
        }
      })
    },

  }
};
</script>

<style lang="scss">
</style>

