<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="审核配置" :item="breadcrumbItem"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>看板配置</h2>
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
                <i class="f-color-red">*</i>开始时间选择
              </th>
              <td>
                <el-form-item prop="startTime" :rules="{ required: true, message: '开始时间不能为空', trigger: 'change' }">
                  <!-- <el-input placeholder="请输入模式描述内容" v-model="formData.description" type="textarea"></el-input> -->
                  <el-time-picker format="HH:mm:ss" v-model="formData.startTime" placeholder="开始时间"></el-time-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>结束时间选择
              </th>
              <td>
                <el-form-item prop="endTime" :rules="{ required: true, message: '结束时间不能为空', trigger: 'change' }">
                  <el-time-picker v-model="formData.endTime" placeholder="结束时间"></el-time-picker>
                </el-form-item>

              </td>
            </tr>
             <tr>
              <th>
                <i class="f-color-red">*</i>排序
              </th>
              <td>
                <el-form-item prop="sort" :rules="{ required: true, message: '排序不能不能为空', trigger: 'change' }">
                  <el-input placeholder="请输入排序数字" v-model="formData.sort"></el-input>
                </el-form-item>
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
        id: new Date().getTime(),
        name: "", //模式名称，
        description: "", //模式描述
        startSelectDay: "", //可提前预约天数
        status: 0, //开关
        selectDays: 0, //可预约天数
        startTime: "",//开始时间
        endTime: "",//结束时间
        sort:""//排序值
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
      customerName: "", //审核单位名称
      boardTemplateId: "",//父模板id

    };
  },
  activated() {
    this.breadcrumbItem = ["基础信息", "看板配置", "新增"];
    if (this.$route.params.type == "edit") {
      this.breadcrumbItem = ["基础信息", "看板配置", "修改"];
      this.getDetail(this.$route.query.id);
    }
    this.getDetail();
    this.childNodeList = [];
    this.childNodeKeys = [];
  },
  methods: {
    getDetail() {
      this.boardTemplateId = this.$route.query.boardTemplateId;
    },
    // 提交
    submitClick() {
      this.$refs.formData.validate(valid => {
        // this.loading = true;
        // let hours = this.formData.startTime.getHours() < 10 ?'0'+this.formData.startTime.getHours():this.formData.startTime.getHours();
        // let getMinutes = this.formData.startTime.getMinutes() < 10 ?'0'+this.formData.startTime.getMinutes():this.formData.startTime.getMinutes();
        // let getSeconds = this.formData.startTime.getSeconds() < 10 ?'0'+this.formData.startTime.getSeconds():this.formData.startTime.getSeconds();

        if (valid) {
          let params = {
            sort:Number(this.formData.sort),
            name: this.formData.name,
            boardTemplateId: this.boardTemplateId,
            startTime: DATE.dateReturnHMS(this.formData.startTime),
            endTime: DATE.dateReturnHMS(this.formData.endTime),
          };
          let url = "";
          if (this.$route.params.type == "edit") {
            url = API.boardConfig_doUpdateBoardTemplate;
          } else {
            url = API.boardConfig_doSaveBoardDetail;
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
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style>
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                