<template>
  <div>
    <section class="m-main column-manage-wrap">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="栏目管理" :item="['栏目管理']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn" @click="newAddColumn">
            <a>新增栏目</a>
          </div>
        </div>
      </div>

      <div class="h-table f-relative">
        <el-table :data="list" style="width: 100%;" align="center" border :span-method="objectSpanMethod">
          <el-table-column label="所属主题" align="center">
            <template slot-scope="scope">{{scope.row.titleName}}
              <i v-if="scope.row.status" class="iconfont icon-bianji1 column-table-i" @click="titleClick(themeId)"></i>
            </template>
          </el-table-column>

          <el-table-column label="栏目名称" align="center">
            <template slot-scope="scope">
              <!-- 不可编辑 -->
              <!-- <div v-if="scope.row.mark == 'N'">
                <span>{{scope.row.columnName}}</span>
              </div> -->
              <!-- 可编辑 -->
              <!-- <div v-if="scope.row.mark == 'Y'"> -->
              <!-- 修改 -->
              <!-- <div v-if="scope.$index !== scopeIndex"> -->
              <span>{{scope.row.columnName}}</span>
              <i v-if="scope.row.status" class="iconfont icon-bianji1 column-table-i" @click="columnEditClick(scope.row.columnId, scope.$index, scope.row)"></i>
              <!-- </div> -->
              <!-- 确定修改 -->
              <!-- <div v-if="scope.$index == scopeIndex">
                  <el-input size="small" ref="column" style="width:120px;" maxlength="6" v-model="scope.row.columnName"></el-input>
                  <i v-if="scope.$index == scopeIndex" class="iconfont icon-dui4 column-table-i" @click="columnSureClick(scope.row.columnId, scope.$index, scope.row)"></i>
                </div> -->
              <!-- </div> -->

            </template>
          </el-table-column>

          <el-table-column label="操作" width="180px" align="left">
            <template slot-scope="scope">
              <router-link v-if="scope.row.mark == 'N'" :to="{path: '/column-manage/edit-manage', query:{id:scope.row.columnId,title:scope.row.columnName}}">编辑栏目</router-link>
              <router-link v-if="scope.row.mark == 'Y'" :to="{path: '/column-manage/column-child-manage', query:{id:scope.row.columnId,title:scope.row.columnName}}">编辑栏目</router-link>
              <a v-if="scope.row.status == 'FALSE'" @click="disEnable(scope.row.columnId, 'TRUE')">禁用</a>
              <a v-if="scope.row.status == 'TRUE'" @click="disEnable(scope.row.columnId, 'FALSE')">启用</a>
              <a v-if="scope.row.mark == 'Y'" @click="columnDelete(scope.row.columnId)">删除</a>
            </template>
          </el-table-column>

        </el-table>

      </div>
    </section>

    <!-- 新增栏目弹框 -->
    <el-dialog custom-class="m-detail-dialog m-car-detail column-dia-wrap" append-to-body :show-close="false" width="600px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>{{columnAddEdit}}栏目</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div class="u-detail-dialog-content">
        <el-form style="margin-top: 10px;" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="160px" class="demo-ruleForm">
          <el-form-item label="栏目名称" prop="name" style="margin-bottom:5px;">
            <el-input class="" style="width: 300px;" :disabled="disColumnTitle" v-model="ruleForm.name" maxlength="6" placeholder="请输入栏目名称"></el-input>
          </el-form-item>

          <el-form-item label="所属主题" style="margin-bottom:5px;">
            <span>{{themeName}}</span>
          </el-form-item>

          <el-form-item label="状态" prop="type" style="margin-bottom:5px;">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="TRUE">启用</el-radio>
              <el-radio label="FALSE">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="newaddsel f-clearfix" prop="img" label="上传图标" style="margin-bottom:5px;">
            <div class="f-clearfix">
              <input v-model="ruleForm.img" style="display:none">
              <a class="local-choose f-pull-left" @click="openUploadFile">上传图标</a>
              <span class="f-color-red">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可上传jpg、jpeg、png格式图片</span>
            </div>
            <span v-show="ruleForm.img">
              <img style="width:256px;height:260px;" :src="ruleForm.img">
            </span>
          </el-form-item>
        </el-form>
      </div>

      <div class="column-btn">
        <span @click="columnCancel">取消</span>
        <span @click="columnSure">确定</span>
      </div>
    </el-dialog>

    <!-- 信息提示语 -->
    <Y-Prompt v-model="tipShow" :isBol="isBol" :message="message" @click="YTipClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :title='YConfirmTitle' :message="message" @click="YDeleteClick"></Y-Confirm>
    <!-- 图片裁剪 -->
    <crop-pic ref="cropPic" @callback="getImgUrl"></crop-pic>
  </div>
</template>

<script>
import cropPic from "@/components/column-manage/crop-pic";
import popupUpload from "@/assembly/vue-popup-upload";
export default {
  components: {
    'crop-pic': cropPic,
    'popup-upload': popupUpload,
  },
  data() {
    return {
      columnNum: false, // 栏目个数
      themeId: '', // 主题id
      columnTypeId: '', // 栏目id
      themeName: '', // 主题名称
      columnAddEdit: '新增', // 栏目的新增或编辑
      columnStatus: '', // 状态
      columnMark: '', // 删除
      statusMark: '', // 状态,删除
      statusMarkId: '', // 状态,删除id
      scopeIndex: '', // 当前点击列
      disColumnTitle: false, // 栏目名称是否可以修改
      list: [],
      carDetailShow: false, // 弹出框开关
      tipShow: false, // 消息弹框提示
      isBol: true,
      message: '', // 消息弹框提示语
      YConfirmShow: false, // 删除弹出框
      YConfirmTitle: '', // 弹出框标题
      ruleForm: {
        name: '',
        type: 'TRUE',
        img: ''
      },
      rules: {
        name: [
          { required: true, message: "请输入栏目名称", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        img: [
          { required: true, message: "请上传图标", trigger: "change" }
        ]
      },
    };
  },
  activated() {
    this.disColumnTitle = false;
    this.scopeIndex = '';
    this.ruleForm.name = '';
    this.ruleForm.type = 'TRUE';
    this.ruleForm.img = '';
    this.columnAddEdit = '新增';
    this.getDataDuty();
  },
  methods: {
    getImgUrl(data) {
      this.ruleForm.img = data;
    },
    // 点击上传文件
    openUploadFile() {
      if (this.ruleForm.name) {
        this.$refs.cropPic.openModal(this.ruleForm.name);
      } else {
        this.isBol = false;
        this.message = '请输入栏目名称后再选择模板';
        this.tipShow = true;
      }
    },
    // 点击新增栏目
    newAddColumn() {
      if (this.columnNum == true) {
        this.message = '自定义栏目数不能超过6个';
        this.tipShow = true;
        return;
      }
      this.disColumnTitle = false;
      this.carDetailShow = true;
      this.ruleForm.img = '';
      this.ruleForm.name = '';
      this.ruleForm.type = 'TRUE';
      this.columnAddEdit = '新增';
    },
    // 点击主题编辑
    titleClick(id) {
      this.$router.push({ path: '/column-manage/column-edit', query: { id: id } });
    },
    // 点击栏目编辑回显数据
    columnEditClick(id, index, row) {
      this.columnTypeId = id;
      this.scopeIndex = index;
      this.carDetailShow = true;
      this.columnAddEdit = '编辑';
      let params = {
        columnId: id,
      };
      this.$axiosGet(API.columnManageFacade_findByColumnId, params).then(res => {
        if (res.result == 'success') {
          this.ruleForm.name = res.model.columnName;
          this.ruleForm.type = res.model.status;
          this.ruleForm.img = row.icon;
          if (res.model.mark == 'N') {
            this.disColumnTitle = true;
          } else {
            this.disColumnTitle = false;
          }
        }
      })
    },
    // 点击栏目确定图标
    // columnSureClick(id, index, row) {
    //   /**
    //    * 修改内容不为空请求接口,
    //    * 接口请求成功或失败重新刷新表格
    //    */
    //   if (this.$refs.column.value) {
    //     this.statusChange(id, 'edit');
    //     this.scopeIndex = '';
    //   }
    // },
    // 栏目修改，禁用启用，删除
    statusChange(id, type) {
      let params = {
        columnId: id
      };
      let url = '';
      if (type == 'edit') {
        this.$set(params, 'columnName', this.$refs.column.value);
        this.$axiosJsonPost(API.columnManageFacade_updateColumn, params).then(res => {
          if (res.result == 'success') {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          if (type == 'edit') {
            this.tipShow = true;
          } else {
            this.getDataDuty();
          }
        })
      } else if (type == 'status') {
        this.$set(params, 'status', this.columnStatus);
        this.$axiosJsonPost(API.columnManageFacade_updateColumn, params).then(res => {
          if (res.result == 'success') {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          if (type == 'edit') {
            this.tipShow = true;
          } else {
            this.getDataDuty();
          }
        })
      } else if (type == 'delete') {
        this.$set(params, 'logicDetele', 'YES');
        this.$set(params, 'flag', 'DELETE')
        this.$axiosPost(API.columnManageFacade_deleteColumn, params).then(res => {
          if (res.result == 'success') {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          if (type == 'edit') {
            this.tipShow = true;
          } else {
            this.getDataDuty();
          }
        })
      }


    },
    // 表格合并单元格处理
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else if (rowIndex === 1) {
          return {
            rowspan: this.list.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 表格点击删除
    columnDelete(id) {
      this.YConfirmShow = true;   //弹出提示框
      this.YConfirmTitle = '删除';    //设置提示框标题
      this.message = '您确定要删除吗';    //设置提示框内容消息
      this.columnMark = 'N';
      this.statusMark = 'delete';
      this.statusMarkId = id;
    },
    // 启用禁用
    disEnable(id, type) {
      this.YConfirmShow = true;
      if (type == 'FALSE') {
        this.YConfirmTitle = '启用';
        this.message = '您确定要启用吗';
        this.columnStatus = 'FALSE';
      } else {
        this.YConfirmTitle = '禁用';
        this.message = '您确定要禁用吗';
        this.columnStatus = 'TRUE';
      }
      this.statusMark = 'status';
      this.statusMarkId = id;
    },
    // 表格数据
    getDataDuty() {
      this.$axiosGet(API.columnManageFacade_findTitleAndColumn).then(res => {
        if (res.model[0].columnBOList.length >= 9) {
          this.columnNum = true;
        } else {
          this.columnNum = false;
        }
        if (res.model.length > 0) {
          let inspection = {
            columnName: '视察点',
            titleName: '视察点',
            mark: 'N',
          }
          res.model[0].columnBOList.unshift(inspection);
          this.list = res.model[0].columnBOList;
        } else {
          this.list = [];
        }
        this.themeName = res.model[0].titleName;
        this.themeId = res.model[0].titleId;
      })
    },
    // 取消
    columnCancel() {
      this.ruleForm.name = '';
      this.ruleForm.type = 'TRUE';
      this.ruleForm.img = '';
      this.carDetailShow = false;
    },
    // 新增栏目确定
    columnSure() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.columnAddEdit == '编辑') {
            let params = {
              columnId: this.columnTypeId,
              columnName: this.ruleForm.name,
              icon: this.ruleForm.img,
              belongTitleId: this.themeId,
              status: this.ruleForm.type
            };
            this.$axiosJsonPost(API.columnManageFacade_updateColumn, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.tipShow = true;
            })
          } else {
            console.log(this);
            let params = {
              belongTitleId: this.themeId,
              columnName: this.ruleForm.name,
              status: this.ruleForm.type,
              icon: this.ruleForm.img
            };
            this.$axiosJsonPost(API.columnManageFacade_createColumn, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.tipShow = true;
              this.ruleForm.name = '';
              this.ruleForm.type = 'TRUE';
              this.ruleForm.img = '';
            })
          }
          this.carDetailShow = false;
        }
      })
    },
    // 操作成功的回调方法
    YTipClick() {
      if (this.isBol) {
        this.getDataDuty();
      }
    },
    // 删除,启用禁用
    YDeleteClick() {
      this.statusChange(this.statusMarkId, this.statusMark);
    }
  }
};
</script>

<style lang="scss">
.event-none {
  pointer-events: none;
  cursor: not-allowed;
}
.column-manage-wrap {
  .column-table-i {
    margin-left: 5px;
    color: #306fff;
    cursor: pointer;
  }
  .el-table th.is-left {
    text-align: center;
  }
}
.main-default .g-content .g-main .m-main .h-table .el-table thead th .cell {
  border-left: 0px;
}

// 弹框
.column-dia-wrap {
  margin: auto !important;
  margin-top: 15vh !important;
  left: 0;
  height: 600px;
  border-radius: 4px !important;
  .column-btn {
    height: 54px;
    line-height: 54px;
    text-align: right;
    border-top: 1px #e4e8eb solid;
    span {
      margin-right: 20px;
      border: 1px #e4e8eb solid;
      background-color: #fff;
      border-radius: 2px;
      display: inline;
      padding: 7px 20px;
      cursor: pointer;
      &:last-child {
        background-color: #2f70ff;
        border-color: #2f70ff;
        color: #fff;
      }
    }
  }
}
</style>