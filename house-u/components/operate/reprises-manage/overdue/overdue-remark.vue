<template>
  <div>
    <el-dialog title="逾期备注" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="630px" :before-close="resetForm">
      <el-form label-width="140px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="租金是否入账：">
          未入账
        </el-form-item>
        <el-form-item label="未入账原因：" prop="textarea">
          <el-input type="textarea" :rows="4" placeholder="请输入未入账原因" maxlength="30" v-model="ruleForm.textarea" style="width:85%"></el-input>
          <div style="text-align: right; margin-right:80px;">{{ruleForm.textarea.length}}/30</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" :loading='loading' @click="overdueRequest">保存</el-button>
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
      loading: false,
      textarea: '', //未入账原因
      id: '', //逾期备注id
      ruleForm: {
        textarea: '',
      },
      rules: {
        textarea: [
          { required: true, message: '请输入未入账原因', trigger: 'change' },
        ]
      },
    };
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.id = id;
      this.dialogFormVisible = true;
    },

    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosPost(API.rent_getRentalInformationSelect, {}).then(res => {
        this.accountList = res.data;
      });
    },

    //逾期备注
    overdueRequest() {
      let params = {
        id: this.id,
        overdueNote: this.ruleForm.textarea
      }
      this.$axiosJsonPost(API.rent_addOverdueNote, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
      })
    },

    resetForm(ruleForm) {
      this.$refs.ruleForm.resetFields();
      this.dialogFormVisible = false;
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      if (this.isBol) {
        this.$emit('requestData')
        this.$refs.ruleForm.resetFields();
        this.dialogFormVisible = false;
      }
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
