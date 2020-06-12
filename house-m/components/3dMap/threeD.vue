<template>
  <div style="height: 100%;width: 100%;" id="threeMap">
    <div style="height: 100%;width: 100%;position:absolute;">
      <!-- <iframe src="http://192.168.15.215:9892/Export" id="mobsf" style="height: 100%;width: 100%;" scrolling="no" frameborder="0"></iframe> -->
      <iframe :src="threeUrl" id="mobsf" style="height: 100%;width: 100%;" scrolling="no" frameborder="0"></iframe>
    </div>

    <!-- 楼层列表详情 -->
    <v-floorListDetail ref="floorListDetail" @sendFloor="sendFloor"></v-floorListDetail>
    <!-- 房间列表详情 -->
    <v-roomListDetail ref="roomListDetail"></v-roomListDetail>
    <!-- 分配房间 -->
    <el-dialog title="分配房间" :visible.sync="allocatingRoom" width="30%" @close="clearForm">
      <div>
        <el-form label-position="right" label-width="90px" ref="ruleForm" :model="ruleForm" :rules="rules">
          <el-form-item label="房间号" prop="roomNo">
            <el-input placeholder="请输入房间号" readonly v-model="ruleForm.roomNo"></el-input>
          </el-form-item>
          <el-form-item label="使用单位" prop="useOrgan">
            <el-select placeholder="请选择使用单位" filterable clearable v-model="ruleForm.useOrgan" style="width: 100%;">
              <el-option v-for="(item, index) in useOrganList" :key="index" :label="item.organName" :value="item.organId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分配时间" prop="startTime">
            <el-date-picker type="date" v-model="ruleForm.startTime" placeholder="选择分配时间" :picker-options="pickerOptions0"></el-date-picker>
          </el-form-item>
          <el-form-item label="退房时间" prop="endTime">
            <el-date-picker type="date" v-model="ruleForm.endTime" placeholder="选择退房时间" :picker-options="pickerOptions1"></el-date-picker>
          </el-form-item>
          <el-form-item label="使用方式" prop="useWay">
            <el-select placeholder="请选择使用方式" filterable clearable v-model="ruleForm.useWay" style="width: 100%;">
              <el-option v-for="(item, index) in userModeDic" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="allocating-room-btn" @click="allocatingRoom = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="allocatingRoomClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 房间详情 -->
    <el-dialog title="房间详情" :visible.sync="roomDetail" width="700px">
      <div class="room-detail">
        <table>
          <tr>
            <th>房间号</th>
            <td>{{roomDetailData.roomNo}}</td>
            <th>房间状态</th>
            <td>{{roomDetailData.useStatusName}}</td>
          </tr>
          <tr>
            <th>房间类型</th>
            <td>{{roomDetailData.roomBaseTypes}}</td>
            <th>房间位置</th>
            <td>{{roomDetailData.roomAddress}}</td>
          </tr>
          <tr>
            <th>使用面积</th>
            <td>{{roomDetailData.userArea}}</td>
            <th>建筑面积</th>
            <td>{{roomDetailData.buildArea}}</td>
          </tr>
          <tr>
            <th>使用单位</th>
            <td>{{roomDetailData.useOrganName}}</td>
            <th>使用方式</th>
            <td>{{roomDetailData.userModeName}}</td>
          </tr>
          <tr>
            <th>分配时间</th>
            <td>{{checkTime(roomDetailData.dataAssign)}}</td>
            <th>退房时间</th>
            <td>{{checkTime(roomDetailData.dateCheckOut)}}</td>
          </tr>
          <tr>
            <th>使用部门</th>
            <td>
              <span v-for="(item, index) in roomDetailData.useUsers" :key="index">{{item.userDeptName}}</span>
            </td>
            <th>当前使用人数</th>
            <td>{{roomDetailData.useUsers?roomDetailData.useUsers.length:'0'}}</td>
          </tr>
          <tr>
            <th>使用人</th>
            <td>
              <span v-for="(item, index) in roomDetailData.useUsers" :key="index">{{item.realName}}</span>
            </td>
            <th>使用状态</th>
            <td>{{roomDetailData.useStatusName}}</td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <!-- 取消分配 -->
    <!-- 房间详情 -->
    <el-dialog title="取消分配" :visible.sync="unassignShow" width="700px">
      <div>您确定要取消房间的分配吗？取消分配后无法撤销</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="allocating-room-btn" @click="allocatingRoom = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="cancelAssignClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--消息提示框-->
    <el-dialog title="提示" :visible.sync="YPromptShow" width="700px">
      <div>
        <span class="f-message">
          <span v-if="isBol != null" class="f-message-img">
            <img v-if="isBol" :src="$store.state.imgPath.dialogSuccess" />
            <img v-else :src="$store.state.imgPath.dialogError" />
          </span>
          <span class="f-message-text">{{message}}</span>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn submit-btn" @click="YPromptClick">确定</el-button>
      </span>
    </el-dialog>
    <!-- <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt> -->
  </div>
</template>

<script>
import floorListDetail from '@/components/3dMap/floor-list-detail'; // 楼层列表
import roomListDetail from '@/components/3dMap/room-list-detail'; // 楼层列表
import { setTimeout } from 'timers';

export default {
  data() {
    let self = this;
    return {
      allocatingRoom: false,
      roomDetail: false,
      unassignShow: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      ruleForm: {
        roomNo: '', // 房间号
        useOrgan: '', // 使用单位
        startTime: '', // 分配时间
        endTime: '', // 退房时间
        useWay: '' // 使用方式
      },
      businessId: '',
      useOrganList: [],
      userModeDic: [],
      roomDetailData: {},
      pickerOptions0: {
        disabledDate(time) {
          if (self.ruleForm.endTime) {
            return time.getTime() > self.ruleForm.endTime;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.startTime) {
            return time.getTime() > Date.now() || time.getTime() < self.ruleForm.startTime;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      rules: {
        useOrgan: [
          { required: true, message: '使用单位不能为空', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '分配时间不能为空', trigger: 'change' }
        ]
      },
      ws: null
    }
  },
  computed: {
    threeUrl() {
      return this.$store.state.mainData.threeUrl;
    }
  },
  components: {
    'v-floorListDetail': floorListDetail,
    'v-roomListDetail': roomListDetail
  },
  activated() {
    this.creatWebSocket()
    this.getOrganList();
  },
  methods: {
    checkTime(value) {
      if (value) {
        // return DATEFORMAT.dateReturn(new Date(value))
        return value.substr(0,10)
      }
    },
    creatWebSocket() {
      // this.ws = new WebSocket(`${LINKPATH.linkPath().webScoketPath}/webSocket/fromWeb${sessionStorage.getItem('userId')}`);
      this.ws.onopen = () => {
        this.ws.send("open");
      };
      this.ws.onmessage = (evt) => {
        let data = JSON.parse(evt.data)
        if (data.command == 'floorDetail') {
          this.$refs.floorListDetail.openModal(data.businessId, this.ws);
        } else if (data.command == 'assign') {
          this.allocatingRoom = true;
          this.businessId = data.businessId;
          this.getRoomDetail();
        } else if (data.command == 'roomDetail') {
          this.roomDetail = true;
          this.businessId = data.businessId;
          this.getRoomDetail();
        } else if (data.command == 'storeysDetail') {
          this.$refs.roomListDetail.openModal(data.businessId);
        } else if (data.command == 'cancelaAssign') {
          this.businessId = data.businessId;
          this.unassignShow = true;
        }
      };
    },
    allocatingRoomClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            roomIdList: JSON.stringify([this.businessId]),
            organId: this.ruleForm.useOrgan,
            dateAssign: DATEFORMAT.dateReturn(this.ruleForm.startTime),
            dateCheckOut: DATEFORMAT.dateReturn(this.ruleForm.endTime),
            userMode: this.ruleForm.useWay
          }
          this.$axiosPost(API.room_assign, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YPromptShow = true;
          })
          this.allocatingRoom = false;
        }
      })
    },
    cancelAssignClick() {
      let params = {
        roomIdList: JSON.stringify([this.businessId])
      }
      this.$axiosPost(API.room_cancelAssign, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.unassignShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })
    },
    getOrganList() {
      this.$axiosGet(API.room_getAssignSelect, {}).then(res => {
        if (res.result == 'success') {
          this.useOrganList = res.data.useOrganList;
          this.userModeDic = res.data.userModeDic;
        }
      })
    },
    getRoomDetail() {
      let params = {
        roomId: this.businessId
      }
      this.$axiosPost(API.room_3dRoomDetail, params).then(res => {
        if (res.result == 'success') {
          this.roomDetailData = res.data;
          this.ruleForm.roomNo = this.roomDetailData.roomNo;
        }
      })
    },
    sendFloor(data) {
      this.ws.send('stringInfo')
      let stringInfo = `fromWeb:${sessionStorage.getItem('userId')}:toStoreys:${data.floorId}_${data.storeysId}`
      setTimeout(() => {
        this.ws.send(stringInfo)
      }, 1000)
    },
    YPromptClick() {
      this.YPromptShow = false;
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();

    }
  }
}
</script>

<style lang="scss">
#threeMap {
  .el-dialog__header {
    background-color: #1f74c5;
    .el-dialog__title {
      color: #fff;
    }
  }
  .el-dialog__body,
  .el-dialog__footer {
    .el-form-item__label {
      color: #fff;
    }
    .el-input__inner {
      background-color: #202122;
      border: 1px solid #fff;
      color: #fff;
    }
    background-color: #202122;
    .allocating-room-btn {
      background-color: #202122;
      padding: 8px 15px;
      color: #fff;
    }
  }
  .el-form-item.is-required:not(.is-no-asterisk)
    .el-form-item__label-wrap
    > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    color: #fff;
  }
  .room-detail {
    th,
    td {
      padding: 8px 15px;
      border: 1px solid #fff;
      color: #fff;
      font-weight: normal;
      text-align: left;
    }
    th {
      background: #323941;
      text-align: right;
      width: 90px;
    }
  }
}
</style>

