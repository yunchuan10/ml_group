<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <Y-Breadcrumb title="数据字典" :item="['数据字典']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="openCharacterDialog('add')">
            新增
          </button>
        </div>
      </div>
      <div style="height: calc(100% - 61px)">
        <div class="u-treecontent" style="height: 100%;">
          <div style="height: calc(100% - 110px);overflow: auto;" class="treeIconStyle">
            <!-- <el-tree lazy :load="loadNode" class="filter-tree" :accordion="true" @node-click="updateorganName" :highlight-current="true" :data="roomNoteList" node-key="value" :default-expanded-keys="[courtyardId]" :props="defaultProps" :filter-node-method="filterNode" ref="tree2"> -->
            <el-tree class="filter-tree data-dictionary-tree" @node-click="updateorganName" :highlight-current="true" :data="roomNoteList" node-key="sortNo" :default-expanded-keys="[1]" :props="defaultProps" ref="tree2">
              <span class="custom-tree-node" slot-scope="{ node }" style="width: 100%;display: inline-block;">
                <span>{{ node.label }}</span>
                <span style="float: right;color: #C0C4CC; margin-right: 10px">
                  <i class="iconfont icon-you" style=" font-size: 12px"></i>
                </span>
              </span>
            </el-tree>
          </div>
        </div>

        <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:15px;">
          <div class="u-tree-seachbox">
            <div class="m-search">
              <table>
                <tr>
                  <td>
                    <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                      <li>
                        <span>二级分类名称</span>
                        <el-input v-model="roomTypeName" clearable placeholder="请输入二级分类名称">
                          <!-- <el-option v-for="item in floorAndStoreys" :key="item.value" :label="item.label" :value="item.value"></el-option> -->
                        </el-input>

                      </li>
                    </ul>
                  </td>
                  <!--搜索按钮-->
                  <td class="u-search-but">
                    <el-button class="f-search-but" @click="searchClick">查询</el-button>
                  </td>
                </tr>
              </table>
            </div>
            <div class="h-table f-relative">
              <el-table :data="list" stripe style="width:auto" reserve-selection>
                <el-table-column prop="date" fixed="left" label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="一级分类">
                  <template slot-scope="scope">
                    {{scope.row.typeName ? roomName : ''}}
                  </template>
                </el-table-column>
                <el-table-column prop="typeName" label="二级分类">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <a @click="deleteClick(scope.row.id)">删除</a>
                    <a @click="openCharacterDialog(scope.row.id,scope.row.typeName)">修改</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- 新增弹窗 -->
    <el-dialog :title="titleName " custom-class="h-dialog-add" :visible.sync="characterDialogShow" width="25%" @close="clearForm">
      <div style="height: 150px;overflow:auto;">
        <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width="100px">
          <el-form-item label="一级分类">
            <el-input disabled v-model="ruleForm.roomName"></el-input>
          </el-form-item>
          <el-form-item label="二级分类" prop="roomTypeName" :rules="{required: true,message: '二级房间类型不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.roomTypeName" :maxlength="10" placeholder="请输入二级房间类型"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="characterDialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 操作成功提示框 -->
    <!-- <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message"></Y-Prompt> -->
    <!-- <v-allocation ref="allocation" @requestData="getTableData"></v-allocation> -->
  </div>

</template>

<script>
// import paths from '@/utils/baseUrl'; // 后端地址
// import allocation from '@/components/query-manage/view/allocation'; // 使用分配
export default {
  components: {
    // 'v-allocation': allocation,
    // 'v-room-detail': roomDetail
  },
  data() {
    return {
      search: {
        roomStatus: '', // 查询框绑定的值
        roomAddress: '', // 房间位置
        houseType: [], // 房间类型绑定的值s
      },
      path: [],
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      activeName: 'number',
      filterText: '',
      organName: '', //院落名称
      list: [],//表格列表信息
      ruleForm: {
        roomName: '',
        roomTypeName: ''
      },
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'typeName'
      },
      YPromptShow: false,
      characterDialogShow: false,
      YConfirmShow: false, // 删除弹出框
      flag: 'area',
      isBol: false,
      message: '',
      titleName: '新增办公用房类型',
      parentId: '', // 1级类型idid
      parentTypeId: '', //2级类id
      roomName: '', //1级类型名称
      roomTypeName: '', // 2间类型名称
    };

  },
  computed: {
  },
  watch: {
  },

  activated() {
    this.roomTypeName = '';
    this.getRoomTree();
  },
  // created() {
  //   this.$nextTick(function () {
  //     this.$refs.tree2.setCurrentKey(0);
  //   })
  // },

  deactivated() {
    this.iconShowlist = [true, false, false];
    sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));
  },

  methods: {
    searchClick() {
      this.page = 1;
      this.getTableData();
    },

    clearForm() {
      // this.$refs.characterMenu.setCheckedKeys([]);
      this.$refs.ruleForm.resetFields();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getRoomTree() {
      let params = {
        typeFlag: 'FITST'
      }
      this.$axiosGet(API.sysmanage_getOrganHouseRoomType, params).then(res => {
        if (res.data) {
          this.roomNoteList = res.data;
          this.parentId = res.data[0].id;
          this.roomName = res.data[0].typeName;
          this.$nextTick(() => {
            this.$refs.tree2.setCurrentKey(1)
          });
          this.getTableData();
        }
      })
    },
    //获取列表信息
    getTableData() {
      let params = {
        typeFlag: 'TWO',
        parentId: this.parentId,
        typeName: this.roomTypeName
      }
      this.$axiosGet(API.sysmanage_getOrganHouseRoomType, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data || [];
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        }
      })
    },
    updateorganName(data) {
      this.typeName = '';
      this.roomName = data.typeName;
      this.parentId = data.id;
      this.getTableData();
    },
    //新增、修改判断
    openCharacterDialog(id, name) {
      this.ruleForm.roomName = this.roomName;
      if (id === 'add') {
        this.titleName = "新增办公用房类型"
        this.ruleForm.roomTypeName = '';
        this.id = '';
      } else {
        this.titleName = "修改办公用房类型"
        this.ruleForm.roomTypeName = name;
        this.id = id;
      }
      this.characterDialogShow = true;
    },
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            typeFlag: 'TWO',
            typeName: this.ruleForm.roomTypeName,
            id:this.id,
            parentId: this.parentId
          }
          this.$axiosJsonPost(API.sysmanage_addOrganHouseRoomType, params).then(res => {
            this.YConfirmShow = false;
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.characterDialogShow = false;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getTableData()
      }
    },
    deleteClick(id) { // 存储删除参数
      this.parentTypeId = id;
      this.YConfirmShow = true;
      this.message = '你确定要删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.parentTypeId
      }
      this.$axiosPost(API.sysmanage_delOrganHouseRoomType, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    // roomDetailInfoClick(id) {
    //   this.$refs.roomDetail.openModal(id);
    // },

  },


};

</script>

<style  lang="scss">
.el-tree-node__expand-icon.is-leaf {
  color: #c0c4cc !important;
}
.data-dictionary-tree {
  .el-tree-node__content {
    padding: 14px 0px;
  }
}

// .el-tree .el-tree-node__expand-icon.expanded {
//   -webkit-transform: rotate(0deg);
//   transform: rotate(0deg);
// }
// .el-tree .el-icon-caret-right:before {
//   background: url("../../../../../public/static/icon/default/dialog/dialog-cavert.png")
//     no-repeat 0 3px;
//   content: "";
//   display: block;
//   width: 18px;
//   height: 18px;
//   font-size: 18px;
//   background-size: 18px;
// }
// .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
//   background: url("../../../../../public/static/icon/default/dialog/dialog-cavert.png")
//     no-repeat 0 3px;
//   content: "";
//   display: block;
//   width: 18px;
//   height: 18px;
//   font-size: 18px;
//   background-size: 18px;
// }
.treeIconStyle .el-tree-node__expand-icon.is-leaf::before {
  display: none;
}
</style>

<style lang="scss" scoped>
</style>
