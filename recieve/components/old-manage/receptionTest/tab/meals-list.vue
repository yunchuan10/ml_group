<template>
  <div class="m-main">
    
    <div class="reception-form">
      <div class="h-tab-content" style="padding-bottom: 20px;">
        
        
        <!-- 空列表 -->
        <div class="m-programme-null" v-show="tableDate.length<=0">
          <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
          <p>暂未添加用餐方案！</p>
        </div>

        <el-form >
          <div v-for="(item ,index) in tableDate" :key="index">
            <div class="form-options" style="align-items: center;margin-top: 20px;">
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
                <td colspan="3">
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
      id:'',//查询主键
      planId:'',//主方案id
      planStatus:'',//方案状态
      planNo:'',//主方案号
      subPlanNo:'',//子方案号
      tableDate: [],//表格数据
      mealsTimesTypeList:[],
      mealsTypeList:[],
      statusList:[]

    };
  },
  activated() {
   
    this.id = this.$route.query.planSubId;
    this.subPlanNo = this.$route.query.subPlanNo
    this.planStatus = this.$route.query.planStatus
    this.planNo = this.$route.query.planNo
    this.planId = this.$route.query.planId
    this.getRequire()
    // this.getData();
  },
  methods: {
    getData(){
      let pagram = {
        planId:this.planId
      }
      this.$axiosGet(API.planMeals_getSysAllPlanMealsList ,pagram).then(res => {
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
          this.tableDate = addvehicle;
        }
       
      })

    },
    // 获取方案状态
    getRequire(){
      let code = '/D05,D06,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getData();
        if(res && res.data){
          this.mealsTimesTypeList = res.data.D05||[];
          this.mealsTypeList = res.data.D06||[];
          this.statusList = res.data.D12||[];
        }
      });
    },

  },
};
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
    padding-top: 10px;
    .text-h5{
      padding-bottom: 10px;
    }
    .u-bread-text{
      margin-top: -3px;
    }
  }
</style>
