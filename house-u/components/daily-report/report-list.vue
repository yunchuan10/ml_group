<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="日常上报" :item="['日常上报']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>主题</span>
                  <el-input clearable v-model="search.title" placeholder="请输入主题"></el-input>
                </li>
                <li>
                  <span>状态</span>
                  <el-select v-model="search.status" placeholder="请选择状态" clearable>
                    <el-option v-for="(item, index) in statusList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>日期</span>
                  <el-date-picker v-model="search.startTime" type="date" placeholder="选择开始日期" :picker-options="pickerOptions1"></el-date-picker>
                  -
                  <el-date-picker v-model="search.endTime" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2"></el-date-picker>
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
          <el-table-column prop="title" label="主题"></el-table-column>
          <el-table-column prop="dateCreated" label="发布日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.dateCreated)}}
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="上报开始日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.startTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="上报截止日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.endTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="statusName" label="状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.status)">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a v-show="scope.row.status != '2'&& scope.row.status != '-1'" @click="uploadFileClick(scope.row.commonReportOrganId)">上报</a>
              <a @click="openDetail(scope.row.id, scope.row.commonReportOrganId)">详情</a>
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
    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 上传附件弹窗 -->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest"></v-upload>
    <!-- 添加上报材料弹出框 -->
    <el-dialog title="添加上报材料" custom-class="h-dialog-add" :visible.sync="addFileDialogShow" width="730px" @close="clearForm">
      <el-form :model="ruleForm" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item label="上报材料" prop="domains" :rules="{required: true, message: '上报材料不能为空', trigger: 'change'}">
          <el-button class="u-upload-btn" @click="emptyFileJson">
            <i class="iconfont icon-daochu"></i>上报材料
          </el-button>
          <ul>
            <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
              <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
              <a :href="item.url" target="_blank" download="download">下载</a>
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFileDialogShow = false" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="submitFileClick" :loading="loading" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件

export default {
  components: {
    'v-upload': vuePopupUpload
  },
  data() {
    let self = this;
    return {
      pickerOptions1: {
        disabledDate(time) {
          if (self.search.endTime) {
            return time.getTime() > self.search.endTime;
          }
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          if (self.search.startTime) {
            return time.getTime() < self.search.startTime;
          }
        }
      },
      page: 1,
      total: 0,
      pageSize: 10,
      title: '',
      search: {
        title: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      ruleForm: {
        domains: []
      },
      commonReportOrganId: '',
      list: [],
      statusList: [],
      maxLength: '5',
      YPromptShow: false,
      isBol: false,
      message: '',
      addFileDialogShow: false,
      loading: false
    }
  },
  activated() {
    this.dataRequest();
    this.getStatus();
  },
  deactivated() {
    this.search.title = '';
    this.search.startTime = '';
    this.search.endTime = '';
    this.search.status = '';
  },
  methods: {
    // 时间格式切换
    checkTime(value) {
      if (value) {
        return value.substr(0, 10)
      }
    },
    // 状态转换
    checkStatus(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-prohibited'
      } else if (value == '2') {
        return 's-state-success'
      } else if (value == '-1') {
        return 's-state-success'
      } else {
        return ''
      }
    },
    // 获取状态值
    getStatus() {
      this.$axiosGet(API.commonReport_commonReportStatus, {}).then(res => {
        this.statusList = res.data;
      })
    },
    // 点击查询获取数据
    getSearch() {
      this.page = 1;
      this.dataRequest();
    },
    // 获取数据调用接口
    dataRequest() {
      let params = {
        title: this.search.title,
        startTime: DATEFORMAT.dateReturn(this.search.startTime),
        endTime: DATEFORMAT.dateReturn(this.search.endTime),
        status: this.search.status,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.commonReport_listUserReport, params).then(res => {
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
    // 跳转到详情页面
    openDetail(id, commonReportOrganId) {
      this.$store.commit('commonReportIdMutations', id);
      this.$store.commit('commonReportOrganIdMutations', commonReportOrganId);
      this.$router.push({ path: '/daily-report/detail/info' })
    },
    // 切换页面数量获取数据
    handleSizeChange(i) {
      this.pageSize = i;
      this.dataRequest();
    },
    // 切换分页获取数据
    handleCurrentChange(i) {
      this.page = i;
      this.dataRequest();
    },
    // 上报弹出框打开
    uploadFileClick(commonReportOrganId) {
      this.commonReportOrganId = commonReportOrganId;
      this.addFileDialogShow = true;
    },
    // 清楚表单
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 上传文件回调方法赋值
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
      this.$refs.ruleForm.validateField('domains');
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1);
      this.maxLength = 5 - this.ruleForm.domains.length;
      this.$refs.ruleForm.validateField('domains');
    },
    // 打开上传附件弹出框
    emptyFileJson() {
      this.$refs.VUpload.openModal()
    },
    // 点击上报上传文件
    submitFileClick() {
      this.$refs.ruleForm.validate((vaild) => {
        if (vaild) {
          let params = {
            id: this.commonReportOrganId,
            fileRequestList: this.ruleForm.domains
          }
          this.loading = true;
          this.$axiosJsonPost(API.commonReport_doReport, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.loading = false;
            this.YPromptShow = true;
            this.addFileDialogShow = false;
          })
        }
      })
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.dataRequest();
      }
    }
  }
};
</script>
