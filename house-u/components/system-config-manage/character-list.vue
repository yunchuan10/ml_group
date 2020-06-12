<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="角色" :item="['角色']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="openCharacterDialog()">
            新增
          </button>
        </div>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li class="active">
          <a>角色</a>
        </li>
        <li>
          <router-link to="/system-config/user-list">人员</router-link>
        </li>
      </ul>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>角色名</span>
                  <el-input v-model="search.characterName" placeholder="请输入角色名" clearable></el-input>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="characterList" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名" width="180px"></el-table-column>
          <el-table-column label="菜单名称">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.resourcesResponseList" :key="index">
                <span v-show="index > 0">，</span>
                {{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <a @click="deleteClick(scope.row.id)">删除</a>
              <a @click="openCharacterDialog(scope.row.id)">修改</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </section>
    <!-- 新增/修改弹出 -->
    <el-dialog :title="titleType" custom-class="h-dialog-add" :visible.sync="characterDialogShow" width="40%" @close="clearForm">
      <div style="height: 450px;overflow:auto;">
        <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width="100px">
          <el-form-item label="角色名" prop="characterName" :rules="{required: true,message: '角色名不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.characterName" placeholder="请输入角色名"></el-input>
          </el-form-item>
          <el-form-item label="角色菜单">
            <div style="border:1px solid #DCDFE6;padding: 20px;height:300px;overflow: auto;">
              <el-tree :default-expanded-keys="ruleForm.characterMenu" :data="menuList" node-key="value" @check-change="getCheckedNodes" ref="characterMenu" show-checkbox></el-tree>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="characterDialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      characterDialogShow: false,
      YConfirmShow: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      page: 1,
      pageSize: 10,
      total: 0,
      titleType: '新增角色',
      search: {
        characterName: ''
      },
      ruleForm: {
        characterName: '',
        characterMenu: []//树形结构选中状态key集合
      },
      checkNodeList: [],
      checkContent: [],
      menuList: [],
      characterList: [],//列表数据
      characterId: ''
    }
  },
  activated() {
    this.characterList = []
    this.getMenuList();
    this.getCharacterList();
  },
  methods: {
    getSearch() {
      this.page = 1;
      this.getCharacterList();
    },
    getCharacterList() {
      let params = {
        projectCode: 'HOUSE-ADMIN',
        roleName: this.search.characterName,
        currentPage: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.role_query, params).then((res) => {
        let list = [];
        list = res.data.data || [];
        this.total = res.data.total;
        list.forEach((item, index) => {
          list[index].num = index + 1;
        });
        this.characterList = list;
      })
    },
    // 获取菜单列表
    getMenuList() {
      let params = {
        projectCode: 'HOUSE-ADMIN',
        enable: 'YES'
      }
      this.$axiosGet(API.resources_query, params).then(res => {
        if (res.result == 'success') {
          this.menuList = res.data || [];//
        }
      })
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getCharacterList();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getCharacterList();
    },
    //修改角色遮罩
    openCharacterDialog(id) {

      if (id) {
        this.titleType = '修改角色';
        this.characterId = id;
        this.getDetail(id)
      } else {
        this.characterId = '';
        this.titleType = '新增角色';
      }
      this.characterDialogShow = true;
    },
    //树形结构选中状态
    getCheckedNodes() {
      //获取半选中和全选中状态key
      this.checkContent = this.$refs.characterMenu.getHalfCheckedNodes().concat(this.$refs.characterMenu.getCheckedNodes(false, false))
    },
    //提交
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let menuIdsList = [];
          if (this.checkContent) {
            this.checkContent.forEach((item) => {
              menuIdsList.push(item.value)
            })
          }
          let params = {
            projectCode: 'HOUSE-ADMIN',
            roleName: this.ruleForm.characterName,
            resourcesIdList: menuIdsList
          }
          if (this.characterId) {
            this.$set(params, 'id', this.characterId)
          }
          this.$axiosJsonPost(API.role_add, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
              if (this.characterId) {
                BURYINGPOINT.buryingPoint('通用模块', '角色权限', '修改')
              } else {
                BURYINGPOINT.buryingPoint('通用模块', '角色权限', '新增角色')
              }
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.characterDialogShow = false;
            this.YPromptShow = true;
            this.loading = false;
          })
        }
      })
    },
    //修改详情，树形回显
    getDetail(id) {
      let params = {
        id: id,
        projectCode: 'HOUSE-ADMIN'
      }
      this.$axiosGet(API.role_getDetail, params).then(res => {
        this.checkNodeList = [];
        let dataList = [];
        dataList = res.data.hasResources;
        this.ruleForm.characterName = res.data.roleDetail.roleName;
        let newArr = [];
        this.findAllChildren(dataList, this.ruleForm.characterMenu, newArr);
        this.ruleForm.characterMenu = newArr;
        this.$refs.characterMenu.setCheckedKeys(newArr);
      })
    },

    findAllChildren(data, arr, newArr) {
      data.forEach((item, index) => {
        if (item.children && item.children.length !== 0) {
          this.findAllChildren(item.children, arr, newArr);
        } else if (item.children == null) {
          newArr.push(item.value);
        }
      })
    },

    clearForm() {
      this.$refs.characterMenu.setCheckedKeys([]);
      this.$refs.ruleForm.resetFields();
    },
    deleteClick(id) {
      this.characterId = id;
      this.YConfirmShow = true;
    },
    YDeleteClick() {
      let params = {
        id: this.characterId
      }
      this.$axiosPost(API.role_delete, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('通用模块', '角色权限', '删除角色')
        } else {
          this.isBol = false;
        }
        this.YConfirmShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getCharacterList()
      }
    }
  }
}
</script>