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
        <!-- <p class="u-detail-p">申请单号：{{applydetailList.orderNo}}</p>
        <p class="u-detail-p">申请提交时间：{{dateCreated}}</p> -->
        <!-- <div class="el-steps-item">
          <el-steps :active="checkHightlight(orderStatus,disposalOfPerform)" align-center>
            <el-step title="提交申请" description=""></el-step>
            <el-step title="审批" description=""></el-step>
            <el-step title="处置执行" description=""></el-step>
          </el-steps>
        </div> -->
        <!--  tab切换 -->

        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
            <a>历史使用信息</a>
          </li>
          <!-- <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li> -->
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
          <div>
            <table class=" h-table-info">
              <tr>
                <th class="f-text-right">房间号</th>
                <td style="width: 200px;">
                  <span class="f-pull-left">{{roomData.roomNo}}</span>
                  <span class="z-state f-vertical-align-middle u-span-left" :class="checkStatus(roomData.useStatus)">

                    {{roomData.useStatusName}}</span></td>
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
                <th class="f-text-right">房屋类型</th>
                <td>{{roomData.roomTypeNameString}}</td>
              </tr>
              <tr>
                <th class="f-text-right">使用人数</th>
                <td>{{roomData.userNum?roomData.userNum +'人':''}}</td>
                <th class="f-text-right" v-show="!isCompany">房间名称</th>
                <td>{{roomData.name}}</td>
              </tr>
              <tr>
                <th class="f-text-right">房间照片</th>
                <td colspan="3">
                  <viewer :images="roomData.fileResponseList">
                    <img v-for="(item, index) in roomData.fileResponseList" :key="index" :src="item.url" v-show="item" style="width:90px;height: 90px;margin: 5px" />
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
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='houseinfo'">
          <el-table :data="roomlist" stripe style="width: 100%; ">
            <el-table-column prop="useOrganName" label="使用单位">
            </el-table-column>
            <el-table-column prop="useClientStatusName" label="使用状态">
            </el-table-column>
            <el-table-column prop="roomTypeName" label="房间类型">
            </el-table-column>
            <el-table-column prop="roomName" label="房间名称">
            </el-table-column>
            <el-table-column prop="useUserNum" label="使用人数">
            </el-table-column>
            <el-table-column prop="useUserRealName" label="使用人">
            </el-table-column>
            <el-table-column prop="useStartDate" label="使用开始时间">
            </el-table-column>
            <el-table-column prop="useEndDate" label="使用结束时间">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      carDetailShow: false, // 弹出框开关
      roomData: {}, // 房间详情数据
      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      type: '',
      isCompany: false,
      listfile: [], //数据集合
      list: [], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      pageSelect: "",
      exceedType: '',
    };
  },
  activated() { },
  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId
    },
  },
  methods: {
    // 初始化弹出框
    openModal(id, type) {
      this.carDetailShow = true;
      this.roomId = id;
      this.type = type;
      this.pageSelect = 'basic';
      this.getDetail();
      this.getDataRequest(id)
    },
    //使用状态
    checkStatus(value) {
      if (value === 'INUSE') {
        return 's-state-inuse'
      } else if (value === 'IDLE') {
        return 's-state-success'
      } else if (value === 'HANDLEING') {
        return 's-state-prohibited'
      } else if (value === 'OFFICEHOUSEAPPLYING') {
        return 's-state-caveat'
      } else {
        return 's-state-fail'
      }
    },
    //详情
    getDetail(id) {
      let params = {
        roomId: this.roomId
      }
      this.$axiosGet(API.organSearch2_roomDetail, params).then(res => {
        if (res.data) {
          let list = [];
          this.roomData = res.data || {};
          if (res.data.roomRecordResponse) {
            this.roomRecordResponse = res.data.roomRecordResponse;
          } else {
            this.roomRecordResponse = {}
          }
          list = res.data.useUserList || [];
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
    getDataRequest(id) {
      let params = {
        organId: this.organId,
        roomId: id
      };
      this.$axiosGet(API.search_queryRoomDetail, params).then(res => {
        // this.roomData = res.data.roomResponse;
        let roomlist = [];
        this.roomlist = res.data.roomUseHisResponseList;
      });
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
.u-span-left {
  margin-left: 10px;
}
</style>
