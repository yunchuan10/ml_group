<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="应用配置"></Y-Breadcrumb>
        <!-- <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="openMenuDialog()">
            新增
          </button>
        </div> -->
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <!-- <li>
                  <span>模块名称</span>
                  <el-select v-model="search.productKey" placeholder="请选择模块名称">
                    <el-option v-for="(item, index) in prodicList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </li> -->
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
        <el-table :data="organList" style="width: 100%;margin-bottom: 20px;" row-key="value" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="organName" label="单位名称"></el-table-column>
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
          <el-table-column prop="type" label="操作">
            <template slot-scope="scope">
              <a v-show="scope.row.adminOrganStatus =='NORMAL' || scope.row.adminOrganStatus =='SUPERVISED_ORGAN'" @click="setDialogClick(scope.row.organId, '1', scope.row.adminOrganStatus)">设置主管单位</a>
              <a v-show="scope.row.adminOrganStatus =='NORMAL' || scope.row.adminOrganStatus =='ADMIN_ORGAN'" @click="setDialogClick(scope.row.organId, '2', scope.row.adminOrganStatus)">设置被监管单位</a>
              <a v-show="scope.row.adminOrganStatus =='ADMIN_AND_SUPERVISED_ORGAN' || scope.row.adminOrganStatus =='ADMIN_ORGAN'" @click="setDialogClick(scope.row.organId, '3', scope.row.adminOrganStatus)">取消主管单位</a>
              <a v-show="scope.row.adminOrganStatus =='ADMIN_AND_SUPERVISED_ORGAN' || scope.row.adminOrganStatus =='SUPERVISED_ORGAN'" @click="setDialogClick(scope.row.organId, '4', scope.row.adminOrganStatus)">取消被监管单位</a>
              <a @click="setProjectCode(scope.row.organId)">设置项目</a>
              <!-- <a @click="deleteClick(scope.row.organId)">删除</a>
              <a @click="openMenuDialog(scope.row.organId)">修改</a> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <!-- <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出
          </button> -->
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 新增菜单 -->
    <el-dialog :title="titleName + '用户'" custom-class="u-menu" :visible.sync="organDialogShow" width="40%" @close="clearForm" :close-on-click-modal="false">
      <div style="height: 400px;overflow:auto;">
        <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width="120px">
          <el-form-item label="所属区域" prop="province" :rules="{required: true, message: '所属区域不能为空', trigger: 'change'}">
            <el-select v-model="ruleForm.province" @change="getProvinceList" style="width:25%;" placeholder="请选择省">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="ruleForm.city" @change="getProvinceList" style="width:25%;" placeholder="请选择市">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="ruleForm.county" @change="getProvinceList" style="width:25%;" placeholder="请选择县">
              <el-option v-for="(item, index) in countyList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="ruleForm.township" style="width:25%;" placeholder="请选择乡镇">
              <el-option v-for="(item, index) in townshipList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位名称" prop="organName" :rules="{required: true, message: '单位名称不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.organName" placeholder="请输入单位名称"></el-input>
          </el-form-item>
          <el-form-item label="单位简称" prop="shortName">
            <el-input v-model="ruleForm.shortName" placeholder="请输入单位简称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="组织机构编码" prop="uniqueCode" :rules="{required: true, message: '组织机构编码不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.uniqueCode" placeholder="请输入组织机构编码"></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="belongSource" :rules="{required: true, message: '所属项目不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.belongSource" placeholder="请输入所属项目"></el-input>
          </el-form-item> -->

          <el-form-item label="单位类别" prop="organCategory" :rules="{required: true, message: '单位类别不能为空', trigger: 'change'}">
            <el-select v-model="ruleForm.organCategory" style="display:block;" placeholder="请选择单位级别">
              <el-option v-for="(item, index) in organSpecificationList.organCategory" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="行政区划级别" prop="adminDivisionLevel" :rules="{required: true, message: '行政区划级别不能为空', trigger: 'change'}">
            <el-select v-model="ruleForm.adminDivisionLevel" style="display:block;" placeholder="请选择行政区划级别">
              <el-option v-for="(item, index) in organSpecificationList.adminDivisionLevel" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="行政区划代码" prop="adminDivisionNo" :rules="{required: true, message: '行政区划代码不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.adminDivisionNo" placeholder="请输入行政区划代码"></el-input>
          </el-form-item>
          <!-- <el-form-item label="单位级别" prop="organSpecification" :rules="{required: true, message: '单位级别不能为空', trigger: 'change'}">
            <el-select v-model="ruleForm.organSpecification" style="display:block;" placeholder="请输入单位级别">
              <el-option v-for="(item, index) in organSpecificationList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="真实姓名" prop="realName" :rules="{required: true, message: '真实姓名不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.realName" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName" :rules="{required: true, message: '用户名不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" :rules="[{required: true, message: '手机号不能为空', trigger: 'change'},{ pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }]">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="账号密码" v-if="titleName != '修改'" prop="password" :rules="{required: true, message: '账号密码不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.password" placeholder="请输入账号密码"></el-input>
          </el-form-item>
        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="organDialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--设置项目名称 -->
    <el-dialog title="新增用户" custom-class="u-menu" :visible.sync="projectCodeDialog" width="40%" @close="clearprojectForm">
      <div>
        <el-form ref="projectRuleForm" :model="projectRuleForm" label-position="right" label-width="100px">
          <el-form-item prop="projectCode" label="项目名称" :rules="{required: true, message: '项目名称不能为空', trigger: 'change'}">
            <el-select style="display: block;" multiple v-model="projectRuleForm.projectCode" placeholder="请选择项目编码">
              <el-option v-for="(item, index) in projectCodeList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="projectCodeDialog = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="submitProjectClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import { parse } from 'path';
export default {
  data() {
    let self = this;
    return {
      projectCodeDialog: false,
      YConfirmShow: false,
      YPromptShow: false,
      isBol: false,
      organDialogShow: false,
      message: '',
      search: {
        province: '',
        city: '',
        county: '',
        productKey: '',
        organName: ''
      },
      ruleForm: {
        organName: '',
        shortName: '',
        province: '',
        city: '',
        county: '',
        township: '',
        uniqueCode: '',
        belongSource: '',
        realName: '',
        userName: '',
        phone: '',
        password: '',
        adminDivisionNo: '',
        organCategory: '',
        adminDivisionLevel: ''
      },
      projectRuleForm: {
        projectCode: []
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      organList: [],
      provinceList: [],
      cityList: [],
      countyList: [],
      townshipList: [],
      comfirmType: '',
      organId: '',
      adminOrganStatus: '',
      prodicList: [],
      projectCodeList: [],
      organSpecificationList: [],
      titleName: '',
      adminUserId: '',
      uniqueCode: '',
      roleType: '',
    };
  },
  activated() {
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
    setProjectCode(organId) {
      this.organId = organId;
      let params = {
        organId: organId
      }
      this.$axiosGet(API.organ_getOrganProject, params).then(res => {
        if (res.data) {
          this.projectRuleForm.projectCode = [];
          res.data.forEach((item) => {
            this.projectRuleForm.projectCode.push(item.projectCode)
          })
        }
      })
      this.projectCodeDialog = true;
    },
    clearprojectForm() {
      this.$refs.projectRuleForm.resetFields();
    },
    submitProjectClick() {
      let params = {
        organId: this.organId,
        projectCodeListString: JSON.stringify(this.projectRuleForm.projectCode)
      }
      this.$axiosPost(API.organ_bindProject, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.projectCodeDialog = false;
        this.message = res.message;
        this.YPromptShow = true;
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
        projectCode: 'HOUSE-ADMIN',
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let areaId = '';
          if (this.ruleForm.township) {
            areaId = this.ruleForm.township;
          } else if (this.ruleForm.county) {
            areaId = this.ruleForm.county;
          } else if (this.ruleForm.city) {
            areaId = this.ruleForm.city;
          } else {
            areaId = this.ruleForm.province;
          }
          if (this.titleName == '修改') {
            this.ruleForm.password = '';
          }
          let params = {
            organId: this.organId,
            organName: this.ruleForm.organName,
            shortName: this.ruleForm.shortName,
            areaId: areaId,
            // uniqueCode: this.ruleForm.uniqueCode,
            // belongSource: this.ruleForm.belongSource,
            realName: this.ruleForm.realName,
            userName: this.ruleForm.userName,
            phone: this.ruleForm.phone,
            password: this.ruleForm.password,
            organCategory: this.ruleForm.organCategory,
            adminDivisionLevel: this.ruleForm.adminDivisionLevel,
            adminDivisionNo: this.ruleForm.adminDivisionNo,
            adminUserId: this.adminUserId,
            uniqueCode: this.uniqueCode,
            roleType: this.roleType,
          }
          this.$axiosPost(API.organ_add, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.organDialogShow = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      })
    },
    openMenuDialog(id) {
      if (id) {
        this.organId = id;
        this.titleName = '修改';
        this.modifyClick(id);
      } else {
        this.organId = '';
        this.titleName = '新增';
      }
      this.organDialogShow = true;
    },
    getDetail(id) {
      let params = {
        organId: this.organId
      }
      this.$axiosGet(API.resources_getDetail, params).then(res => {
        // if (res.result == 'success') {
        // }
      })
    },
    setDialogClick(id, type, adminOrganStatus) {
      this.organId = id;
      this.adminOrganStatus = adminOrganStatus;
      this.comfirmType = type;
      if (type == '1') {
        this.message = '您确定设置为主管单位吗';
      } else if (type == '2') {
        this.message = '您确定设置为被监管单位吗';
      } else if (type == '3') {
        this.message = '您确定取消主管单位吗';
      } else if (type == '4') {
        this.message = '您确定取消被监管单位吗';
      }
      this.YConfirmShow = true;
    },
    deleteClick(id) {
      this.message = '您确定删除吗';
      this.comfirmType = '5';
      this.organId = id;
      this.YConfirmShow = true;
    },
    modifyClick(id) {
      this.organId = id;
      let params = {
        organId: this.organId
      }
      this.$axiosGet(API.organ_detail, params).then(res => {
        if (res.result == 'success') {
          if (res.data.organInfo) {
            this.ruleForm = res.data.organInfo || {};
            this.adminUserId = this.ruleForm.adminUserId;
            this.uniqueCode = this.ruleForm.uniqueCode;
            this.roleType = this.ruleForm.roleType;
          }
          if (res.data.parentIdList.length == 1) {
            this.ruleForm.province = res.data.parentIdList[0];
            this.ruleForm.city = this.ruleForm.areaId;
            this.ruleForm.county = '';
            this.ruleForm.township = '';
          } else if (res.data.parentIdList.length == 2) {
            this.ruleForm.province = res.data.parentIdList[1];
            this.ruleForm.city = res.data.parentIdList[0];
            this.ruleForm.county = this.ruleForm.areaId;
            this.ruleForm.township = '';
          } else if (res.data.parentIdList.length == 3) {
            this.ruleForm.province = res.data.parentIdList[2];
            this.ruleForm.city = res.data.parentIdList[1];
            this.ruleForm.county = res.data.parentIdList[0];
            this.ruleForm.township = this.ruleForm.areaId;
          } else if (res.data.parentIdList.length == 0) {
            this.ruleForm.province = this.ruleForm.areaId;
            this.ruleForm.city = '';
            this.ruleForm.county = '';
            this.ruleForm.township = '';
          }

        }
      })
    },
    YDeleteClick() {
      let params = {}
      let url = '';
      if (this.comfirmType == '1') {
        url = API.organ_configAdminOrgan;
        params = {
          productKey: this.search.productKey,
          organId: this.organId
        }
      } else if (this.comfirmType == '2') {
        url = API.organ_configSupervisedOrgan;
        let areaId = '0100';
        if (this.search.county) {
          areaId = this.search.county;
        } else if (this.search.city) {
          areaId = this.search.city;
        } else if (this.search.province) {
          areaId = this.search.province;
        } else {
          areaId = '0100';
        }
        params = {
          productKey: this.search.productKey,
          areaId: areaId,
          supervisedOrganIds: JSON.stringify([this.organId])
        }
      } else if (this.comfirmType == '3') {
        url = API.organ_cancelAdminOrgan;
        params = {
          productKey: this.search.productKey,
          adminOrganStatus: this.adminOrganStatus,
          organId: this.organId
        }
      } else if (this.comfirmType == '4') {
        url = API.organ_cancelSupervisedOrgan;
        params = {
          productKey: this.search.productKey,
          adminOrganStatus: this.adminOrganStatus,
          organId: this.organId
        }
      } else if (this.comfirmType == '5') {
        url = API.organ_changeStatus;
        params = {
          changeType: 'DELETE',
          organId: this.organId
        }
      }
      this.$axiosPost(url, params).then(res => {
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
    clearForm() {
      this.ruleForm.city = '';
      this.ruleForm.county = '';
      this.ruleForm.township = '';
      this.cityList = [];
      this.countyList = [];
      this.townshipList = [];
      this.$refs.ruleForm.resetFields();
    },
    YPromptClick() {
      if (this.isBol) {
        this.getOrganList();
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getOrganList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getOrganList();
    }
  },

};
</script>

<style lang="scss" scoped>
.u-menu {
  .el-dialog__body {
    padding-right: 0;
  }
}
</style>
   