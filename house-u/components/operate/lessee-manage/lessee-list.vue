<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="承租人管理" :item="['承租人管理']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/operate/lessee-manage/lessee-update/add">
            <button class="f-pull-right u-bread-btn">新增承租人</button>
          </router-link>
          <router-link to="/operate/lessee-manage/blacklist-list">
            <button class="f-pull-right u-bread-btn">黑名单管理</button>
          </router-link>
          <!-- <button class="f-pull-right u-bread-btn">批量导入</button> -->
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>承租人</span>
                  <el-input clearable placeholder="请输入承租人" v-model="search.lesseeName"></el-input>
                </li>
                <li>
                  <span>组织性质</span>
                  <el-select v-model="search.organizationalNature" clearable placeholder="请选择组织性质">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in search.organizationalNatureList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
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
          <el-table-column fixed="left" label="序号" width="50" type="index">
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>-->
          </el-table-column>
          <el-table-column prop="name" label="承租人"></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column prop="organizationalNatureName" label="组织性质"></el-table-column>
          <el-table-column prop="scopeOfBusiness" label="经营范围"></el-table-column>
          <el-table-column fixed="right" prop label="操作">
            <template slot-scope="scope">
              <a @click="blacklistInfoClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/operate/lessee-manage/lessee-update/edit', params:{type:'edit'}, query:{id: scope.row.id}}">修改</router-link>
              <a @click="YDeleteClick(scope.row.id)">删除</a>
              <a @click="setBlacklist(scope.row.id)">列入黑名单</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>-->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 详情 -->
    <blacklist-detail ref="blacklistDetail"></blacklist-detail>
    <!-- 查看图片 -->
    <v-vuePopupPicture ref="Vpicture"></v-vuePopupPicture>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--列入黑名单-->
    <Y-Prompt v-model="YPromptBlack" :isBol="isIcon" :message="mes" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import blacklistDetail from "@/components/operate/lessee-manage/blacklist-detail"; // 详情弹出框
import vuePopupPicture from "@/assembly/vue-popup-picture"; // 图片控件
export default {
  components: {
    "blacklist-detail": blacklistDetail,
    "v-vuePopupPicture": vuePopupPicture
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      YPromptBlack: false, // 列入黑名单
      isBol: false, // 操作成功弹出框的图标
      isIcon: false, //列入黑名单的图标
      message: "", // 确认信息
      mes: "", //黑名单信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页



      id: "", //删除id
      list: [], // 列表数据集合
      isBlack: "NO", //是否展示黑名单
      search: {
        organizationalNatureList: [],// 组织性质下拉列表
        organizationalNature: "", //组织性质
        lesseeName: "", //承租人名称
      }
    };
  },
  activated() {
    this.search.organizationalNature = "";
    this.getDataRequest();
    this.getSelectRequest(); // 获取组织性质下拉框列表
  },
  computed: {
    token() {
      return this.$store.state.mainData.token;
    }
  },
  methods: {
    requestData() {
      this.getDataRequest();
    },
    // 详情
    blacklistInfoClick(id) {
      this.$refs.blacklistDetail.openModal(id);
    },
    // 删除
    YDeleteClick(id) {
      let params = {
        lesseeManageId: id
      };
      this.$axiosPost(API.lessee_doDelete, params).then(res => {
        this.YPromptShow = true;
        if (res.result === "success") {
          this.isBol = true;
          BURYINGPOINT.buryingPoint("经营性房产", "承租人管理", "删除承租人");
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      });
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
      if (this.isIcon) {
        this.getDataRequest();
      }
    },

    //列入黑名单
    setBlacklist(id) {
      this.isBlack = 'YES'
      let params = {
        lesseeManageId: id,
        blacklist: this.isBlack
      };
      this.$axiosPost(API.lessee_existBlacklist, params).then(res => {
        this.YPromptBlack = true;
        if (res.result === "success") {
          this.isIcon = true;
          BURYINGPOINT.buryingPoint("经营性房产", "承租人管理", "列入黑名单");
        } else {
          this.isIcon = false;
        }
        this.mes = res.message;
      });
      this.isBlack = 'NO'
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        blacklist: this.isBlack,
        pageNum: this.page,
        pageSize: this.pageSize,
        organizationalNature: this.search.organizationalNature || '',
        lesseeName: this.search.lesseeName,
      };
      this.$axiosGet(API.lessee_list, params).then(res => {
        let list = [];
        if (res.data) {
          this.list = res.data.data;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }

        // if (list) {
        //   list.forEach((item, index) => {
        //     list[index].num = index + 1;
        //   });
        // }
        // this.list = list;
      });
    },
    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取组织性质下拉框
    getSelectRequest() {
      this.$axiosGet(API.lessee_queryOrganizationalNatureList, {}).then(
        res => {
          if (res.data) {
            this.search.organizationalNatureList = res.data

          }
        }
      );
    }
    // exportClick() { // 导出
    //   window.open(`${API.storeys_export}?token=${this.token}`)
    // this.$axiosPost(API.courtYard_export, params).then(res => {
    // });
    // }
  }
};
</script>

<style lang="scss">
</style>
