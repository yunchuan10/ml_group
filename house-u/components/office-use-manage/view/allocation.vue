<template>
  <div>
    <el-dialog title="使用分配" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" @close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="right">
        <el-form-item label="房间号">
          <span>{{ruleForm.roomNo}}</span>
        </el-form-item>
        <el-form-item label="房间面积">
          <span>{{ruleForm.roomArea ? ruleForm.roomArea+'㎡': ''}}</span>
        </el-form-item>
        <el-form-item class="f-relative backStyinput" label-width="0">
          <el-form-item prop="roomType" class="f-absolute" label="房间类型" style="width: calc(100% - 20px)">
            <el-input clearable v-model="ruleForm.roomType" disabled placeholder="请选择房间类型">
              <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
            </el-input>
          </el-form-item>
          <a @click="openRoomType" style="position:relative;display: block;width: 100%;height:40px;"></a>
        </el-form-item>
        <el-form-item label="房间名称" prop="roomName">
          <el-input v-model="ruleForm.roomName" style="width:97%;"></el-input>
        </el-form-item>

        <!-- <div class="h-table f-relative" v-if=" this.roomTypeIdList.includes('OFFICEHOUSE')"> -->
        <div class="h-table f-relative">
          <div class="f-hidden padding10">
            <div class="f-pull-left lineHight">当前使用人数{{list.length}}人</div>
            <div class="f-pull-right">
              <el-button class="padding6 current" @click="openPersonModal">添加</el-button>
            </div>
          </div>
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>

            <el-table-column prop="useClientStatusName" label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.nodeName||scope.row.name||scope.row.label}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="dutiesLevelName" label="职务级别">
            </el-table-column>
            <!-- <el-table-column prop="dutyName" label="职务名称">
            </el-table-column> -->
            <el-table-column prop="deptName" label="所在部门">
            </el-table-column>
            <!-- <el-table-column prop="dateCreated" label="分配时间">
            </el-table-column> -->
            <el-table-column fixed="right" prop="operation" label="操作">
              <template slot-scope="scope">
                <a @click="deleteClick(scope.row.id)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getCheck">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加人员" custom-class="h-dialog-add" :visible.sync="dialogPersonVisible" width="730px" :before-close="cancelUserList">
      <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1">
        <div class="el-row-padding">
          <el-row>
            <el-button plain @click="dptClick('depart')" :class="{'current':pageSelect=='depart'}">部门</el-button>
            <el-button plain @click="dptClick('official')" :class="{'current':pageSelect=='official'}">职务级别</el-button>
          </el-row>
        </div>
        <div class="f-hidden">
          <div class="f-pull-left person-box">
            <h2> 未选人员</h2>
            <div class="padding10">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree class="filter-tree" :data="dataList" node-key="id" @check="getCheckedNodes" show-checkbox :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
              </el-tree>
            </div>
          </div>
          <div class="f-pull-right person-box">
            <h2>已选人员</h2>
            <ul class="selectionPerson">
              <li v-for="(item,index) in selectNodeList" :key="index">{{item.nodeName}}</li>
            </ul>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserList" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="getUserLIst">保存</el-button>
      </div>
    </el-dialog>
    <!--保存确认弹框 -->
    <el-dialog title="提示" :visible.sync="savedialogVisible" width="30%">
      <span>检测到当前房间使用超标，确定保存吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savedialogVisible = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="getSave" :loading="loading">确定</el-button>
      </span>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--房间弹框-->
    <v-roomType ref="roomType" @getNode="getNode"></v-roomType>
  </div>
</template>

<script>
import roomType from '@/components/office-use-manage/view/room-chose-roomtype'; // 选择房间弹出框
export default {
  components: {
    'v-roomType': roomType
  },
  data() {
    let validateType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择房间类型'));
      } else if (value.length > 0) {
        callback();
      }
    };
    // let validateRoomName = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请填写房间名称'));
    //   } else if (value) {
    //     callback();
    //   }
    // };
    return {
      organId: '',
      edit: '',
      savedialogVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      dialogPersonVisible: false,
      dialogFormVisible: false,
      isOfficeHouse: false,
      loading: false,
      isCheck: false, //判断是否超标
      dutiesLevelKey: '', //职务级别
      dutiesLevelName: '', //职务名称
      userIds: [], //用户id集合
      distrtime: '', //分配时间
      filterText: '',
      dataList: [],
      ruleForm1: {},
      list: [],
      selectNodeList: [], //获取节点信息 
      deleteId: '', //删除id
      pageSelect: 'depart',
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      ruleForm: {
        roomId: '',
        roomArea: '', //房间面积
        roomType: '', //房间类型
        roomNo: '', // 房间号
        roomName: '', //房间名称
        courtyardName: '',  // 院落名称
        storeysName: '', //楼层数量
        floorname: '', // 楼座名称
        downStoreysNum: '', //	楼层范围最小值
        upStoreysNum: '', //楼层范围最大值
      },
      roomTypeIdList: [], //房间类型id集合
      houseRoomlist: [], //房间集合
      originSelectNodeList: [], // 每次打开添加人员弹出框缓存的选择人员数据
      roomCheckList: [], // 已选择的房屋类型集合
      roomTypeList: [],
      selectOriginNodeList: [], // 详情返回的选择节点list，存储用来遍历
      rules: {
        roomType: [
          { required: true, validator: validateType, trigger: 'change' }
        ],
        // roomName: [
        //   { required: true, validator: validateRoomName, trigger: 'change' }
        // ],
      }
    };
  },
  activated() {
    this.pageSelect = 'depart';
    this.ruleForm.roomName = ''
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  methods: {
    // 初始化弹出框
    openModal(id, organId, edit) {
      if(organId) {
        this.organId = organId;
      }
      if(edit) {
        this.edit = edit;
      }
      this.dialogFormVisible = true;
      this.ruleForm.roomId = id;
      this.selectNodeList = [];
      this.roomTypeList = [];
      this.list = [];
      this.getDetail()
    },

    // 添加按钮弹框
    openPersonModal() {
      this.pageSelect == 'depart';
      this.originSelectNodeList = this.selectNodeList;
      this.selectNodeList = this.list;
      this.getPersonTree();
      this.dialogPersonVisible = true;
    },
    // 获取详情
    getDetail() {
      this.roomCheckList = [];  // 已选择的房屋类型清空查询获取
      let params = {
        roomId: this.ruleForm.roomId
      }
      this.$axiosGet(API.useManage_roomDetail, params).then(res => {
        this.houseRoomlist = res.data;
        this.ruleForm.roomNo = this.houseRoomlist.roomNo;
        this.ruleForm.roomType = this.houseRoomlist.roomUseNameString || '';
        this.ruleForm.roomName = this.houseRoomlist.name;
        this.ruleForm.roomArea = this.houseRoomlist.useArea;
        // this.distrtime = res.data.
        this.selectNodeList = [];
        if (res.data.useUserList.length > 0) {
          res.data.useUserList.forEach((item, index) => {
            item.dateAssign = item.dateAssign||'';
            if( item.staffId ){     // 避免有问题有staffId才收集
              this.selectNodeList.push({
                id: item.staffId||'',
                value: item.staffId||'',
                label: item.realName,
                nodeName: item.nodeName||item.realName,
                children: null,
                deptName: item.deptName,
                dutiesLevelName: item.dutiesLevelName,
                dutyName: item.dutyName,
                realName: item.realName||item.nodeName,
                nodeName: item.nodeName||item.realName,
                nodeType: "staff",
                dateCreated: item.dateAssign.substr(0, 10)
                // dateCreated: DATEFORMAT.dateReturn(new Date(item.dateAssign))
              })
            }
          })
          this.selectOriginNodeList = this.selectNodeList;
          this.list = this.selectNodeList;
        } else {
          this.list = []
        }
        this.roomTypeIdList = [];
        this.houseRoomlist.roomTypeList.forEach((item, index) => {
          this.roomCheckList.push({
            children: null,
            label: item.roomTypeName,
            typeFlag: item.typeFlag,
            value: item.roomTypeId
          });
          if (item.typeFlag === 'TWO') {
            this.roomTypeList.push({
              children: null,
              label: item.roomTypeName,
              typeFlag: item.typeFlag,
              value: item.roomTypeId
            });
          }
          this.roomTypeIdList.push(item.roomTypeId)
        })
        let item = this.roomCheckList.find(item => {
          return item.value == 'OFFICEHOUSE';
        });
        if (item) {
          this.isOfficeHouse = true;
        } else {
          this.isOfficeHouse = false;
        }
      })
    },

    // 添加人员信息里的tab切换
    dptClick(type) {
      this.pageSelect = type;
      this.dataList = [];
      this.getPersonTree();
    },
    //根据部门获取人员信息
    getPersonTree() {
      let params = {
        roomId: this.ruleForm.roomId,
        type: this.edit,
        useOrganId: this.organId || ''
      };
      let url = '';
      if (this.pageSelect == 'depart') {
        //区分部门
        url = API.useManage_getOrganTree;
      } else {
        // 区分职级职别
        url = API.useManage_getDutyTree;
      }
      this.$axiosGet(url, params).then(res => {
        if( Array.isArray(res.data) ){
          this.dataList = res.data;
        }else{
          this.dataList = [res.data];
        }
        this.userIds = [];
        this.selectNodeList.forEach((item, index) => {
          this.userIds.push(item.id||item.value);
        })
        this.$refs.tree2.setCheckedKeys(this.userIds);
      })
    },
    //获取树型节点信息
    getCheckedNodes() {
      let selectList = [];
      this.$refs.tree2.getCheckedNodes(false, false).forEach((item, index) => {
        if (item.nodeType === "staff" || item.typeFlag == 'person') {
          item.dutiesLevelName = item.dutiesLevelName || item.dutyLevelName;
          selectList.push(item);
        }
      });
      selectList.forEach((itemI, indexI) => {
        this.selectOriginNodeList.forEach((itemJ, indexJ) => {
          if (itemI.id == itemJ.id) {
            itemI.dateCreated = itemJ.dateCreated.substr(0, 10);
          } else {
            // itemI.dateCreated = DATEFORMAT.dateReturn(new Date());
            itemI.dateCreated = ''
          }
        })
      })
      this.selectNodeList = selectList;
    },
    filterNode(value, data) {
      let res = false, name=data.nodeName||data.name||data.label||'';
      if(!value) {
        res = true;
      }else if( name && name.indexOf && name.indexOf(value) !== -1 ){
        res = true;
      }
      return res;
    },
    // 点击取消人员选择之前的数据
    cancelUserList() {
      this.selectNodeList = this.originSelectNodeList;
      this.dialogPersonVisible = false;
    },
    //验证是否超标
    getCheck() {
      let userIds = []
      this.selectNodeList.forEach((item, index) => {
        userIds.push(item.id||item.value)
      })
      let roomTypeId = [];
      this.roomCheckList.forEach((item, index) => {
        roomTypeId.push(item.value);
      })
      let params = {
        useOrganId: this.organId || '',
        staffIdList: userIds,
        roomId: this.ruleForm.roomId,
        roomTypeIdList: roomTypeId, //房间类型
      }
      this.$axiosJsonPost(API.useManage_assignCheck, params).then(res => {
        if (res.result === 'success') {
          this.getSave();
        } else {
          this.savedialogVisible = true;
        }
      })
    },

    //使用分配保存按钮
    getSave() {
      let ispass = false;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          
          let roomTypeId = [];
          this.roomCheckList.forEach((item, index) => {
            roomTypeId.push(item.value);
          })
          let userIds = []
          this.selectNodeList.forEach((item, index) => {
            userIds.push(item.id||item.value)
          })
          let params = {
            useOrganId: this.organId || '',
            // userIdList: userIds,
            roomId: this.ruleForm.roomId,
            roomName: this.ruleForm.roomName || '', //房间名称
            staffIdList: userIds,
            roomTypeIdList: roomTypeId, //房间类型
          }
          this.loading = true;
          this.$axiosJsonPost(API.useManage_assign, params).then(res => {
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.loading = false;
            this.savedialogVisible = false;
            this.dialogFormVisible = false;
            this.YPromptShow = true;
          })
        }
      })
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$emit('requestData')
        }
      }, 1000)
    },
    //详情
    openRoomType() {
      this.$refs.roomType.openModal(this.roomTypeList, this.organId);
    },
    //删除人员信息
    deleteClick(deleteId) {
      if( !deleteId ) {
        return;
      }
      this.list.forEach((item, index) => {
        if (item.id == deleteId) {
          this.list.splice(index, 1);
        }
      })
    },
    //保存人员信息
    getUserLIst() {
      this.dialogPersonVisible = false;

      let list = this.selectNodeList.map( item => {
        item.dutiesLevelName = item.dutiesLevelName || item.dutyLevelName;
        return item;
      })
      this.list = list;
      let time = new Date();
    },
    //房间类型的选择框
    getNode(val) {
      this.isOfficeHouse === false;
      if (val) {
        val.forEach((item, index) => {
          if (item.value == 'OFFICEHOUSE') {
            this.isOfficeHouse = true;
          }
        })
        // let item = val.find(item => {
        //   return item.value == 'OFFICEHOUSE';
        // });
        // if (item) {
        //   this.isOfficeHouse = true;
        // }
        this.roomCheckList = val;
        this.roomTypeList = [];
        let roomType = '';
        // if (val.length === 2) {
        //   if (val[0].label === '办公室') {
        //     if (val[1].label === '请选择') {
        //       this.ruleForm.roomType = '办公室';
        //     } else {
        //       this.ruleForm.roomType = `${val[0].label}（${val[1].label}）`
        //     }
        //   } else {
        //     this.ruleForm.roomType = `${val[0].label}（${val[1].label}）`
        //   }
        //   this.roomTypeList.push(val[1]);
        // } else {
        //   val.forEach((item, index) => {
        //     if (item.typeFlag === 'TWO') {
        //       roomType += item.label + '，'
        //       this.roomTypeList.push(item);
        //     }
        //   })
        //   this.ruleForm.roomType = roomType.substr(0, roomType.length - 1);
        // }
        this.roomTypeIdList = [];
        val.forEach((item, index) => {
          if (item.typeFlag === 'TWO') {
            roomType += item.label + '，'
            this.roomTypeList.push(item);
          }
          this.roomTypeIdList.push(item.value)
        })
        this.ruleForm.roomType = roomType.substr(0, roomType.length - 1);
      }
    },
    resetForm() {
      this.selectNodeList = [];
      this.roomTypeList = [];
      this.isOfficeHouse === false;
      this.$refs.ruleForm.resetFields();
    }
  }
}
</script>
<style lang="scss" scoped>
.h-dialog-add-select {
  width: 477px;
}
.el-form-nobottom {
  margin-bottom: 0;
}
.el-select {
  display: inline-block;
}
.padding10 {
  padding: 10px;
}
.person-box {
  margin: 15px 0;
  width: 300px;
  height: 400px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
}
.person-box h2 {
  background: #f3f6fd;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  border-bottom: 1px solid #dcdfe6;
}
.selectionPerson {
  overflow: hidden;
  padding: 10px;
}
.selectionPerson li {
  line-height: 30px;
  display: inline-block;
  box-sizing: border-box;
  width: 80%;
}
.lineHight {
  line-height: 28px;
}
</style>
<style  lang="scss">
.backStyinput .el-input__inner {
  background-color: #fff !important;
}
</style>
