<template>
  <div>
   <el-dialog title="房屋分配" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="600px" @close="clearRules">
      <el-form label-position="right" label-width="100px" ref="roomRuleForm" :model="roomRuleForm" :rules="roomRules">
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="roomRuleForm.roomNo" disabled clearable placeholder="请选择房间"></el-input>
        </el-form-item>
        <el-form-item label="使用单位" prop="useOrganName">
            <el-cascader :options="useOrganList" filterable  change-on-select  @change="handleChange" v-model="roomRuleForm.useOrganName" clearable></el-cascader>      
        </el-form-item>
        <el-form-item label="使用方式" prop="useWay">
          <el-select v-model="roomRuleForm.useWay" style="width:100%;" placeholder="请选择使用方式" filterable>
            <el-option v-for="item in userModeDic" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配时间" prop="allocationDate">
          <el-date-picker v-model="roomRuleForm.allocationDate" type="date" clearable placeholder="选择分配时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="退房时间" prop="checkOutDate" v-if="roomRuleForm.useWay == 'WITHOUT' ? false : true">
          <el-date-picker v-model="roomRuleForm.checkOutDate" type="date" clearable placeholder="选择退房时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  class="u-submit-btn submit-btn" @click="allocatingRoomClick">确 定</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {   
    return {
      dialogFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      allocating:false,
      roomNameList:'',
      roomId:'', //房间id
      organId:'', //使用单位id
      organName:'', //使用单位名称
      roomRuleForm: {
        roomNo: '', // 房间号
        useOrganName: '', // 使用单位
        allocationDate: '', // 分配时间
        checkOutDate: '', // 退房时间
        useWay: '' // 使用方式
      },
      roomRules: {
        roomNo: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ],
        useOrganName: [
          { required: true, message: '使用单位不能为空', trigger: 'change' }
        ],
        allocationDate: [
          { required: true, message: '分配时间不能为空', trigger: 'change' }
        ],
        checkOutDate: [
          { required: true, message: '退房时间不能为空', trigger: 'change' }
        ]
      },
      useOrganList: [], // 使用单位
      userModeDic: [], // 使用方式
      formLabelWidth: '120px'
    };
  },
  activated() {

  },
  methods: {
    //产权单位value匹配organId
    handleChange(value) {
      let opt = null, valueId = value[value.length - 1] || '';
      if (valueId) {
        this.useOrganList.forEach((item, index) => {
          let organOpt = this.getOrganOpt(valueId, item);
          organOpt && (opt = organOpt);
        })
      } 
      if(opt){
        this.organId = opt.organId;
        this.organName = opt.organName || '';
      }  
    },
    //递归方法筛选最后一层的数据
    getOrganOpt(valueId, organListItem) {
      let organOpt = null;
      if (organListItem && organListItem.value == valueId) {
        organOpt = organListItem;
      } else if (organListItem.children && organListItem.children.length > 0) {
        organListItem.children.forEach((item, index) => {
          let resOpt = this.getOrganOpt(valueId, item);
          if (resOpt) {
            organOpt = resOpt;
          }
        })
      }
      return organOpt;
    },
    clearRules() {
      if (this.$refs.roomRuleForm) {
        this.$refs.roomRuleForm.resetFields()
      }
    },
    // 初始化弹出框
    openModal(id,roomNo) {
      this.roomId = id;
      this.roomRuleForm.roomNo = roomNo;
      this.dialogFormVisible = true;
      this.roomRuleForm.allocationDate = new Date();
      this.$axiosGet(API.room_getAssignSelect, {}).then(res => {
        this.useOrganList = res.data.useOrganList; // 使用单位
        this.userModeDic = res.data.userModeDic; // 使用方式
        let indexVal = res.data.userModeDic.find(item => item.dicName === '无偿使用')
        this.roomRuleForm.useWay = indexVal.dicValue;

      })
    },
 
    allocatingRoomClick() { // 分配房间提交
      this.$refs.roomRuleForm.validate((valid) => {
        if (valid) {
          let roomIdList = [];
          roomIdList.push(this.roomId);
          let params = {
            roomIdList: roomIdList,
            organId: this.organId,
            organName: this.organName,
            dateAssign: FORMATGET.formatGET(this.roomRuleForm.allocationDate).substr(0, 10),
            userMode: this.roomRuleForm.useWay
          }
          if(this.roomRuleForm.useWay == 'WITHOUT'){
            this.$set(params,'dateCheckOut','')
          }else{
            this.$set(params,'dateCheckOut',FORMATGET.formatGET(this.roomRuleForm.checkOutDate).substr(0, 10))
          }
          this.$axiosJsonPost(API.room_assign, params).then(res => {
            this.allocatingRoomDialog = false;
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
          })
         
        }
      })
    },
  
    resetForm(roomRuleForm) {
      this.dialogFormVisible = false;
      this.$refs.roomRuleForm.resetFields();
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$emit('allocationData')
          this.$refs.roomRuleForm.resetFields();
        }
      }, 1000)
      this.dialogFormVisible= false;
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
