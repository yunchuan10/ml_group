<template>
  <div id="trip-update">
    <section class="section-content">
      <div class="reception-form">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="h-table-title">
            <h2>用车方案</h2>
            <p class="f-color-red">（*为必填项，请检查后提交！)</p>
          </div>
          <button v-show="type=='add'" style="margin-left: 0;" class="u-bread-btn" @click.prevent="scheduleAdd"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加车辆</button>

          <div v-show=" type == 'edit'" class="form-options" style="align-items: center;margin-top: 20px;">
            <h5 class="text-h5">子方案号：{{subPlanNo}}</h5>
          </div>

          <!-- 空列表 -->
          <div class="m-programme-null" v-show="infoForm.addvehicle.length<=0">
            <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
            <p>暂未添加用车方案！</p>
          </div>

          <el-form ref="infoForm" :model="infoForm">
            <div v-for="(item ,index) in infoForm.addvehicle" :key="index">

              <div class="form-options" style="align-items: center;margin-top: 20px;">
                <h5 v-show="type=='add'" class="text-h5">车辆{{(index+1)}}</h5>
                <span v-show="type=='add'" class="u-bread-text" @click="deleteItems(item, index)"><i class="iconfont icon-circle-remove"></i>删除车辆 </span>
              </div>
              <table class="h-table-info">
                <tr>
                  <th><i class="f-color-red">*</i>车辆要求</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.carRequire'" :rules='infoRules.requirements'>
                      <el-input v-model="item.carRequire" placeholder="请输入车辆要求"></el-input>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red"></i>联系人</th>
                  <td>
                    <div class="many-form-flex el-form-item__content">
                      <el-input placeholder="请输入姓名" v-model="item.linkMan" style="diplay: inline-block;width:220px;"></el-input>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addvehicle.'+index+'.phoneNo'" :rules='infoRules.phoneNo'>
                        <el-input placeholder="请输入手机号" v-model="item.phoneNo" style="diplay: inline-block;width:220px;"></el-input>
                      </el-form-item>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>用车时间</th>
                  <td>
                    <div class="many-form-flex el-form-item__content">

                      <el-form-item :prop="'addvehicle.'+index+'.validTime'" :rules='infoRules.validTime'>
                        <el-date-picker v-model="item.useStartTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                        <span style="margin: 0 5px;">-</span>
                        <el-date-picker v-model="item.useEndTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                      </el-form-item>
                      
                    </div>
                    
                  </td>
                  <th><i class="f-color-red">*</i>用车范围</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.useRangeType'" :rules='infoRules.vehicleScope'>
                      <el-radio-group v-model="item.useRangeType">
                        <el-radio v-for="(item, index) in carRequireList" :key="index" :label="item.value">{{item.name}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>随车人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.followPersons'" :rules='infoRules.accompanying'>
                      <!-- <div class="f-input-width"> -->
                        <!-- <el-select popper-class="transfer-null" v-model="item.followPersons" multiple placeholder="请输入随车人员" @focus="setPerson(index)" style="width:100%"></el-select> -->
                      <!-- </div> -->
                      <el-input @focus="setPerson(index)" :readonly="true" v-model="item.followPersons" placeholder="随车人员"></el-input>
                    </el-form-item>
                    
                  </td>
                </tr>
              </table>
              
            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;" v-show="infoForm.addvehicle.length>0">
            <el-button class="u-submit-btn cancel-btn" @click="carCommit(0)">保  存</el-button>
            <el-button class="u-submit-btn submit-btn" @click="carCommit(1)">提  交</el-button>
          </div>
        </div>
      </div>

      <!-- <el-dialog title="选择人员" :visible.sync="dialogVisible" width="660px">
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
      </el-dialog> -->

      <person-dialog ref="personSec" @getPersons="getPersons"></person-dialog>

    </section>
  </div>
</template>

<script>

import personDialog from './person-dialog-component'

let addVehicleNew = {
  "carRequire": "",
  "followPersons": "",
  "jsonPerson": {},
  "linkMan": "",
  "phoneNo": "",
  "planId": "",
  "state": "",
  "useEndTime": "",
  "useRangeType": "",
  "useStartTime": ""
}
        
export default {

  components: {
    personDialog
  },
  data() {

    let validTime = (rule, value, callback) => {
      let field = (rule.field||'').replace('addvehicle.', '').replace('.validTime', '')*1;
      let startT = (this.infoForm.addvehicle[field]||{}).useStartTime;
      let endT = (this.infoForm.addvehicle[field]||{}).useEndTime;
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
      planNo: this.$route.query.planNo||'',    
      planSubId: this.$route.query.planSubId||'',       // planSubId

      subPlanNo: '',    //子方案号   
      
      dialogVisible: false,

      secIndex: 0,    // 当前操作的index

      carRequireList: [], // 用车范围

      // 默认选中人员
      // defaultKeys: [],

      // 已选人员
      selectNodeList: [],

      // 列表数据
      dataList: [],

      infoForm: {
        addvehicle: [
          {
            "carRequire": "",
            "followPersons": "",
            "jsonPerson": {},
            "linkMan": "",
            "phoneNo": "",
            "planId": "",
            "state": "",
            "useEndTime": "",
            "useRangeType": "",
            "useStartTime": ""
          }
        ]
      },
      
      infoRules: {
        validTime: [{ required: true, validator: validTime, trigger: 'change' }],
        visitingStartTime: [{ required: true, message: '到访开始时间不能为空', trigger: 'change' }],
        visitingEndTime: [{ required: true, message: '到访结束时间不能为空', trigger: 'change' }],
        vehicleScope: [{ required: true, message: '请选择用车范围', trigger: 'change' }],
        requirements: [
          { required: true, message: '车辆要求不能为空', trigger: 'change' }
        ],
        startEndTime: [
          { required: true, message: '到访时间不能为空', trigger: 'change' },
        ],
        accompanying: [
          { required: true, message: '随车人员不能为空', trigger: 'change' }
        ],
        // phoneNo: [{ pattern: /^1([0-9])\d{9}$/, message: '请输入正确的电话', trigger: 'change' }],
        phoneNo: [{ pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的电话', trigger: 'change' }],
      },

    }
  },
  activated() {
    this.getPlanPersonList();   //人员列表
    this.getPlanDetail();  //获取方案详情， 只在编辑时候获取   
    this.getCarRequire();   //用车范围
  },
  deactivated(){
    this.$destroy();
  },
  methods: {

    //获取方案详情， 只在编辑时候获取
    getPlanDetail(){
      if( this.type != 'edit' ){ return; }
      let planSubId = '/'+this.planSubId;
      this.$axiosGet(API.planCars+planSubId).then(res => {
        if(res && res.data){
          let addvehicle = res.data;
          if( typeof addvehicle.jsonPerson == "string" ){
            addvehicle.jsonPerson = JSON.parse(addvehicle.jsonPerson);
          }
          this.subPlanNo = addvehicle.subPlanNo;
          this.infoForm.addvehicle = [];
          this.infoForm.addvehicle.push(addvehicle);
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
      
      let jsonPerson = this.infoForm.addvehicle[index].jsonPerson||{};  
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
      this.$refs.personSec.openDialog(this.dataList, this.selectNodeList);    //打开人员选择框
      // this.$nextTick( ()=>{
      //   this.$refs.tree2.setCheckedKeys(checkedKeys);
      //   this.selectNodeList = selectNodeList;
      // })
      
    },

    // 确定选择人员
    getPersons(followPersons, jsonPerson){
      // console.log(followPersons, jsonPerson, 333333333);
      this.infoForm.addvehicle[this.secIndex].followPersons = followPersons;
      this.infoForm.addvehicle[this.secIndex].jsonPerson = jsonPerson;
    },

    // setPersonSure(){  //确定人员
    //   let followPersons = [];
    //   let master = [], follow = [], accompany = [];
    //   this.selectNodeList.forEach((item, index) => {
    //     if (item.groupId) {
    //       followPersons.push(item.label);
    //     }
    //     if( item.groupId == 'parent_level_d1' ){ 
    //       master.push(item); 
    //     }else if( item.groupId == 'parent_level_d2' ){ 
    //       follow.push(item); 
    //     }else if( item.groupId == 'parent_level_d3' ){ 
    //       accompany.push(item); 
    //     }
    //   });
    //   let jsonPerson = ( {master, follow, accompany} );
    //   followPersons = followPersons.join(',');
    //   this.infoForm.addvehicle[this.secIndex].followPersons = followPersons;
    //   this.infoForm.addvehicle[this.secIndex].jsonPerson = jsonPerson;
    //   this.dialogVisible = false;
    // },

    // //  获取选择人员
    // getCheckedNodes(){
    //   this.selectNodeList = [];
    //   let tree2 = this.$refs.tree2;
    //   let selectList = [];
    //   let id_list = ['parent_level_d1','parent_level_d2','parent_level_d3'];
    //   tree2.getCheckedNodes(false, false).forEach((item, index) => {
    //     if (!id_list.includes(item.id)) {
    //       selectList.push(item);
    //     }
    //   });
    //   this.selectNodeList = selectList;
    // },

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
      this.$refs.infoForm.validate(valid => {
        if(valid){
          let params = JSON.parse(JSON.stringify(this.infoForm.addvehicle||[]));
          params = params.map( item=>{
            item.state = state;
            item.planId = this.id;
            item.planNo = this.planNo;

            item.jsonPerson.master = (item.jsonPerson.master||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonPerson.follow = (item.jsonPerson.follow||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonPerson.accompany = (item.jsonPerson.accompany||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })

            item.useStartTime = this.$formatDate(item.useStartTime);
            item.useEndTime = this.$formatDate(item.useEndTime);
            return item;
          });

          let msg = '是否确认提交办理，并返回列表页？';
          if(state == 0){
            msg = '是否确认保存修改内容，并返回列表页？';
          }
          this.$confirm(msg)
          .then(() => {
            if(this.type == 'add'){
              this.$axiosJsonPost(API.planCars_batchInsert, params).then(res => {
                if(res.status == 200){
                  // this.$message({type: 'success', message: '操作成功！'});
                  this.$router.go(-1);
                }
              }).finally(()=>{
                // console.log('finally');
              });
            }else if(this.type == 'edit'){
              params = params[0];
              this.$axiosJsonPut(API.planCars, params).then(res => {
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

    // 点击添加
    scheduleAdd() {
      let addVehicle = JSON.parse(JSON.stringify(addVehicleNew));
      this.infoForm.addvehicle.push(addVehicle);
    },
    
    //删除
    deleteItems(item, index) {
      if (index !== -1) {
        this.infoForm.addvehicle.splice(index, 1)
      }
    },
  }
}
</script>

<style lang="scss" scoped>


  .many-form-flex{
    display: flex;
    align-items: stretch;
  }

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
    padding-top: 10px;
    .text-h5{
      padding-bottom: 10px;
    }
    .u-bread-text{
      margin-top: -3px;
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




