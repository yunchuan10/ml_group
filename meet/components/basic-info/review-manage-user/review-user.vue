<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="审核配置" :item="breadcrumbItem"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>审核配置</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th>
                <i class="f-color-red">*</i>审核人
              </th>
              <td>
                <el-form-item
                  prop="reviewName"
                  :rules="{ required: true, message: '审核人不能为空', trigger: 'change' }"
                >
                  <el-select
                    v-model="ruleForm.reviewName"
                    filterable
                    placeholder="请选择审核人"
                    @change="selectPeople"
                    :disabled="isDisabled "
                  >
                    <el-option
                      v-for="item in formData.userList"
                      :key="item.id"
                      :label="item.realName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>审核科室
              </th>
              <td>
                <!--                <el-tree style="max-height:400px;overflow:auto;" ref="treeReview" :data="formData.custormerOrganList" show-checkbox node-key="id" default-expand-all :props="defaultProps" @check="checkSelect" :check-strictly="true"></el-tree>-->
                <el-tree
                  style="max-height:400px;overflow:auto;"
                  ref="treeReview"
                  :data="formData.custormerOrganList"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="defaultProps"
                  @check="checkSelect"
                  :check-strictly="true"
                  :default-checked-keys="childNodeKeys"
                ></el-tree>
              </td>
            </tr>
            <tr>
              <th>已选科室</th>
              <td>
                <span class="f-block">已选择{{childNodeList.length}}项</span>
                <span class="f-cursor-pointer" style="color:#0080F8;" @click="deleteAll">全部删除</span>
                <div v-for="(item, index) in childNodeList" :key="index">
                  <span style="padding-right:15px;">
                    {{item.deptName}}
                    <i
                      class="iconfont icon-cuo f-cursor-pointer"
                      style="margin-left:5px;color:#CACACA;"
                      @click="deleteClick(index)"
                    >删除</i>
                  </span>
                </div>
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
  name: "review",
  data() {
    return {
      breadcrumbItem: [], //面包屑内容
      formData: {
        userList: [], // 审核人列表
        custormerOrganList: [] // 审核部门列表
      },
      YPromptShow: false,
      message: "",
      isBol: false,
      loading: false,
      ruleForm: {
        reviewName: "", // 审核人名称
        reviewId: "" //审核人Id
      },
      defaultProps: {
        label: "name",
        children: "childList"
        // value: "organId"
      },
      childNodeList: [], // 被选中的节点
      childNodeKeys: [], // 被选中节点的key
      isShowOther: false,
      staffId: "", //审核人ID
      customerName: "", //审核单位名称
      organId: [], //审核单位ID
      isDisabled: false,

      userName: '',
      phoneNo: '',

    };
  },
  activated() {
    
    this.getFormData(); // 获取表单基础数据
    this.breadcrumbItem = ["基础信息", "审核配置", "新增"];
    this.isDisabled = false;
    if (this.$route.params.type == "edit") {
      this.isDisabled = true;
      this.breadcrumbItem = ["基础信息", "审核配置", "修改"];
      this.getDetail(this.$route.query.staffId);
      this.ruleForm.reviewName = this.$route.query.userName;
      this.ruleForm.reviewId = this.$route.query.staffId;
      this.phoneNo = this.$route.query.phoneNo;
      this.childNodeKeys = this.$route.query.deptId.split(",");
    }
  },

  deactivated(){
    this.ruleForm.reviewName = '';
    this.ruleForm.reviewId = '';
    this.childNodeKeys = [];
    this.childNodeList = [];
    this.$refs.ruleForm.resetFields();
  },

  methods: {
    // 获取表单基础数据
    getFormData() {
      this.$axiosGet(API.customerVerifyConfig_toAddApplyVerifyConfig, {}).then(
        res => {
          this.formData.userList = res.data.userList || [];
          this.formData.custormerOrganList = res.data.deptList || [];
        }
      );
    },
    // 选中节点
    checkSelect(data, node) {
      this.childNodeList = [];
      this.childNodeKeys = [];
      this.childNodeList = node.checkedNodes;
      this.childNodeKeys = node.checkedKeys;
      this.selectMenuIds = this.childNodeKeys.join(",");
    },
    // 全部删除
    deleteAll() {
      this.childNodeList = [];
      this.childNodeKeys = [];
      this.$refs.treeReview.setCheckedKeys([]);
    },
    // 删除当前
    deleteClick(index) {
      this.childNodeList.splice(index, 1);
      this.childNodeKeys.splice(index, 1);
      this.$refs.treeReview.setCheckedKeys(this.childNodeKeys);
    },
    // 获取修改列表数据
    getDetail(id) {
      let params = {
        staffId: id
      };
      this.$axiosGet(
        API.customerVerifyConfig_toUpdateApplyVerifyConfig,
        params
      ).then(res => {
        this.childNodeList = res.data.verifyConfigList;
      });
    },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        this.loading = true;
        let url = "";
        if (this.$route.params.type == "edit") {
          // this.$set(params, 'id', this.$route.query.equipId);
          url = API.customerVerifyConfig_doUpdateApplyVerifyConfig;
          this.staffId = this.ruleForm.reviewId;
          this.userName = this.ruleForm.reviewName;
        } else {
          url = API.customerVerifyConfig_doAddApplyVerifyConfig;
        }
        if (valid) {
          let params = {
            deptIds: this.childNodeKeys.join(","),
            staffId: this.staffId,
            userName: this.userName,
            phoneNo: this.phoneNo
          };
          this.$axiosJsonPost(url, params).then(res => {
            if (res.status === 200 && res.data == "") {
              this.isBol = true;
              this.message = res.message;
              // this.organId = [];
            } else {
              this.message = res.data||res.message;
              // alert(res.data);
              this.isBol = false;
            }
            this.loading = false;
            this.YPromptShow = true;
            this.childNodeList = [];
            this.childNodeKeys = [];
          });
        }else{
          this.loading = false;
        }
      });
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.childNodeList = [];
        this.childNodeKeys = [];
        this.$router.go(-1);
      }
    },
    selectPeople(val) {
      this.staffId = val;
      let useName = "", phoneNo='';
      let handleArr = this.formData.userList;
      for (let i = 0, l = handleArr.length; i < l; i++) {
        if (handleArr[i].id === val) {
          useName = handleArr[i].realName;
          phoneNo = handleArr[i].phoneNo;
        }
      }
      console.log(phoneNo, 222222);
      this.userName = useName;
      this.phoneNo = phoneNo;
    }
  }
};
</script>

<style>
</style>
