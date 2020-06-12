<template>
  <div>
    <el-dialog title="租金" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="820px" :before-close="resetForm">
      <div style="max-height: 400px;overflow: auto;padding-right: 10px;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
          <div class="f-clearfix" v-for="(item, index) in ruleForm.datas" :key="index" :class="[index !== 0?'mt5': '']">
            <div style="width:98px; padding-right: 12px;text-align: right;float: left;line-height: 40px;">
              <span style="padding-right: 4px;color: red;">*</span>年增长率
            </div>
            <div style="width: 20%;float: left;">
              <el-form-item label-width="0px" :key="item.key" :prop="'datas.' + index + '.startMile'">
                <el-input class="disable-bg-input" v-if="index === 0" v-model="ruleForm.datas[0].startMile" auto-complete="off" disabled placeholder="请输入">
                  <template slot="append" style="margin-left: -100px;">年</template>
                </el-input>
                <el-input class="disable-bg-input" v-if="index>0" v-model="ruleForm.datas[index-1].eddMile" auto-complete="off" disabled placeholder="请输入">
                  <template slot="append" style="margin-left: -100px;">年</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="width: 3%;font-size: 28px;float: left;">~</div>
            <div style="width: 24%;float: left;">
              <span v-if="index==0">
                <el-form-item label-width="0px" :key="item.key" :prop="'datas.' + index + '.eddMile'" :rules="[
                  { required: true, message: '租赁时长不能为空', trigger: 'change' },
									{ pattern: /^(\d|([1-9]\d+))?$/, message: '租赁时长为大于等于零的整数', trigger: 'change' },
									{ max:6, message: '租赁时长不能大于等于1000000', trigger: 'change' } ]">
                  <el-input placeholder="请输入" v-model="item.eddMile" auto-complete="off">
                    <template slot="append" style="margin-left: -100px;">年</template>
                  </el-input>
                </el-form-item>
              </span>
              <span v-if="index!=0">
                <span>
                  <el-form-item label-width="0px" :key="item.key" :prop="'datas.' + index + '.eddMile'" :rules="[{ required: true, validator: validateType, trigger: 'change'}]">
                    <el-input @input="minChange(index)" @blur="changeMile(index,item.eddMile,ruleForm.datas[index-1].eddMile)" placeholder="租赁时长" v-model="item.eddMile" auto-complete="off">
                      <template slot="append" style="margin-left: -100px;">年</template>
                    </el-input>
                  </el-form-item>
                </span>
              </span>
            </div>
            <div style="width: 25%;float: left;">
              <el-form-item label-width="20px" :key="item.key" :prop="'datas.' + index + '.mileFee'" :rules="[
							  { required: true, message: '增长率不能为空', trigger: 'change' },
								{ pattern: /^(\d|([1-9]\d+))(\.\d{1,2})?$/, message: '增长率为最多两位小数的有效数字', trigger: 'change' } ]">
                <el-input placeholder="请输入" v-model="item.mileFee" auto-complete="off">
                  <template slot="append" style="margin-left: -100px;">%</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="width: 12%;padding-left: 10px;float: left;">
              <el-button class="btn btn-success radius5" style="width: auto;" v-if="index==0" @click.prevent="addDatas()">新增</el-button>
              <el-button class="btn btn-default radius5" style="width: auto;" v-if="index !=0" @click.prevent="deleteDatas(index)">删除</el-button>
            </div>
          </div>
          <el-form-item label="乙方支付租金方式" :label-width="formLabelWidth" prop="rentPay">
            <el-select v-model="ruleForm.rentPay" filterable clearable placeholder="请选择" class="h-dialog-add-select">
              <el-option v-for="item in RentPayList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每次租金收取时间" :label-width="formLabelWidth" prop="rentCollection">
            <el-select v-model="ruleForm.rentCollection" filterable clearable placeholder="请选择" class="h-dialog-add-select">
              <el-option v-for="item in RentCollectionList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="首次租金缴交额度" :label-width="formLabelWidth" prop="rentCollectionLimit">
            <el-select v-model="ruleForm.rentCollectionLimit" filterable clearable placeholder="请选择" class="h-dialog-add-select">
              <el-option v-for="item in RentLimitFirstList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="首次租金缴交时间" :label-width="formLabelWidth" prop="rentTime">
            <el-select v-model="ruleForm.rentTime" filterable clearable placeholder="请选择" class="h-dialog-add-select">
              <el-option v-for="item in RentPayTimeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="editRent">保存</el-button>
      </span>

    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    // const validateType = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('租赁时长不能为空'));
    //   } else if (value.length > 0) {
    //     callback();
    //   }
    // };
    return {
      dialogFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      RentPayList: [], //乙方支付租金方式
      RentCollectionList: [], //每次租金收取时间
      RentLimitFirstList: [], //首次租金缴纳额度
      RentPayTimeList: [],//首次租金缴交时间
      rentSetComplexList: [], //租金符合增长率集合
      rentDetail: {}, //修改详情集合
      setValue: '',
      ruleForm: {
        rentPay: '', //支付方式
        rentCollection: '', //每次租金收取
        rentTime: '', //首次租金缴交时间
        rentCollectionLimit: '', //首次租金缴纳
        rentSet: '', //租金增长率集合
        datas: [
          {
            startMile: '0', // 初始年
            eddMile: '', // 租赁时长
            mileFee: '' // 年增长率
          }
        ]
      },
      rules: {
        rentPay: [
          { required: true, message: '请输入乙方支付租金方式', trigger: 'change' },
        ],
        rentTime: [
          { required: true, message: '请选择缴交时间', trigger: 'change' }
        ],
        rentCollection: [
          { required: true, message: '请输入每次租金收取时间', trigger: 'change' }
        ],
        rentCollectionLimit: [
          { required: true, message: '请输入首次租金缴交时间', trigger: 'change' }
        ]
      },
      formLabelWidth: '150px'
    };
  },
  activated() {

  },
  methods: {
    //输入框验证
    validateType(rule, value, callback) {
      if (value === '') {
        callback(new Error('租赁时长不能为空'));
      } else if (value < 0 || value > 1000000) {
        callback(new Error('租赁时长不能大于等于1000000'));
      } else if (!/^(\d|([1-9]\d+))?$/.test(value)) {
        callback(new Error('租赁时长为大于等于零的整数'));
      } else if (value < this.ruleForm.datas[this.setValue - 1].eddMile) {
        callback(new Error('后面租赁时长不能小于前面租赁时长'));
      }else{
        callback()
      }
    },
    //输入框验证index下标值
    minChange(index) {
      this.setValue = index;
      console.log(this.setValue)
    },
    // 初始化弹出框
    openModal(dialogFormVisible) {
      this.dialogFormVisible = true;
      this.geteditRequest();
    },
    // 获取下拉框值
    getSelectRequest() {
      this.$axiosGet(API.sysmanage_getRentSet, {}).then(res => {
        this.RentPayList = res.data.RentPayWayEnum; //乙方支付租金方式
        this.RentCollectionList = res.data.RentCollectionEveryTimeEnum;
        this.RentPayTimeList = res.data.RentCollectionFirstTimeEnum;   //首次租金缴交时间
        this.RentLimitFirstList = res.data.RentCollectionLimitFirstTimeEnum;  //首次租金额度
      });
    },
    // 获取修改详情
    geteditRequest() {
      this.$axiosGet(API.sysmanage_getRentSet, {}).then(res => {
        this.dealRentSetId = res.data.rentSetResponse.dealRentSetId;
        this.rentDetail = res.data.rentSetResponse;
        this.ruleForm.rentPay = this.rentDetail.payWay;//支付方式
        this.ruleForm.rentCollection = this.rentDetail.collectionEveryTime; //每次租金收取时间
        this.ruleForm.rentCollectionLimit = this.rentDetail.collectionLimitFirstTime; //首次租金缴交额度
        this.ruleForm.rentTime = this.rentDetail.collectionFirstTime; //首次租金缴交时间
        setTimeout(() => {
          this.getSelectRequest()
        }, 500);
        this.rentSetComplexList = res.data.rentSetResponse.rentSetComplexResponseList;
        let data = [];
        this.ruleForm.datas = [];
        this.rentSetComplexList.forEach((value, index) => {
          this.ruleForm.datas.push({ startMile: value.rentStartTime.toString(), eddMile: value.rentEndTime.toString(), mileFee: value.rentRateOfYear.toString() });
        })
      });
    },
    addDatas() {
      // 按分钟按公里新增-新增
      var self = this;
      self.ruleForm.datas.push({ startMile: '', eddMile: '', mileFee: '' });
    },
    deleteDatas(index) {
      // 按分钟按公里新增-删除
      var self = this;
      self.ruleForm.datas.splice(index, 1);
    },
    changeMile(index, endmile, startmile) {
      // 新增
      var self = this;
      if (Number(endmile) < Number(startmile)) {
        self.isBol = false;
        self.message = '租赁时长必须大于初始时长';
        self.ruleForm.datas[index].eddMile = '';
      }
    },


    editRent(ruleForm) {
      var self = this;
      var jsonArray = [];
      self.ruleForm.datas.forEach((value, index) => {
        if (index === 0) {
          jsonArray.push({ rentStartTime:  Number(value.startMile), rentEndTime: Number(value.eddMile), rentRateOfYear: Number(value.mileFee)});
        }
        if (index !== 0) {
          jsonArray.push({ rentStartTime: Number(self.ruleForm.datas[index - 1].eddMile), rentEndTime: Number(value.eddMile), rentRateOfYear: Number(value.mileFee) });
          console.log(jsonArray)
        }
      });
      this.$refs.ruleForm.validate(valid => {
        console.log(111)
        if (valid) {
          let params = {
            dealRentSetId: this.dealRentSetId, //费用标准租金设置主键
            payWay: this.ruleForm.rentPay, //乙方支付租金方式
            collectionEveryTime: this.ruleForm.rentCollection, //每次租金收缴时间
            collectionLimitFirstTime: this.ruleForm.rentCollectionLimit, //首次租金收缴额度
            collectionFirstTime: this.ruleForm.rentTime, //首次租金收缴时间
            rentSwitch: 'ON', //开关
            rentSetComplexResponseList: jsonArray //年增长率
          }
          console.log(params)
          this.$axiosJsonPost(API.sysmanage_updateRentSet, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
              BURYINGPOINT.buryingPoint('经营性房产', '系统设置', '修改租金设置')
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },

    resetForm(ruleForm) {
      this.dialogFormVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          // this.$emit('requestData')
          this.dialogFormVisible = false;
          this.$refs.ruleForm.resetFields();
        }
      }, 1000)

    }
  }
}
</script>
<style lang="scss" scoped>
.h-dialog-add-select {
  width: 477px;
}
.el-form-nobottom {
  margin-bottom: 0;
}
.el-select {
  display: inline-block;
}
</style>
