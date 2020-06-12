<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="建设项目" :item="['建设项目']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/construction-manage/new-construction">
            <button class="u-bread-btn">新建建设项目</button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>建设单位</span>
                  <el-input clearable placeholder="请输入建设单位" v-model="search.buildingOrganName"></el-input>
                </li>
                <li>
                  <span>项目名称</span>
                  <el-input clearable placeholder="请输入项目名称" v-model="search.projectName"></el-input>
                </li>
                <li>
                  <span>日期</span>
                  <el-date-picker v-model="search.stratDate" :picker-options="pickerOptions0" type="date" placeholder="选择开工日期">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="search.endDate" :picker-options="pickerOptions1" type="date" placeholder="选择完工日期">
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
          <el-table-column prop="buildingOrganName" label="建设单位">
          </el-table-column>
          <el-table-column prop="projectName" label="项目名称">
          </el-table-column>
          <el-table-column prop="projectType" label="工程类型">
          </el-table-column>
          <el-table-column prop="buildAreaOfTotal" label="总建筑面积（㎡）">
          </el-table-column>
          <el-table-column prop="startDate" label="开工日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.startDate)}}
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="完工日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.endDate)}}
            </template>
          </el-table-column>
          <el-table-column prop="projectBudget" label="工程预算（万元）">
          </el-table-column>
          <el-table-column prop="settlementMoney" label="决算金额（万元）">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/construction-manage/new-construction', query:{buildingProjectId: scope.row.id}}">修改</router-link>
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
import basicDetail from '@/components/construction-manage/construction-project-details'; // 详情弹出框
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
      search: {
        buildingOrganName: '',
        projectName: '',
        stratDate: '',
        endDate: ''
      },
      buildingProjectId: '',
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      loading: false,
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [] // 列表数据集合
    };
  },
  activated() {
    this.getDataRequest();
  },
  deactivated() {
    this.search.projectName = '';
    this.search.buildingOrganName = '';
    this.search.stratDate = '';
    this.search.endDate = '';
  },
  computed: {
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
      this.buildingProjectId = id;
      this.YConfirmShow = true;
      this.message = '您确认要删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.buildingProjectId
      }
      this.$axiosPost(API.buildingProject_deleteBuildiingProject, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
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
        buildingOrganName: this.search.buildingOrganName,
        projectName: this.search.projectName,
        startDate: DATEFORMAT.dateReturn(this.search.stratDate),
        endDate: DATEFORMAT.dateReturn(this.search.endDate)
      };
      this.$axiosGet(API.buildingProject_pageOfBuildingProject, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data||[];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
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
