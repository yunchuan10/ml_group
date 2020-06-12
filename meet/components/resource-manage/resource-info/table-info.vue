<template>
  <div class="reception-wrap">
    <div class="reception-data clear">
      <!-- 图片数据展示 -->
      <div class="img-text-wrap f-pull-left" style="width: 360px;" v-for="(recep, index) in reception" :key="index">
        <div class="img-text">
          <img style="width: 360px;height:230px;" :src="recep.picture" @mouseenter="imgEnter(index)" @mouseleave="imgLeave()" :class="{activeImg:index == isActive}">
          <span>{{recep.meetingName ? recep.meetingName : ''}}</span>
        </div>
        <!-- 鼠标hover效果 -->
        <div class="hide-info" :class="{hideImg:index == hoverInfo}" @mouseenter="hideEnter(index)" @mouseleave="hideLeave()">
          <span v-for="(item, index) in eventList" :key="index">
            <span v-show="item.name === 'detail'" class="detail-info" @click="eventClick(recep.id, 'detail')">
              <img :src="$store.state.imgPath.picDetail">
              <span>{{item.title}}</span>
            </span>
            <!-- 修改 -->
            <span v-show="item.name === 'edit'" class="detail-edit" @click="eventClick(recep.id, 'edit')">
              <img :src="$store.state.imgPath.picEdit">
              <span>{{item.title}}</span>
            </span>
            <!-- 删除 -->
            <span v-show="item.name === 'delete'" class="detail-delete" @click="eventClick(recep.id, 'delete')">
              <img :src="$store.state.imgPath.picDelete">
              <span>{{item.title}}</span>
            </span>
            <!-- VR全景 -->
            <!-- <span v-show="item.name === 'vr'" class="detail-vr">
              <img :src="$store.state.imgPath.picVr">
              <span>VR全景</span>
            </span> -->
          </span>
          <!-- 详情 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * reception 图表数据
   * eventList 组件事件集合
   */
  props: ['reception', 'eventList'],
  data() {
    return {
      hoverInfo: null,
      isActive: null // 鼠标移入移除图片改变状态
    };
  },
  activated() { },
  computed: {},
  methods: {
    // 鼠标移入
    imgEnter(index) {
      this.isActive = index;
      this.hoverInfo = index;
    },
    // 鼠标移出
    imgLeave() {
      this.isActive = null;
      this.hoverInfo = null;
    },
    // 图标鼠标移入
    hideEnter(index) {
      this.isActive = index;
      this.hoverInfo = index;
    },
    // 图标鼠标移出
    hideLeave() {
      this.isActive = null;
      this.hoverInfo = null;
    },
    // 点击详情
    eventClick(id, eventName) {
      let data = {
        id: id,
        eventName: eventName
      }
      this.$emit('onEvent', data);
    },
  }
};
</script>

<style lang="scss">
.img-text-wrap {
  position: relative;
  margin: 0 0.85% 15px 0.85%;
  width: 23%;
  height: 280px;
  box-shadow:0px 2px 10px rgba(125,126,126,0.15);
}
.img-text {
  img {
    width: 100%;
    cursor: pointer;
  }
  span {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    display: inline-block;
    font-size: 16px;
  }
}
// 图片hover特效
.activeImg {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  opacity: 0.8;
  transition: opacity 0.4s;
}
// 图片hover展示的图标与文字
.hide-info {
  position: absolute;
  top: 0;
  width: 100%;
  height: 82%;
  display: none;
  text-align: center;
  .detail-info,
  .detail-edit,
  .detail-delete,
  .detail-vr {
    width: 17%;
    margin: 20% 5% 0;
    display: inline-block;
    cursor: pointer;
    span {
      display: block;
      text-align: center;
      padding-top: 10px;
      color: #fff;
      font-size: 16px;
    }
  }
  img {
    width: 100%;
    max-width: 60px;
  }
}
// 图片hover展示图标
.hideImg {
  display: block;
  background-color: rgba(0,0,0,0.5);
}
.clear:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clear {
  zoom: 1;
}
</style>

