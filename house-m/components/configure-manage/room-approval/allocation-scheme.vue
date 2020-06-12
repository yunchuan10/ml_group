<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="title"></Y-Breadcrumb>
      </div>
      <div class="el-steps-item">
        <el-steps :active="2" finish-status="success" align-center>
          <el-step title="用房申请"></el-step>
          <el-step title="编制调配方案"></el-step>
        </el-steps>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>办公用房面积核定（㎡）</th>
              <td>
                <el-form-item prop="verification">
                  <el-input clearable v-model="ruleForm.verification" placeholder="请输入办公用房面积核定"></el-input>
                </el-form-item>
              </td>
            <tr>
              <th>
                <i class="f-color-red">*</i>配置方案</th>
              <td>
                <el-form-item prop="configuration">
                  <el-radio-group v-model="ruleForm.configuration">
                    <el-radio label="调剂"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>拟调配办公地址</th>
              <td>
                <el-form-item prop="officeaddress" :rules="{required: true, message: '拟调配办公地址不能为空', trigger: 'change'}">
                  <el-input clearable v-model="ruleForm.officeaddress" :maxlength="40" placeholder="请输入拟调配办公地址"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>补充说明</th>
              <td>
                <el-form-item prop="messageFee">
                  <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.messageFee" placeholder="请输入补充说明"> </el-input>
                  <div style="text-align: right;">{{ruleForm.messageFee?ruleForm.messageFee.length:0}}/200</div>
                </el-form-item>
              </td>
            </tr>
            <!-- <tr>
              <th>上传附件</th>
              <td>
                <el-button class="u-upload-btn" @click="emptyFileJson">
                  <i class="iconfont icon-daochu"></i>上传附件</el-button>
                <ul class="u-file">
                  <li v-for=" (item, index) in fileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                    <a class="ahover" @click="deleteFileNameList(index)" href="javascript:;">删除</a>
                  </li>
                </ul>
              </td>
            </tr> -->
          </table>
          <div class="el-radio-item f-relative">
            <el-radio-group v-model="centralize">
              <el-radio-button @click="centralize ==='集中办公'" label="集中办公" disabled>集中办公
                <el-tooltip placement="top">
                  <div slot="content">是指房屋分布在同一个楼座<br />（同一个院落）</div>
                  <div class="el-radio-tips">
                    <i class="iconfont icon-gantanhao"></i>
                  </div>
                </el-tooltip>
              </el-radio-button>
              <el-radio-button @click="centralize ==='相对集中'" label="相对集中" disabled> 相对集中
                <el-tooltip placement="top">
                  <div slot="content">是指房屋分布在同一个院落<br />（两个院落，且院落间距不超过XX千米）</div>
                  <div class="el-radio-tips">
                    <i class="iconfont icon-gantanhao"></i>
                  </div>
                </el-tooltip>
              </el-radio-button>
              <el-radio-button label="不推荐，直接分配">不推荐，直接分配
              </el-radio-button>
            </el-radio-group>
            <!-- <div class="u-bread-btn-group u-rules">
              <button class="u-bread-btn" @click.prevent="openDilog">规则设置
                <el-tooltip placement="top">
                  <div slot="content">您可以通过“规则设置”自定义集中办公和相对集中,<br />同时系统在此基础上为您自动推荐适合的房源</div>
                  <div class="el-radio-tips">
                    <i class="iconfont icon-gantanhao"></i>
                  </div>
                </el-tooltip>
              </button>
            </div> -->
          </div>

          <!-- <div class="u-table-content" v-show="centralize ==='集中办公'">
            <div class="el-row-padding">
              <el-row>
                <el-button plain>推荐方案1</el-button>
                <el-button plain>推荐方案2</el-button>
              </el-row>
            </div>
            <div class="f-relative f-text-center">
              <h2 class="h-table-subtitle f-absolute left20">
                <span></span>滁州市政务中心</h2>
              <span class="f-color-red">* 以下所有房间均为闲置状态！</span>
            </div>

            <div class="h-table">
              <el-table :data="courtryardlist" stripe style="width: 100%" show-summary :summary-method="getSummaries">
                <el-table-column fixed="left" type="selection" @selection-change="handleSelectionChange" label="全选" width="50">
                </el-table-column>
                <el-table-column label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="楼座名称">
                </el-table-column>
                <el-table-column label="楼层名称">
                </el-table-column>
                <el-table-column label="房间号">
                </el-table-column>
                <el-table-column label="房间类型">
                </el-table-column>
                <el-table-column label="房间面积（㎡）">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>
            <div class="table-bottom-btns f-hidden">
              <router-link to="/configure-manage/room-approval/approval-list">
                <el-button class="u-submit-btn cancel-btn">取消</el-button>
              </router-link>
              <el-button class="u-submit-btn submit-btn" :loading="loading">保存</el-button>
            </div>
          </div> -->
          <!-- <div class="u-table-content" v-show="centralize === '相对集中'">
            <div class="el-row-padding">
              <el-row>
                <el-button plain>推荐方案1</el-button>
                <el-button plain>推荐方案2</el-button>
              </el-row>
            </div>
            <h2 class="h-table-subtitle">
              <span></span>办公用房闲置情况</h2>
            <div class="h-table">
              <el-table :data="list" stripe style="width: 100%">
                <el-table-column label="序号" fixed="left" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="院落名称">
                </el-table-column>
                <el-table-column label="闲置房间（间）">
                </el-table-column>
                <el-table-column label="闲置面积（㎡）">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>
            <div class="h-table">
              <el-table :data="list" stripe style="width: 100%">
                <el-table-column fixed="left" type="selection" @selection-change="handleSelectionChange" label="全选" width="50">
                </el-table-column>
                <el-table-column label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="楼座名称">
                </el-table-column>
                <el-table-column label="楼层名称">
                </el-table-column>
                <el-table-column label="房间号">
                </el-table-column>
                <el-table-column label="房间类型">
                </el-table-column>
                <el-table-column label="使用面积（㎡）">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>

            <h2 class="h-table-subtitle">
              <span></span>方案明细</h2>
            <div class="h-table">
              <el-table :data="roomlist" stripe style="width: 100%">
                <el-table-column label="序号" fixed="left" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="院落名称">
                </el-table-column>
                <el-table-column label="楼座名称">
                </el-table-column>
                <el-table-column label="楼层名称">
                </el-table-column>
                <el-table-column label="房间号">
                </el-table-column>
                <el-table-column label="使用面积（㎡）">
                </el-table-column>
                <el-table-column label="操作">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>
            <div class="table-bottom-btns f-hidden">
              <router-link to="/configure-manage/room-approval/approval-list">
                <el-button class="u-submit-btn cancel-btn">取消</el-button>
              </router-link>
              <el-button class="u-submit-btn submit-btn" :loading="loading">保存</el-button>
            </div>
          </div> -->
          <div class="u-table-content" v-show="centralize === '不推荐，直接分配'">
            <div class="margin-15 f-hidden">
              <h2 class="h-table-subtitle f-pull-left">
                <span></span>办公用房闲置情况</h2>
              <div class="f-pull-right">
                <el-button class="u-submit-btn cancel-btn" v-show="isShow" @click="goBackCouryYard">返回</el-button>
              </div>
            </div>
            <div class="h-table" v-show="!isShow">
              <el-table :data="houselist" stripe style="width: 100%">
                <el-table-column label="序号" fixed="left" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="院落名称" prop="courtyardName">
                  <template slot-scope="scope">
                    <a @click="roomlistDetail(scope.row.courtyardId, scope.row.courtyardName)">{{ scope.row.courtyardName}}</a>
                  </template>
                </el-table-column>
                <el-table-column label="闲置房间（间）" prop="roomNum">
                </el-table-column>
                <el-table-column label="闲置面积（㎡）" prop="idleArea">
                </el-table-column>
              </el-table>
            </div>
            <div class="h-table" v-show="isShow">
              <el-table :data="houseroomlist" tooltip-effect="dark" style="width: 100%" ref="multipleTable" @select-all="handleAllSelectionChange" @select="handleSelectionChange">
                <el-table-column type="selection" fixed="left" width="50">
                </el-table-column>
                <el-table-column label="楼座名称" prop="floorName">
                </el-table-column>
                <el-table-column label="楼层名称" prop="storeysName">
                </el-table-column>
                <el-table-column label="房间号" prop="roomNo">
                </el-table-column>
                <el-table-column label="使用面积（㎡）" prop="userArea">
                </el-table-column>
              </el-table>
            </div>
            <div class="h-table-bottom f-clearfix">
              <div class="h-table-pages f-pull-right">
                <div class="block">
                  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </div>
              </div>
            </div>
            <div class="margin-15">
              <h2 class="h-table-subtitle">
                <span></span>方案明细</h2>
            </div>
            <div class="h-table">
              <el-table :data="allSelectList" stripe style="width: 100%">
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column label="院落名称" prop="courtyardName">
                </el-table-column>
                <el-table-column label="楼座名称" prop="floorName">
                </el-table-column>
                <el-table-column label="楼层名称" prop="storeysName">
                </el-table-column>
                <el-table-column label="房间号" prop="roomNo">
                </el-table-column>
                <el-table-column label="使用面积（㎡）" prop="userArea">
                </el-table-column>
              </el-table>
              <div class="u-total">已勾选房间数量{{allSelectList.length}}间，使用面积：{{count}}㎡</div>
            </div>
            <div v-show="allSelectList.length == 0" style="font-size:12px;color:#F56C6C;">请点击院楼勾选房间，才能提交。</div>
            <div class="table-bottom-btns f-hidden">
              <router-link to="/configure-manage/room-approval/approval-list">
                <el-button class="u-submit-btn cancel-btn">取消</el-button>
              </router-link>
              <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitDataClick">保存</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </section>

    <el-dialog title="规则设置" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <span class="f-weight-bold">集中办公</span>
        <el-form-item label="房屋分布范围" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="同一个楼座"></el-radio>
            <el-radio label="同一个院落"></el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="f-weight-bold">相对集中</span>
        <el-form-item label="房屋分布范围" prop="limits">
          <el-radio-group v-model="ruleForm.limits">
            <el-radio label="同一个楼座"></el-radio>
            <el-radio label="同一个院落"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="院落间距">
          <el-input placeholder="请输入内容" v-model="interval">
            <template slot="append">千米以内</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>

    <!-- 上传附件弹窗 -->
    <v-upload ref="VUpload" max="10" @vueUpload="fileUploadRequest"></v-upload>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件

export default {
  components: {
    'v-upload': vuePopupUpload
  },
  data() {
    let verification = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'upFloorNumber') {
        message = '地上建筑层数'
      } else if (rule.fullField === 'downFloorNumber') {
        message = '地下建筑层数'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error('办公用房面积核定为最多两位小数'))
        } else if (value > 1000000) {
          callback(new Error('办公用房面积核定不能大于一百万平方'))
        } else {
          callback();
        }
      } else {
        callback(new Error('办公用房面积核定不能为空'))
      }
    }
    return {
      isClose: false, //标记是否修改
      isShow: false,
      loading: false,
      interval: '', //间距
      centralize: '不推荐，直接分配',
      userArea: '', //使用面积
      roomId: '', //房间id
      roomIds: [], //房间id集合
      fileList: [], //上传文件集合
      dialogFormVisible: false,
      title: '',
      list: [],
      courtryardlist: [], // 院落列表集合
      roomlist: [], //房间列表集合
      houselist: [], //办公用房闲置情况列表集合
      houseroomlist: [],
      multipleSelection: [], // 复选框选的值
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      ruleForm: {
        configuration: '调剂', //配置方案
        verification: '', //核定面积
        messageFee: '', //补充说明
        officeaddress: ''
      },
      YConfirmShow: false, // 删除弹出框
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      rules: {
        verification: [
          { required: true, validator: verification, trigger: 'change' }
        ],
        configuration: [
          { required: true, message: '配置方案不能为空', trigger: 'change' }
        ]
      },
      courtyardName: '',
      historyList: [],
      allSelectMap: [],
      allSelectList: [], // 全部选择的房间
      officeApplyId: '',
      taskId: '',
      procInstId: '',
      formKey: '',
      allocateId: '',
      originTotal: 0
    };
  },
  activated() {
    this.isShow = false;
    this.officeApplyId = this.$route.query.id;
    this.formKey = this.$route.query.formKey;
    this.getDetailRequest(this.$route.query.id, this.$route.query.formKey);
    this.getDataRequest();
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.allSelectList = [];
  },
  computed: {
    count() {
      let num = 0;
      this.allSelectList.forEach((item, index) => {
        num += parseFloat(item.userArea);
      })
      return num;
    }
  },
  methods: {
    // 保存提交数据
    submitDataClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid && this.allSelectList.length > 0) {
          let roomIds = [];
          this.allSelectList.forEach((item, index) => {
            roomIds.push(item.roomId)
          })
          this.loading = true;
          let params = {
            platForm: 'manageSystem',
            officeApplyId: this.officeApplyId,
            submitType: 'YES',
            taskId: this.taskId,
            procInstId: this.procInstId,
            formKey: this.formKey,
            allocateId: this.allocateId,
            checkArea: this.ruleForm.verification,
            planType: this.ruleForm.configuration,
            planOfficeAddress: this.ruleForm.officeaddress,
            remark: this.ruleForm.messageFee,
            fileStrings: JSON.stringify(this.fileList),
            roomIds: JSON.stringify(roomIds)
          }
          this.$axiosPost(API.officeapply_completeHouseOfficeTask, params).then(res => {
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
      })
    },
    //获取审批详情
    getDetailRequest(id) {
      let params = {
        id: id,
        platForm: 'manageSystem',
      }
      this.$axiosGet(API.officeapply_getApplyDetail, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.taskId = res.data.applyOrderDetail.taskId;
          this.procInstId = res.data.applyOrderDetail.procInstId;
          if (res.data.allocatePlan) {
            this.allocateId = res.data.allocatePlan.allocateId;
            this.ruleForm.configuration = res.data.allocatePlan.planType;
            this.ruleForm.verification = res.data.allocatePlan.checkArea;
            this.ruleForm.messageFee = res.data.allocatePlan.remark;
            this.ruleForm.officeaddress = res.data.allocatePlan.planOfficeAddress;
            this.allSelectList = res.data.allocatePlan.roomBaseResponseList;
            this.historyList = this.allSelectList;
          }
        }
      });
    },
    goBackCouryYard() {
      this.isShow = !this.isShow;
      this.total = this.originTotal;
      this.page = this.originPage;
      this.historyList = this.allSelectList;
    },
    //上传附件
    emptyFileJson: function () {
      if (this.fileList.length < 10) {
        this.$refs.VUpload.openModal(this.fileList);
      } else {
        this.isBol = false;
        this.isClose = false;
        this.message = '最多只能上传10个文件';
        this.promptDialog = true;
      }
    },
    fileUploadRequest(fileList) { // 附件上传请求接口
      fileList.forEach(value => {
        this.fileList.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList: function (index) { // 删除附件
      this.fileList.splice(index, 1)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
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
          sums[index] += ' 元';
        } else {
          sums[index] = 'N/A';
        }
      });

      return sums;
    },
    openDilog() {
      this.dialogFormVisible = true;
    },
    handleSelectionChange(selection, row) {
      this.multipleSelection = selection;
      if (this.allSelectMap.length == '0') {
        this.allSelectMap.push({
          courtyardName: this.courtyardName,
          choseRoomList: this.multipleSelection
        })
      } else {
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
      }
      // this.allSelectList = [];
      // this.allSelectMap.forEach((item, indexI) => {
      //   if (item.choseRoomList.length > 0) {
      //     item.choseRoomList.forEach((room, indexJ) => {
      //       this.allSelectList.push(room)
      //     })
      //   }
      // })
      let isAddRoom = true;
      this.allSelectList.forEach((item, index) => {
        if (item.roomId == row.roomId) {
          this.allSelectList.splice(index, 1);
          isAddRoom = false;
        }
      })
      if (isAddRoom) {
        this.allSelectList.push(row)
      }
    },
    handleAllSelectionChange(selection) {
      let list = [];
      this.allSelectList.forEach((item, index) => {
        if (item.courtyardName != this.courtyardName) {
          list.push(item)
        }
      })
      if (selection.length > 0) {
        this.allSelectList = list.concat(selection);
      } else {
        this.allSelectList = list;
      }
    },
    roomlistDetail(courtyardId, courtyardName) {
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
    },
    // 获取院落信息
    getDataRequest() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        officeApplyId: this.officeApplyId
      }
      this.$axiosPost(API.officeapply_getCourtyardRoomData, params).then(res => {
        if (res.result === 'success' && res.data) {
          this.total = res.data.total;
          this.originTotal = res.data.total;
          let list = res.data.data;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.houselist = list;
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/configure-manage/room-approval/approval-list')
        }
      }, 1000)
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>

<style lang="scss" scoped>
.u-file {
  margin: 5px 0;
  li {
    float: left;
    display: inline-block;
    line-height: 26px;
  }
}
.el-row-padding {
  padding: 0 0 20px 20px;
}
.iconfont {
  font-size: 6px;
}
.u-rules {
  position: absolute;
  right: 10px;
  top: 0;
}
.left20 {
  left: 20px;
}
.h-table {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}
.u-total {
  border-bottom: 1px solid #dcdfe6;
  padding: 15px;
}

//左边距
.margin-15 {
  margin: 0 15px 15px;
}
</style>
