<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="paramsType+'承租人'" :item="[paramsType+'承租人']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{paramsType}}承租人</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info th-180">
            <tr>
              <th>
                <i class="f-color-red">*</i>承租人名称
              </th>
              <td>
                <el-form-item prop="lesseeName">
                  <el-input
                    :maxlength="40"
                    clearable
                    placeholder="请输入"
                    v-model="ruleForm.lesseeName"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i> 手机号
              </th>
              <td>
                <el-form-item prop="lesseePhone">
                  <el-input
                    :maxlength="11"
                    clearable
                    placeholder="请输入手机号"
                    v-model="ruleForm.lesseePhone"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>组织性质</th>
              <td>
                <el-form-item prop="nature">
                  <el-select v-model="ruleForm.nature" placeholder="请选择组织性质">
                    <el-option
                      v-for="item in ruleForm.organizationalNatureList"
                      :key="item.dicValue"
                      :label="item.dicName"
                      :value="item.dicValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.nature === 'LEGALPERSON'">
              <th>法定代表人</th>
              <td>
                <el-form-item prop="representative">
                  <el-input
                    :maxlength="40"
                    clearable
                    placeholder="请输入法定代表人姓名"
                    v-model="ruleForm.representative"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>经营范围</th>
              <td>
                <el-form-item prop="rang">
                  <el-input :maxlength="40" clearable placeholder="请输入经营范围" v-model="ruleForm.rang"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>身份证号</th>
              <td>
                <el-form-item prop="idCard">
                  <el-input
                    :maxlength="18"
                    clearable
                    placeholder="请输入身份证号"
                    v-model="ruleForm.idCard"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td>
                <span class="f-pull-left">
                  <v-uploadPicture v-model="ruleForm.idCardImgA" title="身份证正面" max="1" maxSize="5"></v-uploadPicture>
                </span>
                <v-uploadPicture v-model="ruleForm.idCardImgB" title="身份证背面" max="1" maxSize="5"></v-uploadPicture>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/operate/lessee-manage/lessee-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button
              class="u-submit-btn submit-btn"
              @click="getAddDataRequest"
              :loading="loading"
            >保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import vueUploadPicture from "@/assembly/vue-upload-picture"; // 上传图片
export default {
  data() {
    let self = this;
    return {
      loading: false,
      paramsType: "新增", //标记是新增还是修改
      isBol: false, // 弹出框图形标识
      message: "", //弹出框弹出的信息
      YPromptShow: false, //提示对话框
      lesseeManageId: "", //承租人id
      ruleForm: {
        representative: "", //法定代表人
        lesseeName: "", //承租人名称
        lesseePhone: "", //承租人电话
        nature: "", //组织性质
        idCard: "", //身份证号
        rang: "", //经营范围
        organizationalNatureList: [], //组织性质
        lesseeDetailList: {}, //修改详情回显
        idCardImgA: [], // 身份证正面
        idCardImgB: [] // 身份证反面
      },
      rules: {
        lesseePhone: [
          {
            required: true,
            pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "change"
          }
        ],
        lesseeName: [
          { required: true, message: "请输入承租人名称", trigger: "change" }
        ],
        idCard: [
          {
            required: false,
            pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: "请输入正确的身份证号",
            trigger: "change"
          }
        ]
      } //验证规则
    };
  },
  components: {
    "v-uploadPicture": vueUploadPicture
  },
  activated() {
    this.getSelectRequest();
    if (this.$route.params.type === "edit") {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.lesseeManageId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = "修改";
    } else {
      this.paramsType = "新增";
    }
  },
  deactivated() {
    this.ruleForm.idCardImgA = [];
    this.ruleForm.idCardImgB = [];
    this.ruleForm.representative = "";
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    // 获取组织性质下拉框
    getSelectRequest() {
      this.$axiosGet(API.lessee_queryOrganizationalNatureList, {}).then(res => {
        if (res.data) {
          this.ruleForm.organizationalNatureList = res.data;
        }
      });
    },
    // 新增、修改承租人信息
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            // dealLesseeManageId: this.dealLesseeManageId,//承租人id
            name: this.ruleForm.lesseeName, //承租人姓名
            phone: this.ruleForm.lesseePhone, //承租人手机号
            organizationalNature: this.ruleForm.nature || "", //组织性质
            legalRepresentative: this.ruleForm.representative || "", //法定代表人
            scopeOfBusiness: this.ruleForm.rang || "", //经营范围
            identificationCard: this.ruleForm.idCard || "", //承租人身份证号
            frontOfIdCardList: this.ruleForm.idCardImgA,
            reverseOfIdCardList: this.ruleForm.idCardImgB
          };
          let url = "";
          if (this.$route.params.type === "edit") {
            // 区分当前页面状态
            params.id=this.lesseeManageId
            url = API.lessee_doUpdate;
          } else {
            url = API.lessee_doAdd;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('经营性房产', '承租人管理', '修改')
              } else {
                BURYINGPOINT.buryingPoint('经营性房产', '承租人管理', '新增')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },
    //修改承租人回显
    getEditDataRequest() {
      let params = {
        lesseeManageId: this.lesseeManageId
      };
      this.$axiosGet(API.lessee_detail, params).then(res => {
        let imgA = [];
        let imgB = [];
        if (res.data) {
          this.lesseeDetailList = res.data.lesseeManageResponse;
          this.ruleForm.lesseeName = this.lesseeDetailList.name;
          this.ruleForm.lesseePhone = this.lesseeDetailList.phone;
          this.ruleForm.nature = this.lesseeDetailList.organizationalNature;
          this.ruleForm.representative = this.lesseeDetailList.legalRepresentative;
          this.ruleForm.rang = this.lesseeDetailList.scopeOfBusiness;
          this.ruleForm.idCard = this.lesseeDetailList.identificationCard;
          this.getSelectRequest();
          if (res.data.fileResponseAdapterList) {
            res.data.fileResponseAdapterList.forEach((item, index) => {
              if (item.relateKey === "frontOfCardAttachments"||"front_of_id_card") {
                imgA.push(item);
              }
              if (item.relateKey === "reverseOfCardAttachments") {
                imgB.push(item);
              }
            });
            this.ruleForm.idCardImgA = imgA;
            this.ruleForm.idCardImgB = imgB;
          }
        }
      });
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push("/operate/lessee-manage/lessee-list");
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
// .card-1 {
//   background: url('../../public/static/images') 0 center no-repeat;
// }
</style>
