<template>
  <div class="clear">
    <div class="g-nav f-pull-left" :style="typeFlag == 'type'?'margin-left:calc((100% - 1330px)/2);':''">
      <div class="u-title">
        <img :src="$store.state.imgPath.nationalEblem">
        <span class="u-title-name">
          <!-- <span class="name">{{organName}}</span> -->
          <span class="name">滁州市党政机关事务管理局</span>
          <!-- <span class="address">
            <a>
              滁州-全市<i class="el-icon-caret-bottom el-icon--right"></i>
            </a>
          </span> -->
        </span>
      </div>
      <!-- <nav>
        <ul>
          <li :class="item.active?'active':''" @click="bindActiveClass(index)" v-for="(item, index) in navList" :key="index">
      <a>{{item.title}}</a>-->
      <!-- <router-link :to="item.path">{{item.title}}</router-link> -->
      <!-- </li>
        </ul>
      </nav>-->
    </div>

    <div v-if="typeFlag !== 'type'" class="g-login-info f-pull-right">
      <!-- <span class="u-platform-switch">
        <span class="u-platform-chosed">
          <el-dropdown>
            <span class="el-dropdown-link">
              用户平台<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">公房平台</el-dropdown-item>
              <el-dropdown-item command="b">会议接待</el-dropdown-item>
              <el-dropdown-item command="c">租赁平台</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </span>-->
      <!-- <span v-if="typeFlag !== 'type'">{{realName}}，您好</span> -->
      <span v-if="typeFlag !== 'type'">{{loginStatu.realName}}，您好</span>
      <!-- <span>
        <a class="font-wei">更多应用<i class="el-icon-caret-bottom el-icon--right"></i></a>
      </span> -->
      <!-- <el-dropdown>
        <span>
          <a class="font-wei">更多应用<i class="el-icon-caret-bottom el-icon--right"></i></a>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">公房平台</el-dropdown-item>
          <el-dropdown-item command="b">会议接待</el-dropdown-item>
          <el-dropdown-item command="c">租赁平台</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-dropdown>
        <span class="el-dropdown-link iconfont icon-gengduo-rotate-90 font-color">
          更多
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span class="u-drop-out-login" @click="loginOut">
              <span class="iconfont icon-dianyuan"></span>&nbsp;退出
            </span>
          </el-dropdown-item>
          <!-- <el-dropdown-item>帮助</el-dropdown-item> -->
          <!-- <el-dropdown-item>通知</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div v-if="typeFlag == 'type'" class="g-login-info">
      <span v-for="(item, index) in navTypeList" :class="navIndex == index ? 'nav-index':''" :key="index" @click="navColumnClick(item, index)">{{item.columnName}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeFlag: '',
      navTypeList: [],
      navIndex: '0',
      navList: [
        {
          title: '办公用房',
          path: '/basic-information/courtyard-manage/courtyard-list',
          active: true
        }
        // {
        //   title: '经营性用房',
        //   path: '/basic-information/front-manage/street-front',
        //   active: false
        // },
        // {
        //   title: '直管用房',
        //   path: '/basic-information/courtyard-manage/courtyard-list',
        //   active: false
        // },
        // {
        //   title: '工程建设',
        //   path: '/basic-information/front-manage/street-front',
        //   active: false
        // },
        // {
        //   title: '办公用房',
        //   path: '/basic-information/courtyard-manage/courtyard-list',
        //   active: false
        // }
      ]
    }
  },
  computed: {

    loginStatu() {
      return this.$store.state.mainData.loginStatu||{};
    },
    // realName() {
    //   return this.$store.state.mainData.realName;
    // },
    // organName() {
    //   return this.$store.state.mainData.organName || '中科美络';
    // },
    // areaName() {
    //   return this.$store.state.mainData.areaName;
    // },
    // navJump() {
    //   return this.$store.state.mainData.navJump;
    // }
  },
  watch: {
    // 'navJump': function (newVal, oldVal) {
    //   // console.log(newVal)
    // }
  },
  activated() {
    if (this.$route.query.type == 'famous') {
      this.typeFlag = 'type';
    } else {
      this.typeFlag = '';
    }
    this.getLoginInfo();
    this.getDataDuty();
  },
  methods: {
    // 徽风皖韵头部导航
    navColumnClick(item, index) {
      this.navIndex = index;
      if (item.columnName == '自然地理') {
        this.$router.push({ path: `/emblem-rhyme/unified-list/${item.columnName}?type=famous&id=${item.columnId}` });
      } else if (item.columnName == '山水风光' || item.columnName == '风味美食') {
        this.$router.push({ path: `/emblem-rhyme/picture-list/${item.columnName}?type=famous&id=${item.columnId}` });
      } else if (item.columnName == '首页') {
        this.$router.push({ path: `/emblem-rhyme/rhyme-home?type=famous&id=${item.columnId}` });
      } else {
        this.$router.push({ path: `/emblem-rhyme/text-list/${item.columnName}?type=famous&id=${item.columnId}` });
      }
    },
    bindActiveClass(index) {
      this.navList.forEach((item, key) => {
        if (key === index) {
          this.$set(this.navList, key, {
            title: item.title,
            path: item.path,
            active: true
          })
        } else {
          this.$set(this.navList, key, {
            title: item.title,
            path: item.path,
            active: false
          })
        }
      })
    },
    getMenu() {
      this.$store.dispatch('menuStatuActions', index); // 账号路由
    },
    loginOut() {
      // this.$axiosPost(API.house_logout, {}).then(res => {
        this.$store.dispatch('tokenActions', '')
        let browserPath = window.location.href;
        if (browserPath.indexOf('.com') > -1 || browserPath.indexOf('.cn') > -1) {
          window.location.href = 'http://192.168.15.215:9527/sso-server/sso/checkLogin'
        } else {
          this.$router.push({ path: '/login' })
        }
        // window.location.href = 'http://192.168.15.215:9090/sso/checkLogin'; // 测试网用户中心登录
        // window.location.href = 'http://sso.govicar.com:9000/sso/checkLogin'; // 线上环境用户中心登录
      // })
    },
    getLoginInfo() {
      // this.$axiosPost(API.reception_userInfo, {}).then(res => {
      //   this.$store.commit('realNameMutations', res.userInfoDTO.realName);
      //   if (res.userInfoDTO.organBase) {
      //     this.$store.commit('organNameMutations', res.userInfoDTO.organBase.organName);
      //     this.$store.dispatch('areaIdActions', res.userInfoDTO.organBase.areaId);
      //     this.$store.commit('loginOrganIdMutations', res.userInfoDTO.organBase.organId);
      //     this.getAreaName(res.userInfoDTO.organBase.areaId)
      //   }
      //   this.$store.dispatch('userIdActions', res.userInfoDTO.userId);
      // })
    },
    getAreaName(areaId) {
      // this.$axiosPost(API.courtYard_getAreaName, {}).then(res => {
      //   if (res.result === 'success') {
      //     this.$store.commit('areaNameMutations', res.data.areaName);
      //   }
      // })
    },
    // 徽风皖韵栏目导航
    getDataDuty() {
      // this.$axiosGet(API.columnManageFacade_findTitleAndColumn).then(res => {
      //   if (res.model.length > 0) {
      //     let inspection = {
      //       columnName: '首页'
      //     }
      //     res.model[0].columnBOList.unshift(inspection);
      //     this.navTypeList = res.model[0].columnBOList;
      //     this.$store.commit('themeInfo', res.model[0]);
      //   } else {
      //     this.navTypeList = [];
      //   }
      // })
    }
  }
};
</script>

<style lang="scss" scope>
.main-default .g-head .g-nav .u-title img {
  vertical-align: middle;
}
.main-default .g-head .g-login-info {
  background-color: #0e50a7;
}
.nav-index {
  color: #3471a3;
  border-bottom: 3px #226399 solid;
}
</style>
