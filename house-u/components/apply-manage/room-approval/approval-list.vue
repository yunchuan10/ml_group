<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="用房申请" :item="['用房申请']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/apply-manage/room-approval/allocation-scheme-first">
            <button class="f-pull-right u-bread-btn">
              用房申请</button>
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
                  <span>状态</span>
                  <el-select v-model="status" filterable clearable placeholder="请选择状态">
                    <el-option v-for="item in statusSelectList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
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
          <el-table-column label="序号" width="60">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="申请单号" prop="orderNo"></el-table-column>
          <el-table-column label="申请人" prop="realName"></el-table-column>
          <el-table-column label="拟申请调配面积（㎡）" prop="applyArea"></el-table-column>
          <el-table-column label="申请时间" prop="createdAt">
            <template slot-scope="scope">{{ checkApplyTime(scope.row.createdAt)}}</template>
          </el-table-column>
          <el-table-column label="状态" prop="orderStatus">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.orderStatus)">{{checkStatusName(scope.row.orderStatus)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="cancelClick(scope.row.id)" v-show="scope.row.orderStatus == '0'">撤回</a>
              <a @click="approvalDetailClick(scope.row.id,scope.row.orderStatus)">详情</a>
              <router-link v-show="scope.row.orderStatus == '-1' || scope.row.orderStatus == '-2'" :to="{path:'/apply-manage/room-approval/allocation-scheme-first', query: {id: scope.row.id}}">修改</router-link>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" title="提示" :message="message" @click="YConfirmClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 详情弹出框 -->
    <approval-detail ref="approvalDetail"></approval-detail>
  </div>
</template>
<script>
import approvalDetail from '@/components/apply-manage/room-approval/approval-detail'; // 详情弹出框
export default {
  components: {
    'approval-detail': approvalDetail
  },
  data() {
    return {
      id: '',
      orderNo: '',//申请单号
      status: '',
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      statusSelectList: []//状态下拉列表查询
    };
  },
  activated() {
    this.status = '';
    this.getDataRequest();
    this.getSelect()
  },
  deactivated() {
    this.orderNo = '';
  },
  methods: {
    // 确认弹出框操作
    YConfirmClick() {
      let params = {
        id: this.id
      }
      this.$axiosPost(API.officeapply_cancelApply, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '用房申请', '撤销')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    // 时间格式format
    checkApplyTime(value) {
      return value.substr(0, 19)
    },
    checkStatus(value) {
      if (value == '1' || value == '2') {
        return 's-state-caveat'
      } else if (value == '0') {
        return 's-state-apply'
      } else if (value == '3') {
        return 's-state-success'
      } else if (value == '-1' || value == '-2') {
        return 's-state-fail'
      }
    },
    checkStatusName(value) {
      if (value == '1' || value == '2') {
        return '审批中'
      } else if (value == '0') {
        return '新提交申请'
      } else if (value == '3') {
        return '已通过'
      } else if (value == '-1') {
        return '已撤回'
      } else if (value == '-2') {
        return '已驳回'
      }
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    // 撤回
    cancelClick(id) {
      this.id = id;
      this.YConfirmShow = true;
      this.message = '您确定要撤回吗？';
    },
    // 详情
    approvalDetailClick(id, status) {
      this.$refs.approvalDetail.openModal(id, status);
    },
    //状态下拉框
    getSelect() {
      this.$axiosGet(API.officeapply_getOrderStatus, {}).then(res => {
        this.statusSelectList = res.data;
      })
    },
    //获取表格列表信息
    getDataRequest() {
      let params = {
        orderNo: this.orderNo,
        queryApplyStatus: this.status || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.officeapply_officeApplyList, params).then(res => {
        if (res.result === 'success' && res.data) {
          let list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
        }
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数0
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>
<style lang="scss">
</style>
