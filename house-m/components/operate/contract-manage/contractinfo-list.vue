<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title=""></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab'}">
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
                  <el-select v-model="contractStatus" clearable filterable placeholder="请输入审批状态">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in contractStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>承租人</span>
                  <el-input clearable v-model="lesseeName" placeholder="请输入承租人"></el-input>
                </li>
                <!-- <li>
                  <span>地址</span>
                  <el-input clearable v-model="orderNo" placeholder="请输入地址"></el-input>
                </li> -->
                <li>
                  <span>合同起始日期</span>
                  <el-date-picker v-model="value2" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </li>
                <!-- <li>
                  <span>订单状态</span>
                  <el-select v-model="orderStatus" filterable placeholder="请输入状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in orderStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
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
          <el-table-column prop="date" fixed="left" label="序号" width="55px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="合同编号" prop="contractNo" width='100px'>
          </el-table-column>
          <el-table-column label="合同开始日期" prop="contractStartDate">
            <template slot-scope="scope">
              {{scope.row.contractStartDate ?scope.row.contractStartDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column label="合同结束日期" prop="contractEndDate">
            <template slot-scope="scope">
              {{scope.row.contractEndDate ?scope.row.contractEndDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column label="出租方" prop="rentPerson">
          </el-table-column>
          <el-table-column label="承租人" prop="lesseeName">
          </el-table-column>
          <!-- <el-table-column label="地址" prop="dateCreated">
          </el-table-column> -->
          <el-table-column label="租金（元/年）" prop="contractRental">
          </el-table-column>
          <el-table-column label="合同状态" prop="contractStatusName">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.contractStatus)">{{scope.row.contractStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="到期提醒" prop="remainingDays">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <!-- <a @click="getWithdrawClick(scope.row.contractNo)" v-show='scope.row.contractStatusName=== "0"' type="text">删除</a> -->
              <a @click="getWithdrawClick(scope.row.dealContractId)" v-show="scope.row.contractStatus!=='IN_PROGRESS'" type="text">删除</a>
              <a @click="disposalDetailClick(scope.row.dealContractId)">详情</a>
              <a @click="disposalDetailClick(scope.row.dealContractId)" v-show="scope.row.contractStatus==='IN_PROGRESS'">解除合同</a>
              <!-- <router-link v-show='scope.row.contractStatusName=== "-1" || scope.row.contractStatusName=== "-2"' :to="{path: '/operate/contract-manage/contract-update/contract-tab', query: {id: scope.row.contractNo}}">修改</router-link> -->
              <router-link :to="{path: '/operate/contract-manage/contract-update/contract-tab/info', query: {id: scope.row.dealContractId}}" v-show="scope.row.contractStatus==='IN_PROGRESS'">修改</router-link>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <!-- <approval-info ref="approvalInfo"></approval-info> -->

    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
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
      handleApplyId: '', //申请单id
      value2: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }],
      },
      contractNo: '', //合同编号-新
      contractStatus: '', //合同状态-新
      lesseeName: '', //承租人名称-新
      contractStartDate: '', //合同开始日期-新
      contractEndDate: '', //合同结束日期-新
      contractStatusList: [], //合同状态下拉
      remainingDays: '', //合同到期剩余天数

      // orderNo: '',
      // itemName: '', //项目名称
      // handleType: '', //处置方式
      // handleTypeList: [], //处置方式的集合
      // orderStatusList: [], //订单状态集合
      // orderStatus: '', //订单状态
      // dateCreated: '', //申请提交日期
      // buildArea: '', //	拟处置房间建筑面积
      // planHandleRoomNum: '', //	拟处置房间数量
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [{
        // contractNo: '2345'
      }], // 列表数据集合 
    };
  },
  activated() {
    this.contractStatus = '';
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {
  },
  methods: {
    // 订单状态类
    checkStatus(value) {
      if (value == 'IN_PROGRESS') {
        return 's-state-caveat'
      } else if (value == 'END') {
        return 's-state-success'
      } else if (value == 'RELEASED') {
        return 's-state-prohibited'
      }
    },


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
        this.getDataRequest();
      }
    },

    getWithdrawClick(id) { // 撤回按钮
      this.handleApplyId = id;
      this.YConfirmShow = true;
      this.message = '确定撤回吗？'
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //申请单撤回
    YDeleteClick() {
      let params = {
        handleApplyId: this.handleApplyId
      }
      this.$axiosPost(API, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
      })
    },
    //获取合同列表信息 + 搜索功能
    getDataRequest() {
      if (this.value2[0]) {
        this.contractStartDate = FORMATGET.formatGET(this.value2[0]);
      }
      if (this.value2[1]) {
        this.contractEndDate = FORMATGET.formatGET(this.value2[1]);
      }
      let params = {

        pages: this.page,
        pageSize: this.pageSize,
        contractNo: this.contractNo, //合同编号-新
        contractStatus: this.contractStatus || '', //合同状态-新
        lesseeName: this.lesseeName, //承租人名称-新
        contractStartDate: this.contractStartDate, //合同开始日期-新
        contractEndDate: this.contractEndDate, //合同结束日期-新
      };
      this.$axiosPost(API.contract_findPage, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.list;
          this.total = res.data.total;
        }
        if (list && list != null || list != undefined) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;

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
      this.$axiosPost(API.contract_toAddContract, {}).then(res => {
        this.contractStatusList = res.data.contractStatusList;
        // this.orderStatusList = res.data.sysDicOrderStatusResponseList;
      });
    },

  },

};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input__inner {
  width: auto !important;
}
</style>
