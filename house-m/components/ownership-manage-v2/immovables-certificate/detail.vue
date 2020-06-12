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
              <th>不动产单元号</th>
              <td>{{ruleForm.estateCertificateUnitNo}}</td>
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
              <th>权利类型</th>
              <td>{{ruleForm.rightType}}</td>
              <th>权利性质</th>
              <td>{{ruleForm.rightNature}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>权利其他状况</th>
              <td>{{ruleForm.rightOtherConditions}}</td>
              <th>共有情况</th>
              <td>{{ruleForm.ownershipCircumstance}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>土地使用年限</th>
              <td>{{ruleForm.landUsageTerm ? ruleForm.landUsageTerm+'年':''}}</td>
              <th>土地规划用途</th>
              <td>{{ruleForm.landPlanningPurposes}}</td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>宗地面积</th>
              <td>{{ruleForm.landArea ? ruleForm.landArea+'㎡': ''}}</td>
              <th>建筑面积</th>
              <td colspan="3">{{ruleForm.buildArea ? ruleForm.buildArea+'㎡': ''}}</td>
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
        estateCertificateUnitNo: '', // 不动产单元号
        propertyOrganName: '', // 产权单位
        registerDate: '', // 登记日期
        licenceIssuingAuthority: '', // 发证机关
        rightType: '', // 权利类型
        rightNature: '', // 权利性质
        rightOtherConditions: '', // 权利其他状况
        landUsageTerm: '', // 土地使用年限
        ownershipCircumstance: '', // 共有情况
        landPlanningPurposes: '', // 土地规划用途
        landArea: '', // 宗地面积
        buildArea: '', // 建筑面积
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
      this.$axiosGet(API.estateCertificate_detail, params).then(res => {
        this.ruleForm.floorId = res.data.estateCertificateResponse.floorId || '';
        this.ruleForm.courtyardAddress = res.data.estateCertificateResponse.courtyardAddress || '';
        this.ruleForm.roomAddress = res.data.estateCertificateResponse.roomAddress || '';
        this.ruleForm.warrantSituation = res.data.estateCertificateResponse.warrantSituationName || '';
        this.ruleForm.estateCertificateUnitNo = res.data.estateCertificateResponse.estateCertificateUnitNo || '';
        this.ruleForm.propertyOrganName = res.data.estateCertificateResponse.propertyOrganName || '';
        if (res.data.estateCertificateResponse.registerDate) {
          this.ruleForm.registerDate = res.data.estateCertificateResponse.registerDate.substr(0,10);
        } else {
          this.ruleForm.registerDate = '';
        }
  
        this.ruleForm.licenceIssuingAuthority = res.data.estateCertificateResponse.licenceIssuingAuthority || '';
        this.ruleForm.rightType = res.data.estateCertificateResponse.rightType || '';
        this.ruleForm.rightNature = res.data.estateCertificateResponse.rightNature || '';
        this.ruleForm.rightOtherConditions = res.data.estateCertificateResponse.rightOtherConditions || '';
        this.ruleForm.landUsageTerm = res.data.estateCertificateResponse.landUsageTerm || '';
        this.ruleForm.ownershipCircumstance = res.data.estateCertificateResponse.ownershipCircumstance || '';
        this.ruleForm.landPlanningPurposes = res.data.estateCertificateResponse.landPlanningPurposesName || '';
        this.ruleForm.landArea = res.data.estateCertificateResponse.landArea || '';
        this.ruleForm.buildArea = res.data.estateCertificateResponse.buildArea || '';
        this.ruleForm.remark = res.data.estateCertificateResponse.remark || '';
        this.ruleForm.noEvidenceReason = res.data.estateCertificateResponse.noEvidenceReason || '';
        this.ruleForm.situationDescription = res.data.estateCertificateResponse.situationDescription || '';
        this.ruleForm.attachments = res.data.fileResponseList || [];
        this.setShowForm(res.data.estateCertificateResponse.warrantSituation)
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

