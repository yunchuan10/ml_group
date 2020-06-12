<template>
  <div>
    <el-dialog class="f-dialog-wrap" :visible.sync="addColumnShow" width="1600px" @close="clearRules">
      <section class="m-main">
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
          <el-table :data="organList" style="width: 100%;margin-bottom: 20px;" select-on-indeterminate @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
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
          </el-table>
        </div>
        <div class="h-table-bottom f-clearfix">
          <div class="h-table-btns f-pull-left">
          </div>
          <div class="h-table-pages f-pull-right">
            <div class="block">
              <el-pagination @size-change="handleSizeChange" :current-page="page" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addColumnShow = false">取 消</el-button>
        <el-button type="primary" @click="addColumnId">确 定</el-button>
      </span>
      <!--删除提示框-->
      <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
      <!--操作提示框-->
      <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

    </el-dialog>
  </div>
</template>

<script>
import { parse } from 'path';
export default {
  data() {
    let self = this;
    return {
      addColumnShow: false,
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
      treeDetails: [],//树的根信息
      organTreeList: [],//树的id，name
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
      adminUserId: '',
      uniqueCode: '',
      roleType: '',
      multipleSelection: [],
      ownerOrganId: '',
      ownerOrganName: '',
      businessKey: ''
    };
  },
  activated() {
    this.getProvinceList();
    this.getPrDic();
    this.getProject();
    this.getOrganList();
  },

  methods: {
    // 点击确定添加节点
    addColumnId() {
      let params = {
        parentId: this.treeDetails.value,
        businessKey: this.businessKey,
        ownerOrganId: this.ownerOrganId,
        ownerOrganName: this.ownerOrganName,
        organList: this.organTreeList,
      }
      this.$axiosJsonPost(API.organTree_addChildren, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.organList = [];
        this.YConfirmShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },

    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.organTreeList = [];
      this.multipleSelection.forEach((item, index) => {
        this.organTreeList.push({ organId: item.organId, organName: item.organName })
      });
    },

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
    // 取消
    clearRules() {
      this.addColumnShow = false
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
        areaId = ''
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



    YDeleteClick() {
      //   this.multipleSelection = '';
      //   this.addColumnShow = false;
    },
    clearForm() {
      this.ruleForm.city = '';
      this.ruleForm.county = '';
      this.ruleForm.township = '';
      this.cityList = [];
      this.countyList = [];
      this.townshipList = [];
    },
    YPromptClick() {
      if (this.isBol) {
        this.addColumnShow = false;
        this.$emit('callback', true)
      }
      this.getOrganList();
    },
    // 初始化弹出框
    openModal(val, ownerOrganId, ownerOrganName, businessKey) {
      this.addColumnShow = true;
      this.search.organName = '';
      this.page = 1;
      this.getOrganList();
      this.treeDetails = val;
      this.organList = [];
      this.ownerOrganName = ownerOrganName;
      this.ownerOrganId = ownerOrganId;
      this.businessKey = businessKey
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
   