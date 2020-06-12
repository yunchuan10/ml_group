<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="数据上报"></Y-Breadcrumb>
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
              <th><span class="f-color-red">*</span>地址坐落</th>
              <td>
                <el-form-item prop="reportAddress" :rules="{required: true, message: '地址坐落不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAddress" placeholder="请输入地址坐落" clearable></el-input>
                </el-form-item>
              </td>
              <th><span class="f-color-red">*</span>行政区划代码</th>
              <td>
                <el-form-item prop="reportAreaCode" :rules="{required: true, message: '行政区划代码不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAreaCode" placeholder="请输入行政区划代码" clearable :maxlength="12"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th><span class="f-color-red">*</span>用地面积</th>
              <td>
                <el-form-item prop="reportLandArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportLandArea" placeholder="请输入用地面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th><span class="f-color-red">*</span>总建筑面积</th>
              <td>
                <el-form-item prop="reportAllBuildArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAllBuildArea" placeholder="请输入总建筑面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th><span class="f-color-red">*</span>权属登记情况</th>
              <td>
                <el-form-item prop="reportOwnerStatus" :rules="{required: true, message: '权属登记情况不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.reportOwnerStatus" placeholder="请选择权属登记情况" clearable style="width: 100%;">
                    <el-option v-for="(item, index) in ownerStatus" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th><span class="f-color-red">*</span>建设年代</th>
              <td>
                <el-form-item prop="reportBuildDate" :rules="{required: true, message: '建设年代不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.reportBuildDate" type="year" clearable placeholder="请选择建设年代" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="reportRemark">
                  <el-input v-model="ruleForm.reportRemark" :maxlength="200" type="textarea" :rows="5" placeholder="请输入备注"></el-input>
                  <div class="f-text-right">{{ruleForm.reportRemark.length}}/200</div>
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
              <th><span class="f-color-red">*</span>单位名称</th>
              <th style="width:60px;">操作</th>
            </tr>
            <tr v-for="(useOrganStrings, index) in ruleForm.useOrganStrings" :key="index">
              <td class="f-text-center">{{index + 1}}</td>
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
          <router-link to="/report-manage/report/technology-house">
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
      ownerStatus: [],
      ruleForm: {
        reportAddress: '',
        reportAreaCode: '',
        reportLandArea: '',
        reportAllBuildArea: '',
        reportOwnerStatus: '',
        reportBuildDate: '',
        reportRemark: '',
        useOrganStrings: [
          {
            reportOrganName: ''
          }
        ]
      }
    }
  },
  activated() {
    this.ruleForm = {
      reportAddress: '',
      reportAreaCode: '',
      reportLandArea: '',
      reportAllBuildArea: '',
      reportOwnerStatus: '',
      reportBuildDate: '',
      reportRemark: '',
      useOrganStrings: [
        {
          reportOrganName: ''
        }
      ]
    }
    this.getPic();
    if (this.$route.query.id) {
      this.getDetail()
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
  },
  computed: {
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    }
  },
  methods: {
    getDetail() {
      let params = {
        id: this.$route.query.id
      }
      this.$axiosGet(API.report_getReportTechHouseDetail, params).then(res => {
        this.ruleForm.reportAddress = res.data.reportTechHouse.reportAddress;
        this.ruleForm.reportAreaCode = res.data.reportTechHouse.reportAreaCode;
        this.ruleForm.reportLandArea = res.data.reportTechHouse.reportLandArea;
        this.ruleForm.reportAllBuildArea = res.data.reportTechHouse.reportAllBuildArea;
        this.ruleForm.reportOwnerStatus = res.data.reportTechHouse.reportOwnerStatus;
        this.ruleForm.reportBuildDate = new Date(res.data.reportTechHouse.reportBuildDate);
        this.ruleForm.reportRemark = res.data.reportTechHouse.reportRemark;
        this.ruleForm.useOrganStrings = [];
        res.data.reportTechHouse.useOrganResponseList.forEach((item) => {
          this.ruleForm.useOrganStrings.push({
            reportOrganName: item.reportOrganName
          })
        })
      })
    },
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'OWNER_STATUS'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.ownerStatus = res.data.OWNER_STATUS;
        }
      })
    },
    // 面积表单验证
    areaValidatePass(rule, value, callback) {
      let message = '';
      if (rule.fullField == 'reportLandArea') {
        message = '用地面积';
      } else if (rule.fullField == 'reportAllBuildArea') {
        message = '总建筑面积';
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
    addOrgan() {
      this.ruleForm.useOrganStrings.push({
        organName: ''
      })
    },
    removeOrgan(index) {
      this.ruleForm.useOrganStrings.splice(index, 1)
    },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let params = {
            dataReportOrderId: this.dataReportOrderId,
            reportAddress: this.ruleForm.reportAddress,
            reportAreaCode: this.ruleForm.reportAreaCode,
            reportLandArea: this.ruleForm.reportLandArea,
            reportAllBuildArea: this.ruleForm.reportAllBuildArea,
            reportOwnerStatus: this.ruleForm.reportOwnerStatus,
            reportBuildDate: DATEFORMAT.dateReturnY(this.ruleForm.reportBuildDate),
            reportRemark: this.ruleForm.reportRemark,
            reportUseOrganRequestList: (this.ruleForm.useOrganStrings)
          }
          if (this.$route.query.id) {
            this.$set(params, 'id', this.$route.query.id)
          }
          this.$axiosJsonPost(API.report_addReportTechHouse, params).then(res => {
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
        this.$router.push({ path: '/report-manage/report/technology-house' })
      }
    }
  }
}
</script>