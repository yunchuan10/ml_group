<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="新增菜单" :item="['基础信息', '菜单管理']"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>新增菜单</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th>
                <i class="f-color-red">*</i>菜单名称
              </th>
              <td>
                <el-form-item prop="menuName">
                  <el-input v-model="ruleForm.menuName" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>父菜单</th>
              <td>
                <el-form-item prop="parentId">
                  <el-select v-model="ruleForm.parentId" placeholder="请选择父菜单">
                    <el-option
                      v-for="item in deptOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>菜单URL
              </th>
              <td>
                <el-form-item prop="menuUrl">
                  <el-input v-model="ruleForm.menuUrl" placeholder="请输入菜单URL"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>排序值
              </th>
              <td>
                <el-form-item prop="sortNum">
                  <el-input v-model="ruleForm.sortNum" placeholder="越大越靠前"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="f-text-center" style="margin-top: 20px;">
            <el-button class="u-submit-btn cancel-btn" @click="$router.go(-1)">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="submitClick" :loading="loading">提交</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>
<script>
export default {
  data() {
    return {
      YPromptShow: false,
      message: "",
      isBol: false,
      isHasImg: false,
      isHasCover: false,
      loading: false,
      ruleForm: {
        menuName: "", // 菜单名称
        name: "", // 父菜单
        parentId: null, //父菜单id
        menuUrl: "", // 菜单URL
        sortNum: "" // 排序
      },
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "change" }
        ],
        sortNum: [
          { required: true, message: "排序值不能为空", trigger: "change" }
        ]
      },
      deptOptions: [],
      isShowOther: false,
      params: {}
    };
  },
  activated() {
    if (this.$route.params.type === "edit") {
      this.ruleForm.menuName = this.$route.query.Menuname;
      this.ruleForm.parentId = this.$route.query.parentId;
      this.ruleForm.menuUrl = this.$route.query.menuUrl;
      this.ruleForm.sortNum = this.$route.query.sortNum;
    }
    this.getDetail();
  },
  methods: {
    // 获取订单详情
    getDetail() {
      this.$axiosGet(API.sysMenu_getParentMenuList).then(res => {
        if (res.status == 200) {
          this.deptOptions = res.data;
        }
      });
    },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        let url = "";
        if (this.$route.params.type === "edit") {
          url = API.sysMenu_editMenu;
          this.params = {
            id: this.$route.query.id,
            name: this.ruleForm.menuName,
            parentId: this.ruleForm.parentId,
            res: this.ruleForm.menuUrl,
            sortNo: this.ruleForm.sortNum
          };
        } else {
          if (this.ruleForm.parentId == null) {
            this.ruleForm.parentId = 0;
          }
          url = API.sysMenu_addMenu;
          this.params = {
            name: this.ruleForm.menuName,
            parentId: this.ruleForm.parentId,
            res: this.ruleForm.menuUrl,
            sortNo: this.ruleForm.sortNum
          };
        }
        if (valid) {
          this.loading = true;
          this.$axiosJsonPost(url, this.params).then(res => {
            if (res.status == 200) {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.YPromptShow = true;
            this.message = res.message;
          });
        }
      });
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style>
</style>
