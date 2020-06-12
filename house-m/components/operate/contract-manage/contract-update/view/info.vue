<template>
  <div>
    <div class="h-table-title">
      <p class="f-color-red">（*为必填项，请检查后提交！)</p>
    </div>
    <div class="h-tab-content">
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <table class="h-table-info">
          <tr>
            <th>
              <i class="f-color-red">*</i>合同编号</th>
            <td>
              <el-form-item prop="contractNo">
                <el-input :maxlength="40" clearable placeholder="请输入" v-model="ruleForm.contractNo"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <i class="f-color-red">*</i>合同开始日期</th>
            <td>
              <el-form-item prop="contractStartDate">
                <el-date-picker v-model="ruleForm.contractStartDate" type="date" @change="getEnd" placeholder="选择日期">
                </el-date-picker>
                <!-- <el-date-picker v-model="ruleForm.startEndTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker> -->
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              <i class="f-color-red">*</i>合同期限：</th>
            <td>
              <el-form-item prop="contractDeadline">
                <el-input v-model="ruleForm.contractDeadline" :maxlength="40" clearable placeholder="请输入" @change="getEnd">
                  <template slot="append">年</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>合同结束日期</th>
            <td>
              <!-- <el-form-item>
                <el-input :maxlength="40" clearable v-model="contractEndDate" :disabled="true"></el-input>
              </el-form-item> -->
              {{contractEndDate}}

            </td>
          </tr>
          <tr>
            <th>
              <i class="f-color-red">*</i>合同标的物</th>
            <td class="f-relative">
              <el-form-item prop="subject" class="f-absolute" style="width: calc(100% - 20px)">
                <el-input v-model="ruleForm.subject" disabled placeholder="请选择合同标的物" @func="getMsgFormSon"></el-input>
              </el-form-item>
              <a @click="subjectInfoClick" style="position:relative;display: block;width: 100%;height:40px;"></a>
            </td>
          </tr>
          <tr>
            <th>
              <i class="f-color-red">*</i>合同租金</th>
            <td>
              <el-form-item prop="contractRental">
                <el-input clearable v-model="ruleForm.contractRental" placeholder="请输入">
                  <template slot="append">元/年</template>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>出租方</th>
            <td>
              {{organName}}
            </td>
          </tr>
          <tr>
            <th>
              <i class="f-color-red">*</i>承租人</th>
            <td>
              <el-form-item prop="lesseeName">
                <!-- <el-input clearable v-model="ruleForm.dealLesseeManageId" placeholder="请输入">
                </el-input> -->
                <el-select v-model="ruleForm.lesseeName" filterable clearable placeholder="请选择承租人">
                  <el-option v-for="item in getLesseeList" :key="item.dealLesseeManageId" :label="item.lesseeName" :value="item.dealLesseeManageId">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <th>
              <i class="f-color-red">*</i>合同状态</th>
            <td>
              <el-form-item prop="dicValue">
                <el-select v-model="ruleForm.dicValue" filterable clearable placeholder="请选择合同状态">
                  <el-option v-for="item in contractStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr> -->
        </table>

        <div class="table-bottom-btns f-hidden">
          <router-link to="/operate/contract-manage/contractinfo-list">
            <el-button class="u-submit-btn cancel-btn">
              取消
            </el-button>
          </router-link>
          <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
        </div>
      </el-form>
    </div>
    <!-- 合同标的物 -->
    <contract-subject ref="contractSubject" @getMsgFormSon='getMsgFormSon'></contract-subject>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import contractSubject from '@/components/operate/contract-manage/contract-update/contract-subject'; // 合同标的物
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
export default {
  components: {
    'v-uploadPicture': vueUploadPicture,
    'contract-subject': contractSubject,
  },
  data() {
    let self = this;

    return {
      loading: false,
      id: '', // 新增返回的id
      contractStartDate: '', //合同开始日期
      contractDeadline: '', //合同期限
      contractEndDate: '', //合同结束日期
      contractRental: '', //合同租金
      dealLesseeManageId: '', //承租人主键
      subject: '',//合同标的物
      contractStatusList: [], //合同状态下拉
      getLesseeList: [], //承租人下拉

      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtySelectList: [],  //院落名称集合
      houseStructure: [], //建筑结构集合
      paramsType: '新增', //页面标题显示
      chuancan: [], //传递的数组
      ruleForm: {
        subject: '', //合同标的物
        contractNo: '', //合同编号        
        imgUrls: [],  //上传图片集合
        contractStartDate: '', //合同开始日期
        contractDeadline: '', //合同期限
        contractRental: '',//合同租金
        // dealLesseeManageId: '', //承租人主键
        lesseeName: '', //承租人
        dicValue: '', //合同状态
      },

      rules: {
        contractNo: [
          { required: true, message: '合同名称不能为空', trigger: 'change' }
        ],
        contractStartDate: [
          { required: true, message: '合同日期不能为空', trigger: 'change' }
        ],
        contractDeadline: [
          { required: true, message: '年限不能为空', trigger: 'change' }
        ],
        contractRental: [
          { required: true, message: '合同租金不能为空', trigger: 'change' }
        ],
        lesseeName: [
          { required: true, message: '承租人不能为空', trigger: 'change' }
        ],
        subject: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],

        dicValue: [
          { required: true, message: '合同状态不能为空', trigger: 'change' }
        ],
      }

    };
  },
  computed: {
    realName() {
      return this.$store.state.mainData.realName;
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    areaName() {
      return this.$store.state.mainData.areaName;
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.getSelectRequest();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.floorId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = '修改';
    } else {
      this.paramsType = '新增';
    }
  },
  deactivated() {
    this.ruleForm.courtyardId = '';
    this.ruleForm.floorName = '';
    this.ruleForm.dicValue = '';
    this.ruleForm.builtArea = '';
    this.ruleForm.architecturalDate = '';
    this.ruleForm.putUseDate = '';
    this.ruleForm.upFloorNumber = '';
    this.ruleForm.downFloorNumber = '';
    this.ruleForm.completionDate = '';
    this.ruleForm.imgUrls = [];
  },
  methods: {
    // 合同标的物的弹框
    subjectInfoClick() {

      this.$refs.contractSubject.openModal();
    },
    // 新增、修改楼座
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            contractNo: this.ruleForm.contractNo,  //合同编号 
            contractStartDate: FORMATGET.formatGET(this.ruleForm.contractStartDate), //合同开始日期 
            contractDeadline: this.ruleForm.contractDeadline, //合同期限 
            contractEndDate: this.contractEndDate,//合同结束日期 
            contractSubjects: this.chuanzhi,//合同标的物主键 
            contractRental: this.ruleForm.contractRental,//合同租金 
            rentPersonId: this.$store.state.mainData.organName,//出租方 
            dealLesseeManageId: this.ruleForm.lesseeName,//承租人主键 
            contractStatus: this.ruleForm.dicValue, //合同状态
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.floor_update;
          } else {
            url = API.contract_addContract;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            this.id = res.data.contractId;
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
      this.id
    },
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {
        floorId: this.floorId
      }
      this.$axiosPost(API.floor_updateDetail, params).then(res => {
        this.ruleForm.floorId = res.data.floorId;
        this.ruleForm.courtyardId = res.data.courtyardId;
        this.ruleForm.floorName = res.data.floorName;
        this.ruleForm.dicValue = res.data.houseStructure;
        this.ruleForm.builtArea = res.data.builtArea.toString();
        this.ruleForm.architecturalDate = res.data.architecturalDate;
        this.ruleForm.putUseDate = res.data.putUseDate;
        this.ruleForm.upFloorNumber = res.data.upFloorNumber.toString();
        this.ruleForm.downFloorNumber = res.data.downFloorNumber.toString();
        this.ruleForm.completionDate = res.data.completionDate;
        this.ruleForm.imgUrls = res.data.fileResponse;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/content', query: { id: this.id } })
        }
      }, 1000)

    },
    getSelectRequest() {
      this.$axiosPost(API.contract_toAddContract, {}).then(res => {
        this.contractStatusList = res.data.contractStatusList;
        // this.orderStatusList = res.data.sysDicOrderStatusResponseList;
      });
      this.$axiosPost(API.contract_getLesseeList, {}).then(res => {
        this.getLesseeList = res.data;
        // this.orderStatusList = res.data.sysDicOrderStatusResponseList;
      });
    },
    add0(m) { return m < 10 ? '0' + m : m },

    getEnd() {
      if (this.ruleForm.contractStartDate && this.ruleForm.contractDeadline) {
        let Year = '';
        let Month = '';
        let Day = '';
        let endYear = '';
        const date = new Date(this.ruleForm.contractStartDate);
        let d = new Date();
        Year = date.getFullYear();
        Month = date.getMonth() + 1;
        Day = date.getDate();
        endYear = Year + Number(this.ruleForm.contractDeadline);
        this.contractEndDate = `${endYear}-${this.add0(Month)}-${this.add0(Day)}`;
      }

    },
    getMsgFormSon(data) {
      if (data) {
        let str = '';
        let strarr = [];
        data.forEach((row, index) => {
          str += data[index].roomAddress + ',';
        });
        data.forEach((row, index) => {
          strarr.push({ roomAddress: row.roomAddress, roomNo: row.roomNo, roomName: row.roomName, roomSources: row.roomSources, roomId: row.roomId, })
        })
        this.ruleForm.subject = str;
        this.chuanzhi = strarr;
      }
    },
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
