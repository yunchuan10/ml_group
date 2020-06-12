<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body @close="pageSelect == 'basic'" :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="padding-bottom:20px;">
        <p class="u-detail-p">申请单号：{{orderNo}}</p>
        <p class="u-detail-p">申请提交时间：{{dateCreated}}</p>
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>用房申请</a>
          </li>
          <li v-show="this.status=='3'" @click=" pageSelect='plan'" :class=" {'active':pageSelect=='plan' }">
            <a>调配方案</a>
          </li>
          <li @click="pageSelect = 'history'" :class="{'active':pageSelect=='history'}">
            <a>历史记录</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">单位名称</th>
              <td>{{organName}}
              </td>
              <th class="f-text-right">单位类别</th>
              <td>{{organTypeName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">原办公地址</th>
              <td colspan="3">
                <span v-for="(item, index) in organAddressList" :key="index">
                  <span v-show="index > 0">，</span> {{item}}</span>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">原办公用房面积</th>
              <td colspan="3" class="padding1">{{hasOfficeArea ? hasOfficeArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">人数统计</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr>
                    <td>职务级别</td>
                    <td>编制数</td>
                    <td>实有数</td>
                  </tr>
                  <tr v-for="(item, index) in dutyTypeResponses" :key="index">
                    <td>{{item.dutyLevelName}}</td>
                    <td>{{item.dutyCheckNum}}</td>
                    <td>{{item.dutyRealNum}}</td>
                  </tr>
                  <tr>
                    <td>合计</td>
                    <td>{{dutyCheckNum}}</td>
                    <td>{{dutyRealNum}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">拟申请调配面积
              </th>
              <td colspan="3">{{applyArea ? applyArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">申请原因</th>
              <td colspan="3">{{applyReason}}</td>
            </tr>          
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right" width="330px">单位名称</th>
              <td>{{organName}}
              </td>
              <th class="f-text-right">批复编制人数</th>
              <td>{{approvedUserNum}}人</td>
            </tr>
            <tr>
              <th class="f-text-right">核定办公室使用面积</th>
              <td>{{officeCheckArea ? officeCheckArea+'㎡': ''}}
              </td>
              <th class="f-text-right">核定服务用房使用面积</th>
              <td>{{serviceCheckArea ? serviceCheckArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">核定设备用房使用面积</th>
              <td>{{equipCheckArea ? equipCheckArea+'㎡': ''}}
              </td>
              <th class="f-text-right">核定基本办公用房使用面积</th>
              <td>{{basicArea ? basicArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">核定附属用房建筑面积</th>
              <td>{{affiliatedCheckArea ? affiliatedCheckArea+'㎡': ''}}
              </td>
              <th class="f-text-right">总建筑面积</th>
              <td>{{totalArea | dot2}}㎡</td>
            </tr>
            <tr>
              <th class="f-text-right">配置方式</th>
              <td colspan="3">{{planType}}
              </td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{remark || ''}}</td>
            </tr>
          </table>
          <div v-for="(item,index) in roomBaseResponseList" :key="index">
            <h2 class="h-table-subtitle" style="margin: 10px 0;">
              <span></span>{{item.allocatePlanDetailName}}
              <!-- <div class="u-bread-btn-group f-pull-right">
                <button class="f-pull-right u-bread-btn" @click="Url(item.allocatePlanDetailId)">
                  查看平面图
                </button>
              </div> -->
            </h2>
            <div class="h-table f-relative">
              <el-table :data="item.allocateRangeGroupByRoomList" stripe style="width: 100%">
                <el-table-column label="院落名称" prop="courtyardName"></el-table-column>
                <el-table-column label="地址" prop="courtyardAddress"></el-table-column>
                <el-table-column label="楼座" prop="floorName"></el-table-column>
                <el-table-column label="建筑面积（㎡）" prop="buildAreaSum"></el-table-column>
                <el-table-column label="使用面积（㎡）" prop="useAreaSum"></el-table-column>
                <el-table-column label="房间数量（间）" prop="roomNum"></el-table-column>
                <el-table-column label="房间明细" prop="roomNos"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='history'">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in hasCommontHis" :key="index" :timestamp="returnDataFormat(item.createTime)" placement="top">
              <el-card>
                <span class="z-state" :class="item.flowLabel?'s-state-apply':'s-state-fail'">{{item.flowLabel?item.flowLabel:'待审批'}}</span>
                <h4>{{item.flowLabel?'提交人':'审批人'}}：{{item.userName}}</h4>
                <span v-show='item.flowLabel !="提交申请"'>备注：{{item.comment || ''}}</span>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <el-table :data="allFile" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_blank">预览</a>
              </template>
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
      carDetailShow: false, // 弹出框开关
      pageSelect: 'basic',
      orderNo: '', // 订单号
      dateCreated: '', // 创建时间
      organTypeName: '', // 单位类别
      organName: '',// 单位名称
      approvedUserNum: '',//批复人数
      officeCheckArea: '',//核定办公用房面积
      serviceCheckArea: '',//服务设备用房面积
      equipCheckArea: '', //设备用房面积核定
      affiliatedCheckArea: '', //附属用房面积核定
      remark: '',//备注
      planType: '',//配置类型 
      fileUrls: [], //附件集合        
      organAddressList: [], //地址集合
      hasOfficeArea: '',//原办公用房面积
      dutyTypeResponses: [],//人数统计集合
      dutyRealNum: 0,
      dutyCheckNum: 0,
      applyArea: '', //拟申请调配办公用房面积
      applyReason: '', // 申请原因
      hasCommontHis: [],
      allCommontHis: [],
      allFile: [],
      status: '', //状态
      statuslevel: 1,
      allocatePlan: {},
      roomBaseResponseList: []
    };
  },
  activated() {
  },
  computed: {
    //基本核定面积
    basicArea() {
      let num = 0;
      num = parseFloat(Number(this.officeCheckArea) + Number(this.serviceCheckArea) + Number(this.equipCheckArea))
      return num;    },
    totalArea() {
      let num = 0;
      num = parseFloat(this.basicArea / 0.65 + Number(this.affiliatedCheckArea))
      return num;    }
  },
  methods: {
    returnDataFormat(value) {
      if (value) {
        return `${value.substr(0, 4)}/${value.substr(5, 2)}/${value.substr(8, 2)}`
      } else {
        return ''
      }
    },
    // 初始化弹出框
    openModal(id, status) {
      this.carDetailShow = true;
      this.status = status;
      this.pageSelect = "basic";
      this.getDataRequest(id)
    },
    getDataRequest(id) {
      let params = {
        id: id,
      }
      this.$axiosGet(API.officeapply_getDetail, params).then(res => {
        if (res.data) {
          this.organName = res.data.applyOrderDetail.organName;
          this.hasOfficeArea = res.data.applyOrderDetail.hasOfficeArea;
          this.organTypeName = res.data.applyOrderDetail.organTypeName || '';
          this.organAddressList = res.data.applyOrderDetail.organAddressList || [];
          this.dutyTypeResponses = res.data.applyOrderDetail.dutiesLevelResponseList;
          this.dutyCheckNum = 0;
          this.dutyRealNum = 0;
          this.dutyTypeResponses.forEach((item, index) => {
            this.dutyCheckNum += Number(item.dutyCheckNum);
            this.dutyRealNum += Number(item.dutyRealNum);
          })
          this.statuslevel = Number(res.data.applyOrderDetail.orderStatus + 1);
          this.applyArea = res.data.applyOrderDetail.applyArea;
          this.applyReason = res.data.applyOrderDetail.applyReason;
          this.hasCommontHis = res.data.commontHis;
          this.allCommontHis = res.data.allCommontHis;
          this.allFile = res.data.allFile;
          this.orderNo = res.data.applyOrderDetail.orderNo;
          this.dateCreated = res.data.applyOrderDetail.createdAt.substr(0, 10);
          if (res.data.allocatePlan) {
            this.allocatePlan = res.data.allocatePlan;
            this.organName = this.allocatePlan.organName;
            this.approvedUserNum = this.allocatePlan.checkUserNum;
            this.officeCheckArea = this.allocatePlan.officeCheckArea || '0';
            this.serviceCheckArea = this.allocatePlan.serviceCheckArea || '0';
            this.equipCheckArea = this.allocatePlan.equipCheckArea || '0';
            this.affiliatedCheckArea = this.allocatePlan.affiliatedCheckArea || '0';
            this.planType = this.allocatePlan.planType;
            this.remark = this.allocatePlan.remark;
            this.fileUrls = this.allocatePlan.fileResponseList;
            this.roomBaseResponseList = res.data.allocatePlan.allocatePlanDetailResponseList;
          } else {
            this.allocatePlan = {
              checkArea: '',
              planType: '',
              planOfficeAddress: '',
              remark: ''
            }
            this.roomBaseResponseList = [];
          }
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

