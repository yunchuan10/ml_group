<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="审核配置" :item="breadcrumbItem"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>看板模式</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="formData" :model="formData">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th>
                <i class="f-color-red">*</i>模式
              </th>
              <td>
                <el-form-item prop="name" :rules="{ required: true, message: '模式不能不能为空', trigger: 'change' }">
                  <el-input placeholder="请输入模式" v-model="formData.name"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>描述
              </th>
              <td>
                <el-form-item prop="description" :rules="{ required: true, message: '描述不能为空', trigger: 'change' }">
                  <el-input placeholder="请输入模式描述内容" v-model="formData.description" type="textarea"></el-input>
                </el-form-item>
                <!--                <el-tree style="max-height:400px;overflow:auto;" ref="treeReview" :data="formData.custormerOrganList" show-checkbox node-key="id" default-expand-all :props="defaultProps" @check="checkSelect" :check-strictly="true"></el-tree>-->
                <!-- <el-tree
                  style="max-height:400px;overflow:auto;"
                  ref="treeReview"
                  :data="formData.custormerOrganList"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="defaultProps"
                  @check="checkSelect"
                  :check-strictly="true"
                ></el-tree>-->
              </td> 
            </tr>
            <tr>
              <th>可提前预约时间</th>
              <td>
                <el-form-item prop="startSelectDay" :rules="{ required: true, message: '天数不能为空', trigger: 'change' }">
                  <el-input placeholder="请输入天数" v-model="formData.startSelectDay"></el-input>
                </el-form-item>
                <!-- <span class="f-block">已选择{{childNodeList.length}}项</span>
                <span class="f-cursor-pointer" style="color:#0080F8;" @click="deleteAll">全部删除</span>
                <div v-for="(item, index) in childNodeList" :key="index">
                  <span style="padding-right:15px;">
                    {{item.label}}
                    <i
                      class="iconfont icon-cuo f-cursor-pointer"
                      style="margin-left:5px;color:#CACACA;"
                      @click="deleteClick(index)"
                    ></i>
                  </span>
                </div>-->
              </td>
            </tr>
          </table>
          <div class="f-text-center" style="margin-top: 20px;">
            <el-button class="u-submit-btn cancel-btn" @click="$router.go(-1)">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="submitClick">提交</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
export default {
  name: "board",
  data() {
    return {
      breadcrumbItem: [],
      formData: {
        // id: new Date().getTime(),
        name: "", //模式名称，
        description: "", //模式描述
        startSelectDay: "", //可提前预约天数
        status: 1, //开关状态
        selectDays: 0 //可预约天数
      },
      YPromptShow: false,
      message: "",
      isBol: false,
      isHasImg: false,
      isHasCover: false,
      loading: false,
      ruleForm: {
        name: "", //模式名称，
        description: "", //模式描述
        startSelectDay: "" //可提前预约天数
      },
      treeData: [],
      defaultProps: {
        label: "customerName",
        value: "customerId"
      },
      childNodeList: [], // 被选中的节点
      childNodeKeys: [], // 被选中节点的key
      isShowOther: false,
      useId: "", //审核人ID
      customerName: "" //审核单位名称
    };
  },
  activated() {
    this.breadcrumbItem = ["基础信息", "看板配置", "新增"];
    if (this.$route.params.type == "edit") {
      this.breadcrumbItem = ["基础信息", "看板配置", "修改"];
      this.formData.id=this.$route.query.id;
    }
    this.childNodeList = [];
    this.childNodeKeys = [];
  },
  methods: {
    // 提交
    submitClick() {
      this.$refs.formData.validate(valid => {
        // this.loading = true;

        if (valid) {
          let params = {
            // id: this.formData.id,
            name: this.formData.name,
            description: this.formData.description,
            status: this.formData.status,
            selectDays: this.formData.selectDays,
            startSelectDay: Number(this.formData.startSelectDay)
          };
          let url = "";
          if (this.$route.params.type == "edit") {
            url = API.boardConfig_doUpdateBoardTemplate;
            params.id = this.formData.id
          } else {
            url = API.boardConfig_doSaveBoardTemplate;
          }
          this.$axiosJsonPost(url, params).then(res => {
            if (res.status === 200) {
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
        this.$router.go(-1)
      }
    },
  }
};
</script>

<style>
</style>