<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>单位名称</span>
                <el-input clearable v-model="search.organName" placeholder="请输入单位名称"></el-input>
              </li>
              <li>
                <span>状态</span>
                <el-select v-model="search.status" placeholder="请选择状态" clearable>
                  <el-option v-for="(item, index) in statusList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
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
        <el-table-column prop="date" fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column label="单位名称" prop="toOrganName"></el-table-column>
        <el-table-column label="上报人" prop="realName"></el-table-column>
        <el-table-column label="上报日期">
          <template slot-scope="scope">
            {{checkTime(scope.row.reportTime)}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.status)">{{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a v-show="scope.row.status == '2'" @click="returnClick(scope.row.id, 'DOWNLOAD')">下载上报表格</a>
            <a v-show="scope.row.status == '2'" @click="returnClick(scope.row.id, 'RETURN')">退回</a>
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

    <!-- 退回弹出框 -->
    <el-dialog title="退回" custom-class="h-dialog-add u-daily-report" :visible.sync="returnDialogShow" width="730px" @close="clearForm">
      <el-form :model="ruleForm" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item label="退回意见" prop="remark" :rules="{required: true, message: '退回意见不能为空', trigger: 'change'}">
          <el-input type="textarea" v-model="ruleForm.remark" :maxlength="200" :rows="5" placeholder="请输入退回意见"></el-input>
        </el-form-item>
        <div class="f-pull-right">{{ruleForm.remark.length}}/200</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnDialogShow = false" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="getbatchAddDataRequest" :loading="loading" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>
    <!-- 下载上报表格 -->
    <el-dialog title="下载上报表格" custom-class="h-dialog-add" :visible.sync="downloadDialogShow" width="730px">
      <div>
        <ul>
          <li v-for="(item, index) in fileList" :key="index">
            {{index + 1}}.{{item.name}}
            <a :href="item.url" download="download" target="_blank" style="margin-left: 20px;">下载</a>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="downloadDialogShow = false" class="u-submit-btn submit-btn">确定</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      returnDialogShow: false, // 退回弹出框
      downloadDialogShow: false, // 下载弹出框
      YPromptShow: false, // 操作成功弹出框
      isBol: false,
      message: '', // 回调显示信息
      page: 1, // 页数
      total: 0, // 数据总数
      pageSize: 10, // 每页数据条数
      statusList: [], // 状态列表
      search: {  // 搜索条件
        organName: '',
        status: ''
      },
      ruleForm: { // 表单数据
        remark: ''
      },
      loading: false, // 加载状态
      list: [], // 列表数据
      id: '', // 上报设置ID
      fileList: [] // 文件列表
    }
  },
  computed: {
    commonReportId() {
      return this.$store.state.mainData.commonReportId;
    }
  },
  activated() {
    this.getStatus();
    this.dataRequest();
  },
  deactivated() {
    this.search.organName = '';
    this.search.status = '';
  },
  methods: {
    // 时间格式转换
    checkTime(value) {
      if (value) {
        return value.substr(0,10);
      }
    },
    // 状态样式转换
    checkStatus(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-prohibited'
      } else if (value == '2') {
        return 's-state-success'
      } else {
        return ''
      }
    },
    // 获取上报状态
    getStatus() {
      this.$axiosGet(API.commonReport_commonReportStatus, {}).then(res => {
        this.statusList = res.data;
      })
    },
    // 查询点击获取数据
    getSearch() {
      this.page = 1;
      this.dataRequest();
    },
    // 调用接口获取数据
    dataRequest() {
      if (this.search.status == null) {
        this.search.status = '';
      }
      let params = {
        commonReportSettingId: this.commonReportId,
        toOrganName: this.search.organName,
        status: this.search.status,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.commonReport_listMangeReport, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        }
      })
    },
    // 切换页面数据条数获取数据
    handleSizeChange(i) {
      this.pageSize = i;
      this.dataRequest();
    },
    // 切换页数获取数据
    handleCurrentChange(i) {
      this.page = i;
      this.dataRequest();
    },
    // 退回跟下载点击
    returnClick(id, state) {
      this.id = id;
      if (state == 'RETURN') {
        this.returnDialogShow = true;
      } else {
        this.downloadDialogShow = true;
        this.getFileList();
      }
    },
    // 获取下载的文件
    getFileList() {
      let params = {
        id: this.id
      }
      this.$axiosGet(API.commonReport_listFile, params).then(res => {
        this.fileList = res.data || [];
      })
    },
    // 退回
    getbatchAddDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.id,
            remark: this.ruleForm.remark
          }
          this.loading = true;
          this.$axiosGet(API.commonReport_return, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false
            }
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
            this.returnDialogShow = false;
          })
        }
      })
    },
    // 清空表单
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.dataRequest();
      }
    }
  }
}
</script>

<style lang="scss">
.u-daily-report {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>