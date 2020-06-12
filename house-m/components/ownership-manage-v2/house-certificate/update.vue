<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="title" :item="['权属管理',title]" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{title}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red" v-if="handleRequiredItem('地址坐落')">*</i>地址坐落
              </th>
              <td>
                <el-form-item prop="courtyardAddress" :rules="{required: handleRequiredItem('地址坐落'), message: '地址坐落不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入地址坐落" readonly @focus="openChoseAddress" v-model="ruleForm.courtyardAddress"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red" v-if="handleRequiredItem('权属登记情况')">*</i>权属登记情况
              </th>
              <td>
                <el-form-item prop="warrantSituation" :rules="{required: handleRequiredItem('权属登记情况'), message: '权属登记情况不能为空', trigger: 'change'}">
                  <el-select @change="setShowForm" style="width:100%;" placeholder="请选择权属登记情况" v-model="ruleForm.warrantSituation">
                    <el-option v-for="(item, index) in sysOwnerStatusResponseList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>
                <i class="f-color-red" v-if="handleRequiredItem('房产证号')">*</i>房产证号
              </th>
              <td>
                <el-form-item prop="houseCertificateNo" :rules="{required: handleRequiredItem('房产证号'), message: '房产证号不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入房产证号" v-model="ruleForm.houseCertificateNo"></el-input>
                </el-form-item>
              </td>
              <th><i class="f-color-red" v-if="handleRequiredItem('产权单位')">*</i>产权单位</th>
              <td>
                <el-form-item prop="propertyOrganName" :rules="{required: handleRequiredItem('产权单位'), message: '产权单位不能为空', trigger: 'change'}">
                  <el-input :disabled="ruleForm.warrantSituation == 'ONE'" placeholder="请输入产权单位" v-model="ruleForm.propertyOrganName"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>
                <i class="f-color-red" v-if="handleRequiredItem('登记时间')">*</i>登记时间
              </th>
              <td>
                <el-form-item prop="registerDate" :rules="{required: handleRequiredItem('登记时间'), message: '登记时间不能为空', trigger: 'change'}">
                  <el-date-picker style="width:100%;" v-model="ruleForm.registerDate" type="date" placeholder="请选择登记时间" :picker-options='pickerOptions'></el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red" v-if="handleRequiredItem('发证机关')">*</i>发证机关
              </th>
              <td>
                <el-form-item prop="licenceIssuingAuthority" :rules="{required: handleRequiredItem('发证机关'), message: '发证机关不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入发证机关" v-model="ruleForm.licenceIssuingAuthority"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm == '1'">
              <th><i class="f-color-red" v-if="handleRequiredItem('共有情况')">*</i>共有情况</th>
              <td>
                <el-form-item prop="ownershipCircumstance" :rules="{required: handleRequiredItem('共有情况'), message: '共有情况不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入共有情况" v-model="ruleForm.ownershipCircumstance"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red" v-if="handleRequiredItem('房屋取得方式')">*</i>房屋取得方式
              </th>
              <td>
                <el-form-item prop="houseAcquisitionMode" :rules="{required: handleRequiredItem('房屋取得方式'), message: '房屋取得方式不能为空', trigger: 'change'}">
                  <el-select clearable style="width:100%;" placeholder="请选择房屋取得方式" v-model="ruleForm.houseAcquisitionMode">
                    <el-option v-for="(item, index) in sysHouseModeResponseList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>

            <tr v-if="showForm == '1'">
              <th><i class="f-color-red" v-if="handleRequiredItem('总层数')">*</i>总层数</th>
              <td>
                <el-form-item prop="totalStorey" :rules="[{required: handleRequiredItem('总层数'), message: '总层数不能为空', trigger: 'change'},{ validator: totalStoreyPass, trigger: 'change' }]">
                  <el-input placeholder="请输入总层数" v-model="ruleForm.totalStorey">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
              </td>
              <th><i class="f-color-red" v-if="handleRequiredItem('房屋规划用途')">*</i>房屋规划用途 </th>
              <td>
                <el-form-item prop="housePlanningPurposes" :rules="{required: handleRequiredItem('房屋规划用途'), message: '房屋规划用途不能为空', trigger: 'change'}">
                  <el-select clearable style="width:100%;" placeholder="请选择房屋规划用途" v-model="ruleForm.housePlanningPurposes">
                    <el-option v-for="(item, index) in sysHousePurposesResponseList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>

            <tr v-if="showForm == '1'">
              <th><i class="f-color-red" v-if="handleRequiredItem('土地使用年限')">*</i>土地使用年限</th>
              <td>
                <el-form-item prop="landUsageTerm" :rules="[{required: handleRequiredItem('土地使用年限'), message: '土地使用年限不能为空', trigger: 'change'},{pattern: /^(\d|([1-9](\d+)?))$/, message: '土地使用年限只能为大于等于0的数字', trigger: 'change'}]">
                  <el-input :maxlength="5" placeholder="请输入土地使用年限" v-model="ruleForm.landUsageTerm">
                    <template slot="append">年</template>
                  </el-input>
                </el-form-item>
              </td>
              <th><i class="f-color-red" v-if="handleRequiredItem('地号')">*</i>地号 </th>
              <td>
                <el-form-item prop="landNo" :rules="{required: handleRequiredItem('地号'), message: '地号不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入地号" v-model="ruleForm.landNo"></el-input>
                </el-form-item>
              </td>
            </tr>

            <tr v-if="showForm == '1'">
              <th><i class="f-color-red" v-if="handleRequiredItem('图号')">*</i>图号</th>
              <td>
                <el-form-item prop="figureNo" :rules="{required: handleRequiredItem('图号'), message: '图号不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入图号" v-model="ruleForm.figureNo"></el-input>
                </el-form-item>
              </td>
              <th><i class="f-color-red" v-if="handleRequiredItem('建筑面积')">*</i>建筑面积 </th>
              <td>
                <el-form-item prop="buildArea" :rules="[{required: handleRequiredItem('建筑面积'), message: '建筑面积不能为空', trigger: 'change'},{ validator: builtArea, trigger: 'change' }]">
                  <el-input placeholder="请输入建筑面积" v-model="ruleForm.buildArea">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>

            <tr v-if="showForm == '1'">
              <th><i class="f-color-red" v-if="handleRequiredItem('套内建筑面积')">*</i>套内建筑面积 </th>
              <td colspan="3">
                <el-form-item prop="withinBuildArea" :rules="[{required: handleRequiredItem('套内建筑面积'), message: '套内建筑面积不能为空', trigger: 'change'},{ validator: builtArea, trigger: 'change' }]">
                  <el-input placeholder="请输入套内建筑面积" v-model="ruleForm.withinBuildArea">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>

            <tr v-if="showForm == '1'">
              <th><i class="f-color-red" v-if="handleRequiredItem('备注')">*</i>备注</th>
              <td colspan="3">
                <el-form-item prop="remark" :rules="{required: handleRequiredItem('备注'), message: '备注不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入备注" :maxlength="200" v-model="ruleForm.remark" type="textarea" :rows="5"></el-input>
                  <div class="f-pull-right">{{ruleForm.remark.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm == '1'">
              <th>照片信息</th>
              <td colspan="3">
                <el-form-item prop="attachments">
                  <v-uploadPicture class="avatar-uploader" v-model="ruleForm.attachments" title="照片信息" max="1" maxSize="5"></v-uploadPicture>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm == '2'">
              <th><i class="f-color-red" v-if="handleRequiredItem('未办证原因')">*</i>未办证原因</th>
              <td colspan="3">
                <el-form-item prop="noEvidenceReason" :rules="{required: handleRequiredItem('未办证原因'), message: '未办证原因不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入未办证原因" :maxlength="200" v-model="ruleForm.noEvidenceReason" type="textarea" :rows="5"></el-input>
                  <div class="f-pull-right">{{ruleForm.noEvidenceReason.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showForm == '3'">
              <th><i class="f-color-red" v-if="handleRequiredItem('情况说明')">*</i>情况说明</th>
              <td colspan="3">
                <el-form-item prop="situationDescription" :rules="{required: handleRequiredItem('情况说明'), message: '情况说明不能为空', trigger: 'change'}">
                  <el-input placeholder="请输入情况说明" :maxlength="200" v-model="ruleForm.situationDescription" type="textarea" :rows="5"></el-input>
                  <div class="f-pull-right">{{ruleForm.situationDescription.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/ownership-manage/house-certificate/list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!-- 操作成功弹出框 -->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 选择地址坐落弹出框 -->
    <v-chose-address ref="VChoseAddress" @callBack="getCallbackData"></v-chose-address>
  </div>
</template>

<script>
import choseAddress from '@/components/ownership-manage-v2/land-certificate/chose-address'
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片

export default {
  components: {
    'v-uploadPicture': vueUploadPicture,
    'v-chose-address': choseAddress
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      requiredList: [],
      isBol: false,
      message: '',
      YPromptShow: false,
      title: '新增房产证',
      loading: false,
      ruleForm: {
        floorId: '', // 楼座id
        courtyardAddress: '', // 地址坐落
        warrantSituation: '', // 产权办理情况
        houseCertificateNo: '', // 房产证号
        propertyOrganName: '', // 产权单位
        registerDate: '', // 登记日期
        licenceIssuingAuthority: '', // 发证机关
        ownershipCircumstance: '',  // 共有情况
        houseAcquisitionMode: '',  // 房屋取得方式
        housePlanningPurposes: '',  // 房屋规划用途
        landUsageTerm: '', // 土地使用年限 
        landNo: '',  // 地号
        figureNo: '',  // 图号
        buildArea: '',  // 建筑面积
        withinBuildArea: '',  // 套内建筑面积
        totalStorey: '', // 总层数
        remark: '', // 备注
        noEvidenceReason: '', // 未办证原因
        situationDescription: '', // 情况说明
        attachments: [] // 图片地址
      },
      sysHousePurposesResponseList: [], // 房屋规划用途
      sysLandPurposesResponseList: [], // 土地规划用途
      sysHouseModeResponseList: [], // 房屋取得方式
      sysLandModeResponseList: [], // 土地取得方式
      sysOwnerStatusResponseList: [], // 权属登记情况
      showForm: '1', // 表单字段显示情况
      housePropertyArchivesId: ''
    };
  },
  watch: {
    'ruleForm.buildArea': function (val) {
      if (val && this.ruleForm.withinBuildArea && !isNaN(Number(val)) && !isNaN(Number(this.ruleForm.withinBuildArea))) {
        if (val >= Number(this.ruleForm.withinBuildArea)) {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate(['buildArea', 'withinBuildArea']);
          }
        }
      }
    },
    'ruleForm.withinBuildArea': function (val) {
      if (val && this.ruleForm.buildArea && !isNaN(Number(val)) && !isNaN(Number(this.ruleForm.buildArea))) {
        if (val <= Number(this.ruleForm.buildArea)) {
          if (this.$refs.ruleForm) {
            this.$refs.ruleForm.clearValidate(['buildArea', 'withinBuildArea']);
          }
        }
      }
    }
  },
  activated() {
    this.getRequiredList();
    this.getSelect();
    if (this.$route.query.housePropertyArchivesId) {
      this.getDetail();
      this.title = '修改房产证';
    } else {
      this.title = '新增房产证';
    }
  },
  deactivated() {
    this.$destroy();
  },
  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    },
    organName() {
      return this.$store.state.mainData.organName;
    }
  },
  methods: {
    // 获取必填项
    getRequiredList() {
      let param = {
        areaId: this.areaId,
        organId: this.organId
      };
      this.$axiosGet(API.sysmanage_sysFormSetList, param).then(res => {
        if (res.code === 200) {
          res.data.some(item => {
            if (item.menuName === "房产证必填设置") {
              this.requiredList = item.sysFormSetResponseList;
              return true;
            }
          });
        }
      })
    },
    // 根据text参数判断是否必填
    handleRequiredItem(text) {
      if (!this.requiredList.length) {
        return true;
      }
      let result;
      this.requiredList.some(item => {
        if (item.requiredName === text) {
          result = item.formSwitch;
          return true;
        }
      });
      if (result === null || result === "NO") {
        return false;
      } else if (result === "YES") {
        return true;
      } else {
        return true;
      }
    },
    // 获取下拉选内容
    getSelect() {
      this.$axiosGet(API.landArchives_querySelect, {}).then(res => {
        if (res.data) {
          this.sysHousePurposesResponseList = res.data.sysHousePurposesResponseList;
          this.sysLandPurposesResponseList = res.data.sysLandPurposesResponseList;
          this.sysHouseModeResponseList = res.data.sysHouseModeResponseList;
          this.sysLandModeResponseList = res.data.sysLandModeResponseList;
          this.sysOwnerStatusResponseList = res.data.sysOwnerStatusResponseList;
        }
      })
    },
    // 新增、修改院落
    getAddDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {}
          if (this.showForm == '1') {
            params = {
              // organId: this.organId,
              // areaId: this.areaId, // 地区Id
              floorId: this.ruleForm.floorId, // 楼座id
              courtyardAddress: this.ruleForm.courtyardAddress, // 地址坐落
              warrantSituation: this.ruleForm.warrantSituation, // 产权办理情况
              houseCertificateNo: this.ruleForm.houseCertificateNo, // 房产证号
              propertyOrganName: this.ruleForm.propertyOrganName, // 产权单位
              registerDate: DATEFORMAT.dateReturn(this.ruleForm.registerDate) || '', // 登记日期
              licenceIssuingAuthority: this.ruleForm.licenceIssuingAuthority, // 发证机关
              ownershipCircumstance: this.ruleForm.ownershipCircumstance,  // 共有情况
              houseAcquisitionMode: this.ruleForm.houseAcquisitionMode,  // 房屋取得方式
              housePlanningPurposes: this.ruleForm.housePlanningPurposes,  // 房屋规划用途
              landUsageTerm: this.ruleForm.landUsageTerm, // 土地使用年限 
              landNo: this.ruleForm.landNo,  // 地号
              figureNo: this.ruleForm.figureNo,  // 图号
              buildArea: this.ruleForm.buildArea,  // 建筑面积
              withinBuildArea: this.ruleForm.withinBuildArea,  // 套内建筑面积
              totalStorey: this.ruleForm.totalStorey, // 总层数
              remark: this.ruleForm.remark, // 备注
              fileRequestList: this.ruleForm.attachments // 图片地址
            }
          } else if (this.showForm == '2') {
            params = {
              organId: this.organId,
              areaId: this.areaId, // 地区Id
              floorId: this.ruleForm.floorId, // 楼座id
              courtyardAddress: this.ruleForm.courtyardAddress, // 地址坐落
              warrantSituation: this.ruleForm.warrantSituation, // 产权办理情况
              noEvidenceReason: this.ruleForm.noEvidenceReason // 为办证原因
            }
          } else {
            params = {
              organId: this.organId,
              areaId: this.areaId, // 地区Id
              floorId: this.ruleForm.floorId, // 楼座id
              courtyardAddress: this.ruleForm.courtyardAddress, // 地址坐落
              warrantSituation: this.ruleForm.warrantSituation, // 产权办理情况
              situationDescription: this.ruleForm.situationDescription // 情况说明
            }
          }
          let url = '';
          if (this.$route.query.housePropertyArchivesId) {
            url = API.housePropertyArchives_doUpdate;
            this.$set(params, 'id', this.$route.query.housePropertyArchivesId)
          } else {
            url = API.housePropertyArchives_doAdd;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false
            }
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.push({ path: '/ownership-manage/house-certificate/list' })
      }
    },
    // 选择地址坐落
    openChoseAddress() {
      this.$refs.VChoseAddress.openModal();
    },
    // 获取回调数据
    getCallbackData(data) {
      this.ruleForm.floorId = data.floorId;
      this.ruleForm.courtyardAddress = data.courtyardAddress;
    },
    // 取得价格表单验证
    totalStoreyPass(rule, value, callback) {
      if (value) {
        if (!/^(\d|([1-9](\d+)?))$/.test(value)) {
          callback(new Error(`总层数为大于零的正整数`))
        } else if (value > 1000) {
          callback(new Error(`取得价格不能大于一千层`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 土地面积验证
    builtArea(rule, value, callback) {
      let message = '';
      if (rule.field === 'buildArea') {
        message = '建筑面积'
      } else {
        message = '套内建筑面积'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方`))
        } else {
          if (rule.field == 'buildArea') {
            if (this.ruleForm.withinBuildArea) {
              if (Number(value) < Number(this.ruleForm.withinBuildArea)) {
                callback(new Error('建筑面积不能小于套内建筑面积'))
              } else {
                callback();
              }
            } else {
              callback();
            }
          } else {
            if (this.ruleForm.buildArea) {
              if (Number(value) > Number(this.ruleForm.buildArea)) {
                callback(new Error('套内建筑面积不能大于建筑面积'))
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
      } else {
        callback()
      }
    },
    // 设置切换权属判断字段显示隐藏
    setShowForm(value) {
      if (value == 'ONE') {
        this.ruleForm.propertyOrganName = this.organName;
      }
      if (value == 'ONE' || value == 'TWO' || value == "THREE") {
        this.showForm = '1';
      } else if (value == 'FOUR' || value == 'FIVE') {
        this.showForm = '2';
      } else {
        this.showForm = '3';
      }
      this.$refs.ruleForm.clearValidate();
    },
    // 获取详情
    getDetail() {
      let params = {
        id: this.$route.query.housePropertyArchivesId
      }
      this.$axiosGet(API.housePropertyArchives_detail, params).then(res => {
        this.ruleForm.floorId = res.data.propertyArchivesResponse.floorId || '';
        this.ruleForm.courtyardAddress = res.data.propertyArchivesResponse.courtyardAddress || '';
        this.ruleForm.warrantSituation = res.data.propertyArchivesResponse.warrantSituation || '';
        this.ruleForm.houseCertificateNo = res.data.propertyArchivesResponse.houseCertificateNo || '';
        this.ruleForm.propertyOrganName = res.data.propertyArchivesResponse.propertyOrganName || '';
        if (res.data.propertyArchivesResponse.registerDate) {
          this.ruleForm.registerDate = new Date(res.data.propertyArchivesResponse.registerDate) || '';
        }
        this.ruleForm.licenceIssuingAuthority = res.data.propertyArchivesResponse.licenceIssuingAuthority || '';
        this.ruleForm.ownershipCircumstance = res.data.propertyArchivesResponse.ownershipCircumstance || '';
        this.ruleForm.houseAcquisitionMode = res.data.propertyArchivesResponse.houseAcquisitionMode || '';
        this.ruleForm.housePlanningPurposes = res.data.propertyArchivesResponse.housePlanningPurposes || '';
        this.ruleForm.landUsageTerm = res.data.propertyArchivesResponse.landUsageTerm || '';
        this.ruleForm.landNo = res.data.propertyArchivesResponse.landNo || '';
        this.ruleForm.figureNo = res.data.propertyArchivesResponse.figureNo || '';
        this.ruleForm.buildArea = res.data.propertyArchivesResponse.buildArea || '';
        this.ruleForm.withinBuildArea = res.data.propertyArchivesResponse.withinBuildArea || '';
        this.ruleForm.totalStorey = res.data.propertyArchivesResponse.totalStorey || '';
        this.ruleForm.propertyOrganName = res.data.propertyArchivesResponse.propertyOrganName || '';
        this.ruleForm.remark = res.data.propertyArchivesResponse.remark || '';
        this.ruleForm.noEvidenceReason = res.data.propertyArchivesResponse.noEvidenceReason || '';
        this.ruleForm.situationDescription = res.data.propertyArchivesResponse.situationDescription || '';
        this.ruleForm.attachments = res.data.fileResponseList || [];
        this.setShowForm(this.ruleForm.warrantSituation)
      })
    }
  }
};
</script>