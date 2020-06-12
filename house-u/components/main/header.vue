<template>
  <div class="clear">
    <div class="g-nav f-pull-left">
      <div class="u-title">
        <img :src="$store.state.imgPath.nationalEblem" />
        <span class="u-title-name">
          <span class="name">{{ organName }}</span>
          <span v-if="jurisdiction != 'error'" class="address">
            <!-- <a @click="openAreaDetail"> -->
              {{ areaName }}
              <!-- <i class="el-icon-caret-bottom el-icon--right"></i>
            </a> -->
          </span>
        </span>
      </div>
      <nav>
        <ul>
          <li :class="item.active ? 'active' : ''" @click="bindActiveClass(index, item)" v-for="(item, index) in navList" :key="index">
            <a>{{ item.name }}</a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="g-login-info f-pull-right">
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
      <el-dropdown  v-show="isMajor == 'YES'">
        <span v-if="jurisdiction != 'error'">
          <a class="font-wei">更多应用
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </a>
        </span>
        <el-dropdown-menu slot="dropdown">
          
          <el-dropdown-item command="管理控制台">          
               <!-- <a target="_blank" :href="'http://10.5.4.236:4912/replace?jumpUrl=/organization/staffing&token='+ oldToken">管理控制台</a>   -->
          <a target="_blank" :href="'http://119.3.57.254:4912/replace?jumpUrl=/organization/staffing&token='+ oldToken">管理控制台</a>
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
          <!-- <el-dropdown-item>
            <router-link style="color:#606266;" to="/system-config/character-list">用户平台</router-link>
          </el-dropdown-item> -->
          <el-dropdown-item v-if="jurisdiction != 'error'">
            <router-link style="color:#606266;" to="/notice-manage/notice-list">通知公告</router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item>
            <router-link style="color:#606266;" to="/operate/archives-manage/archives">档案管理</router-link>
          </el-dropdown-item> -->
          <!-- <el-dropdown-item>
            <router-link style="color:#606266;" to="/system-log/log-in-log">系统日志</router-link>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <v-areaDetail ref="areaDetail"></v-areaDetail>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" isBol="false" message="您没有登录权限，2秒后会自动退出" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import areaDetail from "@/components/main/area-detail";

export default {
  components: {
    "v-areaDetail": areaDetail
  },
  data() {
    return {
      jurisdiction: "",
      YPromptShow: false,
      navList: []
    };
  },
  computed: {
    realName() {
      return this.$store.state.mainData.realName;
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    navName() {
      return this.$store.state.mainData.navName;
    },
    navId() {
      return this.$store.state.mainData.navId;
    },
    isMajor() {
      return this.$store.state.mainData.isMajor;
    },
    oldToken() {
      return this.$store.state.mainData.oldToken
    }
  },
  activated() {
    // this.getLoginInfo();
    this.getValue();
    this.getTopMenu();
    this.checkHasProject();
    this.getAreaName()
  },
  methods: {
    YPromptClick() {
      this.$store.dispatch("tokenActions", "");
      window.location.href = LINKPATH.linkPath().loginPath;
    },
    checkHasProject() {
      let params = {
        projectCode: "HOUSE-USER"
      };
      this.$axiosPost(API.resources_checkHasProject, params).then(res => {
        if (res.result == "error") {
          // this.YPromptShow = true;
          // setTimeout(() => {
          //   this.YPromptClick();
          // }, 2000)
        }
      });
    },

    getUrl() {
      return 'http://119.3.57.254:4912/replace?jumpUrl=/organization/staffing&token=' + this.oldToken;
    },
    // 获取头部菜单
    getTopMenu() {
      let params = {
        projectCode: "HOUSE-USER",
        type: "TOP"
      };
      this.$axiosGet(API.resources_getResources, params).then(res => {
        if (res.data) {
          this.navList = [];
          res.data.forEach((item, index) => {

            if (this.navId) {
              if (this.navId === item.id) {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: true
                });
              } else {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: false
                });
              }
            } else {
              if (item.name == "办公用房") {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: true
                });
                this.$store.commit("navIdMutations", item.id);
              } else {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: false
                });
              }
            }
          });
        }
        if (res.result === "error") {
          this.jurisdiction = res.result;
        }
      });
    },
    openAreaDetail() {
      this.$refs.areaDetail.openModal();
    },
    bindActiveClass(index, value) {
      if (value.name === "房产数据中心") {
        window.open(value.url);
      } else {
        if (this.navList) {
          this.navList.forEach((item, key) => {
            if (key === index) {
              this.$set(this.navList, key, {
                name: item.name,
                url: item.url,
                id: item.id,
                active: true
              });
              this.$store.commit("navIdMutations", item.id);
            } else {
              this.$set(this.navList, key, {
                name: item.name,
                url: item.url,
                id: item.id,
                active: false
              });
            }
          });
          this.$router.push({ path: value.url });
        }
      }
    },
    getValue() {
      this.navList.forEach((item, index) => {
        if (item.active === true) {
          this.$store.dispatch("navNameActions", item.title);
        }
      });
    },
    getMenu() {
      this.$store.dispatch("menuStatuActions", index); // 账号路由
    },
    // 退出
    loginOut() {
      this.$store.dispatch("tokenActions", "");
      this.$router.push({ path: '/login' })
      sessionStorage.removeItem('navId');

    },
    // 获取登录信息
    // getLoginInfo() {
    //   this.$axiosPost(API.house_userInfo, {}).then(res => {
    //     this.$store.commit("realNameMutations", res.userInfoDTO.realName);
    //     if (res.userInfoDTO && res.userInfoDTO.userOrganRelationList) {
    //       this.$store.commit(
    //         "isMajorMutations",
    //         res.userInfoDTO.userOrganRelationList[0].isMajor
    //       );
    //       this.$store.commit(
    //         "organNameMutations",
    //         res.userInfoDTO.userOrganRelationList[0].organInfoBase.organName
    //       );
    //       this.$store.dispatch(
    //         "areaIdActions",
    //         res.userInfoDTO.userOrganRelationList[0].organInfoBase.areaId
    //       );
    //       this.$store.commit(
    //         "loginOrganIdMutations",
    //         res.userInfoDTO.userOrganRelationList[0].organInfoBase.organId
    //       );
    //       this.getAreaName(
    //         res.userInfoDTO.userOrganRelationList[0].organInfoBase.areaId
    //       );
    //     }
    //     if (res.userInfoDTO.currentOrganInfo) {
    //       this.$store.commit(
    //         "organSpecificationMutations",
    //         res.userInfoDTO.currentOrganInfo.organSpecification
    //       );
    //       this.$store.commit(
    //         "adminDivisionLevelMutations",
    //         res.userInfoDTO.currentOrganInfo.adminDivisionLevel
    //       );
    //     }
    //     this.$store.dispatch("userIdActions", res.userInfoDTO.userId);
    //   });
    // },
    // 根据区域ID获取区域名称
    getAreaName(areaId) {
      this.$axiosGet(API.courtYard_getAreaName, {}).then(res => {
        if (res.result === "success") {
          this.$store.commit("areaNameMutations", res.data.name);
          this.$store.commit("areaLevelMutations", res.data.level);
        }
      });
    }
  }
};
</script>

<style lang="scss" scope></style>
