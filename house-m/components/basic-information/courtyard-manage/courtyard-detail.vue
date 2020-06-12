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
        <div class="h-tab-content" style="margin: 0">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">院落名称</th>
              <td style="width:300px;">{{courtyardName}}</td>
              <th class="f-text-right">是否集中办公</th>
              <td>{{switchValue(centralOffice)}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地址</th>
              <td colspan="3">{{courtyardAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">院落航拍图</th>
              <td colspan="3">
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left f-padding-bottom-10px">
                <h2 class="h-table-subtitle">
                  <span></span>物业管理信息</h2>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">物业服务单位</th>
              <td>{{propertyList.houseManageCompanyName}}</td>
              <th class="f-text-right">物业类型</th>
              <td>{{propertyList.houseManageTypeName}}</td>
            </tr>
            <tr v-if="propertyList.houseManageType ==='SELF'">
              <th class="f-text-right">单位性质</th>
              <td>{{propertyList.organTypeName}}</td>
              <th class="f-text-right">合同物业费</th>
              <td>{{propertyList.contractCost ? propertyList.contractCost+' 元/年':''}}</td>
            </tr>
            <tr v-if="propertyList.houseManageType ==='OTHER'">
              <th class="f-text-right">政府采购</th>
              <td>{{propertyList.govermentBuyName}}</td>
              <th class="f-text-right">合同物业费</th>
              <td>{{propertyList.contractCost ? propertyList.contractCost+' 元/年':''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">负责人</th>
              <td>{{propertyList.responsiblePerson}}</td>
              <th class="f-text-right">负责人联系电话</th>
              <td>{{propertyList.responsiblePersonPhone}}</td>
            </tr>
            <tr>
              <th class="f-text-right">服务开始时间</th>
              <td>{{startTime}}</td>
              <th class="f-text-right">服务结束时间</th>
              <td>{{endTime}}</td>
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
      roomtotal: 0, // 数据总数
      roompageSize: 10, // 数据最大值
      roompage: 1, // 当前页 
      id: '',
      list: [], // table2列表数据集合
      roomlist: [], // table3 列表数据集合
      pageSelect: "",
      centralOffice: '', //是否集中办公
      houseManageCompanyName: '', //物业服务单位
      organTypeName: '', //单位性质
      houseManageTypeName: '', //物业类型 
      responsiblePerson: '', //负责人
      startTime: '', //开始日期
      endTime: '', //结束日期
      courtyardName: '', // 院落数据名称
      courtyardAddress: '', // 院落数据地址
      propertyList: {}, //物业信息集合
      imgUrl: [], // 院落数据图片

    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      this.getDataRequest()
      // this.getTableData()
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    //集中办公数据转换
    switchValue(value) {
      if (value) {
        if(value ==='YES'){
          return '是'
        }else {
          return '否'
        }    
      } else{
        return ''
      }
    },

    getDataRequest() {
      let params = {
        id: this.id,
        name: "",
      };
      this.$axiosGet(API.courtYard_queryDetail, params).then(res => {
        this.courtyardAddress = res.data.address;
        this.courtyardName = res.data.name;
        this.centralOffice = res.data.centralOffice || '';
        this.imgUrl = res.data.fileResponseList || [];
        res.data.serviceStartTime = res.data.serviceStartTime || '';
        res.data.serviceEndTime = res.data.serviceEndTime || '';
        this.startTime = res.data.serviceStartTime.substr(0, 10)||'';
        this.endTime = res.data.serviceEndTime.substr(0, 10)||'';

        let propertyList = {};

        propertyList.houseManageCompanyName = res.data.companyName||'';

        propertyList.houseManageTypeName = res.data.companyManageTypeName||'';
        propertyList.houseManageType = res.data.companyManageType||'';


        propertyList.organTypeName = res.data.companyOrganTypeName||'';
        propertyList.contractCost = res.data.companyContractCost||'';
        propertyList.govermentBuyName = res.data.companyGovermentBuyName||'';
        propertyList.responsiblePerson = res.data.responsiblePerson||'';
        propertyList.responsiblePersonPhone = res.data.responsiblePersonPhone||'';

        this.propertyList = propertyList;

      });
    }   
  }
};
</script>

<style lang="scss" scoped>
.house-nav-tab {
  margin-top: 0 !important;
}
</style>

