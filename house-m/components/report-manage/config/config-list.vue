<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="参数设置" :item="['参数设置']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/report-manage/config-update">
            <button class="u-bread-btn">参数设置</button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="search.year" type="year" placeholder="选择年度"></el-date-picker>
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
        <el-table :data="list">
          <el-table-column label="序号" width="60px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="reportYear" label="年度"></el-table-column>
          <el-table-column prop="reportYear" label="文件名">
            <template slot-scope="scope">
              <a @click="getFileDetail(scope.row.id)">点击查看附件</a>
            </template>
          </el-table-column>
          <el-table-column prop="reportStartTime" label="数据上报开始时间">
            <template slot-scope="scope">
              {{getTime(scope.row.reportStartTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="reportEndTime" label="数据上报截至时间">
            <template slot-scope="scope">
              {{getTime(scope.row.reportEndTime)}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="{path: '/report-manage/config-update', query: {id: scope.row.id}}">修改</router-link>
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
    <!-- 查看附件弹出框 -->
    <el-dialog title="附件" custom-class="h-dialog-add" :visible.sync="fileDialogShow" width="600px">
      <div>
        <ul v-if="allFileList.length > 0">
          <li v-for=" (item, index) in allFileList" :key="index" style="display:block;">
            <a target="_blank"  v-if="diction.indexOf(index) > -1" :href="item.url" download>{{item.name}}</a>
          </li>
        </ul>
        <div v-else>未上传附件</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fileDialogShow = false">取消</el-button>
      </span>
    </el-dialog>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      diction: [0, 1],
      fileDialogShow: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        year: ''
      },
      list: [],
      id: '',
      allFileList: []
    }
  },
  activated() {
    this.getDataRequest();
    this.getTable();
  },
  deactivated() {
    this.search.year = '';
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  methods: {
    getTable() {
      if (this.areaId.length === 7) {
        this.diction = [0, 1, 2, 3, 4, 5]
      }
      if (this.areaId.length === 10) {
        this.diction = [0, 1, 3, 4, 5]
      }
      if (this.areaId.length === 13) {
        this.diction = [0, 1, 4, 5]
      }
      if (this.areaId.length === 16) {
        this.diction = [0, 1, 5]
      }
    },
    getFileDetail(id) {
      let params = {
        id: id
      }
      this.$axiosGet(API.report_getFile, params).then(res => {
        this.allFileList = res.data || [];
        this.fileDialogShow = true;
      })
    },
    getTime(value='') {
      return value.substr(0,10);
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    getDataRequest() {
      let params = {
        reportYear: DATEFORMAT.dateReturnY(this.search.year),
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.report_getSettingList, params).then(res => {
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
    }
  }
}
</script>