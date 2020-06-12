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
            <a>基础信息</a>
          </li>
          <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>合同记录</a>
          </li>
          <li @click="pageSelect = 'idleReson'" :class="{'active':pageSelect=='idleReson'}">
            <a>闲置原因记录</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'" style="marign:0 !important;">
          <div>
            <table class="h-table-info ">
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left" style="padding:20px 10px 10px;">
                  <h2 class="h-table-subtitle">
                    <span></span>基本信息</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">街道</th>
                <td>{{houseDetail.street || ''}}</td>
                <th class="f-text-right">门牌号</th>
                <td>{{houseDetail.houseNo || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">地址</th>
                <td colspan="3">{{ houseDetail.houseAddress || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">经营面积</th>
                <td>{{houseDetail.area?houseDetail.area+'m²': ''}}</td>
                <th class="f-text-right">取得方式</th>
                <td>{{houseDetail.acquisitionModeName || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">经营间数</th>
                <td>{{houseDetail.houseNum?houseDetail.houseNum+'间' : ''}}</td>
                <th class="f-text-right">产权单位</th>
                <td>{{houseDetail.propertyOrganName || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">权证编号</th>
                <td>{{houseDetail.warrantNo || ''}}</td>
                <th class="f-text-right">土地证号</th>
                <td>{{houseDetail.landCertificateNo || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">照片信息</th>
                <td colspan="3">
                  <viewer :images="attachmentUrls">
                    <img v-for="(item, index) in attachmentUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                  </viewer>
                </td>

              </tr>
            </table>
          </div>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='property'" style="padding-top: 15px">
          <el-timeline>
            <el-timeline-item placement="top" v-for="(item,index) in contractList" :key="index">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state s-state-apply">出租中</span>
                </div>
                <ul class="u-history-ul">
                  <li>开始日期：{{formartDate(item.startDate)}}</li>
                  <li>结束日期：{{formartDate(item.endDate)}}</li>
                  <li>合同编号：
                    <a :title="item.contractNo" @click="basicDetailClick(item.id)">{{item.contractNo | ellipsis}}</a>
                  </li>
                  <li>承租人：{{item.lesseeName}}</li>
                  <li>租金：{{item.rental}}元/年</li>
                </ul>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div class="f-default-text" v-show="contractList !=undefined && contractList.length === 0">暂无合同信息</div>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='idleReson'" style="padding-top: 15px">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in idleResonList" :key="index" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state s-state-apply">闲置</span>
                </div>
                <ul class="u-history-ul">
                  <li>开始日期：{{formartDate(item.startDate)}}</li>
                  <li>结束日期：
                    <span v-if="item.endDateString ==='至今'">至今</span>
                    <span v-if="item.endDateString === null"></span>{{formartDate(item.endDate)}}</li>
                  <li>闲置原因：{{item.idleReasonName?item.idleReasonName:'暂无'}} </li>
                </ul>
              </el-card>
            </el-timeline-item>

          </el-timeline>
        </div>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
  </div>
</template>

<script>
import basicDetail from '@/components/operate/contract-manage/contract-detail'; // 合同详情弹出框
export default {
  components: {
    'basic-detail': basicDetail,
  },
  filters: {
    ellipsis(value) {
      if (!value) return '0'
      value = value.toString();
      if (value.length > 8) {
        return value.substring(0, 8) + '...'
      }
      return value;
    }
  },
  data() {
    return {
      storeysName: '',
      courtyardName: '',
      floorName: '',
      roomBaseResponseList: [],
      carDetailShow: false, // 弹出框开关
      warrantSituation: '',
      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      houseDetail: {}, //房屋详情集合
      idleResonList: [], //闲置原因记录集合
      contractList: [], //合同记录集合
      list: [], // 合同信息列表数据集合
      pageSelect: "",
      ownershipFirstId: '',// 权属id
      houseCertificateNo: '',//房产证号
      landCertificateNo: '',//土地证号
      registerDate: '',//登记日期
      situationDescription: '', // 情况说明
      noEvidenceReason: '', // 未办证原因
      propertyOrganName: '',//产权单位
      estateCertificateNo: '', // 不动产证号
      attachmentUrls: [] //附件集合
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      this.getDataRequest()
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    getDataRequest() {
      let params = {
        houseId: this.id,
      };
      this.$axiosGet(API.dealhouse_detail, params).then(res => {
        this.attachmentUrls = res.data.fileResponseList;
        this.houseDetail = res.data.houseResponse;
        this.idleResonList = res.data.idleReasonResponseList;
        this.contractList = res.data.contractResponseList;
        // if (res.data.dealHouseResponse.registerDate) {
        //   this.registerDate = DATEFORMAT.dateReturn(new Date(res.data.dealHouseResponse.registerDate))
        // } else {
        //   this.registerDate = '';
        // }
        // this.list = res.data.dealContractResponseList;
      });
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    //表格列表日期转换
    formartDate(value) {
      if (value) {
        return value.substr(0, 10);
      } else {
        return '';
      }
    },

    // 详情
    basicDetailClick(id) {
      this.$refs.basicDetail.openModal(id);
    },

    // // 详情
    // basicInfoClick(dealContractId) {
    //   this.carDetailShow = false;
    //   this.$router.push({ path: '/operate/contract-manage/contractinfo-list', query: { dealContractId: dealContractId } });
    // },
  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: -5px !important;
}
.f-margin-upd {
  margin-bottom: 10px;
}
.u-history-ul {
  display: -webkit-flex; /* Safari */
  display: flex;
  li {
    flex: 1;
  }
}
</style>