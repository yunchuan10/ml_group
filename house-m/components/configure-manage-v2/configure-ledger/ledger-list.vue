<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="配置台账" :item="['配置台账']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getDataRequest)">
                <li>
                  <span>单位名称</span>
                  <el-input clearable v-model="organName" placeholder="请输入单位名称"></el-input>
                </li>
                <li>
                  <span>申请单号</span>
                  <el-input clearable v-model="orderNo" placeholder="请输入申请单号"></el-input>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getDataRequest">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <h2 class="u-table-title">
          <span v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</span>
          <span v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</span> — 办公用房配置台账</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="type" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="申请单号" prop="orderNo">
            <template slot-scope="scope">
              <a @click="approvalDetailClick(scope.row.id,'manageAfterMakePlan')">{{scope.row.orderNo}}</a>
            </template>
          </el-table-column>
          <el-table-column label="申请单位" prop="organName">
          </el-table-column>
          <el-table-column label="批复编制人数" prop="approvedUserNum" width="130px">
            <template slot-scope="scope">{{scope.row.approvedUserNum || '0'}}</template>
          </el-table-column>
          <el-table-column label="总核定面积（㎡）" prop="allCheckArea" width='150px'>
            <template slot-scope="scope">
              {{scope.row.allCheckArea || '0'}}
            </template>
          </el-table-column>
          <el-table-column label="原办公地址" width='240px'>
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.organAddressList" :key="index">
                <span v-show="index > 0">，</span>{{item}}</span>
            </template>
          </el-table-column>
          <el-table-column label="原办公用房面积（㎡）" prop="hasOfficeArea" width='170px'>
          </el-table-column>
          <el-table-column label="配置方式" prop="planType">
          </el-table-column>
          <el-table-column label="调配办公地址" prop="courtyardNames">
          </el-table-column>
          <el-table-column label="调配面积（㎡）" prop="allocatePlanUseArea">
          </el-table-column>
          <el-table-column label="调配时间" prop="createdAt" :formatter="dateFormat">
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
    <approval-detail ref="approvalDetail"></approval-detail>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>
<script>
import approvalDetail from '@/components/configure-manage-v2/room-approval/approval-detail'; // 详情弹出框
export default {
  components: {
    'approval-detail': approvalDetail
  },
  data() {
    return {
      handleApplyId: '', //申请单id
      organName: '', //单位名称
      orderNo: '', //申请单号
      dateCreated: '', //申请提交日期
      buildArea: '', //	拟处置房间建筑面积
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [] // 列表数据集合 
    };
  },
  activated() {
    this.getDataRequest();
  },
  computed: {
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  methods: {
    // 订单状态类
    checkStatus(value) {
      if (value == '1' || value == '0') {
        return 's-state-apply'
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
      }
      else if (value == '2') {
        return '已通过'
      } else if (value == '-1') {
        return '已撤回'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    // 详情
    approvalDetailClick(id, formkey) {
      this.$refs.approvalDetail.openModal(id, formkey);
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
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
      this.$axiosPost(API.handleapply_withdrawApply, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '处置利用', '处置利用撤回')
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
      })
    },
    //获取申请单列表
    getDataRequest() {
      let params = {
        organName: this.organName,
        orderNo: this.orderNo || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.officeapply_listAccessApplyOrder, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
        }
        if (list) {
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
    }
  }
};
</script>
<style lang="scss">
</style>
