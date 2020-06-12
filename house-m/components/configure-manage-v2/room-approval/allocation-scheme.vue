<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="title"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>制定调配方案</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th style="width:220px">单位名称</th>
                <td>{{ruleForm.organName}}</td>
                <th style="width:220px">批复编制人数</th>
                <td>{{ ruleForm.checkUserNum }}</td>
              </tr>
              <tr>
                <th>核定办公室使用面积</th>
                <td>
                  <el-form-item prop="verification">
                    <el-input clearable v-model="ruleForm.verification" placeholder="请输入核定办公室使用面积">
                      <template slot="append">㎡</template>
                    </el-input>

                  </el-form-item>
                </td>
                <th>核定服务用房使用面积</th>
                <td>
                  <el-form-item prop="serviceRoom">
                    <el-input clearable v-model="ruleForm.serviceRoom" placeholder="请输入核定服务用房使用面积">
                      <template slot="append">㎡</template>
                    </el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th>核定设备用房使用面积</th>
                <td>
                  <el-form-item prop="installationRoom">
                    <el-input clearable v-model="ruleForm.installationRoom" placeholder="请输入核定设备用房使用面积">
                      <template slot="append">㎡</template>
                    </el-input>
                  </el-form-item>
                </td>
                <th>核定基本办公用房使用面积</th>
                <td>{{basicArea ? basicArea+'㎡': ''}}</td>
              </tr>
              <tr>
                <th>
                  <i class="f-color-red">*</i>附属用房建筑面积</th>
                <td>
                  <el-form-item prop="subBuildArea">
                    <el-input clearable v-model="ruleForm.subBuildArea" placeholder="请输入附属用房建筑面积"></el-input>
                    <template slot="append">㎡</template>
                  </el-form-item>
                </td>
                <th>总建筑面积
                  <el-tooltip class="item u-grid-tips" effect="dark" content="总建筑面积=核定基本办公用房使用面积/0.65+附属用房建筑面积" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                </th>
                <td>{{totalArea | dot2}}㎡</td>
              </tr>
              <tr>
                <th>
                  <span class="f-color-red">*</span>配置方式</th>
                <td colspan="3">
                  调剂
                </td>
              </tr>
              <tr>
                <th>备注</th>
                <td colspan="3">
                  <el-form-item prop="remark">
                    <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.remark" placeholder="请输入备注"> </el-input>
                    <div style="text-align: right;">{{ruleForm.remark.length?ruleForm.remark.length:0}}/200</div>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th>附件</th>
                <td colspan="3">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传附件</el-button>
                  <ul class="u-file">
                    <li v-for=" (item, index) in ruleForm.fileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index)" href="javascript:;">删除</a>
                    </li>
                  </ul>
                </td>
              </tr>
            </table>
          </div>
          <div class="el-radio-item f-relative">
            <el-radio-group v-model="radiobtn" size="medium">
              <el-radio-button label="智能推荐" disabled></el-radio-button>
              <el-radio-button label="不推荐，手动分配"></el-radio-button>
            </el-radio-group>
            <div class="u-bread-btn-group u-rules">
              <button class="u-bread-btn" @click.prevent="openDilogFan('add','')">
                新建方案
              </button>
            </div>
          </div>

          <div class="u-p-line">
            <p class="u-p-style">
              <span class="u-p-icon"></span>
              <i class="u-p-icon2"></i>已制定方案</p>
          </div>

          <div v-show="radiobtn === '不推荐，手动分配'">
            <div class="u-table-content" v-for="(item,index) in ruleForm.planList" :key="index">
              <div class="f-hidden">
                <h2 class="h-table-subtitle f-pull-left u-padding">
                  <span></span>{{item.name}}</h2>
                <el-row class="block-col-2 f-pull-left u-padding">
                  <el-col :span="24">
                    <el-dropdown trigger="click">
                      <span class="el-dropdown-link">
                        <i class="iconfont icon-gengduo"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" @click.native="openDilogFan(item.allocatePlanDetailId,item.name)">修改方案名称</el-dropdown-item>
                        <el-dropdown-item command="a" @click.native="deleteClick(item.allocatePlanDetailId)">删除方案</el-dropdown-item>
                        <!-- <el-dropdown-item command="a" @click.native="Url(item.allocatePlanDetailId)">打开平面图</el-dropdown-item> -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>

                <div class="u-bread-btn-group f-pull-right">
                  <button class="u-bread-btn" @click.prevent="openDilog(item.allocatePlanDetailId)">
                    选择房屋
                  </button>
                </div>
              </div>
              <div class="h-table">
                <el-table :data="item.allSelectList" stripe style="width: 100%" show-summary :summary-method="getSummaries">
                  <el-table-column label="序号" type="index" fixed="left" width="50">
                  </el-table-column>
                  <el-table-column label="院落名称" prop="courtyardName">
                  </el-table-column>
                  <el-table-column label="地址" prop="courtyardAddress"> </el-table-column>
                  <el-table-column label="楼座" prop="floorName">
                  </el-table-column>
                  <el-table-column label="建筑面积（㎡）" prop="buildAreaSum">
                  </el-table-column>
                  <el-table-column label="使用面积（㎡）" prop="useAreaSum">
                  </el-table-column>
                  <el-table-column label="房间数量（间）" prop="roomNum">
                  </el-table-column>
                  <el-table-column label="房间明细" prop="roomNos">
                  </el-table-column>
                </el-table>
              </div>
              <div v-show="item.allSelectList.length == 0" style="font-size:12px;color:#F56C6C;">请点击院落勾选房间，才能提交。</div>
            </div>

          </div>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/configure-manage-v2/room-approval/approval-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitDataClick">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <el-dialog :title='titlePlan' custom-class="h-dialog-add" :visible.sync="dialogSchemeVisible" width="400px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="方案名称" prop="resource">
          <el-input clearable v-model="ruleForm.planName" placeholder="方案名称" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="dialogSchemeVisible = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="addTable">保存</el-button>
      </div>
    </el-dialog>

    <!-- 选择房屋弹框 -->
    <el-dialog title="选择房屋" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px">
      <el-form :model="ruleFormRoom" :rules="rules" ref="ruleFormRoom">
        <div class="m-search" style="margin-bottom:15px;">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getCourtyardNameList)">
                  <li>
                    <span>院落名称</span>
                    <el-input clearable v-model="ruleForm.courtyardName" placeholder="院落名称"></el-input>
                  </li>
                </ul>
              </td>
              <td class="u-search-but f-text-right">
                <el-button class="f-search-but" @click="getCourtyardNameList">查询</el-button>
              </td>
            </tr>
          </table>
        </div>
        <div style="max-height:400px;overflow:auto;">
          <div class="f-pull-right f-margin-bottom f-clearfix">
            <el-button class="u-submit-btn cancel-btn" v-show="isShow" @click="goBackCouryYard">返回</el-button>
          </div>
          <div class="h-table">
            <el-table v-show="!isShow" :data="ruleForm.tableData" stripe style="width: 100%">
              <el-table-column label="序号" type="index" fixed="left" width="50">
              </el-table-column>
              <el-table-column label="院落名称" prop="courtyardName">
                <template slot-scope="scope">
                  <a @click="roomlistDetail(scope.row.courtyardId, scope.row.courtyardName)">{{ scope.row.courtyardName}}</a>
                </template>
              </el-table-column>
              <el-table-column label="地址" prop="courtyardAddress">
              </el-table-column>
              <el-table-column label="闲置建筑面积（㎡）" prop="idleBuildAreaSum">
              </el-table-column>
              <el-table-column label="闲置使用面积（㎡）" prop="idleUseAreaSum">
              </el-table-column>
              <el-table-column label="闲置房间数量（间）" prop="roomNum">
              </el-table-column>
            </el-table>
            <el-table v-show="isShow" ref="multipleTable" :data="houseroomlist" stripe style="width: 100% " @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="roomAddress" label="房间位置" width="120 ">

                <template slot-scope="scope">
                  {{scope.row.roomAddress}}
                </template>

              </el-table-column>
              <el-table-column label="房间号" width="120" prop="roomNo">
              </el-table-column>
              <el-table-column prop="buildArea" label="建筑面积（㎡）">
              </el-table-column>
              <el-table-column prop="userArea" label="使用面积（㎡）">
              </el-table-column>
            </el-table>
          </div>
          <!-- <div class="h-table aa" v-if="isShow">

          </div> -->
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="closeDilog">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveData">保存</el-button>
      </div>
    </el-dialog>
    <!-- 选择房屋结束 -->

    <!-- 上传附件弹窗 -->
    <v-upload ref="VUpload" max="10" @vueUpload="fileUploadRequest"></v-upload>

    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import vuePopupUpload from "@/assembly/vue-popup-upload"; // 上传控件

export default {
  components: {
    "v-upload": vuePopupUpload
  },
  data() {
    let verification = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'verification') {
        message = "核定办公用房面积";
      } else if (rule.fullField === 'serviceRoom') {
        message = "核定服务用房面积";
      } else if (rule.fullField === 'installationRoom') {
        message = "核定设备用房使用面积";
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`));
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方`));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    let subBuildArea = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error("附属用房建筑面积为最多两位小数"));
        } else if (value > 1000000) {
          callback(new Error("附属用房建筑面积不能大于一百万"));
        } else {
          callback();
        }
      } else {
        callback(new Error("附属用房建筑面积核定不能为空"));
      }
    };
    return {
      isClose: false, //标记是否修改
      isShow: false,
      isAddRoom: true,
      isBusy: false,
      loading: false,
      type: '',
      titlePlan: '新增方案',
      deletePlanId: '', //删除方案id
      orderNo: "", // 订单号
      dateCreated: "", // 创建时间
      planId: '', //修改方案id
      planItem: '', //显示方案
      organType: "", // 单位性质
      organName: "", // 单位名称
      organAddressList: [], //地址集合
      hasOfficeArea: "", //原办公用房面积
      dutyTypeResponses: [], //人数统计集合
      dutyRealNum: 0,
      dutyCheckNum: 0,
      applyArea: "", //拟申请调配办公用房面积
      applyReason: "", // 申请原因
      fileUrls: [],
      interval: "", //间距
      radiobtn: '不推荐，手动分配',
      userArea: "", //使用面积
      allocatePlanId: '', //修改制定调配方案
      roomId: "", //房间id
      list: [], //院落集合
      id: '',//修改id的值
      roomIds: [], //房间id集合
      dialogFormVisible: false,
      dialogSchemeVisible: false, //新建方案
      getRowKeys(row) {
        return row.roomId;
      },
      ruleFormRoom: {
        courtyardId: '', //院落id
        courtyardList: [], //院落集合
      },
      title: "",
      courtryardlist: [], // 院落列表集合
      localRoomList: [], //房间列表存储集合
      roomlist: [], //房间列表集合
      houselist: [], //办公用房闲置情况列表集合
      houseroomlist: [],
      multipleSelection: [], // 复选框选的值
      allocatePlanDetailId: '',//方案id
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      ruleForm: {
        fileList: [],
        planName: '', //方案名称
        planList: [], //方案集合
        tableData: [],
        remark: '', //备注
        courtyardName: '', //院落名称
        verification: "", //核定面积
        subBuildArea: '', //附属用房建筑面积
        serviceRoom: '', //核定服务用房使用面积
        checkUserNum: '', //批复编制人数
        messageFee: "", //补充说明
        officeaddress: "",
        collocationWay: '', //配置方式
        installationRoom: '', //核定设备用房使用面积
        handleType: ""
      },
      YConfirmShow: false, // 删除弹出框
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: "", // 删除、修改、修改成功后，返回的值，初始默认为空
      rules: {
        verification: [
          { required: false, validator: verification, trigger: "change" } // 核定办公室使用面积
        ],
        subBuildArea: [
          { required: true, validator: subBuildArea, trigger: "change" } //附属建筑面积
        ],
        serviceRoom: [
          { required: false, validator: verification, trigger: "change" } //服务用房面积
        ],
        installationRoom: [
          { required: false, validator: verification, trigger: "change" } //设备用房面积
        ],
        configuration: [
          { required: true, message: "配置方案不能为空", trigger: "change" }
        ]
      },
      courtyardName: "",
      historyList: [],
      allSelectMap: [],
      allSelectList: [], // 全部选择的房间
      selectRoomList: [], //选择的房间
      officeApplyId: "",
      taskId: "",
      procInstId: "",
      formKey: "",
      allocateId: "",
      originTotal: 0,
      localRoomData: []
    };
  },
  activated() {
    this.isShow = false;
    this.centralize = "不推荐，手动分配";
    this.officeApplyId = this.$route.query.id;
    this.formKey = this.$route.query.formKey;
    this.getDetailRequest(this.$route.query.id, this.$route.query.formKey);
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.ruleForm.planList = [];
    this.ruleForm.fileList = [];
    this.ruleForm.verification = '';
    this.ruleForm.serviceRoom = '';
    this.ruleForm.installationRoom = '';
    // this.$destroy();
    this.allSelectList = [];
  },
  computed: {
    //基本核定面积
    basicArea() {
      let num = 0;
      num = parseFloat(Number(this.ruleForm.verification) + Number(this.ruleForm.serviceRoom) + Number(this.ruleForm.installationRoom))
      return num;    },
    totalArea() {
      let num = 0;
      num = parseFloat(this.basicArea / 0.65 + Number(this.ruleForm.subBuildArea))
      return num;    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },
    token() {
      return this.$store.state.mainData.token
    },
  },
  methods: {
    // 保存提交数据
    submitDataClick() {
      let planIds = [];
      if (this.ruleForm.planList.length > 0) {
        this.ruleForm.planList.forEach((item, index) => {
          planIds.push(item.allocatePlanDetailId)
        })
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            officeApplyId: this.officeApplyId,  //申请单id
            platForm: 'manageSystem', // 提交的平台
            submitType: 'YES', //提交类型
            taskId: this.taskId,
            procInstId: this.procInstId, //审批流程id
            formKey: this.formKey,
            organName: this.ruleForm.organName,
            checkUserNum: this.ruleForm.checkUserNum,
            planType: '调剂',
            officeCheckArea: this.ruleForm.verification, //办公室核定面积
            serviceCheckArea: this.ruleForm.serviceRoom, //服务用房面积
            equipCheckArea: this.ruleForm.installationRoom, //设备用房面积核定
            allocatePlanId: this.allocatePlanId || '', //修改制定调配方案
            affiliatedCheckArea: this.ruleForm.subBuildArea, //附属用房核定
            remark: this.ruleForm.remark,
            allocatePlanDetailIds: planIds,
            fileStrings: JSON.stringify(this.ruleForm.fileList)
          }
          this.loading = true;
          this.$axiosJsonPost(API.officeapply_completeHouseOfficeTask, params).then(res => {
            if (res.result === "success") {
              this.isBol = true;
              this.isBusy = true;
            } else {
              this.isBol = false;
              this.isBusy = false;
            }
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      })
    },

    // 存储删除参数
    deleteClick(id) {
      this.deletePlanId = id;
      this.YConfirmShow = true;
    },
    // 删除方案
    YDeleteClick() {
      let params = {
        allocatePlanDetailId: this.deletePlanId
      }
      this.$axiosPost(API.officeapply_delPlan, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.ruleForm.planList.forEach((item, index) => {
          if (item.allocatePlanDetailId === this.deletePlanId) {
            this.ruleForm.planList.splice(index, 1)
          }
        })
      }
      if (this.isBol && this.isBusy) {
        this.$router.push('/configure-manage-v2/room-approval/approval-list')
      }
    },

    //新增方案
    addTable() {
      let params = {
        allocatePlanDetailId: this.planId || '',
        allocatePlanDetailName: this.ruleForm.planName, //分配方案的名称
        officeApplyId: this.officeApplyId, //申请单id
      }
      this.$axiosPost(API.officeapply_addPlan, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
          if (this.type === 'edit') {
            let list = [];
            list.push({
              allocatePlanDetailId: res.data.allocatePlanDetailId,
              name: res.data.allocatePlanDetailName,
              allSelectList: res.data.allocateRangeGroupByRoomList,
              localRoomList: res.data.allocateRangeRoomList
            })
            this.ruleForm.planList.forEach((item, index) => {
              list.forEach((itemI, indexI) => {
                if (item.allocatePlanDetailId === itemI.allocatePlanDetailId) {
                  item.name = itemI.name;
                }
              })
            })
          } else {
            this.ruleForm.planList.push({
              allocatePlanDetailId: res.data.allocatePlanDetailId,
              name: res.data.allocatePlanDetailName,
              allSelectList: res.data.allocateRangeGroupByRoomList,
              localRoomList: res.data.allocateRangeRoomList
            })
          }
        } else {
          this.isBol = false;
        }
      })
      this.dialogSchemeVisible = false;
    },

    //打开方案弹出框
    openDilogFan(value, name) {
      this.dialogSchemeVisible = true;
      if (value == 'add') {
        this.type = 'add';
        this.planId = '';
        this.ruleForm.planName = '';
        this.titlePlan = "新增方案"
      } else {
        this.type = 'edit';
        this.titlePlan = "修改方案"
        this.ruleForm.planName = name;
        this.planId = value;
      }
    },

    //打开新增房屋
    openDilog(id) {
      this.dialogFormVisible = true;
      this.allocatePlanDetailId = id;
      this.isShow = false;
      this.allSelectMap = [];
      this.getCourtyardNameList();
      this.ruleForm.planList.forEach((item, index) => {
        if (item.allocatePlanDetailId === this.allocatePlanDetailId) {
          if (item.localRoomList.length > 0) {
            let tableData = [];
            this.$refs.multipleTable.clearSelection()
            item.localRoomList.forEach((room, index) => {
              tableData.push({
                buildArea: room.buildArea,
                courtyardId: null,
                courtyardName: room.courtyardName,
                excessiveArea: null,
                floorId: null,
                floorName: room.floorName,
                houseRoomBaseTypesList: [],
                imgUrls: null,
                organId: null,
                roomAddress: room.roomAddress,
                roomBaseTypes: "",
                roomId: room.roomId,
                roomName: null,
                roomNo: room.roomNo,
                storeysId: null,
                storeysName: room.storeysName,
                useClientStatus: null,
                useClientStatusName: null,
                useDept: null,
                useOrganId: null,
                useOrganName: null,
                useStatus: null,
                useStatusName: null,
                useUserId: null,
                useUserName: "",
                useUserNum: 0,
                useUsers: [],
                userArea: room.userArea,
                userMode: null,
                userModeName: null
              })
            })

            this.historyList = tableData;
            this.allSelectList = tableData;
            this.$refs.multipleTable.clearSelection();
            tableData.forEach((item, index) => {
              setTimeout(() => { this.$refs.multipleTable.toggleRowSelection(item, true) }, 500)
            })
          }
          else {
            this.historyList = [];
            setTimeout(() => { this.$refs.multipleTable.clearSelection(); }, 500)
            setTimeout(() => {
              this.allSelectList = [];
            }, 1000)
          }
        }


      })
    },
    //关闭房屋弹框  
    closeDilog() {
      this.dialogFormVisible = false;
    },

    //新增房屋保存
    saveData() {
      let roomIds = [];
      if (this.allSelectList.length > 0) {
        this.allSelectList.forEach((item, index) => {
          roomIds.push(item.roomId);
        });
      }
      let params = {
        allocatePlanDetailId: this.allocatePlanDetailId,
        officeApplyId: this.officeApplyId,
        roomIds: roomIds
      }
      this.$axiosPost(API.officeapply_addPlanRoom, params).then(res => {
        this.ruleForm.planList.forEach((item, index) => {
          if (res.data.allocatePlanDetailId === item.allocatePlanDetailId) {
            this.$set(item, 'allSelectList', res.data.allocateRangeGroupByRoomList);
            this.$set(item, 'localRoomList', res.data.allocateRangeRoomList);
          }

        })
        this.allSelectList = [];
      })
      this.dialogFormVisible = false;
    },

    //获取制定调配方案详情
    getDetailRequest(id) {
      let params = {
        id: id,
        platForm: 'manageSystem',
      }
      this.$axiosPost(API.officeapply_getApplyDetail, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.taskId = res.data.applyOrderDetail.taskId;
          this.procInstId = res.data.applyOrderDetail.procInstId;
          if (res.data.allocatePlan) {
            this.taskId = res.data.applyOrderDetail.taskId;
            this.procInstId = res.data.applyOrderDetail.procInstId;
            this.allocateId = res.data.allocatePlan.allocateId;
            this.ruleForm.organName = res.data.allocatePlan.organName;
            this.ruleForm.checkUserNum = res.data.allocatePlan.checkUserNum; //批复编制人数
            this.ruleForm.serviceRoom = res.data.allocatePlan.serviceCheckArea; //核定服务用房使用面积
            this.ruleForm.installationRoom = res.data.allocatePlan.equipCheckArea; //核定设备用房使用面积
            this.ruleForm.subBuildArea = res.data.allocatePlan.affiliatedCheckArea || '';//核定附属用房使用面积
            this.ruleForm.remark = res.data.allocatePlan.remark || '';
            this.allocatePlanId = res.data.allocatePlan.allocatePlanId || '';

            res.data.allocatePlan.allocatePlanDetailResponseList.forEach((item, index) => {
              this.ruleForm.planList.push({
                name: item.allocatePlanDetailName,
                allocatePlanDetailId: item.allocatePlanDetailId,
                allSelectList: item.allocateRangeGroupByRoomList,
                localRoomList: item.allocateRangeRoomList
              })
            })
            if (res.data.fileResponse) {
              res.data.fileResponse.forEach((item, index) => {
                this.ruleForm.fileList.push({
                  name: item.name,
                  url: item.url
                })
              });
            }
          }
        }
      });
    },
    //打开平面图  flag=NO 表示平面图可以编辑
    Url(id) {
      window.open(`http://172.16.13.25/4205/mvc/plan/toStoreysPlan?token=${this.token}&organId=${this.loginOrganId}&id=${id}&flag=NO`)
    },


    //返回按钮
    goBackCouryYard() {
      this.isShow = !this.isShow;
      this.total = this.originTotal;
      this.page = this.originPage;
      this.historyList = this.allSelectList;
    },
    //上传附件
    emptyFileJson: function () {
      if (this.ruleForm.fileList.length < 10) {
        this.$refs.VUpload.openModal(this.ruleForm.fileList);
      } else {
        this.isBol = false;
        this.isClose = false;
        this.message = "最多只能上传10个文件";
        this.promptDialog = true;
      }
    },
    // 附件上传请求接口
    fileUploadRequest(fileList) {
      fileList.forEach(value => {
        this.ruleForm.fileList.push({
          name: value.name,
          url: value.url
        });
      });
    },
    // 删除附件
    deleteFileNameList: function (index) {
      this.ruleForm.fileList.splice(index, 1);
    },
    //表格内容合计   
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },

    //房间多选框勾选的方法
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      if (this.allSelectMap.length == '0') {
        this.allSelectMap.push({
          courtyardName: this.courtyardName,
          choseRoomList: this.multipleSelection
        })
      } else if (this.allSelectMap.length > 0) {
        let isHas = false;
        this.allSelectMap.forEach((item, index) => {
          if (item.courtyardName == this.courtyardName) {
            isHas = true;
            this.$set(item, 'choseRoomList', this.multipleSelection)
          }
        })
        if (!isHas) {
          this.allSelectMap.push({
            courtyardName: this.courtyardName,
            choseRoomList: this.multipleSelection
          })
        }
        this.allSelectList = [];
        this.allSelectMap.forEach((item, indexI) => {
          if (item.choseRoomList.length > 0) {
            item.choseRoomList.forEach((room, indexJ) => {
              this.allSelectList.push(room)
            })
          }
        })
      }
    },
    //点击院落进入房间列表
    roomlistDetail(courtyardId, courtyardName) {
      setTimeout(() => { this.$refs.multipleTable.clearSelection(); }, 500)
      this.houseroomlist = [];
      this.isShow = !this.isShow;
      this.courtyardName = courtyardName;
      this.originPage = this.page;
      this.pageSize = 10;
      this.page = 1;
      let params = {
        courtyardId: courtyardId,
        planType: '调剂',
        pageNum: this.page,
        pageSize: this.pageSize,
        officeApplyId: this.officeApplyId
      }
      this.$axiosPost(API.officeapply_roomList, params).then(res => {
        if (res.result === 'success' && res.data) {
          this.total = res.data.total;
          this.houseroomlist = res.data.data;
          let defaultCheckNode = [];
          if (this.historyList.length > 0) {
            this.historyList.forEach((itemI, indexI) => {
              this.houseroomlist.forEach((itemJ, indexJ) => {
                if (itemI.roomId === itemJ.roomId) {
                  defaultCheckNode.push(itemJ)
                }
              })
            })
          }
          setTimeout(() => {
            defaultCheckNode.forEach((item, index) => {
              this.$refs.multipleTable.toggleRowSelection(item);
            })
          }, 0)
        }
      })
      this.allSelectList = [];
    },

    // 获取院落列表
    getCourtyardNameList() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        courtyardName: this.ruleForm.courtyardName,
        officeApplyId: this.officeApplyId
      };
      this.$axiosPost(API.officeapply_getCourtyardRoomData, params).then(res => {
        if (res.result === "success" && res.data) {
          this.ruleForm.tableData = res.data.data;
        }
      }
      );
    },
  }
};
</script>

<style lang="scss" scoped>
.el-row-padding {
  padding: 0 0 20px 20px;
}
.iconfont {
  font-size: 6px;
}
.icon-gantanhao {
  color: #dcdfe6;
}
.u-rules {
  position: absolute;
  right: 0;
  top: 0;
}
.u-p-line {
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 15px;
}
.h-dialog-add {
  .el-input {
    width: auto;
  }
}
.u-p-style {
  position: absolute;
  background: #fff;
  font-weight: bold;
  padding: 5px 10px 5px 0;
  top: -13px;
}
.icon-gengduo {
  font-size: 22px;
}
.u-p-icon {
  display: inline-block;
  width: 4px;
  margin-right: 4px;
  height: 10px;
  background-color: #2f70ff;
}
.u-p-icon2 {
  display: inline-block;
  width: 3px;
  margin-right: 5px;
  height: 10px;
  background-color: #97b7ff;
}
.left20 {
  left: 20px;
}
.h-table {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}
.el-dropdown-link {
  color: #2f70ff;
  padding-left: 10px;
  width: 40px;
}

//左边距
.margin-15 {
  margin: 0 15px 0;
}
.u-padding {
  padding-top: 10px;
}
</style>
