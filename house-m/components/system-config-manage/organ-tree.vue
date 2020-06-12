<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="组织树管理"></Y-Breadcrumb>
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
                  <el-select v-model="search.businessKey" placeholder="请选择项目编码">
                    <el-option label="办公用房" value="OFFICE_HOUSE"></el-option>
                    <el-option label="经营性房产" value="DEAL_HOUSE"></el-option>
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
          <el-table-column prop="organName" label="单位名称"></el-table-column>
          <el-table-column prop="type" label="操作" width="450px">
            <template slot-scope="scope">
              <a @click="deleteClick(scope.row.id)">删除</a>
              <a @click="openNewOrgan(scope.row.id,scope.row.ownerOrganId,scope.row.ownerOrganName)">编辑</a>
              <!-- <a v-show="scope.row.enable==='YES'" @click="disableClick(scope.row.id,'DISABLED')">禁用</a>
              <a v-show="scope.row.enable==='NO'" @click="disableClick(scope.row.id,'ENABLE')">启用</a> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <!-- 新增菜单 -->
    <el-dialog title="新增菜单" custom-class="u-menu" :visible.sync="menuDialogShow" width="90%" @close="clearForm">
      <div style="height: 400px;overflow:auto;">
        <template>
          <div>
            <section class="m-main">
              <div class="m-search">
                <table>
                  <tr>
                    <td>
                      <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                        <li>
                          <span>单位名</span>
                          <el-input v-model="search.organName" placeholder="请输入单位名"></el-input>
                        </li>
                        <li>
                          <span>区域</span>
                          <el-select v-model="search.province" @change="getSearchProvinceList" style="width:25%;" placeholder="请选择省">
                            <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                          <el-select v-model="search.city" @change="getSearchProvinceList" style="width:25%;" placeholder="请选择市">
                            <el-option v-for="(item, index) in cityList" :key="index" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                          <el-select v-model="search.county" @change="getSearchProvinceList" style="width:25%;" placeholder="请选择县">
                            <el-option v-for="(item, index) in countyList" :key="index" :label="item.name" :value="item.id"></el-option>
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
                <el-radio-group v-model="organNames" style="width:100%;">
                  <el-table :data="organList" style="width: 100%;margin-bottom: 20px;" row-key="value" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column prop="organName" label="单位名称">
                      <template slot-scope="scope">
                        <el-radio :label="scope.row.organName">{{scope.row.organName}}</el-radio>
                      </template>
                    </el-table-column>
                    <el-table-column prop="adminOrganStatus" label="单位性质">
                      <template slot-scope="scope">
                        {{checkOrganStatus(scope.row.adminOrganStatus)}}
                      </template>
                    </el-table-column>
                    <el-table-column label="项目名称">
                      <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.organProjectResponseList" :key="index">
                          <span v-show="index > 0">，</span>{{item.projectName}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="userName" label="用户名称"></el-table-column>
                    <el-table-column prop="realName" label="真实姓名"></el-table-column>
                    <el-table-column prop="phone" label="手机号码"></el-table-column>
                  </el-table>
                </el-radio-group>
              </div>
              <div class="h-table-bottom f-clearfix">
                <div class="h-table-btns f-pull-left">
                  <!-- <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出
          </button> -->
                </div>
                <div class="h-table-pages f-pull-right">
                  <div class="block">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </template>

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
import { parse } from 'path';
export default {
  data() {
    return {
      organNames: '',
      organIds: '',
      YConfirmShow: false,
      YPromptShow: false,
      organDialogShow: false,
      search: {
        province: '',
        city: '',
        county: '',
        productKey: '',
        organName: '',
        businessKey: [],
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      organList: [],
      provinceList: [],
      cityList: [],
      countyList: [],
      townshipList: [],
      organId: '',
      adminOrganStatus: '',
      prodicList: [],
      projectCodeList: [],
      titleName: '',
      isBol: false,
      menuDialogShow: false,
      ruleForm: {},
      message: '',
      menuList: [],
    };
  },
  activated() {
    this.getMenuList();
    this.getProvinceList();
    this.getPrDic();
    this.getProject();
    this.getOrganList();
    this.titleName = '';
  },
  methods: {
    // 获取项目名
    getProject() {
      this.$axiosGet(API.resources_getProjectCode, {}).then(res => {
        this.projectCodeList = res.data;
      })
    },
    getPrDic() {
      this.$axiosGet(API.organ_getProDic, {}).then(res => {
        this.prodicList = res.data;
        this.search.productKey = this.prodicList[0].dicValue
      })
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getOrganList()
    },
    getOrganList() {
      let areaId = '';
      if (this.search.county) {
        areaId = this.search.county;
      } else if (this.search.city) {
        areaId = this.search.city;
      } else if (this.search.province) {
        areaId = this.search.province;
      }
      let params = {
        areaId: areaId,
        organName: this.search.organName,
        productKey: this.search.productKey,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.organ_query, params).then(res => {
        let list = [];
        list = res.data.data || [];
        this.total = res.data.total;
        list.forEach((item, index) => {
          list[index].num = index + 1;
        });
        this.organList = list;
      })
    },
    checkOrganStatus(organStatus) {
      if (organStatus == 'ADMIN_ORGAN') {
        return '主管单位'
      } else if (organStatus == 'SUPERVISED_ORGAN') {
        return '被监管单位'
      } else if (organStatus == 'ADMIN_AND_SUPERVISED_ORGAN') {
        return '主管单位+被监管单位'
      } else {
        return '普通单位'
      }
    },
    // 获取搜索框区域
    getSearchProvinceList(value) {
      let areaId = '';
      if (value) {
        areaId = value
      } else {
        areaId = '0100'
      }
      let params = {
        id: areaId
      }
      this.$axiosGet(API.report_getArea, params).then(res => {
        if (res.result == 'success') {
          if (res.data.length > 0) {
            if (res.data[0].level == '1') {
              this.provinceList = res.data || [];
            } else if (res.data[0].level == '2') {
              this.search.city = '';
              this.search.county = '';
              this.search.township = '';
              this.cityList = res.data || [];
            } else if (res.data[0].level == '3') {
              this.search.county = '';
              this.search.township = '';
              this.countyList = res.data || [];
            } else {
              this.search.township = '';
              this.townshipList = res.data || [];
            }
          }
        }
      })
    },
    // 获取地区初始列表
    getProvinceList(value) {
      let areaId = '';
      if (value) {
        areaId = value
      } else {
        areaId = '0100'
      }
      let params = {
        id: areaId
      }
      this.$axiosGet(API.report_getArea, params).then(res => {
        if (res.result == 'success') {
          if (res.data.length > 0) {
            if (res.data[0].level == '1') {
              this.provinceList = res.data || [];
            } else if (res.data[0].level == '2') {
              this.ruleForm.city = '';
              this.ruleForm.county = '';
              this.ruleForm.township = '';
              this.cityList = res.data || [];
            } else if (res.data[0].level == '3') {
              this.ruleForm.county = '';
              this.ruleForm.township = '';
              this.countyList = res.data || [];
            } else {
              this.ruleForm.township = '';
              this.townshipList = res.data || [];
            }
          }
        }
      })
    },
    // 提交操作
    submitClick() {
      this.organList.forEach((item, index) => {
        if (item.organName == this.organNames) {
          this.organIds = item.organId
        }
      });
      let params = {
        organName: this.organNames,
        organId: this.organIds,
        businessKey: this.search.businessKey
      }
      this.$axiosPost(API.organTree_addRoot, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.menuDialogShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    openMenuDialog(id) {
      this.organId = '';
      this.titleName = '新增';
      this.organNames = "";
      this.menuDialogShow = true;
    },
    openNewOrgan(id, ownerOrganId, ownerOrganName) {
      this.$router.push({ path: '/system-config/addorgan-tree', query: { id: id, businessKey: this.search.businessKey, ownerOrganId: ownerOrganId, ownerOrganName: ownerOrganName } })
    },
    deleteClick(id) {
      this.message = '您确定删除吗';
      this.organId = id;
      this.YConfirmShow = true;
    },

    clearForm() {
      this.ruleForm.city = '';
      this.ruleForm.county = '';
      this.ruleForm.township = '';
      this.cityList = [];
      this.countyList = [];
      this.townshipList = [];
      //   this.$refs.ruleForm.resetFields();
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getOrganList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getOrganList();
    },


    // 获取菜单列表
    getMenuList() {
      let params = {
        businessKey: this.search.businessKey
      }
      this.$axiosGet(API.organTree_listOrgan, params).then(res => {
        if (res.result == 'success') {
          this.menuList = res.data || [];
        }

      })
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
        }
      })
    },
    YDeleteClick(id) {
      let params = {
        id: this.organId,
        type: 'DELETE'


      }
      this.$axiosPost(API.organTree_delete, params).then(res => {
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
      this.$axiosPost(API.organTree_delete, params).then(res => {
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
   