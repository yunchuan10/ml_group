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
              <td>{{roomData.useArea ? roomData.useArea: '0'}}㎡</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea: '0'}}㎡</td>
            </tr>
            <tr v-show="this.handleType.includes('OFFICEHOUSE')">
              <th class="f-text-right">房间名称</th>
              <td>{{roomData.name}}</td>
              <th class="f-text-right">使用人数</th>
              <td>{{roomData.userNum}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间类型</th>
              <td colspan="3">{{roomData.roomTypeNameString}}</td>
            </tr>
            <tr v-show="this.handleType.includes('OFFICEHOUSE')">
              <th class="f-text-right">使用单位</th>
              <td colspan="3">{{roomData.useOrganName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间超标情况</th>
              <td colspan="3">
                <span class="z-state" :class="checkStatus(roomData.excessive)">{{checkStatusName(roomData.excessive)}}</span>
              </td>
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
          <table class="h-table-info" v-show="roomData.useClientStatus ==='USE' &&  (this.handleType.includes('OFFICEHOUSE'))">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle">
                  <span></span>当前使用人员明细</h2>
              </td>
            </tr>
          </table>
          <el-table :data="list" stripe style="width: 100%" v-show="roomData.useClientStatus ==='USE' &&  (this.handleType.includes('OFFICEHOUSE'))">
            <el-table-column type="index" fixed="left" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="realName" label="姓名">
            </el-table-column>
            <el-table-column prop="dutiesLevelName" label="职务级别">             
            </el-table-column>
            <el-table-column prop="deptName" label="所在部门">
            </el-table-column>
            <el-table-column prop="standardArea" label="标准面积(㎡)">
            </el-table-column>
            <el-table-column prop="realShareArea" label="实际分摊面积(㎡)">
              <template slot-scope="scope">
                {{scope.row.realShareArea | dot2}}
              </template>
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
export default {
  data() {
    return {
      roomData: {}, // 房间详情数据
      handleType: [],
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
    openModal(id) {
      this.carDetailShow = true;
      this.roomId = id;
      this.handleType = [];
      this.getDetail();  
    },
    getDetail() {
      let params = {
        roomId: this.roomId,
      }
      this.$axiosGet(API.useManage_roomDetail, params).then(res => {
        if(res.data){    
          this.roomData = res.data;
          if (res.data.useUserList) {
            this.list = res.data.useUserList;
          } else {
            this.list = []
          }
          if (res.data.roomTypeList) {
            res.data.roomTypeList.forEach((item, index) => {      
              this.handleType.push(item.roomTypeId);   
            })
          } else {
            this.handleType = [];
          }
        }
      })
    },
    checkStatus(value) {
      if (value === 'YES') {
        return 's-state-prohibited'
      } else {
        return 's-state-success'
      }
    },
    checkStatusName(value) {
      if (value === 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    },

  }
};
</script>

<style lang="scss" scoped>
</style>

