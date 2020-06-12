<template>

  <div id="trip-update">
    <section class="m-main">
      <div class="m-main">
        <div class="m-breadcrumb">
          <Y-Breadcrumb title="接待任务" :item="['接待任务','子方案详情']" type="1"></Y-Breadcrumb>
          <div class="u-bread-btn-group">
            <div class="f-pull-right u-bread-btn f-cursor-pointer" @click="$router.go(-1)">
              返回
            </div>
          </div>
        </div>
        <div class="reception-form">
          <div class="h-tab-content" style="padding-bottom: 20px;">
            <!-- 空列表 -->
            <div class="m-programme-null" v-show="tableDate.length<=0">
              <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
              <p>暂未添加用车方案！</p>
            </div>


            <el-form >
              <div v-for="(item ,index) in tableDate" :key="index">

                <div class="form-options" style="align-items: center;margin-top: 20px;">
                  <h5 class="text-h5">子方案号：{{item.subPlanNo}}</h5>
                  <div class="z-programme-status" :class="'z-programme-status'+item.state" style="margin-top: -10px;">{{item.stateName}}</div>
                </div>
                <table class="h-table-info">
                  <tr>
                    <th>车辆要求</th>
                    <td>
                        {{item.carRequire}}
                    </td>
                    <th>联系人</th>
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
    </section>
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
      carRequireList:[],
      statusList:[],
    };
  },
  activated() {
   
    this.id = this.$route.query.planSubId;
    this.subPlanNo = this.$route.query.subPlanNo
    this.planStatus = this.$route.query.planStatus
    this.planNo = this.$route.query.planNo
    this.planId = this.$route.query.planId
    this.getCarRequire();
    
  },
  methods: {
    getData(){
      let pagram = {
        planId:this.planId
      }
      this.$axiosGet(API.planCars_getSysAllPlanCarInfoList ,pagram).then(res => {
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
          this.tableDate = addvehicle;
        }
       
      })

    },
    // 获取用车范围
    getCarRequire(){
      let code = '/D04,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getData();
        if(res && res.data){
          this.carRequireList = res.data.D04||[];
          this.statusList = res.data.D12||[];
        }
      });
    },
    goBack(){
      this.$router.go(-1)
      // this.$router.push({ path: '/old-manage/receptionTest/tab-select/receptionTestList' })
    },
  }
};
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
    padding-top: 20px;
    .text-h5{
      padding-bottom: 10px;
    }
    .u-bread-text{
      margin-top: -3px;
    }
  }
}
</style>