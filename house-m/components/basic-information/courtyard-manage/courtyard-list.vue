<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="院落管理" :item="['院落管理']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/basic-information/courtyard-manage/courtyard-update/add">
            <button class="f-pull-right u-bread-btn">
              新增院落
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
                  <span>院落名称</span>
                  <el-select v-model="courtyardId" @change="getCourtyardName" filterable clearable placeholder="请选择院落名称">
                    <el-option v-for="item in courtySelectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>物业服务单位</span>
                  <el-input clearable v-model="houseManageCompanyName" placeholder="请输入物业服务单位"></el-input>
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
        <!-- <div class="h-table-popover">
          <v-searchPopover isTableListBol="COURTYARD_INFO">
            <li class="iconfont icon-shaixuan">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div> -->
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="院落名称" prop="name">           
          </el-table-column>
          <el-table-column label="地址坐落" prop="address">
          </el-table-column>
          <el-table-column label="物业服务单位" prop="companyName">
          </el-table-column>
          <el-table-column label="院落航拍图">
            <template slot-scope="scope">
              <i :class="(scope.row.fileResponseList && scope.row.fileResponseList.length) > 0?'icon-dui4':'icon-cuo'" class="u-upload-icon iconfont "></i>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="courtYardInfoClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/basic-information/courtyard-manage/courtyard-update/edit', query: {id: scope.row.id}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 详情弹出框 -->
    <courtyard-detail ref="courtYardDetail"></courtyard-detail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import courtYardDetail from "@/components/basic-information/courtyard-manage/courtyard-detail"; // 详情弹出框
export default {
  components: {
    "courtyard-detail": courtYardDetail,
  },
  data() {
    return {
      houseManageCompanyName: '', //物业服务单位
      courtyardId: '', // 院落ID
      courtyardName: '', //院落名称
      deleteYardId: '', // 删除ID
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      courtySelectList: [] // 查询院落list集合
    };
  },
  activated() {
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["COURTYARD_INFO"];
    },
    oldToken() {
      return this.$store.state.mainData.oldToken
    }
  },
  methods: {
    //院落下拉框
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.id) {
          this.courtyardName = item.name;
        }
      })
    },
    // 存储删除参数
    deleteClick(id) { 
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除院落将会连同该院落下的楼座、楼层、房间一并删除，确认删除吗？'
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.deleteYardId
      }
      this.$axiosPost(API.courtYard_delete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        this.getSelectRequest();
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
      }
    },
    // 详情
    courtYardInfoClick(id) {
      this.$refs.courtYardDetail.openModal(id);
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    // 获取列表数据
    getDataRequest() { 
      if (!this.courtyardId) {
        this.courtyardName = '';
      }
      let params = {
        courtyardId: this.courtyardId || '',
        companyName: this.houseManageCompanyName || '',
        courtyardName: this.courtyardName,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.courtYard_query, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
      });
    },
    // 获取列表数据
    exportClick() { 
      let courtyardId = this.courtyardId || '';
      let houseManageCompanyName = this.houseManageCompanyName || '';
      let courtyardName = this.courtyardName;
      let currentPage = this.page;
      let pageSize = this.pageSize;
      window.open(`${API.courtYard_query}?_token=${this.oldToken}&courtyardId=${courtyardId}&courtyardName=${courtyardName}&houseManageCompanyName=${houseManageCompanyName}&exportFlag=YES&currentPage=${currentPage}&pageSize=${pageSize}`)
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 查询
    searchClick() {
      this.page = 1;
      this.getSelectRequest();
    },
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    }
  }
};
</script>

<style lang="scss">
</style>
