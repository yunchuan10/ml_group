<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="登录日志" :item="['登录日志']" type="1"></Y-Breadcrumb>
      </div>
      <ul class="house-nav-tab">
        <li class="active">
          <a>登录日志</a>
        </li>
        <li>
          <router-link to="/system-log/operational-log">操作日志</router-link>
        </li>
      </ul>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>登录人员</span>
                  <el-input v-model="search.userName" placeholder="请输入登录人员"></el-input>
                </li>
                <li>
                  <span>登录时间</span>
                  <el-date-picker v-model="search.startTime" type="date" placeholder="选择日期">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="search.endTime" type="date" placeholder="选择日期">
                  </el-date-picker>
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
        <el-table :data="characterList" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="dateCreated" label="登录时间">
            <template slot-scope="scope">
              <!-- {{scope.row.dateCreated ? scope.row.dateCreated.substr(0, 16).replace(/T/,'&nbsp;'):'—'}} -->
              {{scope.row.dateCreated}}
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="登录人员"></el-table-column>
          <el-table-column prop="account" label="登录账号"></el-table-column>
          <el-table-column prop="ip" label="IP"></el-table-column>
          <el-table-column prop="loginEquipment" label="登录设备" width="700"></el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        userName: '',
        startTime: '',
        endTime: ''
      },
      characterList: [],

    }
  },
  activated() {
    this.getCharacterList();
  },
  methods: {
    getSearch() {
      this.page = 1;
      this.getCharacterList();
    },
    getCharacterList() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        userName: this.search.userName,
        startTime: FORMATGET.formatGET(this.search.startTime),
        endTime: FORMATGET.formatGET(this.search.endTime)
      }
      this.$axiosPost(API.manageLog_pageOfLoginLog, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.list || [];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
            item.dateCreated = DATEFORMAT.dateReturnYMDHMS(new Date(item.dateCreated));
          });
          this.characterList = list;
        } else {
          this.characterList = [];
        }

      })
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getCharacterList();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getCharacterList();
    },

  }
}
</script>