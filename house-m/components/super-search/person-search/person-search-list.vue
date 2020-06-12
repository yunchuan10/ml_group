<template>
  <div>
    <!--  tab切换 -->
    <!-- <ul class="house-nav-tab">
      <router-link :to="{path: '/super-search/search-list/person-search-list/user-search-list'}" active-class="active" tag="li">
        <a>使用人
          <i class="f-weight-bold">（{{total}}）</i>
        </a>
      </router-link> -->
    <!-- <router-link :to="{path: '/super-search/search-list/company-search-list/used-search-list'}" active-class="active" tag="li">
          <a>审批人
            <i class="f-weight-bold">（{{waitTotal}}）</i>
          </a>
        </router-link>        -->
    <!-- </ul> -->
    <keep-alive>
      <router-view @getNum='getNum'></router-view>
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
    };
  },
  activated() {

  },
  computed: {

  },
  methods: {
    getNum(data) {
      this.total = data;
    }
  },

};
</script>

<style lang="scss">
</style>
