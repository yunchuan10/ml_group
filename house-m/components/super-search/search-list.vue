<template>
  <div>
    <section class="m-main">
      <div class="m-breadcrumb" style="padding: 0px; border-bottom: 1px solid #fff;">
        <!-- <Y-Breadcrumb title="超级搜索" :item="['超级搜索 ']" type="1"></Y-Breadcrumb> -->
      </div>
      <!--导航-->
      <ul class="house-nav-tab ">
        <router-link :to="{path: '/super-search/search-list/person-search-list',query:{realName: this.superSearch}}" tag="li">
          <a>人员 </a>
        </router-link>
        <router-link :to="{path: '/super-search/search-list/company-search-list',query:{organName: this.superSearch}}" :class="this.$route.path ==='/super-search/search-list/company-search-list/cfile-search-list'?'u-active':''" tag="li">
          <a>房间 </a>
        </router-link>
        <router-link :to="{path: '/super-search/search-list/file-search-list', query:{fileName: this.superSearch}}" tag="li">
          <a>文件 </a>
        </router-link>
      </ul>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      realName: '',
      organName: '',
      fileName: '',
      showActive: false,
    };
  },
  activated() {
  },
  computed: {
    superSearch() {
      return this.$store.state.mainData.superSearch;
    }
  },
  watch: {
    '$route'(to, from) {
    },
  },
  deactivated() {
    this.$destroy()
  },
  methods: {
  },

};
</script>

<style lang="scss" scoped>
.m-main {
  .breadcrumb {
    padding: 0;
    // border-bottom: 1px solid #dcdfe6;
  }
}
.router-link-active {
  a {
    border-top: 4px solid #2f70ff;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    color: #2f70ff;
    line-height: 33px;
  }
}
</style>
