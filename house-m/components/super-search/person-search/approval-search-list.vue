<template>
  <div>
    <section class="m-main">
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: auto">
          <el-table-column label="序号" prop="xuhao" fixed="left" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="dutiesLevelName" label="职务级别">
          </el-table-column>
          <!-- <el-table-column prop="duty" label="职务名称">
          </el-table-column> -->
          <el-table-column prop="isEstablished" label="编制情况">
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="standardArea" label="标准面积（㎡）">
          </el-table-column>
          <el-table-column prop="realShareArea" label="实际分摊面积" width='150' :render-header="renderTip">
                <template slot-scope="scope">{{scope.row.realShareArea | dot2}}</template>
          </el-table-column>
          <el-table-column prop="excessive" label="超标情况" width='150' fixed="right" :render-header="renderExceedingTip">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.excessive)">{{ scope.row.excessive=='YES'?'超标':'不超标' || '—'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <disposal-info ref="disposalInfo" @update="updatePage"></disposal-info>
  </div>
</template>

<script>
import disposalInfo from '@/components/disposal-manage/disposal-info'; // 审批弹出框
import disposalDetail from '@/components/disposal-manage/disposal-applydetail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
    'disposal-info': disposalInfo,
  },
  data() {
    return {
      pageSelect: 'wait',//tab切换选中
      handleApplyId: '', //申请单id
      orderNo: '', //申请单号
      itemName: '', //项目名称
      handleType: '', //处置方式
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
      handleTypeList: [], //处置方式的集合
      waitOrderList: [], // 待审批订单列表
      planOrderList: [], // 已处理订单列表
      waitTotal: 0, // 待处理订单总数
      planTotal: 0 // 已处理订单总数
    };
  },
  activated() {
    this.getDataRequest();
    this.getDataPlanRequest();
    this.getSelectRequest();
  },
  computed: {

  },
  methods: {
    updatePage() {
      this.getDataRequest();
      this.getDataPlanRequest();
    },

    // 订单状态类
    checkStatus(value) {
      if (value === 'NO') {
        return 's-state-success'
      } else if (value === 'YES') {
        return 's-state-prohibited'
      } else {
        return ''
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
    // 选择页面激活状态
    changeActive(pageName) {
      this.pageSelect = pageName;
      if (pageName === 'wait') {
        this.list = this.waitOrderList;
        this.total = this.waitTotal;
      } else {
        this.list = this.planOrderList;
        this.total = this.planTotal;
      }
    },
    renderTip(h, { column }) {
      return h(
        'div', {
          style: 'display:flex;margin:auto; line-height:23px;'
        },
        [
          h('span', column.label),
          h('v-tooltipMessage', {
            props: { messages: ["按使用面积标准比例分摊计算，比如，1名副处级行政人员和1名科级以下行政人员共用一间30m²办公室，副处级工作人员实际使用面积为30×（12÷（12+9））＝17.14m²；"] }
          })
        ]
      );
    },
    renderExceedingTip(h, { column }) {
      return h(
        'div', {
          style: 'display:flex;margin:auto; line-height:23px;'
        },
        [
          h('span', column.label),
          h('v-tooltipMessage', {
            props: { messages: ["当实际分摊面积>标准面积，则该人员使用的面积超标，否则判定为不超标；"] }
          })
        ]
      );
    },
    // 审批
    approvalInfoClick(id) {
      this.$refs.disposalInfo.openModal(id);
    },
    // 详情
    approvalDetailClick(id) {
      this.$refs.disposalDetail.openModal(id);
    },

    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取表格列表信息 待处理
    getDataRequest() {
      let params = {
        businessCode: 'CONFIGURATION',
        orderNo: this.orderNo,
        itemName: this.itemName, //项目名称
        orderStatus: '', //订单状态
        handleType: this.handleType, //处置方式
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.handleapply_watingApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.list || [];
          this.waitTotal = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.waitOrderList = list;
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
        businessCode: 'CONFIGURATION',
        orderNo: this.orderNo,
        itemName: this.itemName, //项目名称
        orderStatus: '', //订单状态
        handleType: '', //处置方式
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.handleapply_doApprovalApplyList, params).then(res => {
        if (res.result == 'success' && res.data) {
          let list = res.data.list || [];
          this.planTotal = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.planOrderList = list;
          if (this.pageSelect == 'plan') {
            this.list = list;
            this.total = this.planTotal;
          }
        } else {
          this.planOrderList = [];
          this.list = [];
          this.total = 0;
          this.planTotal = 0;
        }
      })
    },
    // 获取下拉选处置方式和订单状态
    getSelectRequest() {
      this.$axiosPost(API.handleapply_queryHandleTypeAndOrderStatusList, {}).then(res => {
        this.handleTypeList = res.data.sysDicHandleTypeResponseList;
      });
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

  },

};
</script>

<style lang="scss">
</style>
