<template>
  <div>
    <section class="m-main column-edit-wrap">
      <!--导航-->
      <div class="m-breadcrumb f-clearfix">
        <Y-Breadcrumb title="编辑主题" :item="['栏目管理', '编辑主题']"></Y-Breadcrumb>
      </div>

      <div class="h-tab-content">
        <div style="text-align:center;margin-bottom:10px;">
          <div class="f-weight-bold" style="font-size:16px;">编辑</div>
          <div class="f-color-red">（*为必填项，请检查后提交！）</div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <table class="h-table-info">
            <tr>
              <th><i class="f-color-red">*</i>主题名称</th>
              <td colspan="3">
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" maxlength="10" placeholder="请输入主题名称"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th><i class="f-color-red">*</i>主题介绍</th>
              <td colspan="3">
                <el-form-item prop="introduction">
                  <el-input type="textarea" @input="descInput" resize="none" rows="8" maxlength="500" v-model="ruleForm.introduction" placeholder="请输入"></el-input>
                  <span class="column-num-length">{{remnant}}/500</span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th><i class="f-color-red"></i>上传插图</th>
              <td colspan="3">
                <el-form-item prop="imgIcon">
                  <v-uploadPicture class="" v-model="ruleForm.imgIcon" title="上传图片" max="1" maxSize="10"></v-uploadPicture>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th><i class="f-color-red">*</i>上传图片</th>
              <td colspan="3">
                <el-form-item prop="imgUrls">
                  <v-uploadPicture v-model="ruleForm.imgUrls" title="上传图片" max="10" maxSize="10"></v-uploadPicture>
                </el-form-item>
              </td>
            </tr>
            <!-- <tr>
              <th><i class="f-color-red">*</i>显示栏目数量</th>
              <td colspan="3">
                <el-form-item prop="num">
                  <el-select v-model="ruleForm.num" placeholder="请选择">
                    <el-option v-for="item in optionsNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr> -->
          </table>

          <div class="f-text-center" style="margin:30px 0;">
            <el-button @click="columnEditBtn">取消</el-button>
            <el-button class="column-edit-btn-sure" @click="columnSureBtn">确定</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片

export default {
  components: {
    'v-uploadPicture': vueUploadPicture,
  },
  data() {
    return {
      remnant: 0,
      // optionsNum: [
      //   {
      //     value: '3',
      //     label: '3'
      //   }, {
      //     value: '4',
      //     label: '4'
      //   }, {
      //     value: '5',
      //     label: '5'
      //   }, {
      //     value: '6',
      //     label: '6'
      //   }
      // ],
      // fileMax: 5, // 上传附件上限
      // isAdd: false, // 是否新增页面
      // newsId: '', // 新闻id
      // newsActive: 'save',
      // imageType: '', // 图片库提交或保存
      // uploadType: 'jpg/jpeg/png/xls/doc/docx/xlsx/ppt', // 上传文件格式
      // fileListData: [], // 文件数据
      // sourceMap: {
      //   ORIGINAL: '原创',
      //   REPRINT: '转载'
      // },
      ruleForm: {
        imgUrls: '',
        imgIcon: '',
        name: '',
        introduction: '',
        // num: ''
      },
      rules: {
        name: [
          { required: true, message: "主题名称不能为空", trigger: "change" }
        ],
        imgUrls: [
          { required: true, message: "请上传图片", trigger: "change" }
        ],
        imgIcon: [
          { required: true, message: "请上传插图", trigger: "change" }
        ],
        introduction: [
          { required: true, message: "主题介绍不能为空", trigger: "change" }
        ],
        // num: [
        //   { required: true, message: "栏目数量不能为空", trigger: "change" }
        // ]
      },
      YPromptShow: false,
      isBol: false,
      message: ''
    };
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.getThemeData();
  },
  deactivated() {
    // this.fileListData = [];
    // this.ruleForm.type = 'PICTURE';
    // this.ruleForm.title = '';
    // this.ruleForm.source = '';
    // this.ruleForm.content = '';
    // this.ruleForm.officeUrl = '';
    // this.$refs.ruleForm.resetFields();
  },
  methods: {
    // 显示输入框总字数
    descInput() {
      this.remnant = this.ruleForm.introduction.length;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.go(-1)
      }
    },
    deleteFile(index) {
      this.fileListData.splice(index, 1)
    },
    // 取消
    columnEditBtn() {
      this.$router.go(-1);
    },
    // 确定
    columnSureBtn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            areaId: '0100102',
            titleId: this.$route.query.id,
            titleIntroduction: this.ruleForm.introduction,
            titleName: this.ruleForm.name,
            attachImg: this.ruleForm.imgUrls,
            uploadImage: this.ruleForm.imgIcon[0]
          };
          // 修改主题信息
          this.$axiosJsonPost(API.columnManageFacade_updateTitle, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      })
    },
    // 获取主题信息
    getThemeData() {
      let params = {
        titleId: this.$route.query.id
      };
      this.$axiosGet(API.columnManageFacade_findByTitleId, params).then(res => {
        if (res.result == 'success') {
          this.ruleForm.name = res.model.titleName;
          this.ruleForm.introduction = res.model.titleIntroduction;
          this.ruleForm.imgUrls = res.model.attachImg;
          this.remnant = res.model.titleIntroduction.length;
          this.ruleForm.imgIcon = [res.model.uploadImage];
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.column-edit-wrap {
  .column-num-length {
    position: absolute;
    right: 10px;
    top: 147px;
    font-size: 12px;
    color: #ccc;
  }
  .column-edit-btn-sure {
    background-color: #2f70ff;
    color: #fff;
  }
}
</style>
