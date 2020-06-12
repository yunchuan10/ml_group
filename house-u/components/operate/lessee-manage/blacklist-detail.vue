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
            <a>合同情况</a>
          </li>
        </ul>

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">承租人名称</th>
              <td>{{lesseeDetail.name}}</td>
            </tr>
            <tr>
              <th class="f-text-right">联系电话</th>
              <td>{{lesseeDetail.phone}}</td>
            </tr>
            <tr>
              <th class="f-text-right">组织性质</th>
              <td>{{lesseeDetail.organizationalNatureName}}</td>
            </tr>
            <tr v-if="lesseeDetail.organizationalNatureName ==='法人'">
              <th class="f-text-right">法定代表</th>
              <td>{{lesseeDetail.legalRepresentative}}</td>
            </tr>
            <tr>
              <th class="f-text-right">经营范围</th>
              <td>{{lesseeDetail.scopeOfBusiness}}</td>
            </tr>
            <tr>
              <th class="f-text-right">身份证</th>
              <td>{{lesseeDetail.identificationCard}}</td>
            </tr>
            <tr>
              <th class="f-text-right">附件</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='property'">
          <div class="h-tab-content">
            <el-table :data="dealList" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" type="index" label="序号" width="55px">
                <!-- <template slot-scope="scope">
                  {{$serialUtils(pageSize, page, scope.row.num)}}
                </template> -->
              </el-table-column>
              <el-table-column label="合同编号" prop="contractNo" width='100px'>
                <template slot-scope="scope">
                  <a @click="basicInfoClick(scope.row.dealContractId)">{{scope.row.contractNo}}</a>
                </template>
              </el-table-column>
              <el-table-column label="合同开始日期" prop="startDate" :formatter="dateFormat">
              </el-table-column>
              <el-table-column label="合同结束日期" prop="endDate" :formatter="dateFormat">
              </el-table-column>
              <el-table-column label="承租人" prop="lesseeName">
              </el-table-column>
              <el-table-column label="租金（元/年）" prop="rental">
              </el-table-column>
              <el-table-column label="合同状态" prop="statusName">
                <!-- <template slot-scope="scope">
                  <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
                </template> -->
              </el-table-column>
              <el-table-column label="剩余天数" prop="remainingDays">
                <template slot-scope="scope">
                  <span class="f-color-red">{{scope.row.remainingDays}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <div class="h-table-bottom f-clearfix" style="margin-top:10px;">
            <div class="h-table-pages f-pull-right">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div> -->
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
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      lesseeManageId: '', //承租人id
      lesseeDetail: {}, //承租人详情
      list: [{
        orderNo: '20190815',
        startDay: '',
        endDay: '',
        lessee: '',
        rental: '',
        contractStatus: '',
        remind: '',
      }

      ], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      dealList: [], //合同列表集合
      pageSelect: "",
      courtyardName: '', // 院落数据名称
      roomBaseResponseList: [], //租金详情
      courtyardAddress: '', // 院落数据地址
      imgUrl: [], // 身份证数据图片

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.lesseeManageId = id;
      this.getDataRequest()
      // this.getList()
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },

    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    getDataRequest() {
      let params = {
        lesseeManageId: this.lesseeManageId,
      };
      this.$axiosGet(API.lessee_detail, params).then(res => {
        if (res.data) {
          this.lesseeDetail = res.data.lesseeManageResponse;
        }
        if (res.data.contractResponseList) {
          this.dealList = res.data.contractResponseList;
        }
        if (res.data.fileResponseAdapterList) {
          this.imgUrl = res.data.fileResponseAdapterList;
        }
      });
    },
    // 详情
    basicInfoClick(dealContractId) {
      this.carDetailShow = false;
      this.$router.push({ path: '/operate/contract-manage/contractinfo-list', query: { dealContractId: dealContractId } });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

