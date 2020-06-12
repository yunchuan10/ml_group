<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <!-- <Y-Breadcrumb v-show="type == 'add'" title="新增接待方案" :item="['新增子方案']"></Y-Breadcrumb> -->
        <Y-Breadcrumb title="角色管理" :item="breadcrumbItem"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>角色管理</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th>
                <i class="f-color-red">*</i>角色名称
              </th>
              <td>
                <el-form-item
                  prop="roleName"
                  :rules="{ required: true, message: '角色名称不能为空', trigger: 'change' }"
                >
                  <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- <tr>
              <th>备注</th>
              <td>
                <el-form-item prop="remark">
                  <el-input
                    v-model="ruleForm.remark"
                    type="textarea"
                    placeholder="请输入备注，不超过200字"
                    :maxlength="200"
                  ></el-input>
                </el-form-item>
                <div class="f-text-right">{{ruleForm.remark.length}}/200</div>
              </td>
            </tr> -->
          </table>
          <div class="f-text-center" style="margin-top: 20px;">
            <el-button class="u-submit-btn cancel-btn" @click="$router.go(-1)">取消</el-button>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitClick">提交</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!-- <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt> -->
  </div>
</template>

<script>
export default {
  name: "role",
  data() {
    return {
      breadcrumbItem: [],
      ruleForm: {
        roleName: "", // 角色名称
        remark: "" // 备注说明
      },
      loading: false, // 提交按钮加载状态
      YPromptShow: false,
      isBol: false,
      message: ""
    };
  },
  activated() {
    this.breadcrumbItem = ["系统管理", "角色管理", "新增角色"];
    if (this.$route.params.type === "edit") {
      this.ruleForm.roleName = this.$route.query.name;
      this.breadcrumbItem = ["系统管理", "角色管理", "修改角色"];
    }
  },
  methods: {
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        console.log(this.ruleForm);
        if (valid) {
          this.loading = true;
          let params = {
            name: this.ruleForm.roleName, // 角色名称
            // remark: this.ruleForm.remark // 备注说明
          };
          let fun = res => {
            if (res.status == 200) {
              this.isBol = true;
              this.$message.success('成功')
              this.$router.go(-1);
              // this.$alert("成功！", "提示", {
              //   confirmButtonText: "确定",
              //   callback: action => {
              //     this.YPromptClick();
              //   }
              // });
            } else this.isBol = false;
            this.message = res.message;
            this.loading = false;
          };
          if (this.$route.params.type === "edit") {
            params.id = this.$route.query.id;
            this.$axiosPut(API.sysRoles, params).then(fun);
          } else {
            this.$axiosPost(API.sysRoles, params).then(fun);
          }
        }
      });
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) this.$router.go(-1);
    }
  },
  deactivated() {
    this.ruleForm.roleName = "";
    this.ruleForm.remark = "";
    this.$refs.ruleForm.resetFields();
  }
};
</script>

<style>
</style>
