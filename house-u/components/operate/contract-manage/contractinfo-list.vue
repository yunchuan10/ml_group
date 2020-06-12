<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="合同管理" :item="['合同管理']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <!-- <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab', query: {id: 'add'}}">
            <button class="f-pull-right u-bread-btn">
              新增合同
            </button>
          </router-link> -->
          <router-link :to="{path: '/operate/contract-manage/contract-update/contract-add', query: {id: 'add'}}">
            <button class="f-pull-right u-bread-btn">
              新增合同
            </button>
          </router-link>
        </div>
      </div>
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
                  <span>合同状态</span>
                  <el-select v-model="contractStatus" filterable clearable placeholder="请选择合同状态">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in contractStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>承租人</span>
                  <el-input clearable v-model="lesseeName" placeholder="请输入承租人"></el-input>
                </li>
                <!-- <li style="visibility: hidden">
                  <span>地址</span>
                  <el-input clearable></el-input>
                </li> -->
                <li>
                  <span>合同开始日期：</span>
                  <el-date-picker v-model="contractStartDate" type="date" placeholder="选择日期" @change="quCancel">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="contractEndDate" type="date" placeholder="选择日期" @change="quCancel">
                  </el-date-picker>
                </li>
                <li style="padding-top:10px">
                  <el-radio-group v-model="checkList" @change="select(checkList)">
                    <el-radio :label="1">近一个月</el-radio>
                    <el-radio :label="2">近三个月</el-radio>
                    <el-radio :label="3">近半年</el-radio>
                    <el-radio :label="4">近一年</el-radio>
                    <el-radio :label="5">全部</el-radio>
                  </el-radio-group>
                </li>
                <!-- <li>
                  <span>合同起始日期</span>
                  <el-date-picker v-model="value2" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </li> -->
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" label="序号" width="55px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNo" width='180px'>
          </el-table-column>
          <el-table-column label="合同开始日期" prop="startDate">
            <template slot-scope="scope">
              {{scope.row.startDate ?scope.row.startDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column label="合同结束日期" prop="endDate">
            <template slot-scope="scope">
              {{scope.row.endDate ?scope.row.endDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column label="出租方" prop="rentOrgan">
          </el-table-column>
          <el-table-column label="承租人" prop="lesseeName">
          </el-table-column>
          <!-- <el-table-column label="地址" prop="dateCreated">
          </el-table-column> -->
          <el-table-column label="租金（元/年）" prop="rental">
          </el-table-column>
          <el-table-column label="合同状态" prop="statusName">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.status)">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="合同到期提醒" prop="remainingDays">
            <template slot-scope="scope">
              {{scope.row.status == "IN_PROGRESS" ? '剩余：'+scope.row.remainingDays+'天': '剩余：0天'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="deleteClick(scope.row.id)" v-show="scope.row.status!=='IN_PROGRESS'" type="text">删除</a>
              <a @click="disposalDetailClick(scope.row.id)">详情</a>
              <a @click="terminateAcontract(scope.row.id)" v-show="scope.row.status==='IN_PROGRESS'">解除合同</a>
              <!-- <router-link v-show='scope.row.contractStatusName=== "-1" || scope.row.contractStatusName=== "-2"' :to="{path: '/operate/contract-manage/contract-update/contract-tab', query: {id: scope.row.contractNo}}">修改</router-link> -->
              <router-link :to="{path: '/operate/contract-manage/contract-update/contract-add', query: {id: scope.row.id}}" v-show="scope.row.status==='IN_PROGRESS'">修改</router-link>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 解除合同个弹窗 -->
    <!-- <el-dialog title="解除合同" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="500px" :before-close="resetForm">
      <el-form>
        <table class="h-table-info">
          <tr>
            <th>
              <i class="f-color-red">*</i>房间闲置原因</th>
            <td>
              <el-form-item prop="dicValue">
                <el-select v-model="idleReason" clearable placeholder="请选择">
                  <el-option v-for="item in terminationStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="getbatchAddDataRequest" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog> -->

    <disposal-detail ref="disposalDetail"></disposal-detail>
    <!-- <approval-info ref="approvalInfo"></approval-info> -->

    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--解除合同提示框-->
    <Y-Confirm v-model="YConShow" title="解除合同" :message="message" @click="getbatchAddDataRequest"></Y-Confirm>
  </div>
</template>

<script>
// import approvalInfo from '@/components/configure-manage/room-approval/approval-info'; // 审批弹出框
import disposalDetail from '@/components/operate/contract-manage/contract-detail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
    // 'approval-info': approvalInfo,
  },
  data() {
    return {
      applyStatus: '', //审批状态
      handleApplyId: '', //删除合同ID
      terminationId: '', //解除合同ID
      contractNo: '', //合同编号-新
      contractStatus: '', //合同状态-新
      lesseeName: '', //承租人名称-新
      contractStartDate: '', //合同开始日期-新
      contractEndDate: '', //合同结束日期-新
      contractStatusList: [], //合同状态下拉
      remainingDays: '', //合同到期剩余天数
      // terminationStatusList: '', //合同解除下拉
      idleReason: '', // 闲置状态
      dialogFormVisible: false, //解除合同弹窗
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      YConShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      checkList: 5, //单选按钮初始值
      list: [
        // contractNo: '2345'
      ], // 列表数据集合 
      remindSwitch: '',
    };
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  activated() {
    this.contractNo = '';//合同编号-新
    this.contractStatus = '';//合同状态-新
    this.lesseeName = '';//承租人名称-新
    this.contractStartDate = ''; //合同开始日期-新
    this.contractEndDate = ''; //合同结束日期-新
    this.getDataRequest();
    this.getSelectRequest();
    // if (this.$route.query.dealContractId) {
    //   this.$refs.disposalDetail.openModal(this.$route.query.dealContractId);
    // }
  },
  methods: {
    // 订单状态类
    checkStatus(value) {
      if (value == 'IN_PROGRESS') {
        return 's-state-caveat'
      } else if (value == 'END') {
        return 's-state-fail'
      } else if (value == 'RELEASED') {
        return 's-state-prohibited'
      }
    },
    // formatValue(row, column, cellValue, index) {
    //   if (cellValue) {
    //     if (row.contractStatus == "RELEASED") {
    //       return '—'
    //     }
    //     return '剩余天数' + cellValue;
    //   } else {
    //     return '—'
    //   }
    // },
    // 审批
    approvalInfoClick() {
      this.$refs.approvalInfo.openModal();
    },
    // 详情
    disposalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
    },
    YPromptClick() {
      if (this.isBol) {
        this.dialogFormVisible = false;
        this.getDataRequest();
      }
    },
    deleteClick(id) { // 删除
      this.handleApplyId = id;
      this.YConfirmShow = true;
      this.message = '你确定要删除吗？';
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //删除
    YDeleteClick() {
      let params = {
        contractId: this.handleApplyId
      }
      this.$axiosPost(API.contract_doDeleteContract, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          // this.isClose = true;
          BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '删除')
        } else {
          this.isBol = false;
          // this.isClose = false;
        }
        this.loading = false;
        this.message = res.message;
      })
    },
    //获取合同列表信息 + 搜索功能
    getDataRequest() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        contractNo: this.contractNo, //合同编号-新
        status: this.contractStatus || '', //合同状态-新
        lesseeName: this.lesseeName, //承租人名称-新
        startDate: FORMATGET.formatGET(this.contractStartDate) || null, //合同开始日期-新
        endDate: FORMATGET.formatGET(this.contractEndDate) || null, //合同结束日期-新
      };

      // console.log(params.startDate, typeof params.startDate, 1111111);

      this.$axiosGet(API.contract_findPage, params).then(res => {
        let list = [];
        if (res.data) {
          res.data.data = res.data.data || [];
          list = res.data.data;
          this.total = res.data.total;
          if (list && list != null || list != undefined) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
          res.data.data.forEach((row, index) => {
            this.list[index].startDate = FORMATGET.formatGET(new Date(row.startDate));
            this.list[index].endDate = FORMATGET.formatGET(new Date(row.endDate));
          })
        } else {
          this.list = [];
          this.total = 0
        }
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取下拉合同状态
    getSelectRequest() {
      this.$axiosGet(API.contract_toAddContract, {}).then(res => {
        this.contractStatusList = res.data.contractStatusList || [];
      });
      let params = {
        organId: this.loginOrganId,
        flag: 'CONTRACT'
      };
      this.$axiosGet(API.rent_queryRemindBaseSet, params).then(res => {
        this.remindSwitch = res.data.remindSwitch
      });
    },
    //解除合同
    terminateAcontract(id) {
      this.terminationId = id;
      this.YConShow = true;
      this.message = '你确定要解除合同吗？';
      // this.dialogFormVisible = true;
      // this.$axiosPost(API.contract_getReleasedSelect, {}).then(res => {
      //   this.terminationStatusList = res.data;
      // });
    },
    //解除合同
    getbatchAddDataRequest() {
      let params = {
        contractId: this.terminationId,
        // idleReason: this.idleReason,
      };
      this.$axiosPost(API.contract_doReleasedContract, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '解除合同')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      });
    },
    resetForm(ruleForm) {
      this.dialogFormVisible = false;
      // this.$refs.ruleForm.resetFields();
    },
    select(selection) {
      if (selection == '1') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '2') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '3') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 183);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '4') {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
        this.contractStartDate = start;
        this.contractEndDate = end;
      } else if (selection == '5') {
        this.contractStartDate = '';
        this.contractEndDate = '';
      }
    },
    quCancel() {
      this.checkList = 5
    }
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input__inner {
  width: auto !important;
}
</style>
