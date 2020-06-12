<template>
  <div>
    <el-dialog title="提示" custom-class="u-dialog-message h-dialog-add" :visible.sync="dialogFormVisible" width="730px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <p>
          【超标预警】【工程建设办公室】使用人周小菊、张亮等 共5人办公室使用超标，超标面积合计65.32㎡。 可通过
          <a class="f-color-red">【系统管理】-【超标预警】</a>进行查看并处理。
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="getbatchAddDataRequest" class="u-submit-btn submit-btn">查看详情</el-button>
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
      ruleForm: {
        start: '', // 是否启动
        exceedvalue: '',
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

      },
      formLabelWidth: '120px'
    };
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(dialogFormVisible) {
      this.dialogFormVisible = true;
      this.getSelectRequest();
    },

    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
        this.getFloorSelectRequest()
      });

    },
    // 获取楼座下拉框
    getFloorSelectRequest() {
      let params = {
        courtyardId: this.ruleForm.courtyardId,
      }
      this.$axiosPost(API.floor_queryFloorSelect, params).then(res => {
        this.floorSelectList = res.data;
        this.getStoreySelectRequest()
      });

    },
    // 获取楼层数量
    getStoreySelectRequest() {
      let params = {
        floorId: this.ruleForm.floorId,
      }
      this.$axiosPost(API.storeys_getStoreysNumSelect, params).then(res => {
        this.storeySelectList = res.data;
      });
    },
    //批量新增
    getbatchAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            courtyardId: this.ruleForm.courtyardId, //院落id
            floorId: this.ruleForm.floorId, //楼座id
            downStoreysNum: this.ruleForm.downStoreysNum, //楼层范围最小值
            upStoreysNum: this.ruleForm.upStoreysNum //楼层范围最大值
          }
          this.$axiosPost(API.storeys_batchAdd, params).then(res => {
            this.dialogFormVisible = false;
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

    resetForm(ruleForm) {
      this.dialogFormVisible = false;
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
.el-dialog__body {
  color: #303133;
}
.el-form-nobottom {
  margin-bottom: 0;
}
.el-select {
  display: inline-block;
}
</style>
