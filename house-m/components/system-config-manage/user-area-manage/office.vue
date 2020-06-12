<template>
  <div>
    <div class="h-table f-relative">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="date" fixed="left" type='index' label="序号" width="50"></el-table-column>
        <el-table-column label="单位级别" prop="adminDivisionLevelName"></el-table-column>
        <el-table-column label="职务级别" prop="dutiesLevelNameString"></el-table-column>
        <!-- <el-table-column label="面积标准（㎡）" prop="standardArea"></el-table-column>
        <el-table-column label="三定标准">
          <template>是</template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="setDialogShowStatus(scope.row.adminDivisionLevel)">修改</a>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" prop="propertyOrganName">
          <template>启用</template>
        </el-table-column> -->
      </el-table>
    </div>

    <!-- 修改弹出框 -->
    <el-dialog title="修改" custom-class="h-dialog-add" :visible.sync="dialogShow" width="700px" @close="clearForm" class="dia-edit">
      <div class="h-tab-content" style="margin-top: 0px;">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>职务级别</th>
              <th>面积标准</th>
            </tr>
            <tr v-for="(areaList, index) in ruleForm.areaList" :key="index">
              <th>{{areaList.dutiesLevelName}}</th>
              <td>
                <el-form-item :prop="'areaList.'+ index + '.standardArea'" :rules="{ validator: builtArea, trigger: 'change' }">
                  <el-input v-model="areaList.standardArea" placeholder="请输入面积">
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
        <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
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
        areaList: []
      },
      list: [],
      adminDivisionLevel: '',//行政级别
      postData: []
    }
  },
  activated() {
    this.getData();
    this.$store.commit('systemAreaPageNameMutations', 'office');
  },
  computed: {
    dialogShowStatus() {
      return this.$store.state.mainData.systemAreaOpen;
    }
  },
  watch: {
    dialogShowStatus(val) {
      if (val == 'YES' && this.$store.state.mainData.systemAreaPageName == 'office') {
        this.dialogShow = true;
      }
    }
  },
  deactivated() {

  },
  methods: {
    setDialogShowStatus(val) {
      this.adminDivisionLevel = val;
      this.dialogShow = true;
      this.getOrganData()
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
          callback();
        }
      } else {
        callback()
      }
    },
    getData() {
      this.$axiosGet(API.sysmanage_getDutiesLevelGroup, {}).then(res => {
        this.list = res.data || [];
      })
    },
    getOrganData() {
      let params = {
        adminDivisionLevel: this.adminDivisionLevel
      }
      this.$axiosGet(API.sysmanage_getAreaVerificationOfficeRoom, params).then(res => {
        this.ruleForm.areaList = res.data || [];
      })
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.areaList.forEach((item, index) => {
            if (item.standardArea == '') {
              item.standardArea = 0;
            }
            let tempObj = {
              id: item.id,
              standardArea: item.standardArea,
              dutiesLevelKey: item.dutiesLevelKey,
              adminDivisionLevel: this.adminDivisionLevel
            }
            this.postData.push(tempObj)
          })

          this.loading = true;
          this.$axiosJsonPost(API.sysmanage_updateAreaVerificationOfficeRoom, this.postData).then(res => {
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
<style lang="scss" scoped>
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
</style>