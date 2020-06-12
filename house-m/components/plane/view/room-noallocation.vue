<template>
  <div>
    <el-dialog title="取消分配" custom-class="h-dialog-add" :visible.sync="dialogShow" width="500px">
      <div>
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span> &nbsp;确定取消分配当前房间吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" class="u-submit-btn submit-btn" @click="submitClick">确 定</el-button>
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
      roomId:'', //房间id   
      roomIdList:[] //房间id集合 
    };
  },
  activated() {

  },
  methods: {
   
    // 初始化弹出框
    openModal(id) {
      this.roomId = id;
      this.roomIdList.push(this.roomId)      
      this.dialogShow = true;
    },

    submitClick() { // 取消分配房间提交
      this.$axiosJsonPost(API.room_cancelAssign, this.roomIdList).then(res => {
        this.allocating = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$emit('cancelAllocation')
        }
      }, 1000)
      this.dialogShow = false;
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
