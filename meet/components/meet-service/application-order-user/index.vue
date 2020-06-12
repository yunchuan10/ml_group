<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会议服务" :item="breadcrumbItem"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>会议室申请单</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th width="10%">会议名称</th>
              <td width="40%">
                <el-form-item prop="conferenceName">
                  <el-input v-model="ruleForm.conferenceName" placeholder="请输入会议名称"></el-input>
                </el-form-item>
              </td>
              <th width="10%">
                <i class="f-color-red">*</i>承办单位
              </th>
              <td width="40%">
                <el-form-item
                  prop="deptId"
                  style="float: left; "
                  :rules="{ required: true, message: '请选择部门', trigger: 'change' }"
                >
                  <el-select
                    v-model="ruleForm.deptId"
                    filterable
                    clearable
                    placeholder="请选择部门"
                    @change="selectDept"
                  >
                    <el-option
                      v-for="(item) in deptList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <span style="padding: 0 5px;color: #ddd">-</span>
                <el-form-item prop="applyRealName" style="float: left; margin-left: 20px;" :rules="{ required: true, message: '请选择承办人', trigger: 'change' }">
                  <el-select v-model="ruleForm.applyRealName" filterable clearable placeholder="请选择承办人" @change="selectUser">
                    
                    <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>参会领导</th>
              <td>
                <el-form-item prop="participants">
                  <el-input v-model="ruleForm.participants" placeholder="请输入参会领导"></el-input>
                </el-form-item>
              </td>
              <th>参会人数</th>
              <td>
                <el-form-item
                  prop="useQty"
                  :rules="{ validator: useQtyValidator, trigger: 'change' }"
                >
                  <el-input v-model="ruleForm.useQty" placeholder="请输入参会人数"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>预约使用时间
              </th>
              <td colspan="3">
                <el-form-item prop="beginTime" style="float: left;">
                  <!--                  <el-date-picker v-model="ruleForm.beginTime" type="date" :editable="false" :clearable="false"  readonly disabled placeholder="请选择开始时间" style="width: 200px;"></el-date-picker>-->
                  <el-input
                    v-model="ruleForm.beginTime"
                    disabled
                    placeholder="请输入时间"
                    style="width: 200px;"
                  ></el-input>
                  <!--                  <el-input v-model="ruleForm.beginTimeDescription" disabled placeholder="请输入时间段" style="width: 150px;margin-left: 10px;"></el-input>-->
                </el-form-item>
                <div style="float: left; line-height: 40px;padding: 0 5px">-</div>
                <el-form-item prop="endTime" style="float: left;">
                  <!--                  <el-date-picker v-model="ruleForm.endTime" type="date" :editable="false" :clearable="false"  readonly disabled placeholder="请选择结束时间" style="width: 200px;"></el-date-picker>-->
                  <el-input
                    v-model="ruleForm.endTime"
                    disabled
                    placeholder="请输入时间"
                    style="width:200px;"
                  ></el-input>
                  <!--                  <el-input v-model="ruleForm.endTimeDescription" disabled placeholder="请输入时间段" style="width: 150px;margin-left: 10px;"></el-input>-->
                </el-form-item>
                <el-form-item prop="arriveTime" style="float: left; margin-left: 20px; ">
                  <el-input
                    v-model="ruleForm.arriveTime"
                    placeholder="请输入预计到达时间（如14:00）"
                    style="width:250px;"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>会议室名称
              </th>
              <td>
                <el-input
                  v-model="ruleForm.meetingName"
                  placeholder="请输入会议室名称"
                  disabled
                  style="width:250px;"
                ></el-input>
              </td>
              <th>台型布置</th>
              <td>
                <el-form-item prop="generalPlatform">
                  <el-radio-group v-model="ruleForm.generalPlatform">
                    <el-radio :label="0">课桌式</el-radio>
                    <el-radio :label="1">圆桌式</el-radio>
                  </el-radio-group>
                  <el-input
                    v-model="ruleForm.platformContent"
                    placeholder="其他请输入，不超过100字"
                    :maxlength="100"
                    style="margin-left: 30px; width: calc(100% - 192px);"
                  ></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>会议级别</th>
              <td>
                <el-form-item prop="secrecyLevel">
                  <el-select v-model="ruleForm.meetingLevel" placeholder="请选择会议级别">
                    <el-option
                      v-for="(item,index) in meetingLevelMap"
                      :key="index"
                      :label="item"
                      :value="index"
                    ></el-option>
                  </el-select>
                  <el-radio-group v-model="ruleForm.secrecyLevel" style="margin-left: 30px;">
                    <el-radio :label="0">保密</el-radio>
                    <el-radio :label="1">非保密</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
              <th>电话视频会议</th>
              <td>
                <el-form-item prop="videoType">
                  <el-radio-group v-model="ruleForm.videoType">
                    <el-radio :label="0">高清</el-radio>
                    <el-radio :label="1">标清</el-radio>
                    <el-radio :label="2">不使用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>会议设备</th>
              <td colspan="3">
                <el-form-item prop="equuips">
                  <div style="float: left; width: 50%;">
                    <el-checkbox-group v-model="ruleForm.equuips">
                      <el-checkbox label="投影仪"></el-checkbox>
                      <el-checkbox label="话筒"></el-checkbox>
                      <el-checkbox label="信号屏蔽仪"></el-checkbox>
                      <el-checkbox label="会标"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div style="float: left; width: 50%;">
                    <span style="float: left;">话筒：</span>
                    <el-checkbox-group v-model="ruleForm.equuips" style="float: left;">
                      <el-checkbox label="鹅颈麦"></el-checkbox>
                      <el-checkbox label="胸麦"></el-checkbox>
                      <el-checkbox label="耳麦"></el-checkbox>
                    </el-checkbox-group>
                    <el-input
                      v-model="ruleForm.equuipsText"
                      placeholder="其他设备请输入，不超过100字"
                      :maxlength="100"
                      style="float: left; margin-left: 30px; width: calc(100% - 302px);"
                    ></el-input>
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>上传附件</th>
              <td colspan="3">
                <v-baseUpload
                  :uploadUrl="uploadUrl"
                  :smallFileList="smallFileList"
                  :totalFileList.sync="fileList"
                ></v-baseUpload>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="applyRemark">
                  <el-input
                    v-model="ruleForm.applyRemark"
                    type="textarea"
                    placeholder="请输入备注，不超过100字"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <div class="f-text-right">{{ruleForm.applyRemark.length}}/100</div>
              </td>
            </tr>
          </table>
          <div class="f-text-center" style="margin-top: 20px;">
            <el-button class="u-submit-btn cancel-btn" @click="$router.go(-1)">取消</el-button>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitClick">提交</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <!-- 确认申请 -->
    <zl-formDialog
      v-model="confirmDialog"
      title="请您确认申请信息无误后提交"
      :append-to-body="false"
      width="900px"
      :loading.sync="loading"
      @click="confirmDialogClick"
    >
      <!--<zl-formDialog v-model="confirmDialog" title="请您确认申请信息无误后提交" :append-to-body="false" width="900px" @click="confirmDialogClick">-->
      <div class="h-tab-content">
        <table class="h-table-info">
          <tr>
            <th align="right" width="15%">会议名称</th>
            <td conference-order>{{ruleForm.conferenceName}}</td>
            <th align="right" width="15%">承办单位</th>
            <td
              width="35%"
            >{{this.handelDept(deptList,ruleForm.deptId)}}{{this.handelApplyUser(userList,ruleForm.applyStaffId)}}</td>
          </tr>
          <tr>
            <th align="right">参会领导</th>
            <td>{{ruleForm.participants}}</td>
            <th align="right">参会人数</th>
            <td>{{ruleForm.useQty}}</td>
          </tr>
          <tr>
            <th align="right">预约使用时间</th>
            <td colspan="3">{{ruleForm.beginTime}} {{ruleForm.endTime}} {{ruleForm.arriveTime}}</td>
          </tr>
          <tr>
            <th align="right">会议室名称</th>
            <td>{{ruleForm.meetingName}}</td>
            <th align="right">会议级别</th>
            <td>{{meetingLevelMap[ruleForm.meetingLevel]}}（{{secrecyLevelMap[ruleForm.secrecyLevel]}}）</td>
          </tr>
          <tr>
            <th align="right">电话视频会议</th>
            <td colspan="3">{{videoTypeMap[ruleForm.videoType]}}</td>
          </tr>
          <tr>
            <th align="right">会议设备</th>
            <td colspan="3">
              <span v-for="(item, index) in ruleForm.equuips" :key="index">
                {{item}}
                <span v-if="index != ruleForm.equuips.length - 1 || ruleForm.equuipsText">，</span>
              </span>
              <span>{{ruleForm.equuipsText}}</span>
            </td>
          </tr>
          <tr>
            <th align="right">台型布置</th>
            <td colspan="3">
              {{generalPlatformMap[ruleForm.generalPlatform]}}
              <span
                v-if="ruleForm.platformContent.length > 0"
              >（{{ruleForm.platformContent}}）</span>
            </td>
          </tr>
          <tr>
            <th align="right">附件</th>
            <td colspan="3">
              <p
                v-for="(item,index) in fileList"
                :key="index"
                style="padding: 2px 0;"
              >{{item.fileName}}</p>
            </td>
          </tr>
          <tr>
            <th align="right">备注</th>
            <td colspan="3">{{ruleForm.applyRemark}}</td>
          </tr>
        </table>
      </div>
    </zl-formDialog>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "application-order-user",
  data() {
    return {
      breadcrumbItem: [],
      dateReturnYMD: DATE.dateReturnYMD,
      organizerMap: { IN: "本单位", OUT: "外单位" },
      secrecyLevelMap: ["保密", "非保密"],
      meetingLevelMap: ["省级", "市级", "无级别"],
      videoTypeMap: ["高清", "标清", "不使用"],
      generalPlatformMap: ["课桌式", "圆桌式"],
      applyToData: [], // 申请单数据列表
      deptList: [], // 部门列表
      userList: [], // 人员列表
      roomInfoVOList: [], // 会议室列表
      selectDeptId: "", // 选中部门id
      selectUserId: "", // 选中承办人id
      selectBoardList: "", // 选中看板
      selectboardToIds: "", // 选中看板传过来的ids
      selectStart: "", // 选中看板开始时间段
      selectEnd: "", // 选中看板结算时间段
      ruleForm: {
        applyRealName: "", // 申请人单位主键
        organId: "", // 申请人单位主键
        deptId: "", // 申请人部门主键
        applyStaffId: "", // 申请人主键
        participants: "", // 参会领导
        useQty: "", // 参会人数
        conferenceName: "", // 会议名称
        arriveTime: "", // 预计到达时间
        beginTime: "", // 预约使用开始时间
        endTime: "", // 预约使用结束时间
        meetingCost: 0, // 预计费用
        beginTimeDescription: "", // 开始时间描述（MORNING/AFTERNOON/NIGHT）
        endTimeDescription: "", // 结束时间描述（MORNING/AFTERNOON/NIGHT）
        meetingId: "", // 会议室主键
        meetingName: "", // 会议室
        id: "",
        meetType: 0, // 0公有 1私有
        videoType: 0, // 电话视频会议，视频清晰度（ONE高清/TWO标清/ZERO不使用）
        organizer: "IN", // 承办单位（IN本单位/OUT外单位）
        meetingLevel: "", // 订单填写时，回显的会议室主键（由看板页面带过来）
        level: "", // 会议级别
        secrecyLevel: 0, // 保密级别（0保密/1不保密）
        equuips: [], // 设备拼串
        equuipsText: "",
        applyRemark: "", // 申请备注
        generalPlatform: 0, // 台型布置（0课桌式/1圆桌式）
        platformContent: "" // 台型布置说明
      },
      confirmDialog: false, // 确认申请对话框状态
      params: {},
      loading: false, // 提交按钮加载状态
      YPromptShow: false,
      isBol: false,
      message: "",
      fileList: [], // 上传附件列表
      attachmentList: [], // 上传附件列表
      uploadUrl: API.file_uploadFileToServer, // 上传url
      smallFileList: [] // 回显的文件列表
    };
  },
  computed: {
    ...mapState("mainData", [
      "burningTime",
      "meetRoomName",
      "meetSelectBoard",
      "token"
    ])
  },
  activated() {
    this.breadcrumbItem = ["会议服务", "会议室", "新增"];
    if (this.$route.params.type == "edit") {
      this.breadcrumbItem = ["会议服务", "申请单管理", "修改"];
      this.getDetail(this.$route.query.applyId);
      // this.userList =  this.selectDept(this.ruleForm.deptId)
    } else {
      this.ruleForm.organId = this.$store.state.mainData.organId || "";
      this.ruleForm.meetingId = this.$route.params.applyId || "";
      this.ruleForm.meetingName = this.$route.query.meetingName || "";
      this.selectBoardList = this.meetSelectBoard;
      this.selectStart = this.$route.query.boardStart;
      this.selectEnd = this.$route.query.boardEnd;
      this.meetingLevel = this.$route.params.meetingId || "";
      // this.ruleForm.beginTime = DATE.stringToDate(this.$route.query.beginTime); // 预约使用开始时间
      // this.ruleForm.endTime = DATE.stringToDate(this.$route.query.endTime); // 预约使用结束时间
      this.ruleForm.beginTime =
        this.$route.query.beginTime + " " + this.$route.query.boardStart; // 预约使用开始时间
      this.ruleForm.endTime =
        this.$route.query.endTime + " " + this.$route.query.boardEnd; // 预约使用结束时间
      this.ruleForm.beginTimeDescription = this.$route.query.beginTimeDescription; // 开始时间描述
      this.ruleForm.endTimeDescription = this.$route.query.endTimeDescription; // 结束时间描述
    }
    this.ruleForm.meetType = this.$route.params.meetType*1 || 0;
    this.getDataRequest();
  },
  methods: {
    // 订单申请数据
    getDataRequest() {
      let params = {
        selectedRoomId: this.$route.params.applyId
      };
      this.$axiosGet(API.roomApply_toSaveApply, params).then(res => {
        if (res.status === 200) {
          this.deptList = this.deptHandel(res.data.staffDept);
          this.applyToData = res.data.staffDept;
        }
      });
    },
    // 获取详情数据
    getDetail(id) {
      let params = {
        applyId: id
      };
      this.$axiosGet(API.roomApply_getApplyById, params).then(res => {
        if (res.status === 200) {
          this.ruleForm = res.data.roomApplyResponse;
          this.ruleForm.useQty = res.data.roomApplyResponse.useQty.toString();
          this.ruleForm.equuips = res.data.roomApplyResponse.equuips.split(",");
          this.smallFileList = res.data.attachmentList.map(item => {
            return { name: item.fileName, url: item.attachUrl, id: item.id };
          });
          this.fileList = res.data.attachmentList.map(item => {
            return {
              fileName: item.fileName,
              attachUrl: item.attachUrl,
              id: item.id
            };
          });
        }
      });
    },
    // 部门数据处理
    deptHandel(depArr) {
      let nerArr = [];
      if (!depArr) {
        return;
      }
      for (let i = 0, len = depArr.length; i < len; i++) {
        nerArr.push(depArr[i].dept);
      }
      return nerArr;
    },
    // 选中部门
    selectDept(val) {
      this.ruleForm.applyRealName = "";
      this.selectDeptId = val;
      let handleData = this.applyToData;
      let deptId = val;
      let userArr = [];
      for (let i = 0, len = handleData.length; i < len; i++) {
        for (let j = 0, len = handleData[i].staffOfDept.length; j < len; j++) {
          if (handleData[i].staffOfDept[j].deptId === deptId) {
            userArr.push(handleData[i].staffOfDept[j]);
          }
        }
      }
      this.userList = userArr;
    },
    // 选中承办人
    selectUser(val) {
      this.selectUserId = val;
      this.ruleForm.applyStaffId = val;
    },
    // 部门数据id回显
    handelDept(arr, id) {
      let depText = "";
      for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i].id === id) {
          depText = arr[i].name;
        }
      }
      return depText;
    },
    // 承办人数据id回显
    handelApplyUser(arr, id) {
      let depText = "";
      for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i].id === id) {
          depText = arr[i].realName;
        }
      }
      return depText;
    },
    // 文件上传
    // uploadUrl() {
    //   return API.file_uploadFileToServer;
    // },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.params = {
            applyRemark: this.ruleForm.applyRemark, // 申请备注
            applyStaffId: this.ruleForm.applyStaffId, // 申请人主键
            // deptId: this.ruleForm.deptId, // 申请人部门主键
            // applyStaffId: this.ruleForm.applyStaffId, // 申请人主键
            arriveTime: this.ruleForm.arriveTime, // 到达时间
            // beginTime: this.ruleForm.beginTime, // 预约使用开始时间
            // endTime: this.ruleForm.endTime, // 预约使用结束时间
            conferenceName: this.ruleForm.conferenceName, // 会议名称
            equuips: this.ruleForm.equuips
              ? this.ruleForm.equuips.join(",")
              : "", // 设备拼串
            generalPlatform: this.ruleForm.generalPlatform, // 台型布置
            // id: this.ruleForm.id, // 会议室id
            meetType: this.ruleForm.meetType, // 会议室类型0公有1私有
            // meetingId: this.ruleForm.meetingId, // 会议室主键
            meetingLevel: this.ruleForm.meetingLevel, // 会议级别
            participants: this.ruleForm.participants, // 参会领导
            platformContent: this.ruleForm.platformContent, // 台型布置说明
            secrecyLevel: this.ruleForm.secrecyLevel, // 保密级别
            useQty: Number(this.ruleForm.useQty), // 参会人数
            videoType: this.ruleForm.videoType // 电话视频会议
          };
          this.confirmDialog = true;
        }
      });
    },
    // 确认提交数据对话框
    confirmDialogClick() {
      this.loading = true;
      let toParams;
      let url = "";
      if (this.$route.params.type === "edit") {
        this.$set(this.params, "id", this.$route.query.applyId);
        toParams = {
          applyAttachmentRequestList: this.fileList,
          applyForm: this.params
        };
        url = API.roomApply_updateApply;
      } else {
        this.$set(this.params, "deptId", this.ruleForm.deptId);
        this.$set(this.params, "applyStaffId", this.ruleForm.applyStaffId);
        this.$set(this.params, "beginTime", this.ruleForm.beginTime);
        this.$set(this.params, "endTime", this.ruleForm.endTime);
        this.$set(this.params, "meetingId", this.ruleForm.meetingId);
        toParams = {
          applyAttachmentRequestList: this.fileList,
          applyDetailsRequestList: this.selectBoardList,
          applyForm: this.params
        };
        url = API.roomApply_doSaveApply;
      }
      // console.log("提交申请单",toParams)
      this.$axiosJsonPost(url, toParams).then(res => {
        this.loading = false;
        if (res.status === 200) {
          this.isBol = true;
          this.confirmDialog = false;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      });
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) this.$router.go(-1);
      this.loading = false;
    },
    // 参会人数表单验证
    useQtyValidator(rule, value, callback) {
      if (value) this.ruleForm.useQty = value.replace(/[^\d]/g, "");
      callback();
    },

    // 附件列表改变
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    }
  },
  deactivated() {
    this.fileList = [];
    this.deptList = []; // 部门列表
    this.userList = []; // 人员列表
    this.roomInfoVOList = []; // 会议室列表
    this.smallFileList = []; // 会议室列表
    this.ruleForm = {
      organId: "", // 申请人单位主键
      deptId: "", // 申请人部门主键
      applyStaffId: "", // 申请人主键
      participants: "", // 参会领导
      useQty: "", // 参会人数
      conferenceName: "", // 会议名称
      arriveTime: "", // 预计到达时间
      beginTime: "", // 预约使用开始时间
      endTime: "", // 预约使用结束时间
      meetingCost: 0, // 预计费用
      beginTimeDescription: "", // 开始时间描述（MORNING/AFTERNOON/NIGHT）
      endTimeDescription: "", // 结束时间描述（MORNING/AFTERNOON/NIGHT）
      meetingId: "", // 会议室主键
      videoType: 0, // 电话视频会议，视频清晰度（ONE高清/TWO标清/ZERO不使用）
      meetingLevel: "", // 订单填写时，回显的会议室主键（由看板页面带过来）
      level: "",
      secrecyLevel: 0, // 保密级别（YES保密/NO不保密）
      equuips: [], // 设备拼串
      equuipsText: "",
      applyRemark: "", // 申请备注
      generalPlatform: 0, // 台型布置（YES课桌式/NO圆桌式）
      platformContent: "" // 台型布置说明
    };

    this.$refs.ruleForm.resetFields();
    this.$destroy();
  }
};
</script>

<style>
</style>