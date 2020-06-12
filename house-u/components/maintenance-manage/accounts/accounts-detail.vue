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
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>工程信息</a>
          </li>
          <li @click="pageSelect = 'maintenance'" :class="{'active':pageSelect=='maintenance'}">
            <a>维修信息</a>
          </li>
          <li @click="pageSelect = 'photos'" :class="{'active':pageSelect=='photos'}">
            <a>维修照片</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
          <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}">
            <a>评分</a>
          </li>
          <!-- <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}" v-show="score.whetherScore == 'YES'">
            <a>评分</a>
          </li> -->
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th>维修单位</th>
              <td>{{maintainPlanApplyResponseDetail.maintainOrganName}}
              </td>
              <th>所属计划年度</th>
              <td>{{formartDate(maintainPlanApplyResponseDetail.planYear).substr(0, 4)}}</td>
            </tr>
            <tr>
              <th>工程名称</th>
              <td colspan='3'>{{maintainPlanApplyResponseDetail.projectName}}
              </td>
            </tr>
            <tr>
              <th>工程级别</th>
              <td>{{maintainPlanApplyResponseDetail.projectLevelName}}
              </td>
              <th>工程类型</th>
              <td>{{maintainPlanApplyResponseDetail.projectTypeName}}</td>
            </tr>
          </table>
          <table class="h-table-info" style="margin-top:15px;">
            <tr>
              <th>院落</th>
              <th>楼座</th>
              <th>房间</th>
            </tr>
            <tr v-for="(item,index) in roomDetailList" :key="index">
              <td align="center">{{item.courtyardName}}</td>
              <td align="center">{{item.floorName}}</td>
              <td align="center">{{item.roomNo}}</td>
            </tr>

          </table>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='maintenance'">
          <table class="h-table-info">
            <tr>
              <th>中标单位</th>
              <td>{{maintainPlanApplyResponseDetail.winBiddingOrganName}}</td>
              <th>采购方式</th>
              <td>{{maintainPlanApplyResponseDetail.winBiddingTypeName}}</td>
            </tr>
            <tr>
              <th>资质等级</th>
              <td>{{maintainPlanApplyResponseDetail.levelOfQualificationName}}</td>
              <th>中标金额</th>
              <td>{{maintainPlanApplyResponseDetail.winBiddingMoney?maintainPlanApplyResponseDetail.winBiddingMoney+'万年':''}}</td>
            </tr>
            <tr>
              <th>立项批复号</th>
              <td>{{maintainPlanApplyResponseDetail.projectApprovalNo}}</td>
              <th>施工合同号</th>
              <td>{{maintainPlanApplyResponseDetail.constructionContractNo}}</td>
            </tr>
            <tr>
              <th>施工许可证号</th>
              <td>{{maintainPlanApplyResponseDetail.constructionPermitNo}}</td>
              <th>规划许可证号</th>
              <td>{{maintainPlanApplyResponseDetail.planningPermitNo}}</td>
            </tr>
            <tr>
              <th>设计单位</th>
              <td>{{maintainPlanApplyResponseDetail.designOrganName}}</td>
              <th>施工单位</th>
              <td>{{maintainPlanApplyResponseDetail.constructionOrganName}}</td>
            </tr>
            <tr>
              <th>监理单位</th>
              <td>{{maintainPlanApplyResponseDetail.supervisionOrganName}}</td>
              <th>工程质量监督机构单位</th>
              <td>{{maintainPlanApplyResponseDetail.projectQualitySupervisionName}}</td>
            </tr>
            <tr>
              <th>开工日期</th>
              <td>{{maintainPlanApplyResponseDetail?formartDate(maintainPlanApplyResponseDetail.commencementDate):''}}</td>
              <th>竣工日期</th>
              <td>{{maintainPlanApplyResponseDetail?formartDate(maintainPlanApplyResponseDetail.completionDate):''}}</td>
            </tr>
            <tr>
              <th>决算日期</th>
              <td>{{maintainPlanApplyResponseDetail?formartDate(maintainPlanApplyResponseDetail.closingDate):''}}</td>
              <th>决算金额</th>
              <td>{{maintainPlanApplyResponseDetail?maintainPlanApplyResponseDetail.closingMoney+'万元':''}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">{{maintainPlanApplyResponseDetail.remark}}</td>
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
        <div class="h-tab-content" v-show="pageSelect=='photos'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">维修前照片</th>
              <td colspan="3">
                <viewer :images="imgBeforeUrls">
                  <img v-for="(item, index) in imgBeforeUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">维修后照片</th>
              <td colspan="3">
                <viewer :images="imgAfterUrls">
                  <img v-for="(item, index) in imgAfterUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan' && maintainPlanApplyResponseDetail.whetherScore == 'YES'">
          <div class="stars-class">
            <div class="stars-div">
              <span class="f-margin-right-10px">施工质量</span>
              <el-rate class="f-inline-block" v-model="maintainPlanApplyResponseDetail.constructionQualityScore" disabled>
              </el-rate>
            </div>
            <div class="stars-div">
              <span class="f-margin-right-10px">施工速度</span>
              <el-rate class="f-inline-block" v-model="maintainPlanApplyResponseDetail.constructionSpeedScore" disabled>
              </el-rate>
            </div>
            <div class="stars-div">
              <span class="f-margin-right-10px">建材品质</span>
              <el-rate class="f-inline-block" v-model="maintainPlanApplyResponseDetail.buildMaterialsQualityScore" disabled>
              </el-rate>
            </div>
            <div class="stars-div">
              <span class="f-margin-right-10px">安全系数</span>
              <el-rate class="f-inline-block" v-model="maintainPlanApplyResponseDetail.safetyFactorScore" disabled>
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
      imgBeforeUrls: [],//维修前照片
      imgAfterUrls: [], //维修后照片
      roomDetailList: [], //房间信息列表集合
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
        return value.substr(0, 10);
      } else {
        return '';
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.getDataRequest(id);
      this.pageSelect = "basic";
    },
    getDataRequest(id) {
      let params = {
        maintainParameterId: id,
      }
      this.$axiosGet(API.manageMaintain_maintainParameterDetail, params).then(res => {
        if (res.result == 'success') {
          this.sysAttachmentInfoList = res.data.fileList || [];
          this.imgBeforeUrls = res.data.beforePicList || [];
          this.imgAfterUrls = res.data.afterPicList || [];
          this.roomDetailList = res.data.maintainHouseDetailList;
          this.maintainPlanApplyResponseDetail = res.data.maintainParameterResponse;
          // this.score = res.data.score;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.stars-class {
  background: #f1f1f1;
  padding: 0 10px;
  .f-margin-right-10px {
    margin-right: 30px;
  }
  .stars-div {
    padding: 10px 0;
  }
}
</style>

