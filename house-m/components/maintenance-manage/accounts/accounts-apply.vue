<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="房屋维修" :item="['房屋维修']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{paramsType}}维修结果录入</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-padding f-cancel-border">
                <div class="f-hidden">
                  <h2 class="h-table-subtitle" style="padding:5px 0 10px;">
                    <span></span>
                    工程信息</h2>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>申请单位</th>
              <td>
                <el-form-item prop="maintenanceOrganName">
                  <el-select v-model="ruleForm.maintenanceOrganName" filterable clearable placeholder="请选择申请单位" @change="getChange">
                    <el-option v-for="item in maintenCompanyList" :key="item.organId" :label="item.organName" :value="item.organId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>所属计划年度</th>
              <td>
                <el-form-item prop="planYear">
                  <el-select v-model="ruleForm.planYear" filterable clearable placeholder="请选择所属计划年度">
                    <el-option v-for="item in planYearList" :key="item.planYear" :label="item.planYear" :value="item.planYear">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>工程名称</th>
              <td>
                <el-form-item prop="projectName">
                  <el-input placeholder="请输入工程名称" maxlength="40" v-model="ruleForm.projectName" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>工程级别</th>
              <td>
                <el-form-item prop="projectLevel">
                  <el-select v-model="ruleForm.projectLevel" filterable clearable placeholder="请选择工程级别">
                    <el-option v-for="item in projectLevelList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>工程类型</th>
              <td colspan="3">
                <el-form-item prop="projectType">
                  <el-select v-model="ruleForm.projectType" placeholder="请选择工程类型">
                    <el-option v-for="item in projectTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>工程位置</th>
              <td colspan="3">
                请选择本次维修所涉及到的房间，精确到房间号
                <span>
                  <button class="u-bread-btn" @click.prevent="openDilog">选择房间</button>
                </span>
              </td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3">
                <table class="h-table-info">
                  <tr>
                    <td>院落</td>
                    <td>楼座</td>
                    <td>房间</td>
                  </tr>
                  <tr v-for="(item,index) in list" :key="index">
                    <td>{{item.courtyardName}}</td>
                    <td>{{item.floorName}}</td>
                    <td>{{item.label}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr v-show="isProjectShow">
              <td style="color:#f56c6c;font-size: 12px;" colspan="4">请选择工程位置</td>
            </tr>
          </table>
          <div class="f-margin-upd">
            <div class="f-hidden">
              <h2 class="h-table-subtitle " style="padding:0 0 2px 0;">
                <span></span>
                <i class="f-color-red">*</i>办公用房维修改造结果</h2>
            </div>
          </div>
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>开工日期</th>
              <td>
                <el-form-item prop="commencementDate">
                  <el-date-picker v-model="ruleForm.commencementDate" type="date" placeholder="请选择开工日期" :picker-options="pickerOptions0" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>竣工日期</th>
              <td>
                <el-form-item prop="completionDate">
                  <el-date-picker v-model="ruleForm.completionDate" type="date" placeholder="请选择竣工日期" :picker-options="pickerOptions1" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>中标单位</th>
              <td>
                <el-form-item prop="winBiddingOrganName">
                  <el-input placeholder="请输入中标单位" maxlength="40" v-model="ruleForm.winBiddingOrganName" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>采购方式</th>
              <td>
                <el-form-item prop="winBiddingType">
                  <el-select v-model="ruleForm.winBiddingType" placeholder="请选择采购方式">
                    <el-option v-for="item in sysDicBiddingTypeResponseList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>资质等级</th>
              <td>
                <el-form-item prop="levelOfQualification">
                  <el-select v-model="ruleForm.levelOfQualification" filterable clearable placeholder="请输入资质等级">
                    <el-option label="一级" value="ONE">
                    </el-option>
                    <el-option label="二级" value="TWO">
                    </el-option>
                    <el-option label="三级" value="THREE">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>中标金额</th>
              <td>
                <el-form-item prop="winBiddingMoney">
                  <el-input placeholder="请输入中标金额" v-model="ruleForm.winBiddingMoney" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>立项批复号</th>
              <td>
                <el-form-item prop="projectApprovalNo">
                  <el-input placeholder="请输入立项批复号" maxlength="40" v-model="ruleForm.projectApprovalNo" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>施工合同号</th>
              <td>
                <el-form-item prop="constructionContractNo">
                  <el-input placeholder="请输入施工合同号" maxlength="40" v-model="ruleForm.constructionContractNo" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>施工许可证号</th>
              <td>
                <el-form-item prop="constructionPermitNo">
                  <el-input placeholder="请输入施工许可证号" maxlength="40" v-model="ruleForm.constructionPermitNo" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>规划许可证号</th>
              <td>
                <el-form-item prop="planningPermitNo">
                  <el-input placeholder="请输入规划许可证号" maxlength="40" v-model="ruleForm.planningPermitNo" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>设计单位</th>
              <td>
                <el-form-item prop="designOrganName">
                  <el-input placeholder="请输入设计单位" maxlength="40" v-model="ruleForm.designOrganName" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>施工单位</th>
              <td>
                <el-form-item prop="constructionOrganName">
                  <el-input placeholder="请输入施工单位" maxlength="40" v-model="ruleForm.constructionOrganName" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>监理单位</th>
              <td>
                <el-form-item prop="supervisionOrganName">
                  <el-input placeholder="请输入监理单位" maxlength="40" v-model="ruleForm.supervisionOrganName" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>工程质量监督机构名称</th>
              <td>
                <el-form-item prop="projectQualitySupervisionName">
                  <el-input placeholder="请输入工程质量监督机构名称" maxlength="40" v-model="ruleForm.projectQualitySupervisionName" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>决算日期</th>
              <td>
                <el-form-item prop="closingDate">
                  <el-date-picker v-model="ruleForm.closingDate" type="date" placeholder="请选择决算日期" :picker-options="pickerOptions2" style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>决算金额</th>
              <td>
                <el-form-item prop="closingMoney">
                  <el-input placeholder="请输入决算金额" maxlength="40" v-model="ruleForm.closingMoney" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-input type="textarea" :rows="4" :maxlength="200" placeholder="请输入备注" v-model="ruleForm.remark">
                </el-input>
                <div class="f-text-right">{{ruleForm.remark.length}}/200</div>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="f-cancel-padding f-cancel-border">
                <div class="f-hidden">
                  <h2 class="h-table-subtitle" style="padding:15px 0 10px;">
                    <span></span>
                    附件</h2>
                </div>
              </td>
            </tr>
            <tr>
              <th>相关附件</th>
              <td colspan="3">
                <el-button class="u-upload-btn" @click="emptyFileJson('RELATEATTACHMENTS')">
                  <i class="iconfont icon-daochu"></i>上传附件
                </el-button>
                <ul>
                  <li style="display: block;" v-for=" (item, index) in ruleForm.relateAttachments" :key="index">{{index+1}}、{{item.name}}
                    <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                    <a target="_blank" :href="item.url">预览</a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td colspan="3" class="f-cancel-padding f-cancel-border">
                <div class="f-hidden">
                  <h2 class="h-table-subtitle" style="padding:15px 0 10px;">
                    <span></span>
                    维修结果照片</h2>
                </div>
              </td>
            </tr>
            <tr>
              <th>维修前照片</th>
              <td colspan="3" class="f-text-right ">
                <v-uploadPicture v-model="ruleForm.maintainBeforePics" title="维修前照片" max="5" maxSize="5"></v-uploadPicture>
              </td>
            </tr>
            <tr>
              <th>维修后照片</th>
              <td colspan="4" class="f-text-right">
                <v-uploadPicture v-model="ruleForm.maintainAfterPics" title="维修后照片" max="5" maxSize="5"></v-uploadPicture>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/maintenance-manage/accounts-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getSaveDataRequest">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <el-dialog title="选择房间" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" max-height="500px">
      <el-form :model="ruleFormRoom" :rules="rulesForm" ref="ruleFormRoom">
        <div style="height: 260px;overflow: auto;">
          <el-tree :accordion="true" :data="roomList" :default-expanded-keys="roomIdList" @check="getCheckedNodes" ref="roomList" show-checkbox node-key="value"></el-tree>
        </div>
        <div style="color:#f56c6c;font-size: 12px;" v-show="isRequestRoomPass">{{isRequestRoomMessage}}</div>
        <div style="color:#f56c6c;font-size: 12px;" v-show="isChoseRoom">{{isChoseRoomMessage}}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="closeDilog">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveRoom">保存</el-button>
      </div>
    </el-dialog>
    <!--保存确认弹框 -->
    <el-dialog title="提示" :visible.sync="savedialogVisible" width="30%">
      <span>请先选择申请单位</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savedialogVisible = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="savedialogVisible = false" :loading="loading">确定</el-button>
      </span>
    </el-dialog>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/doc/docx/xls/xlsx/ppt/pptx/pdf/zip/rar"></v-upload>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow " :isBol="isBol" :message="message " @click="YPromptClick "></Y-Prompt>
  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
import { setTimeout } from 'timers';
export default {
  components: {
    'v-upload': vuePopupUpload,
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    let self = this;
    let commencementDate = (rule, value, callback) => {  // 开工日期验证规则
      if (value) {
        if (self.ruleForm.completionDate && value > self.ruleForm.completionDate) {
          callback(new Error('开工日期不能大于竣工日期'))
        } else if (!self.ruleForm.completionDate) {
          if (self.ruleForm.closingDate && value > self.ruleForm.closingDate) {
            callback(new Error('开工日期不能大于决算日期'))
          } else if (!self.ruleForm.closingDate) {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback(new Error('开工日期不能为空'))
      }
    }
    let completionDate = (rule, value, callback) => {
      if (value) {
        if (self.ruleForm.closingDate) {
          if (value > self.ruleForm.closingDate) {
            callback(new Error('竣工日期不能大于决算日期'))
          } else {
            callback()
          }
        }
        if (self.ruleForm.commencementDate) {
          if (value < self.ruleForm.commencementDate) {
            callback(new Error('竣工日期不能大于开工日期'))
          } else {
            callback();
          }
        }
      } else {
        callback(new Error('竣工日期不能为空'));
      }
    }
    let closingDate = (rule, value, callback) => {
      if (value) {
        if (self.ruleForm.completionDate && value < self.ruleForm.completionDate) {
          callback(new Error('决算日期不能小于竣工日期'))
        } else if (!self.ruleForm.completionDate) {
          if (self.ruleForm.commencementDate && value < self.ruleForm.commencementDate) {
            callback(new Error('决算日期不能小于开工日期'))
          } else if (!self.ruleForm.commencementDate) {
            callback()
          }
        }
        else {
          callback()
        }
      }
      else {
        callback(new Error('决算日期不能为空'))
      }
    }

    let money = (rule, value, callback) => {
      let message = '';
      if (rule.field == 'closingMoney') {
        message = '决算金额';
      } else if (rule.field == 'winBiddingMoney') {
        message = '中标金额'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 10000000) {
          callback(new Error(`${message}不能大于10亿元`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`))
      }
    }
    return {
      loading: false,
      maxLength: '5',
      paramsType: '新增',
      planYear: '', //计划年度
      dialogFormVisible: false,
      savedialogVisible: false,
      YPromptShow: false, // 提示对话框
      ruleFormRoom: {},
      rulesForm: {},
      getKeys: [], //获取树节点集合
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      organId: '', //被监管单位id
      keepOrganName: '', //被监管单位名称
      maintenCompanyList: [], //维修单位集合
      projectTypeList: [], //工程类型集合
      projectLevelList: [], //工程级别集合
      planYearList: [], //计划年度集合
      roomIdList: [], // 修改获取的房间ID集合
      list: [],
      isProjectMessage: true, //是否选择房间信息
      roomDetailList: [], //房屋信息集合
      isChoseRoom: true, // 是否选择了房间
      isChoseRoomMessage: '', // 是否选择了房间验证信息
      isRequestRoomPass: false, // 房屋信息验证是否通过
      isRequestRoomMessage: '', // 房屋信息验证信息
      isProjectShow: false,
      isCheckRoom: false,
      treeId: '', //回显树型菜单id
      treeName: '',//回显树型菜单单位
      roomList: [], // 房间待选数据集合
      roomCheckedList: [], // 已选择的数据集合
      maintenanceParameterId: '', //维修台账id
      maintenanceDetail: {}, //详情回显
      ruleForm: {
        maintenanceOrganName: '', //维修单位
        winBiddingOrganName: '', //中标单位
        planYear: '', //计划年度
        projectName: '', //工程名称
        projectLevel: '', //工程级别
        projectType: '', //工程类型
        planningPermitNo: '', //规划许可证号
        constructionPermitNo: '',//施工许可证号
        designOrganName: '',//设计单位
        constructionOrganName: '', //施工单位
        supervisionOrganName: '', //监理单位
        projectQualitySupervisionName: '', //工程质量监督机构名称
        maintenanceManufacturer: '', // 维修厂家
        winBiddingType: '', // 中标方式
        levelOfQualification: '', // 资质等级
        winBiddingMoney: '', // 中标金额
        projectApprovalNo: '', // 立项批复号
        constructionContractNo: '', // 施工合同号
        commencementDate: '', // 开工日期
        completionDate: '', // 竣工日期
        closingDate: '', // 决算日期
        closingMoney: '', // 决算金额
        relateAttachments: [], // 相关附件
        maintainBeforePics: [], // 维修前照片
        maintainAfterPics: [], // 维修后照片
        remark: '' // 备注
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        commencementDate: [
          { required: true, validator: commencementDate, trigger: 'change' },
        ],
        completionDate: [
          { required: true, validator: completionDate, trigger: 'change' },
        ],
        planYear: [
          { required: true, message: '请选择所属年度计划', tirgger: 'change' }
        ],
        closingDate: [
          { required: true, validator: closingDate, trigger: 'change' },
        ],
        winBiddingMoney: [{ required: true, validator: money, trigger: 'change' }],
        closingMoney: [{ required: true, validator: money, trigger: 'change' }],
        winBiddingType: [
          { required: true, message: '请选择采购方式', tirgger: 'change' }
        ],
        winBiddingOrganName: [
          { required: true, message: '中标单位不能为空', tirgger: 'change' }
        ],
        maintenanceOrganName: [
          { required: true, message: '申请单位不能为空', tirgger: 'change' }
        ],
        projectName: [
          { required: true, message: '工程名称不能为空', tirgger: 'change' }
        ],
        projectLevel: [
          { required: true, message: '工程级别不能为空', tirgger: 'change' }
        ],
        projectType: [
          { required: true, message: '工程类型不能为空', tirgger: 'change' }
        ],
        levelOfQualification: [
          { required: true, message: '资质等级不能为空', tirgger: 'change' }
        ],
        designOrganName: [
          { required: true, message: '设计单位不能为空', tirgger: 'change' }
        ],
        constructionOrganName: [
          { required: true, message: '施工单位不能为空', tirgger: 'change' }
        ],
        supervisionOrganName: [
          { required: true, message: '监理单位不能为空', tirgger: 'change' }
        ],
        projectQualitySupervisionName: [
          { required: true, message: '工程质量监督机构名称', tirgger: 'change' }
        ],
        projectApprovalNo: [
          { required: true, message: '立项批复号不能为空', tirgger: 'change' }
        ],
        constructionContractNo: [
          { required: true, message: '施工合同号不能为空', tirgger: 'change' }
        ],
        constructionPermitNo: [
          { required: true, message: '施工许可证号不能为空', tirgger: 'change' }
        ],
        planningPermitNo: [
          { required: true, message: '规划许可证号不能为空', tirgger: 'change' }
        ],
      },
      pickerOptions0: {
        disabledDate(time) {
          if (self.ruleForm.completionDate) {
            return time.getTime() > self.ruleForm.completionDate;
          } else {
            if (self.ruleForm.closingDate) {
              return time.getTime() > self.ruleForm.closingDate;
            } else {
              return time.getTime() > Date.now();
            }
          }

        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.closingDate) {
            if (self.ruleForm.commencementDate) {
              return time.getTime() > self.ruleForm.closingDate || time.getTime() < self.ruleForm.commencementDate;
            } else {
              return time.getTime() < self.ruleForm.closingDate || time.getTime() > Date.now();
            }
          } else {
            if (self.ruleForm.commencementDate) {
              return time.getTime() < self.ruleForm.commencementDate || time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now();
            }
          }
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          if (self.ruleForm.completionDate) {
            return time.getTime() < self.ruleForm.completionDate || time.getTime() > Date.now();
          } else {
            if (self.ruleForm.commencementDate) {
              return time.getTime() < self.ruleForm.commencementDate || time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now()
            }
          }
        }
      },
      fileType: '', // 上传相关附件还是维修结果照片
      sysDicBiddingTypeResponseList: [], // 招标方式
      maintainPlanApplyResponse: {},
      budgetDetailScheduleList: [],
      otherAttachmentList: []
    };
  },
  activated() {
    this.getSelectData();
    if (this.$route.params.type === 'edit') {
      this.paramsType = '修改';
      if (this.$route.query.id) {
        this.maintenanceParameterId = this.$route.query.id;
      }
      this.getEditDataRequest();
    } else {
      this.$refs.ruleForm.resetFields();
      this.paramsType = '新增';
    }
  },
  deactivated() {
    this.list = [];
    this.ruleForm.relateAttachments = [];
    this.ruleForm.remark = '';
    this.ruleForm.maintainBeforePics = [];
    this.ruleForm.maintainAfterPics = [];
    this.$refs.ruleForm.resetFields();
  },
  mounted() {
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    },
    areaId() {
      return this.$store.state.mainData.areaId  //登录单位id
    },
    userId() {
      return this.$store.state.mainData.userId  //登录单位id
    },
    organName() {
      return this.$store.state.mainData.organName  //登录单位名称
    },
  },
  watch: {
    'ruleForm.maintenanceOrganName': function (value) {
      if (!value) {
        this.keepOrganName = '';
        this.roomList = [];
        this.ruleForm.maintenanceOrganName = '';
        this.list = [];
        this.planYearList = [];
        this.ruleForm.planYear = '';

      } else {
        this.getHouseData();
      }
    }
  },

  methods: {
    // 表单验证
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        if (this.fileType == 'RELATEATTACHMENTS') {
          this.ruleForm.relateAttachments.push({
            name: value.name,
            url: value.url,
          })
        } else if (this.fileType == 'MAINTAINBEFOREPICS') {
          this.ruleForm.maintainBeforePics.push({
            name: value.name,
            url: value.url,
          })
        } else {
          this.ruleForm.maintainAfterPics.push({
            name: value.name,
            url: value.url,
          })
        }
      })
    },
    deleteFileNameList(index) { // 删除附件
      if (this.fileType == 'RELATEATTACHMENTS') {
        this.ruleForm.relateAttachments.splice(index, 1)
        this.maxLength = 5 - this.ruleForm.relateAttachments.length
      } else if (this.fileType == 'MAINTAINBEFOREPICS') {
        this.ruleForm.maintainBeforePics.splice(index, 1)
        this.maxLength = 5 - this.ruleForm.maintainBeforePics.length
      } else {
        this.ruleForm.maintainAfterPics.splice(index, 1)
        this.maxLength = 5 - this.ruleForm.maintainAfterPics.length
      }
    },
    emptyFileJson(fileType) {
      this.fileType = fileType;
      this.$refs.VUpload.openModal()
    },
    getSave() { },
    openDilog() {
      if (this.ruleForm.maintenanceOrganName === '') {
        this.savedialogVisible = true;
      } else {
        this.dialogFormVisible = true;
        if (this.$route.params.type === 'edit') {
          this.organId = this.treeId;
          this.keepOrganName = this.treeName;
          this.getHouseData();
        } else {
          this.getHouseData();
        }
        let roomValueList = [];
        this.list.forEach((item, index) => {
          roomValueList.push(item.value)
        })
        setTimeout(() => {
          this.setCheckedNodes(roomValueList);
        }, 500)
      }
    },
    setCheckedNodes(roomValueList) {
      this.$refs.roomList.setCheckedKeys(roomValueList)
    },
    closeDilog() {
      this.dialogFormVisible = false;
    },
    saveRoom() {
      this.dialogFormVisible = false;
      this.roomDetailList = this.roomCheckedList;
      // let checkNodeList = [];
      let courtYardList = [];
      let buildingList = [];
      let roomsList = [];
      if (this.roomDetailList) {
        this.roomDetailList.forEach((item, index) => {
          if (item.typeFlag === 'courtyard') {
            courtYardList.push(item);
          } else if (item.typeFlag === 'floor') {
            buildingList.push(item);
          } else if (item.typeFlag === 'room') {
            roomsList.push(item);
          }
          this.list = roomsList;
          this.isProjectShow = false;
        })
      }
      if (this.roomCheckedList == '') {
        this.list = [];
      }
    },
    // 获取下拉选
    getSelectData() {
      this.$axiosGet(API.manageMaintain_queryOrderStatusAndBiddingType, {}).then(res => {
        this.sysDicBiddingTypeResponseList = res.data.sysDicBiddingTypeResponseList;
        this.maintenCompanyList = res.data.organBaseList;
        this.projectTypeList = res.data.sysProjectTypeResponseList;
        this.projectLevelList = res.data.sysProjectLevelResponseList; //工程级别
      })
    },
    //获取年度计划
    getplanYear() {
      if (this.ruleForm.maintenanceOrganName) {
        this.organId = this.ruleForm.maintenanceOrganName;
      } else {
        this.organId = ''
      }

      let params = {
        maintainOrganId: this.organId
      }
      this.$axiosGet(API.manageMaintain_queryPlanYear, params).then(res => {
        if (res.data) {
          this.planYearList = res.data;
        } else {
          this.planYearList = [];
        }
        if (this.planYearList == '') {
          this.ruleForm.planYear = ''
        }
      })
    },
    getChange(val) {
      this.getplanYear();
      if (this.maintenCompanyList.length > 0) {
        this.maintenCompanyList.forEach((item, index) => {
          if (val == item.organId) {
            this.keepOrganName = item.organName;
            this.getHouseData();
          }
        })
      }
    },
    getHouseData() {
      let params = {
        maintainOrganId: this.organId,
        maintainOrganName: this.keepOrganName
      }
      this.$axiosGet(API.manageMaintain_queryCourtyardAndFloorAndStoreysAndRooms, params).then(res => {
        this.roomList = [res.data] || [];
      })
    },
    // 获取房屋选择的节点
    getCheckedNodes() {
      let checkNodeList = [];
      let courtYardList = [];
      let buildingList = [];
      let roomsList = [];
      checkNodeList = this.$refs.roomList.getCheckedNodes(false, true);
      this.roomCheckedList = checkNodeList;
      checkNodeList.forEach((item, index) => {
        if (item.typeFlag === 'courtyard') {
          courtYardList.push(item);
        } else if (item.typeFlag === 'floor') {
          buildingList.push(item);
        } else if (item.typeFlag === 'room') {
          roomsList.push(item);
        }
      })
      if (roomsList.length > 0) {
        this.isChoseRoom = false;
      } else {
        this.isChoseRoom = true;
        this.isChoseRoomMessage = '房屋选择时需勾选到具体房间';
      }
    },
    // 修改获取详情数据
    getEditDataRequest() {
      let params = {
        maintainParameterId: this.maintenanceParameterId
      }
      this.$axiosGet(API.manageMaintain_maintainParameterDetail, params).then(res => {
        if (res.result == 'success') {
          this.maintenanceDetail = res.data.maintainParameterResponse;
          this.ruleForm.maintenanceOrganName = this.maintenanceDetail.maintainOrganName;
          this.ruleForm.planYear = this.maintenanceDetail.planYear;
          this.ruleForm.projectName = this.maintenanceDetail.projectName;
          this.ruleForm.projectLevel = this.maintenanceDetail.projectLevel;
          this.ruleForm.projectType = this.maintenanceDetail.projectType;
          this.ruleForm.commencementDate = this.maintenanceDetail.commencementDate.substr(0, 10);
          this.ruleForm.completionDate = this.maintenanceDetail.completionDate.substr(0, 10);
          this.ruleForm.winBiddingOrganName = this.maintenanceDetail.winBiddingOrganName;
          this.ruleForm.winBiddingMoney = this.maintenanceDetail.winBiddingMoney;
          this.ruleForm.winBiddingType = this.maintenanceDetail.winBiddingType;
          this.ruleForm.projectApprovalNo = this.maintenanceDetail.projectApprovalNo;
          this.ruleForm.levelOfQualification = this.maintenanceDetail.levelOfQualification;
          this.ruleForm.constructionContractNo = this.maintenanceDetail.constructionContractNo;
          this.ruleForm.planningPermitNo = this.maintenanceDetail.planningPermitNo;
          this.ruleForm.designOrganName = this.maintenanceDetail.designOrganName;
          this.ruleForm.constructionOrganName = this.maintenanceDetail.constructionOrganName;
          this.ruleForm.supervisionOrganName = this.maintenanceDetail.supervisionOrganName;
          this.ruleForm.projectQualitySupervisionName = this.maintenanceDetail.projectQualitySupervisionName;
          this.ruleForm.closingDate = this.maintenanceDetail.closingDate.substr(0, 10);
          this.ruleForm.closingMoney = this.maintenanceDetail.closingMoney;
          this.ruleForm.remark = this.maintenanceDetail.remark;
          this.ruleForm.constructionPermitNo = this.maintenanceDetail.constructionPermitNo;
          this.ruleForm.relateAttachments = res.data.fileList;
          this.ruleForm.maintainBeforePics = res.data.beforePicList;
          this.ruleForm.maintainAfterPics = res.data.afterPicList;
          this.treeId = this.maintenanceDetail.organId;
          this.treeName = this.maintenanceDetail.organName;
          res.data.maintainHouseDetailList.forEach((item, index) => {
            this.list.push({
              children: null,
              courtyardName: item.courtyardName,
              disabled: null,
              floorName: item.floorName,
              label: item.roomNo,
              typeFlag: item.typeFlag,
              value: item.roomId
            })
          });
          // this.budgetDetailScheduleList = res.data.budgetDetailScheduleList || [];
          // this.otherAttachmentList = res.data.otherAttachmentList || [];
          // this.maintainPlanApplyResponse = res.data.maintainPlanApplyResponse;
          // if (res.data.maintainPlanApplyResponse) {
          //   this.planYear = DATEFORMAT.dateReturnY(new Date(res.data.maintainPlanApplyResponse.planYear));
          // }
        }
      })
    },
    //提交表单
    getSaveDataRequest() {
      if (this.list.length === 0) {
        this.isProjectShow = true;
        this.isCheckRoom = false;
        this.isChoseRoom = true;
        this.isChoseRoomMessage = '房屋信息不能为空';
      }
      let roomsId = [];
      if (this.list.length > 0) {
        this.isProjectShow = false;
        this.isCheckRoom = true;
        this.list.forEach((item, index) => {
          roomsId.push(item.value)
        })
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid && this.isCheckRoom) {
          let params = {
            areaId: this.areaId, //地区id
            organId: this.loginOrganId, //单位id
            organName: this.organName, //单位名称
            // createUserId: this.userId, //用户id
            roomIdList: roomsId, //房间id
            maintainOrganId: this.ruleForm.maintenanceOrganName, //维修单位id
            maintainOrganName: this.keepOrganName || this.treeName, //维修单位名称
            planYear: FORMATGET.formatGET(this.ruleForm.planYear).substr(0, 4), //年度计划            
            projectName: this.ruleForm.projectName, //工程名称
            projectLevel: this.ruleForm.projectLevel, //工程级别
            projectType: this.ruleForm.projectType, //工程类型
            winBiddingOrganName: this.ruleForm.winBiddingOrganName, //中标单位
            winBiddingType: this.ruleForm.winBiddingType, // 中标方式
            levelOfQualification: this.ruleForm.levelOfQualification, // 资质等级
            winBiddingMoney: this.ruleForm.winBiddingMoney, // 中标金额
            projectApprovalNo: this.ruleForm.projectApprovalNo, // 立项批复号
            constructionContractNo: this.ruleForm.constructionContractNo, // 施工合同号
            constructionPermitNo: this.ruleForm.constructionPermitNo, //施工许可证号
            planningPermitNo: this.ruleForm.planningPermitNo, //规划许可证号
            designOrganName: this.ruleForm.designOrganName, //设计单位
            constructionOrganName: this.ruleForm.constructionOrganName, //施工单位
            supervisionOrganName: this.ruleForm.supervisionOrganName, //监理单位
            projectQualitySupervisionName: this.ruleForm.projectQualitySupervisionName, //工程质量监督机构名称            
            commencementDate: FORMATGET.formatGET(this.ruleForm.commencementDate).substr(0, 10), // 开工日期
            completionDate: FORMATGET.formatGET(this.ruleForm.completionDate).substr(0, 10), // 竣工日期
            closingDate: FORMATGET.formatGET(this.ruleForm.closingDate).substr(0, 10), // 决算日期
            closingMoney: this.ruleForm.closingMoney, // 决算金额
            remark: this.ruleForm.remark,
            fileRequestList: this.ruleForm.relateAttachments, // 相关附件
            beforePicRequestList: this.ruleForm.maintainBeforePics, // 维修前照片
            afterPicRequestList: this.ruleForm.maintainAfterPics,  //维修后照片
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            this.$set(params, 'id', this.maintenanceParameterId)
            url = API.manageMaintain_updateMaintainParameter;
          } else {
            url = API.manageMaintain_doMaintainParameter;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.loading = false;
            this.YPromptShow = true;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.push({
          path: '/maintenance-manage/accounts-list'
        })
        this.$refs.ruleForm.resetFields();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
.el-dialog__body {
  height: 500px;
}
</style>