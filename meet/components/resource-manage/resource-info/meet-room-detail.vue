<template>
  <div>
    <zl-rightDialog v-model="meetRoomShow" width="700px">
      <template v-slot:title>{{title}}</template>
      <div class="meet-room-detail-box" v-if="ruleForm">
<!--        <viewer :images="ruleForm.attachmentList">-->
<!--          <img v-for="(img, imgIndex) in ruleForm.attachmentList" :key="imgIndex" v-show="img.attachUrl" :src="img.attachUrl" style="width:120px;height:100px;margin:5px;" />-->
<!--        </viewer>-->

        <el-carousel height="300px" :autoplay="true" >
          <el-carousel-item v-for="item in ruleForm.attachmentList" :key="item">
            <img :src="item.attachUrl" alt="" style="width: 100%; height: 100%" />
          </el-carousel-item>
        </el-carousel>

        <div class="meet-text">
          <h2 class="name">{{ruleForm.name ? ruleForm.name : ''}}</h2>
          <p class="infor">
            <span>容纳：{{ruleForm.capacity}} </span><span class="line">|</span>
            <span>面积：{{ruleForm.area}} m² </span><span class="line">|</span>
            <span>设备: {{ruleForm.equip}}</span>
          </p>
          <p class="infor">地点：{{ruleForm.address}}</p>
          <p class="infor">备注：{{ruleForm.remark}}</p>
        </div>
      </div>
    </zl-rightDialog>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      dateReturnYMD: DATE.dateReturnYMD,
      organizerMap: { IN: '本单位', OUT: '外单位' },
      beginMap: { MORNING: '上午', AFTERNOON: '下午', NIGHT: '晚上' },
      secrecyLevelMap: { YES: '保密', NO: '非保密' },
      videoTypeMap: { ONE: '高清', TWO: '标清', ZERO: '不使用' },
      generalPlatformMap: { YES: '课桌式', NO: '圆桌式' },
      meetRoomShow: false, // 弹出框开关
      title: '', // 弹出框标题

      ruleForm: null,   //订单详情数据
      orderId:'', //订单ID
      deptList: [], // 部门列表
      userList: [], // 人员列表
      roomInfoImgList: [], // 会议室列表
      roomInfoListDetail: [], // 会议室列表

    };
  },
  activated(){

  },
  computed:{
    ...mapState('testData',[
      'applyDataList'
    ])
  },
  methods: {
    // 初始化弹出框
    openModal(id, type) {
      this.meetRoomShow = true;
      this.getDataRequest(id);
    },

    // 获取详情数据
    getDataRequest(id) {
      let params = {
        id: id
      };
      this.$axiosGet(API.roomInfo_roomInfoDetail, params).then(res => {
        if(res.status === 200){
          this.ruleForm = res.data;
          this.roomInfoImgList = res.data.attachImg ? res.data.attachImg.split(',') : [];
        }
      })
      // vuex测试数据
      // let meetTestDataList = this.applyDataList;
      // this.ruleForm = meetTestDataList

    },
  },
};
</script>

<style lang="scss" scoped>
.h-tab-box{
    padding: 0 15px 15px;
}
/deep/.el-carousel__button{
  background: #fff !important;
}
/deep/.el-carousel__arrow{
  background-color: rgba(0,0,0,0.4);
}
.meet-room-detail-box{
  padding: 15px;
  .meet-text{
    .name{
      margin-top: 25px;
      color: #333;
      font-size: 16px;
    }
    .infor{
      margin-top: 15px;
      color: #666;
      font-size: 14px;
      .line{
        padding: 0 15px;
        color: #DCDFE6;
      }
    }
  }
}
</style>

