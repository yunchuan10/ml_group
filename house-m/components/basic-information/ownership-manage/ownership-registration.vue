<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" width="950px" :visible.sync="carDetailShow" :show-close="false" @close="clearRules">
      <div class="u-detail-dialog-header" slot="title">
        <span>权属登记</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" id="ownership-registration">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>房屋信息</th>
                <td colspan="3">
                  <div style="max-height: 250px;overflow: auto;">
                    <el-tree :accordion="true" :data="roomList" :default-expanded-keys="roomIdList" @check="getCheckedNodes" ref="roomList" show-checkbox node-key="value"></el-tree>
                  </div>
                  <div style="color:#f56c6c;font-size: 12px;" v-show="isRequestRoomPass">{{isRequestRoomMessage}}</div>
                  <div style="color:#f56c6c;font-size: 12px;" v-show="isChoseRoom">{{isChoseRoomMessage}}</div>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border f-cancel-padding-left">
                  <h2 class="h-table-subtitle">
                    <span></span>房屋情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">房屋坐落位置</th>
                <td colspan="3">{{courtyardAddress}}</td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>房屋取得方式</th>
                <td>
                  <el-form-item prop="houseGetWay">
                    <el-select v-model="ruleForm.houseGetWay" @change="changeHouseWay" placeholder="请选择房屋取得方式">
                      <el-option v-for="(item, index) in houseAcquisitionMode" :key="index" :value="item.dicValue" :label="item.dicValue"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <th class="f-text-right">房屋价值</th>
                <td>
                  <el-form-item prop="roomPrice">
                    <el-input v-model="ruleForm.roomPrice" clearable placeholder="请输入房屋价值">
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>房屋面积</th>
                <td>
                  <el-form-item prop="roomArea">
                    <el-input v-model="ruleForm.roomArea" clearable placeholder="请输入房屋面积"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">建筑结构</th>
                <td>{{houseStructure}}</td>
              </tr>
              <tr>
                <th class="f-text-right">竣工日期</th>
                <td>{{completionDate}}</td>
                <th class="f-text-right">投入使用日期</th>
                <td>{{putUseDate?putUseDate.substr(0, 10):''}}</td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border">
                  <h2 class="h-table-subtitle">
                    <span></span>土地情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>宗地面积</th>
                <td>
                  <el-form-item prop="parcelArea">
                    <el-input v-model="ruleForm.parcelArea" clearable placeholder="请输入宗地面积"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">土地取得方式</th>
                <td>
                  <el-form-item prop="landGetWay">
                    <el-select v-model="ruleForm.landGetWay" clearable placeholder="请选择土地取得方式">
                      <el-option v-for="(item, index) in landAcquisitionMode" :key="index" :value="item.dicValue" :label="item.dicValue"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">土地价值</th>
                <td>
                  <el-form-item prop="landPrice">
                    <el-input v-model="ruleForm.landPrice" clearable placeholder="请输入土地价值">
                      <template slot="append">万元</template>
                    </el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">取得日期</th>
                <td>
                  <el-form-item prop="getDate">
                    <el-date-picker v-model="ruleForm.getDate" type="date" placeholder="选择取得日期" :picker-options="pickerOptions0"></el-date-picker>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">采购组织形式</th>
                <td colspan="3">
                  <el-form-item prop="procurementOrganization">
                    <el-select v-model="ruleForm.procurementOrganization" clearable placeholder="请选择采购组织形式">
                      <el-option v-for="(item, index) in procurementOrganizationForm" :key="index" :value="item.dicValue" :label="item.dicValue"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border">
                  <h2 class="h-table-subtitle" v-if="ruleForm.houseGetWay !== '租借'">
                    <span></span>产权登记情况</h2>
                  <h2 class="h-table-subtitle" v-else>
                    <span></span>租借登记情况</h2>
                </td>
              </tr>
              <tr v-if="ruleForm.houseGetWay !== '租借'">
                <th class="f-text-right">产权是否办理</th>
                <td colspan="3">
                  <el-form-item prop="handProperty">
                    <el-radio-group @change="clearReason" v-model="ruleForm.handProperty">
                      <el-radio label="已办理，且两证合一">已办理，且两证合一</el-radio>
                      <el-radio label="已办理，且两证分离">已办理，且两证分离</el-radio>
                      <el-radio label="产权未办理">产权未办理</el-radio>
                      <el-radio label="仅办理房产证">仅办理房产证</el-radio>
                      <el-radio label="仅办理土地证">仅办理土地证</el-radio>
                      <el-radio label="产权待界定">产权待界定</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="ruleForm.handProperty !== '产权待界定' && ruleForm.houseGetWay !== '租借'">
                <th class="f-text-right">{{ruleForm.handProperty === '产权未办理'?'未办证原因':'登记日期'}}</th>
                <td v-if="ruleForm.handProperty === '产权未办理'" :colspan="ruleForm.handProperty !== '产权未办理'?'':'3'">
                  <el-form-item prop="noLicenseReason">
                    <el-input v-model="ruleForm.noLicenseReason" clearable placeholder="请输入未办证原因"></el-input>
                  </el-form-item>
                </td>
                <td v-else :colspan="ruleForm.handProperty !== '产权未办理'?'':'3'">
                  <el-form-item prop="registrationData">
                    <el-date-picker v-model="ruleForm.registrationData" type="date" placeholder="选择登记日期" :picker-options="pickerOptions0"></el-date-picker>
                  </el-form-item>
                </td>
                <th class="f-text-right" v-if="ruleForm.handProperty !== '产权未办理'">
                  <i class="f-color-red">*</i>产权单位</th>
                <td v-if="ruleForm.handProperty !== '产权未办理'">
                  <el-form-item prop="organName">
                    <el-select v-model="ruleForm.organName" clearable placeholder="请选择产权单位">
                      <el-option v-for="(item, index) in propertyOrgan" :key="index" :value="item.organName" :label="item.organName"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="(ruleForm.handProperty === '已办理，且两证分离' || ruleForm.handProperty === '仅办理房产证' || ruleForm.handProperty === '仅办理土地证') && ruleForm.houseGetWay !== '租借'">
                <th class="f-text-right">房产证号</th>
                <td>
                  <el-form-item prop="roomLicense">
                    <el-input :maxlength="40" v-model="ruleForm.roomLicense" clearable placeholder="请输入房产证号"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">土地证号</th>
                <td>
                  <el-form-item prop="lineLicense">
                    <el-input :maxlength="40" v-model="ruleForm.lineLicense" clearable placeholder="请输入土地证号"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="ruleForm.handProperty === '已办理，且两证合一' && ruleForm.houseGetWay !== '租借'">
                <th class="f-text-right">不动产证号</th>
                <td colspan="3">
                  <el-form-item prop="realEstate">
                    <el-input :maxlength="40" v-model="ruleForm.realEstate" clearable placeholder="请输入不动产证号"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="isReasonShow">
                <th class="f-text-right">
                  <i class="f-color-red">*</i>情况说明</th>
                <td colspan="3">
                  <el-form-item prop="reason">
                    <el-input clearable v-model="ruleForm.reason" placeholder="请输入情况说明" type="textarea" :maxlength="200"></el-input>
                  </el-form-item>
                  <div class="f-text-right">{{ruleForm.reason.length}}/200</div>
                </td>
              </tr>
              <tr v-if="ruleForm.houseGetWay === '租借'">
                <th class="f-text-right">租借日期</th>
                <td colspan="3">
                  <el-form-item prop="rentDate">
                    <el-date-picker v-model="ruleForm.rentDate" type="date" placeholder="选择租借日期" :picker-options="pickerOptions0"></el-date-picker>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th>上传图片</th>
                <td colspan="3">
                  <v-uploadPicture v-model="ruleForm.domains" title="权属信息" max="5" maxSize="5"></v-uploadPicture>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </div>
      <div class="el-dialog__footer">
        <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveDate" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
import { setTimeout } from 'timers';
export default {
  components: {
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    let self = this;
    let roomPrice = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'roomPrice') {
        message = '房屋价值'
      } else {
        message = '土地价值'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 100000) {
          callback(new Error(`${message}不能大于10亿元`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    let roomArea = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'roomArea') {
        message = '房屋面积'
      } else {
        message = '宗地面积'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于1百万平方米`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`));
      }
    }
    return {
      loading: false, // 是否是加载
      carDetailShow: false, // 弹出框开关
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      isReasonShow: false,
      ruleForm: {
        houseGetWay: '', // 房屋获取方式
        landGetWay: '', // 土地获取方式
        procurementOrganization: '', // 采购组织形式
        organName: '', // 产权单位
        roomPrice: '', // 房间价值
        roomArea: '', // 房间面积
        parcelArea: '', // 宗地面积
        landPrice: '', // 土地价值
        getDate: '', // 取得日期
        rentDate: '', // 租赁日期
        handProperty: '已办理，且两证合一', // 产权是否办理
        registrationData: '', // 登记日期
        realEstate: '', // 不动产单号
        roomLicense: '', // 房产证单号
        lineLicense: '', // 土地证单号
        noLicenseReason: '', // 未办证原因
        domains: [], // 上传图片
        reason: '' // 情况说明
      },
      courtyardAddress: '', // 坐落位置
      houseStructure: '', // 建筑结构
      completionDate: '', // 竣工日期
      putUseDate: '', // 投入使用日期
      rules: {
        roomPrice: [
          { validator: roomPrice, trigger: 'change' }
        ],
        roomArea: [
          { validator: roomArea, trigger: 'change' }
        ],
        parcelArea: [
          { validator: roomArea, trigger: 'change' }
        ],
        landPrice: [
          { validator: roomPrice, trigger: 'change' }
        ],
        houseGetWay: [
          { required: true, message: '房屋取得方式不能为空', trigger: 'change' }
        ],
        organName: [
          { required: true, message: '产权单位不能为空', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '情况说明不能为空', trigger: 'change' }
        ]
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      ownershipFirstId: '',
      roomData: {},
      roomIdList: [], // 修改获取的房间ID集合
      isChoseRoom: true, // 是否选择了房间
      isChoseRoomMessage: '', // 是否选择了房间验证信息
      isRequestRoomPass: false, // 房屋信息验证是否通过
      isRequestRoomMessage: '', // 房屋信息验证信息
      roomList: [], // 房间待选数据集合
      roomCheckedList: [], // 已选择的数据集合
      houseAcquisitionMode: [], // 房屋取得方式
      landAcquisitionMode: [], // 土地获取方式
      procurementOrganizationForm: [], // 采购组织形式
      propertyOrgan: [], // 产权单位
    };
  },
  methods: {
    clearRules() { // 清空验证
      this.cancel();
      this.$refs.ruleForm.resetFields();
    },
    cancel() { // 清空表单数据
      this.isReasonShow = false;
      this.ruleForm.domains = [];
      this.courtyardAddress = '';
      this.houseStructure = '';
      this.completionDate = '';
      this.putUseDate = '';
      this.roomData = {};
      this.roomIdList = [];
      this.isChoseRoom = true;
      this.isChoseRoomMessage = '';
      this.isRequestRoomPass = false;
      this.isRequestRoomMessage = '';
      this.roomList = [];
      this.roomCheckedList = [];
      this.houseAcquisitionMode = [];
      this.landAcquisitionMode = [];
      this.procurementOrganizationForm = [];
      this.propertyOrgan = [];
    },
    // 初始化弹出框
    openModal(ownershipFirstId) {
      this.ownershipFirstId = ownershipFirstId || '';
      this.carDetailShow = true;
      if (this.ownershipFirstId) {
        setTimeout(() => {
          this.getUpdateDetail()
        }, 0)
      } else {
        setTimeout(() => {
          this.$refs.roomList.setCheckedKeys([])
        }, 0)
      }
      this.getSelect();
    },
    // 获取下拉选
    getSelect() {
      this.$axiosPost(API.ownershipFirst_queryOwnershipFirstSelect, {}).then(res => {
        this.roomList = res.data.courtyAndFloorAndStoreysAndRooms;
        this.houseAcquisitionMode = res.data.houseAcquisitionMode;
        this.landAcquisitionMode = res.data.landAcquisitionMode;
        this.propertyOrgan = res.data.propertyOrgan;
        this.procurementOrganizationForm = res.data.procurementOrganizationForm;
        let courtyAndFloorAndStoreysAndRooms = [];
        if (this.ownershipFirstId && this.roomList) {
          this.roomList.forEach((courtyard, courtyardIndex) => {
            if (courtyard.children) {
              courtyard.children.forEach((floor, floorIndex) => {
                if (floor.children) {
                  floor.children.forEach((storeys, storeysIndex) => {
                    if (storeys.children) {
                      storeys.children.forEach((room, roomIndex) => {
                        this.$set(room, 'disabled', true)
                      })
                    }
                    this.$set(storeys, 'disabled', true)
                  })
                }
                this.$set(floor, 'disabled', true)
              })
            }
            this.$set(courtyard, 'disabled', true)
          })
        }
      })
    },
    getUpdateDetail() { // 获取修改详情
      let params = {
        ownershipFirstId: this.ownershipFirstId
      }
      this.$axiosPost(API.ownershipFirst_updateDetail, params).then(res => {
        if (res.result === 'success') {
          this.$refs.roomList.setCheckedKeys(res.data.roomIdList);
          this.roomIdList = res.data.roomIdList;
          this.courtyardAddress = res.data.houseLocation || '';
          this.ruleForm.houseGetWay = res.data.houseAcquisitionMode || '';
          this.ruleForm.roomPrice = res.data.houseValue || '';
          this.ruleForm.roomArea = res.data.houseArea || '';
          this.houseStructure = res.data.houseStructure || '';
          this.ruleForm.landPrice = res.data.landValue || '';
          this.ruleForm.parcelArea = res.data.landArea || '';
          this.ruleForm.landGetWay = res.data.landAcquisitionMode || '';
          this.ruleForm.procurementOrganization = res.data.procurementOrganizationForm || '';
          this.ruleForm.handProperty = res.data.warrantSituation || '';
          this.ruleForm.organName = res.data.propertyOrganName || '';
          this.ruleForm.domains = res.data.fileResponse || [];
          this.ruleForm.realEstate = res.data.estateCertificateNo || '';
          this.ruleForm.noLicenseReason = res.data.noEvidenceReason || '';
          this.ruleForm.reason = res.data.situationDescription || '';
          this.ruleForm.roomLicense = res.data.houseCertificateNo || '';
          this.ruleForm.lineLicense = res.data.landCertificateNo || '';
          if (res.data.acquisitionDate) {
            this.ruleForm.getDate = DATEFORMAT.dateReturn(new Date(res.data.acquisitionDate));
          } else {
            this.ruleForm.getDate = '';
          }
          if (res.data.rentDate) {
            this.ruleForm.rentDate = DATEFORMAT.dateReturn(new Date(res.data.rentDate));
          } else {
            this.ruleForm.rentDate = '';
          }
          if (res.data.registerDate) {
            this.ruleForm.registrationData = DATEFORMAT.dateReturn(new Date(res.data.registerDate));
          } else {
            this.ruleForm.registrationData = '';
          }
          if (res.data.putUseDate) {
            this.putUseDate = DATEFORMAT.dateReturn(new Date(res.data.putUseDate));
          } else {
            this.putUseDate = '';
          }
          if (this.ruleForm.handProperty === '产权待界定' && this.ruleForm.houseGetWay !== '租借') {
            this.isReasonShow = true;
          } else {
            this.isReasonShow = false;
          }
          this.getBuildingData(res.data.floorId)
        }
      })
    },
    // 获取房屋选择的节点
    getCheckedNodes() {
      let checkNodeList = [];
      let courtYardList = [];
      let buildingList = [];
      let roomsList = [];
      this.courtyardAddress = '';
      this.houseStructure = '';
      this.completionDate = '';
      this.putUseDate = '';
      checkNodeList = this.$refs.roomList.getCheckedNodes(false, true);
      checkNodeList.forEach((item, index) => {
        if (item.typeFlag === 'courtyard') {
          courtYardList.push(item);
        } else if (item.typeFlag === 'floor') {
          buildingList.push(item);
        } else if (item.typeFlag === 'room') {
          roomsList.push(item);
        }
      })
      this.roomCheckedList = checkNodeList;
      if (courtYardList.length > 1 || buildingList.length > 1) {
        this.isRequestRoomPass = true;
        this.isRequestRoomMessage = '房屋信息只能选择一个院落和一个楼座';
      } else {
        this.isRequestRoomPass = false;
      }
      if (roomsList.length > 0) {
        this.isChoseRoom = false;
      } else {
        this.isChoseRoom = true;
        this.isChoseRoomMessage = '权属登记时需勾选到具体房间';
      }
      if (!this.isRequestRoomPass && buildingList.length > 0) {
        this.getBuildingData(buildingList[0].value);
      }
    },
    getBuildingData(floorId) {
      let params = {
        floorId: floorId
      }
      this.$axiosPost(API.ownershipFirst_queryFloor, params).then(res => {
        this.courtyardAddress = res.data[0].courtyardAddress;
        this.houseStructure = res.data[0].houseStructure;
        if (res.data[0].completionDate) {
          this.completionDate = DATEFORMAT.dateReturn(new Date(res.data[0].completionDate));
        } else {
          this.completionDate = '';
        }
        if (res.data[0].putUseDate) {
          this.putUseDate = DATEFORMAT.dateReturn(new Date(res.data[0].putUseDate));
        } else {
          this.putUseDate = '';
        }
      })
    },
    saveDate() {
      if (this.roomCheckedList.length === 0) {
        this.isChoseRoom = true;
        this.isChoseRoomMessage = '房屋信息不能为空';
      }
      if (this.ownershipFirstId) {
        this.isChoseRoom = false;
        this.isRequestRoomPass = false;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid && !this.isChoseRoom && !this.isRequestRoomPass) {
          let roomIds = [];
          if (this.ownershipFirstId) {
            roomIds = this.roomIdList;
          } else {
            if (this.roomCheckedList.length > 0) {
              this.roomCheckedList.forEach((item, index) => {
                if (item.typeFlag === 'room') {
                  roomIds.push(item.value);
                }
              })
            }
          }
          let propertyOrganId = '';
          if (this.propertyOrgan.length > 0) {
            this.propertyOrgan.forEach((item, index) => {
              if (item.organName === this.ruleForm.organName) {
                propertyOrganId = item.organId
              }
            })
          }
          let params = {
            roomIds: JSON.stringify(roomIds),
            houseLocation: this.courtyardAddress || '',
            houseAcquisitionMode: this.ruleForm.houseGetWay || '',
            houseValue: this.ruleForm.roomPrice || '',
            houseArea: this.ruleForm.roomArea || '',
            houseStructure: this.houseStructure || '',
            completionDate: FORMATGET.formatGET(this.completionDate).substr(0, 10) || '',
            putUseDate: this.putUseDate.substr(0, 10) || '',
            landValue: this.ruleForm.landPrice || '',
            landArea: this.ruleForm.parcelArea || '',
            landAcquisitionMode: this.ruleForm.landGetWay || '',
            acquisitionDate: FORMATGET.formatGET(this.ruleForm.getDate).substr(0, 10) || '',
            procurementOrganizationForm: this.ruleForm.procurementOrganization || '',
            attachmentUrls: JSON.stringify(this.ruleForm.domains)
          }
          if (this.ruleForm.houseGetWay === '租借') {
            this.$set(params, 'rentDate', FORMATGET.formatGET(this.ruleForm.rentDate).substr(0, 10) || '');
          } else {
            this.$set(params, 'warrantSituation', this.ruleForm.handProperty || '已办理，且两证合一');
          }
          if (this.ruleForm.handProperty === '已办理，且两证分离' || this.ruleForm.handProperty === '仅办理房产证' || this.ruleForm.handProperty === '仅办理土地证') {
            this.ruleForm.realEstate = '';
            this.ruleForm.noLicenseReason = '';
            this.ruleForm.reason = '';
            this.$set(params, 'houseCertificateNo', this.ruleForm.roomLicense || '');
            this.$set(params, 'landCertificateNo', this.ruleForm.lineLicense || '');
            this.$set(params, 'registerDate', FORMATGET.formatGET(this.ruleForm.registrationData).substr(0, 10) || '');
            this.$set(params, 'propertyOrganName', this.ruleForm.organName || '');
            this.$set(params, 'propertyOrganId', propertyOrganId || '');
          } else if (this.ruleForm.handProperty === '已办理，且两证合一') {
            this.ruleForm.roomLicense = '';
            this.ruleForm.lineLicense = '';
            this.ruleForm.reason = '';
            this.ruleForm.noLicenseReason = '';
            this.$set(params, 'estateCertificateNo', this.ruleForm.realEstate || '');
            this.$set(params, 'registerDate', FORMATGET.formatGET(this.ruleForm.registrationData).substr(0, 10) || '');
            this.$set(params, 'propertyOrganName', this.ruleForm.organName || '');
            this.$set(params, 'propertyOrganId', propertyOrganId || '');
          } else if (this.ruleForm.handProperty === '产权未办理') {
            this.ruleForm.roomLicense = '';
            this.ruleForm.lineLicense = '';
            this.ruleForm.reason = '';
            this.ruleForm.realEstate = '';
            this.ruleForm.registrationData = '';
            this.ruleForm.organName = '';
            this.$set(params, 'noEvidenceReason', this.ruleForm.noLicenseReason || '');
          } else {
            this.ruleForm.roomLicense = '';
            this.ruleForm.lineLicense = '';
            this.ruleForm.noLicenseReason = '';
            this.ruleForm.realEstate = '';
            this.ruleForm.registrationData = '';
            this.$set(params, 'situationDescription', this.ruleForm.reason || '');
          }
          let url = '';
          if (this.ownershipFirstId) {
            url = API.ownershipFirst_doUpdate;
            this.$set(params, 'ownershipFirstId', this.ownershipFirstId)
          } else {
            url = API.ownershipFirst_doAdd;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    YPromptClick() { // 操作成功弹出框
      setTimeout(() => {
        if (this.isBol) {
          this.carDetailShow = false;
          this.$emit('requestData');
        }
      }, 500)
    },
    changeHouseWay() { // 切换房屋获取方式
      this.ruleForm.handProperty = '已办理，且两证合一';
      this.isReasonShow = false;
    },
    clearReason() { // 清空备注
      this.$refs.ruleForm.clearValidate(['reason']);
      if (this.ruleForm.handProperty === '产权待界定' && this.ruleForm.houseGetWay !== '租借') {
        this.isReasonShow = true;
      } else {
        this.isReasonShow = false;
      }
    }
  }
};
</script>

<style lang="scss">
#ownership-registration {
  .el-select {
    display: block;
  }
  .el-radio {
    margin-bottom: 4px;
    margin-top: 4px;
  }
  .el-radio + .el-radio {
    margin-left: 10px;
  }
  .f-cancel-border {
    padding-left: 0px !important;
  }
}
</style>

