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
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>合同正文</a>
          </li>
          <li @click="pageSelect = 'rental'" :class="{'active':pageSelect=='rental'}">
            <a>租金入账情况</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">合同编号</th>
              <td>{{contractDetail.contractNo || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同开始日期</th>
              <td>{{startDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同结束日期</th>
              <td>{{endDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同标的物</th>
              <td>{{constractSubject}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同租金</th>
              <td>{{contractDetail.rental?contractDetail.rental+'元/年' : ''}}
                <!-- <span v-show="contractDetail.contractRental != ''">元/年</span> -->
              </td>
            </tr>
            <tr>
              <th class="f-text-right">出租方</th>
              <td>{{contractDetail.rentOrgan || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">承租人</th>
              <td>{{contractDetail.lesseeName || ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">合同状态</th>
              <td>{{contractDetail.statusName}}</td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='property'">
          <div class="h-tab-content" v-html="content">
          </div>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='rental'">
          <div class="h-table f-relative">
            <el-table :data="list" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" label="序号" width="100">
                <template slot-scope="scope">
                  {{scope.row.serialNumber}}
                </template>
              </el-table-column>
              <el-table-column label="租金起始日期">
                <template slot-scope="scope">
                  {{scope.row.startDate}}
                </template>

              </el-table-column>
              <el-table-column label="租金时长">
                <template slot-scope="scope">
                  {{scope.row.duration}}
                </template>
              </el-table-column>
              <el-table-column label="租金金额（元）">
                <template slot-scope="scope">
                  {{scope.row.money}}
                </template>
              </el-table-column>
              <el-table-column label="租金入账情况">
                <template slot-scope="scope">
                  {{scope.row.informationName}}
                </template>
              </el-table-column>
              <el-table-column label="未入账原因">
                <template slot-scope="scope">
                  {{scope.row.reasonNotBook}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">身份证</th>
              <td>
                <viewer :images="idCardImgA">
                  <img v-for="(item, index) in idCardImgA" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
                <viewer :images="idCardImgB">
                  <img v-for="(item, index) in idCardImgB" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">营业执照</th>
              <td>
                <viewer :images="imgUrls">
                  <img v-for="(item, index) in imgUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">相关附件</th>
              <td>
                <viewer :images="domains">
                  <img v-for="(item, index) in domains" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
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
      carDetailShow: false, // 弹出框开关
      datas: '', //页面基础数据
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      contractDetail: {}, //合同详情
      startDate: '', //开始日期
      endDate: '', //结束日期
      contractSubjectList: [], //合同标的物
      constractSubject: '',
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      mainId: '', //合同主键
      beOverduelist: [], //过期提醒数据集合
      list: [], // 租金数据集合
      pageSelect: "",
      courtyardName: '', // 院落数据名称
      courtyardAddress: '', // 院落数据地址
      idCardImgA: [], //身份证正面
      idCardImgB: [], //身份证反面
      imgUrls: [], //营业执照
      domains: [], //附件图片
      content: '', //正文内容

    };
  },
  activated() {
    this.content = '';
    this.id = this.$route.query.id;
  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      this.getDataRequestBasics();
      // this.getDataRequestText();
      // this.getDataRequestRemind();//合同到期提醒
      this.getDataRequestDisplay();
      // this.getDataRequestEnclosure();
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    getDataRequestBasics() {
      let params = {
        contractId: this.id,
      };
      this.$axiosGet(API.contract_getContractDetail, params).then(res => {
        if (res.data) {
          this.contractDetail = res.data.contractResponse;
        }
        if (res.data.contractResponse.startDate) {
          this.startDate = FORMATGET.formatGET(new Date(res.data.contractResponse.startDate));
        } else {
          this.startDate = '';
        }
        if (res.data.contractResponse.endDate) {
          this.endDate = FORMATGET.formatGET(new Date(res.data.contractResponse.endDate));
        } else {
          this.endDate = '';
        }
        this.contractSubjectList = res.data.contractResponse.contractSubjectResponseList;
        this.constractSubject = '';
        this.contractSubjectList.forEach((item, index) => {
          if (this.contractSubjectList.length == (index + 1)) {
            this.constractSubject += item.houseAddress;
          } else {
            this.constractSubject += item.houseAddress + ',';
          }
        })
        this.idCardImgA = res.data.front_of_id_card || [];
        this.idCardImgB = res.data.reverse_of_id_card || [];
        this.imgUrls = res.data.business_license || [];
        this.domains = res.data.note_info_list || [];
        this.content = res.data.contractResponse.text || '';
      });
    },
    //租金信息
    getDataRequestDisplay() {
      let params = {
        contractId: this.id,
      };
      this.$axiosGet(API.rent_getContractRental, params).then(res => {
        this.list = res.data;
        res.data.forEach((row, index) => {
          this.list[index].startDate = FORMATGET.formatGET(new Date(row.startDate));
        })
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.house-nav-tab {
  margin-top: 0 !important;
}
</style>

