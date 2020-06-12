<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="paramsType" :item="[paramsType]" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{paramsType}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info th-180">
            <tr>
              <th>
                <i class="f-color-red">*</i>地址坐落
              </th>
              <td>
                <el-form-item prop="address">
                  <el-input placeholder="请输入地址坐落" readonly @focus="openChoseAddress" v-model="ruleForm.address"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>未办证类型</th>
              <td>
                <el-form-item prop="undocumentedType">
                  <el-select @change="setShowForm" v-model="ruleForm.undocumentedType" filterable clearable placeholder="请选择未办证类型">
                    <el-option v-for="(item, index) in getTypeList" :key="index" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>权属登记情况</th>
              <td>
                <el-form-item prop="registration">
                  <el-select v-model="ruleForm.registration" filterable clearable placeholder="请选择权属登记情况">
                    <el-option v-for="(item, index) in sysOwnerStatusResponseList" :key="index" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th v-if="showForm == '1'">
                <i class="f-color-red">*</i>未确权建筑面积
              </th>
              <td v-if="showForm == '1'">
                <el-form-item prop="building">
                  <el-input placeholder="请输入未确权建筑面积" @input="buildingInput" v-model="ruleForm.building">
                    <template slot="append">m²</template>
                  </el-input>
                </el-form-item>
              </td>
              <th v-if="showForm1 == '1'">
                <i class="f-color-red">*</i>未确权宗地面积
              </th>
              <td v-if="showForm1 == '1'">
                <el-form-item prop="landArea">
                  <el-input placeholder="请输入未确权宗地面积" @input="landAreaInput" v-model="ruleForm.landArea">
                    <template slot="append">m²</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm1 == '2'">
              <th>
                <i class="f-color-red">*</i>未确权宗地面积</th>
              <td colspan="3">
                <el-form-item prop="landArea">
                  <el-input placeholder="请输入未确权宗地面积" @input="landAreaInput" v-model="ruleForm.landArea">
                    <template slot="append">m²</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th><i class="f-color-red">*</i>未办证原因</th>
              <td colspan="3">
                <el-form-item prop="desc">
                  <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入未办证原因" maxlength="200"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <el-form-item prop="attachments">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传附件
                  </el-button>
                  <ul class="u-file">
                    <li v-for=" (item, index) in ruleForm.attachments" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index, ruleForm.attachments)" href="javascript:;">删除</a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/ownership-manage/undocumented/undocumented-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" v-show="this.$route.params.type === 'add'" @click="getAddDataRequest" :loading="loading">保存</el-button>
            <el-button class="u-submit-btn submit-btn new-btn" v-show="this.$route.params.type === 'edit'" @click="getDataRoomRequest" :loading="loadingroom">保存修改</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <v-upload ref="VUpload" @vueUpload="fileUploadRequest"></v-upload>
    <!-- 选择地址坐落弹出框 -->
    <v-chose-address ref="VChoseAddress" @callBack="getCallbackData"></v-chose-address>
  </div>
</template>

<script>
import choseAddress from '@/components/ownership-manage-v2/land-certificate/chose-address'
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  data() {
    return {
      showForm: '',
      showForm1: '1',
      loading: false,
      loadingroom: false,
      paramsType: '新增未办证登记',
      isBol: false, // 弹出框图形标识
      isBtn: false, //标识保存并创建房间
      id: '',
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtyardName: '',//院落名称
      ruleForm: {
        landArea: '',
        desc: '',
        attachments: [],
        address: '',
        undocumentedType: '',
        storeysId: '',
        registration: '',
        floorName: '',
        floorId: '',
        building: '',
      },
      getTypeList: [],
      sysOwnerStatusResponseList: [],
      rules: {
        landArea: [{
          required: true, message: '请输入未确权宗地面积', trigger: 'change'
        }],
        building: [
          { required: true, message: '请输入未确权建筑面积', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择地址坐落', trigger: 'change' }
        ],
        undocumentedType: [
          { required: true, message: '请选择未办证类型', trigger: 'change' },
        ],
        registration: [
          { required: true, message: '请选择权属登记情况', trigger: 'change' },
        ],
        desc: [
          { required: true, message: '请输入未办证原因', trigger: 'change' }
        ]
      },  //验证规则
    };
  },
  components: {
    'v-upload': vuePopupUpload,
    'v-chose-address': choseAddress
  },
  activated() {
    this.getSelect();  // 权属登记获取下拉选内容
    this.getType();// 获取未办证类型下拉选内容
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.storeysId = this.$route.query.id;
      }
      this.paramsType = '修改未办证登记';
      this.getEditDataRequest();
    }
  },
  deactivated() {
    this.$destroy();
    this.attachments = [];
  },
  methods: {
    landAreaInput(e) {
      this.ruleForm.landArea = e.replace(/[^\d.]+/g, '');
    },
    buildingInput(e) {
      this.ruleForm.building = e.replace(/[^\d.]+/g, '');
    },
    // 选择地址坐落
    openChoseAddress() {
      this.$refs.VChoseAddress.openModal();
    },
    // 获取回调数据
    getCallbackData(data) {
      this.ruleForm.floorId = data.floorId;
      this.ruleForm.address = data.courtyardAddress || '';
      this.courtyardName = data.courtyardName//房间信息
      this.ruleForm.floorName = data.floorName;

    },

    // 上传文件回调方法赋值
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        this.ruleForm.attachments.push({
          name: value.name,
          url: value.url
        })
      })
      this.$refs.ruleForm.validateField('attachments');
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.attachments.splice(index, 1);
      this.maxLength = 5 - this.ruleForm.attachments.length;
      this.$refs.ruleForm.validateField('attachments');
    },
    // 打开上传弹出框
    emptyFileJson() {
      this.$refs.VUpload.openModal()
    },
    // 获取下拉选内容
    getSelect() {
      this.$axiosGet(API.no_certificate_getWarrantSituationList, {}).then(res => {
        if (res.data) {
          this.sysOwnerStatusResponseList = res.data;
        }
      })
    },
    // 获取未办证类型下拉选内容
    getType() {
      this.$axiosGet(API.no_certificate_getTypeList, {}).then(res => {
        if (res.data) {
          this.getTypeList = res.data;
        }
      })
    },

    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            floorId: this.ruleForm.floorId,
            floorName: this.ruleForm.floorName,
            courtyardAddress: this.ruleForm.address || '',
            type: this.ruleForm.undocumentedType,
            warrantSituation: this.ruleForm.registration,
            reason: this.ruleForm.desc,
            buildArea: this.ruleForm.building,
            landArea: this.ruleForm.landArea,
            fileRequestList: this.ruleForm.attachments,
            courtyardName: this.courtyardName
          }
          this.$axiosJsonPost(API.no_certificate_add, params).then(res => {

            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false
            }
            this.isBtn = false;
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      }
      )
    },
    getDataRoomRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            id: this.storeysId,
            floorId: this.ruleForm.floorId,
            floorName: this.ruleForm.floorName,
            courtyardAddress: this.ruleForm.address || '',
            type: this.ruleForm.undocumentedType,
            warrantSituation: this.ruleForm.registration,
            reason: this.ruleForm.desc,
            buildArea: this.ruleForm.building,
            landArea: this.ruleForm.landArea,
            fileRequestList: this.ruleForm.attachments,
            courtyardName: this.courtyardName
          }
          this.$axiosJsonPost(API.no_certificate_update, params).then(res => {
            this.YPromptShow = true;
            this.isBol = true;
            this.isBtn = false;
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },

    // 设置切换权属判断字段显示隐藏
    setShowForm(value) {
      if (value == 'PROPERTY') {
        this.showForm = ''
        this.showForm1 = '1'
      } else if (value == 'LAND') {
        this.showForm1 = ''
        this.showForm = '1'
      } else {
        this.showForm1 = '2'
        this.showForm = '1'
      }

      this.$refs.ruleForm.clearValidate();
    },
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {
        id: this.storeysId
      }
      this.$axiosGet(API.no_certificate_detail, params).then(res => {
        this.ruleForm.address = res.data.courtyardAddress || '';
        this.ruleForm.undocumentedType = res.data.type;
        this.ruleForm.registration = res.data.warrantSituation;
        this.ruleForm.desc = res.data.reason;
        this.ruleForm.landArea = res.data.landArea || '';
        this.ruleForm.building = res.data.buildArea || '';
        this.courtyardName = res.data.courtyardName;
        this.ruleForm.attachments = res.data.fileResponseList || '';
        // if (res.data.fileResponseList) {
        //   res.data.fileResponseList.forEach((item, index) => {
        //     this.ruleForm.fileRequestList.push({
        //       name: item.name,
        //       url: item.url
        //     })
        //   });
        // }
        this.setShowForm(res.data.type);
      })
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/ownership-manage/undocumented/undocumented-list')
        }
      }, 100)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
.table-bottom-btns {
  width: 360px;
  text-align: center;
}
.new-btn {
  width: 120px !important;
}
</style>
