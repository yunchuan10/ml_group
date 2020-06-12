<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="配置管理" :item="['制定调配方案']" type='2'></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="u-bread-btn" @click="approvalDetailClick(officeApplyId,formKey)">
            查看用房申请
          </button>
        </div>
      </div>
      <div class="h-table-title">
        <h2>制定调配方案</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th style="width:220px">单位名称</th>
              <td>{{ruleForm.organName}}</td>
              <th style="width:220px">批复编制人数</th>
              <td>{{ ruleForm.checkUserNum }}人</td>
            </tr>
            <tr>
              <th>核定办公室使用面积</th>
              <td>
                <el-form-item prop="officeCheckArea">
                  <el-input clearable v-model="ruleForm.officeCheckArea" placeholder="请输入核定办公室使用面积">
                    <template slot="append">㎡</template>
                  </el-input>

                </el-form-item>
              </td>
              <th>核定服务用房使用面积</th>
              <td>
                <el-form-item prop="serviceCheckArea">
                  <el-input clearable v-model="ruleForm.serviceCheckArea" placeholder="请输入核定服务用房使用面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>核定设备用房使用面积</th>
              <td>
                <el-form-item prop="equipCheckArea">
                  <el-input clearable v-model="ruleForm.equipCheckArea" placeholder="请输入核定设备用房使用面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>核定基本办公用房使用面积</th>
              <td>{{basicArea ? basicArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>核定附属用房建筑面积</th>
              <td>
                <el-form-item prop="affiliatedCheckArea">
                  <el-input clearable v-model="ruleForm.affiliatedCheckArea" placeholder="请输入核定附属用房建筑面积">

                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>总核定面积
                <el-tooltip class="item u-grid-tips" effect="dark" content="总核定面积=核定基本办公用房使用面积/0.65+核定附属用房建筑面积" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </th>
              <td>{{totalArea | dot2}}㎡</td>
            </tr>
            <tr>
              <th>
                配置方式
              </th>
              <td colspan="3">
                调剂
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remark">
                  <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.remark" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.remark.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <el-button class="u-upload-btn" @click="emptyFileJson">
                  <i class="iconfont icon-daochu"></i>上传附件
                </el-button>
                <ul class="u-file">
                  <li v-for=" (item, index) in ruleForm.fileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                    <a class="ahover" @click="deleteFileNameList(index)" href="javascript:;">删除</a>
                  </li>
                </ul>
              </td>
            </tr>
          </table>

          <div class="el-radio-item f-relative">
            <el-radio-group v-model="radiobtn" size="medium">
              <el-radio-button label="智能推荐" disabled></el-radio-button>
              <el-radio-button label="不推荐，手动分配"></el-radio-button>
            </el-radio-group>
            <div class="u-bread-btn-group f-absolute" style="right: 0;top: 0;">
              <button class="u-bread-btn" @click.prevent="openSchemeDilog()">
                新建方案
              </button>
            </div>
          </div>
          <div class="u-p-line">
            <p class="u-p-style">
              <span class="u-p-icon"></span>
              <i class="u-p-icon2"></i>已制定方案
            </p>
          </div>
          <div v-show="radiobtn === '不推荐，手动分配'">
            <div class="u-table-content" v-for="(item,index) in planList" :key="index">
              <div class="f-hidden">
                <h2 class="h-table-subtitle f-pull-left u-padding">
                  <span></span>{{item.name}}
                </h2>
                <el-row class="block-col-2 f-pull-left u-padding">
                  <el-col :span="24">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="iconfont icon-gengduo"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" @click.native="openSchemeDilog(item, index)">修改方案名称</el-dropdown-item>
                        <el-dropdown-item command="a" @click.native="deleteClick(item.id, index)">删除方案</el-dropdown-item>
                        <!-- <el-dropdown-item command="a" @click.native="Url(item.id,index)">打开平面图</el-dropdown-item> -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>

                <div class="u-bread-btn-group f-pull-right">
                  <button class="u-bread-btn" @click.prevent="openDilog(item.id, index)">
                    选择房屋
                  </button>
                </div>
              </div>
              <!-- this.$set(this.planList[this.allocateIndex], '', res.data.allocateRangeGroupByRoomList) -->
              <div class="h-table">
                <el-table :data="item.allocateRangeGroupByRoomList" stripe style="width: 100%">
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
                <div v-show="item.allocateRangeGroupByRoomList.length =='0'" class="f-color-red u-tip-margintop">*方案房间不能为空</div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="table-bottom-btns f-hidden">
        <router-link to="/configure-manage-v2/room-approval/approval-list">
          <el-button class="u-submit-btn cancel-btn">取消</el-button>
        </router-link>
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitDataClick">保存</el-button>
      </div>
    </section>

    <!-- 选择房屋弹框 -->
    <el-dialog title="选择房屋" custom-class="h-dialog-add" :visible.sync="addRoomDialogShow" width="730px" @close="addRoomDialogClose">
      <el-form :model="ruleFormRoom" ref="ruleFormRoom" :rules="ruleFormRoom">
        <div class="m-search" style="margin-bottom:15px;">
          <table>
            <tr v-show="!isShow">
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getCourtyardNameList)">
                  <li>
                    <span>院落名称</span>
                    <el-input style="width:auto;" clearable v-model="ruleFormRoom.courtyardName" placeholder="请输入院落名称"></el-input>
                  </li>
                </ul>
              </td>
              <td class="u-search-but f-text-right">
                <el-button class="f-search-but" @click.native="getCourtyardNameList">查询</el-button>
              </td>
            </tr>
            <tr v-show="isShow">
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getroomlistDetail)">
                  <li>
                    <span>房间位置：</span>
                    <el-cascader placeholder="请选择房间位置" v-model="ruleFormRoom.roomLocation" clearable :options="roomList" filterable change-on-select></el-cascader>
                  </li>
                </ul>
              </td>
              <td class="u-search-but f-text-right">
                <el-button class="f-search-but" @click="getroomlistDetail">查询</el-button>
              </td>
            </tr>
          </table>
        </div>
        <div style="max-height:400px;overflow:auto;">
          <div class="h-table">
            <el-table v-show="!isShow" :data="courtryNameList" stripe style="width: 100%">
              <el-table-column label="序号" type="index" fixed="left" width="50">
              </el-table-column>
              <el-table-column label="院落名称" prop="courtyardName">
                <template slot-scope="scope">
                  <a @click="roomlistDetail(scope.row.courtyardId, scope.row.courtyardName)">{{ scope.row.courtyardName}}</a>
                </template>
              </el-table-column>
              <el-table-column label="地址" prop="courtyardAddress">
              </el-table-column>
              <el-table-column label="闲置建筑面积（㎡）" prop="buildAreaSum">
              </el-table-column>
              <el-table-column label="闲置使用面积（㎡）" prop="useAreaSum">
              </el-table-column>
              <el-table-column label="闲置房间数量（间）" prop="roomNum">
              </el-table-column>
            </el-table>
            <el-table v-show="isShow" ref="multipleTable" :data="houseroomlist" stripe style="width: 100% " @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="roomAddress" label="房间位置" width="120 "></el-table-column>
              <el-table-column label="房间号" width="120" prop="roomNo">
              </el-table-column>
              <el-table-column prop="buildArea" label="建筑面积（㎡）">
              </el-table-column>
              <el-table-column prop="useArea" label="使用面积（㎡）">
              </el-table-column>
            </el-table>
          </div>
          <!-- <div class="h-table aa" v-if="isShow">

          </div> -->
          <div class="f-margin-upd" v-show="isShow && multipleSelection.length > 0">合计：已选择房间数
            <span class="f-color-red">{{len}}</span>间，其中
            <span class="f-color-red">建筑面积为{{buildTotal || '0'}}㎡，使用面积为{{ userTotal || '0'}}㎡；</span>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" v-show="isShow" @click="goBackCouryYard">返回</el-button>
        <el-button class="u-submit-btn cancel-btn" @click="cancelClick">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveRoomData">保存</el-button>
      </div>
    </el-dialog>
    <!-- 选择房屋结束 -->
    <!-- 上传附件弹窗 -->
    <v-upload ref="VUpload" max="10" @vueUpload="fileUploadRequest"></v-upload>
    <!-- 新建方案 -->
    <el-dialog :title='titlePlan' custom-class="h-dialog-add" :visible.sync="dialogSchemeVisible" width="600px">
      <el-form :model="ruleSchemeForm" ref="ruleSchemeForm" :rules="ruleSchemeForm" label-position="right" label-width="100px">
        <el-form-item label="方案名称" prop="planName" :rules="{required: true, message: '方案名称不能为空', trigger: 'change'}">
          <el-input clearable v-model="ruleSchemeForm.planName" placeholder="方案名称" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="dialogSchemeVisible = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" :loading='loadingPlan' @click="schemeSaveClick">保存</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <approval-detail ref="approvalDetail"></approval-detail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <Y-Confirm v-model="PlanShow" title="提示" :message="message" @click="YConfirmClick"></Y-Confirm>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
import vuePopupUpload from "@/assembly/vue-popup-upload"; // 上传控件
import approvalDetail from '@/components/configure-manage-v2/room-approval/allocation-detail'; // 详情弹出框

export default {
  components: {
    "v-upload": vuePopupUpload,
    'approval-detail': approvalDetail
  },
  data() {
    let affiliatedCheckArea = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error("核定附属用房建筑面积为最多两位小数"));
        } else if (value > 1000000) {
          callback(new Error("核定附属用房建筑面积不能大于一百万"));
        } else {
          callback();
        }
      } else {
        callback(new Error("核定附属用房建筑面积核定不能为空"));
      }
    };
    let verification = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'officeCheckArea') {
        message = "核定办公用房面积";
      } else if (rule.fullField === 'serviceCheckArea') {
        message = "核定服务用房面积";
      } else if (rule.fullField === 'equipCheckArea') {
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
    return {
      officeApplyId: '',
      loading: false,
      loadingPlan: false,
      isHaveroom: false, //判断是否有房间
      addRoomDialogShow: false, // 选择房间
      YConfirmShow: false,
      PlanShow: false, //判断是否有方案
      YPromptShow: false,
      isBol: false,
      message: '',
      total: 0, // 数据总数
      pageSize: 200, // 数据最大值
      page: 1, // 当前页
      buildTotal: 0,
      userTotal: 0,
      len: 0, //选中数据条数
      taskId: '',
      procInstId: '',
      allocateId: '',
      courtyardId: '', //院落id
      radiobtn: '不推荐，手动分配', // 方案推荐
      dialogSchemeVisible: false, // 新建方案弹出框显示隐藏
      titlePlan: '', // 新建方案弹出框标题
      roomList: [], //房屋位置集合
      ruleForm: {
        organName: '', // 单位名称
        checkUserNum: '', //批复编制人数
        officeCheckArea: '', // 核定办公室使用面积 
        serviceCheckArea: '', // 核定服务用房使用面积
        equipCheckArea: '', // 核定设备用房使用面积
        affiliatedCheckArea: '', // 核定附属用房使用面积
        planType: '', // 
        remark: '', //备注
        fileList: []
      },
      ruleSchemeForm: {
        planName: '' // 方案名称
      },
      id: '', // 方案Id
      allocateIndex: '', // 修改当前方案的ID
      planList: [], // 方案数据
      historylist: [], //初始化数据
      saveData: [], //保存数据
      ruleFormRoom: {
        courtyardName: '', //院落名称
        roomLocation: [], //房间位置
        courtyardList: [], //院落集合
      },
      rules: {
        affiliatedCheckArea: [
          { required: true, validator: affiliatedCheckArea, trigger: "change" } //附属建筑面积
        ],
        officeCheckArea: [
          { required: false, validator: verification, trigger: "change" } // 核定办公室使用面积
        ],
        serviceCheckArea: [
          { required: false, validator: verification, trigger: "change" } //服务用房面积
        ],
        equipCheckArea: [
          { required: false, validator: verification, trigger: "change" } //设备用房面积
        ],
      },
      multipleSelection: [], // 选择的房间列表
      isShow: false, // 显示房间还是院落
      courtryNameList: [], // 院落集合
      houseroomlist: [], // 房间集合
      allSelectRoomList: [] // 选择的所有房间集合
    }
  },
  activated() {
    this.officeApplyId = this.$route.query.id;
    this.formKey = this.$route.query.formKey;
    this.planList = [];
    this.getDetailRequest(this.$route.query.id, this.$route.query.formKey);
    this.creatWebSocket();
  },
  deactivated() {
    this.ruleForm.fileList = [];
  },
  computed: {
    //基本核定面积
    basicArea() {
      let num = 0;
      num = parseFloat(Number(this.ruleForm.officeCheckArea) + Number(this.ruleForm.serviceCheckArea) + Number(this.ruleForm.equipCheckArea)).toFixed(2)
      return num;
    },
    totalArea() {
      let num = 0;
      num = parseFloat(this.basicArea / 0.65 + Number(this.ruleForm.affiliatedCheckArea))
      return num;
    }
  },
  methods: {
    //获取制定调配方案详情
    getDetailRequest(id) {
      let params = {
        id: id,
        platForm: 'manageSystem'
      }
      this.$axiosGet(API.officeapply_getApplyDetail, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.taskId = res.data.applyOrderDetail.taskId;
          this.procInstId = res.data.applyOrderDetail.procInstId;
          if (res.data.allocatePlan) {
            this.allocatePlanId = res.data.allocatePlan.id;
            this.ruleForm.organName = res.data.allocatePlan.organName;
            this.ruleForm.checkUserNum = res.data.allocatePlan.checkUserNum; //批复编制人数
            this.ruleForm.serviceCheckArea = res.data.allocatePlan.serviceCheckArea; //核定服务用房使用面积
            this.ruleForm.equipCheckArea = res.data.allocatePlan.equipCheckArea; //核定设备用房使用面积
            this.ruleForm.affiliatedCheckArea = res.data.allocatePlan.affiliatedCheckArea || '';//核定附属用房使用面积
            this.ruleForm.officeCheckArea = res.data.allocatePlan.officeCheckArea || '';//核定办公室使用面积
            this.ruleForm.planType = res.data.allocatePlan.planType || '';//配置方式
            this.ruleForm.remark = res.data.allocatePlan.remark || '';//备注
            if (res.data.allocatePlan.fileResponse) {
              res.data.allocatePlan.fileResponse.forEach((item, index) => {
                this.ruleForm.fileList.push({
                  name: item.name,
                  url: item.url
                })
              });
            } else {
              this.ruleForm.fileList = [];
            }
            let dataSelect = [];
            if (res.data.allocatePlan.allocatePlanDetailResponseList) {
              res.data.allocatePlan.allocatePlanDetailResponseList.forEach((item, index) => {
                dataSelect = [];
                item.courtyardWithRoomResponseList.forEach((room, roomindex) => {
                  dataSelect.push({
                    courtyardId: room.courtyardId,
                    choseRoomList: room.allocateRangeRoomList
                  })
                })
                this.planList.push({
                  id: item.id,
                  name: item.name,
                  allocateRangeGroupByRoomList: item.allocateRangeGroupByRoomList
                  // allSelectRoomList: item.allocateRangeRoomList
                })
                this.$set(this.planList[index], 'allSelectRoomList', dataSelect);
              })
            }
          }
        }
      });
    },
    // 详情
    approvalDetailClick(id, formKey) {
      this.$refs.approvalDetail.openModal(id, formKey);
    },
    //上传附件
    emptyFileJson() {
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
    // 打开方案弹出框
    openSchemeDilog(data, key) {
      if (data) {
        this.titlePlan = '修改方案';
        this.id = data.id;
        this.ruleSchemeForm.planName = data.name;
        this.allocateIndex = key;
      } else {
        this.titlePlan = '新建方案';
        this.id = '';
        this.ruleSchemeForm.planName = '';
        this.allocateIndex = '';
        this.$nextTick(() => {
          this.$refs.ruleSchemeForm.resetFields();
        })
      }
      this.dialogSchemeVisible = true;
    },
    //取消选择的房屋
    cancelClick() {
      // this.$refs.multipleTable.clearSelection();
      this.addRoomDialogShow = false;
    },
    // 保存方案
    schemeSaveClick() {
      this.$refs.ruleSchemeForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.id || '',
            name: this.ruleSchemeForm.planName, //分配方案的名称
            roomApplyId: this.officeApplyId, //申请单id
          }
          this.loadingPlan = true;
          this.$axiosJsonPost(API.officeapply_addPlan, params).then(res => {
            if (res.result === 'success') {
              this.isBol = true;
              if (this.id) {
                // this.$set(this.planList[this.allocateIndex], 'id', res.data.id)            
                this.$set(this.planList[this.allocateIndex], 'name', res.data.name)
                // this.$set(this.planList[this.allocateIndex], 'allocateRangeGroupByRoomList', res.data.allocateRangeGroupByRoomList)
                // this.$set(this.planList[this.allocateIndex], 'allocateRangeRoomList', res.data.allocateRangeRoomList)
                // try {
                //   this.ws.send(`newPrefix:${sessionStorage.getItem('userId')}:refresh:${this.id}`);
                // } catch (e) {
                //   let txt = ''
                // }
              } else {

                this.planList.push({
                  id: res.data.id,
                  name: res.data.name,
                  allocateRangeGroupByRoomList: res.data.allocateRangeGroupByRoomList,
                  allSelectRoomList: res.data.allocateRangeRoomList
                  // allocateRangeRoomList: res.data.allocateRangeRoomList
                })
              }
              this.$refs.ruleSchemeForm.resetFields()
              this.dialogSchemeVisible = false;
            } else {
              this.isBol = false;
              this.message = res.message;
              this.YPromptShow = true;
              this.loadingPlan = false;
              return false;
            }
            this.loadingPlan = false;
          })
        }
      })
    },
    creatWebSocket() {
      let txt = "";
      try {
        // this.ws = new WebSocket(`${LINKPATH.linkPath().webScoketPath}/webSocket/newPrefix${sessionStorage.getItem('userId')}`);
        this.ws.onopen = () => {
        };
        this.ws.onmessage = (evt) => {
          let data = JSON.parse(evt.data)
          if (data.command == 'refresh') {
            this.refreshPlan(data.businessId)
          }
        };
      } catch (e) {
        txt = ''
      }

    },
    refreshPlan(id) {
      let params = {
        id: id,
      }
      this.$axiosPost(API.officeapply_getPlanDetail, params).then(res => {
        if (id) {
          this.$set(this.planList[this.allocateIndex], 'id', id)
          this.$set(this.planList[this.allocateIndex], 'name', res.data.name)
          this.$set(this.planList[this.allocateIndex], 'allocateRangeGroupByRoomList', res.data.allocateRangeGroupByRoomList)
          // this.$set(this.planList[this.allocateIndex], 'allocateRangeRoomList', res.data.allocateRangeRoomList)
        }
      })
    },

    // 存储删除参数
    deleteClick(id, key) {
      this.id = id;
      this.allocateIndex = key;
      this.YConfirmShow = true;
    },
    // 删除方案
    YDeleteClick() {
      let params = {
        id: this.id
      }
      this.$axiosPost(API.officeapply_delPlan, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
          // let txt = '';
          // try {
          //   this.ws.send(`newPrefix:${sessionStorage.getItem('userId')}:refresh:${this.id}`);
          // }
          // catch (err) {
          //   txt = '页面有错误';
          // }
          // finally {
          this.planList.splice(this.allocateIndex, 1)
          // }
          // this.ws.send(`newPrefix:${sessionStorage.getItem('userId')}:refresh:${this.id}`);
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
        this.YConfirmShow = false;
      })
    },
    YPromptClick() {
      if (this.isBol && this.isBusy) {
        this.$router.push('/configure-manage-v2/room-approval/approval-list')
      }
    },
    // 选择房间位置弹出框
    openDilog(id, key) {
      this.getCourtyardNameList();
      this.ruleFormRoom.courtyardName = '';
      this.addRoomDialogShow = true;
      this.allSelectRoomList = [];
      this.allocateIndex = key;
      this.id = id;
    },
    // 保存房屋数据
    saveRoomData() {
      // this.$set(this.planList[this.allocateIndex], 'allSelectRoomList', this.allSelectRoomList);
      let roomIds = [];
      if (this.planList[this.allocateIndex].allSelectRoomList.length > 0) {
        this.planList[this.allocateIndex].allSelectRoomList.forEach((item, index) => {
          item.choseRoomList.forEach((room) => {
            roomIds.push(room.id)
          })
        });
      }
      let params = {
        id: this.id,
        roomApplyId: this.officeApplyId,
        roomIdList: roomIds
      }
      this.$axiosJsonPost(API.officeapply_addPlanRoom, params).then(res => {
        this.$set(this.planList[this.allocateIndex], 'allocateRangeGroupByRoomList', res.data.allocateRangeGroupByRoomList);
        // this.$set(this.planList[this.allocateIndex], 'allSelectRoomList', res.data.allocateRangeRoomList);
        // this.ws.send(`newPrefix:${sessionStorage.getItem('userId')}:refresh:${this.id}`);
      })
      this.addRoomDialogShow = false;
    },
    // 获取院落列表
    getCourtyardNameList() {
      let params = {
        courtyardName: this.ruleFormRoom.courtyardName || '',
        roomApplyId: this.officeApplyId
      };
      this.$axiosGet(API.officeapply_getCourtyardRoomData, params).then(res => {
        if (res.result === "success" && res.data) {
          this.courtryNameList = res.data.data;
        }
      }
      );
    },
    // 关闭新增房间弹出框
    addRoomDialogClose() {
      this.isShow = false;
    },
    //点击院落进入房间列表
    roomlistDetail(courtyardId, courtyardName) {
      this.ruleFormRoom.roomLocation = [];
      this.isShow = true;
      this.courtyardId = courtyardId;
      this.courtyardName = courtyardName;
      let params = {
        courtyardId: this.courtyardId || '',
        roomApplyId: this.officeApplyId
      }
      this.$axiosGet(API.officeapply_roomList, params).then(res => {
        if (res.result === 'success' && res.data) {
          this.getHouseData();
          this.total = res.data.total;
          this.houseroomlist = res.data.data;
          let defaultCheckNode = [], choseRoomList = [];
          if (this.planList[this.allocateIndex].allSelectRoomList) {
            this.planList[this.allocateIndex].allSelectRoomList.forEach((item, indexI) => {
              if (item.courtyardId == this.courtyardId) {
                choseRoomList = item.choseRoomList;
              }
            })
          }
          choseRoomList.forEach((choseRoom) => {
            this.houseroomlist.forEach((houseroom) => {
              if (houseroom.id == choseRoom.id) {
                defaultCheckNode.push(houseroom)
              }
            })
          })
          setTimeout(() => {
            defaultCheckNode.forEach((item, index) => {
              this.$refs.multipleTable.toggleRowSelection(item);
            })
          }, 0)
          this.saveData = defaultCheckNode;
        }
      })
    },
    //点击院落进入房间列表
    getroomlistDetail() {
      this.isShow = true;
      let params = {
        courtyardId: this.courtyardId || '',
        planType: '调剂' || '',
        roomApplyId: this.officeApplyId
      }
      this.$axiosJsonPost(API.officeapply_roomList, params).then(res => {
        if (res.result === 'success' && res.data) {
          this.total = res.data.total;
          this.houseroomlist = res.data.data;
          let defaultCheckNode = [], choseRoomList = [];
          this.saveData.forEach((choseRoom) => {
            this.houseroomlist.forEach((houseroom) => {
              if (houseroom.id == choseRoom.id) {
                defaultCheckNode.push(houseroom)
              }
            })
          })
          setTimeout(() => {
            defaultCheckNode.forEach((item, index) => {
              this.$refs.multipleTable.toggleRowSelection(item);
            })
          }, 0)
        }
      })
    },
    // 选择房间
    handleSelectionChange(selection) {
      this.buildTotal = 0;
      this.userTotal = 0;
      this.len = 0;
      this.multipleSelection = selection;
      this.len = this.multipleSelection.length || 0;
      this.multipleSelection.forEach((item, index) => {
        this.buildTotal = this.buildTotal + Number(item.buildArea);
        this.userTotal = this.userTotal + Number(item.useArea);
      })
      // 本方法会由roomlistDetail方法里面的toggleRowSelection促发
      if (this.planList[this.allocateIndex].allSelectRoomList) { // 判断如果已经存值了，就取值
        this.allSelectRoomList = this.planList[this.allocateIndex].allSelectRoomList;
        this.historylist = this.allSelectRoomList;
      }
      // 选择房间进行赋值
      if (this.allSelectRoomList.length == '0') {
        this.allSelectRoomList.push({
          courtyardId: this.courtyardId,
          choseRoomList: this.multipleSelection
        })
      } else {
        let isHas = false;
        this.allSelectRoomList.forEach((item, index) => {
          if (item.courtyardId == this.courtyardId) {
            isHas = true;
            this.$set(item, 'choseRoomList', this.multipleSelection)
          }
        })
        if (!isHas) {
          this.allSelectRoomList.push({
            courtyardId: this.courtyardId,
            choseRoomList: this.multipleSelection
          })
        }
      }
    },
    // 保存提交数据
    submitDataClick() {
      let planIds = [];
      let isHaveroom = false;
      let isHavePlan = false;
      if (this.planList.length > 0) {
        this.PlanShow = false;
        isHavePlan = true;
      } else {
        isHavePlan = false;
        this.PlanShow = true;
        this.message = "请先新建方案，否则无法保存"
      }
      if (this.planList.length > 0) {
        this.planList.forEach((item, index) => {
          planIds.push(item.id)
          if (item.allocateRangeGroupByRoomList.length > 0) {
            isHaveroom = true;
          } else {
            isHaveroom = false;
          }
        })
      }

      this.$refs.ruleForm.validate(valid => {
        if (valid && isHaveroom && isHavePlan) {
          let planRequest = {
            id: this.allocatePlanId || '', //修改制定调配方案
            organName: this.ruleForm.organName,
            checkUserNum: this.ruleForm.checkUserNum,
            planType: '调剂',
            officeCheckArea: this.ruleForm.officeCheckArea, //办公室核定面积
            serviceCheckArea: this.ruleForm.serviceCheckArea, //服务用房面积
            equipCheckArea: this.ruleForm.equipCheckArea, //设备用房面积核定
            allCheckArea: this.totalArea,
            affiliatedCheckArea: this.ruleForm.affiliatedCheckArea,
            remark: this.ruleForm.remark,

            fileRequestList: this.ruleForm.fileList

          }
          let params = {
            id: this.officeApplyId,  //申请单id
            platForm: 'manageSystem', // 提交的平台
            submitType: 'YES', //提交类型
            taskId: this.taskId,
            procInstId: this.procInstId, //审批流程id
            formKey: this.formKey,
            allocatePlanRequest: planRequest,
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
    YConfirmClick() {
      this.PlanShow = false;
    },
    //房屋位置下拉
    getHouseData() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.officeapply_getRoomSelect, params).then(res => {
        if (res.data) {
          this.roomList = res.data || [];
        } else {
          this.roomList = [];
        }
      })
    },
    // 返回院落
    goBackCouryYard() {
      this.isShow = !this.isShow;
    }
  }
}
</script>

<style lang="scss" scoped>
.u-tip-margintop {
  margin-top: 5px;
}
.icon-gengduo {
  margin-left: 10px;
  color: #2f70ff;
}
.u-p-line {
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 15px;
  .u-p-style {
    position: absolute;
    background: #fff;
    font-weight: bold;
    padding: 5px 10px 5px 0;
    top: -13px;
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
  }
}
.u-padding {
  padding-top: 10px;
}
</style>