<template>
  <div>
    <el-dialog :title="titleType" custom-class="h-dialog-add" :visible.sync="dialogShow" width="500px">
      <div>
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span v-if="showtips ==='allocation'"> &nbsp;确定取消分配当前房间吗？</span>
         <span v-if="showtips ==='relation'"> &nbsp;确定取消关联当前房间吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" class="u-submit-btn submit-btn" @click="CancellationNullClick">确 定</el-button>
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
      dialogShow: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      loading:false,
      showtips:'', //判断是哪种提示信息
      titleType:'', //弹框标题
      rules: {
        roomPos: [
          { required: true, message: '请选择房间位置', trigger: 'change' }
        ],
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'change' }
        ],      
      },
      ruleForm: {
        domains: [], // 照片集合
        roomPos: [], // 房间位置
        roomNumber: '', // 房间号
        roomType: '', // 房间类型
        useArea: '', // 使用面积
        buildArea: '' // 建造面积
      }
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
    clearForm() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
    },
    submitClick(){},
    // 初始化弹出框
    openModal(type) {
      if(type === 'allocation'){
        this.titleType ="取消分配"
      }else{
        this.titleType ="取消关联"
      }
      this.showtips = type;
      
      this.dialogShow = true;
    },
    resetForm(ruleForm) {
      this.relationFormVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$emit('requestData')
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
