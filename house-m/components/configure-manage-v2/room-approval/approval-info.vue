<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" @close="celarForm" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>审批</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <p class="u-detail-p">申请单号：{{orderNo}}</p>
          <p class="u-detail-p">申请提交时间：{{createdAt}}</p>
          <div class="h-tab-content" v-show="pageSelect == 'basic'">
            <table class="h-table-info">
              <tr>
                <th>单位名称</th>
                <td>{{organName}}
                </td>
                <th>单位类别</th>
                <td>{{organTypeName}}</td>
              </tr>
              <tr>
                <th>原办公地址</th>
                <td colspan="3">
                  <span v-for="(item, index) in organAddressList" :key="index">
                    <span v-show="index > 0">，</span> {{item}}</span>
                </td>
              </tr>
              <tr>
                <th>原办公用房面积</th>
                <td colspan="3" class="padding1">{{hasOfficeArea ? hasOfficeArea+'㎡': ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right padding2">人数统计</th>
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
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <ul>
                    <li style="display: block;" v-for=" (item, index) in fileResponseList" :key="index">{{index+1}}、{{item.name}}
                      <a target="_blank" :href="item.url">预览</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr class="filling">
                <td colspan="4"></td>
              </tr>
              <tr class="status">
                <th>审批结果</th>
                <td colspan="3">
                  <el-form-item prop="submitType">
                    <el-radio-group v-model="ruleForm.submitType">
                      <el-radio label="YES">审批通过</el-radio>
                      <el-radio label="NO">审批不通过</el-radio>
                    </el-radio-group>
                  </el-form-item>
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
              <tr class="status" v-if="ruleForm.submitType == 'YES'">
                <th>备注</th>
                <td colspan="3">
                  <el-input type="textarea" v-model="ruleForm.note" :rows="3" :maxlength="200" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.note.length}}/200</div>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </div>
      <div class="el-dialog__footer" v-if="pageSelect == 'basic'">
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
      orderNo: '', // 订单号
      createdAt: '', // 创建时间
      organTypeName: '', // 单位性质 
      organName: '',// 单位名称
      organAddressList: [], //地址集合
      hasOfficeArea: '',//原办公用房面积
      dutiesLevelResponseList: [],//人数统计集合
      dutyRealNum: 0,
      dutyCheckNum: 0,
      applyArea: '', //拟申请调配办公用房面积
      applyReason: '', // 申请原因
      fileResponseList: [],
      procInstId: '', // 任务id
      taskId: '', // 流程实例id
      formKey: '', // 制定调配方案
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      commontHis: [],
      ruleForm: {
        submitType: 'YES',
        scheme: '', //方案
        note: ''
      },
      rules: {
        note: [{ required: true, message: '请填写备注', trigger: 'change' }]
      },
      allocatePlan: {},
      roomBaseResponseList: []
    };
  },
  activated() {
    this.ruleForm.note = '';
  },
  methods: {
    celarForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 初始化弹出框
    openModal(id, formKey) {
      this.officeApplyId = id;
      this.formKey = formKey;
      if (this.formKey != '') {
        this.pageSelect = 'basic';
      }
      this.getDataRequest(id, formKey);
      this.carDetailShow = true;
    },
    //获取审批详情
    getDataRequest(id) {
      let params = {
        id: id,
        platForm: 'manageSystem',
      }
      this.$axiosGet(API.officeapply_getApplyDetail, params).then(res => {
        if (res.result == 'success' && res.data) {
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
          this.applyArea = res.data.applyOrderDetail.applyArea;
          this.applyReason = res.data.applyOrderDetail.applyReason;
          this.fileResponseList = res.data.applyOrderDetail.fileResponseList;
          this.orderNo = res.data.applyOrderDetail.orderNo;
          this.taskId = res.data.applyOrderDetail.taskId;
          this.procInstId = res.data.applyOrderDetail.procInstId;
          this.createdAt = res.data.applyOrderDetail.createdAt.substr(0, 10);
          this.commontHis = res.data.commontHis;
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
        }
      });
    },
    //  审批提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            platForm: 'manageSystem',
            id: this.officeApplyId,
            submitType: this.ruleForm.submitType,
            taskId: this.taskId,
            procInstId: this.procInstId,
            message: this.ruleForm.note || '',
            formKey: this.formKey
          }
          this.loading = true;
          this.$axiosJsonPost(API.officeapply_completeHouseOfficeTask, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '配置管理', '用房申请审批')
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

