<template>
  <div>
    <el-dialog title="房间列表" custom-class="h-dialog-add" :visible.sync="dialogShow" width="700px" @close="clearForm">
      <div class="h-tab-content" style="margin-top: 0px; max-height:600px; overflow-y:auto;">
          <table class="h-table-info">  
            <tr>
            <th>序号</th><th>房间号</th><th>使用面积（㎡）</th><th>建筑面积（㎡）</th><th>房间类型</th><th>使用部门</th><th>使用人</th>
            </tr>
            <tr v-for ="(item,index) in list" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.roomNo}}</td>
            <td>{{item.useArea?item.useArea:'0'}}㎡</td>
            <td>{{item.buildArea}}</td>
            <td>{{item.roomTypeNameString?item.roomTypeNameString:''}}</td>
            <td> <span v-for="(itemI,indexI) in item.useUserList" :key="indexI">
               {{ itemI.deptName }}
              </span></td>
            <td> <span v-for="(itemI,indexI) in item.useUserList" :key="indexI">
                <span v-show="indexI > 0">，</span>{{ itemI.realName }}
              </span></td>
            </tr>              
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
