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
        <p class="u-detail-p">申请单号：{{applydetailList.orderNo}}</p>
        <p class="u-detail-p">申请提交时间：{{createdAt}}</p>
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>处置申请单</a>
          </li>
          <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>处置执行单</a>
          </li>
          <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
            <a>审批流程</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">项目名称</th>
              <td colspan="3">{{applydetailList.itemName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">处置方式</th>
              <td colspan="3">{{applydetailList.handleTypeName}}</td>
            </tr>
            <tr v-if="handleTypeName =='出租'">
              <th class="f-text-right">评估机构</th>
              <td>{{applydetailList.estimateMechanism}}</td>
              <th class="f-text-right">评估基准日</th>
              <td colspan="3">{{estimateBaseDate}}</td>
            </tr>
            <tr v-if="handleTypeName =='拆除'">
              <th class="f-text-right">项目预算</th>
              <td>{{applydetailList.itemBudget ? applydetailList.itemBudget+'万元':''}}</td>
              <th class="f-text-right">项目地点</th>
              <td colspan="3">{{applydetailList.itemAddress}}</td>
            </tr>
            <tr v-if="handleTypeName =='拆除'">
              <th class="f-text-right">项目工期</th>
              <td colspan="3">{{applydetailList.itemSchedule ? applydetailList.itemSchedule+'天':''}}</td>
            </tr>
            <tr v-if="handleTypeName =='拍卖'">
              <th class="f-text-right">起拍价</th>
              <td>
                <span v-show='applydetailList.startingPrice !=null'>{{applydetailList.startingPrice}}万元</span>
              </td>
              <th class="f-text-right">保证金</th>
              <td colspan="3">
                <span v-show='applydetailList.deposit !=null'>{{applydetailList.deposit}}万元</span>
              </td>
            </tr>
            <tr v-if="handleTypeName =='拍卖'">
              <th class="f-text-right">增价幅度</th>
              <td colspan="3">
                <span v-show='applydetailList.priceIncreaseRange !=null'>{{applydetailList.priceIncreaseRange}}万元</span>
              </td>
            </tr>
            <tr v-if="handleTypeName =='转换用途'">
              <th class="f-text-right">管理单位</th>
              <td>{{applydetailList.manageOrganName}}</td>
              <th class="f-text-right">用途</th>
              <td>{{applydetailList.purpose}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{applydetailList.remark || ''}}</td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border" style="padding: 0 0 5px 0;">
                <h2 class="h-table-subtitle">
                  <span></span>拟处置房屋明细</h2>
              </td>
            </tr>
          </table>
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column prop="roomNo" label="房间号">             
            </el-table-column>
            <el-table-column prop="roomAddress" label="房间位置">          
            </el-table-column>
            <el-table-column prop="buildArea" label="建筑面积（㎡）">
            </el-table-column>
            <el-table-column prop="useArea" label="使用面积（㎡）">
            </el-table-column>
            <el-table-column prop="estimatePrice" label="评估租金（元/月/平米）" :key="Math.random()" v-if="handleTypeName =='出租'">
            </el-table-column>
            <el-table-column prop="leaseTerm" label="租赁期限（年）" v-if="handleTypeName =='出租'">
              <template slot-scope="scope">
                {{scope.row.leaseTerm}}
              </template>
            </el-table-column>
            <el-table-column prop="houseEstimateBuildAreaOfUnivalent" label="房屋评估建筑面积单价(万元/㎡)" v-if="handleTypeName =='拍卖'">
              <template slot-scope="scope">
                {{scope.row.houseEstimateBuildAreaOfUnivalent}}
              </template>
            </el-table-column>
            <el-table-column prop="planPurpose" fixed="right" label="规划用途" v-if="handleTypeName =='出租'">
              <template slot-scope="scope">
                {{scope.row.planPurpose}}
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" fixed="right" label="总价（万元）" v-if="handleTypeName =='拍卖'">
              <template slot-scope="scope">
                {{scope.row.totalPrice}}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='property'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">项目名称</th>
              <td>{{handlePerformList.itemName}}</td>
              <th class="f-text-right">处置方式</th>
              <td>{{handlePerformList.handleTypeName}}</td>
            </tr>
            <tr v-if="handleTypeName =='出租'">
              <th class="f-text-right">评估机构</th>
              <td>{{handlePerformList.estimateMechanism || ''}}</td>
              <th class="f-text-right">评估基准日</th>
              <td>{{estimateBaseDate}}</td>
            </tr>
            <tr v-if="handleTypeName =='拍卖'">
              <th class="f-text-right">拍卖人</th>
              <td>{{handlePerformList.patLetPerson}}</td>
              <th class="f-text-right">拍卖地点</th>
              <td>{{handlePerformList.auctionAddress}}</td>
            </tr>
            <tr v-if="handleTypeName =='转换用途'">
              <th class="f-text-right">管理单位</th>
              <td>{{handlePerformList.manageOrganName}}</td>
              <th class="f-text-right">转换用途</th>
              <td>{{handlePerformList.purpose}}</td>
            </tr>
            <tr v-if="handleTypeName =='拆除'">
              <th class="f-text-right">项目预算</th>
              <td>{{handlePerformList.itemBudget}}</td>
              <th class="f-text-right">项目地点</th>
              <td>{{handlePerformList.itemAddress}}</td>
            </tr>
            <tr v-if="handleTypeName =='拆除'">
              <th class="f-text-right">项目工期</th>
              <td>{{handlePerformList.itemSchedule}}</td>
              <th class="f-text-right">拆除单位</th>
              <td>{{handlePerformList.demolitionOrganName}}</td>
            </tr>
            <tr v-if="handleTypeName =='拆除'">
              <th class="f-text-right">拆除费用</th>
              <td>{{handlePerformList.demolitionFee ? handlePerformList.demolitionFee +'万元':''}}</td>
              <th class="f-text-right">投标工期</th>
              <td>{{handlePerformList.biddingPeriod ? handlePerformList.biddingPeriod +'天':''}}</td>
            </tr>
            <tr v-if="handleTypeName =='出租'">
              <th class="f-text-right">成交金额</th>
              <td colspan="3">{{handlePerformList.clinchDealMoney ? handlePerformList.clinchDealMoney+'万元':''}}</td>
            </tr>
            <tr v-if="handleTypeName =='拍卖'">
              <th class="f-text-right">拍卖日期</th>
              <td colspan="3">{{auctionDate}}</td>
            </tr>
            <tr v-if="handleTypeName =='转换用途'">
              <th class="f-text-right">转换日期</th>
              <td colspan="3">{{conversionDate}}</td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border" style="padding: 0px;">
                <h2 class="h-table-subtitle">
                  <span></span>已处置房屋明细</h2>
              </td>
            </tr>
          </table>
          <el-table :data="handleList" stripe style="width: 100%" :current-row-key='index'>
            <el-table-column prop="date" fixed="left" type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="roomNo" label="房间号">
            </el-table-column>
            <el-table-column prop="roomAddress" label="房间位置">
            </el-table-column>
            <el-table-column prop="buildArea" label="建筑面积（㎡）" width="120px">
            </el-table-column>
            <el-table-column prop="useArea" label="使用面积（㎡）" width="120px">
            </el-table-column>
            <el-table-column prop="whetherToRent" label="出租情况" :key="Math.random()" v-if="handleTypeName =='出租'">
              <template slot-scope="scope">
                {{scope.row.whetherToRent}}
              </template>
            </el-table-column>
            <el-table-column prop="lesseeName" label="承租人" :key="Math.random()" v-if="handleTypeName =='出租'">
              <template slot-scope='scope'>
                <span v-if="scope.row.whetherToRent == '已出租'">{{scope.row.lesseeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rentStartDate" label="出租开始日期" :key="Math.random()" v-if="handleTypeName =='出租'" :formatter="dateFormat">
            </el-table-column>
            <el-table-column prop="rentEndDate" label="出租结束日期" :formatter="dateFormat" :key="Math.random()" v-if="handleTypeName =='出租'">
            </el-table-column>
            <el-table-column prop="houseEstimateBuildAreaOfUnivalent" label="房屋评估建筑面积单价(万元/㎡)" v-if="handleTypeName =='拍卖'">
            </el-table-column>
            <el-table-column prop="totalPrice" label="总价(万元)" :key="Math.random()" v-if="handleTypeName =='拍卖'">
            </el-table-column>
            <el-table-column prop="whetherToAuction" label="拍卖情况" :key="Math.random()" v-if="handleTypeName =='拍卖'">
            </el-table-column>
            <el-table-column prop="receivePerson" label="受让人" :key="Math.random()" v-if="handleTypeName =='拍卖'">
            </el-table-column>
            <el-table-column prop="clinchDealMoney" label="成交金额（万元）" :key="Math.random()" v-if="handleTypeName =='拍卖'">
            </el-table-column>
            <el-table-column prop="whetherToTransformPurpose" label="房屋转换情况" :key="Math.random()" v-if="handleTypeName =='转换用途'">
            </el-table-column>
            <el-table-column prop="clinchDealPrice" fixed="right" label="租金（元/年）" :key="Math.random()" width='140px' v-if="handleTypeName =='出租'">
              <template slot-scope='scope'>
                <span v-if="scope.row.whetherToRent == '已出租'">{{scope.row.clinchDealPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="whetherToRemoved" fixed="right" label="拆除情况" width='140px' :key="Math.random()" v-if="handleTypeName =='拆除'">
            </el-table-column>
            <el-table-column prop="removedDate" fixed="right" label="拆除日期" width='140px' :formatter="dateFormat" :key="Math.random()" v-if="handleTypeName =='拆除'">
              <!-- <template slot-scope='scope'>
                <span v-if="scope.row.whetherToRemoved == '已拆除'">{{scope.row.removedDate}}</span>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='houseinfo'">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in personList" :key="index" :timestamp="item.createTime" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state" :class="checkStatus(item.flowLabel)">{{checkName(item.flowLabel)}}</span>
                </div>
                <h4>{{item.userName}}</h4>
                <p v-show='item.flowLabel ==="已通过" || item.flowLabel ==="已退回" || item.flowLabel ==="2"'>备注：{{item.comment || '待审批'}}</p>
              </el-card>
            </el-timeline-item>

            <!-- <el-timeline-item timestamp="2018-04-12 20:46" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state s-state-success">已通过</span>
                </div>
                <div class="margin-left100">审批人：王乐乐</div>
                <p>备注：审批已通过</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018-04-12 20:46" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state s-state-prohibited">已驳回</span>
                </div>
                <div class="margin-left100">审批人：王乐乐</div>
                <p>备注：审批已驳回</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018-04-12 20:46" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state s-state-caveat">待审批</span>
                </div>
                <div class="margin-left100">审批人：王乐乐</div>
              </el-card>
            </el-timeline-item> -->
          </el-timeline>
        </div>
        <div class="h-tab-content" v-show="pageSelect == 'file'">
          <el-table :data="fileList" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column prop="url" label="操作">
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
      handleApplyId: '', //申请单id
      itemName: '', //项目名称
      handleTypeName: '', //处置方式
      estimateMechanism: '', //评估机构
      createdAt: '', // 订单日期
      estimateBaseDate: '', //评估基准日
      itemBudget: '',//项目预算
      itemAddress: '', //项目地点
      itemSchedule: '', //项目工期
      manageOrganName: '', //管理单位
      purpose: '', //用途
      startingPrice: '', // 起拍价
      deposit: '', //保证金
      priceIncreaseRange: '', // 增加幅度
      roomId: '', //房间id
      roomNo: '', //房间号
      buildArea: '', //建筑面积
      userArea: '', //使用面积
      roomAddress: '', //房间位置
      estimatePrice: '', //评估价
      rentReservePrice: '', //租金低价
      leaseTerm: '', //租赁期限
      planPurpose: '', // 规划用途
      houseEstimateBuildAreaOfUnivalent: '', //房屋评估建筑面积单价 
      totalPrice: '', //总价
      clinchDealMoney: '', //成家金额
      whetherToRent: '', //是否出租
      lessee: '', //承租人
      index: 0,
      clinchDealPrice: '', //成交价格
      demolitionOrganName: '', // 拆除单位
      demolitionFee: '', //拆除费用
      biddingPeriod: '', //投标工期
      whetherToRemoved: '', //是否已拆除
      patLetPerson: '', //拍卖人
      auctionAddress: '', //拍卖地点
      auctionDate: '', //拍卖日期
      receivePerson: '', //受让人
      whetherToAuction: '', // 是否已拍卖
      conversionDate: '', // 转换日期
      whetherToTransformPurpose: '', // 是否已转换用途
      remark: '', // 备注
      taskId: '', //任务id
      taskName: '', //任务名称
      formKey: '', //流程
      name: '', // 文件名
      url: '', //文件路径

      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      listfile: [], //数据集合
      list: [], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      applydetailList: [], //处置申请单详情
      roomDetailList: [],
      fileList: [], //文件集合
      personList: [], //审批人员集合
      handlePerformList: {}, //处置执行单
      handleList: [], //处置执行单的表格集合
      pageSelect: "",
      orderStatus: '',
      disposalOfPerform: '', //处置状态
      courtyardName: '', // 院落数据名称
      courtyardAddress: '', // 院落数据地址
      imgUrl: [], // 院落数据图片

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.handleApplyId = id;
      this.getDataRequest()
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    checkStatus(value) {
      if (value) {
        return 's-state-apply'
      } else if (value == null || value == '') {
        return 's-state-fail'
      }
    },
    checkName(value) {
      if (value) {
        return value
      } else if (value == null || value == '') {
        return '待审批'
      }
    },
    checkHightlight(value, status) {
      if ((value == '0' || value == '-1') && status == 'NO') {
        return 1
      } else if ((value == '1' || value == '-2' || value == '2') && status == 'NO') {
        return 2
      } else if (value == '2' && status == 'YES') {
        return 3
      }
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    getDataRequest(id) {
      let params = {
        handleApplyId: this.handleApplyId
      };
      this.$axiosGet(API.handleapply_detail, params).then(res => {
        if (res.data) {
          //处置执行单
          this.handlePerformList = res.data.handlePerformResponseDetail; // 处置执行单详情
          if (res.data.handlePerformResponseDetail.handleHouseDetailResponseList) {
            this.handleList = res.data.handlePerformResponseDetail.handleHouseDetailResponseList;
          } else {
            this.handleList = []
          }
          if (res.data.handlePerformResponseDetail.conversionDate) {
            this.conversionDate = res.data.handlePerformResponseDetail.conversionDate.substr(0, 10);
          } else {
            this.conversionDate = ''
          }
          if (res.data.handlePerformResponseDetail.auctionDate) {
            this.auctionDate = res.data.handlePerformResponseDetail.auctionDate.substr(0, 10);
          } else {
            this.auctionDate = '';
          }
          //处置申请单
          this.applydetailList = res.data.handleApplyResponse;
          this.roomDetailList = res.data.handleApplyResponse.handleHouseDetailResponseList;
          if (res.data.commentBOList) {
            this.personList = res.data.commentBOList;
          } else {
            this.personList = [];
          }
          if (res.data.handleApplyResponse.createdAt) {
            this.createdAt = res.data.handleApplyResponse.createdAt.substr(0, 10);
          } else {
            this.createdAt = '';
          };
          if (res.data.handleApplyResponse.estimateBaseDate) {
            this.estimateBaseDate = res.data.handleApplyResponse.estimateBaseDate.substr(0, 10);
          } else {
            this.estimateBaseDate = '';
          }
          this.handleTypeName = this.applydetailList.handleTypeName;
          this.fileList = res.data.fileResponseAdapterList;
          this.orderStatus = this.applydetailList.orderStatus;
          this.disposalOfPerform = this.applydetailList.disposalOfPerform;
        }
        if (this.roomDetailList) {
          this.roomDetailList.forEach((item, index) => {
            this.roomDetailList[index].num = index + 1;
          });
        } else {
          this.roomDetailList = [];
        }
        this.list = this.roomDetailList
      });
    },
  }
};
</script>

<style lang="scss">
</style>

