<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <Y-Breadcrumb title="里程碑" :item="['里程碑']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/milestone-manage/new-milestone">
            <button class="u-bread-btn">新建里程碑</button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>项目名称</span>
                  <el-input clearable placeholder="请输入项目名称" v-model="search.projectName"></el-input>
                </li>
                <li>
                  <span>里程碑名称</span>
                  <el-input clearable placeholder="请输入里程碑名称" v-model="search.buildingProjectMilepostName"></el-input>
                </li>
                <li>
                  <span>日期</span>
                  <el-date-picker v-model="search.startDate" :picker-options="pickerOptions0" type="date" placeholder="选择开始日期">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="search.endDate" :picker-options="pickerOptions0" type="date" placeholder="选择结束日期">
                  </el-date-picker>
                </li>
              </ul>
            </td>

            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
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
          <el-table-column prop="projectName" label="项目名称"></el-table-column>
          <el-table-column prop="milepostName" label="里程碑名称"></el-table-column>
          <el-table-column prop="startDate" label="开始日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.startDate)}}
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="结束日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.endDate)}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/milestone-manage/new-milestone', query:{buildingProjectMilepostId: scope.row.id}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>

    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import basicDetail from '@/components/milestone-manage/milestone-details'; // 详情弹出框
export default {
  components: {
    'basic-detail': basicDetail,
  },
  data() {
    let self = this;
    return {
      pickerOptions0: {
        disabledDate(time) {
          if (self.search.endDate) {
            return time.getTime() > self.search.endDate;
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.search.stratDate) {
            return time.getTime() < self.search.stratDate;
          }
        }
      },
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      buildingProjectMilepostId: '',
      search: {
        projectName: '',
        buildingProjectMilepostName: '',
        startDate: '',
        endDate: ''
      }
    };
  },
  activated() {
    this.getDataRequest();
  },
  deactivated() {
    this.search.projectName = '';
    this.search.buildingProjectMilepostName = '';
    this.search.startDate = '';
    this.search.endDate = '';
  },
  methods: {
    checkTime(value) {
      if (value) {
        return value.substr(0, 10);
      }
    },
    // 详情
    basicInfoClick(id) {
      this.$refs.basicDetail.openModal(id);
    },
    deleteClick(id) { // 存储删除参数
      this.buildingProjectMilepostId = id;
      this.YConfirmShow = true;
      this.message = '您确认要删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.buildingProjectMilepostId
      }
      this.$axiosPost(API.buildingProject_deleteMilePost, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
        this.YConfirmShow = false;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
        this.rentEntryVisible = false;
      }
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        projectName: this.search.projectName,
        milepostName: this.search.buildingProjectMilepostName,
        startDate: DATEFORMAT.dateReturn(this.search.startDate)||null,
        endDate: DATEFORMAT.dateReturn(this.search.endDate)||null
      };
      this.$axiosGet(API.buildingProject_pageOfMilePost, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
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
