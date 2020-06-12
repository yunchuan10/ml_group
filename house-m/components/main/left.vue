<template>
  <div class="m-overflow" id="m-left-menu">
    <el-col class="m-left">
      <div class="u-login-info f-clearfix">
        <span class="icon">
          <img :src="$store.state.imgPath.loginIcon">
        </span>
        <span class="name">
          {{realName}}
        </span>
        <span class="menu-btn" @click="leftbarClick">
          <i class="iconfont" :class="this.leftIcon"></i>
        </span>
      </div>
      <div>
        <el-scrollbar wrap-class="m-scrollbar-wrapper" style="height:100%;">
          <el-menu router unique-opened :default-active="routeActive" class="el-menu-vertical-demo" :collapse="collapse">
          <!-- <el-menu router unique-opened :default-active="$route.path" class="el-menu-vertical-demo" :collapse="collapse"> -->
            <!-- <el-menu-item index="/home"> <strong class="iconfont icon-jichu" style="font-weight: normal;"></strong>首页</el-menu-item> -->
            <el-submenu v-for="(li, index) in menulist" :index="index + ''" :key="li.id">
              <template slot="title" v-if="li.children">
                <strong class="iconfont" style="font-weight: normal;" :class="li.icon"></strong>
                <span slot="title" class="title">{{li.name}}</span>
              </template>
              <template slot="title" v-if="!li.children">
                <!-- <strong class="iconfont" style="font-weight: normal;" :class="li.icon"></strong>
                <span slot="title" class="title">{{li.name}}</span> -->
                <el-menu-item class="u-first-level-menu" :index="li.url">
                  <span class="u-first-menu-span"></span>
                  <strong class="iconfont" :class="li.icon" style="font-weight: normal;"></strong>
                  <span slot="title" class="title">{{li.name}}</span>
                </el-menu-item>
              </template>
              <el-menu-item-group v-if="li.children">
                <el-menu-item v-for="item in li.children" :key="item.id" :index="item.url">{{item.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'collapse',
    event: 'collapseEvent'
  },
  props: ['collapse'],
  data() {
    return {

      routeActive: '',

      list: [],
      menulist: [],
      leftbarImg: this.$store.state.imgPath.leftbarClose, // 左侧菜单收缩图标
      leftIcon: 'icon-shouqi'
    };
  },
  created() {
    this.menuRequest(); // 获取左侧菜单
    if (this.collapse) {
      this.leftbarImg = this.$store.state.imgPath.leftbarOpen;
    } else {
      this.leftbarImg = this.$store.state.imgPath.leftbarClose;
    }
  },

  computed: {
    menuStatu() {
      return this.$store.state.mainData.menuStatu;
    },
    realName() {
      return this.$store.state.mainData.realName;
    },
    navId() {
      return this.$store.state.mainData.navId;
    },
    token() {
      return this.$store.state.mainData.token;
    }
  },
  watch: {
    navId(val) {
      this.menuRequest();
    },
    token(val) {
      this.menuRequest();
    }
  },

  methods: {  
    // 获取左侧菜单
    menuRequest() {
      this.routeActive = this.$store.state.mainData.headeRouteActive || this.$route.path;  // 左侧菜单选中

      let params = {
        projectCode: 'HOUSE-ADMIN',
        id: this.navId,
        type: 'LEFT'
      }
      this.$axiosGet(API.resources_getResources, params).then(res => {
        this.menulist = res.data;
        // if (this.jurisdiction = 'error') {
        //   this.Tips = res.message;
        //   this.$router.push({ path: '/jurisdiction', query: { Tips: this.Tips } })
        // }
      })
    },
    leftbarClick() {
      // 菜单收缩/展开
      if (this.collapse) {
        this.$emit('collapseEvent', false);
        this.leftIcon = "icon-shouqi";
        this.leftbarImg = this.$store.state.imgPath.leftbarClose;
      } else {
        this.$emit('collapseEvent', true);
        this.leftIcon = "icon-zhankai";
        this.leftbarImg = this.$store.state.imgPath.leftbarOpen;
      }
    }
  }
};
</script>

<style lang="scss">
.m-scrollbar-wrapper {
  overflow-x: hidden !important;
  margin-right: 0 !important;
}

.m-overflow::-webkit-scrollbar {
  display: none;
}
#m-left-menu {
  .el-submenu .el-submenu__title {
    padding: 0 !important;
  }
}
</style>