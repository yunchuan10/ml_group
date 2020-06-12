<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置利用申请" :item="['处置利用申请']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>办公用房处置利用申请单</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>项目名称</th>
              <td colspan="3">
                <el-form-item prop="itemName">
                  <el-input placeholder="请输入" v-model="ruleForm.itemName" style="width:100%;" maxlength='40'>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>处置方式</th>
              <td colspan="3">
                <el-radio-group v-model="ruleForm.handleType">
                  <el-radio label="RENT">出租</el-radio>
                  <el-radio label="CONVERSIONPURPOSES">转换用途</el-radio>
                  <el-radio label="AUCTION">拍卖</el-radio>
                  <el-radio label="DEMOLITION">拆除</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='RENT'">
              <th>评估机构</th>
              <td>
                <el-input placeholder="请输入" v-model="ruleForm.estimateMechanism" style="width:100%;" maxlength='100'>
                </el-input>
              </td>
              <th>评估基准日</th>
              <td>
                <el-date-picker v-model="ruleForm.estimateBaseDate" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                </el-date-picker>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='CONVERSIONPURPOSES'">
              <th>
                <i class="f-color-red">*</i>管理单位</th>
              <td>
                <el-form-item prop="manageOrganName">
                  <el-input placeholder="请输入" v-model="ruleForm.manageOrganName" style="width:100%;" maxlength="100">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>用途</th>
              <td>
                <el-form-item prop="purpose">
                  <el-input placeholder="请输入" v-model="ruleForm.purpose" style="width:100%;" maxlength="100">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='AUCTION'">
              <th>起拍价</th>
              <td>
                <el-form-item prop="startingPrice">
                  <el-input placeholder="请输入" v-model="ruleForm.startingPrice" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>保证金</th>
              <td>
                <el-form-item prop="deposit">
                  <el-input placeholder="请输入" v-model="ruleForm.deposit" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='AUCTION'">
              <th>增价幅度</th>
              <td colspan="3">
                <el-form-item prop="priceIncreaseRange">
                  <el-input placeholder="请输入" v-model="ruleForm.priceIncreaseRange" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='DEMOLITION'">
              <th>
                <i class="f-color-red">*</i>项目预算</th>
              <td>
                <el-form-item prop="itemBudget">
                  <el-input placeholder="请输入" v-model="ruleForm.itemBudget" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>项目地点</th>
              <td>
                <el-form-item prop="itemAddress">
                  <el-input placeholder="请输入" v-model="ruleForm.itemAddress" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='DEMOLITION'">
              <th>项目工期</th>
              <td colspan="3">
                <el-form-item prop="itemSchedule">
                  <el-input placeholder="请输入" v-model="ruleForm.itemSchedule" style="width:100%;">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
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
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remark">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.remark" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.remark.length?ruleForm.remark.length:0}}/200</div>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle f-pull-left" style="padding-top:10px;">
              <span></span>
              <i class="f-color-red">*</i>拟处置房屋明细</h2>
            <div class="u-bread-btn-group f-pull-right">
              <button class="u-bread-btn" @click.prevent="openDilog">选择房屋</button>
            </div>
          </div>
          <div class="h-table">
            <el-table :data="ruleForm.list" stripe style="width: 100%" ref="multipleTable1">
              <el-table-column fixed="left" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column label="房间号" prop="roomNo">
              </el-table-column>
              <el-table-column label="房间位置" prop="roomAddress">
              </el-table-column>
              <el-table-column label="建筑面积（㎡）" prop="buildArea">
                <template slot-scope="scope">{{scope.row.buildArea}}</template>
              </el-table-column>
              <el-table-column label="使用面积（㎡）" prop="useArea">
              </el-table-column>
              <el-table-column width='260px' v-if="ruleForm.handleType ==='AUCTION'" key='1' label="房屋评估建筑面积单价(万元/㎡)" :render-header="renderHeader">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.houseEstimateBuildAreaOfUnivalent'" :rules='rules.houseEstimateBuildAreaOfUnivalent'>
                    <el-input v-model="scope.row.houseEstimateBuildAreaOfUnivalent"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="总价（万元）" v-if="ruleForm.handleType ==='AUCTION'">
                <template slot-scope="scope" prop="totalPrice">
                  <el-form-item :prop="'list.' + scope.$index + '.totalPrice'" :rules='rules.totalPrice'>
                    <span>{{parseFloat(scope.row.buildArea) * parseFloat(scope.row.houseEstimateBuildAreaOfUnivalent) || '0'}}</span>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="评估租金（元/月/平米）" prop="estimatePrice" v-if="ruleForm.handleType ==='RENT'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.estimatePrice'" :rules='rules.estimatePrice'>
                    <el-input v-model="scope.row.estimatePrice"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="租赁期限（年）" v-if="ruleForm.handleType ==='RENT'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.leaseTerm'" :rules='rules.leaseTerm'>
                    <el-input v-model="scope.row.leaseTerm" maxlength="100"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="规划用途" prop="planPurpose" v-if="ruleForm.handleType ==='RENT'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.planPurpose'" :rules='rules.planPurpose'>
                    <el-input class="f-pull-left" v-model="scope.row.planPurpose" maxlength="100"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- <el-table-column fixed="right" label="操作" v-if="this.$route.params.type === 'edit'">
                <template slot-scope="scope">
                  <a @click="deleteClick(scope.row.roomId)">删除</a>
                </template>
              </el-table-column> -->
            </el-table>
            <div v-show="ruleForm.list.length === 0" class="f-color-red">房间明细不能为空</div>
          </div>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/disposal-manage/disposal-apply-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getAddDataRequest">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <el-dialog title="选择房屋" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px">
      <el-form :model="ruleFormRoom" :rules="rules" ref="ruleFormRoom">
        <div class="m-search" style="margin-bottom:15px;">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getRoomList)">
                  <li>
                    <span>院落名称</span>
                    <el-select v-model="ruleFormRoom.courtyardId" clearable filterable placeholder="请选择">
                      <el-option v-for="item in ruleFormRoom.courtyardList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </li>
                </ul>
              </td>
              <td class="u-search-but f-text-right">
                <el-button class="f-search-but" @click="getRoomList">查询</el-button>
              </td>
            </tr>
          </table>
        </div>
        <div style="max-height:400px;overflow:auto;">
          <div class="h-table">
            <el-table ref="multipleTable" :data="tableData" stripe style="width: 100% " @selection-change="handleSelectionChange" :row-key="getRowKeys">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="房间号" width="120" prop="roomNo">
              </el-table-column>
              <el-table-column prop="roomAddress" label="房间位置" width="120 ">
              </el-table-column>
              <el-table-column prop="buildArea" label="建筑面积（㎡）">
              </el-table-column>
              <el-table-column prop="useArea" label="使用面积（㎡）">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="closeDilog">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="SaveData">保存</el-button>
      </div>
    </el-dialog>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" title="提示" :message="message" @click="YConfirmClick"></Y-Confirm>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow " :isBol="isBol" :message="message" @click="YPromptClick "></Y-Prompt>
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
    let startingPrice = (rule, value, callback) => {
      // (rule)
      let message = '';
      if (rule.fullField === 'startingPrice') {
        message = '起拍价'
      } else if (rule.fullField === 'deposit') {
        message = '保证金'
      } else if (rule.fullField === 'priceIncreaseRange') {
        message = '增价幅度'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万元`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    let estimatePrice = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`评估租金为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`评估租金不能大于一百万元`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    let validatorNum = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'itemBudget') {
        message = '项目预算'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`));
      }
    }
    let houseEstimateBuildAreaOfUnivalent = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`房屋评估建筑面积单价为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`房屋评估建筑面积单价不能大于一百万`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`房屋评估建筑面积单价不能为空`));
      }
    }
    let itemSchedule = (rule, value, callback) => {
      if (value) {
        if (!(/(^[1-9]\d*$)/.test(value))) {
          callback(new Error(`请输入大于0正整数！`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      loading: false,
      ruleForm: {
        itemName: '', //项目名称
        maxLength: '200',
        handleType: 'RENT', //处置方式
        buildArea: '0',
        handleHouseDetails: '', //拍卖、出租、拆除、转换用途
        estimateMechanism: '', //评估机构
        estimateBaseDate: '', //评估基准日
        itemBudget: '',//项目预算（拆除）
        itemAddress: '', //项目地点（拆除）
        itemSchedule: '', //项目工期（拆除）
        manageOrganName: '', //管理单位（转换用途）
        purpose: '', //用途 （转换用途）
        startingPrice: '', // 起拍价（拍卖）
        deposit: '', //保证金（拍卖）
        priceIncreaseRange: '', //增价幅度（拍卖）
        remark: '', //备注
        attachments: {}, //图片地址       
        courtyardName: '', //院落名称
        houseEstimateBuildAreaOfUnivalent: '0', //房屋评估建筑面积单价
        totalPrice: '', //总价
        roomNo: '', //房间号
        totalName: '',
        userArea: '', //使用面积
        list: [],
        domains: [],
      },
      getRowKeys(row) {
        return row.roomId;
      },
      ruleFormRoom: {
        courtyardId: '', //院落id
        courtyardList: [], //院落集合
      },
      roomId: '', //房间id
      vuePopupUploadShow: true,
      multipleSelection: [],
      dialogFormVisible: false,
      title: '',
      maxLength: '200',
      roomList: [],
      handleApplyId: '', //订单id
      YConfirmShow: false,
      YPromptShow: false, // 提示对话框
      YPromptShowDel: false,
      messagedel: '',
      imgUrls: [], //图片集合
      isBol: false, // 弹出框图形标识
      isOpen: false,
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      tableData: [], //数据集合
      msgType: '新增', // 当前页面状态 
      rules: {
        startingPrice: [
          { validator: startingPrice, trigger: 'change' }  //起拍价
        ],
        deposit: [
          { validator: startingPrice, trigger: 'change' }  // 保证金
        ],
        priceIncreaseRange: [
          { validator: startingPrice, trigger: 'change' }  // 增价幅度
        ],
        itemSchedule: [{ validator: itemSchedule, trigger: 'change' }
        ],  //项目工期

        itemName: [
          { required: true, message: '请输入项目名称', trigger: 'change' }
        ],
        handleType: [
          { required: true, message: '请选择处置方式', trigger: 'change' }
        ],
        itemBudget: [
          { required: true, validator: validatorNum, trigger: 'change' }
        ],
        handleHouseDetails: [
          { required: true, message: '房间明细不能为空', trigger: 'change' }
        ],
        itemAddress: [
          { required: true, message: '请输入项目地点', trigger: 'change' }
        ],
        manageOrganName: [
          { required: true, message: '请输入管理单位', trigger: 'change' }
        ],
        purpose: [
          { required: true, message: '请输入用途', trigger: 'change' }
        ],
        houseEstimateBuildAreaOfUnivalent: [
          { required: true, validator: houseEstimateBuildAreaOfUnivalent, trigger: 'change' }
        ],
        leaseTerm: [
          { required: true, validator: itemSchedule, trigger: 'change' }
        ],
        estimatePrice: [
          { required: true, validator: estimatePrice, trigger: 'change' }
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  activated() {
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.handleApplyId = this.$route.query.id;
      }
      this.getEditDataRequest();
    } else {
      return;
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  mounted() {
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    }
  },
  methods: {
    renderHeader(createElement) { // 表格头部自定义
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `<span class="f-color-red">*</span><span>房屋评估建筑面积单价(万元/㎡)</span>`
        },
      })
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
    //添加弹框的保存按钮
    SaveData() {
      this.dialogFormVisible = false;   
      this.ruleForm.list = this.multipleSelection;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //选择房屋弹框
    openDilog() {
      this.dialogFormVisible = true;
      this.getCourtyardNameList();
      if (this.ruleForm.list.length > 0 && this.tableData.length > 0) {
        this.$refs.multipleTable.clearSelection();
        for (let j = 0, leng = this.tableData.length; j < leng; j++) {
          for (let i = 0, len = this.ruleForm.list.length; i < len; i++) {
            if (this.tableData[j].roomId === this.ruleForm.list[i].roomId) {
              setTimeout(() => { this.$refs.multipleTable.toggleRowSelection(this.tableData[j]); }, 500)
            }
          }
        }
      }
    },
    //关闭弹框
    closeDilog() {
      this.dialogFormVisible = false;
      if (this.tableData.length > 0) {
        this.$refs.multipleTable.clearSelection();      }
    },
    // 修改获取详情数据
    getEditDataRequest() {
      let params = {
        handleApplyId: this.handleApplyId
      }
      this.$axiosGet(API.handleapply_updateDetail, params).then(res => {
        let roomList = [];
        if (res.data) {
          this.ruleForm.itemName = res.data.handleApplyResponse.itemName; //项目名称
          this.ruleForm.handleType = res.data.handleApplyResponse.handleType; //处置方式
          this.ruleForm.estimateMechanism = res.data.handleApplyResponse.estimateMechanism; //评估机构
          this.ruleForm.estimateBaseDate = res.data.handleApplyResponse.estimateBaseDate || ''; //评估基准日
          this.ruleForm.itemBudget = res.data.handleApplyResponse.itemBudget;  //项目预算
          this.ruleForm.itemAddress = res.data.handleApplyResponse.itemAddress;  //项目地点
          this.ruleForm.itemSchedule = res.data.handleApplyResponse.itemSchedule; //项目工期
          this.ruleForm.manageOrganName = res.data.handleApplyResponse.manageOrganName; // 管理单位
          this.ruleForm.purpose = res.data.handleApplyResponse.purpose; //用途
          this.ruleForm.startingPrice = res.data.handleApplyResponse.startingPrice; // 起拍价
          this.ruleForm.deposit = res.data.handleApplyResponse.deposit; //保证金
          this.ruleForm.priceIncreaseRange = res.data.handleApplyResponse.priceIncreaseRange; //增价幅度
          this.ruleForm.remark = res.data.handleApplyResponse.remark; //备注
          if (res.data.fileResponseAdapterList) {
            res.data.fileResponseAdapterList.forEach((item, index) => {
              this.ruleForm.domains.push({
                name: item.name,
                url: item.url
              })
            });
          }
          roomList = res.data.handleApplyResponse.handleHouseDetailResponseList;
          this.ruleForm.list = roomList
        }
      })
    },
    //提交申请单
    getAddDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            this.YConfirmShow = true;
            this.message = '请注意，已撤回或已驳回的申请修改后再次提交，会重新生成一条新的申请单'
          } else {
            this.getSaveDataRequest();
          }
        }
      })
    },
    // 提示框确定按钮
    YConfirmClick() {
      this.getSaveDataRequest();
    },
    //提交表单
    getSaveDataRequest() {
      let ispass = false;
      if (this.ruleForm.list.length > 0) {
        ispass = true
      } else {
        ispass = false;
      }
      let dataTable = [];
      this.ruleForm.list.forEach((item, index) => {
        if (this.ruleForm.handleType === 'AUCTION') {
          dataTable.push({
            roomId: item.roomId,
            houseEstimateBuildAreaOfUnivalent: item.houseEstimateBuildAreaOfUnivalent,
            totalPrice: parseFloat(item.buildArea) * parseFloat(item.houseEstimateBuildAreaOfUnivalent),
            roomAddress: item.roomAddress,
            useArea: item.useArea || '',
            buildArea: item.buildArea
          })
        } else if (this.ruleForm.handleType === 'RENT') {
          dataTable.push({
            roomId: item.roomId,
            roomAddress: item.roomAddress,
            useArea: item.useArea,
            buildArea: item.buildArea || '',
            estimatePrice: item.estimatePrice || '',
            leaseTerm: item.leaseTerm || '',
            planPurpose: item.planPurpose || ''
          })
        } else if (this.ruleForm.handleType === 'CONVERSIONPURPOSES' || this.ruleForm.handleType === 'DEMOLITION') {
          dataTable.push({
            roomId: item.roomId,
            roomAddress: item.roomAddress,
            useArea: item.useArea,
            buildArea: item.buildArea || ''
          })
        }
      })
      this.$refs.ruleForm.validate((valid) => {
        if (valid && ispass) {
          let params = {
            businessCode: 'HOUSE_HANDLE',
            itemName: this.ruleForm.itemName,
            handleType: this.ruleForm.handleType,
            handleHouseDetailRequestList: dataTable,
            remark: this.ruleForm.remark, //备注
            fileRequestList: this.ruleForm.domains, // 图片地址
          }
          if (this.ruleForm.handleType === 'RENT') {
            this.$set(params, 'estimateMechanism', this.ruleForm.estimateMechanism || '');
            this.$set(params, 'estimateBaseDate', FORMATGET.formatGET(this.ruleForm.estimateBaseDate).substr(0, 10) || '');
          } else if (this.ruleForm.handleType === 'CONVERSIONPURPOSES') {
            this.$set(params, 'manageOrganName', this.ruleForm.manageOrganName);
            this.$set(params, 'purpose', this.ruleForm.purpose);
          } else if (this.ruleForm.handleType === 'AUCTION') {
            this.$set(params, 'startingPrice', this.ruleForm.startingPrice || '');
            this.$set(params, 'deposit', this.ruleForm.deposit || '');
            this.$set(params, 'priceIncreaseRange', this.ruleForm.priceIncreaseRange || '');
          } else {
            this.$set(params, 'itemBudget', this.ruleForm.itemBudget);
            this.$set(params, 'itemAddress', this.ruleForm.itemAddress);
            this.$set(params, 'itemSchedule', this.ruleForm.itemSchedule || '');
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.handleapply_doHandleApplyUpdate;
          } else {
            url = API.handleapply_doApply;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('办公用房', '处置利用', '处置利用修改')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '处置利用', '处置利用新增')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    //获取所有院落信息
    getCourtyardNameList() {
      let params = {
        organId: this.loginOrganId, //单位id
      }
      this.$axiosGet(API.handleapply_queryHouseCourtyardBaseList, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.ruleFormRoom.courtyardList = res.data;
        }
      })
    },
    //根据院落id获取闲置房间信息
    getRoomList() {
      let params = {
        courtyardId: this.ruleFormRoom.courtyardId
      }
      this.$axiosGet(API.handleapply_queryHouseRoomBaseList, params).then(res => {
        let list = [];
        if (res.result == 'success' && res.data) {
          list = res.data;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          if (res.data) {
            this.tableData = res.data;
            if (this.ruleForm.list.length > 0) {
              this.$refs.multipleTable.clearSelection();
              for (let j = 0, leng = this.tableData.length; j < leng; j++) {
                for (let i = 0, len = this.ruleForm.list.length; i < len; i++) {
                  if (this.tableData[j].roomId === this.ruleForm.list[i].roomId) {
                    setTimeout(() => { this.$refs.multipleTable.toggleRowSelection(this.tableData[j]); }, 500)
                  }
                }
              }
            }
          } else {
            this.tableData = [];
          }
        }
      })
    },
    //删除人员信息
    deleteClick(deleteId) {
      this.ruleForm.list.forEach((item, index) => {
        if (item.roomId == deleteId) {
          this.ruleForm.list.splice(index, 1)
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/disposal-manage/disposal-apply-list')
        }
      }, 1000)
    },
  }
};
</script>

<style lang="scss" scoped>
.el-input {
  width: auto;
}
.iconfont {
  font-size: 12px;
}
</style>