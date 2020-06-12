<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="系统日志" :item="['系统日志']" type="1"></Y-Breadcrumb>
      </div>
      <!-- <ul class="house-nav-tab">
        <li>
          <router-link to="/system-log/log-in-log">登录日志</router-link>
        </li>
        <li class="active">
          <a>操作日志</a>
        </li>
      </ul> -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>系统模块</span>
                  <el-select v-model="search.systemModule" filterable clearable placeholder="请选择系统类型" @change="transformationList">
                    <el-option v-for="(item, index) in systemDropDown" :label="item.label" :value="item.label" :key="index"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>操作模块</span>
                  <el-select v-model="search.operationModule" filterable clearable placeholder="请选择操作模块">
                    <el-option v-for="(item, index) in operationDropDown" :label="item.label" :value="item.label" :key="index"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>操作类型</span>
                  <el-input v-model="search.operationType" placeholder="请输入操作类型"></el-input>
                </li>

                <li>
                  <span>操作人员</span>
                  <el-input v-model="search.userName" placeholder="请输入操作人员"></el-input>
                </li>
                <li>
                  <span>操作时间</span>
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
        <el-table :data="roleList" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="操作时间">
            <template slot-scope="scope">
              {{scope.row.createdAt ? scope.row.createdAt.substr(0, 16).replace(/T/,'&nbsp;'):'—'}}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="操作人员"></el-table-column>
          <el-table-column prop="systemModule" label="系统模块"></el-table-column>
          <el-table-column prop="operationModule" label="操作模块"></el-table-column>
          <el-table-column prop="operationType" label="操作类型"></el-table-column>
          <!-- <el-table-column prop="logContent" label="日志内容" width="500"></el-table-column> -->
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
        userName: '', //人员名称
        systemModule: '', //系统模块
        operationModule: '', //操作模块
        operationType: '', //操作类别
        startTime: '', //操作开始时间
        endTime: '', //操作结束时间
      },

      roleList: [], //列表数据
      operationDropDown: [], //操作下拉
      operationDropDownList: [], //操作下拉存值
      systemDropDown: [], //系统下拉
    }
  },
  activated() {
    this.getCharacterList();
    this.getMenuList()
  },
  methods: {
    getSearch() {
      this.page = 1;
      this.getCharacterList();
    },
    //获取下拉选
    getMenuList() {
      this.$axiosPost(API.userLog_treeOfSysDic, {}).then(res => {
        this.systemDropDown = res.data || [];
        let list = [];
        this.systemDropDown.forEach((item, index) => {
          item.children.forEach((it, ex) => {
            list.push(it)
          })
        });
        this.operationDropDown = list;
        this.operationDropDownList = list;
      })
    },
    //分组下拉数据
    transformationList() {
      if (this.search.systemModule == null) {
        this.search.systemModule = '';
        this.operationDropDown = this.operationDropDownList;
      }
      this.systemDropDown.forEach((item, index) => {
        if (item.label == this.search.systemModule) {
          this.operationDropDown = item.children
        }
      })
    },
    // 获取数据
    getCharacterList() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        userName: this.search.userName,
        systemModule: this.search.systemModule,
        operationModule: this.search.operationModule || '',
        operationType: this.search.operationType,
        startTime: FORMATGET.formatGET(this.search.startTime),
        endTime: FORMATGET.formatGET(this.search.endTime),
      }
      this.$axiosGet(API.userLog_pageOfOperationLog, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
            item.dateCreated = DATEFORMAT.dateReturnYMDHMS(new Date(item.dateCreated));
          });
          this.roleList = list || [];
        } else {
          this.roleList = [];
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