
<template>
  <div>
    <section class="m-main">

      <div class="m-breadcrumb">
        <Y-Breadcrumb title="新增合同" :item="['新增合同']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{titleType}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>合同编号</th>
              <td>
                <el-form-item prop="contractNo">
                  <el-input maxlength="40" clearable placeholder="请输入" v-model="ruleForm.contractNo"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>合同开始日期</th>
              <td>
                <el-form-item prop="contractStartDate">
                  <el-date-picker v-model="ruleForm.contractStartDate" type="date" @change="getEnd" placeholder="选择日期" style="width: calc(100%)" :disabled="updateContractDateFalg === true" :picker-options='pickerOptions0'>
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>合同期限：</th>
              <td>
                <el-form-item prop="contractDeadline">
                  <el-input v-model="ruleForm.contractDeadline" :maxlength="2" clearable placeholder="请输入" @change="getEnd" :disabled="updateContractDateFalg === true">
                    <template slot="append">年</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>合同结束日期</th>
              <td>{{contractEndDate ?contractEndDate.substr(0, 10):'—'}}</td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>合同标的物</th>
              <td class="f-relative backStyinput">
                <el-form-item prop="subject" class="f-absolute" style="width: calc(100% - 20px)">
                  <el-input v-model="ruleForm.subject" disabled placeholder="请选择合同标的物" @func="getMsgFormSon"><i slot="suffix" class="el-input__icon el-icon-arrow-down"></i></el-input>
                </el-form-item>
                <a @click="subjectInfoClick(id,subjectList)" style="position:relative;display: block;width: 100%;height:40px;"></a>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>合同租金</th>
              <td>
                <el-form-item prop="contractRental">
                  <el-input clearable v-model="ruleForm.contractRental" placeholder="请输入">
                    <template slot="append">元/年</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>出租方</th>
              <td>
                {{rentPerson}}
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>承租人</th>
              <td>
                <el-form-item prop="lesseeName">
                  <el-select v-model="ruleForm.lesseeName" filterable clearable placeholder="请选择承租人">
                    <el-option v-for="item in getLesseeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle" style="padding:5px 0 10px; cursor:pointer" @click="contText = !contText">
              <span></span>
              合同正文</h2>
          </div>
          <div class="h-tab-content" style="margin-top:0" v-show="contText">
            <el-form ref="ruleForm" :model="ruleForm">
              <v-editor v-model="ruleForm.content" :editorToolbar="customToolbar" style="width:100%;height:350px;margin-bottom:58px;"></v-editor>
              <!-- <div class="table-bottom-btns f-hidden">
                <router-link to="/operate/contract-manage/contractinfo-list">
                  <el-button class="u-submit-btn cancel-btn">
                    取消
                  </el-button>
                </router-link>
                <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
              </div> -->
            </el-form>
          </div>
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle" style="padding:5px 0 10px;cursor:pointer" @click="fileNss = !fileNss">
              <span></span>
              附件</h2>
          </div>
          <div class="h-tab-content" style="margin-top:0" v-show="fileNss">
            <!-- <el-form :rules="rules" ref="ruleForm" :model="ruleForm"> -->
            <el-form ref="ruleForm" :model="ruleForm">
              <table class="h-table-info">
                <tr>
                  <th>身份证</th>
                  <td>
                    <span class="f-pull-left">
                      <v-uploadPicture class="avatar-uploader" v-model="ruleForm.idCardImgA" title="身份证正面" max="1" maxSize="5"></v-uploadPicture>
                    </span>
                    <v-uploadPicture class="avatar-uploader" v-model="ruleForm.idCardImgB" title="身份证背面" max="1" maxSize="5"></v-uploadPicture>
                  </td>
                </tr>
                <tr>
                  <th>营业执照</th>
                  <td>
                    <v-uploadPicture v-model="ruleForm.imgUrls" title="上传营业执照" max="5" maxSize="5"></v-uploadPicture>
                  </td>
                </tr>
                <tr>
                  <th>相关附件</th>
                  <td>
                    <el-button class="u-upload-btn" @click="emptyFileJson">
                      <i class="iconfont icon-daochu"></i>上传附件
                    </el-button>
                    <ul>
                      <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                        <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                        <a target="_blank" :href="item.url">预览</a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </table>
              <!-- <div class="table-bottom-btns f-hidden">
                <router-link to="/operate/contract-manage/contractinfo-list">
                  <el-button class="u-submit-btn cancel-btn">
                    取消
                  </el-button>
                </router-link>
                <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
              </div> -->
            </el-form>
          </div>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/operate/contract-manage/contractinfo-list">
              <el-button class="u-submit-btn cancel-btn">
                取消
              </el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <!-- 合同标的物 -->
    <contract-subject ref="contractSubject" @getMsgFormSon='getMsgFormSon'></contract-subject>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="jpeg/jpg/png"></v-upload>
  </div>
</template>

<script>
import contractSubject from '@/components/operate/contract-manage/contract-update/contract-subject'; // 合同标的物
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
import { VueEditor } from 'vue2-editor'; //编辑器
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件

export default {
  components: {
    'v-uploadPicture': vueUploadPicture,
    'contract-subject': contractSubject,
    'v-editor': VueEditor,
    'v-upload': vuePopupUpload

  },
  data() {
    let self = this;
    let useRental = (rule, value, callback) => {
      let message = '租金';
      if (value || value == 0) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value >= 10000000) {
          callback(new Error(`${message}为最多七位整数`))
        } else if (value == 0) {
          callback(new Error(`${message}须大于0`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`))
      }
    }
    let useArea = (rule, value, callback) => {
      let message = '年限';
      if (value) {
        if (!/^(\d|([1-9]\d+))?$/.test(value)) {
          callback(new Error(`${message}为整数`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`))
      }
    }
    return {
      loading: false,
      id: '', // 新增返回的id
      titleType: '新增合同', //标题
      contractStartDate: '', //合同开始日期
      contractDeadline: '', //合同期限
      contractEndDate: '', //合同结束日期
      contractRental: '', //合同租金
      // dealLesseeManageId: '', //承租人主键
      subject: '',//合同标的物
      getLesseeList: [], //承租人下拉
      rentPerson: '', //出租方
      subjectList: [], //标的物id

      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      ruleForm: {
        subject: '', //合同标的物
        contractNo: '', //合同编号    
        contractStartDate: '', //合同开始日期
        contractDeadline: '', //合同期限
        contractRental: '',//合同租金
        dealLesseeManageId: '', //承租人主键
        lesseeName: '', //承租人
        dicValue: '', //合同状态
        contractStatus: '', //修改合同-合同状态传值
        content: '', //正文的内容
        idCardImgA: [],
        idCardImgB: [],
        domains: [], //上传文件集合
        imgUrls: []  //上传图片集合
      },
      updateContractDateFalg: false, //合同时间是否可修改

      rules: {
        contractNo: [
          { required: true, message: '合同编号不能为空', trigger: 'change' }
        ],
        contractStartDate: [
          { required: true, message: '合同日期不能为空', trigger: 'change' }
        ],
        contractDeadline: [
          { required: true, validator: useArea, trigger: 'change' }
        ],
        contractRental: [
          { required: true, validator: useRental, trigger: 'change' }
        ],
        lesseeName: [
          { required: true, message: '承租人不能为空', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '合同标的物不能为空', trigger: 'change' }
        ],

        dicValue: [
          { required: true, message: '合同状态不能为空', trigger: 'change' }
        ],
      },
      //正文
      paramsType: '新增', //页面标题显示
      customToolbar: [ // 富文本控制
        ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'image', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean']
      ],
      dealContractProperId: '', //合同正文主键
      //附件
      maxLength: '200', //文件的长度
      formData: {}, // 上传图片的相关参数
      upUrl: '', // 图片链接
      accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg', // 上传图片格式

      upData: '', //判断是否时新增
      contText: false,
      fileNss: false,
      pickerOptions0: {
        disabledDate(time) {
          if (time) {
            return time.getTime() > (Date.now());
          }
        }
      },
    };
  },
  computed: {
    // realName() {
    //   return this.$store.state.mainData.realName;
    // },
    // organName() {
    //   return this.$store.state.mainData.organName;
    // },
    // areaName() {
    //   return this.$store.state.mainData.areaName;
    // }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.contractEndDate = '';
    this.getSelectRequest();
    this.id = this.$route.query.id;
    if (this.$route.query.id !== 'add') {
      this.contText = true;
      this.fileNss = true;
      // 区分当前页面状态
      this.id = this.$route.query.id;
      this.titleType = '修改合同';
      this.getEditDataRequest();
    } else {
      this.titleType = '新增合同';
      this.contText = false;
      this.fileNss = false;
      this.updateContractDateFalg = false;
    }
  },
  deactivated() {
    this.ruleForm.idCardImgA = [];
    this.ruleForm.idCardImgB = [];
    this.ruleForm.domains = [];
    this.ruleForm.imgUrls = [];
    this.ruleForm.content = '';
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    beforeUpload(file) {
      // 上传图片前的触发事件
      if (file) {
        let d = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
        // 获取upToken
        return this.$axiosPost(API.memberImage_ajaxUploadInfo, {}).then(res => {
          this.upUrl = res.model.upUrl;
          this.formData = {
            key: `${res.model.fileName}${d}`,
            token: res.model.upToken
          };
        });
      } else {
        return false;
      }
    },
    facePicHandleSuccess(res) {
      // 上传图片的回调函数-身份证正面
      this.ruleForm.identificationCardFacePic = `${this.upUrl}${res.key}`;
    },
    handPicHandleSuccess(res) {
      // 上传图片的回调函数-手持身份证
      this.ruleForm.identificationCardHandPic = `${this.upUrl}${res.key}`;
    },
    fileUploadRequest(fileNameList) { // 文件上传回选
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.domains.length
    },
    emptyFileJson() { // 打开文件上传弹出框
      this.$refs.VUpload.openModal()
    },
    // 合同标的物的弹框
    subjectInfoClick(id, subject) {
      this.$refs.contractSubject.openModal(id, subject);
    },
    // 新增、修改楼座
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.id === 'add') {
            this.id = '';
          }
          let getLesseeList = this.getLesseeList || [];
          getLesseeList.forEach((item, index) => {
            if (item.id == this.ruleForm.lesseeName) {
              this.ruleForm.dealLesseeManageId = item.id
            }
          })

          let chuanzhi = JSON.parse(JSON.stringify(this.chuanzhi));
          chuanzhi = chuanzhi.map( item => ({
            houseAddress: item.roomAddress,
            houseId: item.roomId,
            street: item.street,
            houseNo: item.houseNo,
          }))

          let params = {
            contractNo: this.ruleForm.contractNo,  //合同编号 
            startDate: FORMATGET.formatGET(this.ruleForm.contractStartDate) || null, //合同开始日期 
            deadline: this.ruleForm.contractDeadline || null, //合同期限 
            endDate: FORMATGET.formatGET(this.contractEndDate) || null,//合同结束日期 
            contractSubjectRequestList: chuanzhi,//合同标的物主键 
            rental: this.ruleForm.contractRental,//合同租金 
            
            rentPersonId: this.$store.state.mainData.organName,//出租方 

            lesseeManageId: this.ruleForm.dealLesseeManageId,//承租人主键 

            contractStatus: this.contractStatus || '', //合同状态

            id: this.id, //合同主键

            text: this.ruleForm.content || '', //合同正文
            frontOfIdCardList: (this.ruleForm.idCardImgA) || '',
            reverseOfIdCardList: (this.ruleForm.idCardImgB) || '',
            businessLicenseList: (this.ruleForm.imgUrls) || '',
            noteInfoList: (this.ruleForm.domains) || '',
          }
          let url = '';
          if (this.$route.query.id === 'add') {
            url = API.contract_addContract;
          } else {
            url = API.contract_updateContract;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
              if (this.$route.query.id === 'add') {
                BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '新增合同基本信息')
                // this.id = res.data.contractId;
              } else {
                BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '修改合同基本信息')
              }
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },
    //修改详情回显
    getEditDataRequest() {
      let params = {
        contractId: this.id,
      }
      // this.$axiosPost(API.contract_getContractWithSubject, params).then(res => {
      this.$axiosGet(API.contract_getContractDetails, params).then(res => {
        let str = '';
        this.subjectList = [];
        let strarr = [];
        let data = res.data.contractResponse.contractSubjectResponseList||[];
        data.forEach((row, index) => {
          str += data[index].houseAddress + data[index].street + data[index].houseNo + '，';
          this.subjectList.push({
            roomId: data[index].houseId,
          })
        });

        data.forEach((row, index) => {
          strarr.push({ roomAddress: row.houseAddress, houseNo: row.houseNo, street: row.street, roomSources: row.houseSources, roomId: row.houseId, })
        })
        this.chuanzhi = strarr;
        this.ruleForm.contractNo = res.data.contractResponse.contractNo; //合同编号
        this.ruleForm.contractStartDate = res.data.contractResponse.startDate; //合同开始日期
        this.ruleForm.contractDeadline = res.data.contractResponse.deadline; //合同期限
        this.contractEndDate = FORMATGET.formatGET(new Date(res.data.contractResponse.endDate)); //合同结束日期
        this.ruleForm.contractRental = res.data.contractResponse.rental; //合同租金
        this.rentPerson = res.data.contractResponse.rentOrgan; //出租方
        this.ruleForm.lesseeName = res.data.contractResponse.lesseeName; //承租人
        this.ruleForm.dealLesseeManageId = res.data.contractResponse.lesseeManageId;//承租人主键 
        this.ruleForm.subject = str;
        this.updateContractDateFalg = res.data.updateContractDateFalg;
        this.contractStatus = res.data.contractResponse.status;

        this.ruleForm.idCardImgA = res.data.front_of_id_card || [];
        this.ruleForm.idCardImgB = res.data.reverse_of_id_card || [];
        this.ruleForm.imgUrls = res.data.business_license || [];
        this.ruleForm.domains = res.data.note_info_list || [];
        this.ruleForm.content = res.data.contractResponse.text || '';
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push({ path: '/operate/contract-manage/contractinfo-list' })
        }
      }, 1000)
    },
    getSelectRequest() { //出租方 承租人下拉
      this.$axiosGet(API.contract_toAddContract, {}).then(res => {
        this.rentPerson = res.data.rentOrgan;
      });
      this.$axiosGet(API.contract_getLesseeList, {}).then(res => {
        this.getLesseeList = res.data;
      });
    },
    add0(m) { return m < 10 ? '0' + m : m },

    getEnd() {
      if (this.ruleForm.contractStartDate && this.ruleForm.contractDeadline) {
        let Year = '';
        let Month = '';
        let Day = '';
        let endYear = '';
        const date = new Date(this.ruleForm.contractStartDate);
        let d = new Date();
        Year = date.getFullYear();
        Month = date.getMonth() + 1;
        Day = date.getDate();
        endYear = Year + Number(this.ruleForm.contractDeadline);
        this.contractEndDate = `${endYear}-${this.add0(Month)}-${this.add0(Day)}`;
      }
    },
    getMsgFormSon(data) {
      if (data) {
        let str = '';
        let strarr = [];
        this.subjectList = [];
        data.forEach((row, index) => {
          str += data[index].houseAddress + data[index].street + data[index].houseNo + '，';
          this.subjectList.push({
            roomId: row.id,
          })
        });
        data.forEach((row, index) => {
          strarr.push({ roomAddress: row.houseAddress, houseNo: row.houseNo, street: row.street, roomSources: row.houseSources, roomId: row.id, })
        })
        this.ruleForm.subject = str;
        this.chuanzhi = strarr;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.h-table-info {
  .el-select {
    display: block;
  }
}
</style>
<style  lang="scss">
.backStyinput .el-input__inner {
  background-color: #fff !important;
}
</style>


