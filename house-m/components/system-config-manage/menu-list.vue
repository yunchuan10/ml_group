<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="菜单管理"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="openMenuDialog()">
            新增
          </button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getMenuList)">
                <li>
                  <span>项目名称</span>
                  <el-select v-model="search.projectCode" placeholder="请选择项目编码">
                    <el-option label="管理平台" value="HOUSE-ADMIN"></el-option>
                    <el-option label="用户平台" value="HOUSE-USER"></el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getMenuList">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="menuList" style="width: 100%;margin-bottom: 20px;" row-key="value" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="name" label="菜单名称"></el-table-column>
          <el-table-column prop="url" label="菜单路径"></el-table-column>
          <el-table-column prop="icon" label="菜单图标"></el-table-column>
          <el-table-column prop="sort" label="菜单排序"></el-table-column>
          <el-table-column prop="remark" label="菜单备注"></el-table-column>
          <el-table-column prop="type" label="菜单类型">
            <template slot-scope="scope">
              {{checkMenuType(scope.row.type)}}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="操作">
            <template slot-scope="scope">
              <a @click="deleteClick(scope.row.id)">删除</a>
              <a @click="openMenuDialog(scope.row.id)">修改</a>
              <a v-show="scope.row.enable==='YES'" @click="disableClick(scope.row.id,'disabled')">禁用</a>
              <a v-show="scope.row.enable==='NO'" @click="disableClick(scope.row.id,'enable')">启用</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <!-- 新增菜单 -->
    <el-dialog title="新增菜单" custom-class="u-menu" :visible.sync="menuDialogShow" width="40%" @close="clearForm">
      <div style="height: 400px;overflow:auto;">
        <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width="100px">
          <el-form-item label="项目编码" prop="projectCode" :rules="{required: true, message: '项目编码不能为空', trigger: 'change'}">
            <el-select v-model="ruleForm.projectCode" placeholder="请选择项目编码" style="display:block;">
              <el-option label="管理平台" value="HOUSE-ADMIN"></el-option>
              <el-option label="用户平台" value="HOUSE-USER"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称" prop="name" :rules="{required: true, message: '菜单名称不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.name" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" prop="url" :rules="{required: true, message: '菜单路径不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.url" placeholder="请输入菜单路径"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="ruleForm.icon" placeholder="请输入菜单图标"></el-input>
          </el-form-item>
          <el-form-item label="父级菜单" prop="parentId">
            <el-cascader v-model="ruleForm.parentId" :options="menuList" placeholder="请选择父级菜单" change-on-select :props="{ checkStrictly: true }" style="display:block;" filterable clearable></el-cascader>
          </el-form-item>
          <el-form-item label="菜单备注" prop="remark">
            <el-input v-model="ruleForm.remark" placeholder="请输入菜单备注"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序" prop="sort" :rules="{required: true, message: '菜单排序不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.sort" placeholder="请输入菜单排序"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="type" :rules="{required: true, message: '菜单类型不能为空', trigger: 'change'}">
            <el-select v-model="ruleForm.type" placeholder="请选择菜单类型" style="display:block;">
              <el-option label="头部" value="TOP"></el-option>
              <el-option label="左侧" value="LEFT"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="menuDialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="submitClick">确 定</el-button>
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
      YConfirmShow: false,
      YPromptShow: false,
      isBol: false,
      menuDialogShow: false,
      message: '',
      search: {
        projectCode: 'HOUSE-ADMIN'
      },
      ruleForm: {
        name: '',
        url: '',
        icon: '',
        parentId: [],
        remark: '',
        sort: '',
        type: '',
        projectCode: ''
      },
      menuList: [],
      resourcesId: ''
    };
  },
  activated() {
    this.getMenuList();
  },
  methods: {
    checkMenuType(value) {
      if (value == 'LEFT') {
        return '左侧'
      } else {
        return '头部'
      }
    },
    // 获取菜单列表
    getMenuList() {
      let params = {
        projectCode: this.search.projectCode
      }
      this.$axiosGet(API.resources_query, params).then(res => {
        if (res.result == 'success') {
          this.menuList = res.data || [];
        }
      })
    },
    // 提交操作
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            name: this.ruleForm.name,
            url: this.ruleForm.url,
            icon: this.ruleForm.icon,
            parentId: this.ruleForm.parentId[this.ruleForm.parentId.length - 1] || '',
            remark: this.ruleForm.remark,
            sort: this.ruleForm.sort,
            type: this.ruleForm.type,
            projectCode: this.ruleForm.projectCode
          }
          if (this.resourcesId) {
            this.$set(params, 'id', this.resourcesId)
          }
          this.$axiosPost(API.resources_add, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.menuDialogShow = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      })
    },
    openMenuDialog(id) {
      if (id) {
        this.resourcesId = id;
        this.getDetail(id);
      } else {
        this.resourcesId = '';
      }
      this.menuDialogShow = true;
    },
    getDetail(id) {
      let params = {
        id: id
      }
      this.$axiosGet(API.resources_getDetail, params).then(res => {
        if (res.result == 'success') {
          this.ruleForm.name = res.data.name || '';
          this.ruleForm.url = res.data.url || '';
          this.ruleForm.icon = res.data.icon || '';
          this.ruleForm.parentId = res.data.parentIdList.reverse() || [];
          this.ruleForm.remark = res.data.remark || '';
          this.ruleForm.sort = res.data.sort || '';
          this.ruleForm.type = res.data.type || '';
          this.ruleForm.projectCode = res.data.projectCode || '';
        }
      })
    },
    deleteClick(id) {
      this.resourcesId = id;
      this.YConfirmShow = true;
    },
    YDeleteClick() {
      let params = {
        id: this.resourcesId,
        type: 'delete'
      }
      this.$axiosPost(API.resources_delete, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.YConfirmShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },

    disableClick(id, type) {
      let params = {
        id: id,
        type: type
      }
      this.$axiosPost(API.resources_delete, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    enableClick(id) {
      let params = {
        id: id,
        type: 'enable'
      }
      this.$axiosPost(API.resources_delete, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    YPromptClick() {
      if (this.isBol) {
        this.getMenuList();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.u-menu {
  .el-dialog__body {
    padding-right: 0;
  }
}
</style>
   