<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="黑名单管理" :item="['黑名单管理']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to='/operate/lessee-manage/lessee-list'>
            <button class="f-pull-right u-bread-btn">
              返回
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>承租人</span>
                  <el-input clearable placeholder="请输入" v-model="search.lesseeName"></el-input>
                </li>
                <li>
                  <span>组织性质</span>
                  <el-select v-model="search.organizationalNature" filterable clearable placeholder="请选择组织性质">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in search.organizationalNatureList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
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
          <el-table-column prop="date" fixed="left" label="序号" width="50" type="index">
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template> -->
          </el-table-column>
          <el-table-column prop="name" label="承租人">
          </el-table-column>
          <el-table-column prop="phone" label="联系电话">
          </el-table-column>
          <el-table-column prop="organizationalNatureName" label="组织性质">
          </el-table-column>
          <el-table-column prop="scopeOfBusiness" label="经营范围">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="blacklistInfoClick(scope.row.id)">详情</a>
              <a @click="YDeleteClick(scope.row.id)">删除</a>
              <a @click="removeBlacklist(scope.row.id)">移除黑名单</a>
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
    <blacklist-detail ref="blacklistDetail"></blacklist-detail>
    <!-- 查看图片 -->
    <v-vuePopupPicture ref="Vpicture"></v-vuePopupPicture>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--移除黑名单-->
    <Y-Prompt v-model="YPromptBlack" :isBol="isIcon" :message="mes" @click="YPromptRemove"></Y-Prompt>

  </div>
</template>

<script>
import blacklistDetail from '@/components/operate/lessee-manage/blacklist-detail'; // 详情弹出框
import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
export default {
  components: {
    'blacklist-detail': blacklistDetail,
    "v-vuePopupPicture": vuePopupPicture
  },
  data() {
    return {
      YPromptBlack: false, // 移除黑名单
      isIcon: false, //移除黑名单的图标
      mes: '', //黑名单信息
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合     
      lesseeName: '',
      nature: '',
      organizationalNatureList: [] ,//组织性质集合
      isBlack:'YES',
      search: {
        organizationalNatureList: [],// 组织性质下拉列表
        organizationalNature: "", //组织性质
        lesseeName: "", //承租人名称
      }
    };
  },
  activated() {
    this.nature = '';
    this.getDataRequest();
    this.getSelectRequest(); // 获取院落下拉框列表
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    }
  },
  methods: {
    // 详情
    blacklistInfoClick(id) {
      this.$refs.blacklistDetail.openModal(id);
    },
    //删除
    YDeleteClick(id) {
      let params = {
        lesseeManageId: id
      }
      this.$axiosPost(API.lessee_doDelete, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('经营性房产', '承租人管理', '从黑名单列表删除')
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
    YPromptRemove() {
      if (this.isIcon) {
        this.getDataRequest();
      }
    },

    //移除黑名单
    removeBlacklist(id) {
      this.isBlack = 'NO'
      let params = {
        lesseeManageId: id,
        blacklist:this.isBlack
      };
      this.$axiosPost(API.lessee_existBlacklist, params).then(res => {
        this.YPromptBlack = true;
        if (res.result === "success") {
          this.isIcon = true;
          BURYINGPOINT.buryingPoint("经营性房产", "承租人管理", "移除黑名单");
          this.mes = "移除黑名单成功";
        } else {
          this.isIcon = false;
        }
       
      });
      this.isBlack = 'YES'
    },
    // 获取组织性质下拉框
    getSelectRequest() {
      this.$axiosGet(API.lessee_queryOrganizationalNatureList, {}).then(res => {
        if (res.data) {
          this.search.organizationalNatureList = res.data;
        }
      });
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //获取列表数据
    getDataRequest() {
      let params = {
        blacklist: this.isBlack,
        pageNum: this.page,
        pageSize: this.pageSize,
        organizationalNature:this.search.organizationalNature || '',
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
     
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },

    // exportClick() { // 到处
    //   window.open(`${API.storeys_export}?token=${this.token}`)
    // this.$axiosPost(API.courtYard_export, params).then(res => {
    // });
    // }
  }
};
</script>

<style lang="scss">
</style>
