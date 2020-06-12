<template>
  <div v-if="typeFlag !== 'type'">
    <el-col class="m-left">
      <!-- <div>
        <strong data-v-75e26f86="" class="iconfont iconhome" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont icon-home" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont icon-shenqing" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont iconmonitoring" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont icontransanction" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont iconDirectory-tree" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont iconchart-bar" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont iconall" style="font-weight: normal;"></strong>
        <strong data-v-75e26f86="" class="iconfont iconmonitoring" style="font-weight: normal;"></strong>
      </div> -->

      <div class="u-login-info f-clearfix">
        <span class="icon">
          <img :src="$store.state.imgPath.loginIcon">
        </span>
        <span class="name">
          {{loginStatu.realName}}
        </span>
        <span class="menu-btn" @click="leftbarClick">
          <i class="iconfont" :class="leftIcon"></i>
        </span>
      </div>
      <div>
        <el-scrollbar wrap-class="m-scrollbar-wrapper" style="height:100%;">
          <el-menu router unique-opened class="el-menu-vertical-demo" :default-active="defaultActive" @select="menuSelect" :collapse="collapse">
            <el-submenu v-for="(li, index) in menulist" :index="index + ''" :key="index">
              <template slot="title">
                <strong class="iconfont" style="font-weight: normal;" :class="getIcon(li.menuClass)"></strong>
                <span slot="title" class="title">{{li.menuName}}</span>
              </template>
              <el-menu-item-group v-if="li.childrenList">
                <el-menu-item v-for="(item, index1) in li.childrenList" :key="index-index1" :index="item.path">{{item.menuName}}</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group v-else>
                <el-menu-item :index="li.path">{{li.menuName}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-col>
  </div>
</template>

<script>
import menuList from '@/utils/menuData'
// console.log(JSON.stringify(menuList), 4444444);
export default {
  model: {
    prop: 'collapse',
    event: 'collapseEvent'
  },
  props: ['collapse'],
  data() {
    return {
      leftIcon: 'icon-shouqi',
      typeFlag: '',
      list: [],
      menulist: [],
      leftbarImg: this.$store.state.imgPath.leftbarClose, // 左侧菜单收缩图标
      defaultActive: '/home' // 默认选中路由
    };
  },
  created() {
    this.defaultActive = this.$route.path;
    this.menuRequest(); // 获取左侧菜单
    // this.defaultRoute(); // 设置已选中路由菜单
    // if (this.collapse) {
    //   this.leftbarImg = this.$store.state.imgPath.leftbarOpen;
    // } else {
    //   this.leftbarImg = this.$store.state.imgPath.leftbarClose;
    // }
    // this.defaultActive = this.$store.state.store.defaultActive; // 默认选中路由
  },
  activated() {
    this.defaultActive = this.$route.path;
  },
  watch: {
    token() {
      this.menuRequest();
    },
  },
  computed: {
    // menuStatu() {
    //   return this.$store.state.mainData.menuStatu;
    // },
    loginStatu() {
      return this.$store.state.mainData.loginStatu||{};
    },

    token() { // store.state.mainData.token
      return this.$store.state.mainData.token||'';
    },

    
    myMenuList(){
      return menuList;
    }
  },
  // activated() {
  //   if (this.$route.query.type == 'famous') {
  //     this.typeFlag = 'type';
  //   } else {
  //     this.typeFlag = '';
  //   }
  // },
  methods: {
    // 获取左侧菜单
    menuRequest() {
      // this.menulist = this.myMenuList;

      this.$axiosGet(API.sysMenus_getLoginUserMenuTree).then(res => {
        if(res.status === 200){

          let resultMenuList = [], myMenuList = this.myMenuList;
          let handelList = res.data||[];

          for(let i=0, ml = myMenuList.length; i<ml; i++){
            for(let j=0, rl = handelList.length; j<rl; j++){
              if(myMenuList[i].menuId === handelList[j].res){
                let obj = {}
                obj.menuName = myMenuList[i].menuName;
                obj.menuClass = myMenuList[i].menuClass;
                obj.path = myMenuList[i].path;
                obj.menuLevel = myMenuList[i].menuLevel;
                obj.menuId = myMenuList[i].menuId;
                obj.menuLevel = '1';
                obj.childrenList = []
                for(let ci=0, cml = myMenuList[i].childrenList.length; ci<cml; ci++){
                  for(let cj=0, crl = handelList[j].children.length; cj<crl; cj++){
                    if(myMenuList[i].childrenList[ci].menuId === handelList[j].children[cj].res){
                      obj.childrenList.push(myMenuList[i].childrenList[ci])
                    }
                  }
                }
                resultMenuList.push(obj)
                // console.log('resultMenuList',resultMenuList)
              }
            }
          }
          this.defaultActive = this.$route.path;
          this.menulist = resultMenuList;
        }
      }).catch(err=>{

      }).finally( () => {
      });
    },

    // 设置已选中路由菜单
    defaultRoute() {
      // console.log(123)
      // for (let i = 0, leni = this.menulist.length; i < leni; i++) {
      //   for (let j = 0, lenj = this.menulist[i].childrenList.length; j < lenj; j++) {
      //     if (this.$route.path.indexOf(this.menulist[i].childrenList[j].path) > -1) {
      //       this.defaultActive = `${this.menulist[i].path}${this.menulist[i].childrenList[j].path}`;
      //       return false;
      //     }
      //   }
      //   if (this.menulist[i].childrenList.length < 1) {
      //     if (this.$route.path.indexOf(this.menulist[i].path) > -1) {
      //       this.defaultActive = this.menulist[i].path;
      //       return false;
      //     }
      //   }
      // }
    },

    // 菜单激活
    menuSelect(index) {
      if (index) {
        if(index == this.$route.path){
          return false;
        }
        // let project = '';
        // this.$router.push(index);
        // for (let i = 0, len = this.menulist.length; i < len; i++) {
        //   for (let j = 0, lenj = this.menulist[i].childrenList.length; j < lenj; j++) {
        //     if (index.indexOf(this.menulist[i].childrenList[j].path) > -1) {
        //       project = this.menulist[i].path;
        //       this.$router.push(index);
        //       return false;
        //     }
        //   }
        //   if (this.menulist[i].childrenList.length < 1) {
        //     if (index.indexOf(this.menulist[i].path) > -1) {
        //       project = this.menulist[i].path;
        //       this.$router.push(index);
        //       return false;
        //     }
        //   }
        // }
      }
    },
    // 获取图标名称
    getIcon(menuClass) {
      if (menuClass === 'fa-basic-info') {
        // 我的主页
        return 'icon-home';
      } else if (menuClass === 'fa-basic-search') {
        // 用车申请
        return 'icon-shenqing';
      }else if (menuClass === 'fa-home') {
        return 'iconhome'; // 首页
      } else if (menuClass === 'fa-meet-info') {
        return 'iconmonitoring'; // 会议管理
      } else if (menuClass === 'fa-finance-info') {
        return 'icontransanction'; // 财务结算
      } else if (menuClass === 'fa-manage-info') {
        return 'iconDirectory-tree'; // 会议室管理
      } else if (menuClass === 'fa-analysis-info') {
        return 'iconchart-bar'; // 统计分析
      } else if (menuClass === 'fa-basis-info') {
        return 'iconall'; // 基础信息
      } else if (menuClass === 'fa-service-info') {
        return 'iconmonitoring'; // 会议服务
      }
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

<style lang="scss" scoped>
.m-scrollbar-wrapper {
  overflow-x: hidden !important;
}
</style>