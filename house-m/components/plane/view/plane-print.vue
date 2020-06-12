<template>
  <div>
    <el-dialog title="打印" custom-class="h-dialog-add" :visible.sync="dialogShow" width="100%" @close="clearForm">
         <div class="print" ref="content">
         <img :src="imageBase64"  :width="wid" :height="hg" alt="" ref="imgs">          
       </div> 
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  class="u-submit-btn submit-btn" @click="print">打印</el-button>
      </span>
    </el-dialog>
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
      list:[], // 房间列表
      imageBase64:'',
      page:1,
      pageSize:10,
      loading:false,  
    };
  },
  activated() {

  },
  computed:{
    wid(){
      return window.clientWidth
    },
    hg(){
      return window.clientHeight
    },
  },  

  methods: {
    // 初始化弹出框
    openModal(image) {
      this.dialogShow = true;
      this.imageBase64 = image;
    },
    clearForm(){
      this.dialogShow = false;
    },
    print(){     
      let printhtml = this.$refs.content.innerHTML; // 获取需要生成pdf页面的div代码
      window.document.body.innerHTML = printhtml;
      window.print(); // 打印当前窗口
      window.location.reload();
    }
   
  }
}
</script>
<style lang="scss" scoped>
// .h-dialog-add{
//  /deep/ .h-tab-content{
//   max-height:320px;
//    overflow-y:auto;
// }
// }
.el-form-nobottom {
  margin-bottom: 0;
}
.el-select {
  display: inline-block;
}
.print{
  width: 100%;
  height:100%;
}
</style>
