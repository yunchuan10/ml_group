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
        <ul class="house-nav-tab" v-show="exceedType && type == '办公室'">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'exceed'" :class="{'active':pageSelect=='exceed'}">
            <a>超标备案</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info" v-show="exceedType > 0">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle">
                  <span></span>基本信息</h2>
              </td>
            </tr>
          </table>
          <!-- 办公室 -->
          <div v-show=" type=='办公室'">
            <table class=" h-table-info">
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
                <td>{{roomData.userArea ? roomData.userArea+'㎡': ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">使用单位</th>
                <td>{{roomData.useOrganName}}</td>
                <th class="f-text-right">房屋类型</th>
                <td>{{roomData.roomBaseTypes}}</td>
              </tr>
              <tr>
                <th class="f-text-right">使用人数</th>
                <td>{{useUserNum}}</td>
                <th class="f-text-right" v-show="!isCompany">房间名称</th>
                <td>{{roomData.roomName}}</td>
              </tr>
              <tr>
                <th class="f-text-right">房间超标情况</th>
                <td colspan="3">
                  <span class="z-state" :class="checkStatus(exceedType)">{{checkStatusName(exceedType)}}</span>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">房间照片</th>
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
                  <h2 class="h-table-subtitle" style="padding: 10px 0 0 0">
                    <span></span>当前使用人员明细</h2>
                </td>
              </tr>
            </table>
            <el-table :data="list" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" label="序号" width="50">
                <template slot-scope="scope">
                  {{$serialUtils(pageSize, page, scope.row.num)}}
                </template>
              </el-table-column>
              <el-table-column prop="realName" label="姓名">
              </el-table-column>
              <el-table-column prop="dutiesLevelName" label="职务级别">
              </el-table-column>
              <el-table-column prop="deptName" label="所在部门">
              </el-table-column>
              <el-table-column prop="standardArea" label="标准面积（㎡）">
              </el-table-column>
              <el-table-column prop="realShareArea" label="实际分摊面积（㎡）">
                <template slot-scope="scope">{{ scope.row.realShareArea | dot2}}</template>
              </el-table-column>
              <el-table-column label="超标情况">
                <template slot-scope="scope">
                  <span class="z-state" :class="checkStatus(scope.row.excessive)">{{checkStatusName(scope.row.excessive)}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <table class="h-table-info" v-show="type == '服务用房' || type == '设备用房' || type == '技术业务用房' || type == '附属用房'">
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
              <td>{{roomData.userArea ? roomData.userArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房屋类型</th>
              <td colspan="3">{{roomData.roomBaseTypes}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间照片</th>
              <td colspan="3">
                <viewer :images="roomData.fileResponse">
                  <img v-for="(item, index) in roomData.fileResponse" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>
          <!-- 空置房间 -->
          <table class="h-table-info" v-show="type == '空置'">
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{roomData.roomNo}}</td>
              <th class="f-text-right">房间位置</th>
              <td style="word-break:break-all">{{roomData.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">建筑面积</th>
              <td>{{roomData.buildArea ? roomData.buildArea: '0'}}㎡</td>
              <th class="f-text-right">使用面积</th>
              <td>{{roomData.useArea ? roomData.useArea: '0'}}㎡</td>
            </tr>
            <tr>
              <th class="f-text-right">使用状态</th>
              <td colspan="3">{{roomData.useClientStatusName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间照片</th>
              <td colspan="3">
                <viewer :images="imgsList">
                  <img v-for="(item, index) in imgsList" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='exceed' && exceedType && type == '办公室'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">情况说明</th>
              <td colspan="3">{{roomRecordResponse.situationDescription}}</td>
            </tr>
            <tr>
              <th class="f-text-right">附件</th>
              <td colspan="3">
                <ul class="u-file">
                  <li v-for=" (item, index) in roomRecordResponse.sysAttachmentInfoList" :key="index" style="idisplay:block;">{{index+1}}、{{item.name}}
                    <a class="ahover" target="_block" :href="item.url" download>预览</a>
                  </li>
                </ul>
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
      handleType: '',
      list: [],
      carDetailShow: false, // 弹出框开关
      pageSelect: 'basic',
      isCompany: false,
      roomId: '',//房间id
      type: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      exceedType: '',
      useUserNum: 0, //使用人数
      imgsList: [], //房间图片
      roomRecordResponse: {} //备案信息
    };
  },
  activated() {
  },
  methods: {
    // 初始化弹出框
    openModal(id, type, chao) {
      this.carDetailShow = true;
      this.roomId = id;
      this.type = type;
      this.exceedType = chao;
      this.pageSelect = 'basic';
      this.getDetail();
    },
    //详情
    getDetail(id) {
      let params = {
        roomId: this.roomId
      }
      this.$axiosGet(API.totalusage_findEmptyRoomDetail, params).then(res => {
        if (res.data) {
          let list = [];
          this.roomData = res.data.roomResponse || {};
          if (res.data.roomRecordResponse) {
            this.roomRecordResponse = res.data.roomRecordResponse;
          }
          if (res.data.fileResponseAdapterList) {
            this.imgsList = res.data.fileResponseAdapterList;
          } else {
            this.imgsList = []
          }

          // this.useUserNum = res.data.excessivePersonResponseList.length;
          list = res.data.excessivePersonResponseList || [];
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
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
    }
  }
};
</script>

<style lang="scss" scoped>
.u-detail-dialog-content {
  padding: 0 15px 0 15px !important;
}
</style>

