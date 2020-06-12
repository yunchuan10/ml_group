<template>
  <div>
    <el-dialog
      custom-class="m-detail-dialog m-car-detail"
      append-to-body
      @close="pageSelect == 'basic'"
      :show-close="false"
      width="950px"
      :visible.sync="carDetailShow"
    >
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="padding-bottom:20px;">
        <p class="u-detail-p">方案号：{{planNo}}</p>
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基础信息</a>
          </li>
          <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}">
            <a>接待方案</a>
          </li>
          <li @click="pageSelect = 'history'" :class="{'active':pageSelect=='history'}">
            <a>历史记录</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red"></i>任务名称
              </th>
              <td colspan="3">
                  {{dataInfo.name}}
              </td>
              <th>
                <i class="f-color-red"></i>到访时间
              </th>
              <td colspan="3">
                {{dataInfo.visitTimeStart}}
                <span style="margin: 0 5px;">-</span>
                {{dataInfo.visitTimeEnd}}
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red"></i>来访类型
              </th>
              <td colspan="3">
                <div class="f-line-h">
                  {{dataInfo.visitTypeName}}
                </div>
              </td>
              <th>
                <i class="f-color-red"></i>接待级别
              </th>
              <td colspan="3">
                  {{dataInfo.receptLevelName}}
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red"></i>相关附件
              </th>
              <td colspan="6">
                <div class="see-file f-line-h">
                  <a v-for="(item, index) in dataInfo.attachmentList" :key="'attachmentList'+index" :href="fileBeforeUrl+item.fileUrl" target="_blank">{{item.fileName}}</a>
                </div>
              </td>
            </tr>

            <tr class="many-form-item">
              <th>
                <i class="f-color-red"></i>来访单位
              </th>

              <td colspan="6">
                <div class="many-form-flex f-line-h"  v-for="(item, index) in dataInfo.visitUnitList" :key="'visitUnitList'+index">
                  <div>
                    <p>单位名称：</p>
                    <span :title="item.unitName" class="f-text-ellipsis txt-ellipsis">{{item.unitName}}</span>
                  </div>
                  <div style="margin-left: 45px;">
                    <p>单位联系人：</p>
                    {{item.linkMan}}
                    <span style="margin: 0 10px;"></span>
                    {{item.position}}
                    <span style="margin: 0 10px;"></span>
                    {{item.phoneNo}}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th>
                <i class="f-color-red"></i>主宾信息
              </th>
              <td colspan="6">
                <div class="f-line-h" v-for="(item, index) in dataInfo.masterList"  :key="'masterList'+index">
                  {{item.personName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.unitName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.position}}
                  <span style="margin: 0 10px;"></span>
                  {{item.positionLevel}}
                  <span style="margin: 0 10px;"></span>
                  {{item.sex==1? '女':'男'}}
                  <span style="margin: 0 10px;"></span>
                  {{item.phoneNo}}
                </div>
              </td>
            </tr>
            
            <tr>
              <th>
                <i class="f-color-red"></i>来宾名单
              </th>
              <td colspan="6">
                <div class="f-line-h" v-for="(item, index) in dataInfo.followList"  :key="'followList'+index">
                  {{item.personName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.unitName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.position}}
                  <span style="margin: 0 10px;"></span>
                  {{item.positionLevel}}
                  <span style="margin: 0 10px;"></span>
                  {{item.sex==1? '女':'男'}}
                  <span style="margin: 0 10px;"></span>
                  {{item.phoneNo}}
                </div>
              </td>
            </tr>
            
            <tr class="many-form-item">
              <th>
                <i class="f-color-red"></i>接待单位
              </th>
              <td colspan="6">
                <div class="many-form-flex f-line-h"  v-for="(item, index) in dataInfo.receptUnitList" :key="'receptUnitList'+index">
                  <div>
                    <p>单位名称：</p>
                    <span :title="item.unitName" class="f-text-ellipsis txt-ellipsis">{{item.unitName}}</span>
                  </div>
                  <div style="margin-left: 45px;">
                    <p>单位联系人：</p>
                    {{item.linkMan}}
                    <span style="margin: 0 10px;"></span>
                    {{item.position}}
                    <span style="margin: 0 10px;"></span>
                    {{item.phoneNo}}
                  </div>
                </div>
              </td>
            </tr>
            
            <tr>
              <th>
                <i class="f-color-red"></i>陪同人员名单
              </th>
              <td colspan="6">
                <div v-for="(item, index) in dataInfo.accompanyList" :key="'accompanyList'+index">
                  {{item.personName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.unitName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.position}}
                  <span style="margin: 0 10px;"></span>
                  {{item.positionLevel}}
                  <span style="margin: 0 10px;"></span>
                  {{item.sex==1? '女':'男'}}
                  <span style="margin: 0 10px;"></span>
                  {{item.phoneNo}}
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan'">

          <h3 v-show="carList.length>0" class="title">用车方案</h3>
          <div class="tab-list-item" v-for="(item ,index) in carList" :key="'carList'+index">
            <div class="form-options" style="align-items: center;margin-top: 10px;">
              <h5 style="color: #909399;" class="text-h5">车辆{{index+1}}</h5>
            </div>
            <table class="h-table-info">
              <tr>
                <th><i class="f-color-red"></i>车辆要求</th>
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
                <th><i class="f-color-red"></i>用车时间</th>
                <td>
                    {{item.useStartTime}} 
                    <span style="margin: 0 5px;">-</span> 
                    {{item.useEndTime}}
                </td>
                <th><i class="f-color-red"></i>用车范围</th>
                <td>
                    {{item.useRangeType}}
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red"></i>随车人员</th>
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

          <h3 v-show="meetingList.length>0" class="title">会议方案</h3>
          <div class="tab-list-item" v-for="(item ,index) in meetingList" :key="'meetingList'+index">
            <div class="form-options" style="align-items: center;">
              <h5 style="color: #909399;" class="text-h5">会议{{index+1}}</h5>
            </div>
            <table class="h-table-info">
              <tr>
                <th>会议主题</th>
                <td colspan="6">
                    {{item.name}}
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red"></i>会议时间</th>
                <td>
                    {{item.startTime}} 
                    <span style="margin: 0 10px;">-</span> 
                    {{item.endTime}}
                </td>
                <th><i class="f-color-red"></i>会议密级</th>
                <td>
                      {{item.isSecrecy}}
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red"></i>选择会议酒店</th>
                <td colspan="6"> 
                    {{item.hotelName}}
                </td>
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

          <h3 v-show="accommodationList.length>0" class="title">住宿方案</h3>
          <div class="tab-list-item" v-for="(item ,index) in accommodationList" :key="'accommodationList'+index">
            <div class="form-options" style="align-items: center;">
              <h5 style="color: #909399;" class="text-h5">住宿{{index+1}}</h5>
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

          <h3 v-show="mealsList.length>0" class="title">用餐方案</h3>
          <div class="tab-list-item" v-for="(item ,index) in mealsList" :key="'mealsList'+index">
            <div class="form-options" style="align-items: center;">
              <h5 style="color: #909399;" class="text-h5">用餐{{index+1}}</h5>
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
        </div>
        
        <div class="h-tab-content" v-show="pageSelect=='history'">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in historyList"
              :key="index"
              :timestamp="(item.optTime)"
              placement="top"
            >
              <el-card class="history">
                <!-- <span class="z-state" :class="item.flowLabel?'s-state-apply':'s-state-fail'" >{{item.flowLabel?item.flowLabel:'待审批'}}</span> -->
                <div style="margin-top:0px">
                  <span>操作人：<div class="apply-user">{{item.applyUserName}}</div></span>
                  <span>状态：{{item.passName}}</span>
                </div>
                <div style="margin-top:10px">
                  <span>备注：{{item.remark}}</span>
                </div>
              </el-card>
              
            </el-timeline-item>
          </el-timeline>
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
      pageSelect: "basic",

      id: '',
      planNo: '',
      instanceId: '',

      carRequireList: [],
      statusList: [],   // 方案状态
      meetRequireList: [], //会议密
      roomTypeList: [], // 房间类型
      dutiesList: [],   //职务级别
      unitList: [],     //单位

      mealsTimesTypeList: [],
      mealsTypeList: [],



      dataInfo: {},
      carList: [],    //用车
      meetingList: [],  //会议
      accommodationList: [], //住宿
      mealsList: [],    //用餐
      historyList: [],  //历史审核信息

      hasDetail: false,


    };
  },
  activated() {
    
  },
  deactivated(){
    // console.log(333333);
    // this.$destroy();
  },

  computed: {
    fileBeforeUrl(){
      return this.$store.state.mainData.fileBeforeUrl;
    }
  },
  methods: {


    // 初始化弹出框
    openModal(id, planNo, instanceId) {
      
      this.id = id;
      this.planNo = planNo;
      this.instanceId = instanceId;
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.dataInfo = {};
      this.carList = [];
      this.meetingList = [];
      this.accommodationList = [];
      this.mealsList = [];
      this.historyList = [];
      
      this.unitInfoGetList();
      this.getCarRequire();
      this.getHistoryList();
      // console.log(this.carDetailShow, 11111);
    },

    // 获取基础信息详情
    getReceptionDetail(){
      if( this.id ){      // 详情id
        this.$axiosGet(API.plans+`/${this.id}`).then(res => {
          if( res && res.data ){
            let data = res.data||{};
            let { masterList=[], followList=[], accompanyList=[], } = data;
            masterList = masterList.map( item=>{
              this.dutiesList.forEach( duty =>{   // 级别
                if(duty.value == item.positionLevel){
                  item.positionLevel = duty.name;
                }
              })
              this.unitList.forEach( unit =>{   // 单位
                if(unit.id == item.unitId){
                  item.unitName = unit.name;
                }
              })
              return item;
            })
            followList = followList.map( item=>{
              this.dutiesList.forEach( duty =>{   // 级别
                if(duty.value == item.positionLevel){
                  item.positionLevel = duty.name;
                }
              })
              this.unitList.forEach( unit =>{   // 单位
                if(unit.id == item.unitId){
                  item.unitName = unit.name;
                }
              })
              return item;
            })
            accompanyList = accompanyList.map( item=>{
              this.dutiesList.forEach( duty =>{   // 级别
                if(duty.value == item.positionLevel){
                  item.positionLevel = duty.name;
                }
              })
              this.unitList.forEach( unit =>{   // 单位
                if(unit.id == item.unitId){
                  item.unitName = unit.name;
                }
              })
              return item;
            })
            data.visitTimeStart = this.$formatDate(data.visitTimeStart||'');
            data.visitTimeEnd = this.$formatDate(data.visitTimeEnd||'');
            this.dataInfo = data;
          }
        });
      }
    },


    //  获取单位列表
    unitInfoGetList(){    
      // this.loading = true;
      this.$axiosGet(API.unitInfo_getList).then(res => {
        // 编辑状态请求详情
        this.hasDetail && this.getReceptionDetail();
        this.hasDetail = true;
        if( res && res.data ){
          this.unitList = res.data||[];
        }
      }).finally(()=>{
        // this.loading = false;
      });
    },

    // 用车详情列表
    getDetailList(){
      let params = {planId: this.id};
      // 用车
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
          });
          addvehicle = this.handleList(addvehicle);
          this.carList = addvehicle;
        }
      });
      
      // 会议
      this.$axiosGet(API.planMeetings_getAllMeetingList+'/'+this.id).then(res => {
        if(res && res.data){
          let addvehicle = res.data||[];
          addvehicle = addvehicle.map( item=>{
            let carOpt = this.meetRequireList.find( car => (item.isSecrecy==car.value) )||{};
            item.isSecrecy = carOpt.name;
            item.startTime = this.$formatDate(item.startTime||'');
            item.endTime = this.$formatDate(item.endTime||'');
            return item;
          });
          addvehicle = this.handleList(addvehicle);
          this.meetingList = addvehicle;
        }
      });

      // 住宿方案
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
          });
          addvehicle = this.handleList(addvehicle);
          this.accommodationList = addvehicle;
        }
      });

      // 用餐
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
          });
          addvehicle = this.handleList(addvehicle);
          this.mealsList = addvehicle;
        }
      });
    },

    handleList(list=[]){   //处理只显示已处理的方案
      list = list.filter( item => (item.state==3) );
      return list;
    },

    // 获取状态列表字典
    getCarRequire(){
      let code = '/D03,D04,D05,D06,D08,D12,D15';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.hasDetail && this.getReceptionDetail();
        this.hasDetail = true;
        this.getDetailList();
        if(res && res.data){
          this.roomTypeList = res.data.D03||[];
          this.carRequireList = res.data.D04||[];
          this.mealsTimesTypeList = res.data.D05||[];
          this.mealsTypeList = res.data.D06||[];
          this.statusList = res.data.D12||[];
          this.meetRequireList = res.data.D08||[];
          this.dutiesList = res.data.D15||[]; //职务级别
        }
      });
    },

    // 获取历史审核信息
    getHistoryList(){
      this.historyList = [];
      if(!this.instanceId){
        return;
      }
      this.$axiosGet(API.plans_historyListByInstanceId+'/'+this.instanceId).then(res => {
        if(res && res.data){
          let historyList = res.data||[];
          let states = ['新提交', '审核通过','审核驳回']
          historyList = historyList.map( item=>{
            item.optTime = this.$formatDate(item.optTime||'');
            item.passName = states[item.pass*1]||'';
            return item;
          })
          this.historyList = historyList||[];
        }
      });
    },


  }
};
</script>
<style lang="scss" scoped>

.apply-user{
  display: inline-block;
  min-width: 100px;
}

.title {
  margin: 10px auto;
  text-align: center;
  padding-top: 15px;
}
.tab-list-item{
  padding-bottom: 15px;
}
.status {
  margin-bottom: 20px;
  text-align: center;
}
.item-list {
    display: inline-block;
    width: 230px;
    text-align: center;
  }

  .many-form-item{
    .el-input__inner{
      width: auto;
    }
    .many-form-flex{
      display: flex;
      .many-flex-wrap{
        flex-wrap: wrap;
      }
      &>div{
        display: flex;
        align-items: stretch;
        
        &>p{
          width: 88px;
        }
      }

      .txt-ellipsis{
        display: inline-block;
        width: 220px;
      }
    }
    .item-add-btn{
      height: 40px;
    }
  }
  .see-file{
    a{
      margin-right: 30px;
    }
  }
  .h-table-info{
    td{
      line-height: 30px;
    }
  }
</style>

