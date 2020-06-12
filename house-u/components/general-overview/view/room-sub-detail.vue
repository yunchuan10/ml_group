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
              <td>{{roomData.userArea ? roomData.userArea+'㎡': ''}}</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用单位</th>
              <td>{{roomData.useOrganName}}</td>
              <th class="f-text-right">使用方式</th>
              <td>{{roomData.userModeName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">分配时间</th>
              <td>{{roomData.dataAssign?roomData.dataAssign.substr(0, 10):''}}</td>
              <th class="f-text-right">应腾退时间</th>
              <td>{{roomData.dateCheckOut?roomData.dateCheckOut.substr(0, 10):''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用状态</th>
              <td>{{roomData.useClientStatusName}}</td>
              <th class="f-text-right">房间类型</th>
              <td>{{roomData.roomBaseTypes}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间名称</th>
              <td>{{roomData.roomName}}</td>
              <th class="f-text-right">使用人数</th>
              <td>{{roomData.useUserNum}}</td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="roomData.fileResponse">
                  <img v-for="(item, index) in roomData.fileResponse" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle" style="padding: 20px 0 10px 0">
                  <span></span>当前使用人员明细</h2>
              </td>
            </tr>
          </table>
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column type="index" fixed="left" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="realName" label="姓名">
            </el-table-column>
            <el-table-column prop="dutiesLevelName" label="职务级别">
              <template slot-scope="scope">
                {{scope.row.dutiesLevelName}}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="dutyName" label="职务名称">
              <template slot-scope="scope">
                {{scope.row.dutyName}}
              </template>
            </el-table-column> -->
            <el-table-column prop="deptName" label="所在部门">
              <template slot-scope="scope">
                {{scope.row.deptName}}
              </template>
            </el-table-column>
            <el-table-column prop="standardArea" label="标准面积(㎡)">
            </el-table-column>
            <el-table-column prop="realShareArea" label="实际分摊面积(㎡)">
                 <template slot-scope="scope" >{{ scope.row.realShareArea | dot2}}</template>
            </el-table-column>
            <el-table-column prop="excessive" label="超标情况">
              <template slot-scope="scope">
                <span class="z-state" :class="checkStatus(scope.row.excessive)">{{checkStatusName(scope.row.excessive)}}</span>
              </template>
            </el-table-column>
          </el-table>
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
      handleType: '',
      list: [],
      roomId: '', //房间id
      organId: '', //单位id
      carDetailShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, gid) {
      this.carDetailShow = true;
      this.roomId = id;
      this.organId = gid;
      this.getDetail();
    },
    getDetail() {
      let params = {
        roomId: this.roomId,
        organId: this.organId
      }
      this.$axiosPost(API.yardSearch2_roomDetail, params).then(res => {
        this.roomData = res.data.roomDetail;
        this.list = res.data.roomDetail.excessivePersonResponseList;
        if (this.roomData.dateCheckOut != null && this.roomData.dateCheckOut != '') {
          this.roomData.dateCheckOut = this.roomData.dateCheckOut.substr(0, 10);
        }
        if (this.roomData.dataAssign != null && this.roomData.dataAssign != '') {
          this.roomData.dataAssign = this.roomData.dataAssign.substr(0, 10);
        };
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
    },

  }
};
</script>

<style lang="scss" scoped>
// .h-tab-content {
//   margin-top: 0;
// }
.h-tab-content {
  .h-table-info {
    margin-bottom: 0;
  }
}
</style>

