<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="900px" :visible.sync="detailDialogShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="detailDialogShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content" style="margin-top: 0px;">
          <table class="h-table-info">
            <tr>
              <th>地址坐落</th>
              <td>{{ruleForm.courtyardAddress}}</td>
              <th>权属登记情况</th>
              <td>{{ruleForm.warrantSituation}}</td>
            </tr>
            <tr>
              <th>房屋信息</th>
              <td colspan="3">{{ruleForm.roomAddress}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>房产证号</th>
              <td>{{ruleForm.houseCertificateNo}}</td>
              <th>产权单位</th>
              <td>{{ruleForm.propertyOrganName}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>登记时间</th>
              <td>{{ruleForm.registerDate}}</td>
              <th>发证机关</th>
              <td>{{ruleForm.licenceIssuingAuthority}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>共有情况</th>
              <td>{{ruleForm.ownershipCircumstance}}</td>
              <th>房屋取得方式</th>
              <td>{{ruleForm.houseAcquisitionMode}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>总层数</th>
              <td>{{ruleForm.totalStorey ? ruleForm.totalStorey+'层':''}}</td>
              <th>房屋规划用途</th>
              <td>{{ruleForm.housePlanningPurposes}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>土地使用年限</th>
              <td>{{ruleForm.landUsageTerm ? ruleForm.landUsageTerm+'年':'' }}</td>
              <th>地号</th>
              <td>{{ruleForm.landNo}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>图号</th>
              <td>{{ruleForm.figureNo}}</td>
              <th>建筑面积</th>
              <td>{{ruleForm.buildArea ? ruleForm.buildArea+'㎡': ''}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>套内建筑面积</th>
              <td colspan="3">{{ruleForm.withinBuildArea ? ruleForm.withinBuildArea+'㎡': ''}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>备注</th>
              <td colspan="3">{{ruleForm.remark}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>照片信息</th>
              <td colspan="3">
                <viewer :images="ruleForm.attachments">
                  <img v-for="(item, index) in ruleForm.attachments" :key="index" v-show="item.url" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr v-if="showForm == '2'">
              <th>未办证原因</th>
              <td colspan="3">{{ruleForm.noEvidenceReason}}</td>
            </tr>
            <tr v-if="showForm == '3'">
              <th>情况说明</th>
              <td colspan="3">{{ruleForm.situationDescription}}</td>
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
      ruleForm: {
        floorId: '', // 楼座id
        courtyardAddress: '', // 地址坐落
        roomAddress: '',//房屋信息
        warrantSituation: '', // 产权办理情况
        houseCertificateNo: '', // 房产证号
        propertyOrganName: '', // 产权单位
        registerDate: '', // 登记日期
        licenceIssuingAuthority: '', // 发证机关
        ownershipCircumstance: '',  // 共有情况
        houseAcquisitionMode: '',  // 房屋取得方式
        housePlanningPurposes: '',  // 房屋规划用途
        landUsageTerm: '', // 土地使用年限 
        landNo: '',  // 地号
        figureNo: '',  // 图号
        buildArea: '',  // 建筑面积
        withinBuildArea: '',  // 套内建筑面积
        totalStorey: '', // 总层数
        remark: '', // 备注
        noEvidenceReason: '', // 未办证原因
        situationDescription: '', // 情况说明
        attachments: [] // 图片地址
      },
      showForm: '',
      detailDialogShow: false // 弹出框开关
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.detailDialogShow = true;
      this.getDetail(id);
    },
    getDetail(id) {
      let params = {
        id: id
      }
      this.$axiosGet(API.housePropertyArchives_detail, params).then(res => {
        let houseProperty ={};
        houseProperty = res.data.propertyArchivesResponse;
        this.ruleForm.floorId = houseProperty.floorId || '';
        this.ruleForm.courtyardAddress = houseProperty.courtyardAddress || '';
        this.ruleForm.roomAddress = houseProperty.roomAddress || '';
        this.ruleForm.warrantSituation = houseProperty.warrantSituationName || '';
        this.ruleForm.houseCertificateNo = houseProperty.houseCertificateNo || '';
        this.ruleForm.propertyOrganName = houseProperty.propertyOrganName || '';
        if (houseProperty.registerDate) {
          this.ruleForm.registerDate = houseProperty.registerDate.substr(0,10);
        } else {
          this.ruleForm.registerDate = '';
        }        
        this.ruleForm.licenceIssuingAuthority = houseProperty.licenceIssuingAuthority || '';
        this.ruleForm.ownershipCircumstance = houseProperty.ownershipCircumstance || '';
        this.ruleForm.houseAcquisitionMode = houseProperty.houseAcquisitionModeName || '';
        this.ruleForm.housePlanningPurposes = houseProperty.housePlanningPurposesName || '';
        this.ruleForm.landUsageTerm = houseProperty.landUsageTerm || '';
        this.ruleForm.landNo = houseProperty.landNo || '';
        this.ruleForm.figureNo = houseProperty.figureNo || '';
        this.ruleForm.buildArea = houseProperty.buildArea || '';
        this.ruleForm.withinBuildArea = houseProperty.withinBuildArea || '';
        this.ruleForm.totalStorey = houseProperty.totalStorey || '';
        this.ruleForm.propertyOrganName = houseProperty.propertyOrganName || '';
        this.ruleForm.remark = houseProperty.remark || '';
        this.ruleForm.noEvidenceReason = houseProperty.noEvidenceReason || '';
        this.ruleForm.situationDescription = houseProperty.situationDescription || '';
        this.ruleForm.attachments = res.data.fileResponseList || [];
        this.setShowForm(houseProperty.warrantSituation)
      })
    },
    setShowForm(value) {
      if (value == 'ONE' || value == 'TWO' || value == "THREE") {
        this.showForm = '1';
      } else if (value == 'FOUR' || value == 'FIVE') {
        this.showForm = '2';
      } else {
        this.showForm = '3';
      }
    },
  }
};
</script>

