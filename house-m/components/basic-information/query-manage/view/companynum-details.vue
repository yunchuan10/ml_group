<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="800px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <!-- 土地证 -->
          <table class="h-table-info" v-show="typeId=='2' && this.warrant == '已统一登记到机关事务管理部门名下' && this.warrant == '登记在各部门或其他单位名下，已移交权属资料' && this.warrant == '登记再各部门或其他单位名下，未移交权属资料'">
            <tr>
              <th class="f-text-right">地址坐落</th>
              <td style="width: 200px;">{{list.courtyardAddress}}</td>
              <th class="f-text-right">权属登记情况</th>
              <td style="word-break:break-all">{{list.warrantSituationName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">土地证号</th>
              <td>{{list.landCertificateNo}}</td>
              <th class="f-text-right">产权单位</th>
              <td>{{list.propertyOrganName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">登记时间</th>
              <td>{{list.registerDate}}</td>
              <th class="f-text-right">发证机关</th>
              <td>{{list.licenceIssuingAuthority}}</td>
            </tr>
            <tr>
              <th class="f-text-right">取得价格</th>
              <td>{{list.gainThePrice}}万元</td>
              <th class="f-text-right">土地取得方式</th>
              <td>{{list.landAcquisitionModeName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">土地规划用途</th>
              <td>{{list.landPlanningPurposesName}}</td>
              <th class="f-text-right">土地使用年限</th>
              <td>{{list.landUsageTerm}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地号</th>
              <td>{{list.landNo}}</td>
              <th class="f-text-right">图号</th>
              <td>{{list.figureNo}}</td>
            </tr>
            <tr>
              <th class="f-text-right">使用权面积</th>
              <td>{{list.rightToUseArea ? list.rightToUseArea+'㎡': ''}}</td>
              <th class="f-text-right">其中：独有面积</th>
              <td>{{list.useAloneArea ? list.useAloneArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">其中：分摊面积</th>
              <td>{{list.apportionArea ? list.apportionArea+'㎡': ''}}</td>
              <th class="f-text-right">其中：住宅面积</th>
              <td>{{list.residentialArea ? list.residentialArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">其中：商业面积</th>
              <td>{{list.businessArea ? list.businessArea+'㎡': ''}}</td>
              <th class="f-text-right">备注</th>
              <td>{{list.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="list.sysAttachmentInfoList">
                  <img v-for="(item, index) in list.sysAttachmentInfoList" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>

          <!-- 房产证 -->
          <table class="h-table-info" v-show="typeId=='房产证' && this.warrant == '已统一登记到机关事务管理部门名下' && this.warrant == '登记在各部门或其他单位名下，已移交权属资料' && this.warrant == '登记再各部门或其他单位名下，未移交权属资料'">
            <tr>
              <th class="f-text-right">地址坐落</th>
              <td style="width: 200px;">{{list.courtyardAddress}}</td>
              <th class="f-text-right">权属登记情况</th>
              <td style="word-break:break-all">{{list.warrantSituationName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房产证号</th>
              <td>{{list.houseCertificateNo}}</td>
              <th class="f-text-right">产权单位</th>
              <td>{{list.propertyOrganName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">登记时间</th>
              <td>{{list.registerDate}}</td>
              <!-- <td>{{list.dateCheckOut?list.dateCheckOut.substr(0, 10):''}}</td> -->
              <th class="f-text-right">发证机关</th>
              <td>{{list.licenceIssuingAuthority}}</td>
            </tr>
            <tr>
              <th class="f-text-right">共有情况</th>
              <td>{{list.ownershipCircumstance}}</td>
              <th class="f-text-right">房屋取得方式</th>
              <td>{{list.houseAcquisitionModeName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">总层数</th>
              <td>{{list.totalStorey}}层</td>
              <th class="f-text-right">房屋规划用途</th>
              <td>{{list.housePlanningPurposesName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">土地使用年限</th>
              <td>{{list.landUsageTerm}}</td>
              <th class="f-text-right">地号</th>
              <td>{{list.landNo}}</td>
            </tr>
            <tr>
              <th class="f-text-right">图号</th>
              <td>{{list.figureNo}}</td>
              <th class="f-text-right">建筑面积</th>
              <td>{{list.rightToUseArea ? list.rightToUseArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">套内建筑面积</th>
              <td>{{list.rightToUseArea ? list.rightToUseArea+'㎡': ''}}</td>
              <th class="f-text-right">备注</th>
              <td>{{list.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="list.sysAttachmentInfoList">
                  <img v-for="(item, index) in list.sysAttachmentInfoList" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>

          <!-- 不动产证 -->
          <table class="h-table-info" v-show="typeId == '房产证' && this.warrant == '已统一登记到机关事务管理部门名下' && this.warrant == '登记在各部门或其他单位名下，已移交权属资料' && this.warrant == '登记再各部门或其他单位名下，未移交权属资料'">
            <tr>
              <th class="f-text-right">地址坐落</th>
              <td style="width: 200px;">{{list.courtyardAddress}}</td>
              <th class="f-text-right">权属登记情况</th>
              <td style="word-break:break-all">{{list.warrantSituationName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">不动产单元号</th>
              <td>{{list.estateCertificateUnitNo}}</td>
              <th class="f-text-right">产权单位</th>
              <td>{{list.propertyOrganName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">登记时间</th>
              <td>{{list.registerDate}}</td>
              <th class="f-text-right">发证机关</th>
              <td>{{list.licenceIssuingAuthority}}</td>
            </tr>
            <tr>
              <th class="f-text-right">权利类型</th>
              <td>{{list.rightType}}</td>
              <th class="f-text-right">权利性质</th>
              <td>{{list.rightNature}}</td>
            </tr>
            <tr>
              <th class="f-text-right">权利其他状况</th>
              <td>{{list.rightOtherConditions}}</td>
              <th class="f-text-right">土地规划用途</th>
              <td>{{list.landPlanningPurposesName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">土地使用年限</th>
              <td>{{list.landUsageTerm}}</td>
              <th class="f-text-right">共有情况</th>
              <td>{{list.ownershipCircumstance}}</td>
            </tr>
            <tr>
              <th class="f-text-right">宗地面积</th>
              <td>{{list.landArea ? list.landArea+'㎡': ''}}</td>
              <th class="f-text-right">房屋建筑面积</th>
              <td>{{list.buildArea ? list.buildArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{list.remark}}</td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="list.sysAttachmentInfoList">
                  <img v-for="(item, index) in list.sysAttachmentInfoList" :key="index" :src="item.url" v-show="item" style="width: 90px;height: 90px;,margin: 5px" />
                </viewer>
              </td>
            </tr>
          </table>

          <!-- 权属资料移交 -->
          <table class="h-table-info" v-show=" this.warrant == '未登记、已移交权属资料' && this.warrant == '未登记、未移交权属资料'">
            <tr>
              <th class="f-text-right">地址坐落</th>
              <td style="width: 200px;">{{list.roomNo}}</td>
              <th class="f-text-right">权属登记情况</th>
              <td style="word-break:break-all">{{list.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">未办证原因</th>
              <td colspan="3">{{list.noEvidenceReason}}</td>
            </tr>
          </table>
          <!-- 权属资料未移交 -->
          <table class="h-table-info" v-show=" this.warrant == '其他情况'">
            <tr>
              <th class="f-text-right">地址坐落</th>
              <td style="width: 200px;">{{list.courtyardAddress}}</td>
              <th class="f-text-right">权属登记情况</th>
              <td style="word-break:break-all">{{list.warrantSituationName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">情况说明</th>
              <td colspan="3">{{list.situationDescription}}</td>
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
      list: [],
      Id: '', //房间id
      typeId: '', //产权类型
      warrant: '', //证件情况
      carDetailShow: false, // 弹出框开关
    };
  },
  activated() {
    this.list = [];
  },
  methods: {
    // 初始化弹出框
    openModal(id, type, warrant) {
      this.carDetailShow = true;
      this.Id = id;
      this.typeId = type;
      this.warrant = warrant;
      this.getDetail();
    },
    getDetail() {
      if (this.type == '房产证') {
        let params = {
          id: this.Id,
        }
        this.$axiosGet(API.housePropertyArchives_detail, params).then(res => {
          if (res.data) {
            this.list = res.data.propertyArchivesResponse || [];
          }
        })
      } else if (this.type == '土地证') {
        let params = {
          id: this.Id,
        }
        this.$axiosGet(API.landArchives_detail, params).then(res => {
          if (res.data) {
            this.list = res.data.landArchivesResponse || [];
          }
        })
      } else { //不动产
        let params = {
          id: this.Id,
        }
        this.$axiosGet(API.estateCertificate_detail, params).then(res => {
          if (res.data) {
            this.list = res.data.estateCertificateResponse || [];
          }
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0;
}
</style>

