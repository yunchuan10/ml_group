<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="巡检管理" :item="['巡检管理']"  type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <!-- <button class="f-pull-right u-bread-btn">批量导入</button> -->
          <router-link to='/inspection-manage/inspection'>
            <button class="f-pull-right u-bread-btn">新增巡检</button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>标题</span>
                  <el-input placeholder="请输入" v-model="search.title" clearable></el-input>
                </li>
              </ul>
            </td>

            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="60">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="fileNo" label="文件编号"></el-table-column>
          <el-table-column prop="type" label="发送类型"></el-table-column>
          <el-table-column prop="name" label="发送对象">
            <template slot-scope="scope">
              {{scope.row.sendType.join('，')}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <a @click="showDetail(scope.row)">详情</a>
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
    <v-inspectionDetail ref="inspectionDetail"></v-inspectionDetail>
  </div>
</template>

<script>
import inspectionDetail from '@/components/inspection-manage/inspection-detail'; // 详情弹出框

export default {
  data() {
    return {
      search: {
        title: ''
      },
      list: [],
      total: 0,
      page: 1,
      pageSize: 10
    };
  },
  activated() {
    this.getDataRequest();
  },
  components: {
    'v-inspectionDetail': inspectionDetail
  },
  methods: {
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //获取列表信息
    getDataRequest() {
      let allDate = [];
      let list = [];
      if (localStorage.getItem('inspectionList')) {
        if (this.search.title) {
          let data = [];
          JSON.parse(localStorage.getItem('inspectionList')).forEach((item, index) => {
            if (item.title.indexOf(this.search.title) != '-1') {
              data.push(item)
            }
          })
          allDate = data;
        } else {
          allDate = JSON.parse(localStorage.getItem('inspectionList'))
        }
      } else {
        allDate = [];
      }
      list = allDate.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
      if (list.length > 0) {
        list.forEach((item, index) => {
          list[index].num = index + 1;
        });
      }
      this.list = list;
      this.total = allDate.length;
    },
    showDetail(data) {
      this.$refs.inspectionDetail.openModal(data)
    }
  }
};
</script>

<style lang="scss">
#u-do-room {
  .el-cascader {
    display: block;
  }
  .h-dialog-add-select {
    width: 448px;
  }
  .el-select {
    display: inline-block;
  }
}
</style>
