<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>权属登记</a>
          </li>
          <li v-if="transferStatus === 'YES'" @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>转移登记</a>
          </li>
          <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
            <a>房屋信息</a>
          </li>
        </ul>
        <div v-show="pageSelect=='basic'">
          <div class="h-tab-content">
            <table class="h-table-info ">
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px">
                  <h2 class="h-table-subtitle">
                    <span></span>房屋信息</h2>
                </td>
              </tr>
              <tr>
                <th>房屋坐落位置</th>
                <td colspan="3">{{houseLocation}}</td>
              </tr>
              <tr>
                <th class="f-text-right">房屋取得方式</th>
                <td>{{houseAcquisitionMode}}</td>
                <th class="f-text-right">房屋价值</th>
                <td>{{houseValue}}
                  <span v-show="houseValue">万元</span>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">房屋面积</th>
                <td>{{houseArea}}</td>
                <th class="f-text-right">建筑结构</th>
                <td>{{houseStructure}}</td>
              </tr>
              <tr>
                <th class="f-text-right">竣工日期</th>
                <td>{{completionDate?completionDate.substr(0, 10):''}}</td>
                <th class="f-text-right">投入使用日期</th>
                <td>{{putUseDate?putUseDate.substr(0, 10):''}}</td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px">
                  <h2 class="h-table-subtitle">
                    <span></span>土地情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">宗地面积</th>
                <td>{{landArea}}</td>
                <th class="f-text-right">土地取得方式</th>
                <td>{{landAcquisitionMode}}</td>
              </tr>
              <tr>
                <th class="f-text-right">土地价值</th>
                <td>{{landValue}}
                  <span v-show="landValue">万元</span>
                </td>
                <th class="f-text-right">取得日期</th>
                <td>{{acquisitionDate?acquisitionDate.substr(0, 10):''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">采购组织形式</th>
                <td colspan="3">{{procurementOrganizationForm}}</td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px">
                  <h2 v-if="houseAcquisitionMode !== '租借'" class="h-table-subtitle">
                    <span></span>产权登记情况</h2>
                  <h2 v-else class="h-table-subtitle">
                    <span></span>租借登记情况</h2>
                </td>
              </tr>
              <tr v-if="houseAcquisitionMode !== '租借'">
                <th class="f-text-right">产权是否办理</th>
                <td colspan="3" style="color: red;">{{warrantSituation}}</td>
              </tr>
              <tr v-if="houseAcquisitionMode !== '租借' && (warrantSituation === '已办理，且两证分离' || warrantSituation === '仅办理房产证' || warrantSituation === '仅办理土地证')">
                <th class="f-text-right">房产证号</th>
                <td>{{houseCertificateNo}}</td>
                <th class="f-text-right">土地证号</th>
                <td>{{landCertificateNo}}</td>
              </tr>
              <tr v-if="houseAcquisitionMode !== '租借' && warrantSituation === '已办理，且两证合一'">
                <th class="f-text-right">不动产证号</th>
                <td colspan="3">{{estateCertificateNo}}</td>
              </tr>
              <!-- <tr v-if="houseAcquisitionMode !== '租借' && warrantSituation !== '产权待界定'">
                <th class="f-text-right">{{warrantSituation === '产权未办理'?'未办证原因':'登记日期'}}</th>
                <td v-if="warrantSituation === '产权未办理'">{{noEvidenceReason}}</td>
                <td v-else>{{registerDate?registerDate.substr(0, 10):''}}</td>
                <th class="f-text-right">产权单位</th>
                <td>{{propertyOrganName}}</td>
              </tr> -->
              <tr v-if="houseAcquisitionMode !== '租借' && warrantSituation !== '产权待界定' && warrantSituation !== '产权未办理'">
                <th class="f-text-right">登记日期</th>
                <td>{{registerDate?registerDate.substr(0, 10):''}}</td>
                <th class="f-text-right">产权单位</th>
                <td>{{propertyOrganName}}</td>
              </tr>

              <tr v-if="houseAcquisitionMode !== '租借' && warrantSituation === '产权未办理'">
                <th class="f-text-right">未办证原因</th>
                <td colspan="3">{{noEvidenceReason}}</td>
              </tr>
              <tr v-if="houseAcquisitionMode !== '租借' && warrantSituation === '产权待界定'">
                <th class="f-text-right">情况说明</th>
                <td colspan="3">{{situationDescription}}</td>
              </tr>
              <tr v-if="houseAcquisitionMode === '租借'">
                <th class="f-text-right">租借日期</th>
                <td colspan="3">{{rentDate}}</td>
              </tr>
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <img v-for="(item, index) in attachmentUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" /></td>
              </tr>
            </table>
          </div>
        </div>

        <div v-if="pageSelect=='property' && transferStatus === 'YES'">
          <div class="h-tab-content">
            <table class="h-table-info ">
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px">
                  <h2 class="h-table-subtitle">
                    <span></span>产权转移情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">移交单位</th>
                <td>{{ownershipTransferBaseResponse.handleOrganName}}</td>
                <th class="f-text-right">接收单位</th>
                <td>{{ownershipTransferBaseResponse.receiveOrganName}}</td>
              </tr>
              <tr>
                <th class="f-text-right">移交经办人</th>
                <td>{{ownershipTransferBaseResponse.handleName}}</td>
                <th class="f-text-right">移交时间</th>
                <td>
                  {{ownershipTransferBaseResponse.dateTransfer}}
                </td>
              </tr>
              <tr>
                <th class="f-text-right">转移原因</th>
                <td colspan="3">{{ownershipTransferBaseResponse.reasonOfTransfer}}</td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px">
                  <h2 class="h-table-subtitle">
                    <span></span>产权登记情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">产权是否办理</th>
                <td colspan="3" style="color: red;">{{ownershipTransferBaseResponse.warrantSituation}}</td>
              </tr>
              <tr v-if="(ownershipTransferBaseResponse.warrantSituation === '已办理，且两证分离' || ownershipTransferBaseResponse.warrantSituation === '仅办理房产证' || ownershipTransferBaseResponse.warrantSituation === '仅办理土地证')">
                <th class="f-text-right">房产证号</th>
                <td>{{ownershipTransferBaseResponse.houseCertificateNo}}</td>
                <th class="f-text-right">土地证号</th>
                <td>{{ownershipTransferBaseResponse.landCertificateNo}}</td>
              </tr>
              <tr v-if="ownershipTransferBaseResponse.warrantSituation === '已办理，且两证合一'">
                <th class="f-text-right">不动产证号</th>
                <td colspan="3">{{ownershipTransferBaseResponse.estateCertificateNo}}</td>
              </tr>
              <tr v-if="ownershipTransferBaseResponse.warrantSituation === '产权未办理'">
                <th class="f-text-right">未办证原因</th>
                <td colspan="3">{{ownershipTransferBaseResponse.noEvidenceReason}}</td>
              </tr>
              <tr v-if="ownershipTransferBaseResponse.warrantSituation !== '产权待界定' && ownershipTransferBaseResponse.warrantSituation !== '产权未办理' ">
                <th class="f-text-right">登记日期</th>
                <td>{{ownershipTransferBaseResponse.registerDate}}</td>
                <th class="f-text-right">产权单位</th>
                <td>{{ownershipTransferBaseResponse.propertyOrganName}}</td>
              </tr>
              <!-- <tr>
                <th class="f-text-right">不动产证号</th>
                <td>{{ownershipTransferBaseResponse.estateCertificateNo}}</td>
                <th class="f-text-right">登记时间</th>
                <td>{{ownershipTransferBaseResponse.registerDate?ownershipTransferBaseResponse.registerDate.substr(0, 10):''}}</td>
              </tr> -->
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <viewer :images="ownershipTransferBaseResponse.fileResponse">
                    <img v-for="(item, index) in ownershipTransferBaseResponse.fileResponse" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                  </viewer>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div v-if="pageSelect=='houseinfo'">
          <div class="h-tab-content">
            <p class="f-color-red f-margin-bottom">*以下房屋信息为您在权属管理中登记的房屋。</p>
            <table class="h-table-info ">
              <tbody v-for="(floor, index) in roomInfoList" :key="index">
                <tr v-if="floor.children[0].children != null">
                  <th nowrap style="width:400px;" :rowspan="floor.children[0].children.length + 1">{{floor.label}}{{floor.children[0].label}}</th>
                </tr>
                <tr v-for="(storeys, storeysIndex) in floor.children[0].children" :key="storeysIndex">
                  <td class="f-text-center">{{storeys.label}}</td>
                  <td class="f-text-center f-cancel-padding">
                    <div :style="roomIndex === 0?'':'border-top:1px solid #dcdfe6;'" style="padding:15px 10px;" v-for="(room, roomIndex) in storeys.children" :key="roomIndex">{{room.label}}</div>
                  </td>
                  <!-- <td class="f-text-center">201</td> -->
                </tr>
              </tbody>

            </table>
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
      carDetailShow: false, // 弹出框开关
      pageSelect: "",
      ownershipFirstId: '',// 权属id
      houseLocation: '',//房屋坐落位置
      houseAcquisitionMode: '',//房屋取得方式
      houseValue: '',//房屋价值
      houseArea: '',//房屋面积
      houseStructure: '',//建筑结构
      completionDate: '',//竣工日期
      putUseDate: '',//投入使用日期
      landArea: '',//宗地面积
      landAcquisitionMode: '',//土地取得方式
      landValue: '',//土地价值
      acquisitionDate: '',//取得日期
      procurementOrganizationForm: '', //采购组织形式
      houseCertificateNo: '',//房产证号
      landCertificateNo: '',//土地证号
      registerDate: '',//登记日期
      situationDescription: '', // 情况说明
      noEvidenceReason: '', // 未办证原因
      propertyOrganName: '',//产权单位
      receiveOrganName: '', //接收单位
      handleOrganName: '', //移交单位名称
      handleName: '', //移交经办人
      dateTransfer: '',//移交时间
      reasonOfTransfer: '', //移交原因
      warrantSituation: '', //产权是否办理
      estateCertificateNo: '', // 不动产证号
      rentDate: '',
      id: '',
      attachmentUrls: [],
      transferStatus: '', // 产权是否转移
      ownershipTransferBaseResponse: {}, // 转移数据
      roomInfoList: [] // 房屋信息集合
    };
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(id, transferStatus) {
      this.transferStatus = transferStatus;
      this.getDataRequest(id, transferStatus);
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    getDataRequest(id, transferStatus) {
      let params = {
        ownershipFirstId: id,
        transferStatus: transferStatus
      }
      this.$axiosPost(API.ownershipFirst_detail, params).then(res => {
        if (res.data) {
          this.ownershipFirstId = res.data.ownershipFirstId;
          this.houseLocation = res.data.houseLocation;
          this.houseAcquisitionMode = res.data.houseAcquisitionMode;
          this.houseValue = res.data.houseValue;
          this.houseArea = res.data.houseArea;
          if (res.data.rentDate) {
            this.rentDate = DATEFORMAT.dateReturn(new Date(res.data.rentDate));
          } else {
            this.rentDate = '';
          };
          this.houseStructure = res.data.houseStructure;
          if (res.data.completionDate) {
            this.completionDate =res.data.completionDate;
          } else {
            this.completionDate = '';
          };
          if (res.data.putUseDate) {
            this.putUseDate =res.data.putUseDate;
          } else {
            this.putUseDate = '';
          };
          this.landArea = res.data.landArea;
          this.landAcquisitionMode = res.data.landAcquisitionMode;
          this.landValue = res.data.landValue;
          if (res.data.acquisitionDate) {
            // this.acquisitionDate = DATEFORMAT.dateReturn(new Date(res.data.acquisitionDate));
            this.acquisitionDate =res.data.acquisitionDate;
          } else {
            this.acquisitionDate = '';
          };

          this.procurementOrganizationForm = res.data.procurementOrganizationForm;
          this.houseCertificateNo = res.data.houseCertificateNo;
          this.landCertificateNo = res.data.landCertificateNo;
          if (res.data.registerDate) {
            this.registerDate = DATEFORMAT.dateReturn(new Date(res.data.registerDate));
          } else {
            this.registerDate = '';
          };
          this.situationDescription = res.data.situationDescription;
          this.estateCertificateNo = res.data.estateCertificateNo;
          this.propertyOrganName = res.data.propertyOrganName;
          this.attachmentUrls = res.data.fileResponse;
          this.noEvidenceReason = res.data.noEvidenceReason;
          this.warrantSituation = res.data.warrantSituation;
          this.roomInfoList = res.data.courtyAndFloorAndStoreysAndRooms;
          this.ownershipTransferBaseResponse = res.data.ownershipTransferBaseResponse || {};

          if (res.data.ownershipTransferBaseResponse && res.data.ownershipTransferBaseResponse.dateTransfer) {
            this.ownershipTransferBaseResponse.dateTransfer = DATEFORMAT.dateReturn(new Date(res.data.ownershipTransferBaseResponse.dateTransfer));
          } else {
            this.ownershipTransferBaseResponse.dateTransfer = '';
          };

          if (res.data.ownershipTransferBaseResponse && res.data.ownershipTransferBaseResponse.registerDate) {
            this.ownershipTransferBaseResponse.registerDate = DATEFORMAT.dateReturn(new Date(res.data.ownershipTransferBaseResponse.registerDate));
          } else {
            this.ownershipTransferBaseResponse.registerDate = '';
          };
        } else {
          this.situationDescription = '';
          this.estateCertificateNo = '';
          this.propertyOrganName = '';
          this.attachmentUrls = [];
          this.noEvidenceReason = '';
          this.warrantSituation = '';
          this.roomInfoList = '';

        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
.h-table-subtitle {
  margin: 0;
}
.f-padding-bottom-10px {
  padding-bottom: 10px !important;
}
</style>

