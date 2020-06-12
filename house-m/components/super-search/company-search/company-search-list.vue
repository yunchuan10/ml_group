<template>
  <div>
    <!--  tab切换 -->
    <!-- <ul class="house-nav-tab"> -->
    <!-- <router-link :to="{path: '/super-search/search-list/company-search-list/used-search-list',query:{organName: this.superSearch}}" active-class="active" tag="li">
          <a>办公用房使用
            <i class="f-weight-bold">（{{usedTotal}}）</i>
          </a>
        </router-link> -->
    <!-- <router-link :to="{path: '/super-search/search-list/company-search-list/deployment-search-list'}" active-class="active" tag="li">
          <a>申请调配
            <i class="f-weight-bold">（{{planTotal}}）</i>
          </a>
        </router-link> -->
    <!-- <router-link :to="{path: '/super-search/search-list/company-search-list/repair-search-list'}" active-class="active" tag="li">
          <a>大中修
            <i class="f-weight-bold">（{{planTotal}}）</i>
          </a>
        </router-link> -->
    <!-- <router-link :to="{path: '/super-search/search-list/company-search-list/cfile-search-list',query:{fileName: this.superSearch}}" active-class="active" tag="li">
        <a>文件
          <i class="f-weight-bold">（{{fileTotal}}）</i>
        </a>
      </router-link> -->
    <!-- </ul> -->
    <keep-alive>
      <router-view @getTotal='getTotal'></router-view>
    </keep-alive>
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
      usedTotal: 0, // 办公用房使用总数
      fileTotal: 0 // 问价数量总数
    };
  },
  activated() {
  },
  computed: {
    superSearch() {
      return this.$store.state.mainData.superSearch;
    }
  },
  methods: {
    getTotal(data, data1) {
      this.usedTotal = data
      this.fileTotal = data1
    },
  }

};
</script>

<style lang="scss">
</style>
