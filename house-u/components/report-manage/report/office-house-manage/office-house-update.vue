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
              <th>
                <span class="f-color-red">*</span>地址坐落</th>
              <td>
                <el-form-item prop="reportAddress" :rules="{required: true, message: '地址坐落不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAddress" placeholder="请输入地址坐落" clearable></el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>行政区划代码</th>
              <td>
                <el-form-item prop="reportAreaCode" :rules="{required: true, message: '行政区划代码不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAreaCode" placeholder="请输入行政区划代码" clearable :maxlength="12"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>用地面积</th>
              <td>
                <el-form-item prop="reportLandArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportLandArea" placeholder="请输入用地面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>办公用房建筑面积</th>
              <td>
                <el-form-item prop="reportOfficeBuildArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportOfficeBuildArea" @change="getAllArea" placeholder="请输入办公用房建筑面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>技术业务用房建筑面积</th>
              <td>
                <el-form-item prop="reportTechBuildArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportTechBuildArea" @change="getAllArea" placeholder="请输入技术业务用房建筑面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>总建筑面积</th>
              <td>
                <el-form-item prop="reportAllBuildArea">
                  <el-input v-model="ruleForm.reportAllBuildArea" disabled placeholder="请输入总建筑面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>办公室使用面积</th>
              <td>
                <el-form-item prop="reportOfficeUseArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportOfficeUseArea" @change="getAllUeserArea" placeholder="请输入办公室使用面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>服务用房使用面积</th>
              <td>
                <el-form-item prop="reportServiceUseArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportServiceUseArea" @change="getAllUeserArea" placeholder="请输入服务用房使用面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>设备用房使用面积</th>
              <td>
                <el-form-item prop="reportEquipUseArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportEquipUseArea" @change="getAllUeserArea" placeholder="请输入设备用房使用面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>基本办公用房使用面积</th>
              <td>
                <el-form-item prop="reportBaseOfficeArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportBaseOfficeArea" disabled placeholder="请输入基本办公用房使用面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>附属用房建筑面积</th>
              <td>
                <el-form-item prop="reportAffiliatedBuildArea" :rules="{validator: areaValidatePass, trigger: 'change'}">
                  <el-input v-model="ruleForm.reportAffiliatedBuildArea" placeholder="请输入附属用房建筑面积" clearable>
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>权属登记情况</th>
              <td>
                <el-form-item prop="reportOwnerStatus" :rules="{required: true, message: '权属登记情况不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.reportOwnerStatus" placeholder="请选择权属登记情况" clearable style="width: 100%;">
                    <el-option v-for="(item, index) in ownerStatus" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>建设年代</th>
              <td>
                <el-form-item prop="reportBuildDate" :rules="{required: true, message: '建设年代不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.reportBuildDate" type="year" clearable placeholder="请选择建设年代" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </td>
              <th>
                <span class="f-color-red">*</span>是否为租（借）用</th>
              <td>
                <el-form-item prop="reportRentStatus" :rules="{required: true, message: '是否为租（借）用不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.reportRentStatus" placeholder="请选择是否为租（借）用" clearable style="width: 100%;">
                    <el-option v-for="(item, index) in rentStatus" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="reportRemark">
                  <el-input v-model="ruleForm.reportRemark" type="textarea" :maxlength="200" :rows="5" placeholder="请输入备注"></el-input>
                  <div class="f-text-right">{{ruleForm.reportRemark.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
          </table>
          <!-- </el-form>
        <el-form ref="organRuleForm" :model="organRuleForm"> -->
          <h2 class="h-table-subtitle">
            <span></span>使用单位信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th style="width:60px;">序号</th>
              <th>
                <span class="f-color-red">*</span>单位名称</th>
              <th>
                <span class="f-color-red">*</span>单位类别</th>

              <th v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <span class="f-color-red">*</span>市级正职</th>
              <th v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel"> <span class="f-color-red">*</span>市级副职</th>
              <th v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <span class="f-color-red">*</span>正局(处)级</th>
              <th v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <span class="f-color-red">*</span>副局(处)级</th>
              <th v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <span class="f-color-red">*</span>局(处)级以下</th>

              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <span class="f-color-red">*</span>县级正职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <span class="f-color-red">*</span>县级副职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <span class="f-color-red">*</span>正科级</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <span class="f-color-red">*</span>副科级</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <span class="f-color-red">*</span>科级以下</th>

              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">
                <span class="f-color-red">*</span>乡级正职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">
                <span class="f-color-red">*</span>乡级副职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">
                <span class="f-color-red">*</span>乡级以下</th>
              <th style="width:60px;">操作</th>
            </tr>
            <tr v-for="(useOrganStrings, index) in ruleForm.useOrganStrings" :key="index">
              <td class="f-text-center">{{index + 1}}</td>
              <td>
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportOrganName'" :rules="{required: true, message: '单位名称不能为空', trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportOrganName" placeholder="请输入单位名称"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportOrganType'" :rules="{required: true, message: '类别不能为空', trigger: 'change'}">
                  <el-select v-model="useOrganStrings.reportOrganType" placeholder="请选择">
                    <el-option v-for="(item, index) in organType" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
              <!-- 市级 -->
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportCityStand'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportCityStand" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportCityDeputy'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportCityDeputy" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportStandBureauRank'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportStandBureauRank" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportDeputyBureauRank'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportDeputyBureauRank" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1' || reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportBureauRankDown'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportBureauRankDown" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <!-- 县级 -->
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportCountyStand'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportCountyStand" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportCountyDeputy'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportCountyDeputy" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportStandAdministrative'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportStandAdministrative" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportDeputyAdministrative'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportDeputyAdministrative" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportAdministrativeDown'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportAdministrativeDown" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <!-- 乡镇级 -->
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportVillageStand'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportVillageStand" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportVillageDeputy'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportVillageDeputy" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">
                <el-form-item :prop="'useOrganStrings.'+ index + '.reportVillageDown'" :rules="{validator: personValidatePass, trigger: 'change'}">
                  <el-input v-model="useOrganStrings.reportVillageDown" placeholder="请输入" clearable>
                    <template slot="append">人</template>
                  </el-input>
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
          <router-link to="/report-manage/report/office-house">
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
        reportAddress: '', // 地址坐落
        reportAreaCode: '', // 行政区划代码
        reportLandArea: '', // 用地面积
        reportOfficeBuildArea: '', // 办公用房建筑面积
        reportTechBuildArea: '', // 技术业务用房建筑面积
        reportAllBuildArea: '', // 总建筑面积
        reportOfficeUseArea: '', // 办公室使用面积
        reportServiceUseArea: '', // 服务用房使用面积
        reportEquipUseArea: '', // 设备用房使用面积
        reportBaseOfficeArea: '', // 基本办公用房使用面积
        reportAffiliatedBuildArea: '', // 附属用房建筑面积
        reportOwnerStatus: '', // 权属登记情况
        reportBuildDate: '', // 建设年代
        reportRentStatus: '', // 是否为租（借）用
        reportRemark: '', // 备注
        useOrganStrings: [
          {
            reportOrganName: '', // 单位名称
            reportOrganType: '', // 单位类别
            reportCityStand: '', // 市级正职
            reportCityDeputy: '', // 市级副职
            reportStandBureauRank: '', // 正局(处)级
            reportDeputyBureauRank: '', // 副局(处)级
            reportBureauRankDown: '', // 局(处)级以下
            reportCountyStand: '', // 县级正职
            reportCountyDeputy: '', // 县级副职
            reportStandAdministrative: '', // 正科级
            reportDeputyAdministrative: '', // 副科级
            reportAdministrativeDown: '', // 科级以下
            reportVillageStand: '', // 乡级正职
            reportVillageDeputy: '', // 乡级副职
            reportVillageDown: '' // 乡级以下
          }
        ]
      },
      ownerStatus: [], // 权属登记情况
      rentStatus: [], // 租借情况
      organType: [], // 单位类别
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    if (this.$route.params.type == "edit") {
      this.getDetail()
    }
    this.getPic()
  },
  computed: {
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    },
    organSpecification() {
      return this.$store.state.mainData.organSpecification;
    },
    reportAreaLevel() {
      return this.$store.state.mainData.reportAreaLevel;
    }
  },
  deactivated() {
    this.ruleForm.useOrganStrings = [{
      reportOrganName: '', // 单位名称
      reportOrganType: '', // 单位类别
      reportCityStand: '', // 市级正职
      reportCityDeputy: '', // 市级副职
      reportStandBureauRank: '', // 正局(处)级
      reportDeputyBureauRank: '', // 副局(处)级
      reportBureauRankDown: '', // 局(处)级以下
      reportCountyStand: '', // 县级正职
      reportCountyDeputy: '', // 县级副职
      reportStandAdministrative: '', // 正科级
      reportDeputyAdministrative: '', // 副科级
      reportAdministrativeDown: '', // 科级以下
      reportVillageStand: '', // 乡级正职
      reportVillageDeputy: '', // 乡级副职
      reportVillageDown: '' // 乡级以下
    }]
  },
  methods: {
    // 获取详情
    getDetail() {
      let params = {
        id: this.$route.query.id
      }
      this.$axiosGet(API.report_getReportOfficeHouseDetail, params).then(res => {
        this.ruleForm.useOrganStrings = [];
        // this.ruleForm = { ...res.data.reportOfficeHouseDetail }
        let reportOfficeHouseDetail = res.data.reportOfficeHouse||{};
        this.ruleForm.reportAddress = reportOfficeHouseDetail.reportAddress; // 地址坐落
        this.ruleForm.reportAreaCode = reportOfficeHouseDetail.reportAreaCode; // 行政区划代码
        this.ruleForm.reportLandArea = reportOfficeHouseDetail.reportLandArea; // 用地面积
        this.ruleForm.reportOfficeBuildArea = reportOfficeHouseDetail.reportOfficeBuildArea; // 办公用房建筑面积
        this.ruleForm.reportTechBuildArea = reportOfficeHouseDetail.reportTechBuildArea; // 技术业务用房建筑面积
        this.ruleForm.reportAllBuildArea = reportOfficeHouseDetail.reportAllBuildArea; // 总建筑面积
        this.ruleForm.reportOfficeUseArea = reportOfficeHouseDetail.reportOfficeUseArea; // 办公室使用面积
        this.ruleForm.reportServiceUseArea = reportOfficeHouseDetail.reportServiceUseArea; // 服务用房使用面积
        this.ruleForm.reportEquipUseArea = reportOfficeHouseDetail.reportEquipUseArea; // 设备用房使用面积
        this.ruleForm.reportBaseOfficeArea = reportOfficeHouseDetail.reportBaseOfficeArea; // 基本办公用房使用面积
        this.ruleForm.reportAffiliatedBuildArea = reportOfficeHouseDetail.reportAffiliatedBuildArea; // 附属用房建筑面积
        this.ruleForm.reportOwnerStatus = reportOfficeHouseDetail.reportOwnerStatus; // 权属登记情况
        this.ruleForm.reportBuildDate = new Date(reportOfficeHouseDetail.reportBuildDate); // 建设年代
        this.ruleForm.reportRentStatus = reportOfficeHouseDetail.reportRentStatus; // 是否为租（借）用
        this.ruleForm.reportRemark = reportOfficeHouseDetail.reportRemark; // 备注
        res.data.reportOfficeHouse.useOrganResponseList.forEach((item, index) => {
          this.ruleForm.useOrganStrings.push({
            reportOrganName: item.reportOrganName, // 单位名称
            reportOrganType: item.reportOrganType, // 单位类别
            reportCityStand: item.reportCityStand, // 市级正职
            reportCityDeputy: item.reportCityDeputy, // 市级副职
            reportStandBureauRank: item.reportStandBureauRank, // 正局(处)级
            reportDeputyBureauRank: item.reportDeputyBureauRank, // 副局(处)级
            reportBureauRankDown: item.reportBureauRankDown, // 局(处)级以下
            reportCountyStand: item.reportCountyStand, // 县级正职
            reportCountyDeputy: item.reportCountyDeputy, // 县级副职
            reportStandAdministrative: item.reportStandAdministrative, // 正科级
            reportDeputyAdministrative: item.reportDeputyAdministrative, // 副科级
            reportAdministrativeDown: item.reportAdministrativeDown, // 科级以下
            reportVillageStand: item.reportVillageStand, // 乡级正职
            reportVillageDeputy: item.reportVillageDeputy, // 乡级副职
            reportVillageDown: item.reportVillageDown // 乡级以下
          })
        })
      })
    },
    // 计算总建筑面积
    getAllArea() {
      let all = Number(this.ruleForm.reportOfficeBuildArea) + Number(this.ruleForm.reportTechBuildArea);
      if (isNaN(all)) {
        this.ruleForm.reportAllBuildArea = '';
      } else {
        this.ruleForm.reportAllBuildArea = all;
      }
    },
    // 计算基础办公用房使用面积
    getAllUeserArea() {
      let all = Number(this.ruleForm.reportOfficeUseArea) + Number(this.ruleForm.reportServiceUseArea) + Number(this.ruleForm.reportEquipUseArea);
      if (isNaN(all)) {
        this.ruleForm.reportBaseOfficeArea = '';
      } else {
        this.ruleForm.reportBaseOfficeArea = all;
      }
    },
    // 面积表单验证
    areaValidatePass(rule, value, callback) {
      let message = '';
      if (rule.fullField == 'reportLandArea') {
        message = '用地面积';
      } else if (rule.fullField == 'reportOfficeBuildArea') {
        message = '办公用房建筑面积';
      } else if (rule.fullField == 'reportTechBuildArea') {
        message = '技术业务用房建筑面积';
      } else if (rule.fullField == 'reportOfficeUseArea') {
        message = '办公室使用面积';
      } else if (rule.fullField == 'reportServiceUseArea') {
        message = '服务用房使用面积';
      } else if (rule.fullField == 'reportEquipUseArea') {
        message = '设备用房使用面积';
      } else if (rule.fullField == 'reportBaseOfficeArea') {
        message = '基本办公用房使用面积';
      } else if (rule.fullField == 'reportAffiliatedBuildArea') {
        message = '附属用房建筑面积';
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
        if (rule.fullField == 'reportBaseOfficeArea') {
          callback();
        } else {
          callback(new Error(`${message}不能为空`));
        }
      }
    },
    // 人数验证
    personValidatePass(rule, value, callback) {
      if (value) {
        if (!/^(([1-9])(\d+)?|0)$/.test(value)) {
          callback(new Error(`人数为大于等于0的整数`));
        } else if (value > 1000) {
          callback(new Error(`人数不能大于一千人`));
        } else {
          callback();
        }
      } else {
        callback(new Error(`人数不能为空`));
      }
    },
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'ORGAN_TYPE,OWNER_STATUS,RENT_STATUS'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.ownerStatus = res.data.OWNER_STATUS;
          this.rentStatus = res.data.RENT_STATUS;
          this.organType = res.data.ORGAN_TYPE;
        }
      })
    },
    addOrgan() {
      this.ruleForm.useOrganStrings.push({
        reportOrganName: '', // 单位名称
        reportOrganType: '', // 单位类别
        reportCityStand: '', // 市级正职
        reportCityDeputy: '', // 市级副职
        reportStandBureauRank: '', // 正局(处)级
        reportDeputyBureauRank: '', // 副局(处)级
        reportBureauRankDown: '', // 局(处)级以下
        reportCountyStand: '', // 县级正职
        reportCountyDeputy: '', // 县级副职
        reportStandAdministrative: '', // 正科级
        reportDeputyAdministrative: '', // 副科级
        reportAdministrativeDown: '', // 科级以下
        reportVillageStand: '', // 乡级正职
        reportVillageDeputy: '', // 乡级副职
        reportVillageDown: '' // 乡级以下
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
            reportAddress: this.ruleForm.reportAddress, // 地址坐落
            reportAreaCode: this.ruleForm.reportAreaCode, // 行政区划代码
            reportLandArea: this.ruleForm.reportLandArea, // 用地面积
            reportOfficeBuildArea: this.ruleForm.reportOfficeBuildArea, // 办公用房建筑面积
            reportTechBuildArea: this.ruleForm.reportTechBuildArea, // 技术业务用房建筑面积
            reportAllBuildArea: this.ruleForm.reportAllBuildArea, // 总建筑面积
            reportOfficeUseArea: this.ruleForm.reportOfficeUseArea, // 办公室使用面积
            reportServiceUseArea: this.ruleForm.reportServiceUseArea, // 服务用房使用面积
            reportEquipUseArea: this.ruleForm.reportEquipUseArea, // 设备用房使用面积
            reportBaseOfficeArea: this.ruleForm.reportBaseOfficeArea, // 基本办公用房使用面积
            reportAffiliatedBuildArea: this.ruleForm.reportAffiliatedBuildArea, // 附属用房建筑面积
            reportOwnerStatus: this.ruleForm.reportOwnerStatus, // 权属登记情况
            reportBuildDate: DATEFORMAT.dateReturnY(this.ruleForm.reportBuildDate), // 建设年代
            reportRentStatus: this.ruleForm.reportRentStatus, // 是否为租（借）用
            reportRemark: this.ruleForm.reportRemark, // 备注
            reportUseOrganRequestList: (this.ruleForm.useOrganStrings)
          }
          if (this.$route.query.id) {
            this.$set(params, 'id', this.$route.query.id)
          }
          this.$axiosJsonPost(API.report_addReportOfficeHouse, params).then(res => {
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
        this.$router.push({ path: '/report-manage/report/office-house' })
      }
    }
  }
}
</script>