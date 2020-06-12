<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>状态</span>
                <el-select v-model="search.status" filterable clearable placeholder="请选择状态">
                  <el-option v-for="(item, index) in dataReportOrderStatus" :label="item.dicName" :value="item.dicValue" :key="index"></el-option>
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
      <el-table :data="list" empty-text='暂未发起上报' @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="selectable" width="55">
        </el-table-column>
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="areaName" label="地区"></el-table-column>
        <el-table-column prop="createOrganName" label="填报人单位"></el-table-column>
        <el-table-column prop="createRealName" label="填报人"></el-table-column>
        <el-table-column prop="createdAt" label="上报时间">
          <template slot-scope="scope">
            {{getTime(scope.row.createdAt)}}
          </template>
        </el-table-column>
        <el-table-column prop="dateCreated" label="状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkClassName(scope.row.status)">
              {{scope.row.statusName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a v-show="scope.row.status == '1'" @click="reviewClick(scope.row.id, 'one')">审批</a>
            <a @click="goRepoatPage(scope.row.id, 'detail')">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 审核 -->
    <el-dialog title="审核" custom-class="h-dialog-add" :visible.sync="reviewDialogVisible" width="700px" @close="clearForm">
      <div>
        <el-form label-position="right" label-width="100px" :model="ruleForm" ref="ruleForm">
          <el-form-item label="审核意见">
            <el-radio-group v-model="ruleForm.auditType" @change="clearRemarkValidate">
              <el-radio label="YES">通过</el-radio>
              <el-radio label="NO">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark" :rules="{required: this.ruleForm.auditType == 'NO', message: '备注不能不为空', trigger: 'change'}">
            <el-input placeholder="请输入备注" v-model="ruleForm.remark" type="textarea" :maxlength="200" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewDialogVisible = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      reviewDialogVisible: false, // 审核弹出框
      loading: false,
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        status: ''
      },
      list: [],
      dataReportOrderStatus: [],
      ruleForm: {
        auditType: 'YES',
        remark: ''
      },
      choseRows: [],
      id: '',
      reviewDataLength: ''
    }
  },
  computed: {
    reportReviewPage() {
      return this.$store.state.mainData.reportReviewPage;
    }
  },
  watch: {
    reportReviewPage(value) {
      if (value == 'nextLevel') {
        this.reviewDialogVisible = true;
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.$store.commit('navIdMutations', this.$route.query.id);
    } this.page = 1;
    this.search.status = '';
    this.$store.commit('reportBackPageMutations', 'reviewNext');
    this.getPic();
    this.getDataRequest();

  },
  methods: {
    selectable(row, index) {
      let isSelectable = false;
      if (row.status == '1') {
        isSelectable = true;
      } else {
        isSelectable = false;
      }
      return isSelectable;
    },
    // 点击审核
    reviewClick(id, reviewDataLength) {
      this.id = id;
      this.reviewDialogVisible = true;
      this.reviewDataLength = reviewDataLength;
    },
    checkClassName(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-caveat'
      } else if (value == '2') {
        return 's-state-success'
      } else if (value == '3') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    handleSelectionChange(rows) {
      this.choseRows = rows;
    },
    clearForm() {
      this.$store.commit('reportReviewPageMutations', '');
      this.$refs.ruleForm.resetFields();
    },
    clearRemarkValidate() {
      this.$refs.ruleForm.clearValidate(['remark'])
    },
    goRepoatPage(dataReportOrderId, status) {
      this.$store.commit('dataReportOrderIdMutations', dataReportOrderId);
      this.$store.commit('reportOperatStatusMutations', status);
      this.$router.push({ path: '/report-manage/report' })
    },
    getTime(value) {
      if (value) {
        return value.substr(0, 10);
      } else {
        return ''
      }
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let dataReportOrderIds = [];
          if (this.reviewDataLength) {
            dataReportOrderIds = [this.id]
          } else {
            this.choseRows.forEach(item => {
              dataReportOrderIds.push(item.id)
            })
          }
          let params = {
            ids: dataReportOrderIds.join(','),
            auditType: this.ruleForm.auditType,
            remark: this.ruleForm.remark
          }
          this.$axiosGet(API.report_auditApplyOrder, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
              if (this.reviewDataLength) {
                BURYINGPOINT.buryingPoint('办公用房', '数据上报', '审核')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '数据上报', '批量审核')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
            this.reviewDialogVisible = false;
            this.YPromptShow = true;
          })
        }
      })
    },
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'dataReportOrderStatus'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.dataReportOrderStatus = res.data.dataReportOrderStatus;
        }
      })
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    getDataRequest() {
      let params = {
        status: this.search.status || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.report_getAreaApply, params).then(res => {
        if (res.result === 'success') {
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
          this.total = 0;
        }
      })
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getDataRequest();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getDataRequest()
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest()
      }
    }
  }
}
</script>