<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="租金管理" :item="['租金管理']" type="2"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click='changeActive("wait")' :class="{'active':pageSelect=='wait'}">
          <a>未入账租金</a>
        </li>
        <li @click='changeActive("plan")' :class="{'active':pageSelect=='plan'}">
          <a>已入账租金</a>
        </li>
      </ul>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>合同编号</span>
                  <el-input clearable v-model="contractNo" placeholder="请输入合同编号"></el-input>
                </li>
                <li>
                  <span>承租人</span>
                  <el-input v-model="lesseeName" clearable placeholder="请输入承租人姓名"></el-input>
                </li>
                <li v-if="pageSelect=='wait'">
                  <span>状态</span>
                  <el-select v-model="status" filterable clearable placeholder="请选择状态">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in statusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative" v-show="pageSelect=='wait'">
        <!-- <div class="h-table-popover">
          <v-searchPopover isTableListBol="RENTAL_INFO">
            <li class="iconfont icon-shaixuan">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div> -->
        <!-- <el-table :data="list" stripe style="width: 100%" ref="multipleTable" show-summary :summary-method="getSummaries" @selection-change="handleSelectionChange"> -->
        <el-table :data="list" stripe style="width: 100%" ref="multipleTable" show-summary :summary-method="getSummaries">

          <!-- <el-table-column type="selection" width="60">
          </el-table-column> -->
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNo">
          </el-table-column>
          <el-table-column label="承租人" prop="lesseeName">
          </el-table-column>
          <el-table-column label="合同租金（元/年）" prop="contractRental">
          </el-table-column>
          <el-table-column label="租金起止日期" prop="rentStartEndDay" width="230">
            <template slot-scope="scope">
              <span>{{ dateReturn(scope.row.startDate)}} 至 {{dateReturn(scope.row.endDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="应交租金（元）" prop="money">
          </el-table-column>
          <el-table-column label="缴纳时长" prop="duration">
          </el-table-column>
          <el-table-column label="状态" prop="statusName">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.statusName)">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="租金到期提醒" prop="remainingDays">
            <template slot-scope="scope">
              {{scope.row.statusName == "即将到期" ? scope.row.remainingDays>= 0 ? '剩余：'+scope.row.remainingDays+'天' : '' : scope.row.remainingDays>= 0 ? ('逾期：'+scope.row.remainingDays+'天') : '' }}
              <!-- {{scope.row.contractStatus == "RELEASED" ? '': '剩余：'+scope.row.remainingDays+'天'}} -->
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <a v-show='pageSelect=="wait" && scope.row.statusName === "逾期"' @click="overdueRemarks(scope.row.id)">逾期备注</a>
              <a v-show='pageSelect=="wait"' @click="approvalInfoClick(scope.row.id,scope.row.lesseeName)">租金入账</a>
              <a @click="approvalDetailClick(scope.row.id)">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table f-relative" v-show="pageSelect=='plan'">
        <el-table :data="list" stripe style="width: 100%" ref="multipleTable" show-summary :summary-method="getSummaries">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>

          <el-table-column label="合同编号" prop="contractNo">
          </el-table-column>
          <el-table-column label="承租人" prop="lesseeName">
          </el-table-column>
          <el-table-column label="合同租金（元/年）" prop="contractRental">
          </el-table-column>
          <el-table-column label="租金起止日期" prop="rentalStartDate" width="230">
            <template slot-scope="scope">
              <span>{{ dateReturn(scope.row.startDate)}} 至 {{dateReturn(scope.row.endDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="应交租金（元）" prop="money">
          </el-table-column>
          <el-table-column label="缴纳时长" prop="duration" width="100">
          </el-table-column>
          <el-table-column label="交租日期" prop="payDate">
            <template slot-scope="scope">
              {{checkTime(scope.row.payDate)}}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="statusName">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.statusName)">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <a @click="approvalDetailClick(scope.row.id)">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <!-- <div class="h-table-pages f-pull-left" v-if="pageSelect=='wait'">
          <el-button type="primary" @click="rentReminder">缴租提醒</el-button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
      <!-- 租金入账弹窗 -->
      <el-dialog title="租金入账" custom-class="h-dialog-add" :visible.sync="rentEntryVisible" width="630px" :before-close="resetForm">
        <el-form label-width="140px" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="开票单位">
            <el-input v-model="ruleForm.issuingOffice" placeholder="请输入开票单位" style="width:360px"></el-input>
          </el-form-item>
          <el-form-item label="交租日期" prop="rentDate">
            <el-date-picker v-model="ruleForm.rentDate" type="date" :picker-options="pickerOptions" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
          <el-button class="u-submit-btn submit-btn" @click="rentRequest" :loading="loading">保存</el-button>
        </div>
      </el-dialog>
      <!-- 弹窗结束 -->
      <!-- 缴租提醒弹窗 -->
      <el-dialog title="缴租提醒" custom-class="h-dialog-add" :visible.sync="rentReminderVisible" width="630px" :before-close="resetFormPay">
        <el-form label-width="100px" :model="ruleFormPayment" :rules="rulesPayment" ref="ruleFormPayment">
          <div class="text item">
            <el-form-item>
              <ul class="f-color-red lessess" v-for="(item, index ) in lesseeList" :key="index">
                <li>
                  承租人 {{item.lesseeName}}
                </li>
                <li>
                  手机号 {{item.lesseePhone}}
                </li>
              </ul>
            </el-form-item>
          </div>
          <el-form-item label="标题">
            <el-input v-model="ruleFormPayment.remindTitle" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="正文">
            <el-input type="textarea" :rows="4" placeholder="按合同约定的缴纳租金日期已过，请尽快缴租！" v-model="ruleFormPayment.content"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetFormPay" class="u-submit-btn cancel-btn">取消</el-button>
          <el-button class="u-submit-btn submit-btn" @click="sentMessage">发送短信</el-button>
        </div>
      </el-dialog>
      <!-- 弹窗结束 -->
    </section>
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <overdue-remark ref="overdueRemark" @requestData="updatePage"></overdue-remark>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import disposalDetail from '@/components/operate/reprises-manage/reprises-applydetail'; // 详情弹出框
import overdueRemark from '@/components/operate/reprises-manage/overdue/overdue-remark'; // 逾期备注
export default {
  components: {
    'disposal-detail': disposalDetail,
    'overdue-remark': overdueRemark
  },
  data() {
    return {
      value: '',
      textarea: '',
      pageSelect: 'wait',//tab切换选中
      isSend: false,
      lesseeName: '', //承租人
      contractNo: '', //合同标号
      status: '', //状态
      statusList: [], //下拉框状态集合
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      loading: false,
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      final: '', //合计
      lesseeList: [], //承租人集合
      list: [], // 列表数据集合 
      spanArr: [],
      ruleForm: {
        issuingOffice: '', //开票单位
        rentDate: '', //交租日期
      },
      rentId: '', //租金入账id
      ruleFormPayment: {},
      rulesPayment: {
        remindTitle: '',
        content: '',
      }, //缴租规则
      rules: {
        rentDate: [
          { required: true, message: '请输入交租日期', trigger: 'change' },
        ]
      },
      //验证规则
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      position: '',
      multipleSelection: [],
      dealIds: [], //提醒发送承租人id集合
      handleTypeList: [], //处置方式的集合
      waitOrderList: [], // 待审批订单列表
      planOrderList: [], // 已处理订单列表
      waitTotal: 0, // 待处理订单总数
      planTotal: 0, // 已处理订单总数
      dialogFormVisible: false, //逾期备注弹框
      rentEntryVisible: false, //租金入账弹框
      rentReminderVisible: false, //交租提醒弹框
      accountingStatus: '', //备注入账状态
      sumMoney: '0', //合计
      remindSwitch: '', //租金提醒开关
    };
  },
  activated() {
    this.status = '';
    this.getSelectRequest();
    // this.getDataRequest();
    if (this.pageSelect == 'plan') {
      this.getDataPlanRequest()
    } else {
      this.getDataRequest();
    }
  },
  computed: {
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol['RENTAL_INFO'];
    },
    token() {
      return this.$store.state.mainData.token
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  methods: {
    updatePage() {
      this.getDataRequest();
      this.getDataPlanRequest();
    },
    checkTime(value) {
      if (value) {
        return value.substr(0, 10);
      }
    },


    // 选择页面激活状态
    changeActive(pageName) {
      this.pageSelect = pageName;
      if (pageName === 'wait') {
        this.page = 1;
        this.getDataRequest();
        this.list = this.waitOrderList;
        this.total = this.waitTotal;
      } else {
        this.page = 1;
        this.getDataPlanRequest();
        this.list = this.planOrderList;
        this.total = this.planTotal;
      }
    },

    overdueRemarks(id) {
      this.$refs.overdueRemark.openModal(id);
    },

    approvalInfoClick(id, type) {
      this.rentId = id;
      this.rentEntryVisible = true;
      this.ruleForm.rentDate = '';
      // this.ruleForm.issuingOffice = '';
      this.ruleForm.issuingOffice = type;
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rentReminder() {
      this.rentReminderVisible = true;
      this.dealIds = [];
      this.multipleSelection.forEach((item, index) => {
        this.dealIds.push({ dealRentalInformationId: item.dealRentalInformationId })
      })
      this.lesseeRequest();
    },
    //缴租提醒承租人获取
    lesseeRequest() {
      let params = {
        dealRentalInformationIds: this.dealIds,
      }
      this.$axiosPost(API.rent_getRentRemind, params).then(res => {
        this.lesseeList = res.data;
      })
    },
    //缴租提醒提交
    sentMessage() {
      let params = {
        reminds: '提醒'
      }
      this.loadingSend = true;
      if (this.multipleSelection != '') {
        this.$axiosPost(API.rent_sendRentRemind, params).then(res => {
          this.YPromptShow = true;
          if (res.result === 'success') {
            this.isBol = true;
            this.isSend = true;
            BURYINGPOINT.buryingPoint('经营性房产', '租金管理', '缴租提醒')
          } else {
            this.isBol = false;
            this.isSend = false;
          }
          this.rentReminderVisible = false;
          this.loadingSend = false;
          this.message = res.message;
        })
      } else {
        this.YPromptShow = true;
        this.isBol = false;
        this.rentReminderVisible = false;

        this.message = '提醒人不能为空';

      }

    },
    //租金未入账
    rentRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.rentId,
            information: 'YES',
            issuingOrganName: this.ruleForm.issuingOffice,
            payDate: FORMATGET.formatGET(this.ruleForm.rentDate).substr(0, 10),
          }
          this.loading = true;
          this.$axiosJsonPost(API.rent_addRentalInfomation, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('经营性房产', '租金管理', '租金入账')
            } else {
              this.isBol = false;
            }
            this.rentEntryVisible = false;
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol && !this.isSend) {
          this.getDataRequest();
          this.$refs.ruleForm.resetFields();
        } else if (this.isBol && this.isSend) {
          this.rentReminderVisible = false;
          this.getDataRequest();
          this.$refs.ruleFormPayment.resetFields();

        }
      }, 1000)
    },
    getSearch() {
      this.page = 1;
      if (this.pageSelect == 'wait') {
        this.getDataRequest();
      } else {
        this.getDataPlanRequest();
      }

    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let len = columns.length;
      for (let i = 0; i < len; i++) {
        if (i === 0) {
          sums[i] = '合计'
        } else if (i === (len - 1)) {
          sums[i] = this.final + '元';
        }
      }
      return sums;
    },

    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    dateReturn(day) {
      let date = new Date(day);
      // date格式转年月日String
      if (date === '' || date === 0 || date === null || date === undefined) {
        return '';
      }
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? '0' + d : d;
      return y + '-' + m + '-' + d;
    },
    //获取表格列表信息 待处理
    getDataRequest() {
      let params = {
        contractNo: this.contractNo,
        lesseeName: this.lesseeName, //承租人
        rentalStatus: this.status || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.rent_findRentalInfoOfNo, params).then(res => {
        if (res.data) {
          let list = res.data.pageResponse.data;
          this.waitTotal = res.data.pageResponse.total;
          this.final = res.data.totalRentalMoney;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.waitOrderList = list;
          // this.list = list;
          if (this.pageSelect == 'wait') {
            this.list = list;
            this.total = this.waitTotal;
          }
        } else {
          this.waitOrderList = [];
          this.list = [];
          this.total = 0;
          this.waitTotal = 0;
        }
      })
    },

    //获取表格列表信息 已处理
    getDataPlanRequest() {
      let params = {
        contractNo: this.contractNo,
        lesseeName: this.lesseeName, //承租人
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.rent_findRentalInfoOfYes, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.pageResponse.data;
          this.planTotal = res.data.pageResponse.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.planOrderList = list;
          if (this.pageSelect == 'plan') {
            this.list = list;
            this.total = this.planTotal;
            this.final = res.data.totalRentalMoney;
          }
        } else {
          this.planOrderList = [];
          this.list = [];
          this.total = 0;
          this.planTotal = 0;
          this.final = '';
        }
      })
    },
    // 获取下拉框
    getSelectRequest() {
      this.$axiosGet(API.rent_getRentStatusAndInformationSelect, {}).then(res => {
        this.statusList = res.data.rentStatusResponseList;
      });
      let params = {
        organId: this.loginOrganId,
        flag: 'RENT'
      };
      this.$axiosGet(API.rent_queryRemindBaseSet, params).then(res => {
        this.remindSwitch = res.data.remindSwitch;
      });
      // let params = {
      //   organId: this.loginOrganId,
      //   flag: 'RENT'
      // };
      // this.$axiosPost(API.rent_queryRemindBaseSet, params).then(res => {
      //   this.remindSwitch = res.data.remindSwitch;
      // });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      if (this.pageSelect == 'plan') {
        this.getDataPlanRequest();
      } else {
        this.getDataRequest();
      }
    },
    resetForm() {
      this.rentEntryVisible = false;
      this.$refs['ruleForm'].resetFields();
      this.ruleForm.issuingOffice = '';
      this.ruleForm.rentDate = '';
    },

    resetFormPay() {
      this.rentReminderVisible = false;
      this.$refs['ruleFormPayment'].resetFields();
      this.lesseeList = '';
      this.ruleFormPayment.remindTitle = '';
      this.ruleFormPayment.content = '';
    },
    checkStatus(value) {
      if (value == '即将到期') {
        return 's-state-caveat'
      } else if (value == '已入账') {
        return 's-state-success'
      } else if (value == '逾期') {
        return 's-state-prohibited'
      }
    },
    // checkStatusName(value) {
    //   if (value == 'YES') {
    //     return '超标'
    //   } else {
    //     return '不超标'
    //   }
    // },
  },

};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: 80% !important;
}
.lessess li {
  display: inline-block;
  margin: 0 5px;
}
</style>
