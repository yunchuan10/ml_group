<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow" :before-colse='handleClose'>
      <div class="u-detail-dialog-header" slot="title">
        <span>审批</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <p class="u-detail-p">申请单号：{{applydetailList.orderNo}}</p>
          <p class="u-detail-p">申请提交时间：{{createdAt}}</p>
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <td colspan="4" class="f-cancel-border">
                  <h2 class="h-table-subtitle">
                    <span></span>办公用房处置利用申请单</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">项目名称</th>
                <td>{{applydetailList.itemName}}</td>
                <th class="f-text-right">处置方式</th>
                <td>{{applydetailList.handleTypeName}}</td>
              </tr>
              <tr v-if="applydetailList.handleTypeName == '拍卖'">
                <th class="f-text-right">起拍价</th>
                <td>{{applydetailList.startingPrice ? applydetailList.startingPrice+'万元':''}}</td>
                <th class="f-text-right">保证金</th>
                <td>{{applydetailList.deposit ? applydetailList.deposit+'万元':''}}</td>
              </tr>
              <tr v-if="applydetailList.handleTypeName == '拍卖'">
                <th class="f-text-right">增价幅度</th>
                <td colspan="3">{{applydetailList.priceIncreaseRange ? applydetailList.priceIncreaseRange+'万元':''}}</td>
              </tr>
              <tr v-if="applydetailList.handleTypeName == '转换用途'">
                <th class="f-text-right">管理单位</th>
                <td>{{applydetailList.manageOrganName}}</td>
                <th class="f-text-right">用途</th>
                <td>{{applydetailList.purpose}}</td>
              </tr>
              <tr v-if="applydetailList.handleTypeName == '拆除'">
                <th class="f-text-right">项目预算</th>
                <td>{{applydetailList.itemBudget ? applydetailList.itemBudget+'万元':''}}</td>
                <th class="f-text-right">项目地点</th>
                <td>{{applydetailList.itemAddress}}</td>
              </tr>
              <tr v-if="applydetailList.handleTypeName == '拆除'">
                <th class="f-text-right">项目工期</th>
                <td colspan="3">{{applydetailList.itemSchedule ? applydetailList.itemSchedule+'天':''}}</td>
              </tr>
              <tr v-if="applydetailList.handleTypeName =='出租'">
                <th class="f-text-right">评估机构</th>
                <td>{{applydetailList.estimateMechanism}}</td>
                <th class="f-text-right">评估基准日</th>
                <td>{{estimateBaseDate}}</td>
              </tr>
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <div v-for='(item,index) in fileList' :key='index'>
                    <a>{{item.name}}</a>
                    <a class="u-download" target="_block" :href="item.url" download>预览</a>
                  </div>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">备注</th>
                <td colspan="3">{{applydetailList.remark}}</td>
              </tr>             
            </table>
            <h2 class="h-table-subtitle f-margin-upd">
              <span></span>拟处置房屋明细</h2>
            <el-table :data="list" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" label="序号" width="50">
                <template slot-scope="scope">
                  {{scope.row.num}}
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
              <el-table-column prop="houseEstimateBuildAreaOfUnivalent" label="房屋评估建筑面积单价（万元/㎡）" key="houseEstimateBuildAreaOfUnivalent" v-if="applydetailList.handleTypeName =='拍卖'  || handleTypeName =='拆除'">
              </el-table-column>
              <el-table-column prop="estimatePrice" label="评估租金（元/月/平米）" key="estimatePrice" v-if="applydetailList.handleTypeName =='出租'">
              </el-table-column>
              <el-table-column prop="leaseTerm" label="租赁期限（年）" key="leaseTerm" v-if="applydetailList.handleTypeName =='出租'">
              </el-table-column>
              <el-table-column prop="planPurpose" label="规划用途" key="planPurpose" v-if="applydetailList.handleTypeName =='出租'">
              </el-table-column>
              <el-table-column prop="totalPrice" label="总价（万元）" key="totalPrice" v-if="applydetailList.handleTypeName =='拍卖'">
              </el-table-column>
            </el-table>
            <table class="h-table-info">
              <tr class="filling">
                <td colspan="4"></td>
              </tr>
              <tr class="status">
                <th>审批结果</th>
                <td colspan="3">
                  <template>
                    <el-radio-group v-model="ruleForm.checkStatus">
                      <el-radio label="YES">审批通过</el-radio>
                      <el-radio label="NO">审批不通过</el-radio>
                    </el-radio-group>
                  </template>
                </td>
              </tr>
              <tr class="status" v-if="ruleForm.checkStatus === 'NO'">
                <th>
                  <i class="f-color-red">*</i>备注</th>
                <td colspan="3">
                  <el-form-item prop="messageFee">
                    <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.messageFee" placeholder="请输入备注"> </el-input>
                    <div style="text-align: right;">{{ruleForm.messageFee.length}}/200</div>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </div>
      <div class="el-dialog__footer">
        <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getSaveDataRequest">保存</el-button>
      </div>
    </el-dialog>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      isBol: false,
      message: '',
      YPromptShow: false, // 操作成功提示框是否显示
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
      priceIncreaseRange: '', // 增加幅度
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
      procInstId: '', //流程id
      taskName: '', //任务名称
      formKey: null, //流程
      name: '', // 文件名
      url: '', //文件路径
      carDetailShow: false, // 弹出框开关
      list: [], //数据集合
      applydetailList: [], //申请单详情集合
      roomDetailList: [], //房间集合
      personList: [], //审批人员信息
      fileList: [], //附件集合
      createdAt: '',//申请日期
      ruleForm: {
        checkStatus: 'YES',
        messageFee: '', //备注
      },
      rules: {
        messageFee: [{ required: true, message: '请填写备注', trigger: 'change' }]
      }
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.handleApplyId = id;
      this.getDataRequest(id);
      this.carDetailShow = true;
    },
    //审批详情回显
    getDataRequest() {
      let params = {
        handleApplyId: this.handleApplyId,
        businessCode: 'HOUSE_HANDLE',
      }
      this.$axiosGet(API.handleapply_getApprovalApplyDetailList, params).then(res => {
        if (res.data) {
          this.applydetailList = res.data.handleApplyResponse;
          this.fileList = res.data.fileResponseAdapterList;
          this.roomDetailList = res.data.handleApplyResponse.handleHouseDetailResponseList;
          if (res.data.handleApplyResponse.estimateBaseDate) {
            this.estimateBaseDate = res.data.handleApplyResponse.estimateBaseDate.substr(0,10);
          } else {
            this.estimateBaseDate = ''
          }
          if (res.data.commontHis) {
            this.personList = res.data.commontHis;
          }
          if (res.data.handleApplyResponse.createdAt) {
            this.createdAt = res.data.handleApplyResponse.createdAt.substr(0,10);
          } else {
            this.createdAt = '';
          };
          if (this.applydetailList) {
            this.taskId = this.applydetailList.taskId;
            this.formKey = this.applydetailList.formKey;
            this.procInstId = this.applydetailList.procInstId;
          }
          let list = []
          list = this.roomDetailList;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1
            })
          }
          this.list = list;
        }
      });
    },
    //提交表单
    getSaveDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.handleApplyId,
            taskId: this.taskId, //任务id
            submitType: this.ruleForm.checkStatus, //提交审批类型(通过/驳回)
            message: this.ruleForm.messageFee, //审批意见
            procInstId: this.procInstId, //	流程实例
            formKey: this.formKey, //任务关键词
          }
          this.loading = true;
          this.$axiosJsonPost(API.handleapply_completeHandleApprovalTask, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '处置利用', '处置利用审批')
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          location.reload();
        })
        .catch(_ => { });
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.carDetailShow = false;
          this.$emit('update');
        }
      }, 1000)
    },
  }
};
</script>

<style lang="scss">
</style>

