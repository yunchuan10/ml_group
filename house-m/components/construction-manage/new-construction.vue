<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="nameNow+'建设项目'" :item="[nameNow+'建设项目']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{nameNow}}建设项目</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <!-- <el-form :rules="rules" ref="ruleForm" :model="ruleForm"> -->
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>建设单位</th>
              <td>
                <el-form-item prop="buildingOrganName" :rules="{required: true, message: '建设单位不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入建设单位" v-model="ruleForm.buildingOrganName"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>项目名称</th>
              <td>
                <el-form-item prop="projectName" :rules="{required: true, message: '项目名称不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入项目名称" v-model="ruleForm.projectName"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>工程类型</th>
              <td>
                <el-form-item prop="prijectType" :rules="{required: true, message: '工程类型不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入工程类型" v-model="ruleForm.prijectType"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>建筑结构</th>
              <td>
                <el-form-item prop="houseStructureName" :rules="{required: true, message: '建筑结构不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.houseStructureName" filterable clearable placeholder="请选择建筑结构">
                    <el-option v-for="item in ruleForm.houseStructure" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item prop="houseStructureName" :rules="{required: true, message: '房屋结构不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入房屋结构" v-model="ruleForm.houseStructureName"></el-input>
                </el-form-item> -->
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>总建筑面积</th>
              <td>
                <el-form-item prop="buildAreaOfTotal" :rules="{validator: builtArea, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入总建筑面积" v-model="ruleForm.buildAreaOfTotal">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>人防面积</th>
              <td>
                <el-form-item prop="areaOfAirDefence" :rules="{validator: builtArea, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入人防面积" v-model="ruleForm.areaOfAirDefence">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>地上层数</th>
              <td>
                <el-form-item prop="numberOfFloorsAboveGround" :rules="{validator: checkFloorNumber, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入地上层数" v-model="ruleForm.numberOfFloorsAboveGround">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>地下层数</th>
              <td>
                <el-form-item prop="numberOfFloorsUnderGround" :rules="{validator: checkFloorNumber, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入地下层数" v-model="ruleForm.numberOfFloorsUnderGround">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>地上建筑面积</th>
              <td>
                <el-form-item prop="buildAreaOfAboveGround" :rules="{validator: builtArea, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入地上建筑面积" v-model="ruleForm.buildAreaOfAboveGround">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>地下建筑面积</th>
              <td>
                <el-form-item prop="buildAreaOfUnderGround" :rules="{validator: builtArea, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入地下建筑面积" v-model="ruleForm.buildAreaOfUnderGround">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>开工日期
              </th>
              <td>
                <el-form-item prop="stratDate" :rules="{required: true, message: '开工日期不能为空', trigger: 'change'}">
                  <el-date-picker :picker-options="pickerOptions0" v-model="ruleForm.stratDate" type="date" placeholder="请选择开工日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>工程预算</th>
              <td>
                <el-form-item prop="projectBudget" :rules="{validator: gainThePricePass, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入工程预算" v-model="ruleForm.projectBudget">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>施工单位名称</th>
              <td>
                <el-form-item prop="constructionOrganName" :rules="{required: true, message: '施工单位名称不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入施工单位名称" v-model="ruleForm.constructionOrganName"></el-input>
                </el-form-item>
              </td>
              <th>完工日期</th>
              <td>
                <el-form-item prop="endDate">
                  <el-date-picker :picker-options="pickerOptions1" v-model="ruleForm.endDate" type="date" placeholder="请选择完工日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>决算日期</th>
              <td>
                <el-form-item prop="settlementDate">
                  <el-date-picker :picker-options="pickerOptions2" v-model="ruleForm.settlementDate" type="date" placeholder="请选择决算日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>决算金额</th>
              <td>
                <el-form-item prop="settlementMoney" :rules="{validator: gainThePricePass, trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入决算金额" v-model="ruleForm.settlementMoney">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>施工许可证号</th>
              <td>
                <el-form-item prop="contructionPermitNo" :rules="{required: true, message: '施工许可证号不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入施工许可证号" v-model="ruleForm.contructionPermitNo"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>规划许可证号</th>
              <td>
                <el-form-item prop="planningLicenseNo" :rules="{required: true, message: '规划许可证号不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入规划许可证号" v-model="ruleForm.planningLicenseNo"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>监理单位</th>
              <td>
                <el-form-item prop="constructionControlOrganName" :rules="{required: true, message: '监理单位不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入监理单位" v-model="ruleForm.constructionControlOrganName"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>设计单位</th>
              <td>
                <el-form-item prop="designOrganName" :rules="{required: true, message: '设计单位不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入设计单位" v-model="ruleForm.designOrganName"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>工程质量监督机构名称</th>
              <td colspan="3">
                <el-form-item prop="superviseOrganName" :rules="{required: true, message: '工程质量监督机构名称不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入工程质量监督机构名称" v-model="ruleForm.superviseOrganName"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remarks">
                  <el-input :maxlength="200" clearable placeholder="请输入备注" type="textarea" :rows="5" v-model="ruleForm.remarks"></el-input>
                  <div class="f-pull-right">{{ruleForm.remarks.length}}/200</div>
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
            <router-link to="/construction-manage/construction-project">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>

    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 上传附件 -->
    <v-upload ref="VUpload" :max="maxlength" @vueUpload="fileUploadRequest"></v-upload>
  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    'v-upload': vuePopupUpload
  },
  data() {
    let self = this;
    // settlementDate
    return {
      pickerOptions0: {
        disabledDate(time) {
          if (self.ruleForm.endDate) {
            return time.getTime() > self.ruleForm.endDate;
          } else {
            if (self.ruleForm.settlementDate) {
              return time.getTime() > self.ruleForm.settlementDate;
            } else {
              return false
            }
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.stratDate) {
            if (self.ruleForm.settlementDate) {
              return time.getTime() < self.ruleForm.stratDate || time.getTime() > self.ruleForm.settlementDate;
            } else {
              return time.getTime() < self.ruleForm.stratDate
            }
          } else {
            if (self.ruleForm.settlementDate) {
              return time.getTime() > self.ruleForm.settlementDate;
            } else {
              return false
            }
          }
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          if (self.ruleForm.endDate) {
            return time.getTime() < self.ruleForm.endDate;
          } else {
            if (self.ruleForm.stratDate) {
              return time.getTime() < self.ruleForm.stratDate;
            } else {
              return false
            }
          }
        }
      },
      maxlength: '5',
      loading: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      ruleForm: {
        buildingOrganName: '', // 建设单位名称
        projectName: '', // 项目名称
        prijectType: '', // 工程类型
        houseStructureName: '', // 房屋结构名称
        houseStructure:[],
        buildAreaOfTotal: '', // 总建筑面积
        areaOfAirDefence: '', // 人防面积
        numberOfFloorsAboveGround: '', // 地上建筑层数
        numberOfFloorsUnderGround: '', // 地下建筑层数
        buildAreaOfAboveGround: '', // 地上建筑面积
        buildAreaOfUnderGround: '', // 地下建筑面积
        stratDate: '', // 开工日期
        projectBudget: '', // 工程预算
        constructionOrganName: '', // 施工单位名称
        endDate: '', // 完工日期
        settlementDate: '', // 决算日期
        settlementMoney: '', // 决算金额
        contructionPermitNo: '', // 施工许可证号
        planningLicenseNo: '', // 规划许可证号
        constructionControlOrganName: '', // 监理单位名称
        designOrganName: '', // 设计单位名称
        superviseOrganName: '', // 工程质量监督机构名称
        remarks: '', // 备注
        attachments: [] // 图片地址
      },
      nameNow: '新增' // 新增修改
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.getSelect();
    // 区分当前页面状态
    if (this.$route.query.buildingProjectId) {
      this.getEditDataRequest();
      this.nameNow = '修改';
    } else {
      this.nameNow = '新增';
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
  },
  methods: {

    //获取建筑结构下拉
    getSelect() {
      this.$axiosGet(API.buildingProject_getHouseStructure, {}).then(res => {
        this.ruleForm.houseStructure = res.data;
      })
    },
    // 新增数据
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            buildingOrganName: this.ruleForm.buildingOrganName, // 建设单位名称
            projectName: this.ruleForm.projectName, // 项目名称
            projectType: this.ruleForm.prijectType, // 工程类型
            houseStructureName: this.ruleForm.houseStructureName, // 房屋结构名称
            buildAreaOfTotal: this.ruleForm.buildAreaOfTotal, // 总建筑面积
            areaOfAirDefence: this.ruleForm.areaOfAirDefence, // 人防面积
            upFloorNumber: this.ruleForm.numberOfFloorsAboveGround, // 地上建筑层数
            downFloorNumber: this.ruleForm.numberOfFloorsUnderGround, // 地下建筑层数
            upArea: this.ruleForm.buildAreaOfAboveGround, // 地上建筑面积
            downArea: this.ruleForm.buildAreaOfUnderGround, // 地下建筑面积
            startDate: DATEFORMAT.dateReturn(this.ruleForm.stratDate), // 开工日期
            projectBudget: this.ruleForm.projectBudget, // 工程预算
            constructionOrganName: this.ruleForm.constructionOrganName, // 施工单位名称
            endDate: DATEFORMAT.dateReturn(this.ruleForm.endDate), // 完工日期
            settlementDate: DATEFORMAT.dateReturn(this.ruleForm.settlementDate), // 决算日期
            settlementMoney: this.ruleForm.settlementMoney, // 决算金额
            constructionPermitNo: this.ruleForm.contructionPermitNo, // 施工许可证号
            planningLicenseNo: this.ruleForm.planningLicenseNo, // 规划许可证号
            constructionControlOrganName: this.ruleForm.constructionControlOrganName, // 监理单位名称
            designOrganName: this.ruleForm.designOrganName, // 设计单位名称
            superviseOrganName: this.ruleForm.superviseOrganName, // 工程质量监督机构名称
            remarks: this.ruleForm.remarks, // 备注
            fileRequestList: (this.ruleForm.attachments) // 图片地址
          }
          let url = '';
          if (this.$route.query.buildingProjectId) {
            // 区分当前页面状态
            url = API.buildingProject_updateBuildingProject;
            this.$set(params, 'id', this.$route.query.buildingProjectId)
          } else {
            url = API.buildingProject_addBuildingProject;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      });
    },
    //修改详情回显
    getEditDataRequest() {
      let params = {
        id: this.$route.query.buildingProjectId
      }
      this.$axiosGet(API.buildingProject_getBuildingProjectDetails, params).then(res => {
        this.ruleForm.buildingOrganName = res.data.buildingOrganName || '';
        this.ruleForm.projectName = res.data.projectName;
        this.ruleForm.prijectType = res.data.projectType;
        this.ruleForm.houseStructureName = res.data.houseStructureName;
        this.ruleForm.buildAreaOfTotal = res.data.buildAreaOfTotal;
        this.ruleForm.areaOfAirDefence = res.data.areaOfAirDefence;
        this.ruleForm.numberOfFloorsAboveGround = res.data.upFloorNumber;
        this.ruleForm.numberOfFloorsUnderGround = res.data.downFloorNumber;
        this.ruleForm.buildAreaOfAboveGround = res.data.upArea;
        this.ruleForm.buildAreaOfUnderGround = res.data.downArea;
        this.ruleForm.stratDate = new Date(res.data.startDate);
        this.ruleForm.projectBudget = res.data.projectBudget || '';
        this.ruleForm.constructionOrganName = res.data.constructionOrganName;
        if (res.data.endDate) {
          this.ruleForm.endDate = new Date(res.data.endDate);
        } else {
          this.ruleForm.endDate = '';
        }
        if (res.data.settlementDate) {
          this.ruleForm.settlementDate = new Date(res.data.settlementDate);
        } else {
          this.ruleForm.settlementDate = '';
        }
        this.ruleForm.settlementMoney = res.data.settlementMoney || '';
        this.ruleForm.contructionPermitNo = res.data.constructionPermitNo;
        this.ruleForm.planningLicenseNo = res.data.planningLicenseNo;
        this.ruleForm.constructionControlOrganName = res.data.constructionControlOrganName;
        this.ruleForm.designOrganName = res.data.designOrganName;
        this.ruleForm.superviseOrganName = res.data.superviseOrganName;
        this.ruleForm.remarks = res.data.remarks || '';
        this.ruleForm.attachments = res.data.fileResponseList || [];
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/construction-manage/construction-project')
        }
      }, 1000)
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
    // 建筑层数表单验证
    checkFloorNumber(rule, value, callback) {
      let message = '';
      if (rule.fullField === 'numberOfFloorsAboveGround') {
        message = '地上建筑层数'
      } else if (rule.fullField === 'numberOfFloorsUnderGround') {
        message = '地下建筑层数'
      }
      if (!value) {
        return callback(new Error(`${message}不能为空`));
      } else {
        if (value === '0') {
          callback();
        } else {
          if (!/^([1-9](\d+)?)$/.test(value)) {
            callback(new Error(`${message}为大于等于零的整数`))
          } else if (value > 1000) {
            callback(new Error(`${message}不能大于一千层`))
          } else {
            callback();
          }
        }
      }
    },
    // 建筑面积表单验证
    builtArea(rule, value, callback) {
      let message = '';
      if (rule.fullField === 'buildAreaOfTotal') {
        message = '总建筑面积'
      } else if (rule.fullField === 'areaOfAirDefence') {
        message = '人防面积'
      } else if (rule.fullField === 'buildAreaOfAboveGround') {
        message = '	地上建筑面积'
      } else if (rule.fullField === 'buildAreaOfUnderGround') {
        message = '地下建筑面积'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`))
      }
    },
    // 取得价格表单验证
    gainThePricePass(rule, value, callback) {
      let message = '';
      if (rule.fullField === 'projectBudget') {
        message = '工程预算'
      } else if (rule.fullField === 'settlementMoney') {
        message = '决算金额'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数的有效数字`))
        } else if (value > 100000) {
          callback(new Error(`${message}不能大于十亿元`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
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
