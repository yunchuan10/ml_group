<template>
  <div>
    <section class="m-main" style="height: calc(100% - 35px);box-sizing: border-box;">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="编制管理" :item="['编制管理']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button v-show="this.writeAble==='YES'" class="f-pull-right u-bread-btn" @click="dialogShow = true">
            修改
          </button>
        </div>
      </div>
      <div class="m-preara-section">

        <div class="u-treecontent">
          <el-tree ref="preparaTree" :default-expand-all="true" :highlight-current="true" :data="aPreparaTree" :props="defaultProps" node-key="id" @node-click="handlePreparaNode"></el-tree>
        </div>

        <div class="m-preara-table">
          <div class="m-search">
            <table>
              <tr>
                <td class="select">
                  <ul class="f-clearfix" @keydown="$keydown($event, getData)">
                    <li>
                      <span>职务级别</span>
                      <el-select clearable placeholder="请选择职务级别" v-model="search.dutiesLevelKey">
                        <el-option v-for="(item, index) in dutiesLeveList" :key="index" :label="item.dutiesLevelName" :value="item.dutiesLevelKey"></el-option>
                      </el-select>
                    </li>
                  </ul>
                </td>
                <!--搜索按钮-->
                <td class="u-search-but">
                  <el-button class="f-search-but" @click="getData">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <div class="h-table f-relative">
            <el-table :data="list" stripe style="width: 100%" show-summary>
              <el-table-column prop="date" fixed="left" type='index' label="序号" width="50"></el-table-column>
              <el-table-column label="职务级别" prop="dutiesLevelName"></el-table-column>
              <el-table-column label="批复编制人数" prop="userNum"></el-table-column>
              <el-table-column label="实有人数" prop="realUserNum"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </section>
    <!-- 修改弹出框 -->
    <el-dialog title="修改" custom-class="h-dialog-add" :visible.sync="dialogShow" width="700px" @close="clearForm">
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm" style="margin: -20px 0">
          <table class="h-table-info">
            <tr>
              <th>职务级别</th>
              <th>编制数量（人）</th>
            </tr>
            <tr v-for="(formationResponseList, index) in ruleForm.formationResponseList" :key="index">
              <th>{{formationResponseList.dutiesLevelName}}</th>
              <td>
                <el-form-item :prop="'formationResponseList.'+ index + '.userNum'" :rules="{ validator: userNum, trigger: 'change' }">
                  <el-input v-model="formationResponseList.userNum" placeholder="请输入编制数量" @change="getTotalCount">
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>合计</th>
              <td>{{totalCount}}</td>
            </tr>
          </table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {

      // 左边树数据
      aPreparaTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      writeAble: '',//判断显示修改
      isBol: false,
      message: '',
      YPromptShow: false,
      loading: false,
      dialogShow: false,
      ruleForm: {
        formationResponseList: []
      },
      search: {
        dutiesLevelKey: ''
      },
      dutiesLeveList: [],
      list: [],
      totalCount: ''
    }
  },
  activated() {
    this.getSelect()
    this.getVerticalTree(); // 获取左侧tree数据
    // this.getData();
  },
  deactivated() {
    this.organId = '';
    this.search.dutiesLevelKey = '';
    this.aPreparaTree = [];
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  methods: {
    // 获取左边树数据
    getVerticalTree() {
      let params = {
        organId: this.loginOrganId,
      }
      this.$axiosGet(API.sysmanage_getVerticalTree, params).then(res => {
        if (res.data) {
          if (Array.isArray(res.data)) {
            this.aPreparaTree = res.data;
          } else {
            this.aPreparaTree = [res.data];
          }
        }
        let oDeploy = this.aPreparaTree[0] || {};
        if (oDeploy.id) {
          this.organId = oDeploy.id;
          this.writeAble = oDeploy.writeAble
        }else{
          this.organId = '';
        }
        this.$nextTick(() => {
          this.$refs.preparaTree.setCurrentKey(oDeploy.id);
        });
        this.getData();

      })
    },

    // 左边树点击
    handlePreparaNode(data) {

      if (this.organId == data.id) {
        return;
      }
      if (data.id) {
        this.organId = data.id;
        this.writeAble = data.writeAble
        // this.$store.commit('organIdMutations', data.id);
      } else {
        this.organId = '';
      }
      this.getData();
      this.getSelect();
    },
    getTotalCount() {
      let totalCount = 0;
      this.ruleForm.formationResponseList.forEach(item => {
        if (Number(item.userNum)) {
          totalCount += Number(item.userNum);
        }
      })
      this.totalCount = totalCount;
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    userNum(rule, value, callback) {
      if (value) {
        if (!/^(\d|([1-9]\d+?))$/.test(value)) {
          callback(new Error('人数为正整数'))
        } else if (value > 1000000) {
          callback(new Error('人数不能大于一百万个'))
        } else {
          callback();
        }
      } else {
        callback()
      }
    },
    getSelect() {
      let params ={
        organId: this.organId || this.loginOrganId,
      }
      this.$axiosGet(API.sysmanage_getDutiesName, params).then(res => {
        this.dutiesLeveList = res.data || [];
      })
    },
    getData() {
      let params = {
        organId: this.organId || this.loginOrganId,
        dutiesLevelKey: this.search.dutiesLevelKey
      }
      this.$axiosGet(API.sysmanage_getFormation, params).then(res => {
        if (res.data) {
          this.list = res.data.formationResponseList || [];
          this.ruleForm.formationResponseList = res.data.formationResponseList || [];
          this.getTotalCount();
        }
      })
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.formationResponseList.forEach((item, index) => {
            if (item.userNum == '') {
              item.userNum = 0;
            }
          })
          let params = {
            formationResponseList: this.ruleForm.formationResponseList
          }
          this.loading = true;
          this.$axiosJsonPost(API.sysmanage_updateFormation, this.ruleForm.formationResponseList).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YPromptShow = true;
            this.dialogShow = false;
            this.loading = false;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getData();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-preara-section {
  height: calc(100% - 61px);
  display: flex;
  .u-treecontent {
    height: 100%;
    padding: 15px 0;
    overflow: auto;
  }
  .m-preara-table {
    height: 100%;
    /* overflow: auto; */
    margin: 0;
    flex: 1 1 0;
    padding-left: 20px;
    .h-table {
      height: calc(100% - 60px);
      overflow: auto;
    }
  }
}
</style>