<template>
  <div class="m-main">
    <div class="reception-form">
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <!-- 空列表 -->
        <div class="m-programme-null" v-show="tableData.length<=0">
          <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
          <p>暂未添加住宿方案！</p>
        </div>

        <el-form>
          <div v-for="(item ,index) in tableData" :key="index">
            <div class="form-options" style="align-items: center;margin-top: 20px;">
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
                <td >
                  {{item.remark}}
                </td>
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
      planStatus:'未办理',//方案状态
      planNo:'',//主方案号
      subPlanNo:'',//子方案号
      id:'',//子方案查询id
      planId:'',//主方案id
      tableData: [],//表格数据
      roomTypeList:[],
      statusList:[],
    };
  },
  activated() {
    this.id = this.$route.query.planSubId;
    this.planNo = this.$route.query.planNo
    this.subPlanNo = this.$route.query.subPlanNo,
    this.planStatus = this.$route.query.planStatus
    this.planId = this.$route.query.planId
    this.getRequire();
  },
  methods: {
    getData(){
      this.$axiosGet(API.planAccommodation + '/' + this.planId).then(res => {
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
          this.tableData = addvehicle;
        }
       
      })

    },
    getRequire(){
      let code = '/D03,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getData();
        if(res && res.data){
          this.roomTypeList = res.data.D03||[];
          this.statusList = res.data.D12||[];
        }
      });
    },

  },
};
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
    padding-top: 20px;
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

 

 <style >
.el-table,
.el-table thead {
  background: rgba(247, 250, 255, 1);
}
.title {
  text-align: center;
}
.plan-num {
  float: right;
}
.plan{
  margin-bottom: 10px;
}
#planId th {
  font-weight: bold;
}
#planId td {
  font-weight: bold;
}
</style>