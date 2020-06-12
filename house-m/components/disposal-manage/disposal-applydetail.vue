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
                <span v-show="applydetailList.startingPrice != null">{{applydetailList.startingPrice}}万元</span>
              </td>
              <th class="f-text-right">保证金</th>
              <td colspan="3">
                <span v-show="applydetailList.deposit != null">{{applydetailList.deposit}}万元</span>
              </td>
            </tr>
            <tr v-if="handleTypeName =='拍卖'">
              <th class="f-text-right">增价幅度</th>
              <td colspan="3">
                <span v-show="applydetailList.priceIncreaseRange != null">{{applydetailList.priceIncreaseRange}}万元</span>
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
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
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
            <el-table-column prop="estimatePrice" key="estimatePrice" label="评估租金（元/月/平米）" v-if="handleTypeName =='出租'">              
            </el-table-column>
            <el-table-column prop="leaseTerm" key="leaseTerm" label="租赁期限（年）" v-if="handleTypeName =='出租'">            
            </el-table-column>
            <el-table-column prop="houseEstimateBuildAreaOfUnivalent" key="houseEstimateBuildAreaOfUnivalent" label="房屋评估建筑面积单价(万元/㎡)" v-if="handleTypeName =='拍卖'">
            </el-table-column>
            <el-table-column prop="planPurpose" key="planPurpose" fixed="right" label="规划用途" v-if="handleTypeName =='出租'">            
            </el-table-column>
            <el-table-column prop="totalPrice" key="totalPrice" fixed="right" label="总价（万元）" v-if="handleTypeName =='拍卖'">             
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
                <p v-show='item.flowLabel ==="已通过" || item.flowLabel ==="已驳回" || item.flowLabel ==="退回"'>备注：{{item.comment || '待审批'}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="h-tab-content" v-show="pageSelect == 'file'">
          <el-table :data="fileList" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_block">预览</a>
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
      active: 1,
      carDetailShow: false, // 弹出框开关
      handleApplyId: '', //申请单id
      itemName: '', //项目名称
      handleTypeName: '', //处置方式
      estimateMechanism: '', //评估机构
      estimateBaseDate: '', //评估基准日
      itemBudget: '',//项目预算
      itemAddress: '', //项目地点
      itemSchedule: '', //项目工期
      manageOrganName: '', //管理单位
      purpose: '', //用途
      startingPrice: '', // 起拍价
      deposit: '', //保证金
      priceIncreaseRange: '', // 增价幅度
      roomId: '', //房间id
      roomNo: '', //房间号
      buildArea: '', //建筑面积
      userArea: '', //使用面积
      roomAddress: '', //房间位置
      estimatePrice: '', //评估价
      leaseTerm: '', //租赁期限
      planPurpose: '', // 规划用途
      houseEstimateBuildAreaOfUnivalent: '', //房屋评估建筑面积单价 
      totalPrice: '', //总价
      remark: '', // 备注
      taskId: '', //任务id
      formKey: '', //流程
      name: '', // 文件名
      url: '', //文件路径
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      id: '',
      list: [], // table2列表数据集合
      pageSelect: "",
      imgUrl: [], // 院落数据图片
      applydetailList: [], //详情集合
      roomDetailList: [], //房间明细
      fileList: [], //文件附件
      personList: [], //人员信息
      orderStatus: '', //订单状态
      disposalOfPerform: '', //处置执行状态
      createdAt: '' // 订单日期
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.getDataRequest(id)
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
    // 订单状态类
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
    getDataRequest(id) {
      let params = {
        handleApplyId: id
      };
      this.$axiosGet(API.handleapply_detail, params).then(res => {
        if (res.data) {
          this.applydetailList = res.data.handleApplyResponse;
          this.roomDetailList = res.data.handleApplyResponse.handleHouseDetailResponseList;
          if (res.data.commentBOList) {
            this.personList = res.data.commentBOList;
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
          this.orderStatus = res.data.handleApplyResponse.orderStatus;
          this.disposalOfPerform = res.data.handleApplyResponse.disposalOfPerform
        }
        if (this.roomDetailList) {
          this.roomDetailList.forEach((item, index) => {
            this.roomDetailList[index].num = index + 1;
          });
        }
        this.list = this.roomDetailList
      });
    },
  }
};
</script>

<style lang="scss">
</style>

