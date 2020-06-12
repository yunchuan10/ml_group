<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow" @close="clearForm">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="padding-bottom:20px;">
        <h2>工程名称：滁州市政务中心南楼外装修</h2>
        <div></div>
        <div class="h-tab-content">
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-text-center">维修内容</td>
            </tr>
            <tr>
              <th>工程名称</th>
              <td>{{maintainPlanApplyResponseDetail.applyOrganName}}
              </td>
              <th>工程位置</th>
              <td>{{formartDate(maintainPlanApplyResponseDetail.planYear).substr(0, 4)}}</td>
            </tr>
            <tr>
              <th>工程类型</th>
              <td>{{maintainPlanApplyResponseDetail.applyOrganName}}
              </td>
              <th>工程级别</th>
              <td>{{formartDate(maintainPlanApplyResponseDetail.planYear).substr(0, 4)}}</td>
            </tr>
            <tr>
              <th>申请单位</th>
              <td>{{maintainPlanApplyResponseDetail.applyOrganName}}
              </td>
              <th>计划年度</th>
              <td>{{formartDate(maintainPlanApplyResponseDetail.planYear).substr(0, 4)}}</td>
            </tr>
            <tr>
              <th>申请人</th>
              <td>{{maintainPlanApplyResponseDetail.realName}}
              </td>
              <th>计划总额度</th>
              <td>{{maintainPlanApplyResponseDetail.budgetTotalMoney}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">{{maintainPlanApplyResponseDetail.remark}}</td>
            </tr>
            <tr>
              <td colspan="4" class="f-text-center">办公用房维修改结果</td>
            </tr>
            <tr>
              <th>维修厂家</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.maintenanceManufacturer:''}}</td>
              <th>中标方式</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.winBiddingType:''}}</td>
            </tr>
            <tr>
              <th>资质等级</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.levelOfQualification:''}}</td>
              <th>中标金额</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.winBiddingMoney:''}}</td>
            </tr>
            <tr>
              <th>立项批复号</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.projectApprovalNo:''}}</td>
              <th>施工合同号</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.constructionContractNo:''}}</td>
            </tr>
            <tr>
              <th>开工日期</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?formartDate(maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.commencementDate):''}}</td>
              <th>竣工日期</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?formartDate(maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.completionDate):''}}</td>
            </tr>
            <tr>
              <th>决算日期</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?formartDate(maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.closingDate):''}}</td>
              <th>决算金额</th>
              <td>{{maintainPlanApplyResponseDetail.maintenanceResultEntryResponse?maintainPlanApplyResponseDetail.maintenanceResultEntryResponse.closingMoney:''}}</td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <el-table :data="sysAttachmentInfoList" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_blank">预览</a>
                <!-- <a :href="scope.row.url" target="_blank" download>下载</a> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan' && score.whetherScore == 'YES'">
          <div class="stars-class">
            <div class="stars-div">
              <span class="f-margin-right-10px">施工质量</span>
              <el-rate class="f-inline-block" v-model="score.constructionQualityScore" disabled>
              </el-rate>
            </div>
            <div class="stars-div">
              <span class="f-margin-right-10px">施工速度</span>
              <el-rate class="f-inline-block" v-model="score.constructionSpeedScore" disabled>
              </el-rate>
            </div>
            <div class="stars-div">
              <span class="f-margin-right-10px">建材品质</span>
              <el-rate class="f-inline-block" v-model="score.buildMaterialsQualityScore" disabled>
              </el-rate>
            </div>
            <div class="stars-div">
              <span class="f-margin-right-10px">安全系数</span>
              <el-rate class="f-inline-block" v-model="score.safetyFactorScore" disabled>
              </el-rate>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSelect: 'basic',
      carDetailShow: false,
      sysAttachmentInfoList: [], // 附件
      score: {}, // 评分
      maintainPlanApplyResponseDetail: {}
    };
  },
  activated() { },
  methods: {
    clearForm() {
      this.pageSelect = 'basic';
    },
    formartDate(value) {
      if (value) {
        return value.substr(0,10);
      } else {
        return '';
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.getDataRequest(id)
    },
    getDataRequest(id) {
      let params = {
        maintainPlanApplyId: id,
      }
      this.$axiosPost(API.userplatform_maintainResultDetail, params).then(res => {
        if (res.result == 'success') {
          this.sysAttachmentInfoList = res.data.sysAttachmentInfoList || [];
          this.maintainPlanApplyResponseDetail = res.data.maintainPlanApplyResponseDetail;
          this.score = res.data.score;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.stars-class {
  background: #dbe4ec;
  padding: 0 10px;
  .stars-div {
    padding: 10px 0;
  }
}
</style>

