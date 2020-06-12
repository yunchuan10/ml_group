<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待方案" :item="['方案详情']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div v-show="type != 'adddd'" class="f-pull-right u-bread-btn f-cursor-pointer" @click="$router.go(-1)">
            返回
          </div>
          <div v-show="addShow" style="margin-right: 10px;" class="f-pull-right u-bread-btn f-cursor-pointer" @click="goAdd">
            新增子方案
            <!-- <router-link :to="{path: '/reception-manage/add-serve/car-use-edit', query: {id, type:'add', planNo}}">新增子方案</router-link> -->
          </div>
        </div>
      </div>
      <ul class="house-nav-tab" v-show="type!='add'">
        <router-link replace :to="{path: '/reception-manage/reception-reveal/reception-informat', query: {type, id, planNo}}" tag="li">
          <a>基础信息</a>
        </router-link>
        <router-link replace :to="{path: '/reception-manage/reception-reveal/subschemes-list', query: {type, id, planNo}}" tag="li">
          <a>接待方案</a>
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
    };
  },
  activated() {
    this.type = this.$route.query.type||'';
    this.id = this.$route.query.id||'';
    this.planNo = this.$route.query.planNo||'';    
  },
  deactivated() {
    this.$destroy()
  },
  computed: {
    addShow(){
      let subschemes = (this.$route.path.includes('/subschemes-list'));
      return (subschemes && this.type != 'read');
    }
  },
  methods: {
    goAdd(){
      this.type = this.$route.query.type||'';
      this.id = this.$route.query.id||'';
      this.planNo = this.$route.query.planNo||'';
      let { planNo, id } = this;
      this.$router.push({ path: '/reception-manage/add-serve/car-use-edit', query: { type: 'add', planNo, id } });
    }
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
