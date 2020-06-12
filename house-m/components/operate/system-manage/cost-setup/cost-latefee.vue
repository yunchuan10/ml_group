<template>
  <div>
    <el-dialog title="滞纳金" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="滞纳金 =" :label-width="formLabelWidth" prop="reminderDay">
          <el-row>
            <el-col :span="3">日租金额*</el-col>
            <el-col :span="12">
              <el-input placeholder="请输入内容" v-model="ruleForm.reminderDay">
                <template slot="append">%</template>
              </el-input>
            </el-col>
            <el-col :span="4"></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="提醒时间" :label-width="formLabelWidth" prop="reminderDay">
          <el-row>
            <el-col :span="6">从延迟缴纳房租的第</el-col>
            <el-col :span="12">
              <el-input placeholder="请输入内容" v-model="ruleForm.reminderDay">
                <template slot="append">天</template>
              </el-input>
            </el-col>
            <el-col :span="4">开始计算</el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="getbatchAddDataRequest" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    let checkFloorNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`楼层值不能为空`));
      } else {
        if (!/^[1-9](\d+)?$/.test(value)) {
          callback(new Error(`楼层值为大于零的整数`))
        } else if (value > 1000) {
          callback(new Error(`楼层值不能大于一千层`))
        } else if (value > self.ruleForm.upStoreysNum) {
          callback(new Error(`楼层值不能大于楼层的最大值`))
        }
        else {
          callback();
        }
      }
    };
    let checkFloorNumber1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`楼层值不能为空`));
      } else {
        if (!/^[1-9](\d+)?$/.test(value)) {
          callback(new Error(`楼层值不能为空为大于零的整数`))
        } else if (value > 1000) {
          callback(new Error(`楼层值不能大于一千层`))
        } else if (value < self.ruleForm.downStoreysNum) {
          callback(new Error(`楼层值不能小于楼层的最小值`))
        }
        else {
          callback();
        }
      }
    };
    return {
      dialogFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      ruleForm: {
        reminderWay: ['待办'], //提醒方式
        textContent: '', //提醒正文
        reminderTitle: '', //提醒标题
        reminderPerson: '', //提醒人
        reminderDay: '', // 提醒日期        
      },
      rules: {
        reminderDay: [
          { required: true, message: '请输入天数', trigger: 'change' },
        ],
        reminderTitle: [
          { required: true, message: '请输入提醒标题', trigger: 'change' }
        ],
        reminderPerson: [
          { required: true, message: '请输入提醒人', trigger: 'change' }
        ],
        textContent: [
          { required: true, message: '请输入提醒正文', trigger: 'change' }
        ],
        reminderWay: [
          { required: true, message: '请选择提醒方式', trigger: 'change' }
        ],
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
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.id) {
          this.courtyardName = item.name;
        }
      })
      this.getFloorSelectRequest()
    },
    // 获取楼座名称
    getFloorName(value) {
      this.floorSelectList.forEach((item, index) => {
        if (value === item.floorId) {
          this.floorName = item.floorName;
        }
      })
      this.getStoreySelectRequest()
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
.el-form-nobottom {
  margin-bottom: 0;
}
.el-select {
  display: inline-block;
}
</style>
