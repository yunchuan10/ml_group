<template>
  <div>
    <div class="h-table f-relative">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="date" fixed="left" type='index' label="序号" width="50"></el-table-column>
        <el-table-column label="行政区划级别" prop="areaLevelName"></el-table-column>
        <el-table-column label="面积标准（㎡）">
          <template slot-scope="scope">
            {{scope.row.minArea}}-{{scope.row.maxArea}}
          </template>
        </el-table-column>
        <el-table-column label="说明" prop="note"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="setDialogShowStatus(scope.row.id,scope.row.minArea,scope.row.maxArea)">修改</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 修改弹出框 -->
    <el-dialog title="服务用房配置标准修改" :visible.sync="dialogShow" width="700px" @close="clearForm" class="dia-edit">
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th style="font-weight: bolder;">职务级别</th>
              <th style="font-weight: bolder;">面积标准</th>
            </tr>
            <tr>
              <th>下限值</th>
              <td>
                <el-form-item prop="minArea" :rules="{ validator: builtArea, trigger: 'change' }">
                  <el-input v-model="ruleForm.minArea" placeholder="请输入面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>上限值</th>
              <td>
                <el-form-item prop="maxArea" :rules="{ validator: builtArea, trigger: 'change' }">
                  <el-input v-model="ruleForm.maxArea" placeholder="请输入面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" :loading='loading' type="primary" @click="submitClick">确 定</el-button>
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
      isBol: false,
      message: '',
      YPromptShow: false,
      loading: false,
      dialogShow: false,
      ruleForm: {
        minArea: '',
        maxArea: ''
      },
      list: [],
      areaVerificationServiceRoomId: ''
    }
  },
  activated() {
    this.getData();
    // this.$store.commit('systemAreaPageNameMutations', 'serve');
  },
  computed: {
    // dialogShowStatus() {
    //   return this.$store.state.mainData.systemAreaOpen;
    // }
  },
  watch: {
    // dialogShowStatus(val) {
    //   if (val == 'YES' && this.$store.state.mainData.systemAreaPageName == 'serve') {
    //     this.dialogShow = true;
    //   }
    // },
    'ruleForm.maxArea': function (val) {
      if (val && this.ruleForm.minArea && !isNaN(Number(val)) && !isNaN(Number(this.ruleForm.minArea))) {
        if (val >= Number(this.ruleForm.minArea)) {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate();
          }
        }
      }
    },
    'ruleForm.minArea': function (val) {
      if (val && this.ruleForm.maxArea && !isNaN(Number(val)) && !isNaN(Number(this.ruleForm.maxArea))) {
        if (val <= Number(this.ruleForm.maxArea)) {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate();
          }
        }
      }
    }
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    setDialogShowStatus(id, minArea, maxArea) {
      this.areaVerificationServiceRoomId = id
      this.ruleForm.minArea = minArea;
      this.ruleForm.maxArea = maxArea;
      this.dialogShow = true
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
      this.$store.commit('systemAreaOpenMutations', 'NO')
    },
    builtArea(rule, value, callback) {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error('面积为最多两位小数'))
        } else if (value > 1000000) {
          callback(new Error('面积不能大于一百万平方'))
        } else {
          if (rule.field == 'minArea') {
            if (this.ruleForm.maxArea) {
              if (Number(value) > Number(this.ruleForm.maxArea)) {
                callback(new Error('面积下限值不能大于面积上限值'))
              } else {
                callback();
              }
            } else {
              callback();
            }
          } else {
            if (this.ruleForm.minArea) {
              if (Number(value) < Number(this.ruleForm.minArea)) {
                callback(new Error('面积上限值不能小于面积下限值'))
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      } else {
        callback()
      }
    },
    getData() {
      this.$axiosGet(API.sysmanage_getAreaVerificationServiceRoom, {}).then(res => {
        this.list = res.data;
        this.ruleForm.minArea = res.data.minArea;
        this.ruleForm.maxArea = res.data.maxArea;
      })
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.areaVerificationServiceRoomId,
            minArea: this.ruleForm.minArea,
            maxArea: this.ruleForm.maxArea
          }
          this.loading = true;
          this.$axiosJsonPost(API.sysmanage_updateAreaVerificationServiceRoom, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YPromptShow = true;
            this.dialogShow = false;
            this.loading = false;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getData()
      }
    }
  }
}
</script>
<style lang="scss" >
.dia-edit {
  .el-dialog {
    border-radius: 8px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
    font-weight: 600;
  }
  .el-dialog__footer {
    border-top: 1px solid #dcdfe6;
    padding: 10px 20px 10px;
  }
}
.h-tab-content {
  margin-top: -15px;
}
.el-dialog__header {
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 18px 20px;
  background-color: #f2f6fc;
}
</style>