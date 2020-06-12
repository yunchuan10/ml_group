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
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'property'" v-show="record ==='YES'" :class="{'active':pageSelect=='property'}">
            <a>备案信息</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle" style="padding-top: 10px">
                  <span></span>基本详情</h2>
              </td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{roomData.roomNo}}</td>
              <th class="f-text-right">房间位置</th>
              <td style="word-break:break-all">{{roomData.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea+'㎡': ''}}</td>
              <th class="f-text-right">使用面积</th>
              <td>{{roomData.useArea ? roomData.useArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用单位</th>
              <td>{{roomData.useOrganName}}</td>
              <th class="f-text-right">房间类型</th>
              <td>{{roomData.roomTypeNameString}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用人数</th>
              <td>{{roomData.userNum}}</td>
              <th class="f-text-right">房间名称</th>
              <td>{{roomData.name}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间超标情况</th>
              <td colspan="3">
                <span class="z-state" :class="checkStatus(roomData.excessive)">{{checkStatusName(roomData.excessive)}}</span>
                <!-- {{roomData.excessiveWarningId}} -->
              </td>
            </tr>
            <tr>
              <th class="f-text-right">房间照片</th>
              <td colspan="3">
                <viewer :images="roomData.fileResponseList">
                  <img v-for="(item, index) in roomData.fileResponseList" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
              <!-- <th  colspan="3">房间照片</th>
              <td>{{roomData.useClientStatusName}}</td> -->
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle">
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
              <template slot-scope="scope">{{ scope.row.realShareArea | dot2}}</template>
            </el-table-column>
            <el-table-column prop="excessive" label="超标情况">
              <template slot-scope="scope">
                <span class="z-state" :class="checkStatus(scope.row.excessive)">{{checkStatusName(scope.row.excessive)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="u-detail-dialog-content" v-show="pageSelect=='property'">
          <!-- <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle" style="padding: 20px 0 10px 0">
                  <span></span>备案情况</h2>
              </td>
            </tr>
          </table> -->
          <div class="h-tab-content" style="padding-top: 15px">
            <table class="h-table-info">
              <tr>
                <th class="f-text-right">情况说明</th>
                <td colspan="3">{{messageFee}}</td>
              </tr>
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <ul class="u-file">
                    <li v-for=" (item, index) in domains" :key="index" style="idisplay:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" target="_block" :href="item.url" download>下载</a>
                    </li>
                  </ul>

                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // components: {
  //   vuePopupPicture // 看大图
  // },
  data() {
    return {
      pageSelect: '',
      roomData: {}, // 房间详情数据
      handleType: '',
      list: [],
      roomId: '', //房间id
      organId: '', //单位id
      carDetailShow: false, // 弹出框开关
      isCompany: false,
      domains: [], // 附件
      messageFee: '', //情况说明
      roomRecordId: '', //备案id
      record: '',
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, type, record) {
      this.carDetailShow = true;
      this.pageSelect = 'basic';
      this.roomRecordId = type;
      this.record = record;
      this.roomId = id;
      this.getDetail();
      this.getkeepOnRecord();
    },
    getDetail() {
      let params = {
        roomId: this.roomId,
      }
      this.$axiosGet(API.useManage_roomDetail, params).then(res => {
        this.roomData = res.data;
        this.list = res.data.useUserList;
        // if (this.roomData.dateCheckOut != null && this.roomData.dateCheckOut != '') {
        //   this.roomData.dateCheckOut = DATEFORMAT.dateReturn(new Date(this.roomData.dateCheckOut));
        // }
        // if (this.roomData.dataAssign != null && this.roomData.dataAssign != '') {
        //   this.roomData.dataAssign = DATEFORMAT.dateReturn(new Date(this.roomData.dataAssign));
        // };
      })
    },
    //获取备案信息
    getkeepOnRecord() {
      let params = {
        id: this.roomRecordId,
      };
      this.$axiosGet(API.useManage_roomRecordDetail, params).then(res => {
        if (res.data) {
          this.messageFee = res.data.situationDescription;
          this.domains = res.data.fileResponseList;
        } else {
          this.messageFee = '';
          this.domains = [];
        }

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
.h-tab-content {
  margin-top: 0;
}
</style>

