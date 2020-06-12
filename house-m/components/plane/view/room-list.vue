<template>
  <div>
    <el-dialog title="房间列表" custom-class="h-dialog-add" :visible.sync="dialogShow" width="700px" @close="clearForm">
      <div class="h-tab-content" style="margin-top: 0px; max-height:600px; overflow-y:auto;">
          <table class="h-table-info">  
            <tr>
            <th align="left" style="width:60px;">序号</th><th align="left">房间号</th><th align="left">使用面积（㎡）</th><th align="left">建筑面积（㎡）</th><th align="left">房间状态</th><th align="left">使用单位</th>
            </tr>
            <tr v-for ="(item,index) in list" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.roomNo}}</td>
            <td>{{item.useArea?item.useArea:'0'}}</td>
            <td>{{item.buildArea}}</td>
            <td>{{item.useStatusName?item.useStatusName:''}}</td>
            <td>{{item.useOrganName?item.useOrganName:''}}</td></tr>              
          </table>      
      </div>    
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
      page:1,
      pageSize:10,
      loading:false,  
    };
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(list) {
      this.dialogShow = true;
      this.list = list;
    },
    clearForm(){
      this.dialogShow = false;
    },
   
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
</style>
