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
          <div class="h-tab-content">
            <div class="f-margin-bottom">
              <span class="f-color-red">*
              </span> 提示：请将财政的审批意见进行补录。</div>
            <table class="h-table-info">
              <tr>
                <th class="f-text-center ">
                  <i class="f-color-red">*</i>审批时间</th>
                <td>
                  <el-form-item prop="applyTime">
                    <el-date-picker v-model="ruleForm.applyTime" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </td>
              <tr>
                <th class="f-text-center ">
                  <i class="f-color-red">*</i>审批人</th>
                <td>
                  <el-form-item prop="applyPerson">
                    <el-input clearable v-model="ruleForm.applyPerson" maxlength="10" placeholder="请输入审批人"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-center ">
                  <i class="f-color-red">*</i>附件</th>
                <td>
                  <el-form-item prop="domains">
                    <el-button class="u-upload-btn" @click="emptyFileJson">
                      <i class="iconfont icon-daochu"></i>上传附件
                    </el-button>
                    <ul>
                      <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                        <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                        <a target="_blank" :href="item.url">预览</a>
                      </li>
                    </ul>
                  </el-form-item>
                </td>
              </tr>
            </table>

            <table class="h-table-info">
              <tr class="filling">
                <td colspan="2"></td>
              </tr>
              <tr class="status">
                <th>
                  <i class="f-color-red">*</i>审批意见</th>
                <td>
                  <template>
                    <el-form-item prop="checkStatus">
                      <el-radio-group v-model="ruleForm.checkStatus">
                        <el-radio label="YES">审批通过</el-radio>
                        <el-radio label="NO">审批不通过</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </template>
                </td>
              </tr>
              <tr class="status">
                <th>
                  <i class="f-color-red">*</i>备注</th>
                <td>
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
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getRecording">保存</el-button>
      </div>
    </el-dialog>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    'v-upload': vuePopupUpload
  },
  data() {
    return {
      pageSelect: 'plan',
      maxLength: '200',
      loading: false,
      carDetailShow: false, // 弹出框开关
      orderNo: '', // 订单号
      fileUrls: [],
      dealRentApplyId: '',
      userProcInstId: '', // 任务id
      taskId: '', // 流程实例id
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      fileList: [], //文件附件
      ruleForm: {
        applyPerson: '', //审批人
        applyTime: '', //审批时间       
        domains: [],
        checkStatus: 'YES',
        messageFee: ''
      },
      rules: {
        applyTime: [{ required: true, message: '请输入审批时间', trigger: 'change' }],
        applyPerson: [{ required: true, message: '请输入审批人', trigger: 'change' }],
        checkStatus: [
          { required: true, message: '请选择审批意见', trigger: 'change' }
        ],
        domains: [
          { required: true, message: '请上传附件', trigger: 'change' }
        ],
        messageFee: [{ required: true, message: '请填写备注', trigger: 'change' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      allocatePlan: {},
      roomBaseResponseList: [],
      list: [] //虚拟
    };
  },
  computed: {
    userId() {
      return this.$store.state.mainData.userId;
    },
    realName() {
      return this.$store.state.mainData.realName;
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.dealRentApplyId = id;
      this.ruleForm.applyPerson = '';
      this.ruleForm.applyTime = '';
      this.ruleForm.messageFee = '';
      this.ruleForm.domains = [];
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      })
      this.carDetailShow = true;
    },
    fileUploadRequest(fileNameList) { // 文件上传回选
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.domains.length
    },
    emptyFileJson() { // 打开文件上传弹出框
      this.$refs.VUpload.openModal()
    },
    //申请补录
    getRecording() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            rentApplyId: this.dealRentApplyId,
            applyRealName: this.ruleForm.applyPerson,
            userId: this.userId,
            userName: this.realName,
            applyTime: FORMATGET.formatGET(this.ruleForm.applyTime).substr(0, 10),
            organId: this.loginOrganId, //登录单位id
            submitType: this.ruleForm.checkStatus,
            remark: this.ruleForm.messageFee,
            fileRequestList: this.ruleForm.domains
          }
          this.$axiosJsonPost(API.userplathouserent_doAdditionalRecording, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('经营性房产', '申请审批', '财政审批意见补录')
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

<style  lang="scss" scoped>
.h-tab-content {
  margin-top: 0 !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
</style>

