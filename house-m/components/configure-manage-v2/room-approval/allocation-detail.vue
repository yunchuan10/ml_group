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
        <p class="u-detail-p">申请提交时间：{{createdAt}}</p>
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
                  <tr v-for="(item, index) in dutiesLevelResponseList" :key="index">
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
      createdAt: '', // 创建时间
      organTypeName: '', // 单位类别
      organName: '',// 单位名称
      approvedUserNum: '',//批复人数
      officeCheckArea: '',//核定办公用房面积
      serviceCheckArea: '',//服务设备用房面积
      equipCheckArea: '', //设备用房面积核定
      affiliatedCheckArea: '', //附属用房面积核定
      formkey: '', //调配方案
      remark: '',//备注
      planType: '',//配置类型 
      fileUrls: [], //附件集合        
      organAddressList: [], //地址集合
      hasOfficeArea: '',//原办公用房面积
      dutiesLevelResponseList: [],//人数统计集合
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
  activated() {
  },
  computed: {
    //基本核定面积
    basicArea() {
      let num = 0;
      num = parseFloat(Number(this.officeCheckArea) + Number(this.serviceCheckArea) + Number(this.equipCheckArea))
      return num;
    },
    totalArea() {
      let num = 0;
      num = parseFloat(this.basicArea / 0.65 + Number(this.affiliatedCheckArea))
      return num;
    }
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
    openModal(id, formkey) {
      this.carDetailShow = true;
      this.formkey = formkey;
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
          this.organAddressList = res.data.applyOrderDetail.organAddressList;
          this.dutiesLevelResponseList = res.data.applyOrderDetail.dutiesLevelResponseList;
          this.dutyCheckNum = 0;
          this.dutyRealNum = 0;
          this.dutiesLevelResponseList.forEach((item, index) => {
            this.dutyCheckNum += Number(item.dutyCheckNum);
            this.dutyRealNum += Number(item.dutyRealNum);
          })
          this.statuslevel = Number(res.data.applyOrderDetail.status + 1);
          this.applyArea = res.data.applyOrderDetail.applyArea;
          this.applyReason = res.data.applyOrderDetail.applyReason;
          this.hasCommontHis = res.data.hasCommontHis;
          this.allCommontHis = res.data.allCommontHis;
          this.allFile = res.data.allFile;
          this.orderNo = res.data.applyOrderDetail.orderNo;
          this.createdAt = res.data.applyOrderDetail.createdAt.substr(0, 10);
          if (res.data.allocatePlan) {
            this.allocatePlan = res.data.allocatePlan;
            this.organName = this.allocatePlan.organName;
            this.approvedUserNum = this.allocatePlan.approvedUserNum;
            this.officeCheckArea = this.allocatePlan.officeCheckArea;
            this.serviceCheckArea = this.allocatePlan.serviceCheckArea;
            this.equipCheckArea = this.allocatePlan.equipCheckArea;
            this.affiliatedCheckArea = this.allocatePlan.affiliatedCheckArea;
            this.planType = this.allocatePlan.planType;
            this.remark = this.allocatePlan.remark;
            this.fileUrls = this.allocatePlan.fileResponse;
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

