<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" @close="pageSelect == 'plan'" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow" :before-close="resetForm">
      <div class="u-detail-dialog-header" slot="title">
        <span>审批</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="h-tab-content">
            <table class="h-table-info">
              <h2 class="h-table-subtitle" style="margin: 10px 0;">
                <span></span>出租申请
              </h2>
              <tr>
                <th class="f-text-right">申请单位</th>
                <td colspan="1">{{rentalDetailList.applyOrganName}}</td>
                <th class="f-text-right">申请单位责任人</th>
                <td colspan="1">{{rentalDetailList.applyResponsible}}</td>
              </tr>
              <tr>
                <th class="f-text-right">经办人</th>
                <td>{{rentalDetailList.agentName}}</td>
                <th class="f-text-right">经办人电话</th>
                <td colspan="3">{{rentalDetailList.agentPhone}}</td>
              </tr>
              <tr>
                <th class="f-text-right">拟出租开始日期</th>
                <td>{{proposedRentStartDate}}</td>
                <th class="f-text-right">乙方支付租金方式</th>
                <td colspan="3">{{rentalDetailList.rentPayWayName}}</td>
              </tr>
              <tr>
                <th class="f-text-right">招租形式</th>
                <td>{{rentalDetailList.rentWayName}}</td>
                <th class="f-text-right">拟出租用途</th>
                <td colspan="3">{{rentalDetailList.proposedRentPurpose}}</td>
              </tr>
              <tr>
                <th class="f-text-right">拟出租年限</th>
                <td>
                  <span v-show='rentalDetailList.proposedRentYear != ""'>{{rentalDetailList.proposedRentYear}}年</span>
                </td>
                <th class="f-text-right">备注</th>
                <td>{{rentalDetailList.remark}}</td>
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
            </table>
            <table class="h-table-info">
              <tr>
                <td colspan="4" class="f-cancel-border">
                  <h2 class="h-table-subtitle">
                    <span></span>拟出租经营性房产明细</h2>
                </td>
              </tr>
            </table>
            <el-table :data="list" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" type="index" label="序号" width="50">
              </el-table-column>
              <el-table-column prop="street" label="街道">
              </el-table-column>
              <el-table-column prop="houseNo" label="门牌号">
              </el-table-column>
              <el-table-column prop="houseAddress" label="坐落位置">
              </el-table-column>
              <el-table-column prop="dealArea" label="经营面积（㎡）">
              </el-table-column>
              <el-table-column label="房屋状态" prop="houseStatusName">
              </el-table-column>
              <el-table-column label="合同结束日期" prop="contractEndDate" :formatter="dateFormat">
              </el-table-column>
              <el-table-column prop="estimateRentPrice" label="评估租金（元/月/平方米）">
              </el-table-column>
              <el-table-column prop="rentDeposit" label="租赁保证金">
              </el-table-column>
              <!-- <el-table-column prop="rentReservePrice" label="房屋产权/土地使用证号">
                <template slot-scope="scope">
                  {{scope.row.rentReservePrice}}
                </template>
              </el-table-column> -->
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
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitClick">保存</el-button>
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
      pageSelect: 'plan',
      loading: false,
      carDetailShow: false, // 弹出框开关
      rentalDetailList: {}, //详情获取
      houseDetailList: [], //房屋明细
      dealRentApplyId: '',
      manageProcInstId: '', // 任务id
      taskId: '', // 流程实例id
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      fileList: [], //文件附件
      proposedRentStartDate: '', // 拟出租日期
      ruleForm: {
        checkStatus: 'YES',
        messageFee: ''
      },
      rules: {
        messageFee: [{ required: true, message: '请填写备注', trigger: 'change' }]
      },
      list: [] //虚拟
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, manageProcInstId, taskId) {
      this.dealRentApplyId = id;
      this.manageProcInstId = manageProcInstId;
      this.taskId = taskId;
      this.getDataRequest();
      this.carDetailShow = true;
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    //获取审批详情
    getDataRequest(id) {
      let params = {
        rentApplyId: this.dealRentApplyId
      };
      this.$axiosGet(API.managehouserent_detail, params).then(res => {
        if (res.data) {
          this.rentalDetailList = res.data.rentApplyResponse;
          this.houseDetailList = res.data.rentApplyResponse.rentHouseDetailResponse;
          if (res.data.commentBOList) {
            this.personList = res.data.commentBOList;
          }
          if (res.data.rentApplyResponse.proposedRentStartDate) {
            this.proposedRentStartDate = res.data.rentApplyResponse.proposedRentStartDate.substr(0, 10);
          } else {
            this.proposedRentStartDate = '';
          };
          this.fileList = res.data.fileResponseAdapterList;
        }
        this.list = this.houseDetailList
      });
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    //  审批提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.dealRentApplyId,
            taskId: this.taskId,
            submitType: this.ruleForm.checkStatus,
            manageProcInstId: this.manageProcInstId,
            message: this.ruleForm.messageFee,
          }
          this.loading = true;
          this.$axiosJsonPost(API.managehouserent_completeMaintainTask, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('经营性房产', '申请审批', '出租申请审批')
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.carDetailShow = false;
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
        this.$emit('update');
      }
    }
  }
};
</script>

<style  lang="scss" scoped>
.h-tab-content {
  margin-top: 0 !important;
}
</style>

