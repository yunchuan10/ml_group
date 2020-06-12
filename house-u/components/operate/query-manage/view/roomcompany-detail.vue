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
              <th class="f-text-right">使用状态</th>
              <td style="word-break:break-all">{{roomData.useClientStatusName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间类型</th>
              <td style="width: 200px;">{{roomData.roomBaseTypes}}</td>
              <th class="f-text-right">房间名称</th>
              <td style="word-break:break-all">{{roomData.roomName || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用面积</th>
              <td>{{roomData.userArea ? roomData.userArea+'㎡': ''}}</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用单位</th>
              <td>{{roomData.useOrganName}}</td>
              <th class="f-text-right">使用部门</th>
              <td>
                <span v-for="(item, index) in roomUser" :key="index" v-show="item">
                  <span v-show="index > 0">，</span>{{item.deptName}}
                </span>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">使用人数</th>
              <td>{{roomUser.length || ''}}</td>
              <th class="f-text-right">使用人</th>
              <td>
                <span v-for="(item, index) in roomUser" :key="index">
                  <span v-show="index > 0">，</span>{{item.realName}}
                </span>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="roomData.fileResponse">
                  <img v-for="(item, index) in roomData.fileResponse" :key="index" :src="item.url" v-show="item.name" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
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
          this.roomUser = res.data.excessivePersonResponseList;
        }
      })
    },

  }
};
</script>

<style lang="scss">
</style>

