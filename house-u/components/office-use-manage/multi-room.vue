<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="一人多室查询" :item="['一人多室查询']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.staffId,scope.row.assignOrganId)">{{scope.row.realName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="dutiesLevelName" label="职务级别">
          </el-table-column>
          <el-table-column prop="deptName" label="所属部门">
          </el-table-column>
          <el-table-column prop="standardArea" label="面积标准（㎡）">
          </el-table-column>
          <el-table-column prop="officeCount" label="办公室（间）">
          </el-table-column>
          <el-table-column prop="record" label="状态">
            <template slot-scope="scope">
              {{checkStatusName(scope.row.record)}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <!-- <a @click="idleClick(scope.row.staffId)" v-show="scope.row.record=== null">备案</a>
              <a @click="editClick(scope.row.userRecordId)" v-show="scope.row.record==='YES'">修改</a> -->
              <a @click="basicInfoClick(scope.row.staffId,scope.row.assignOrganId)">详情</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 备案弹窗 -->
    <el-dialog :title='titleRecord' custom-class="h-dialog-add" :visible.sync="rentEntryVisible" width="630px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <table>
          <tr>
            <th style="vertical-align: initial;width: 100px;">
              <i class="f-color-red">*</i>情况说明</th>
            <td colspan="3">
              <el-form-item prop="messageFee">
                <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.messageFee" placeholder="请输入情况说明"> </el-input>
                <div style="text-align: right;">{{ruleForm.messageFee.length}}/200</div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>
              附件</th>
            <td colspan="3">
              <el-button class="u-upload-btn" @click="emptyFileJson">
                <i class="iconfont icon-daochu"></i>上传附件
              </el-button>
              <ul>
                <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                  <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                  <a target="_blank" :href="item.url" download>下载</a>
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button v-show="this.titleRecord ==='新增备案'" class="u-submit-btn submit-btn" @click="getRecord" :loading="loading">保存</el-button>
        <el-button v-show="this.titleRecord ==='修改备案'" class="u-submit-btn submit-btn" @click="editRecordClick" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗结束 -->
    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="doc/docx/pdf/jpg/jpeg/png"></v-upload>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import basicDetail from '@/components/office-use-manage/view/multi-room-detail'; // 详情弹出框
import VUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    'basic-detail': basicDetail,
    'v-upload': VUpload
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      rentEntryVisible: false, //备案弹框
      loading: false,
      titleRecord: '',
      staffId: '',//职工id
      userRecordId: '', //人员修改备案id
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      maxLength: '200',
      page: 1, // 当前页 
      list: [], // 列表数据集合
      realName: '', // 
      ruleForm: {
        messageFee: '', //情况说明
        domains: [], //附件集合
      },
      rules: {
        messageFee: [
          { required: true, message: '请填写情况说明', trigger: 'change' }
        ],
      },
      propertyList: [] //下拉框产权状态集合
    };
  },
  activated() {
    this.getDataRequest();
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  methods: {
    resetForm() {
      this.rentEntryVisible = false;
    },
    checkStatusName(value) {
      if (value === 'YES') {
        return '已备案'
      } else {
        return '未备案'
      }
    },

    //备案
    idleClick(id) {
      this.ruleForm.messageFee = '';
      this.ruleForm.domains = [];
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      })
      this.titleRecord = "新增备案";
      this.rentEntryVisible = true;
      this.staffId = id;
    },
    //修改备案弹框
    editClick(id) {
      this.rentEntryVisible = true;
      this.titleRecord = "修改备案";
      this.userRecordId = id;
      this.getRecordDetail()
    },
    //新增备案
    getRecord() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            staffId: this.staffId,
            situationDescription: this.ruleForm.messageFee,
            fileRequestList: this.ruleForm.domains
          }
          this.loading = true;
          this.$axiosJsonPost(API.useManage_addUserRecord, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    // 获取备案详情
    getRecordDetail() {
      let params = {
        userRecordId: this.userRecordId
      }
      this.$axiosGet(API.useManage_userRecordDetail, params).then(res => {
        this.ruleForm.messageFee = res.data.situationDescription;
        this.ruleForm.domains = res.data.fileResponseList;
      })
    },
    //修改备案
    editRecordClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.userRecordId,
            situationDescription: this.ruleForm.messageFee,
            fileRequestList: this.ruleForm.domains
          }
          this.loading = true;
          this.$axiosJsonPost(API.useManage_updateUserRecord, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    // 详情
    basicInfoClick(id, gid) {
      this.$refs.basicDetail.openModal(id, gid);
    },
    fileUploadRequest(fileNameList) { // 文件上传回选
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.domains.length
    },
    emptyFileJson() { // 打开文件上传弹出框
      this.$refs.VUpload.openModal()
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
        this.rentEntryVisible = false;
      }
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        useOrganId: this.loginOrganId,
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.useManage_oneMoreRoomList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },


  }
};
</script>

<style lang="scss" scoped>
.h-table {
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
