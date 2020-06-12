<template>
  <div id="trip-update">
    <section class="section-content">
     
      <div class="reception-form">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="h-table-title">
            <h2>用餐方案</h2>
            <p class="f-color-red">（*为必填项，请检查后提交！)</p>
          </div>
          <button v-show="type=='add'" style="margin-left: 0;" class="u-bread-btn" @click.prevent="mealsAdd"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加申请</button>
          
          <div v-show=" type == 'edit'" class="form-options" style="align-items: center;margin-top: 20px;">
            <h5 class="text-h5">子方案号：{{subPlanNo}}</h5>
          </div>

          <!-- 空列表 -->
          <div class="m-programme-null" v-show="mealsForm.addvehicle.length<=0">
            <img :src="$store.state.imgPath.programmeNull" alt="方案详情">
            <p>暂未添加用餐方案！</p>
          </div>


          <el-form ref="mealsForm" :model="mealsForm">
            <div v-for="(item ,index) in mealsForm.addvehicle" :key="index">
              <div  class="form-options" style="align-items: center;margin-top: 20px;">
                <h5  v-show="type=='add'" class="text-h5">用餐安排{{(index+1)}}</h5>
                <span  v-show="type=='add'" v-if="item.carNum!=1" class="u-bread-text" @click="deleteItems(item, index)"><i class="iconfont icon-circle-remove">删除申请</i> </span>
              </div>

              <table class="h-table-info">
                <tr>
                  <th><i class="f-color-red">*</i>用餐时间</th>
                  <td>
                    <div class="many-form-flex el-form-item__content">
                      <el-form-item style="margin-right: 30px;" :prop="'addvehicle.'+index+'.mealsStartTime'" :rules='mealsRules.mealsStartTime' class="f-inline-block">
                        <el-date-picker v-model="item.mealsStartTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                      </el-form-item>
                      <el-form-item :prop="'addvehicle.'+index+'.mealsTimesType'" :rules='mealsRules.diningChoice' class="f-inline-block">
                        <div class="f-radio-group-width" >
                          <el-radio-group v-model="item.mealsTimesType">
                            <el-radio v-for="(item, index) in mealsTimesTypeList" :key="index" :label="item.value">{{item.name}}</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                    </div>
                  </td>
                  <th><i class="f-color-red">*</i>选择酒店</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.hotelId'" :rules='mealsRules.selectHotel'>
                      <div class="f-input-width">
                        <el-select v-model="item.hotelId" placeholder="请选择酒店">
                          <el-option v-for="(item, index) in hotelInfoList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red"></i>餐厅</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.diningName'" >
                      <el-input v-model="item.diningName" placeholder="请输入餐厅"></el-input>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>用餐类型</th>
                  <td>

                    <el-form-item :prop="'addvehicle.'+index+'.mealsType'" :rules='mealsRules.mealsType' class="f-inline-block">
                      <div class="f-radio-group-width" >
                        <el-form-item>
                          <el-radio-group v-model="item.mealsType">
                            <el-radio v-for="(item, index) in mealsTypeList" :key="index" :label="item.value">{{item.name}}</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </div>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>用餐人数</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.mealsPersonNum'" :rules='mealsRules.dinersNum'>
                      <el-input v-model="item.mealsPersonNum" type='number' placeholder="请输入用餐人数"></el-input>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>陪餐人数</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.accompanyPersonNum'" :rules='mealsRules.accompanyingNum'>
                      <el-input v-model="item.accompanyPersonNum" type='number' placeholder="请输入陪餐人数"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red"></i>联系人</th>
                  <td>
                    <el-form-item class="f-inline-block" :prop="'addvehicle.'+index+'.linkMan'" >
                      <el-input v-model="item.linkMan" placeholder="请输入姓名" style="width:220px"></el-input>
                    </el-form-item>-
                    <el-form-item class="f-inline-block" :prop="'addvehicle.'+index+'.position'" >
                      <el-input v-model="item.position" placeholder="请输入职务" style="width:220px"></el-input>
                    </el-form-item>-
                    <el-form-item class="f-inline-block" :prop="'addvehicle.'+index+'.phoneNo'" :rules='mealsRules.phoneNo'>
                      <el-input v-model="item.phoneNo" placeholder="请输入手机号码" style="width:220px"></el-input>
                    </el-form-item>
                  </td>
                  <th>备注</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.remark'" >
                      <el-input v-model="item.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>用餐人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.mealsPersons'" >
                      <el-input @focus="setPerson(index, 'meals')" :readonly="true" v-model="item.mealsPersons" placeholder="用餐人员"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>陪餐人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.accompanyPersons'" >
                      <el-input @focus="setPerson(index, 'accompany')" :readonly="true" v-model="item.accompanyPersons" placeholder="陪餐人员"></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </table>

            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;" v-show="mealsForm.addvehicle.length>0">
            <el-button class="u-submit-btn cancel-btn" @click="carCommit(0)">保  存</el-button>
            <el-button class="u-submit-btn submit-btn" @click="carCommit(1)">提  交</el-button>
          </div>
        </div>
      </div>

      <el-dialog title="选择人员" :visible.sync="dialogVisible" width="660px">
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

let mealsOpt = {
  "accompanyPersonNum": '',
  "accompanyPersons": "",
  "diningName": "",
  "hotelId": "",
  "hotelName": "",
  "jsonAccompanyPerson": {},
  "jsonMealsPerson": {},
  "linkMan": "",
  "mealsPersonNum": '',
  "mealsPersons": "",
  "mealsStartTime": "",
  "mealsTimesType": "",
  "mealsType": "",
  "phoneNo": "",
  "planId": "",
  "planNo": "",
  "position": "",
  "state": ""
};

export default {
  data() {
    return {
      id: this.$route.query.id||'',       // 方案id
      type: this.$route.query.type||'',       
      planNo: this.$route.query.planNo||'',       // planNo
      planSubId: this.$route.query.planSubId||'',       // planSubId

      subPlanNo: '',    //子方案号
      
      dialogVisible: false,

      secIndex: 0,    // 当前操作的index
      secType: '',    // 当前操作的类型

      // 默认选中人员
      defaultKeys: [],

      // 已选人员
      selectNodeList: [],

      // 人员列表数据
      dataList: [],

      // 用餐人员
      mealsPersonList: [],

      // 陪餐人员
      accompanyPersonList: [],

      // 酒店列表
      hotelInfoList: [],

      // 餐次类型
      mealsTimesTypeList: [],

      // 用餐类型
      mealsTypeList: [],


      //用餐
      mealsForm: {
        addvehicle: [
          {
            "accompanyPersonNum": '',
            "accompanyPersons": "",
            "diningName": "",
            "hotelId": "",
            "hotelName": "",
            "jsonAccompanyPerson": {},
            "jsonMealsPerson": {},
            "linkMan": "",
            "mealsPersonNum": '',
            "mealsPersons": "",
            "mealsStartTime": "",
            "mealsTimesType": "",
            "mealsType": "",
            "phoneNo": "",
            "planId": "",
            "planNo": "",
            "position": "",
            "state": ""
          }
        ]
      },
      mealsRules: {
        mealsStartTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
        diningChoice: [{ required: true, message: '用餐不能为空', trigger: 'change' }],
        mealsType: [{ required: true, message: '请选择用餐类型', trigger: 'change' }],
        selectHotel: [{ required: true, message: '酒店不能为空', trigger: 'change' }],
        dinersNum: [{ required: true, message: '用餐人数不能为空', trigger: 'change' }],
        accompanyingNum: [{ required: true, message: '陪餐人数不能为空', trigger: 'change' }],
        phoneNo: [{ pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的电话', trigger: 'change' }],
      },
    }
  },
  activated() {
    this.getPlanDetail();  //获取方案详情， 只在编辑时候获取
    this.getDlist();  // 获取用餐类型
    this.getAccompanyPersonList();    // 陪餐人员
    this.getMealsPersonList();        // 用餐人员
    this.hotelInfos();                // 酒店列表
  },
  deactivated(){
    this.$destroy();
  },
  methods: {

    //获取方案详情， 只在编辑时候获取
    getPlanDetail(){
      if( this.type != 'edit' ){ return; }
      let planSubId = '/'+this.planSubId;
      this.$axiosGet(API.planMeals+planSubId).then(res => {
        if(res && res.data){
          let addvehicle = res.data;
          if( typeof addvehicle.jsonAccompanyPerson == "string" ){
            addvehicle.jsonAccompanyPerson = JSON.parse(addvehicle.jsonAccompanyPerson);
          }
          if( typeof addvehicle.jsonMealsPerson == "string" ){
            addvehicle.jsonMealsPerson = JSON.parse(addvehicle.jsonMealsPerson);
          }
          this.subPlanNo = addvehicle.subPlanNo;
          this.mealsForm.addvehicle = [];
          this.mealsForm.addvehicle.push(addvehicle);
        }
      });
    },  

    // 获取房间类型字典
    getDlist(){
      let code = '/D05,D06';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        if(res && res.data){
          this.mealsTimesTypeList = res.data.D05||[];
          this.mealsTypeList = res.data.D06||[];
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

    // 获取用餐人员
    getMealsPersonList(){
      this.$axiosGet(API.planPerson_getPlanMealsList+'/'+this.id).then(res => {
        if( res && res.data){
          let fromData = this.handlePersonList(res)||[];
          this.mealsPersonList = fromData;
        }
      });
    },

    // 获取用餐人员
    getAccompanyPersonList(){
      this.$axiosGet(API.planPerson_getAccompanyPersonList+'/'+this.id).then(res => {
        if( res && res.data){
          let fromData = this.handlePersonList(res)||[];
          this.accompanyPersonList = fromData;
        }
      });
    },

    // 处理人员列表
    handlePersonList( res ){
      let fromData = [];
      let masterGuestOpt = { id: 'parent_level_d1', label: "主宾", children: [] };
      let accompanyPersonOpt = { id: 'parent_level_d2', label: "来宾", children: [] };
      let followGuestOpt = { id: 'parent_level_d3', label: "陪同人员", children: [] };

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

      return fromData;
    },

    //选择人员
    setPerson(index, type){   
      this.selectNodeList = [];
      this.dialogVisible = true;
      this.secIndex = index;
      this.secType = type;

      let jsonPerson = {};
      if(type == 'meals'){
        this.dataList = this.mealsPersonList;
        jsonPerson = this.mealsForm.addvehicle[index].jsonMealsPerson||{};
      }else{
        this.dataList = this.accompanyPersonList;
        jsonPerson = this.mealsForm.addvehicle[index].jsonAccompanyPerson||{};
      }
      
      let checkedKeys = [], selectNodeList = [];
      if( typeof jsonPerson == "string" ){
        jsonPerson = JSON.parse(jsonPerson);
      }
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
      let surePersons = [];
      let master = [], follow = [], accompany = [];
      this.selectNodeList.forEach((item, index) => {
        if (item.groupId) {
          surePersons.push(item.label);
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
      surePersons = surePersons.join(',');
      
      if( this.secType == 'meals' ){
        this.mealsForm.addvehicle[this.secIndex].mealsPersons = surePersons;
        this.mealsForm.addvehicle[this.secIndex].jsonMealsPerson = jsonPerson;
      }else{
        this.mealsForm.addvehicle[this.secIndex].accompanyPersons = surePersons;
        this.mealsForm.addvehicle[this.secIndex].jsonAccompanyPerson = jsonPerson;
      }
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

    // 提交
    carCommit(state){
      this.$refs.mealsForm.validate(valid => {
        if(valid){
          let params = JSON.parse(JSON.stringify(this.mealsForm.addvehicle||[]));
          params = params.map( item=>{
            item.state = state;
            item.planId = this.id;
            item.planNo = this.planNo;

            this.hotelInfoList.forEach(hotel => {
              if (hotel.id == item.hotelId) {
                item.hotelName = hotel.name;
              }
            });

            item.jsonMealsPerson.accompanyPerson = (item.jsonMealsPerson.accompanyPerson||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonMealsPerson.followGuest = (item.jsonMealsPerson.followGuest||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonMealsPerson.masterGuest = (item.jsonMealsPerson.masterGuest||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonAccompanyPerson.accompanyPerson = (item.jsonAccompanyPerson.accompanyPerson||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonAccompanyPerson.followGuest = (item.jsonAccompanyPerson.followGuest||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })
            item.jsonAccompanyPerson.masterGuest = (item.jsonAccompanyPerson.masterGuest||[]).map( item=>{
              return { id: item.id, name: item.name||item.label }
            })

            item.mealsStartTime = this.$formatDate(item.mealsStartTime);
            return item;
          });

          let msg = '是否确认提交办理，并返回列表页？';
          if(state == 0){
            msg = '是否确认保存修改内容，并返回列表页？';
          }
          this.$confirm(msg)
          .then(() => {
            if(this.type == 'add'){
              this.$axiosJsonPost(API.planMeals_batchInsert, params).then(res => {
                if(res.status == 200){
                  // this.$message({type: 'success', message: '操作成功！'});
                  this.$router.go(-1);
                }
              }).finally(()=>{
                // console.log('finally');
              });
            }else if(this.type == 'edit'){
              params = params[0];
              // if(typeof params.jsonMealsPerson != 'string'){
              //   params.jsonMealsPerson = JSON.stringify(params.jsonMealsPerson);
              // }
              // if(typeof params.jsonAccompanyPerson != 'string'){
              //   params.jsonAccompanyPerson = JSON.stringify(params.jsonAccompanyPerson);
              // }
              this.$axiosJsonPut(API.planMeals, params).then(res => {
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
    
    // 增加用餐
    mealsAdd() {
      this.mealsForm.addvehicle.push(JSON.parse(JSON.stringify(mealsOpt)));
    },
    // 刪除用餐
    deleteItems(item, index) {
      if (index !== -1) {
        this.mealsForm.addvehicle.splice(index, 1)
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
    padding-top: 20px;
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

