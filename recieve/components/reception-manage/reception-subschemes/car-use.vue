<template>
  <div class="section-content" v-loading="loading">
    <div class="reception-form">
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <!-- <div class="u-left-border-title">
          <h2>用车方案11</h2>
        </div> -->
        <div class="title">
          <h4 v-show="infoForm.addvehicle.length>0">用车方案</h4>
        </div>

        <!-- 空列表 -->
        <div class="m-programme-null" v-show="infoForm.addvehicle.length<=0 && !loading">
          <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
          <p>暂未添加用车方案！</p>
        </div>


        <el-form ref="infoForm" :model="infoForm">
          <div v-for="(item ,index) in infoForm.addvehicle" :key="index">

            <div class="form-options" style="align-items: center;margin-top: 10px;">
              <h5 class="text-h5">子方案号：{{item.subPlanNo}}</h5>
              <div class="z-programme-status" :class="'z-programme-status'+item.state" style="margin-top: -10px;">{{item.stateName}}</div>
            </div>
            <table class="h-table-info">
              <tr>
                <th>车辆要求</th>
                <td>
                    {{item.carRequire}}
                </td>
                <th><i class="f-color-red"></i>联系人</th>
                <td>
                    {{item.linkMan}}
                    <span style="margin: 0 10px;"></span>
                    {{item.phoneNo}}
                </td>
              </tr>
              <tr>
                <th>用车时间</th>
                <td>
                    {{item.useStartTime}} 
                    <span style="margin: 0 5px;">-</span> 
                    {{item.useEndTime}}
                </td>
                <th>用车范围</th>
                <td>
                    {{item.useRangeType}}
                </td>
              </tr>
              <tr>
                <th>随车人员</th>
                <td colspan="6">
                    {{item.followPersons}}
                </td>
              </tr>
              <tr class="z-accept-status">
                <th>接收方</th>
                <td>
                    {{item.receivePlatName}}
                </td>
                <th>车牌号</th>
                <td>
                    {{item.license}}
                </td>
              </tr>

              <tr class="z-accept-status">
                <th>驾驶员</th>
                <td>
                    {{item.driver}}
                    <span style="margin: 0 10px;"></span>
                    {{item.driverPhoneNo}} 
                </td>
                <th>备注</th>
                <td>
                    {{item.remark}}
                </td>
              </tr>
            </table>
          </div>
        </el-form>
        
      </div>
    </div>

  </div>

</template>

<script>
export default {
  data() {
    return {
      id: this.$route.query.id||'',       // 方案id
      type: this.$route.query.type||'',       
      planNo: this.$route.query.planNo||'',    
      planSubId: this.$route.query.planSubId||'',       // planSubId

      loading: false,

      carRequireList: [],
      statusList: [],   // 方案状态

      infoForm: {
        addvehicle: []
      },
      
    }
  },
  activated() {
    this.getCarRequire();
  },
  deactivated(){
    this.$destroy();
  },
  methods: {

    // 详情列表
    getDetailList(){
      let params = {planId: this.id};
      this.loading = true;
      this.$axiosGet(API.planCars_getAllPlanCarInfoList, params).then(res => {
        if(res && res.data){
          let addvehicle = res.data||[];
          addvehicle = addvehicle.map( item=>{
            let carOpt = this.carRequireList.find( car => (item.useRangeType==car.value) )||{};
            let statusOpt = this.statusList.find( status => (item.state==status.value) )||{};
            item.useRangeType = carOpt.name;
            item.stateName = statusOpt.name;
            item.useStartTime = this.$formatDate(item.useStartTime||'');
            item.useEndTime = this.$formatDate(item.useEndTime||'');
            return item;
          })
          this.infoForm.addvehicle = addvehicle;
        }
      }).finally(()=>{
        this.loading = false;
      });
    },

    // 获取用车范围
    getCarRequire(){
      let code = '/D04,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getDetailList();
        if(res && res.data){
          this.carRequireList = res.data.D04||[];
          this.statusList = res.data.D12||[];
        }
      });
    },


  }

}
</script>

<style lang="scss" scoped>
#trip-update {
  .main-height {
    height: calc(100% - 35px);
  }
  .form-options {
    display: flex;
    justify-content: space-between;
    .f-radio-group-width {
      margin: 0 28px;
      width: 220px;
    }
    .f-input-width {
      // width: 680px;
      width: 100%;
    }
    .f-input-tow-width {
      margin-left: 20px;
      width: 550px;
    }
  }
  .h-tab-content {
    .h-table-info {
      td {
        width: 500px;
      }
    }
  }

  .reception-form{
    // padding-top: 20px;
    .text-h5{
      padding-bottom: 10px;
    }
    .u-bread-text{
      margin-top: -3px;
    }
  }
}
</style>
