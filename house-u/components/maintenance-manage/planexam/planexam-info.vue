<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" @close="pageSelect == 'plan'" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>审批</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <p class="u-detail-p">申请单号：{{applyDetailList.orderNo}}</p>
          <p class="u-detail-p">计划提交时间：{{createdAt}}</p>
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th>申请单位</th>
                <td>{{applyDetailList.applyOrganName}}
                </td>
                <th>计划年度</th>
                <td>{{planYear}}</td>
              </tr>
              <tr>
                <th>申请人</th>
                <td>{{applyDetailList.realName}}
                </td>
                <th>计划总额度</th>
                <td>{{applyDetailList.budgetTotalMoney?applyDetailList.budgetTotalMoney+'万元':''}}</td>
              </tr>
              <tr>
                <th>预算明细表</th>
                <td colspan="3">
                  <ul>
                    <li style="display: block;" v-for=" (item, index) in budgetDetailSchedules" :key="index">{{index+1}}、{{item.name}}
                      <a target="_blank" :href="item.url">下载</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">其他附件</th>
                <td colspan="3">
                  <ul>
                    <li style="display: block;" v-for=" (item, index) in otherAttachments" :key="index">{{index+1}}、{{item.name}}
                      <a target="_blank" :href="item.url">预览</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">备注</th>
                <td colspan="3">{{applyDetailList.remark}}</td>
              </tr>
              <tr class="filling">
                <td colspan="4"></td>
              </tr>
              <tr class="status">
                <th>审批结果</th>
                <td colspan="3">
                  <template>
                    <el-radio v-model="ruleForm.submitType" label="YES">审批通过</el-radio>
                    <el-radio v-model="ruleForm.submitType" label="NO">审批不通过</el-radio>
                  </template>
                </td>
              </tr>
              <tr class="status" v-if="ruleForm.submitType == 'NO'">
                <th>
                  <i class="f-color-red">*</i>备注</th>
                <td colspan="3">
                  <el-form-item prop="note">
                    <el-input type="textarea" v-model="ruleForm.note" :rows="3" :maxlength="200" placeholder="请输入备注"> </el-input>
                  </el-form-item>
                  <div style="text-align: right;">{{ruleForm.note.length}}/200</div>
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
      orderNo: '',
      createdAt: '', //计划提交时间
      applyOrganName: '', //申请单位
      applyOrganId: '', //申请单位id
      orderStatus: '', //状态
      realName: '', //申请人
      planYear: '', //计划年度
      carDetailShow: false, // 弹出框开关
      maintainPlanApplyId: '', // 申请单id
      budgetTotalMoney: '',
      userProcInstId: '',
      taskId: '', //任务id
      applyDetailList: {},
      budgetDetailSchedules: [], //明细表
      otherAttachments: [], //其他附件     
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      remark: '',
      ruleForm: {
        submitType: 'YES',
        note: ''
      },
      rules: {
        note: [{ required: true, message: '请填写备注', trigger: 'change' }]
      },
    };
  },
  activated() {

  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  methods: {
    // 初始化弹出框
    openModal(taskId, userProcInstId, id) {
      this.carDetailShow = true;
      this.taskId = taskId;
      this.maintainPlanApplyId = id;
      this.userProcInstId = userProcInstId;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      })
      this.getDataRequest()
    },
    //获取审批详情
    getDataRequest() {
      let params = {
        maintainPlanApplyId: this.maintainPlanApplyId,
        // organId: this.loginOrganId
      }
      this.$axiosGet(API.userplatform_getApprovalApplyDetailList, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.applyDetailList = res.data.maintainPlanApplyResponse;
          this.createdAt = res.data.maintainPlanApplyResponse.createdAt.substr(0,10);
          this.planYear = res.data.maintainPlanApplyResponse.planYear.substr(0,4);
          this.applyOrganId = res.data.maintainPlanApplyResponse.applyOrganId;
          if (res.data.budgetDetailScheduleList) {
            this.budgetDetailSchedules = res.data.budgetDetailScheduleList;
          }
          if (res.data.otherAttachmentList) {
            this.otherAttachments = res.data.otherAttachmentList;
          }
        }
      });
    },
    //  审批提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            planYear: this.planYear,
            orderNo: this.applyDetailList.orderNo,
            applyOrganId: this.applyOrganId,
            applyOrganName: this.applyDetailList.applyOrganName,
            orderStatus: this.orderStatus,
            id: this.maintainPlanApplyId,
            businessCode: 'HOUSE_REPAIR',
            submitType: this.ruleForm.submitType,
            taskId: this.taskId,
            userProcInstId: this.userProcInstId, //流程实例
            message: this.ruleForm.note, //审批意见
          }
          this.loading = true;
          this.$axiosJsonPost(API.userplatform_completeMaintainTask, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '房屋概览', '审批')
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
        this.$emit('update');
      }
    }
  }
};
</script>

<style lang="scss">
</style>

