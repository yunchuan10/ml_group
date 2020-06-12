<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标参数"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="getUpdate">
            {{typeTitle}}
          </button>
        </div>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                超标认定方式</th>
              <td>
                面积
              </td>
            </tr>
            <tr v-if="typeTitle ==='修改'">
              <th> 超标认定标准</th>
              <td>
                {{ruleForm.exceedParam}}
              </td>
            </tr>
            <tr v-if="typeTitle ==='保存'">
              <th>
                <i class="f-color-red">*</i>超标认定标准</th>
              <td>
                <el-form-item prop="exceedParam">
                  <el-input clearable v-model="ruleForm.exceedParam" :maxlength="40" placeholder="请输入超标认定标准">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
              </th>
              <td>
                说明：当个人超标面积超出超标认定标准时判断为超标。
              </td>
            </tr>
          </table>
          <!-- <div class="table-bottom-btns f-hidden">
            <el-button class="u-submit-btn cancel-btn">重置</el-button>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
          </div> -->
        </el-form>
      </div>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import { parse } from 'path';
export default {
  data() {
    let self = this;
    let exceedParam = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error('超标认定标准为最多两位小数'))
        } else if (value > 1000000) {
          callback(new Error('超标认定标准不能大于一百万平方'))
        } else {
          callback();
        }
      } else {
        callback(new Error('超标认定标准不能为空'))
      }
    }
    return {
      YPromptShow: false,
      paramShow: false,
      loading: false,
      isBol: false,
      organDialogShow: false,
      message: '',
      excessParameterId: '',//超标参数id
      cognizanceType: '', //超标参数类型
      typeTitle: '', //新增或修改
      rules: {
        exceedParam: [
          { required: true, validator: exceedParam, trigger: 'change' },
        ],
      },
      search: {
        province: '',
        city: '',
        county: '',
        productKey: '',
        organName: ''
      },
      ruleForm: {
        exceedParam: ''
      }
    };
  },
  activated() {
    this.typeTitle = '修改';
    this.getParam();
  },
  methods: {
    getParam() {
      this.$axiosGet(API.sysmanage_getExcessParameter, {}).then(res => {
        this.ruleForm.exceedParam = res.data.cognizanceStandard;
        this.excessParameterId = res.data.id;
        this.cognizanceType = res.data.cognizanceType;
      })
    },
    getUpdate() {
      if (this.typeTitle === '修改') {
        this.typeTitle = '保存';
      } else {
        this.getAddDataRequest();
      }
    },
    getAddDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.excessParameterId,
            cognizanceType: this.cognizanceType,
            cognizanceStandard: this.ruleForm.exceedParam
          }
          this.$axiosJsonPost(API.sysmanage_updateExcessParameter,params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.typeTitle = '修改';
        }
      }, 1000)
      this.getParam()
    }
  }
};
</script>

<style lang="scss" scoped>
.u-menu {
  .el-dialog__body {
    padding-right: 0;
  }
}
</style>
   