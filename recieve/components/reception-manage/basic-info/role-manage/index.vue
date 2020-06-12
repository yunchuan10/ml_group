<template>
  <div>
    <section class="m-main m-rolem-section">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="角色管理" :item="['系统管理', '角色管理']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/reception-manage/basic-info/role-manage/role/add">
            <button class="f-pull-right u-bread-btn">新增角色</button>
          </router-link>
        </div>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li>
                  <span>角色名称</span>
                  <el-input clearable v-model="search.roleName" placeholder="请输入角色名称"></el-input>
                </li>
              </ul>
            </td>
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <!-- <div class="h-table-popover">
          <v-searchPopover isTableListBol="ROLE_MANAGE">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div> -->
        <el-table :data="list" stripe style="width: 100%">
          <!-- <el-table-column  fixed="left" label="序号" width="50">
            <template slot-scope="scope">{{)}}</template>
          </el-table-column>-->
          <el-table-column label="角色名称" prop="name"></el-table-column>
          <el-table-column label="已配置人数" prop="count"></el-table-column>
          <el-table-column label="添加时间" prop="createdAt"></el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="scope">
              <a @click="roleId = scope.row.id, personnelRequest(), addPersonnel = true">添加人员</a>
              <a @click="configurePermissions(scope.row.id), configurePermissionsShow = true">配置权限</a>
              <router-link
                :to="{path: '/reception-manage/basic-info/role-manage/role/edit', query: {id: scope.row.id,name:scope.row.name}}"
              >修改</router-link>
              <a @click="delate(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination
              @size-change="getDataRequest"
              @current-change="getDataRequest"
              :page-sizes="[12, 24, 36]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 添加人员 -->
    <el-dialog title="添加人员" :visible.sync="addPersonnel" width="660px"   custom-class="h-dialog-add">
      <el-transfer
        v-model="userIdList"
        :data="allPeopleList"
        filterable
        :titles="['未选人员', '已选人员']"
        :props="propss"
        v-loading="transferLoading"
        @right-check-change="select"
      ></el-transfer>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addPersonnel= false">取 消</el-button>
        <el-button type="primary" @click="addPersonnelClick"  class="u-submit-btn submit-btn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 配置权限 -->
    <el-dialog title="配置权限" :visible.sync="configurePermissionsShow" width="660px" custom-class="h-dialog-add">
      <el-tree
        style="height:300px;overflow:auto;"
        ref="treeReview"
        :data="treeData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        @check="checkSelect"
        :default-checked-keys="childNodeKeys"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="configurePermissionsShow= false">取 消</el-button>
        <el-button type="primary" @click="configurePermissionsClick" class="u-submit-btn submit-btn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import menuData from '@/utils/menuData'
function getMenuList(list=[]){
  let res = [];
  list.forEach( item =>{
    let arr = item.childrenList||[];
    res = res.concat(arr);
    res = res.concat([item]);
  })
  return res;
}
let menuList = getMenuList(menuData)||[];
export default {
  name: "role-manage",
  data() {
    return {
      search: {
        //搜索框内容
        roleName: "" // 名称
      },
      dialogVisible: false,
      propss: { key: "id", label: "realName" },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      roleId: "", //当前操作的数据id
      addPersonnel: false, // 添加人员弹出框
      selectMenuIds: "",
      configurePermissionsShow: false, // 配置权限弹出框
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      childNodeList: [], // 被选中的节点
      childNodeKeys: [], // 被选中节点的key
      userIdList: [], // 选中人员
      personnelList: [], // 左侧人员数据列表
      haveSelectPeoples: [], //已选人员数据
      allPeopleList: [], //所有人员合并列表数据
      selectIds: [], //点击选中人员id数据
      transferLoading: false, // 添加人员-穿梭框-加载
      YConfirmShow: false,

      YPromptShow: false,

      isBol: false,
      message: ""
    };
  },
  computed: {
    listTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["ROLE_MANAGE"];
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    // 获取角色列表数据
    getDataRequest() {
      let params = {
        name: this.search.roleName,
        pageNo: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.sysRoles_getOnePage, params).then(res => {
        if (res && res.data) {
          let list = res.data.list || [];
          this.list = list;
          this.total = res.data.total || 0;
        }
      });
    },

    handleMenus(list=[]){
      list = list.map( item => {
        let opt = menuList.find( menu => (menu.menuId==item.res));
        if(opt){
          item.name = opt.aliasName||opt.menuName;
          let children = item.children||[];
          if(children.length>0){
            children = this.handleMenus(children);
          }
          item.children = children;
        }
        return item;
      })
      return list;
    },

    // 删除列表数据
    delate(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axiosDelete(API.sysRoles + "/" + id).then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
             
            }else{
              this.$message({
                type: "warning",
                message: '该角色下已配置人员,请先移除相关人员再删除!'
              });
            }
            this.getDataRequest();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    YDeleteClick() {
      let params = {
        id: this.roleId
      };
      this.$axiosDelete(API.sysRole_deleteRole + "/" + params.id).then(res => {
        this.YConfirmShow = false;
        if (res.status == 200) {
          this.isBol = true;
          if (this.list.length - 1 <= 0 && this.total > 1)
            this.page = this.page - 1; // 删除最后一条数据时列表向前
        } else {
          this.isBol = false;
        }
        this.getDataRequest();
        this.message = res.message;
        this.YPromptShow = true;
      });
    },
    // 添加人员-获取人员信息，穿梭框列表数据
    personnelRequest() {
      this.personnelList = [];
      this.transferLoading = true;
      this.dialogVisible = true;
      this.userIdList = [];
      let params = {
        id: this.roleId
      };
      this.$axiosGet(API.sysRoles_toRoleBatchUser + "/" + this.roleId).then(
        res => {
          this.personnelList = res.data.staffUserAllResponseList || [];
          this.haveSelectPeoples = res.data.roleUserResponseList || [];
          this.allPeopleList = this.haveSelectPeoples.concat(
            this.personnelList
          );
          this.haveSelectPeoples.forEach(item => {
            this.userIdList.push(item.id);
          });
          this.transferLoading = false;
        }
      );
    },
    // 添加人员-提交
    addPersonnelClick() {
      let staffIds = this.selectIds;
      if (Array.isArray(staffIds)) {
        staffIds = staffIds.join(",");
      }
      let params = {
        sysRoleId: this.roleId,
        staffIds
      };
      this.$axiosJsonPost(API.sysRoles_doRoleBatchUser, params).then(res => {
        if (res.status == 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
        this.addPersonnel = false;
      });
      this.selectIds = [];
      this.searchClick();
    },
    YPromptClick() {
      this.getDataRequest();
      console.log(this.message);
    },
    // 查询
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },

    //  选中树形结构处理
    sysRoleMap(sysRoleItem = {}, roleResourceList = [], nsSelectedArr = []) {
      let sysRoleChildren = sysRoleItem.children || [];
      if (sysRoleChildren.length <= 0) {
        //没有子集判断自身是否选中
        return !!roleResourceList.find(
          role => role.sysResourceId === sysRoleItem.id
        );
      } else {
        //有子集的选中可能去掉
        let bChildrenEverysys = true; //子集是否全选
        if (
          roleResourceList.find(role => role.sysResourceId === sysRoleItem.id)
        ) {
          //当前有选中的， 去看后代是否全选中
          // console.log(4444444444444444)
          bChildrenEverysys = sysRoleChildren.every(role => {
            //每一个要选择, true不要操作
            let sysEvery = this.sysRoleMap(
              role,
              roleResourceList,
              nsSelectedArr
            );
            return sysEvery;
          });
          if (!bChildrenEverysys) {
            //不是全选, false去除
            nsSelectedArr.push(sysRoleItem.id);
          }
        }
        return bChildrenEverysys;
      }
    },

    // 配置权限数据列表获取
    configurePermissions(equipId) {
      this.childNodeKeys = [];
      this.equipId = equipId;
      this.configurePermissionsShow = true;
    //   let params = {
    //     id: this.equipId
    //   };
      this.$axiosGet(API.sysRoles_toRoleBatchMenu+'/'+ this.equipId).then(res => {
        this.treeData = res.data || [];
        this.treeData = this.handleMenus(this.treeData);
        let childNodeKeys = [];
        this.getChildNodeKeys(res.data, childNodeKeys);
        childNodeKeys = childNodeKeys.filter(node => {
          //去除有的
          let res = true;
          if (node.checked && node.children && node.children.length > 0) {
            if (node.children.some(val => !val.checked)) {
              //找到没有选中的 删除
              res = false;
            }
          }
          return res;
        });
        childNodeKeys = childNodeKeys.map(item => item.id);
        console.log(childNodeKeys, 22222222);
        this.childNodeKeys = childNodeKeys;
      });
    },

    // 获取选中子节点
    getChildNodeKeys(tree = {}, keys = []) {
      if (!Array.isArray(tree) && tree.checked) {
        //不是数组 被选中
        keys.push(tree);
        if (tree.children && tree.children.length > 0) {
          //在子数组中收集选中的
          this.getChildNodeKeys(tree.children, keys);
        }
      } else if (tree && tree.length > 0) {
        // 是数组直接找选中的
        tree.forEach(treeItem => {
          this.getChildNodeKeys(treeItem, keys); //每一项放入看有没有
        });
      }
    },

    //  提交数据---选中树形结构处理，过滤器
    addNodeSelect(treeItem = {}, childNodeKeys = [], treeNodeSelects) {
      let sysRoleChildren = treeItem.children || [];
      if (sysRoleChildren.length <= 0) {
        //没有子集判断自身是否选中
        return !!childNodeKeys.find(node => node == treeItem.id);
      } else {
        //有子集的选中可能去掉
        let hesChildrenSec = true; //子集是否有选
        if (!childNodeKeys.find(node => node == treeItem.id)) {
          //当前没有选中的， 去看后代是否有
          hesChildrenSec = !!sysRoleChildren.find(role => {
            let childrenSec = this.addNodeSelect(
              role,
              childNodeKeys,
              treeNodeSelects
            );
            return childrenSec;
          });
          if (hesChildrenSec) {
            // 如果有选中， 收集数据
            if (
              childNodeKeys.indexOf(treeItem.id) == -1 &&
              treeNodeSelects.indexOf(treeItem.id) == -1
            ) {
              //没有收集
              treeNodeSelects.push(treeItem.id);
            }
          }
        } else {
          //有选的添加
          if (
            childNodeKeys.indexof(treeItem.id) == -1 &&
            treeNodeSelects.indexOf(treeItem.id) == -1
          ) {
            //没有收集
            treeNodeSelects.push(treeItem.id);
          }
        }
        return hesChildrenSec;
      }
    },

    //权限配置提交
    configurePermissionsClick() {
      let childNodeKeys = this.childNodeKeys || []; //现在选中可能要添加
      let treeData = this.treeData || [];
      let treeNodeSelects = []; //  收集要加的id

      treeData.forEach(treeItem => {
        if (!childNodeKeys.find(node => node == treeItem.id)) {
          //没有可能要加
          if (
            this.addNodeSelect(treeItem, childNodeKeys, treeNodeSelects) &&
            treeNodeSelects.indexOf(treeItem.id) == -1
          ) {
            //如果要加就添加
            treeNodeSelects.push(treeItem.id);
          }
        }
      });
      childNodeKeys = childNodeKeys.concat(treeNodeSelects);
      this.selectMenuIds = childNodeKeys.join(",");
      // this.selectMenuIds = this.childNodeKeys.join(",");
      // console.log('this.childNodeKeys',this.childNodeKeys.concat(this.$refs.treeReview.getHalfCheckedKeys()))
      let params = {
        sysRoleId: this.equipId,
        sysResourceIds: this.selectMenuIds
      };

      this.$axiosJsonPost(API.sysRoles_doRoleBatchMenu, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
          this.configurePermissionsShow = false;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
        this.getDataRequest();
      });
    },
    // 权限选中节点树
    checkSelect(data, node) {
      this.childNodeList = [];
      this.childNodeKeys = [];
      this.childNodeList = node.checkedNodes;
      this.childNodeKeys = node.checkedKeys;
    },
    //穿梭框点击选中
    select(value) {
      this.selectIds = value;
    }
  },
  deactivated() {
    this.search.roleName = "";
  }
};
</script>

