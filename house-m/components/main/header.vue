<template>
  <div class="clear" id="heading">
    <div class="g-nav f-pull-left">
      <div class="u-title">
        <img :src="$store.state.imgPath.nationalEblem">
        <span class="u-title-name">
          <span class="name">{{organName}}</span>
          <span v-if="jurisdiction!='error'" class="address">
            <!-- <a @click="openAreaDetail"> -->
            <a>
              {{areaName}}
              <!-- <i class="el-icon-caret-bottom el-icon--right"></i> -->
            </a>
          </span>
        </span>
      </div>
      <nav>
        <ul>
          <li :class="item.active?'active':''" @click="bindActiveClass(index, item)" v-for="(item, index) in navList" :key="index">
            <a>{{item.name}}</a>
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
      <span class="f-position-relative">
        <el-input v-if="jurisdiction!='error'" :placeholder="placeholder" class="superSearch" @blur='inputBlur' @focus='inputFocus' @keyup.enter="clickHide(superSearch)" @input="changeValue" v-model="superSearch">
        </el-input>
        <i v-if="jurisdiction!='error'" class="el-icon-search icons" @click="clickHideBtn(superSearch)"></i>
        <!-- <ul class="search-list" v-show='show' v-clickoutside="handleClose">
          <router-link :to="{path:'/super-search/search-list',query:{realName: superSearch}}" @click.native="clickHide(superSearch)" tag="li">搜索
            <i class='f-color-red'>{{superSearch}}</i>相关的的人员</router-link>
          <router-link :to="{path:'/super-search/search-list/company-search-list/used-search-list',query:{organName: superSearch}}" @click.native="clickHide(superSearch)" tag="li">搜索
            <i class='f-color-red'>{{superSearch}}</i>相关的的单位</router-link>
          <router-link :to="{path:'/super-search/search-list/file-search-list',query:{fileName:superSearch}}" @click.native="clickHide(superSearch)" tag="li">搜索
            <i class='f-color-red'>{{superSearch}}</i>相关的的文件</router-link>
        </ul> -->
      </span>
      <span>

      </span>
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
            <router-link style="color:#606266;" to="/system-config/character-list">系统设置</router-link>
          </el-dropdown-item> -->
          <el-dropdown-item v-if="jurisdiction!='error'">
            <router-link style="color:#606266;" to="/notice-manage/notice-list-send/published">通知公告</router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item>
            <router-link style="color:#606266;" to="/system-log/log-in-log">系统日志</router-link>
          </el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <v-areaDetail ref="areaDetail"></v-areaDetail>
  </div>
</template>

<script>
import areaDetail from '@/components/main/area-detail'
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
export default {
  components: {
    'v-areaDetail': areaDetail
  },
  data() {
    return {
      placeholder: "搜索单位、人员、文件等",
      blurFlag: false,
      superSearch: '',
      jurisdiction: '',
      show: false,
      navName: false,
      navList: [],
      inputClickFlag: false
    }
  },
  directives: { clickoutside },
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
    token() {
      return this.$store.state.mainData.token;
    },
    isMajor() {
      return this.$store.state.mainData.isMajor;
    },
    navId() {
      return this.$store.state.mainData.navId;
    }
  },
  watch: {
    'superSearch': function (val) {
      if (this.superSearch == '') {
        this.$store.dispatch('superSearchActions', '');
      }
    },
    'navId': function (val) {
      this.getTopMenu();
    }
  },
  activated() {
    this.inputClickFlag = false;
    if (this.$route.path === '/home') {
      this.navName = true;
    } else {
      this.navName = false;
    }
    this.getValue();
    this.getTopMenu();
    this.getAreaName();
  },
  deactivated() {

  },
  created() {
    let lett = this;
    document.onkeydown = function (e) {
      let key = window.event.keyCode;

      if (lett.superSearch) {
        if (key == 13) {
          lett.$store.dispatch('superSearchActions', lett.superSearch);
          lett.clickHide(lett.superSearch);
          lett.defaultJump();
          // lett.superSearch = '';

        }
      }
    }
  },
  methods: {
    defaultJump() {
      if (this.inputClickFlag) {
        this.blurFlag = true;
      }
      if (!this.blurFlag) {
        this.$router.push({ path: '/super-search/search-list', query: { realName: this.superSearch } })
      }
    },
    getTopMenu() {
      let params = {
        projectCode: 'HOUSE-ADMIN',
        type: 'TOP'
      }
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
                })
              }
              else {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: false
                })
              }
            } else {
              if (item.name == '我的主页') {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: true
                })
                this.$store.commit('navIdMutations', item.id);
              }
              else {
                this.navList.push({
                  name: item.name,
                  url: item.url,
                  id: item.id,
                  active: false
                })
              }
            }
          })
        }
        if (res.result === 'error') {
          this.jurisdiction = res.result;
        }
      })
    },
    openAreaDetail() {
      this.$refs.areaDetail.openModal()
    },
    bindActiveClass(index, value) {
      if (value.name === '房产数据中心') {
        window.open(value.url)
      } else {
        if (this.navList) {
          this.navList.forEach((item, key) => {
            if (key === index) {
              this.$set(this.navList, key, {
                name: item.name,
                url: item.url,
                id: item.id,
                active: true
              })
              this.$store.commit('navIdMutations', item.id);
            } else {
              this.$set(this.navList, key, {
                name: item.name,
                url: item.url,
                id: item.id,
                active: false
              })
            }
          })
          this.$router.push({ path: value.url });
          this.$store.commit('headeRouteActiveMutations', value.url);
          // console.log(value.url, this.$route.path);  路由没更新过去
        }
      }
    },
    changeValue() {
      if (this.superSearch.length > 0) {
        this.show = true;
      } else {
        this.show = false
      }
    },
    inputBlur() {
      this.blurFlag = true;
      this.inputClickFlag = true;
    },
    inputFocus() {
      this.blurFlag = false;
      this.inputClickFlag = false;
    },
    clickHide(value) {

      this.show = false;
      this.$store.dispatch('superSearchActions', value);
      // this.defaultJump();
    },
    clickHideBtn(value) {
      if (!value) {
        this.placeholder = '请输入搜索关键字'      }
      else {
        this.show = false;
        this.$store.dispatch('superSearchActions', value);
        this.inputClickFlag = false;
        this.blurFlag = false;
        this.defaultJump();
      }
    },
    handleClose(e) {
      this.show = false;
    },
    getValue() {
      this.navList.forEach((item, index) => {
        if (item.active === true) {
          this.$store.dispatch('navNameActions', item.title)
        }
      })
    },
    getMenu() {
      this.$store.dispatch('menuStatuActions', index); // 账号路由
    },
    loginOut() {
      this.$store.dispatch('tokenActions', ''),
      sessionStorage.removeItem('navId');
      window.sessionStorage.removeItem('courtyardId');
      this.$router.push({ path: '/login' })
    },
    getAreaName(areaId) {
      this.$axiosGet(API.courtYard_getAreaName, {}).then(res => {
        if (res.result === 'success') {
          this.$store.commit('areaNameMutations', res.data.name);
          this.$store.commit('areaLevelMutations', res.data.level);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.search-list {
  background: #fff;
  position: absolute;
  color: #2f70ff;
  top: 55px;
  width: 230px;
  padding: 0 10px;
  box-shadow: 2px 2px 5px #aaaaaa;
  z-index: 5;
  li {
    line-height: 30px;
    height: 30px;
    text-align: left;
    cursor: pointer;
  }
}
.icons {
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  margin-right: 10px;
  position: relative;
  left: -38px;
  top: 3px;
  color: #c0c4cc;
}
</style>
