<template>
  <div>
   <el-dialog title="关联房间" custom-class="h-dialog-add" :visible.sync="relationFormVisible" width="600px" @close="clearRules">
      <el-form label-position="right" label-width="100px" ref="roomRuleForm" :model="roomRuleForm" :rules="roomRules">
        <el-form-item label="房间号" prop="roomNo">
          <el-select v-model="roomRuleForm.roomNo" style="width:100%;" placeholder="请选择房间号" filterable clearable>
            <el-option v-for="(item, index) in list" :key="index" :label="item.roomNo" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relationFormVisible = false">取 消</el-button>
        <el-button type="primary" class="u-submit-btn" :disabled="roomRuleForm.roomNo ==''" :loading="loading" @click="submitClick">确 定</el-button>
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
      relationFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      allocating:false,
      loading:false, //加载
      isSubmit:false, 
      roomNameList:'',
      selectObject:null,
      roomRuleForm: {
        roomNo: '', // 房间号
      },
      list:[], //房间列表
      roomRules: {
        roomNo: [
          { required: true, message: '请选择房间', trigger: 'change' }
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
    openModal(data,selectOneObj) {
      this.relationFormVisible = true;
      this.list =[];
      console.log(data)
      data.forEach((item,index) =>{
        if(item.points =='' || item.points === null){
          this.list.push(item)
        }
      })

      this.selectObject = selectOneObj;
    },
    // 关联房间
    submitClick(){
      // this.$emit('relativeData', this.list.find(item =>  item.roomId == this.roomRuleForm.roomNo))
      this.$refs.roomRuleForm.validate((valid) => {
        if (valid) {
          let params ={
            roomId: this.roomRuleForm.roomNo,
            roomPoints:JSON.stringify(this.selectObject)
          }
          this.loading = true;
          this.$axiosPost(API.plan_bindRoomWithPoints, params).then( res=>{
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;             
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    resetForm(roomRuleForm) {
      this.relationFormVisible = false;
      this.$refs.roomRuleForm.resetFields();
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      if (this.isBol) {
        this.$emit('relativeData', this.list.find(item =>  item.id == this.roomRuleForm.roomNo))
        this.$refs.roomRuleForm.resetFields();
      }
      this.relationFormVisible = false;
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
