<template>
  <div class="section-content" v-loading="loading">
    <div class="reception-form">
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <div class="title">
          <h4 v-show="infoForm.addvehicle.length>0">用餐方案</h4>
        </div>
        
        <!-- 空列表 -->
        <div class="m-programme-null" v-show="infoForm.addvehicle.length<=0 && !loading">
          <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
          <p>暂未添加用餐方案！</p>
        </div>

        <el-form ref="infoForm" :model="infoForm">
          <div v-for="(item ,index) in infoForm.addvehicle" :key="index">
            <div class="form-options" style="align-items: center;margin-top: 10px;">
              <h5 class="text-h5">子方案号：{{item.subPlanNo}}</h5>
              <div class="z-programme-status" :class="'z-programme-status'+item.state" style="margin-top: -10px;">{{item.stateName}}</div>
            </div>

            <table class="h-table-info">
              <tr>
                <th>用餐时间</th>
                <td>
                  {{item.mealsStartTime}}
                  <span style="margin: 0 10px;"></span>
                  {{item.mealsTimesType}}
                </td>
                <th>酒店</th>
                <td>
                  {{item.hotelName}}
                </td>
              </tr>
              <tr>
                <th>餐厅</th>
                <td>
                  {{item.diningName}}
                </td>
                <th>用餐类型</th>
                <td>
                  {{item.mealsType}}
                </td>
              </tr>
              <tr>
                <th>用餐人数</th>
                <td>
                  {{item.mealsPersonNum}}
                </td>
                <th>陪餐人数</th>
                <td>
                  {{item.accompanyPersonNum}}
                </td>
              </tr>
              <tr>
                <th>联系人</th>
                <td>
                  {{item.linkMan}}
                </td>
                <th>备注</th>
                <td>
                  {{item.remark}}
                </td>

              </tr>
              <tr>
                <th>用餐人员</th>
                <td colspan="6">
                  {{item.mealsPersons}}
                </td>
              </tr>
              <tr>
                <th>陪餐人员</th>
                <td colspan="6">
                  {{item.accompanyPersons}}
                </td>
              </tr>

              <tr class="z-accept-status">
                <th>订单接收方</th>
                <td>
                    {{item.hotelName}}
                </td>
                <th>餐厅</th>
                <td>
                    {{item.diningName}}
                </td>
              </tr>

              <tr class="z-accept-status">
                <th>用餐开始时间</th>
                <td colspan="6">
                    {{item.mealsStartTime}} 
                </td>
                <!-- <th>用餐人数</th>
                <td>
                    {{item.mealsPersonNum}}
                </td> -->
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

      statusList: [],   // 方案状态
      
      roomTypeList: [], // 房间类型

      // 餐次类型
      mealsTimesTypeList: [],

      // 用餐类型
      mealsTypeList: [],

      //用餐
      infoForm: {
        addvehicle: [],
      },
      
    }
  },
  activated() {
    this.getRequire();
  },
  deactivated(){
    this.$destroy();
  },
  methods: {

    getDetailList(){
      let params ={planId: this.id};
      this.loading = true;
      this.$axiosGet(API.planMeals_getAllPlanMealsList, params).then(res => {
        if(res && res.data){
          let addvehicle = res.data||[];
          addvehicle = addvehicle.map( item=>{
            let mealsTimesOpt = this.mealsTimesTypeList.find( v => (item.mealsTimesType==v.value) )||{};
            let mealsOpt = this.mealsTypeList.find( v => (item.mealsType==v.value) )||{};
            let statusOpt = this.statusList.find( status => (item.state==status.value) )||{};
            
            item.mealsTimesType = mealsTimesOpt.name;
            item.mealsType = mealsOpt.name;
            item.stateName = statusOpt.name;
            item.mealsStartTime = this.$formatDate(item.mealsStartTime||'');
            return item;
          })
          this.infoForm.addvehicle = addvehicle;
        }
      }).finally(()=>{
        this.loading = false;
      });
    },

    // 获取方案状态
    getRequire(){
      let code = '/D05,D06,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getDetailList();
        if(res && res.data){
          this.mealsTimesTypeList = res.data.D05||[];
          this.mealsTypeList = res.data.D06||[];
          this.statusList = res.data.D12||[];
        }
      });
    },

  }
}
</script>


<style lang="scss" scoped>
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
    // .f-input-tow-width {
    //   margin-left: 20px;
    //   width: 550px;
    // }
  }
  .h-tab-content {
    .h-table-info {
      td {
        width: 500px;
      }
    }
  }

  .reception-form{
    // padding-top: 10px;
    .text-h5{
      padding-bottom: 10px;
    }
    .u-bread-text{
      margin-top: -3px;
    }
  }
</style>

