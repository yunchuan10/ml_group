<template>
  <div id="trip-update">
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待方案" :item="['子方案']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn f-cursor-pointer" @click="$router.go(-1)">
            返回
          </div>
        </div>
      </div>
      <ul class="house-nav-tab">
        <router-link replace :to="{path: '/reception-manage/read-serve/car-use', query: {type, id, planNo, planSubId}}" tag="li">
          <a>用车方案</a>
        </router-link>
        <router-link replace :to="{path: '/reception-manage/read-serve/meeting', query: {type, id, planNo, planSubId}}" tag="li">
          <a>会议方案</a>
        </router-link>
        <router-link replace :to="{path: '/reception-manage/read-serve/accommodation', query: {type, id, planNo, planSubId}}" tag="li">
          <a>住宿方案</a>
        </router-link>
        <router-link replace :to="{path: '/reception-manage/read-serve/meals', query: {type, id, planNo, planSubId}}" tag="li">
          <a>用餐方案</a>
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
  data() {
    
    return {
      type: this.$route.query.type||'',     // 进入页面状态 新增add 编辑edit 查看read
      id: this.$route.query.id||'',     
      planNo: this.$route.query.planNo||'',  
      planSubId: this.$route.query.planSubId||'',       // planSubId
    }
  },
  activated() {
    
  },
  deactivated(){
    this.$destroy();
  },
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>
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