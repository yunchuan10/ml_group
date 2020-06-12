<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="计划申请" :item="['计划申请']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{msgType}}年度计划申请</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>申请单位</th>
              <td>{{organName}}
              </td>
              <th>
                <span class="f-color-red">*</span>计划年度</th>
              <td>
                <el-form-item prop="yearValue">
                  <el-date-picker v-model="ruleForm.yearValue" type="year" :picker-options="pickerBeginDateBefore" placeholder="选择年">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>计划总额度</th>
              <td>
                <el-form-item prop="budgetTotalMoney">
                  <el-input clearable v-model="ruleForm.budgetTotalMoney" placeholder="请输入计划总额度">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>预算明细表</th>
              <td>
                <el-form-item prop="domains">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传附件</el-button>
                  <ul>
                    <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                      <a target="_blank" :href="item.url">下载</a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>其他附件</th>
              <td colspan="3">
                <el-button class="u-upload-btn" @click="emptyOtherFileJson">
                  <i class="iconfont icon-daochu"></i>上传附件</el-button>
                <ul>
                  <li style="display: block;" v-for=" (item, index) in ruleForm.otherAttachments" :key="index">{{index+1}}、{{item.name}}
                    <a class="ahover" @click="deleteotherFileNameList(index)" style="margin: 0 10px;">删除</a>
                    <a target="_blank" :href="item.url">下载</a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-input clearable v-model="ruleForm.remark" type="textarea" :maxlength="200" placeholder="请输入申请备注"></el-input>
                <div class="f-text-right">{{ruleForm.remark.length}}/200</div>
              </td>
            </tr>
          </table>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/maintenance-manage/annualplan-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">提交</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" title="提示" :message="message" @click="YConfirmClick"></Y-Confirm>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
    <!--上传附件-->
    <v-upload ref="VUploadOther" :max="maxLength" @vueUpload="otherfileUploadRequest" accept="img"></v-upload>
  </div>
</template>
<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
import { setTimeout } from 'timers';
export default {
  components: {
    'v-upload': vuePopupUpload // 上传控件
  },
  data() {
    let budgetTotalMoney = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error('计划总额度为最多两位小数'))
        } else if (value > 1000000) {
          callback(new Error('计划总额度不能大于1000亿'))
        } else {
          callback();
        }
      } else {
        callback(new Error('计划总额度不能为空'))
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      loading: false,
      ruleForm: {
        yearValue: '', // 计划年度
        budgetTotalMoney: "", // 计划总额度
        otherAttachments: [], //其他附件
        remark: '',
        domains: [] //预算明细表
      },
      title: '',
      maintainPlanApplyId: '', //申请单id
      maxLength: 5, //附件最大的个数
      YConfirmShow: false,
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      msgType: '新增', // 当前页面状态 
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      rules: {
        yearValue: [
          { required: true, message: '计划年度不能为空', trigger: 'change' },
        ],
        domains: [
          { required: true, message: '预算明细表不能为空' },
        ],
        budgetTotalMoney: [
          { required: true, validator: budgetTotalMoney, trigger: 'change' },
        ]
      }
    };
  },
  activated() {
    if (this.$route.query.maintainPlanApplyId) {
      this.maintainPlanApplyId = this.$route.query.maintainPlanApplyId;
    }
    if (this.$route.params.type == 'edit') {
      this.getEditRequest();
      this.msgType = "修改"
    } else {
      this.msgType = "新增"
    }
  },
  deactivated() {
    this.ruleForm.domains = [];
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  watch: {
    'ruleForm.domains': function (val) {
      this.$refs.ruleForm.validateField(['domains'])
    }
  },
  created() {
    this.initYear()
  },
  computed: {
    organName() {
      return this.$store.state.mainData.organName;
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    }
  },
  methods: {
    fileUploadRequest(fileNameList) { // 文件上传回选
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
    },
    otherfileUploadRequest(fileList) { // 文件上传回选
      fileList.forEach(value => {
        this.ruleForm.otherAttachments.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.domains.length
    },
    deleteotherFileNameList(index) { // 删除附件
      this.ruleForm.otherAttachments.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.otherAttachments.length
    },
    emptyFileJson() { // 打开文件上传弹出框
      this.$refs.VUpload.openModal()
    },
    emptyOtherFileJson() { // 打开文件上传弹出框
      this.$refs.VUploadOther.openModal()
    },

    initYear() {
      let Year = new Date();
      this.ruleForm.yearValue = Year.setFullYear(Year.getFullYear() + 1);   //计划年度初始化 当前年的下一年
    },
    getEditRequest() {
      let params = {
        maintainPlanApplyId: this.maintainPlanApplyId
      }
      this.$axiosGet(API.userplatform_updateDetail, params).then(res => {
        if (res.data.maintainPlanApplyResponse) {
          this.ruleForm.yearValue = res.data.maintainPlanApplyResponse.planYear;
          this.ruleForm.budgetTotalMoney = res.data.maintainPlanApplyResponse.budgetTotalMoney;
          this.ruleForm.remark = res.data.maintainPlanApplyResponse.remark;
        }
        if (res.data.otherAttachmentList) {
          this.ruleForm.otherAttachments = [];
          res.data.otherAttachmentList.forEach((item) => {
            this.ruleForm.otherAttachments.push({
              name: item.name,
              url: item.url
            })
          })
        }
        if (res.data.budgetDetailScheduleList) {
          this.ruleForm.domains = [];
          res.data.budgetDetailScheduleList.forEach((item) => {
            this.ruleForm.domains.push({
              name: item.name,
              url: item.url
            })
          })
        }
      })
    },
    //提交申请单
    getAddDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.$route.query.maintainPlanApplyId) {
            this.YConfirmShow = true;
            this.message = '请注意，已撤回或已驳回的申请修改后再次提交，会重新生成一条新的申请单'
          } else {
            this.getSaveDataRequest();
          }
        }
      })
    },
    // 提示框确定按钮
    YConfirmClick() {
      this.getSaveDataRequest();
    },
    //提交申请单
    getSaveDataRequest() {
      let fileStrings = [];
      let otherfileString = [];
      this.ruleForm.domains.forEach((item, index) => {
        fileStrings.push({
          name: item.name,
          url: item.url
        })
      })
      this.ruleForm.otherAttachments.forEach((item, index) => {
        otherfileString.push({
          name: item.name,
          url: item.url
        })
      })
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            applyOrganId: this.loginOrganId, //（登录）申请单位id
            applyOrganName: this.organName,  //申请单位名称
            planYear: DATEFORMAT.dateReturnY(new Date(this.ruleForm.yearValue)), //计划年度
            budgetTotalMoney: this.ruleForm.budgetTotalMoney,
            budgetDetailScheduleRequestFile: fileStrings, //明细表
            otherRequestFile: otherfileString, // 其他附件
            remark: this.ruleForm.remark,
          }
          this.loading = true;
          let url = '';
          if (this.$route.params.type == 'add') {
            url = API.userplatform_doMaintainApply;
          } else {
            url = API.userplatform_doMaintainApplyUpdate;
          }
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type == 'add') {
                BURYINGPOINT.buryingPoint('办公用房', '房屋概览', '申请')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '房屋概览', '修改')
              }
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
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/maintenance-manage/annualplan-list')
        }
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
.iconfont {
  font-size: 12px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
</style>
