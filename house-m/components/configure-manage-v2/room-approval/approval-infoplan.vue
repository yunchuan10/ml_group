<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" @close="celarForm" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>审批</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <p class="u-detail-p">申请单号：{{orderNo}}</p>
          <p class="u-detail-p">申请提交时间：{{createdAt}}</p>
          <div class="h-tab-content" v-show="pageSelect == 'basic'">
            <table class="h-table-info">
              <tr>
                <th class="f-text-right" width="330px">单位名称</th>
                <td>{{organName}}
                </td>
                <th class="f-text-right">批复编制人数</th>
                <td>{{checkUserNum}}人</td>
              </tr>
              <tr>
                <th class="f-text-right">核定办公室使用面积</th>
                <td>
                  <span v-show='officeCheckArea !==null'>{{officeCheckArea ? officeCheckArea+'㎡': ''}}</span>

                </td>
                <th class="f-text-right">核定服务用房使用面积</th>
                <td>{{serviceCheckArea ? serviceCheckArea+'㎡': ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">核定设备用房使用面积</th>
                <td>{{equipCheckArea ? equipCheckArea+'㎡': ''}}
                </td>
                <th class="f-text-right">核定基本办公用房使用面积</th>
                <td>{{basicArea ? basicArea+'㎡': ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">核定附属用房建筑面积</th>
                <td>{{affiliatedCheckArea ? affiliatedCheckArea+'㎡': ''}}
                </td>
                <th class="f-text-right">总核定面积</th>
                <td>{{totalArea | dot2}}㎡</td>
              </tr>
              <tr>
                <th class="f-text-right">配置方式</th>
                <td colspan="3">{{planType}}
                </td>
              </tr>
              <tr>
                <th class="f-text-right">备注</th>
                <td colspan="3">{{remark || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <ul>
                    <li style="display: block;" v-for=" (item, index) in fileUrls" :key="index">{{index+1}}、{{item.name}}
                      <a target="_blank" :href="item.url">预览</a>
                    </li>
                  </ul>
                </td>
              </tr>
            </table>
            <div>备选方案</div>
            <div v-for="(item,index) in roomBaseResponseList" :key="index">
              <h2 class="h-table-subtitle" style="margin: 10px 0;">
                <span></span>{{item.name}}
                <div class="u-bread-btn-group f-pull-right">
                  <!-- <button class="f-pull-right u-bread-btn" @click="Url(item.id)">
                    查看平面图
                  </button> -->
                </div>
              </h2>
              <div class="h-table f-relative">
                <el-table :data="item.allocateRangeGroupByRoomList" stripe style="width: 100%">
                  <el-table-column label="院落名称" prop="courtyardName"></el-table-column>
                  <el-table-column label="地址" prop="courtyardAddress"></el-table-column>
                  <el-table-column label="楼座" prop="floorName"></el-table-column>
                  <el-table-column label="建筑面积（㎡）" prop="buildAreaSum"></el-table-column>
                  <el-table-column label="使用面积（㎡）" prop="useAreaSum"></el-table-column>
                  <el-table-column label="房间数量（间）" prop="roomNum"></el-table-column>
                  <el-table-column label="房间明细" prop="roomNos"></el-table-column>
                </el-table>
              </div>
            </div>
            <table class="h-table-info">
              <tr class="filling">
                <td colspan="4"></td>
              </tr>
              <tr class="status">
                <th>审批结果</th>
                <td colspan="3">
                  <el-form-item prop="submitType">
                    <el-radio-group v-model="ruleForm.submitType">
                      <el-radio label="YES">审批通过</el-radio>
                      <el-radio label="NO">审批不通过</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr class="status" v-if="ruleForm.submitType == 'YES'">
                <th>
                  <i class="f-color-red">*</i>选定方案</th>
                <td colspan="3">
                  <el-form-item prop="scheme">
                    <el-radio-group v-model="ruleForm.scheme">
                      <el-radio v-for="(item,index) in roomBaseResponseList" :key="index" :label="item.id">{{item.name}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr class="status" v-if="ruleForm.submitType == 'NO'">
                <th>
                  <i class="f-color-red">*</i>备注</th>
                <td colspan="3">
                  <el-form-item prop="note">
                    <el-input type="textarea" v-model="ruleForm.note" :rows="3" :maxlength="200" placeholder="请输入备注"> </el-input>
                  </el-form-item>
                  <div style="text-align: right;">{{ruleForm.note.length}}/200</div>
                </td>
              </tr>
              <tr class="status" v-if="ruleForm.submitType == 'YES'">
                <th>备注</th>
                <td colspan="3">
                  <el-input type="textarea" v-model="ruleForm.note" :rows="3" :maxlength="200" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.note.length}}/200</div>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </div>
      <div class="el-dialog__footer" v-if="pageSelect == 'basic'">
        <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="submitClick">保存</el-button>
      </div>
    </el-dialog>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSelect: 'plan',
      loading: false,
      carDetailShow: false, // 弹出框开关
      orderNo: '', // 订单号
      createdAt: '', // 创建时间
      organType: '', // 单位性质 
      organName: '',// 单位名称
      checkUserNum: '',//批复人数
      officeCheckArea: '',//核定办公用房面积
      serviceCheckArea: '',//服务设备用房面积
      equipCheckArea: '', //设备用房面积核定
      affiliatedCheckArea: '', //附属用房面积核定
      remark: '',//备注
      planType: '',//配置类型 
      fileUrls: [], //附件集合        
      procInstId: '', // 任务id
      taskId: '', // 流程实例id
      formKey: '', // 制定调配方案
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      commontHis: [],
      ruleForm: {
        submitType: 'YES',
        scheme: '', //方案
        note: ''
      },
      rules: {
        note: [{ required: true, message: '请填写备注', trigger: 'change' }],
        scheme: [{ required: true, message: '请选择调配方案', trigger: 'change' }]
      },
      allocatePlan: {},
      roomBaseResponseList: []
    };
  },
  activated() { },
  computed: {
    //基本核定面积
    basicArea() {
      let num = 0;
      num = parseFloat(Number(this.officeCheckArea) + Number(this.serviceCheckArea) + Number(this.equipCheckArea))
      return num;
    },
    totalArea() {
      let num = 0;
      num = parseFloat(this.basicArea / 0.65 + Number(this.affiliatedCheckArea))
      return num;
    }
  },
  methods: {
    celarForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 初始化弹出框
    openModal(id, formKey) {
      this.officeApplyId = id;
      this.formKey = formKey;
      if (this.formKey != '') {
        this.pageSelect = 'basic';
      }
      this.getDataRequest(id, formKey);
      this.carDetailShow = true;
    },
    //获取审批详情
    getDataRequest(id) {
      let params = {
        id: id,
        platForm: 'manageSystem',
      }
      this.$axiosGet(API.officeapply_getApplyDetail, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.taskId = res.data.applyOrderDetail.taskId;
          this.procInstId = res.data.applyOrderDetail.procInstId;
          this.orderNo = res.data.applyOrderDetail.orderNo;
          this.createdAt = res.data.applyOrderDetail.createdAt.substr(0, 10);
          if (res.data.allocatePlan) {
            this.allocatePlan = res.data.allocatePlan;
            this.organName = this.allocatePlan.organName;
            this.checkUserNum = this.allocatePlan.checkUserNum;
            this.officeCheckArea = this.allocatePlan.officeCheckArea || '0';
            this.serviceCheckArea = this.allocatePlan.serviceCheckArea || '0';
            this.equipCheckArea = this.allocatePlan.equipCheckArea || '0';
            this.affiliatedCheckArea = this.allocatePlan.affiliatedCheckArea || '0';
            this.planType = this.allocatePlan.planType;
            this.remark = this.allocatePlan.remark;
            this.fileUrls = this.allocatePlan.fileResponseList;
            this.roomBaseResponseList = this.allocatePlan.allocatePlanDetailResponseList;
          } else {
            this.officeCheckArea = ''
          }
        }
      });
    },
    //  审批提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            platForm: 'manageSystem',
            id: this.officeApplyId,
            submitType: this.ruleForm.submitType,
            checkedAllocatePlanDetailId: this.ruleForm.submitType == 'YES' ? this.ruleForm.scheme : '',
            taskId: this.taskId,
            procInstId: this.procInstId,
            message: this.ruleForm.note,
            formKey: this.formKey
          }
          this.loading = true;
          this.$axiosJsonPost(API.officeapply_completeHouseOfficeTask, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '配置管理', '用房申请审批')
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.carDetailShow = false;
        this.$emit('updateplan');
      }
    }
  }
};
</script>
<style lang="scss">
</style>

