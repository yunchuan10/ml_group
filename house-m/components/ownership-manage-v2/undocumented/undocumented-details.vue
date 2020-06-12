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
              <th>房屋信息</th>
              <td>{{ruleForm.floorAddress}}</td>
            </tr>
            <tr>
              <th>未办证类型</th>

              <td>{{ruleForm.undocumentedType}}</td>
              <th>权属登记情况</th>
              <td>{{ruleForm.warrantSituation}}</td>
            </tr>
            <tr v-if="ruleForm.undocumentedType=='土地证'||ruleForm.undocumentedType=='土地证和房产证'">
              <th>未确权宗地面积</th>
              <td colspan='3'>{{ruleForm.landArea?ruleForm.landArea+'m²':''}}</td>
            </tr>
            <tr v-if="ruleForm.undocumentedType=='房产证'||ruleForm.undocumentedType=='土地证和房产证'">
              <th>未确权建筑面积</th>
              <td colspan='3'>{{ruleForm.buildArea?ruleForm.buildArea+'m²':''}}</td>
            </tr>
            <tr>
              <th>未办证原因</th>
              <td colspan="3">{{ruleForm.noEvidenceReason}}</td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <ul>
                  <li style="display: block;" v-for=" (item, index) in this.sysAttachmentInfoList" :key="index">{{index+1}}、{{item.name}}
                    <a target="_blank" :href="item.url">预览</a>
                  </li>
                </ul>
              </td>
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
        courtyardAddress: '',
        floorAddress: '',
        undocumentedType: '',
        warrantSituation: '',
        noEvidenceReason: '',
        buildArea: '',//建筑面积
        landArea: '',//宗地面积


      },
      sysAttachmentInfoList: [],//附件
      id: '',
      detailDialogShow: false // 弹出框开关
    };
  },
  activated() {
  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.storeysId = id
      this.detailDialogShow = true;
      this.getEditDataRequest(id);

    },
    getEditDataRequest() {
      let params = {
        id: this.storeysId
      }
      this.$axiosGet(API.no_certificate_detail, params).then(res => {
        this.ruleForm.courtyardAddress = res.data.courtyardAddress;
        this.ruleForm.floorAddress = res.data.floorAddress;
        this.ruleForm.undocumentedType = res.data.typeName;
        this.ruleForm.warrantSituation = res.data.warrantSituationName;
        this.ruleForm.noEvidenceReason = res.data.reason || '';
        this.ruleForm.buildArea = res.data.buildArea || '';
        this.ruleForm.landArea = res.data.landArea || '';
        this.sysAttachmentInfoList = res.data.fileResponseList || '';

        // if (res.data.sysAttachmentInfoList) {
        //   res.data.sysAttachmentInfoList.forEach((item, index) => {
        //     this.ruleForm.attachments.push({
        //       name: item.name,
        //       url: item.url
        //     })
        //   });
        // }
      })
    },
  }
};
</script>

