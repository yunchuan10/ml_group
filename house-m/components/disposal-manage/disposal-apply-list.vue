<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置申请" :item="['处置申请']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path: '/disposal-manage/disposal-apply/add'}">
            <button class="f-pull-right u-bread-btn">
              处置利用申请
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
                  <span>申请单号</span>
                  <el-input clearable v-model="orderNo" placeholder="请输入申请单号"></el-input>
                </li>
                <li>
                  <span>项目名称</span>
                  <el-input clearable v-model="itemName" placeholder="请输入项目名称"></el-input>
                </li>
                <li>
                  <span>处置方式</span>
                  <el-select v-model="handleType" filterable clearable placeholder="请选择处置方式">
                    <el-option v-for="item in handleTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>订单状态</span>
                  <el-select v-model="orderStatus" filterable clearable placeholder="请选择订单状态">
                    <el-option v-for="item in orderStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
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
          <el-table-column label="申请单号" prop="orderNo" width='180px'>
          </el-table-column>
          <el-table-column label="项目名称" prop="itemName" width='180px'>
          </el-table-column>
          <el-table-column label="拟处置房间（间）" prop="planHandleRoomNum" width='170px'>
          </el-table-column>
          <el-table-column label="拟处置面积（㎡）" prop="buildArea" width='170px'>
          </el-table-column>
          <el-table-column label="处置方式" prop="handleTypeName">
          </el-table-column>
          <el-table-column label="申请提交时间" prop="createdAt">
            <template slot-scope="scope">
              {{scope.row.createdAt ?scope.row.createdAt.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="getWithdrawClick(scope.row.id)" v-show='scope.row.orderStatus == "0"' type="text">撤回</a>
              <a @click="disposalDetailClick(scope.row.id)">详情</a>
              <router-link v-show='scope.row.orderStatus == "-1" || scope.row.orderStatus == "-2"' :to="{path: '/disposal-manage/disposal-apply/edit', query: {id: scope.row.id}}">修改</router-link>
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
    <disposal-detail ref="disposalDetail"></disposal-detail>
    <approval-info ref="approvalInfo"></approval-info>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" title="提示" :message="message" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>
<script>
import approvalInfo from '@/components/configure-manage/room-approval/approval-info'; // 审批弹出框
import disposalDetail from '@/components/disposal-manage/disposal-applydetail'; // 详情弹出框
export default {
  components: {
    'disposal-detail': disposalDetail,
    'approval-info': approvalInfo
  },
  data() {
    return {
      handleApplyId: '', //申请单id
      orderNo: '', //申请单号
      itemName: '', //项目名称
      handleType: '', //处置方式
      handleTypeList: [], //处置方式的集合
      orderStatusList: [], //订单状态集合
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
    this.handleType = '';
    this.orderStatus = '';
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {
    loginOrganId(){
      return this.$store.state.mainData.loginOrganId
    }
  },
  methods: {
    //订单状态显示样式
    checkStatus(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-caveat'
      }
      else if (value == '2') {
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
    //获取表格列表信息
    getDataRequest() {
      let params = {
        organId: this.loginOrganId,
        orderNo: this.orderNo,
        itemName: this.itemName, //项目名称
        orderStatus: this.orderStatus || '', //订单状态
        handleType: this.handleType || '', //处置方式
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.handleapply_handleApplyList, params).then(res => {
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
    // 获取下拉选处置方式和订单状态
    getSelectRequest() {
      this.$axiosGet(API.handleapply_queryHandleTypeAndOrderStatusList, {}).then(res => {
        this.handleTypeList = res.data.sysDicHandleTypeResponseList;
        this.orderStatusList = res.data.sysDicOrderStatusResponseList;
      });
    }
  }
};
</script>
<style lang="scss">
</style>
