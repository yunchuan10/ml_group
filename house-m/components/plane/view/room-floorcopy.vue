<template>
  <div>
    <el-dialog title="复制楼层" custom-class="h-dialog-add" :visible.sync="relationFormVisible" width="600px" @close="clearRules">
      <el-form label-position="right" label-width="100px" ref="roomRuleForm" :model="roomRuleForm" :rules="roomRules">

        <el-form-item label="楼层号" prop="storeysName">
          <el-select v-model="roomRuleForm.storeysName" style="width:100%;" placeholder="请选择楼层" filterable clearable>
            <el-option v-for="item in storeysList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relationFormVisible = false">取 消</el-button>
        <el-button type="primary" class="u-submit-btn submit-btn" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
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
      allocating: false,
      roomNameList: '',
      storeysList: [],
      oldList: [], //要复制的楼层数据
      newList: [], //复制到的楼层数据
      storeysId: '',//楼座id
      roomRules: {
        storeysName: [
          { required: true, message: '请选择楼层名称', trigger: 'change' }
        ]
      },
      roomRuleForm: {
        storeysName: '', //楼层数量
      },
      formLabelWidth: '120px'
    };
  },
  activated() {

  },
  methods: {
    submitClick() {
      this.$emit('copyStoreysData', this.roomRuleForm.storeysName)
      this.relationFormVisible = false;
    },
    clearRules() {
      if (this.$refs.roomRuleForm) {
        this.$refs.roomRuleForm.resetFields()
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.storeysId = id;
      this.relationFormVisible = true;
      this.getStoreys()
    },
    getStoreys() {
      let params = {
        storeysId: this.storeysId
      }
      this.$axiosPost(API.plan_getHasPlanPicStoreys, params).then(res => {
        if (res.data) {
          this.storeysList = res.data;
        } else {
          this.storeysList = []
        }
      })
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
