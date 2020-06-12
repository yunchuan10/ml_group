<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="数据上报" :item="['数据上报']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>数据上报</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <h2 class="h-table-subtitle">
            <span></span>基础信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th>
                <span class="f-color-red">*</span>项目名称</th>
              <td>
                <el-form-item prop="reportProjectName" :rules="{required: true, message: '项目名称不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportProjectName" placeholder="请输入项目名称" clearable></el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>审批部门</th>
              <td>
                <el-form-item prop="reportAuditDept" :rules="{required: true, message: '审批部门不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAuditDept" placeholder="请输入审批部门" clearable :maxlength="12"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>建设单位</th>
              <td>
                <el-form-item prop="reportBuildCompany" :rules="{required: true, message: '建设单位不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportBuildCompany" placeholder="请输入建设单位" clearable :maxlength="12"></el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>地址坐落</th>
              <td>
                <el-form-item prop="reportAddress" :rules="{required: true, message: '地址坐落不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAddress" placeholder="请输入地址坐落" clearable></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>建设规模</th>
              <td>
                <el-form-item prop="reportBuildSize" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportBuildSize" placeholder="请输入建设规模" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>估算投资</th>
              <td>
                <el-form-item prop="reportCost" :rules="{validator: moneyValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportCost" placeholder="请输入估算投资" clearable>
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="reportRemark">
                  <el-input v-model="ruleForm.reportRemark" type="textarea" :rows="5" placeholder="请输入备注"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
          <h2 class="h-table-subtitle">
            <span></span>使用单位信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th style="width:60px;">序号</th>
              <th>
                <span class="f-color-red">*</span>单位名称</th>
              <th style="width:60px;">操作</th>
            </tr>
            <tr v-for="(useOrganStrings, index) in  ruleForm.useOrganStrings" :key="index">
              <td class="f-text-center">{{index+1}}</td>
              <td>
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportOrganName'" :rules="{required: true, message: '单位名称不能为空', trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportOrganName" placeholder="请输入单位名称"></el-input>
                </el-form-item>
              </td>
              <td class="f-text-center">
                <a v-if="index == 0" class="iconfont icon-tianjia" @click="addOrgan"></a>
                <a v-else class="iconfont icon-circle-remove" @click="removeOrgan(index)"></a>
              </td>
            </tr>
          </table>
        </el-form>
        <div class="table-bottom-btns f-hidden">
          <router-link to="/report-manage/report/construction-project">
            <el-button class="u-submit-btn cancel-btn">取消</el-button>
          </router-link>
          <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitClick">保存</el-button>
        </div>
      </div>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      loading: false,
      ruleForm: {
        reportProjectName: '',
        reportAuditDept: '',
        reportBuildCompany: '',
        reportAddress: '',
        reportBuildSize: '',
        reportCost: '',
        reportRemark: '',
        useOrganStrings: [{
          reportOrganName: ''
        }]
      }
    }
  },
  computed: {
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.getDetail()
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    // 面积表单验证
    areaValidatePass(rule, value, callback) {
      let message = '';
      if (rule.fullField == 'reportBuildSize') {
        message = '建设规模';
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`));
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方米`));
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`));
      }
    },
    // 金额验证
    moneyValidatePass(rule, value, callback) {
      let message = '';
      if (rule.fullField == 'reportCost') {
        message = '估算投资';
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`));
        } else if (value > 100000000) {
          callback(new Error(`${message}不能大于一亿元`));
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`));
      }
    },
    addOrgan() {
      this.ruleForm.useOrganStrings.push({
        organName: ''
      })
    },
    removeOrgan(index) {
      this.ruleForm.useOrganStrings.splice(index, 1)
    },
    // 数据提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = {
            dataReportOrderId: this.dataReportOrderId,
            reportProjectName: this.ruleForm.reportProjectName, // 项目名称
            reportAuditDept: this.ruleForm.reportAuditDept, // 审批部门
            reportBuildCompany: this.ruleForm.reportBuildCompany, // 建设单位
            reportAddress: this.ruleForm.reportAddress, // 地址坐落
            reportBuildSize: this.ruleForm.reportBuildSize, // 建设规模
            reportCost: this.ruleForm.reportCost, // 估算投资
            reportRemark: this.ruleForm.reportRemark, // 备注
            reportUseOrganRequestList: (this.ruleForm.useOrganStrings)
          }
          if (this.$route.query.id) {
            this.$set(params, 'id', this.$route.query.id)
          }
          this.$axiosJsonPost(API.report_addReportBuildProject, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.push({ path: '/report-manage/report/construction-project' })
      }
    },
    // 获取详情
    getDetail() {
      let params = {
        id: this.$route.query.id
      }
      this.$axiosGet(API.report_getReportBuildProjectDetail, params).then(res => {
        this.ruleForm.reportProjectName = res.data.reportProjectName;
        this.ruleForm.reportAuditDept = res.data.reportAuditDept;
        this.ruleForm.reportBuildCompany = res.data.reportBuildCompany;
        this.ruleForm.reportAddress = res.data.reportAddress;
        this.ruleForm.reportBuildSize = res.data.reportBuildSize;
        this.ruleForm.reportCost = res.data.reportCost;
        this.ruleForm.reportRemark = res.data.reportRemark;

        this.ruleForm.useOrganStrings = [];
        res.data.useOrganResponseList.forEach((item) => {
          this.ruleForm.useOrganStrings.push({
            reportOrganName: item.reportOrganName
          })
        })
      })
    }
  }
}
</script>