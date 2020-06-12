<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="detailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="detailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <h2 class="h-table-subtitle">
            <span></span>基础信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th>地址坐落</th>
              <td>{{reportOfficeHouseDetail.reportAddress}}</td>
              <th>行政区划代码</th>
              <td>{{reportOfficeHouseDetail.reportAreaCode}}</td>
            </tr>
            <tr>
              <th>用地面积</th>
              <td>{{reportOfficeHouseDetail.reportLandArea}}</td>
              <th>办公用房建筑面积</th>
              <td>{{reportOfficeHouseDetail.reportOfficeBuildArea}}</td>
            </tr>
            <tr>
              <th>技术业务用房建筑面积</th>
              <td>{{reportOfficeHouseDetail.reportTechBuildArea}}</td>
              <th>总建筑面积</th>
              <td>{{reportOfficeHouseDetail.reportAllBuildArea}}</td>
            </tr>
            <tr>
              <th>办公室使用面积</th>
              <td>{{reportOfficeHouseDetail.reportOfficeUseArea}}</td>
              <th>服务用房使用面积</th>
              <td>{{reportOfficeHouseDetail.reportServiceUseArea}}</td>
            </tr>
            <tr>
              <th>设备用房使用面积</th>
              <td>{{reportOfficeHouseDetail.reportEquipUseArea}}</td>
              <th>基本办公用房使用面积</th>
              <td>{{reportOfficeHouseDetail.reportBaseOfficeArea}}</td>
            </tr>
            <tr>
              <th>附属用房建筑面积</th>
              <td>{{reportOfficeHouseDetail.reportAffiliatedBuildArea}}</td>
              <th>权属登记情况</th>
              <td>{{reportOfficeHouseDetail.reportOwnerStatusName}}</td>
            </tr>
            <tr>
              <th>建设年代</th>
              <td>{{reportOfficeHouseDetail.reportBuildDate}}</td>
              <th>是否为租（借）用</th>
              <td>{{reportOfficeHouseDetail.reportRentStatusName}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">{{reportOfficeHouseDetail.reportRemark}}</td>
            </tr>
          </table>
          <h2 class="h-table-subtitle" style="margin-top:20px;">
            <span></span>使用单位信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th style="width:60px;">序号</th>
              <th>单位名称</th>
              <th>类别</th>
              <th v-if="(reportAreaLevel &&  (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE')))  || !reportAreaLevel">市级正职</th>
              <th v-if="(reportAreaLevel &&  (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE')))  || !reportAreaLevel">市级副职</th>
              <th v-if="(reportAreaLevel &&  (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE')))  || !reportAreaLevel">正局(处)级</th>
              <th v-if="(reportAreaLevel &&  (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE')))  || !reportAreaLevel">副局(处)级</th>
              <th v-if="(reportAreaLevel &&  (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE')))  || !reportAreaLevel">局(处)级以下</th>

              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">县级正职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">县级副职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">正科级</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">副科级</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'">科级以下</th>

              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">乡级正职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">乡级副职</th>
              <th v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'">乡级以下</th>
            </tr>
            <tr v-for="(item, index) in useOrganResponseList" :key="index">
              <td class="f-text-center">{{index + 1}}</td>
              <td class="f-text-center">{{item.reportOrganName}}</td>
              <td class="f-text-center">{{checkOrganType(item.reportOrganType)}}</td>
              <!-- <td class="f-text-center">{{item.reportOrganTypeName}}</td> -->
              <!-- 市级 -->
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel" class="f-text-center">{{item.reportCityStand}}</td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel" class="f-text-center">{{item.reportCityDeputy}}</td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel" class="f-text-center">{{item.reportStandBureauRank}}</td>
              <td v-if="(reportAreaLevel && (reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel" class="f-text-center">{{item.reportDeputyBureauRank}}</td>
              <td v-if="(reportAreaLevel &&(reportAreaLevel.indexOf('CITY') > '-1'|| reportAreaLevel.includes('PROVINCE'))) || !reportAreaLevel" class="f-text-center">{{item.reportBureauRankDown}}</td>
              <!-- 县级 -->
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'" class="f-text-center">{{item.reportCountyStand}}</td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'" class="f-text-center">{{item.reportCountyDeputy}}</td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'" class="f-text-center">{{item.reportStandAdministrative}}</td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'" class="f-text-center">{{item.reportDeputyAdministrative}}</td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('COUNTY') > '-1'" class="f-text-center">{{item.reportAdministrativeDown}}</td>
              <!-- 乡级 -->
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'" class="f-text-center">{{item.reportVillageStand}}</td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'" class="f-text-center">{{item.reportVillageDeputy}}</td>
              <td v-if="reportAreaLevel && reportAreaLevel.indexOf('VILLAGE') > '-1'" class="f-text-center">{{item.reportVillageDown}}</td>
            </tr>
          </table>
          <div>注：人员编制数应为编制部门正式批复文件中的各职级编制数；</div>
          <h2 class="h-table-subtitle" style="margin-top:20px;" v-show="hisCommentList.length > 0">
            <span></span>退回记录
          </h2>
          <table class="h-table-info" style="margin:10px 0;" v-show="hisCommentList.length > 0">
            <tr>
              <th style="width:60px;">序号</th>
              <th>退回理由</th>
              <th>退回时间</th>
              <th>操作人</th>
            </tr>
            <tr v-for="(item, index) in hisCommentList" :key="index">
              <td class="f-text-center">{{index + 1}}</td>
              <td class="f-text-center">{{item.remark}}</td>
              <td class="f-text-center">{{getTime(item.createdAt)}}</td>
              <td class="f-text-center">{{item.userName}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      detailShow: false, // 弹出框开关
      reportOfficeHouseDetail: {}, // 详情
      useOrganResponseList: [], // 单位列表
      hisCommentList: [],
      organType: []
    };
  },
  computed: {
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    },
    reportAreaLevel() {
      return this.$store.state.mainData.reportAreaLevel;
    }
  },
  activated() { },
  methods: {
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'ORGAN_TYPE'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.organType = res.data.ORGAN_TYPE;
        }
      })
    },
    getTime(value) {
      return value.substr(0,10);
    },
    checkOrganType(reportOrganType) {
      let reportOrganTypeName = '';
      this.organType.forEach((item, index) => {
        if (item.dicValue == reportOrganType) {
          reportOrganTypeName = item.dicName;
        }
      })
      return reportOrganTypeName;
    },
    // getTime(value) {
    //   return DATEFORMAT.dateReturn(new Date(value))
    // },
    // 初始化弹出框
    openModal(id) {
      this.getDataRequest(id);
      this.getPic();
      this.detailShow = true;
    },
    getDataRequest(id) {
      let params = {
        dataReportOrderId: this.dataReportOrderId,
        id: id
      }
      this.$axiosGet(API.report_getReportOfficeHouseDetail, params).then(res => {
        this.reportOfficeHouseDetail = res.data.reportOfficeHouse||{};
        this.useOrganResponseList = this.reportOfficeHouseDetail.useOrganResponseList||[];
        this.hisCommentList = this.reportOfficeHouseDetail.hisCommentList||[];

      })
    }
  }
};
</script>

