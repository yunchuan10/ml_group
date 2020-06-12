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
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>设施设备</a>
          </li>
          <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
            <a>历史维修记录</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{roomData.roomNo}}</td>
              <th class="f-text-right">使用状态</th>
              <td style="word-break:break-all">{{roomData.useClientStatusName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间类型</th>
              <td>{{roomData.roomBaseTypes}}</td>
              <th class="f-text-right">房间位置</th>
              <td>{{roomData.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间名称</th>
              <td>{{roomData.roomName}}</td>
              <th class="f-text-right">当前使用人数</th>
              <td>{{roomData.useUserNum}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用面积</th>
              <td>{{roomData.userArea}}</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用部门</th>
              <td>
                <span v-show='roomData.useUsers.length > 0' v-for="(item,index) in roomData.useUsers" :key="index">
                  <span v-show="index > 0">，</span>{{item.userDeptName}}
                </span>
              </td>
              <th class="f-text-right">使用人</th>
              <td>
                <span v-show='roomData.useUsers.length > 0' v-for="(item,index) in roomData.useUsers" :key="index">
                  <span v-show="index > 0">，</span>{{item.realName}}</span>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">房间照片</th>
              <td colspan="3">
                <viewer :images="roomData.fileResponse">
                  <img v-for="(item, index) in roomData.fileResponse" :key="index" :src="item.url" v-show="item.name" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='property'">
          <div class="f-text-center" style="margin-top:20px;"><img src="../../../../public/static/images/default.png" /></div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='houseinfo'">
          <div class="f-text-center" style="margin-top:20px;"><img src="../../../../public/static/images/default.png" /></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSelect: '',
      roomData: {
        roomNo: '', //房间号
        roomBaseTypes: '', //房间类型
        roomAddress: '', //房间位置
        roomName: '', //房间名称
        userDept: '', //使用部门
        userArea: '', //使用面积
        buildArea: '', //建筑面积
        useUserNum: '', //当前使用人数
        imgUrls: []
      }, // 房间详情数据
      carDetailShow: false, // 弹出框开关
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.pageSelect = 'basic';
      this.getDetail(id);
    },
    getDetail(id) {
      let params = {
        roomId: id
      }
      this.$axiosPost(API.useSummary_roomDetail, params).then(res => {
        this.roomData = res.data;
      })
    }
  }
};
</script>
<style lang="scss">
</style>

