<template>
  <div>
   <el-dialog title="房屋分配" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="600px" @close="clearRules">
      <!-- <div v-if="roomNameList == ''">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span> &nbsp;请选择房间！</span>
      </div> -->
      <el-form label-position="right" label-width="100px" ref="roomRuleForm" :model="roomRuleForm" :rules="roomRules">
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="roomRuleForm.roomNo" disabled clearable placeholder="请选择房间"></el-input>
        </el-form-item>
        <el-form-item label="使用单位" prop="useOrganName">
          <el-select v-model="roomRuleForm.useOrganName" style="width:100%;" placeholder="请选择使用单位" filterable clearable>
            <el-option v-for="item in useOrganList" :key="item.organId" :label="item.organName" :value="item.organId"></el-option>
          </el-select>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" v-if="roomNameList != ''" class="u-submit-btn submit-btn" @click="allocatingRoomClick">确 定</el-button> -->
        <el-button type="primary" v-if="roomNameList == ''" class="u-submit-btn submit-btn" @click="allocatingNullClick">确 定</el-button>
      </span>
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
      ruleForm: {
        courtyardId: '',//院落id
        floorId: '', //楼座id
        courtyardName: '',  // 院落名称
        storeysName: '', //楼层数量
        floorname: '', // 楼座名称
        downStoreysNum: '', //	楼层范围最小值
        upStoreysNum: '', //楼层范围最大值
      },
      courtySelectList: [], // 院落集合
      floorSelectList: [], //楼座集合
      storeySelectList: [], //楼层集合
      rules: {
        courtyardId: [
          { required: true, message: '请输入院落名称', trigger: 'change' },
        ],
        floorId: [
          { required: true, message: '请选择楼座名称', trigger: 'change' }
        ]       
      },
      formLabelWidth: '120px'
    };
  },
  activated() {

  },
  methods: {
    allocatingNullClick() {
      this.allocatingRoomDialog = false;
    },
    CancellationNullClick() {
      this.allocating = false;
    },
    clearRules() {
      if (this.$refs.roomRuleForm) {
        this.$refs.roomRuleForm.resetFields()
      }
    },
    // 初始化弹出框
    openModal(dialogFormVisible) {
      this.dialogFormVisible = true;
    },
 
    allocatingRoomClick() { // 分配房间提交
      let organName = '';
      this.useOrganList.forEach((item, index) => {
        if (item.organId == this.roomRuleForm.useOrganName) {
          organName = item.organName
        }
      })
      this.$refs.roomRuleForm.validate((valid) => {
        if (valid) {
          let params = {
            roomIdList: this.roomId,
            organId: this.roomRuleForm.useOrganName,
            organName: organName,
            dateAssign: FORMATGET.formatGET(this.roomRuleForm.allocationDate).substr(0, 10),
            dateCheckOut: FORMATGET.formatGET(this.roomRuleForm.checkOutDate).substr(0, 10),
            userMode: this.roomRuleForm.useWay
          }
          if (this.roomStatusFiy == 'YES') {
            this.allocatingRoomDialog = false;
            this.YPromptShow = true;
            this.isBol = false;
            this.message = '请选择闲置房间！';
          } else {
            this.$axiosJsonPost(API.room_assign, params).then(res => {
              this.allocatingRoomDialog = false;
              this.YPromptShow = true;
              if (res.result === 'success') {
                this.isBol = true;
                this.$refs.multipleTable.clearSelection();
              } else {
                this.isBol = false;
              }
              this.message = res.message;
            })
          }
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
          this.$emit('relativeData')
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
