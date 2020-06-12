<template>
  <div>
    <section class="section-content">
     
      <div class="reception-form">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="h-table-title">
            <h2>会议方案</h2>
            <p class="f-color-red">（*为必填项，请检查后提交！)</p>
          </div>
          <button v-show="type == 'add'" style="margin-left: 0;" class="u-bread-btn" @click.prevent="meetingAdd"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加会议</button>

          <div v-show="type == 'edit'" class="form-options" style="align-items: center;margin-top: 20px;">
            <h5 class="text-h5">子方案号：{{subPlanNo}}</h5>
          </div>

          <!-- 空列表 -->
          <div class="m-programme-null" v-show="meetingForm.addvehicle.length<=0">
            <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
            <p>暂未添加会议方案！</p>
          </div>

          <el-form ref="meetingForm" :model="meetingForm">
            <div v-for="(item ,index) in meetingForm.addvehicle" :key="index">
              <div class="form-options" style="align-items: center;margin-top: 20px;">
                <h5 v-show="type == 'add'" class="text-h5">会议{{(index+1)}}</h5>
                <span v-show="type == 'add'" v-if="item.carNum!=1" class="u-bread-text" @click="deleteItemstow(item, index)"><i class="iconfont icon-circle-remove">删除会议</i> </span>
              </div>
              <table class="h-table-info">
                <tr>
                  <th>会议主题</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.name'">
                      <el-input v-model="item.name" placeholder="请输入会议主题"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>会议时间</th>
                  <td>

                    <el-form-item :prop="'addvehicle.'+index+'.validTime'" :rules='meetingRules.validTime'>
                      <el-date-picker v-model="item.startTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker v-model="item.endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                    </el-form-item>

                    <!-- <el-form-item :prop="'addvehicle.'+index+'.startTime'" :rules='meetingRules.meetingStartTime' class="f-inline-block ">
                      <el-date-picker v-model="item.startTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :prop="'addvehicle.'+index+'.endTime'" :rules='meetingRules.meetingEndTime' class="f-inline-block">
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker v-model="item.endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                    </el-form-item> -->
                  </td>
                  <th><i class="f-color-red">*</i>会议密级</th>
                  <td>
                    <div class="form-options">
                      <el-form-item :prop="'addvehicle.'+index+'.isSecrecy'" :rules='meetingRules.conferenceLevel'>
                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.isSecrecy">
                            <el-radio v-for="(secrecy, index) in D08" :key="index" :label="secrecy.value">{{secrecy.name}}</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>选择会议酒店</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.hotelId'" :rules='meetingRules.Level'>
                      <div class="f-input-width">
                        <el-select v-model="item.hotelId" placeholder="选择会议酒店" style="width:100%">
                          <el-option v-for="(item, index) in hotelInfoList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </td>
                  <th>与会人数</th>
                  <td colspan="3">
                    <div class="form-options">
                      <el-input v-model="item.personNum" type='number' placeholder="请输入与会人数"></el-input>
                      <!-- <el-form-item :prop="'addvehicle.'+index+'.whether'" :rules='meetingRules.whether'>
                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.whether" style="width:150px">
                            <el-radio label="是">是</el-radio>
                            <el-radio label="否">否</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                      <el-form-item :prop="'addvehicle.'+index+'.conferenceRoom'" :rules='meetingRules.conferenceRoom'>
                        <div class="f-input-width">
                          <el-select v-model="item.conferenceRoom">
                            <el-option label="会议室1" value="shanghai"></el-option>
                            <el-option label="会议室2" value="beijing"></el-option>
                          </el-select>
                        </div>
                      </el-form-item> -->
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>与会人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.attendPersons'">
                      <el-input @focus="setPerson(index)" :readonly="true" v-model="item.attendPersons" placeholder="与会人员"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>会议设备</th>
                  <td colspan="6">
                    <el-form-item>
                      <div class="form-options">
                        <el-checkbox-group v-model="item.meetingEquipList">
                          <el-checkbox v-for="(item, index) in aEquipList" :key="index" :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <div class="options-tow-width">
                          <el-input v-model="item.meetingEquipOther" placeholder="其他请输入"></el-input>
                        </div>
                      </div>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>会务服务</th>
                  <td colspan="6">
                    <el-form-item>
                      <div class="form-options">
                        <el-checkbox-group v-model="item.meetingServicesList">
                          <el-checkbox v-for="(item, index) in aServicesList" :key="index" :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <div class="options-tow-width">
                          <el-input v-model="item.meetingServicesOther" placeholder="其他请输入"></el-input>
                        </div>
                      </div>
                    </el-form-item>
                  </td>
                </tr>
              </table>

            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;" v-show="meetingForm.addvehicle.length>0">
            <el-button class="u-submit-btn cancel-btn" @click="carCommit(0)">保  存</el-button>
            <el-button class="u-submit-btn submit-btn" @click="carCommit(1)">提  交</el-button>
          </div>
        </div>
      </div>

      <el-dialog title="选择人员" :visible.sync="dialogVisible" width="660px">
        <!-- 人员穿梭框 -->
        <el-form ref="ruleForm">
          <div class="f-hidden dialog-person">
            <div class="f-pull-left person-box">
              <h2> 未选人员</h2>
              <div class="padding10">
                <el-tree node-key="id" :default-checked-keys="defaultKeys" class="filter-tree" :data="dataList" @check="getCheckedNodes" show-checkbox default-expand-all ref="tree2">
                </el-tree>
              </div>
            </div>
            <div class="f-pull-right person-box">
              <h2>已选人员</h2>
              <ul class="selectionPerson">
                <li v-for="(item,index) in selectNodeList" :key="index">{{item.label}}</li>
              </ul>
            </div>
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="setPersonSure">确 定</el-button>
        </span>
      </el-dialog>

    </section>
  </div>
</template>

<script>
let addvehicleOpt = {
  "attendPersons": "",
  "endTime": "",
  "hotelId": "",
  "hotelName": "",
  "isSecrecy": '',
  "jsonPerson": {},
  "meetingEquip": "",
  "meetingEquipOther": '',
  "meetingEquipList": [],
  "meetingServices": "",
  "meetingServicesList": [],
  "meetingServicesOther": '',
  "name": "",
  "personNum": '',
  "planId": "",
  "planNo": "",
  "roomEndTime": "",
  "roomName": "",
  "roomStartTime": "",
  "serviceStaff": "",
  "staffPhoneNo": "",
  "startTime": "",
  "state": ""
}
export default {
  data() {

    let validTime = (rule, value, callback) => {
      let field = (rule.field||'').replace('addvehicle.', '').replace('.validTime', '')*1;
      let startT = (this.meetingForm.addvehicle[field]||{}).startTime;
      let endT = (this.meetingForm.addvehicle[field]||{}).endTime;
      if( !startT ){
        callback(new Error("开始时间不能为空"));
      }else if(!endT){
        callback(new Error("结束时间不能为空"));
      }else{
        let start = new Date(startT).getTime()*1;
        let end = new Date(endT).getTime()*1;
        if(start>end){
          callback(new Error("结束时间不得早于开始时间"));
        }else{
          callback();
        }
      }
    };

    return {
      id: this.$route.query.id||'',       // 方案id
      type: this.$route.query.type||'',       
      planNo: this.$route.query.planNo||'',       // planNo
      planSubId: this.$route.query.planSubId||'',       // planSubId

      subPlanNo: '',    //子方案号   

      dialogVisible: false,

      D08: [],    // 会议密级

      dialogVisible: false,

      secIndex: 0,    // 当前操作的index

      // 默认选中人员
      defaultKeys: [],

      // 已选人员
      selectNodeList: [],

      // 人员列表数据
      dataList: [],

      // 酒店列表
      hotelInfoList: [],

      // 设备列表
      aEquipList: ['空调', '投影仪','话筒','电脑','翻页笔','会标'],

      // 服务列表
      aServicesList: ['毛巾', '茶叶','开水','纸杯','席卡'],

      

      meetingForm: {
        addvehicle: [
          {
            "attendPersons": "",
            "endTime": "",
            "hotelId": "",
            "hotelName": "",
            "isSecrecy": '',
            "jsonPerson": {},
            "meetingEquip": "",
            "meetingEquipList": [],
            "meetingEquipOther": '',
            "meetingServices": "",
            "meetingServicesList": [],
            "meetingServicesOther": '',
            "name": "",
            "personNum": '',
            "planId": "",
            "planNo": "",
            "roomEndTime": "",
            "roomName": "",
            "roomStartTime": "",
            "serviceStaff": "",
            "staffPhoneNo": "",
            "startTime": "",
            "state": ""
          }
        ]
      },
      
      meetingRules: {
        validTime: [{ required: true, validator: validTime, trigger: 'change' }],
        meetingStartTime: [{ required: true, message: '会议开始时间不能为空', trigger: 'change' }],
        meetingEndTime: [{ required: true, message: '会议结束时间不能为空', trigger: 'change' }],
        conferenceLevel: [{ required: true, message: '会议级别不能为空', trigger: 'change' }],
        Level: [{ required: true, message: '会议酒店不能为空', trigger: 'change' }],
        whether: [{ required: true, message: '请选择会议室', trigger: 'change' }],
        conferenceRoom: [{ required: true, message: '请选择会议室', trigger: 'change' }],
      },

    }
  },
  activated() {
    this.getPlanDetail();  //获取方案详情， 只在编辑时候获取   
    this.getDlist();
    this.getPlanPersonList();
    this.hotelInfos();
  },
  deactivated(){
    this.$destroy();
  },
  methods: {

    //获取方案详情， 只在编辑时候获取
    getPlanDetail(){
      if( this.type != 'edit' ){ return; }
      let planSubId = '/'+this.planSubId;
      this.$axiosGet(API.planMeetings+planSubId).then(res => {
        if(res && res.data){
          let addvehicle = res.data;
          if( typeof addvehicle.jsonPerson == "string" ){
            addvehicle.jsonPerson = JSON.parse(addvehicle.jsonPerson);
          }

          let meetingEquip = addvehicle.meetingEquip||'', meetingServices = addvehicle.meetingServices||'';
          let meetingEquipList = meetingEquip.split(',')||[],  meetingEquipOther='';
          let meetingServicesList = meetingServices.split(',')||[], meetingServicesOther='';

          // aEquipList: ['空调', '投影仪','话筒','电脑','翻页笔','会标'],

          //   // 服务列表
          //   aServicesList: ['毛巾', '茶叶','开水','纸杯','席卡'],
          meetingEquipList = meetingEquipList.map( item=>{
            if( this.aEquipList.includes(item) ){
              return item;
            }else{
              meetingEquipOther = item;
            }
          });

          meetingServicesList = meetingServicesList.map( item=>{
            if( this.aServicesList.includes(item) ){
              return item;
            }else{
              meetingServicesOther = item;
            }
          });

          addvehicle.meetingEquipOther = meetingEquipOther||'';
          addvehicle.meetingEquipList = meetingEquipList||[];
          addvehicle.meetingServicesOther = meetingServicesOther||'';
          addvehicle.meetingServicesList = meetingServicesList||[];

          addvehicle.isSecrecy += '';
          this.subPlanNo = addvehicle.subPlanNo;
          this.meetingForm.addvehicle = [];
          this.meetingForm.addvehicle.push(addvehicle);
        }
      });
    }, 

    hotelInfos(){   //酒店
      this.$axiosGet(API.hotelInfo_getList).then(res => {
        if(res && res.data){
          this.hotelInfoList = res.data||[];
        }
      });
    },

    // 获取用车范围
    getCarRequire(){
      let code = '/D04';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        if(res && res.data){
          this.carRequireList = res.data.D04||[];
        }
      });
    },

    setPerson(index){    //选择人员
      this.selectNodeList = [];
      this.dialogVisible = true;
      this.secIndex = index;
      let checkedKeys = [], selectNodeList = [];
      
      let jsonPerson = this.meetingForm.addvehicle[index].jsonPerson||{};  
      let master = jsonPerson.master||[], follow = jsonPerson.follow||[], accompany = jsonPerson.accompany||[];

      master.forEach( item=>{
        checkedKeys.push(item.id);
        selectNodeList.push(item);
      })

      follow.forEach( item=>{
        checkedKeys.push(item.id);
        selectNodeList.push(item);
      })

      accompany.forEach( item=>{
        checkedKeys.push(item.id);
        selectNodeList.push(item);
      })
      this.selectNodeList = selectNodeList;
      this.$nextTick( ()=>{
        this.$refs.tree2.setCheckedKeys(checkedKeys);
        this.selectNodeList = selectNodeList;
      })
      
    },

    setPersonSure(){  //确定人员
      let attendPersons = [];
      let master = [], follow = [], accompany = [];
      this.selectNodeList.forEach((item, index) => {
        if (item.groupId) {
          attendPersons.push(item.label);
        }
        if( item.groupId == 'parent_level_d1' ){ 
          master.push(item); 
        }else if( item.groupId == 'parent_level_d2' ){ 
          follow.push(item); 
        }else if( item.groupId == 'parent_level_d3' ){ 
          accompany.push(item); 
        }
      });
      let jsonPerson = ( {master, follow, accompany} );
      attendPersons = attendPersons.join(',');
      this.meetingForm.addvehicle[this.secIndex].attendPersons = attendPersons;
      this.meetingForm.addvehicle[this.secIndex].jsonPerson = jsonPerson;
      this.dialogVisible = false;
    },

    //  获取选择人员
    getCheckedNodes(){
      this.selectNodeList = [];
      let tree2 = this.$refs.tree2;
      let selectList = [];
      let id_list = ['parent_level_d1','parent_level_d2','parent_level_d3'];
      tree2.getCheckedNodes(false, false).forEach((item, index) => {
        if (!id_list.includes(item.id)) {
          selectList.push(item);
        }
      });
      this.selectNodeList = selectList;
    },

    // 获取人员列表
    getPlanPersonList(){
      this.$axiosGet(API.planPerson_getPlanPersonList+'/'+this.id).then(res => {
        let fromData = [];
        let masterGuestOpt = { id: 'parent_level_d1', label: "主宾", children: [] };
        let accompanyPersonOpt = { id: 'parent_level_d2', label: "来宾", children: [] };
        let followGuestOpt = { id: 'parent_level_d3', label: "陪同人员", children: [] };
        if( res && res.data){
          let masterGuest = res.data.masterGuest||[]; //主宾
          let followGuest = res.data.followGuest||[]; //来宾
          let accompanyPerson = res.data.accompanyPerson||[]; //陪同

          if( masterGuest.length>0 ){
            masterGuest = masterGuest.map( item=>{
              return { id: item.id, label: item.personName, groupId:'parent_level_d1', children: null }
            })
            masterGuestOpt.children = masterGuest;
            fromData.push( masterGuestOpt );
          }

          if( accompanyPerson.length>0 ){
            accompanyPerson = accompanyPerson.map( item=>{
              return { id: item.id, label: item.personName, groupId:'parent_level_d3', children: null }
            })
            accompanyPersonOpt.children = accompanyPerson;
            fromData.push( accompanyPersonOpt );
          }

          if( followGuest.length>0 ){
            followGuest = followGuest.map( item=>{
              return { id: item.id, label: item.personName, groupId:'parent_level_d2', children: null }
            })
            followGuestOpt.children = followGuest;
            fromData.push( followGuestOpt );
          }
          
          this.dataList = fromData;

        }
      });
    },

    // 提交
    carCommit(state){
      this.$refs.meetingForm.validate(valid => {
        if(valid){
          let params = JSON.parse(JSON.stringify(this.meetingForm.addvehicle||[]));
          params = params.map( item=>{
            
            this.hotelInfoList.forEach(hotel => {
              if (hotel.id == item.hotelId) {
                item.hotelName = hotel.name;
              }
            });

            let meetingEquip = '', meetingServices = '';
            meetingEquip = item.meetingEquipList.join(',')||'';
            meetingServices = item.meetingServicesList.join(',')||'';
            if(item.meetingEquipOther){
              if(meetingEquip){
                meetingEquip += ',';
              }
              meetingEquip += item.meetingEquipOther;
            }
            if(item.meetingServicesOther){
              if(meetingServices){
                meetingServices += ',';
              }
              meetingServices += item.meetingServicesOther;
            }

            item.jsonPerson.master = (item.jsonPerson.master||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonPerson.follow = (item.jsonPerson.follow||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonPerson.accompany = (item.jsonPerson.accompany||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })

            item.state = state;
            item.planId = this.id;
            item.planNo = this.planNo;
            item.meetingEquip = meetingEquip;
            item.meetingServices = meetingServices;
            item.startTime = this.$formatDate(item.startTime);
            item.endTime = this.$formatDate(item.endTime);
            return item;
          });
          
          let msg = '是否确认提交办理，并返回列表页？';
          if(state == 0){
            msg = '是否确认保存修改内容，并返回列表页？';
          }
          this.$confirm(msg)
          .then(() => {
            if(this.type == 'add'){
              this.$axiosJsonPost(API.planMeetings, params).then(res => {
                if(res.status == 200){
                  // this.$message({type: 'success', message: '操作成功！'});
                  this.$router.go(-1);
                }
              });
            }else if(this.type == 'edit'){
              params = params[0];
              this.$axiosJsonPost(API.planMeetings_updatePlanMeetings, params).then(res => {
                if(res.status == 200){
                  // this.$message({type: 'success', message: '操作成功！'});
                  this.$router.go(-1);
                }
              }).finally(()=>{
                // console.log('finally');
              });
            }
          })
          .catch(() => { });

        }
      });
    },

    // 获取字典
    getDlist(){
      let code = '/D08';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        if(res && res.data){
          this.D08 = res.data.D08||[];
        }
      });
    },


    //会议添加
    meetingAdd() {
      this.meetingForm.addvehicle.push(JSON.parse(JSON.stringify(addvehicleOpt)));
    },

    deleteItemstow(item, index) {
      if (index !== -1) {
        this.meetingForm.addvehicle.splice(index, 1)
      }
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
  .dialog-person{
    .person-box{
      width: 50%;
      box-sizing: border-box;
    }

    .h-dialog-add-select {
      width: 477px;
    }
    .el-form-nobottom {
      margin-bottom: 0;
    }
    .el-select {
      display: inline-block;
    }
    .padding10 {
      padding: 10px;
    }
    .person-box {
      margin: 15px 0;
      width: 300px;
      height: 400px;
      overflow-y: auto;
      border: 1px solid #dcdfe6;
    }
    .person-box h2 {
      background: #f3f6fd;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      border-bottom: 1px solid #dcdfe6;
    }
    .selectionPerson {
      overflow: hidden;
      padding: 10px;
    }
    .selectionPerson li {
      line-height: 30px;
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
    }
    .lineHight {
      line-height: 28px;
    }
  }
</style>




