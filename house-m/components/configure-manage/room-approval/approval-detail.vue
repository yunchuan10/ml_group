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
        <div class="el-steps-item">
          <el-steps :active="statuslevel" align-center>
            <el-step title="提交申请" description=""></el-step>
            <el-step title="用房申请审批" description=""></el-step>
            <el-step title="制定调配方案" description=""></el-step>
            <el-step title="方案审批" description=""></el-step>
          </el-steps>
        </div>
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>用房申请</a>
          </li>
          <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}">
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
              <!-- <th>申请单号</th>
              <td> </td> -->
              <th class="f-text-right">单位名称</th>
              <td>{{organName}}
              </td>
              <th class="f-text-right">单位性质</th>
              <td>{{organType}}</td>
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
              <th class="f-text-right">拟申请调配办公 用房面积
              </th>
              <td colspan="3">{{applyArea ? applyArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">申请原因</th>
              <td colspan="3">{{applyReason}}</td>
            </tr>
            <tbody v-for="(item, index) in hasCommontHis" :key="index">
              <tr>
                <th class="f-text-right">审批人</th>
                <td>{{item.userName}}</td>
                <th class="f-text-right">审批意见</th>
                <td>{{item.flowLabel}}</td>
              </tr>
              <tr>
                <th class="f-text-right">备注</th>
                <td colspan="3">{{item.comment || ''}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">单位名称</th>
              <td>{{allocatePlan.checkArea || ''}}
              </td>
              <th class="f-text-right">批复编制人数</th>
              <td>{{allocatePlan.checkUserNum || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">核定办公室使用面积</th>
              <td>{{allocatePlan.planOfficeAddress || ''}}
              </td>
              <th class="f-text-right">核定服务用房使用面积</th>
              <td>{{allocatePlan.remark || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">核定设备用房使用面积</th>
              <td>{{allocatePlan.planOfficeAddress || ''}}
              </td>
              <th class="f-text-right">核定基本办公用房使用面积</th>
              <td>{{allocatePlan.remark || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">附属用房建筑面积</th>
              <td>{{allocatePlan.planOfficeAddress || ''}}
              </td>
              <th class="f-text-right">总建筑面积</th>
              <td>{{allocatePlan.remark || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">配置方式</th>
              <td>{{allocatePlan.planOfficeAddress || ''}}
              </td>
              <th class="f-text-right">备注</th>
              <td>{{allocatePlan.remark || ''}}</td>
            </tr>
          </table>
          <h2 class="h-table-subtitle" style="margin: 10px 0;">
            <span></span>方案明细
          </h2>
          <div class="h-table f-relative">
            <el-table :data="roomBaseResponseList" stripe style="width: 100%">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="院落" prop="courtyardName"></el-table-column>
              <el-table-column label="楼座" prop="floorName"></el-table-column>
              <el-table-column label="楼层" prop="storeysName"></el-table-column>
              <el-table-column label="房间号" prop="roomNo"></el-table-column>
              <el-table-column label="使用面积（㎡）" prop="userArea"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='history'">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in allCommontHis" :key="index" :timestamp="returnDataFormat(item.time)" placement="top">
              <el-card>
                <span class="z-state" :class="item.result?'s-state-apply':'s-state-fail'">{{item.result?item.result:'待审批'}}</span>
                <h4>{{item.result?'提交人':'审批人'}}：{{item.userId}}</h4>
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
                <!-- <a :href="scope.row.location" target="_blank" download>下载</a> -->
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
      organType: '', // 单位性质 
      organName: '',// 单位名称
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
      statuslevel: 1,
      allocatePlan: {},
      roomBaseResponseList: []
    };
  },
  activated() { },
  methods: {
    returnDataFormat(value) {
      if (value) {
        return `${value.substr(0, 4)}/${value.substr(5, 2)}/${value.substr(8, 2)}`
      } else {
        return ''
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.getDataRequest(id)
    },
    getDataRequest(id) {
      let params = {
        id: id,
      }
      this.$axiosGet(API.officeapply_getDetail, params).then(res => {
        this.organName = res.data.applyOrderDetail.organName;
        this.hasOfficeArea = res.data.applyOrderDetail.hasOfficeArea;
        this.organType = res.data.applyOrderDetail.organType;
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
          this.roomBaseResponseList = res.data.allocatePlan.roomBaseResponseList;
        } else {
          this.allocatePlan = {
            checkArea: '',
            planType: '',
            planOfficeAddress: '',
            remark: ''
          }
          this.roomBaseResponseList = [];
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

