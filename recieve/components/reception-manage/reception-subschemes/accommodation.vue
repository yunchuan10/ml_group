<template>
  <div class="section-content" v-loading="loading">
    
    <div class="reception-form">
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <div class="title">
          <h4 v-show="infoForm.addvehicle.length>0">住宿方案</h4>
        </div>

        <!-- 空列表 -->
        <div class="m-programme-null" v-show="infoForm.addvehicle.length<=0 && !loading">
          <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
          <p>暂未添加住宿方案！</p>
        </div>

        <el-form ref="infoForm" :model="infoForm">
          <div v-for="(item ,index) in infoForm.addvehicle" :key="index">
            <div class="form-options" style="align-items: center;margin-top: 10px;">
              <h5 class="text-h5">子方案号：{{item.subPlanNo}}</h5>
              <div class="z-programme-status" :class="'z-programme-status'+item.state" style="margin-top: -10px;">{{item.stateName}}</div>
            </div>
            <table class="h-table-info">
              <tr>
                <th>入住时间</th>
                <td>
                  {{item.stayStartTime}}
                  <span style="margin: 0 10px;">-</span>
                  {{item.stayEndTime}}
                </td>
                <th>入住酒店</th>
                <td>
                  <div class="form-options">
                    {{item.hotelName}}
                  </div>
                </td>
              </tr>
              <tr>
                <th>入住房型</th>
                <td>
                  {{item.roomType}}
                </td>
                <th>备注</th>
                <td>
                  {{item.remark}}
                </td>
                <!-- <th>房型数量</th>
                <td>
                  {{item.roomNum}}
                </td> -->
              </tr>

              <tr>
                <th>入住人员</th>
                <td colspan="6">
                  {{item.roomPersons}}
                </td>
              </tr>

              <tr class="z-accept-status">
                <th>订单接收方</th>
                <td>
                  {{item.hotelName}}
                </td>
                <th>房间号</th>
                <td>
                  {{item.roomName}}
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

      statusList: [],   // 方案状态
      
      roomTypeList: [], // 房间类型

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

    // 详情列表
    getDetailList(){
      this.loading = true;
      this.$axiosGet(API.planAccommodation+'/'+this.id).then(res => {
        if(res && res.data){
          let addvehicle = res.data||[];
          addvehicle = addvehicle.map( item=>{
            let carOpt = this.roomTypeList.find( car => (item.roomType==car.value) )||{};
            let statusOpt = this.statusList.find( status => (item.state==status.value) )||{};
            item.roomType = carOpt.name;
            item.stateName = statusOpt.name;
            item.stayStartTime = this.$formatDate(item.stayStartTime||'');
            item.stayEndTime = this.$formatDate(item.stayEndTime||'');
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
      let code = '/D03,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getDetailList();
        if(res && res.data){
          this.roomTypeList = res.data.D03||[];
          this.statusList = res.data.D12||[];
        }
      });
    },

  }


}
</script>


<style lang="scss" scoped>
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
  .options-tow-width{
    width: 300px;
    .el-input{
      width: 300px;
    }
  }
</style>
