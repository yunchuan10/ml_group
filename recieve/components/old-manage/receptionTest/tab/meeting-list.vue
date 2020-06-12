
<template>
  <div class="m-main">
    <div class="reception-form">
      <div class="h-tab-content" style="padding-bottom: 20px;">
        

        <!-- 空列表 -->
        <div class="m-programme-null" v-show="tableDate.length<=0">
          <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
          <p>暂未添加会议方案！</p>
        </div>

        <el-form >
          <div v-for="(item ,index) in tableDate" :key="index">
            <div class="form-options" style="align-items: center;margin-top: 20px;">
              <h5 class="text-h5">子方案号：{{item.subPlanNo}}</h5>
              <div class="z-programme-status" :class="'z-programme-status'+item.state" style="margin-top: -10px;">{{item.state == 3?'已处理':'未处理'}}</div>
            </div>
            <table class="h-table-info">
              <tr>
                <th>会议主题</th>
                <td colspan="6">
                    {{item.name}}
                </td>
              </tr>
              <tr>
                <th>会议时间</th>
                <td>
                    {{item.startTime}} 
                    <span style="margin: 0 10px;">-</span> 
                    {{item.endTime}}
                </td>
                <th>会议密级</th>
                <td>
                    {{item.isSecrecy}}
                </td>
              </tr>
              <tr>
                <th>选择会议酒店</th>
                <td colspan="6"> 
                    {{item.hotelName}}
                </td>
                <!-- <th>选择会议室</th>
                <td colspan="3">
                  <div class="form-options">
                      {{item.roomName}}
                  </div>
                </td> -->
              </tr>
              <tr>
                <th>与会人员</th>
                <td colspan="6">
                    {{item.attendPersons}}
                </td>
              </tr>
              <tr>
                <th>会议设备</th>
                <td colspan="6">
                    {{item.meetingEquip}}
                </td>
              </tr>
              <tr>
                <th>会务服务</th>
                <td colspan="6">
                    {{item.meetingServices}}
                </td>
              </tr>

              <tr class="z-accept-status">
                <th>订单接收方</th>
                <td>
                    {{item.hotelName}}
                </td>
                <th>会议室</th>
                <td>
                    {{item.roomName}}
                </td>
              </tr>

              <tr class="z-accept-status">
                <th>会议室时间</th>
                <td>
                    {{item.roomStartTime}} 
                    <span style="margin: 0 10px;">-</span> 
                    {{item.roomEndTime}}
                </td>
                <th>会务人员</th>
                <td>
                    {{item.serviceStaff}}
                    <span style="margin: 0 10px;"></span> 
                    {{item.staffPhoneNo}}
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
      id:'',//查询主键
      planId:'',//主方案id
      subPlanNo:'',//子方案号
      planStatus:'',//方案状态
      planNo:'',//主方案号
      receivePlatId:'',//接收方id
      tableDate: [],//表格数据
      meetRequireList: [],  // 会议密级
      statusList: []
    };
  },
  activated() {
   
    this.id = this.$route.query.planSubId;
    this.planId = this.$route.query.planId
    this.subPlanNo = this.$route.query.subPlanNo,
    this.planStatus = this.$route.query.planStatus
    this.planNo = this.$route.query.planNo
    this.receivePlatId = this.$route.query.receivePlatId;
    this.getRequire();  // 获取会议密级
    // this.getData();
  },
  methods: {
    getData(){
      let pagram = {
        // receivePlatId:this.receivePlatId,
        planId:this.planId
      }
      this.$axiosGet(API.planMeetings_getMeetingList + '/' + this.planId).then(res => {
        if(res && res.data){
          let addvehicle = res.data||[];
          addvehicle = addvehicle.map( item=>{
            let carOpt = this.meetRequireList.find( car => (item.isSecrecy==car.value) )||{};
            item.isSecrecy = carOpt.name;
            item.startTime = this.$formatDate(item.startTime||'');
            item.endTime = this.$formatDate(item.endTime||'');
            return item;
          })
          this.tableDate = addvehicle;
        }
      })
    },

    // 获取会议密级
    getRequire(){
      let code = '/D08,D12';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getData();
        if(res && res.data){
          this.meetRequireList = res.data.D08||[];
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
.title {
  text-align: center;
}
.plan-num {
  float: right;
}
#planId th {
  font-weight: bold;
}
#planId td {
  font-weight: bold;
}
.plan{
  margin-bottom: 10px;
}
</style>