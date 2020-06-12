<template>
  <el-dialog title="选择人员" :visible.sync="dialogVisible" width="660px">
    <el-form ref="ruleForm">
      <div class="f-hidden dialog-person">
        <div class="f-pull-left person-box">
          <h2> 未选人员</h2>
          <div class="padding10">
            <el-tree node-key="id" class="filter-tree" :data="dataList" @check="getCheckedNodes" show-checkbox default-expand-all ref="tree2">
            </el-tree>
          </div>
        </div>
        <div class="f-pull-right person-box">
          <h2>已选人员</h2>
          <ul class="selectionPerson">
            <li v-for="(item,index) in selectNodeList" :key="index">{{item.label}}</li>
          </ul>
        </div>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible= false">取 消</el-button>
      <el-button type="primary" @click="setPersonSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  // props: ['dataList', 'selectNodeList'],
  data() {
    return {

      dialogVisible: false,
      dataList: [],
      selectNodeList: [],


    };
  },
  created() {
    
  },
  activated() {
    
  },
  deactivated(){
    this.$destroy();
  },
  methods: {

    // 打开选择框
    openDialog(dataList=[], selectNodeList=[]){
      let checkedKeys = selectNodeList.map( item => (item.id) );
      this.dialogVisible = true;
      this.dataList = dataList;
      this.selectNodeList = selectNodeList;
      this.$nextTick( ()=>{
        this.$refs.tree2.setCheckedKeys(checkedKeys);
      })
    },

    //  获取选择人员
    getCheckedNodes(){
      this.selectNodeList = [];
      let tree2 = this.$refs.tree2;
      let selectList = [];
      let id_list = ['parent_level_d1','parent_level_d2','parent_level_d3'];
      tree2.getCheckedNodes(false, false).forEach((item, index) => {
        if (!id_list.includes(item.id)) {
          selectList.push(item);
        }
      });
      this.selectNodeList = selectList;
    },

    setPersonSure(){  //确定人员
      let followPersons = [];
      let master = [], follow = [], accompany = [];
      this.selectNodeList.forEach((item, index) => {
        if (item.groupId) {
          followPersons.push(item.label);
        }
        if( item.groupId == 'parent_level_d1' ){ 
          master.push(item); 
        }else if( item.groupId == 'parent_level_d2' ){ 
          follow.push(item); 
        }else if( item.groupId == 'parent_level_d3' ){ 
          accompany.push(item); 
        }
      });
      let jsonPerson = ( {master, follow, accompany} );
      followPersons = followPersons.join(',');
      // this.infoForm.addvehicle[this.secIndex].followPersons = followPersons;
      // this.infoForm.addvehicle[this.secIndex].jsonPerson = jsonPerson;
      this.$emit('getPersons', followPersons, jsonPerson);
      this.dialogVisible = false;
    },




  },
  
};
</script>

<style lang="scss" scoped>
.dialog-footer{
  display: block;
  text-align: right;
}
.dialog-person{
  .person-box{
    width: 50%;
    box-sizing: border-box;
  }

  .h-dialog-add-select {
    width: 477px;
  }
  .el-form-nobottom {
    margin-bottom: 0;
  }
  .el-select {
    display: inline-block;
  }
  .padding10 {
    padding: 10px;
  }
  .person-box {
    margin: 15px 0;
    width: 300px;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
  }
  .person-box h2 {
    background: #f3f6fd;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #dcdfe6;
  }
  .selectionPerson {
    overflow: hidden;
    padding: 10px;
  }
  .selectionPerson li {
    line-height: 30px;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
  }
  .lineHight {
    line-height: 28px;
  }
}
</style>




