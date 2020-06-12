<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标预警" :item="['超标预警']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/warning-manage/organ-list">
            <button class="u-bread-btn">返回</button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>姓名</span>
                  <el-input v-model="search.name" clearable placeholder="请输入姓名"></el-input>
                </li>
                <li>
                  <span>职务级别</span>
                  <el-select v-model="search.jobLevel" clearable placeholder="请选择职务级别">
                    <el-option v-for="(item, index) in dutyLevelList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>状态</span>
                  <el-select v-model="search.status" clearable placeholder="请选择状态">
                    <el-option v-for="(item, index) in warningStatusList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
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
        <el-table :data="list" style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="realName"></el-table-column>
          <el-table-column label="所在部门" prop="deptName"></el-table-column>
          <el-table-column label="职务级别" prop="dutiesLevelName"></el-table-column>
          <!-- <el-table-column label="职务名称" prop="dutyName"></el-table-column> -->
          <el-table-column label="编制情况" prop="established"></el-table-column>
          <el-table-column label="房间号" prop="roomNo"></el-table-column>
          <el-table-column label="房屋位置" prop="roomAddress"></el-table-column>
          <el-table-column label="标准面积（㎡）" prop="standardArea"></el-table-column>
          <el-table-column label="实际分摊面积" prop="realShareArea">
                <template slot-scope="scope">{{scope.row.realShareArea | dot2}}</template>
          </el-table-column>
          <el-table-column label="超标面积" prop="excessiveArea"></el-table-column>
          <el-table-column label="状态" prop="statusName" v-if="type == 'area'">
            <template slot-scope="scope">
              <span class="z-state" :class="checkClass(scope.row.status)">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="type == 'area'">
            <template slot-scope="scope">
              <!-- <a v-show="scope.row.status == 'noback'" @click="filingClick(scope.row.id)">超标备案</a> -->
              <a @click="detailDialogClick(scope.row.userId)">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </section>
    <!-- 详情 -->
    <v-detail ref="detail"></v-detail>
  </div>
</template>

<script>
import detail from '@/components/warning-manage/detail' // 上传控件

export default {
  components: {
    'v-detail': detail
  },
  data() {
    return {
      total: 0,
      pageSize: 10,
      page: 1,
      search: { // 查询项
        name: '',
        jobLevel: '',
        status: ''
      },
      list: [], // 列表数据
      fileList: [], // 上传文件
      ruleForm: {
        reason: '' //超标原因
      },
      excessiveWarningId: '',
      dutyLevelList: [], // 职务级别
      warningStatusList: [], // 状态
      organId: '',
      type: ''
    }
  },
  activated() {
    this.organId = this.$route.query.organId;
    this.type = this.$route.query.type;
    this.getdataRequest();
    this.getDutyLevel();
    this.getWarningStatusDic();
  },
  methods: {
    // 状态样式转换
    checkClass(value) {
      if (value == 'noback') {
        return 's-state-apply';
      } else if (value == 'back') {
        return 's-state-success';
      } else if (value == 'deal') {
        return 's-state-caveat';
      } else {
        return '';
      }
    },
    // 获取职务级别
    getDutyLevel() {
      this.$axiosPost(API.warning_getDutyLevel, {}).then(res => {
        this.dutyLevelList = res.data || [];
      })
    },
    // 获取备案状态
    getWarningStatusDic() {
      this.$axiosPost(API.warning_getWarningStatusDic, {}).then(res => {
        this.warningStatusList = res.data || [];
      })
    },
    // 打开详情
    detailDialogClick(id) {
      this.$refs.detail.openModal(id)
    },
    // 清空备案表单--关闭弹出框
    clearForm() {
      this.fileList = [];
      this.$refs.ruleForm.resetFields();
    },
    getSearch() {
      this.page = 1;
      this.getdataRequest();
    },
    // 获取列表数据
    getdataRequest() {
      let params = {
        platForm: 'manageSystem',
        organId: this.organId || '',
        dutiesLevelKey: this.search.jobLevel || '',
        realName: this.search.name || '',
        status: this.search.status || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.warning_userList, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getdataRequest();
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getdataRequest();
    },
    //上传附件
    emptyFileJson: function () {
      if (this.fileList.length < 10) {
        this.$refs.VUpload.openModal(this.fileList);
      } else {
        this.isBol = false;
        this.isClose = false;
        this.message = '最多只能上传10个文件';
        this.promptDialog = true;
      }
    },
    fileUploadRequest(fileList) { // 附件上传请求接口
      fileList.forEach(value => {
        this.fileList.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList: function (index) { // 删除附件
      this.fileList.splice(index, 1)
    }
  }
}
</script>