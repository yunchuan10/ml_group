<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="出租申请" :item="['出租申请']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/operate/approval-manage/rent-apply-list-sub/add">
            <div class="u-bread-btn-group">
              <button class="f-pull-right u-bread-btn">出租申请</button>
            </div>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>审批状态</span>
                  <el-select v-model="applyStatus" filterable clearable placeholder="请选择审批状态">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in applyStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
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
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="55px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="申请单号" prop="orderNo">

          </el-table-column>
          <el-table-column label="经办人" prop="agentName">

          </el-table-column>
          <el-table-column label="拟出租开始日期" prop="proposedRentStartDate" :formatter="dateFormat">
          </el-table-column>
          <el-table-column label="招租形式" prop="rentWayName">
          </el-table-column>
          <el-table-column label="审批状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a v-show="scope.row.orderStatus === 0 " @click="getWithdrawClick(scope.row.id)" type="text">撤回</a>
              <a @click="disposalDetailClick(scope.row.id)">详情</a>
              <a @click="approvalInfoClick(scope.row.id)" v-show="scope.row.orderStatus ===2 && scope.row.additionRecording ==='NO'">财政审批意见补录</a>
              <router-link v-show='scope.row.orderStatus=== -1 || scope.row.orderStatus=== -2' :to="{path: '/operate/approval-manage/rent-apply-list-sub/edit', query: {id: scope.row.id}}">修改</router-link>
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
      <div>

      </div>
    </section>
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <approval-info ref="approvalInfo" @update="updatePage"></approval-info>

    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" title="提示" :message="message" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>

<script>
import approvalInfo from '@/components/operate/approval-manage/rent-addendum-info'; // 申请补录
import disposalDetail from '@/components/operate/approval-manage/rent-applydetail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
    'approval-info': approvalInfo,
  },
  data() {
    return {
      applyStatus: '', //审批状态
      id: '', //撤回id
      orderNo: '', //申请单号
      applyStatusList: [], //审批状态集合
      orderStatus: '', //订单状态
      dateCreated: '', //申请提交日期
      buildArea: '', //	拟处置房间建筑面积
      planHandleRoomNum: '', //	拟处置房间数量
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
    };
  },
  activated() {
    this.clearable = '';
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {
  },
  methods: {
    // 订单状态类
    checkStatus(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-caveat'
      } else if (value == '2') {
        return 's-state-success'
      } else if (value == '-1' || value == '-2') {
        return 's-state-fail'
      }
    },
    checkStatusName(value) {
      if (value == '0') {
        return '新提交申请'
      } else if (value == '1') {
        return '审批中'
      } else if (value == '2') {
        return '已通过'
      } else if (value == '-1') {
        return '已撤回'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10)
    },
    updatePage() {
      this.getDataRequest();    },
    // 审批
    approvalInfoClick(id) {
      this.$refs.approvalInfo.openModal(id);
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
      this.id = id;
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
        rentApplyId: this.id
      }
      this.$axiosPost(API.userplathouserent_withdrawApply, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('经营性房产', '申请审批', '撤回')
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
      })
    },
    //获取表格列表信息  申请单列表
    getDataRequest() {
      let params = {
        orderStatus: this.applyStatus || '',
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.$axiosGet(API.userplathouserent_rentApplyList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
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
    // 获取下拉框
    getSelectRequest() {
      this.$axiosGet(API.userplathouserent_queryOrderStatusAndPayWay, {}).then(res => {
        this.applyStatusList = res.data.sysDicOrderStatusResponseList;
      });
    }
  },

};
</script>

<style lang="scss">
</style>
