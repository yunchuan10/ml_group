<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="人员" :item="['人员']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="bindCharacterDialog = true">批量绑定</button>
        </div>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li>
          <router-link to="/system-config/character-list">角色</router-link>
        </li>
        <li class="active">
          <a>人员</a>
        </li>
      </ul>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>人员名</span>
                  <el-input v-model="search.realName" placeholder="请输入人员名" clearable></el-input>
                </li>
                <li>
                  <span>角色名</span>
                  <el-input v-model="search.roleName " placeholder="请输入角色名" clearable></el-input>
                </li>
                <li>
                  <span>部门名称</span>
                    <el-cascader :options="deptList"  :props="optionProps" filterable  change-on-select  @change="handleChange" v-model="search.deptName" clearable></el-cascader>
                  <!-- <el-input v-model="search.deptName " placeholder="请输入部门名" clearable></el-input> -->
                </li>
                <li>
                  <span>职务级别</span>
                  <el-select v-model="search.dutiesLevelId" clearable placeholder="请选择职务级别">
                    <el-option v-for="(item, index) in jobRankList" :key="index" :label="item.dutiesLevelName" :value="item.dutiesLevelId"></el-option>
                  </el-select>
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
        <el-table :data="userList" stripe style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">{{$serialUtils(pageSize, page, scope.row.num)}}</template>
          </el-table-column>
          <el-table-column prop="realName" label="真实名称"></el-table-column>
          <el-table-column prop="userName" label="用户名"></el-table-column>
          <el-table-column prop="deptName" label="部门名称"></el-table-column>
          <el-table-column prop="dutiesLevelName" label="职务级别"></el-table-column>
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.roleResponseList" :key="index">
                <span v-show="index > 0">,</span>
                {{item.roleName}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="bindCharacter(scope.row.userId, scope.row.roleResponseList)">绑定角色</a>
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
    <!-- 绑定角色 -->
    <el-dialog title="绑定角色" custom-class="h-dialog-add" :visible.sync="bindCharacterDialog" width="750px" @close="clearForm">
      <div>
        <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width="100px">
          <el-form-item class="title" label="角色名称" prop="roleId" :rules="{required: false, message: '角色名称不能为空', trigger: 'change'}">
            <el-transfer v-model="ruleForm.roleId" :data="roleList" :titles="['待选', '已选']" :props="{key: 'id', label: 'roleName'}"></el-transfer>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindCharacterDialog = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      YPromptShow: false,
      bindCharacterDialog: false,
      isBol: false,
      message: "",
      page: 1,
      pageSize: 10,
      total: 0,
      optionProps:{
        value: 'id',
        label: 'name',
        children: 'children'
      },
      search: {
        //搜索框数据
        realName: "",
        roleName: "",
        deptName: [],
        dutiesLevelId: ""
      },
      jobRankList: [], //职务级别
      ruleForm: {
        roleId: [] //绑定角色id集合
      },
      deptId:'', //部门id
      deptList:[], //搜索框里部门树菜单
      roleList: [], //穿梭框角色列表
      userList: [], //人员列表
      userIdList: [] //待人员id集合
    };
  },
  activated() {
    this.getUserList();
    this.getCharacterList();
    this.getSearchDate();
    this.getDeptData()
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    }
  },
  methods: {
    getSearch() {
      this.page = 1;
      this.getUserList();
    },
    handleSelectionChange(value) {
      this.userIdList = [];
      this.ruleForm.roleId = [];
      value.forEach(item => {
        this.userIdList.push(item.userId);
      });
    },
    //部门value匹配organId
    handleChange(value) {
      let opt = null, valueId = value[value.length - 1] || '';
      if (valueId) {
        this.deptList.forEach((item, index) => {
          let organOpt = this.getOrganOpt(valueId, item);
          organOpt && (opt = organOpt);
        })
      } 
      if(opt){
        this.deptId = opt.id
      }else{
        this.deptId = ''
      }  
    },
    //递归方法筛选最后一层的数据
    getOrganOpt(valueId, deptListItem) {
      let organOpt = null;
      if (deptListItem && deptListItem.id == valueId) {
        organOpt = deptListItem;
      } else if (deptListItem.children && deptListItem.children.length > 0) {
        deptListItem.children.forEach((item, index) => {
          let resOpt = this.getOrganOpt(valueId, item);
          if (resOpt) {
            organOpt = resOpt;
          }
        })
      }
      return organOpt;
    },
    //获取部门树菜单
    getDeptData(){
      let params ={
        organId: this.loginOrganId
      }
      this.$axiosGet(API.person_getDeptTree,params).then(res =>{
        if(res.data){
          this.deptList = res.data;
        }
      })
    },

    // 获取人员列表
    getUserList() {
      let params = {
        projectCode: "HOUSE-ADMIN",
        realName: this.search.realName,
        roleName: this.search.roleName,
        deptId: this.deptId,
        dutiesLevelId: this.search.dutiesLevelId || "",
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.person_query, params).then(res => {
        let list = [];
        if (res.code == 200) {
          list = res.data.data || [];
          this.total = res.data.total;
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        } else {
          list = [];
        }
        this.userList = list;
      });
    },
    // 绑定角色弹出框
    bindCharacter(userId, roleResponseList) {
      this.userIdList = [userId];
      this.ruleForm.roleId = [];
      roleResponseList.forEach(item => {
        this.ruleForm.roleId.push(item.id);
      });
      this.bindCharacterDialog = true;
    },
    // 获取角色数据
    getCharacterList() {
      let params = {
        projectCode: "HOUSE-ADMIN"
      };
      this.$axiosGet(API.role_query, params).then(res => {
        if (res.code == 200) {
          this.roleList = res.data.data;
        } else {
          this.roleList = []
        }

      });
    },
    getSearchDate() {
      let params = {
        organId: this.loginOrganId
      };
      this.$axiosGet(API.person_findOrganDutiesByOrganId, params).then(
        res => {
          this.jobRankList = res.data || [];
        }
      );
    },
    // 清空表单验证
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let params = {
            projectCode: "HOUSE-ADMIN",
            userIdListString: JSON.stringify(this.userIdList), //人员id集合
            roleIdListString: JSON.stringify(this.ruleForm.roleId) //绑定角色id集合
          };
          this.$axiosPost(API.person_bindRole, params).then(res => {
            if (res.result == "success") {
              this.isBol = true;
              if (this.userIdList) {
                BURYINGPOINT.buryingPoint(
                  "通用模块",
                  "角色权限",
                  "批量绑定角色"
                );
              } else {
                BURYINGPOINT.buryingPoint("通用模块", "角色权限", "绑定角色");
              }
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.bindCharacterDialog = false;
            this.YPromptShow = true;
            this.loading = false;
          });
        }
      });
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getUserList();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getUserList();
    },
    YPromptClick() {
      if (this.isBol) {
        this.getUserList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-transfer {
  width: 100%;
}
// .title{
//   position: relative;
// }
</style>