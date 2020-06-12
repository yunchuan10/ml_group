<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="日常上报" :item="['日常上报']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to='/daily-report/update'>
            <button class="f-pull-right u-bread-btn">
              新增
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
          <el-table-column prop="createdAt" label="发布日期">
            <template slot-scope="scope">
              {{checkTime(scope.row.createdAt)}}
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
              <!-- <span class="z-state" :class="checkStatus(scope.row.status)">{{scope.row.statusName}}</span> -->
              <span class="z-state" :class="checkStatus(scope.row.statusName)">{{scope.row.statusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="openDetail(scope.row.id)">详情</a>
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
  </div>
</template>

<script>
export default {
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
      search: { // 查询值
        title: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      list: [], // 列表数据
      statusList: [ // 上报状态
        {
          dicName: '上报中',
          dicValue: '3'
        },
        {
          dicName: '已完结',
          dicValue: '4'
        },
        {
          dicName: '未开始',
          dicValue: '5'
        }
      ]
    }
  },
  activated() {
    this.dataRequest();
  },
  deactivated() {
    this.search.title = '';
    this.search.startTime = '';
    this.search.endTime = '';
    this.search.status = '';
  },
  methods: {
    // 时间格式转换
    checkTime(value) {
      if (value) {
        return value.substr(0,10)
      }
    },
    // 状态样式转换
    checkStatus(value) {
      // if (value == '3') {
      if (value == '上报中') {
        return 's-state-apply'
      } else if (value == '已完结') {
        return 's-state-success'
      } else {
        return 's-state-fail'
      }
    },
    // 点击查询获取数据
    getSearch() {
      this.page = 1;
      this.dataRequest();
    },
    // 调用获取数据接口
    dataRequest() {
      let params = {
        title: this.search.title,
        startTime: DATEFORMAT.dateReturn(this.search.startTime)||null,
        endTime: DATEFORMAT.dateReturn(this.search.endTime)||null,
        status: this.search.status || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.commonReport_listSetting, params).then(res => {
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
    openDetail(id) {
      this.$store.commit('commonReportIdMutations', id);
      this.$router.push({ path: '/daily-report/detail/info' })
    },
    // 切换页面数据条数获取数据
    handleSizeChange(i) {
      this.pageSize = i;
      this.dataRequest();
    },
    // 切换分页获取数据
    handleCurrentChange(i) {
      this.page = i;
      this.dataRequest();
    }
  }
};
</script>
