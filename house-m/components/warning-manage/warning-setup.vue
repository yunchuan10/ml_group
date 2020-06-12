<template>
  <div>
    <el-dialog title="预警设置" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="是否启动预警">
          <el-radio-group v-model="ruleForm.start">
            <el-radio label="YES">启动</el-radio>
            <el-radio label="NO">不启动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="超标预警值" prop="exceedvalue">
          <el-input placeholder="请输入内容" v-model="ruleForm.exceedvalue">
            <template slot="append">㎡</template>
          </el-input>
        </el-form-item>
        <p>
          <span class="f-color-red">*</span>提示：当使用单位的使用人员超标面积数值大于或者等于超标预警值时系统自动进行预警
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="getAddDataRequest" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {

    let self = this;
    let exceedvalue = (rule, value, callback) => {
      // (rule)
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`超标预警值为最多两位小数`))
        } else if (value > 100000) {
          callback(new Error(`超标预警值不能大于10亿`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      dialogFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      ruleForm: {
        start: '', // 是否启动
        exceedvalue: '',
        id: '',
      },

      rules: {
        exceedvalue: [
          { validator: exceedvalue, trigger: 'change' }
        ]
      },
      formLabelWidth: '120px'
    };
  },
  activated() {


  },
  methods: {
    // 初始化弹出框
    openModal(dialogFormVisible) {
      this.getDataRequest();
      this.dialogFormVisible = true;
    },

    //新增或者修改
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            settingId: this.ruleForm.id,
            useing: this.ruleForm.start,
            standardArea: this.ruleForm.exceedvalue,
          }
          this.$axiosPost(API.warning_setting, params).then(res => {
            this.dialogFormVisible = false;
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '超标预警', '预警设置')
            } else {
              this.isBol = false;
            }
            this.message = res.message;
          })
        }
      })
    },
    //获取值
    getDataRequest() {
      this.$axiosPost(API.warning_getSetting, {}).then(res => {
        if (res.data) {
          this.ruleForm.id = res.data.id || '';
          this.ruleForm.start = res.data.useing || '';;
          this.ruleForm.exceedvalue = res.data.warningStandard || '';
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
          this.$emit('warningSetCallBack')
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
