<template>
  <div class="trip-update">
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="费用结算" :item="['生成结算单']"></Y-Breadcrumb>
        <!-- <Y-Breadcrumb v-show="type == 'edit'" title="接待方案" :item="['编辑子方案']"></Y-Breadcrumb> -->
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn f-cursor-pointer" @click="$router.go(-1)">
            返回
          </div>
        </div>
      </div>

      <section v-show="readStape==1" class="section-content" v-loading="loading">
        <div class="h-table-title">
          <h2>结算单</h2>
        </div>

        <!-- 写入模块 -->
        <div class="statement-form">

          <div class="h-tab-content" style="padding-bottom: 20px;">
            
            <el-form ref="accommodForm" :model="formData">

              <!-- 住宿费 -->
              <div class="u-left-border-title">
                <h2>住宿费</h2>
                <button style="margin-left: 0;" class="u-bread-btn" @click.prevent="accommodAdd('accommodationSettlements')"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加条目</button>
              </div>

              <el-table :data="formData.accommodationSettlements" stripe style="width: 100%">
                <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
                <el-table-column prop="subPlanNo" label="子订单号"></el-table-column>

                <el-table-column prop="roomType" label="房间类型">
                  <template slot-scope="scope">
                    <el-form-item :prop="'accommodationSettlements.' + scope.$index + '.roomType'" :rules='getRule("房间类型", 1)'>
                      <div class="set-form-item">
                        <el-select v-model="scope.row.roomType" placeholder="选择房间类型">
                          <el-option
                            v-for="(item, index) in roomTypeList"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="price" label="单价">
                  <template slot-scope="scope">
                    <el-form-item :prop="'accommodationSettlements.' + scope.$index + '.price'" :rules='getRule("单价")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.price" placeholder="单价"></el-input> 元/天
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="validTime" label="住宿日期">
                  <template slot-scope="scope">
                    <el-form-item :prop="'accommodationSettlements.' + scope.$index + '.validTime'" class="valid-time" :rules="statementRules.validTime">
                      <el-date-picker v-model="scope.row.stayStartTime" type="date" placeholder="请选择开始日期"></el-date-picker>
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker v-model="scope.row.stayEndTime" type="date" placeholder="请选择结束日期"></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="days" label="住宿天数">
                  <template slot-scope="scope">
                    <el-form-item :prop="'accommodationSettlements.' + scope.$index + '.days'" :rules='getRule("住宿天数")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.days" placeholder="住宿天数"></el-input> 天
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="totalCost" label="总价">
                  <template slot-scope="scope">
                    <el-form-item :prop="'accommodationSettlements.' + scope.$index + '.totalCost'" :rules='getRule("总价")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.totalCost" placeholder="总价"></el-input>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="90">
                  <template slot-scope="scope">
                    <el-button type="text">删除</el-button>
                  </template>
                </el-table-column>
                

              </el-table>


              <!-- 餐饮费 -->
              <div class="u-left-border-title">
                <h2>餐饮费</h2>
                <button style="margin-left: 0;" class="u-bread-btn" @click.prevent="accommodAdd('mealsSettlements')"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加条目</button>
              </div>
              <el-table :data="formData.mealsSettlements" stripe style="width: 100%">
                <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
                <el-table-column prop="subPlanNo" label="子订单号" width="220"></el-table-column>

                <el-table-column prop="mealsType" label="用餐类型">
                  <template slot-scope="scope">
                    <el-form-item :prop="'mealsSettlements.' + scope.$index + '.mealsType'" :rules='getRule("用餐类型", 1)'>
                      <div class="set-form-item">
                        <!-- <el-input v-model="scope.row.mealsType" placeholder="用餐类型"></el-input> -->
                        <el-select v-model="scope.row.mealsType" placeholder="选择用餐类型">
                          <el-option
                            v-for="(item, index) in mealsTypeList"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="time" label="费用发生日期">
                  <template slot-scope="scope">
                    <el-form-item :prop="'mealsSettlements.' + scope.$index + '.time'" class="valid-time" :rules='getRule("费用发生日期")'>
                      <el-date-picker v-model="scope.row.time" type="date" placeholder="费用发生日期"></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="totalCost" label="自结">
                  <template slot-scope="scope">
                    <el-form-item :prop="'mealsSettlements.' + scope.$index + '.totalCost'" :rules='getRule("自结")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.totalCost" placeholder="自结"></el-input> 元
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="90">
                  <template slot-scope="scope">
                    <el-button type="text">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>


              <!-- 会场费 -->
              <div class="u-left-border-title">
                <h2>会场费</h2>
                <button style="margin-left: 0;" class="u-bread-btn" @click.prevent="accommodAdd('meetingSettlements')"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加条目</button>
              </div>
              <el-table :data="formData.meetingSettlements" stripe style="width: 100%">
                <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
                <el-table-column prop="subPlanNo" label="子订单号" width="220"></el-table-column>

                <el-table-column prop="meetingRoom" label="会议室">
                  <template slot-scope="scope">
                    <el-form-item :prop="'meetingSettlements.' + scope.$index + '.meetingRoom'" :rules='getRule("会议室")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.meetingRoom" placeholder="会议室"></el-input>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="usedTime" label="使用时长">
                  <template slot-scope="scope">
                    <el-form-item :prop="'meetingSettlements.' + scope.$index + '.usedTime'" :rules='getRule("使用时长")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.usedTime" placeholder="使用时长"></el-input> 小时
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="time" label="费用发生日期">
                  <template slot-scope="scope">
                    <el-form-item :prop="'meetingSettlements.' + scope.$index + '.time'" class="valid-time" :rules='getRule("费用发生日期")'>
                      <el-date-picker v-model="scope.row.time" type="date" placeholder="费用发生日期"></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="totalCost" label="总价">
                  <template slot-scope="scope">
                    <el-form-item :prop="'meetingSettlements.' + scope.$index + '.totalCost'" :rules='getRule("总价")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.totalCost" placeholder="总价"></el-input> 元
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="90">
                  <template slot-scope="scope">
                    <el-button type="text">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>


              <!-- 其他费用 -->
              <div class="u-left-border-title">
                <h2>其他费用</h2>
                <button style="margin-left: 0;" class="u-bread-btn" @click.prevent="accommodAdd('otherSettlements')"><i class="el-icon-circle-plus-outline" style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"></i>添加条目</button>
              </div>

              <el-table :data="formData.otherSettlements" stripe style="width: 100%">
                <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
                <el-table-column prop="subPlanNo" label="子订单号" width="220"></el-table-column>

                <el-table-column prop="remark" label="费用说明">
                  <template slot-scope="scope">
                    <el-form-item :prop="'otherSettlements.' + scope.$index + '.remark'" :rules='getRule("费用说明")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.remark" placeholder="费用说明"></el-input>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="time" label="费用发生日期">
                  <template slot-scope="scope">
                    <el-form-item :prop="'otherSettlements.' + scope.$index + '.time'" class="valid-time" :rules='getRule("费用发生日期")'>
                      <el-date-picker v-model="scope.row.time" type="date" placeholder="费用发生日期"></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="totalCost" label="总价">
                  <template slot-scope="scope">
                    <el-form-item :prop="'otherSettlements.' + scope.$index + '.totalCost'" :rules='getRule("总价")'>
                      <div class="set-form-item">
                        <el-input v-model="scope.row.totalCost" placeholder="总价"></el-input> 元
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="90">
                  <template slot-scope="scope">
                    <el-button type="text">删除</el-button>
                  </template>
                </el-table-column>
                
              </el-table>

              <div class="form-cont">
                <div>
                  合计： {{totalCost}} 元
                </div>

                <div style="display: flex;align-items: center;">
                  <p style="width: 90px;">折扣率：</p><el-input placeholder="折扣率" type="number" max="100" min="0" v-model="totalDiscount" clearable> </el-input> 
                  <span> %</span>
                </div>

                <div>
                  折后价： {{discountTotalCost}} 元
                </div>
              </div>

            </el-form>

            
          </div>
        </div>

      </section>

      <hotel-statement-read v-show="readStape==2" :formData="formData" :totalCost="totalCost" :discountTotalCost="discountTotalCost" :totalDiscount="totalDiscount"></hotel-statement-read>


      <div class="f-text-center" style="margin-bottom: 20px;">
        <el-button v-show="readStape==1" class="u-submit-btn submit-btn" @click="readStapeChange(2)" style="margin: 0;">预  览</el-button>
        <el-button v-show="readStape==2" class="u-submit-btn submit-btn" @click="readStapeChange(1)">编  辑</el-button>
        <el-button v-show="readStape==2" :loading="formLoad" class="u-submit-btn submit-btn" @click="readStapeChange(3)">提交审核</el-button>
      </div>
      
      <!-- 添加条目 -->
      <el-dialog title="添加子订单" custom-class="h-dialog-add" :visible.sync="dialogVisible" width="700px" @close="clearForm">
        <div>
          <el-form label-position="right" label-width="100px" :model="ruleForm" ref="ruleForm">
            <el-form-item label="是否关联子订单">
              <el-radio-group v-model="ruleForm.auditType" @change="clearRemarkValidate">
                <el-radio :disabled="addState=='otherSettlements'" label="YES">是</el-radio>
                <el-radio label="NO">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :class="{'visibility-hidden': ruleForm.auditType == 'NO'}" label="选择子订单" prop="subPlanId" :rules="{required: ruleForm.auditType == 'YES', message:'意见不能为空', trigger: 'change'}">
              <el-select v-model="ruleForm.subPlanId" placeholder="选择子订单">
                <el-option
                  v-for="(item, index) in subPlanIdList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <p style="color: red;padding-left: 20px;">注：如选择“否”，则生成一条新的订单号并计入结算单中</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button class="u-submit-btn submit-btn" type="primary" :loading="dialogLoading" @click="submitClick">确 定</el-button>
        </span>
      </el-dialog>
    </section>
  </div>

</template>

<script>

let addFormList = {
  accommodationSettlements: [ //住宿结算单列表
    {
      "days": '',
      "id": "",
      "price": '',
      "remark": "",
      "roomType": "",
      "settlementId": "",
      "stayEndTime": "",
      "stayStartTime": "",
      "subPlanNo": "",
      "totalCost": "",

      time: ''
    }
  ],   
  "mealsSettlements": [   // 餐饮费
    {
      "id": "",
      "mealsType": "",
      "remark": "",
      "settlementId": "",
      "subPlanNo": "",
      "totalCost": '',

      time: ''
    }
  ],
  "meetingSettlements": [    // 会场费
    {
      "id": "",
      "meetingRoom": "",
      "remark": "",
      "settlementId": "",
      "subPlanNo": "",
      "totalCost": '',
      "usedTime": "",

      time: ''
    }
  ],
  "otherSettlements": [
    {
      "description": "",
      "id": "",
      "remark": "",
      "settlementDetailId": "",
      "totalCost": '',
      time: ''
    }
  ],
};
import hotelStatementRead from '@/components/expenses-manage/hotel-statement/hotel-statement-read'
export default {
  components: {
    hotelStatementRead
  },
  data() {

    let validTime = (rule, value, callback) => {
      let field = (rule.field||'').replace('accommodationSettlements.', '').replace('.validTime', '')*1;
      let startT = (this.formData.accommodationSettlements[field]||{}).stayStartTime;
      let endT = (this.formData.accommodationSettlements[field]||{}).stayEndTime;
      if( !startT ){
        callback(new Error("开始日期不能为空"));
      }else if(!endT){
        callback(new Error("结束日期不能为空"));
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

      readStape: 1,   //  1编辑 2预览
      
      loading: false,
      id: this.$route.query.id||'',       // 方案id
      type: this.$route.query.type||'',   // create添加  edit编辑
      planNo: this.$route.query.planNo||'',  

      formLoad: false,
      dialogLoading: false,

      addState: '',

      dialogVisible: false,   //  添加条目弹框
      ruleForm: {
        auditType: 'YES',
        subPlanId: ''
      },
      subPlanIdList: [],

      subPlanIds:{
        hasGetType: [],   // 标记哪些数据获取过
        accommodationSettlements: [],   
        "mealsSettlements": [],
        "meetingSettlements": [],
        "otherSettlements": [],
      },


      // 用餐类型
      mealsTypeList: [],
      // 房间类型
      roomTypeList: [],

      totalDiscount: 100,

      formData: {
        accommodationSettlements: [ //住宿结算单列表
          {
            "days": '2432142',
            "id": "fsgfsgdfsdffsdf",
            "price": 4124,
            "remark": "其他xx费用",
            "roomType": "1",
            "settlementId": "wfasgsd",
            "stayEndTime": "",
            "stayStartTime": "",
            "subPlanNo": "4123536458568",
            "totalCost": 4214,

            time: ''
          }
        ],   
        "mealsSettlements": [   // 餐饮费
          {
            "id": "4235353",
            "mealsType": "1",
            "remark": "4124324",
            "settlementId": "41243",
            "subPlanNo": "42143243",
            "totalCost": 42343543,

            time: ''
          }
        ],
        "meetingSettlements": [    // 会场费
          {
            "id": "4213423",
            "meetingRoom": "412423",
            "remark": "53525",
            "settlementId": "fafgsdgfsg",
            "subPlanNo": "faefefgsgs",
            "totalCost": 432143425,
            "usedTime": "2002-02-02T09-09-09",

            time: ''
          }
        ],
        "otherSettlements": [
          {
            "description": "52353553",
            "id": "512353215253",
            "remark": "645346366",
            "settlementDetailId": "42355543546",
            "totalCost": 4234,

            time: ''
          }
        ],
      },

      // 表单验证
      statementRules: {
        validTime: [{validator: validTime,trigger: "change",required: true}],
      }
      


    };
  },
  activated() {
    this.getDlist();    // 字典
  },
  deactivated(){
    this.$destroy();
  },
  computed: {
    totalCost(){
      let { accommodationSettlements=[], mealsSettlements=[], meetingSettlements=[], otherSettlements=[], } = this.formData;
      let res = 0;
      let res1 = accommodationSettlements.reduce((total, item) => {
        let num = item.totalCost*1000 || 0;
        return total+num;
      },0);

      let res2 = mealsSettlements.reduce((total, item) => {
        let num = item.totalCost*1000 || 0;
        return total+num;
      },0);

      let res3 = meetingSettlements.reduce((total, item) => {
        let num = item.totalCost*1000 || 0;
        return total+num;
      },0);

      let res4= otherSettlements.reduce((total, item) => {
        let num = item.totalCost*1000 || 0;
        return total+num;
      },0);
      res = (res1 + res2 + res3 + res4)*0.001;
      res = res.toFixed(2);
      return res;
    },
    discountTotalCost(){
      let res = this.totalCost*1;
      let totalDiscount = this.totalDiscount;
      if(typeof totalDiscount == 'undefined'){
        totalDiscount = 1;
      }
      totalDiscount = totalDiscount||0;
      res = res*totalDiscount*0.01;
      res = res.toFixed(2);
      return res;
    },
  },
  methods: {

    readStapeChange(stape){    //  预览和编辑
      if(stape == 2){   // 预览
        this.$refs.accommodForm.validate(valid => {
          if(valid){
            this.readStape = stape;
          }
        })
      }else if(stape == 1){   // 编辑
        this.readStape = stape;
      }else if(stape == 3){   // 提交审核
        
      }
    },

    clearForm() {
      this.$refs.ruleForm.resetFields();
    },

    // 根据主订单号获取所有子订单
    getSubPlanNos(addState){
      // 0用车方案1住宿方案2用餐方案3会议方案
      let states = ['0', 'accommodationSettlements', 'mealsSettlements', 'meetingSettlements'];
      let subPlanType = states.indexOf(addState);
      let params = {
        planNo: this.planNo,
        subPlanType,    
        actionType: 0,       // 0首次创建;1补录
        settlementId: this.id
      };
      this.$axiosGet(API.planSub_getSubPlanNos, params).then(res => {
        if(res && res.status==200){
          this.subPlanIds[addState] = res.data || [];
          this.subPlanIds.hasGetType.push(addState);      //获取过
        }
      });
    },

    // 添加条目
    submitClick() {
      let { addState } = this;
      if(this.ruleForm.auditType=='NO'){     // 自动生成子订单添加
        let addOpt = JSON.parse(JSON.stringify(addFormList[addState][0]));
        let subPlanNo = this.randomCoding();
        addOpt.subPlanNo = subPlanNo;   // 子订单号
        this.formData[addState].push(addOpt);
        this.clearForm();
        this.dialogVisible = false;
      }else{      // 去后台获取子订单回显
        this.dialogLoading = true;    // 加载数据
        
      }
    },

    clearRemarkValidate() {
      this.ruleForm.subPlanId = '';
    },

    // 获取房间类型字典
    getDlist(){
      let code = '/D03,D06';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        if(res && res.data){
          this.roomTypeList = res.data.D03 || [];
          this.mealsTypeList = res.data.D06||[];
        }
      });
    },
    // 生成随机子订单
    randomCoding(n=6){
      let idvalue = (this.$currentDate()).replace( /-/g, '' );
      idvalue += '-';
      let arr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
      for(let i=0; i<n; i++){
        idvalue += arr[Math.floor(Math.random()*36)];
      }
      return idvalue;
    },
    // 添加住宿
    accommodAdd(addState){
      if(!this.subPlanIds.hasGetType.includes(addState) && addState!='otherSettlements'){ // 没有获取过, 其他的没有
        this.getSubPlanNos(addState);   // 获取数据
      }
      if( addState=='otherSettlements' ){   //其他的不能选
        this.ruleForm.auditType = "NO";
      }else{
        this.ruleForm.auditType = "YES";
      }
      this.addState = addState;
      this.ruleForm.subPlanId = '';
      this.dialogVisible = true;
    },


    // 表单验证
    getRule(message='', type){
      if(type==1){
        message = '请选择'+message;
      }else{
        message += '不能为空';
      }
      return [{ required: true, message, trigger: "change" }];
    }

    
  }
};
</script>

<style lang="scss" scoped>

  .visibility-hidden{
    visibility: hidden;
  }

  .form-cont{
    border: 1px solid #EBEEF5;
    border-top: none;
    display: flex;
    align-items: center;
    padding: 10px 0;
    padding-right: 5px;
    justify-content: flex-end;
    &>div{
      margin-left: 20px;
    }
  }


  .set-form-item{
    .el-input{
      max-width: 200px;
    }
  }

  .statement-form{
    .el-table{
      border: 1px solid #EBEEF5;
      border-bottom: none;
    }
    .el-form-item{
      margin-bottom: 0;
      &.is-error{
        margin-bottom: 20px;
      }
    }
  }

  .statement-form{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 160px;
    }
    .u-left-border-title{
      margin-top: 30px;
      justify-content: space-between;
    }
  }

  .u-bread-btn{
    margin-bottom: 10px;
  }

  
  
  

</style>


<style lang="scss">
  .h-dialog-add{
    .el-form-item__label{
      width: 120px !important;
    }
    .el-form-item__content{
      margin-left: 120px !important;
    }
  }
</style>





