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
              <th>土地证号</th>
              <td>{{ruleForm.landCertificateNo}}</td>
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
              <th>取得价格</th>
              <td>{{ruleForm.gainThePrice ? ruleForm.gainThePrice+'万元':''}}</td>
              <th>土地取得方式</th>
              <td>{{ruleForm.landAcquisitionMode}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>土地规划用途</th>
              <td>{{ruleForm.landPlanningPurposes}}</td>
              <th>土地使用年限</th>
              <td>{{ruleForm.landUsageTerm ? ruleForm.landUsageTerm+'年':''}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>地号</th>
              <td>{{ruleForm.landNo}}</td>
              <th>图号</th>
              <td>{{ruleForm.figureNo}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>使用权面积</th>
              <td>{{ruleForm.rightToUseArea ? ruleForm.rightToUseArea+'㎡': ''}}</td>
              <th>其中：独有面积</th>
              <td>{{ruleForm.useAloneArea ? ruleForm.useAloneArea+'㎡': ''}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>其中：分摊面积</th>
              <td>{{ruleForm.apportionArea ? ruleForm.apportionArea+'㎡': ''}}</td>
              <th>其中：住宅面积</th>
              <td>{{ruleForm.residentialArea ? ruleForm.residentialArea+'㎡': ''}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>其中：商业面积</th>
              <td colspan="3">{{ruleForm.businessArea ? ruleForm.businessArea+'㎡': ''}}</td>
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
        courtyardAddress: '', // 地址坐落
        roomAddress: '',//房屋信息
        warrantSituation: '', // 产权办理情况
        landCertificateNo: '', // 土地证号
        propertyOrganName: '', // 产权单位
        registerDate: '', // 登记日期
        licenceIssuingAuthority: '', // 发证机关
        gainThePrice: '', // 取得价格
        landAcquisitionMode: '', // 土地取得方式
        landPlanningPurposes: '', // 土地规划用途
        landUsageTerm: '', // 土地使用年限
        landNo: '', // 地号
        figureNo: '', // 图号
        rightToUseArea: '', // 使用权面积
        useAloneArea: '', // 独用面积
        apportionArea: '', // 分摊面积
        residentialArea: '', // 住宅面积
        businessArea: '', // 商业面积
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
      this.$axiosGet(API.landArchives_detail, params).then(res => {
        this.ruleForm.floorId = res.data.landArchivesResponse.floorId || '';
        this.ruleForm.courtyardAddress = res.data.landArchivesResponse.courtyardAddress || '';
        this.ruleForm.roomAddress = res.data.landArchivesResponse.roomAddress || '';
        this.ruleForm.warrantSituation = res.data.landArchivesResponse.warrantSituationName || '';
        this.ruleForm.landCertificateNo = res.data.landArchivesResponse.landCertificateNo || '';
        this.ruleForm.propertyOrganName = res.data.landArchivesResponse.propertyOrganName || '';
        if (res.data.landArchivesResponse.registerDate) {
          this.ruleForm.registerDate = res.data.landArchivesResponse.registerDate.substr(0,10);
        } else {
          this.ruleForm.registerDate = '';
        }
        this.ruleForm.licenceIssuingAuthority = res.data.landArchivesResponse.licenceIssuingAuthority || '';
        this.ruleForm.gainThePrice = res.data.landArchivesResponse.gainThePrice || '';
        this.ruleForm.landAcquisitionMode = res.data.landArchivesResponse.landAcquisitionModeName || '';
        this.ruleForm.landPlanningPurposes = res.data.landArchivesResponse.landPlanningPurposesName || '';
        this.ruleForm.landUsageTerm = res.data.landArchivesResponse.landUsageTerm || '';
        this.ruleForm.landNo = res.data.landArchivesResponse.landNo || '';
        this.ruleForm.figureNo = res.data.landArchivesResponse.figureNo || '';
        this.ruleForm.rightToUseArea = res.data.landArchivesResponse.rightToUseArea || '';
        this.ruleForm.useAloneArea = res.data.landArchivesResponse.useAloneArea || '';
        this.ruleForm.apportionArea = res.data.landArchivesResponse.apportionArea || '';
        this.ruleForm.residentialArea = res.data.landArchivesResponse.residentialArea || '';
        this.ruleForm.businessArea = res.data.landArchivesResponse.businessArea || '';
        this.ruleForm.remark = res.data.landArchivesResponse.remark || '';
        this.ruleForm.noEvidenceReason = res.data.landArchivesResponse.noEvidenceReason || '';
        this.ruleForm.situationDescription = res.data.landArchivesResponse.situationDescription || '';
        this.ruleForm.attachments = res.data.fileResponse || [];
        this.setShowForm(res.data.landArchivesResponse.warrantSituation)
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
    }
  }
};
</script>

