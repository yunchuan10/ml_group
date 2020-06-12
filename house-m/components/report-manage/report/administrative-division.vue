<template>
  <div>
    <div class="h-tab-content">
      <el-form ref="ruleForm" :model="ruleForm">
        <table class="h-table-info">
          <tr>
            <th>
              <span class="f-color-red">*</span>行政区划名称
            </th>
            <td>
              <el-form-item prop="province" :rules="{required: true, message: '行政区划名称不能为空', trigger: 'change'}">
                <el-select :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.province" @change="getProvinceList(ruleForm.province, '1')" style="width:24%;margin-right:1.33%;" placeholder="请选择省">
                  <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.city" @change="getProvinceList(ruleForm.city, '2')" style="width:24%;margin-right:1.33%;" placeholder="请选择市">
                  <el-option v-for="(item, index) in cityList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.county" @change="getProvinceList(ruleForm.county, '3')" style="width:24%;margin-right:1.33%;" placeholder="请选择县">
                  <el-option v-for="(item, index) in countyList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.township" style="width:24%;" placeholder="请选择乡镇">
                  <el-option v-for="(item, index) in townshipList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <span class="f-color-red">*</span>行政区划级别
            </th>
            <td>
              <el-form-item prop="reportAreaLevel" :rules="{required: true, message: '行政区划级别不能为空', trigger: 'change'}">
                <el-select :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.reportAreaLevel" style="width:100%;" placeholder="请选择性质区划级别">
                  <el-option v-for="(item, index) in reportAreaLevelList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <span class="f-color-red">*</span>行政区划代码
            </th>
            <td>
              <el-form-item prop="reportAreaCode" :rules="{required: true, message: '行政区划代码不能为空', trigger: 'change'}">
                <el-input :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.reportAreaCode" placeholder="请输入行政区划代码"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <span class="f-color-red">*</span>填报人单位
            </th>
            <td>
              <el-form-item prop="reportOrganName" :rules="{required: true, message: '填报人单位不能为空', trigger: 'change'}">
                <el-input :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.reportOrganName" placeholder="请输入填报人单位"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <span class="f-color-red">*</span>填报人姓名
            </th>
            <td>
              <el-form-item prop="reportUserName" :rules="{required: true, message: '填报人姓名不能为空', trigger: 'change'}">
                <el-input :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.reportUserName" placeholder="请输入填报人姓名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <span class="f-color-red">*</span>电话
            </th>
            <td>
              <el-form-item prop="reportPhone" :rules="[{required: true, message: '电话不能为空', trigger: 'change'},{ pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的电话', trigger: 'change' }]">
                <el-input :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.reportPhone" placeholder="请输入电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <span class="f-color-red">*</span>填报日期
            </th>
            <td>
              <el-form-item prop="reportDate" :rules="{required: true, message: '填报日期不能为空', trigger: 'change'}">
                <el-date-picker :disabled="reportOperatStatus === 'detail'" clearable v-model="ruleForm.reportDate" type="date" style="width:100%;" placeholder="请选择填报日期"></el-date-picker>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
      <div class="table-bottom-btns f-hidden" v-show="reportOperatStatus !== 'detail'">
        <router-link to="/report-manage/report-list">
          <el-button class="u-submit-btn cancel-btn">取消</el-button>
        </router-link>
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitClick">保存</el-button>
      </div>
    </div>
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
        province: '',
        city: '',
        county: '',
        township: '',
        reportAreaLevel: '', //行政区划级别
        reportAreaCode: '', //行政区划代码
        reportOrganName: '', //填报人单位名称
        reportUserName: '', //填报人
        reportPhone: '', //电话
        reportDate: '' //填报日期
      },
      provinceList: [],
      cityList: [],
      countyList: [],
      townshipList: [],
      reportAreaLevelList: [],
      orderId: ''
    }
  },
  activated() {
    this.getDetail();
    this.getPic();
    this.getProvinceList('0100');
    this.$store.commit('reportPageStatusMutations', '1');
  },
  computed: {
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    },
    reportOperatStatus() {
      return this.$store.state.mainData.reportOperatStatus;
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    // 获取地区初始列表
    getProvinceList(value, level) {
      let areaId = '';
      if (value) {
        areaId = value
      } else {
        areaId = ''
      }
      if (areaId) {
        let params = {
          id: areaId
        }
        this.$axiosGet(API.report_getArea, params).then(res => {
          if (res.result == 'success') {
            if (res.data.length > 0) {
              if (res.data[0].level == '1') {
                this.provinceList = res.data || [];
                this.ruleForm.city = '';
                this.ruleForm.county = '';
                this.ruleForm.township = '';
                this.cityList = [];
                this.countyList = [];
                this.townshipList = [];
              } else if (res.data[0].level == '2') {
                this.cityList = res.data || [];
                this.ruleForm.city = '';
                this.ruleForm.county = '';
                this.ruleForm.township = '';
                this.countyList = [];
                this.townshipList = [];
              } else if (res.data[0].level == '3') {
                this.countyList = res.data || [];
                this.ruleForm.county = '';
                this.ruleForm.township = '';
                this.townshipList = [];
              } else {
                this.townshipList = res.data || [];
                this.ruleForm.township = '';
              }
            }
          }
        })
      } else {
        if (level == '1') {
          this.ruleForm.city = '';
          this.ruleForm.county = '';
          this.ruleForm.township = '';
          this.cityList = [];
          this.countyList = [];
          this.townshipList = [];
        } else if (level == '2') {
          this.ruleForm.county = '';
          this.ruleForm.township = '';
          this.countyList = [];
          this.townshipList = [];
        } else if (level == '3') {
          this.ruleForm.township = '';
          this.townshipList = [];
        }
      }
    },
    // 详情获取地区
    getNextArea(areaId) {
      let params = {
        id: areaId
      }
      this.$axiosGet(API.report_getArea, params).then(res => {
        if (res.result == 'success') {
          if (res.data.length > 0) {
            if (res.data[0].level == '1') {
              this.provinceList = res.data || [];
            } else if (res.data[0].level == '2') {
              this.cityList = res.data || [];
            } else if (res.data[0].level == '3') {
              this.countyList = res.data || [];
            } else {
              this.townshipList = res.data || [];
            }
          }
        }
      })
    },
    YPromptClick() {

    },
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'AREA_LEVEL'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.reportAreaLevelList = res.data.AREA_LEVEL;
        }
      })
    },
    getDetail() {
      let params = {
        dataReportOrderId: this.dataReportOrderId
      }
      this.$axiosGet(API.report_getReportAreaDetail, params).then(res => {
        if (res.result == 'success') {
          if (res.data.reportAreaDetail) {
            this.ruleForm.reportOrganName = res.data.reportAreaDetail.reportOrganName || '';
            this.orderId = res.data.reportAreaDetail.id || '';
            this.ruleForm.reportAreaLevel = res.data.reportAreaDetail.reportAreaLevel || '';
            this.ruleForm.reportAreaCode = res.data.reportAreaDetail.reportAreaCode || '';
            this.ruleForm.reportUserName = res.data.reportAreaDetail.reportUserName || '';
            this.ruleForm.reportPhone = res.data.reportAreaDetail.reportPhone || '';
            this.ruleForm.reportDate = res.data.reportAreaDetail.reportDate ? new Date(res.data.reportAreaDetail.reportDate) : '';
            res.data.reportAreaDetail.parentIdList.unshift(res.data.reportAreaDetail.reportAreaId);
            res.data.reportAreaDetail.parentIdList.forEach((item) => {
              this.getNextArea(item);
            })
            if (res.data.reportAreaDetail.parentIdList.length == 1) {
              this.ruleForm.province = res.data.reportAreaDetail.parentIdList[0];
              this.ruleForm.city = '';
              this.ruleForm.county = '';
              this.ruleForm.township = '';
            } else if (res.data.reportAreaDetail.parentIdList.length == 2) {
              this.ruleForm.province = res.data.reportAreaDetail.parentIdList[1];
              this.ruleForm.city = res.data.reportAreaDetail.parentIdList[0];
              this.ruleForm.county = '';
              this.ruleForm.township = '';
            } else if (res.data.reportAreaDetail.parentIdList.length == 3) {
              this.ruleForm.province = res.data.reportAreaDetail.parentIdList[2];
              this.ruleForm.city = res.data.reportAreaDetail.parentIdList[1];
              this.ruleForm.county = res.data.reportAreaDetail.parentIdList[0];
              this.ruleForm.township = '';
            } else if (res.data.reportAreaDetail.parentIdList.length == 4) {
              this.ruleForm.province = res.data.reportAreaDetail.parentIdList[3];
              this.ruleForm.city = res.data.reportAreaDetail.parentIdList[2];
              this.ruleForm.county = res.data.reportAreaDetail.parentIdList[1];
              this.ruleForm.township = res.data.reportAreaDetail.parentIdList[0];
            }
            if(this.ruleForm.reportAreaLevel) {
              this.$store.commit('reportAreaLevelMutations', this.ruleForm.reportAreaLevel);
            }
          } else {
            this.ruleForm.reportOrganName = res.data.reportOrganName;
          }
        }
      })
    },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let reportAreaId = '';
          if (this.ruleForm.township) {
            reportAreaId = this.ruleForm.township;
          } else if (this.ruleForm.county) {
            reportAreaId = this.ruleForm.county;
          } else if (this.ruleForm.city) {
            reportAreaId = this.ruleForm.city;
          } else {
            reportAreaId = this.ruleForm.province;
          }
          let params = {
            // id: this.orderId || '',
            dataReportOrderId: this.dataReportOrderId,
            reportAreaId: reportAreaId,
            reportAreaLevel: this.ruleForm.reportAreaLevel, //行政区划级别
            reportAreaCode: this.ruleForm.reportAreaCode, //行政区划代码
            reportOrganName: this.ruleForm.reportOrganName, //填报人单位名称
            reportUserName: this.ruleForm.reportUserName, //填报人
            reportPhone: this.ruleForm.reportPhone, //电话
            reportDate: DATEFORMAT.dateReturn(this.ruleForm.reportDate) //填报日期
          }
          this.$axiosJsonPost(API.report_addReportArea, params).then(res => {
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
    }
  }
}
</script>