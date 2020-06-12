<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="菜单管理" :item="['基础信息', '菜单管理']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/basic-info/menu-manage/menu/add">
            <button class="f-pull-right u-bread-btn">新增菜单</button>
          </router-link>
        </div>
      </div>
      <div class="h-table f-relative">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="MENU_MANAGE">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list"  style="width: 100%"   row-key="id">
          <el-table-column label="菜单名称" v-if="listTableListBol[0].show" prop="name"></el-table-column>
          <el-table-column label="菜单地址" v-if="listTableListBol[1].show" prop="res"></el-table-column>
          <el-table-column label="排序值" v-if="listTableListBol[2].show" prop="sortNo"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link :to="{name: 'menu', params: {type: 'edit'}, query: {id: scope.row.id,
              Menuname:scope.row.name,
              sortNum:scope.row.sortNo,
              parentId:scope.row.parentId,
              menuUrl:scope.row.res}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <!-- 操作成功提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
    <!--删除提示框-->
    <zl-confirm v-model="YConfirmShow" @click="YDeleteClick"></zl-confirm>
  </div>
</template>

<script>
export default {
  name: 'menu-manage',
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      message: '',
      isBol: false,
      list: [],//菜单列表数据
      equipId: ''//选中当前菜单id
    }
  },
  computed: {
    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["MENU_MANAGE"];
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    getDataRequest() {
      let params = {

      }
      this.$axiosGet(API.sysMenu_getAllMenuTree, params).then(res => {
        if (res.status == 200) {
          this.list = res.data;
        }
      })
    },
    deleteClick(equipId) {
      this.equipId = equipId;
      this.YConfirmShow = true;
    },
    YDeleteClick() {
      let params = {
        id: this.equipId
      }
      this.$axiosDelete(API.sysMenu_deleteMenu + '/' + params.id).then(res => {
        if (res.status == 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        // 判断删除的数据是不是当前页最后一条
        let totalNo = ((this.total - 1) / this.pageSize).toString().indexOf('.');
        if (totalNo === -1) {
          this.page = this.page - 1;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    }
  }
}
</script>

<style>
</style>
