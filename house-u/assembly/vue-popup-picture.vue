<!--自定义图片控件-->
<template>
  <div style="width: 100%;">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="800px">
      <div class="modal col-xs-12" id="pictureImgModal" aria-hidden="true" v-scroll>
        <div class="modal-dialog pictureImg-div">
          <div id="pictureImgModal-div" style="position: absolute; width: 100%; height: 100%; background-color: #000000; opacity: 0.8;"></div>
          <div style="position: absolute; top: 0; right: 0; z-index: 999999;">
            <el-button type="primary" @click.native="pictureImgModalClick" class="pictureImgModal-button" style="border-radius: 0;opacity: 0.5;"><i class="fa fa-close"></i></el-button>
          </div>
          <div v-if="pictureUrl.length > 1" style="position:absolute;top:calc(50% - 50px);left:0;z-index:999999;font-size:50px;background-color:#000;opacity:0.5;">
            <el-button type="primary" @click.native="leftSide" class="pictureImgModal-sideEdgeButton">
              <i class="el-icon-arrow-left" style="color:#fff;line-height: 1.5;"></i>
            </el-button>
          </div>
          <div v-if="pictureUrl.length > 1" style="position:absolute;top:calc(50% - 50px);right:0;z-index:999999;font-size:50px;background-color:#000;opacity:0.5;">
            <el-button type="primary" @click.native="rightSide" class="pictureImgModal-sideEdgeButton">
              <i class="el-icon-arrow-right" style="color:#fff;line-height: 1.5;"></i>
            </el-button>
          </div>
          <div style="position: absolute; bottom: 0; width: 100%; text-align: center; background-color: #000000; opacity: 0.5; z-index: 999999;">
            <el-button type="primary" @click.native="rightRotate" class="pictureImgModal-button"><i class="fa fa-repeat"></i></el-button>
            <el-button type="primary" @click.native="leftRotate" class="pictureImgModal-button"><i class="fa fa-rotate-left"></i></el-button>
          </div>
          <img id="pictureUrl" v-show="isPictureUrl" @load="imageLoaded(true)" v-drag :src="pictureUrl[index]" :style="{transform: 'rotate(' + isRotate + 'deg)', width: pictureWidth, height: pictureHeight, left: pictureLeft, top: pictureTop}" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data() {
    return {
      dialogVisible: false,
      isPictureUrl: false, // 图片隐藏
      pictureWidth: 'auto', // 图片宽度
      pictureHeight: 'auto', // 图片高度
      pWidth: 0, // 图片宽度缓存
      pHeight: 0, // 图片高度缓存
      initWidth: 0, // 图片初始宽度
      initHeight: 0, // 图片初始高度
      pictureLeft: '0px', // 图片左距离
      pictureTop: '0px', // 图片上距离
      PLeft: 0, // 图片左距离缓存
      PTop: 0, // 图片上距离缓存
      pictureUrl: [], // 图片
      index: 0, // 图片位置
      isRotate: 0 // 旋转状态
    }
  },
  activated() {
    this.pictureUrl = []
    this.isPictureUrl = false // 初始图片隐藏
  },
  methods: {
    leftSide() { // 图片左侧切换
      if (this.index > 0) {
        this.reset()
        this.index--
      }
    },
    rightSide() { // 图片右侧切换
      if (this.index < this.pictureUrl.length - 1) {
        this.reset()
        this.index++
      }
    },
    reset() { // 清空重置
      this.isPictureUrl = false // 图片隐藏
      this.pictureWidth = 'auto' // 图片宽度
      this.pictureHeight = 'auto' // 图片高度
      this.pWidth = 0 // 图片宽度缓存
      this.pHeight = 0 // 图片高度缓存
      this.initWidth = 0 // 图片初始宽度
      this.initHeight = 0 // 图片初始高度
      this.pictureLeft = '0px' // 图片左距离
      this.pictureTop = '0px' // 图片上距离
      this.PLeft = 0 // 图片左距离缓存
      this.PTop = 0 // 图片上距离缓存
      this.isRotate = 0 // 旋转状态
    },
    pictureImgModal(urls, index = 0) { // 显示图片
      this.pictureUrl = [];
      this.reset(); // 重置
      this.index = index
      setTimeout(() => {
        if (urls.length > 0) {
          if (Array.isArray(urls)) {
            this.pictureUrl = urls
          } else {
            this.pictureUrl = [urls]
          }
        }
      }, 0)
      this.isRotate = 0;
      // $('#pictureImgModal').modal({ backdrop: false, keyboard: 'static' })
      // $('#pictureImgModal').modal({ backdrop: false, keyboard: false })
      this.dialogVisible = true;
    },
    imageLoaded(is) { // 图片加载完成后的回调
      if (is) {
        this.initWidth = this.pWidth = document.getElementById('pictureUrl').width
        this.initHeight = this.pHeight = document.getElementById('pictureUrl').height
      } else {
        this.initHeight = this.pHeight = document.getElementById('pictureUrl').width
        this.initWidth = this.pWidth = document.getElementById('pictureUrl').height
      }
      this.pictureCenter(is) // 设置图片居中
      this.isPictureUrl = true // 显示初始图片
    },
    pictureCenter(is) { // 设置图片居中
      let OWidth = 0
      let OHeight = 0
      if (is) {
        OWidth = document.getElementById('pictureImgModal').offsetWidth - this.pWidth
        OHeight = document.getElementById('pictureImgModal').offsetHeight - this.pHeight
      } else {
        OWidth = document.getElementById('pictureImgModal').offsetHeight - this.pWidth
        OHeight = document.getElementById('pictureImgModal').offsetWidth - this.pHeight
      }
      if (OWidth > 0) { // 宽度居中
        if (OHeight > 0) {
          this.PLeft = OWidth / 2
          this.PTop = OHeight / 2
          this.pictureLeft = `${OWidth / 2}px`
          this.pictureTop = `${OHeight / 2}px`
        } else {
          this.OHeightCalculation(is) // 计算高度最大值
        }
      } else if (OHeight > 0) {
        this.OHeightCalculation(is) // 计算高度最大值
      } else {
        this.OWidthCalculation(is) // 计算宽度最大值
      }
    },
    OWidthCalculation(is) { // 计算宽度最大值
      let OWidth = 0
      if (is) {
        OWidth = this.pWidth - document.getElementById('pictureImgModal').offsetWidth
      } else {
        OWidth = this.pWidth - document.getElementById('pictureImgModal').offsetHeight
      }
      this.pWidth = this.pWidth - OWidth
      this.pictureWidth = `${this.pWidth}px`
      this.pictureHeight = `auto`
      setTimeout(() => {
        if (is) {
          this.pHeight = document.getElementById('pictureUrl').offsetHeight
        } else {
          this.pHeight = document.getElementById('pictureUrl').offsetWidth
        }
        this.pictureHeight = `${this.pHeight}px`
        let OHeights = 0
        if (is) {
          OHeights = document.getElementById('pictureImgModal').offsetHeight - this.pHeight
        } else {
          OHeights = document.getElementById('pictureImgModal').offsetWidth - this.pHeight
        }
        if (OHeights < 0) {
          this.OHeightCalculation(is) // 计算高度最大值
        } else {
          this.PLeft = 0
          this.PTop = OHeights / 2
          this.pictureLeft = 0
          this.pictureTop = `${this.PTop}px`
        }
      }, 0)
    },
    OHeightCalculation(is) { // 计算高度最大值
      let OHeight = 0
      if (is) {
        OHeight = this.pHeight - document.getElementById('pictureImgModal').offsetHeight
      } else {
        OHeight = this.pHeight - document.getElementById('pictureImgModal').offsetWidth
      }
      this.pHeight = this.pHeight - OHeight
      this.pictureHeight = `${this.pHeight}px`
      this.pictureWidth = `auto`
      // 重新设置宽度对齐
      setTimeout(() => {
        if (is) {
          this.pWidth = document.getElementById('pictureUrl').offsetWidth
        } else {
          this.pWidth = document.getElementById('pictureUrl').offsetHeight
        }
        this.pictureWidth = `${this.pWidth}px`
        let OWidths = 0
        if (is) {
          OWidths = document.getElementById('pictureImgModal').offsetWidth - this.pWidth
        } else {
          OWidths = document.getElementById('pictureImgModal').offsetHeight - this.pWidth
        }
        this.PLeft = OWidths / 2
        this.PTop = 0
        this.pictureLeft = `${this.PLeft}px`
        this.pictureTop = 0
      }, 0)
    },
    rightRotate() { // 右旋转
      this.isRotate += 90
      setTimeout(() => {
        if (this.isRotate / 90 % 2 === 0) {
          this.imageLoaded(true)
        } else {
          this.imageLoaded(false)
        }
      }, 0)
    },
    leftRotate() { // 左旋转
      this.isRotate -= 90
      setTimeout(() => {
        if (this.isRotate / 90 % 2 === 0) {
          this.imageLoaded(true)
        } else {
          this.imageLoaded(false)
        }
      }, 0)
    },
    pictureImgModalClick() { // 关闭图片
      this.pictureUrl = []
      this.pictureWidth = 'auto'
      this.pictureHeight = 'auto'
      this.dialogVisible = false;
    }
  }
}

// 自定义指令-鼠标滚动
Vue.directive('scroll', {
  inserted: (el, binding, vnode) => {
    el.addEventListener('mousewheel', e => { // 鼠标滚动事件
      if (e.wheelDelta > 0) {
        if (vnode.context.pWidth / 2 - 150 > 0 && vnode.context.pHeight / 2 - 150 > 0) {
          vnode.context.pictureWidth = `${vnode.context.pWidth = vnode.context.pWidth / 2}px`
          vnode.context.pictureHeight = `${vnode.context.pHeight = vnode.context.pHeight / 2}px`
          vnode.context.pictureLeft = `${vnode.context.PLeft += vnode.context.pWidth / 2}px`
          vnode.context.pictureTop = `${vnode.context.PTop += vnode.context.pHeight / 2}px`
          if (vnode.context.PLeft + 150 > document.getElementById('pictureImgModal').offsetWidth) {
            if (vnode.context.pWidth > document.getElementById('pictureImgModal').offsetWidth) {
              vnode.context.pictureLeft = vnode.context.PLeft = 0
            } else {
              vnode.context.PLeft = (document.getElementById('pictureImgModal').offsetWidth - vnode.context.pictureWidth) / 2
              vnode.context.pictureLeft = `${vnode.context.PLeft}px`
            }
          } else if (vnode.context.PLeft + vnode.context.pWidth < 150) {
            vnode.context.PLeft = document.getElementById('pictureImgModal').offsetWidth - vnode.context.pWidth
            vnode.context.pictureLeft = `${vnode.context.PLeft}px`
          }
          if (vnode.context.PTop + 150 > document.getElementById('pictureImgModal').offsetHeight) {
            if (vnode.context.pHeight > document.getElementById('pictureImgModal').offsetHeight) {
              vnode.context.pictureTop = vnode.context.PTop = 0
            } else {
              vnode.context.PTop = (document.getElementById('pictureImgModal').offsetHeight - vnode.context.pictureHeight) / 2
              vnode.context.pictureTop = `${vnode.context.PTop}px`
            }
          } else if (vnode.context.PTop + vnode.context.pHeight < 150) {
            vnode.context.PTop = document.getElementById('pictureImgModal').offsetHeight - vnode.context.pHeight
            vnode.context.pictureTop = `${vnode.context.PTop}px`
          }
        }
      } else if (e.wheelDelta < 0) {
        if (vnode.context.pWidth - (vnode.context.initWidth * 3) < 0 && vnode.context.pHeight - (vnode.context.initHeight * 3) < 0) {
          vnode.context.pictureWidth = `${vnode.context.pWidth = vnode.context.pWidth * 2}px`
          vnode.context.pictureHeight = `${vnode.context.pHeight = vnode.context.pHeight * 2}px`
          vnode.context.pictureLeft = `${vnode.context.PLeft -= vnode.context.pWidth / 4}px`
          vnode.context.pictureTop = `${vnode.context.PTop -= vnode.context.pHeight / 4}px`
        }
      }
    })
    el.addEventListener('DOMMouseScroll', e => { // 火狐浏览器鼠标滚动事件
      if (e.detail > 0) {
        if (vnode.context.pWidth / 2 - 150 > 0 && vnode.context.pHeight / 2 - 150 > 0) {
          vnode.context.pictureWidth = `${vnode.context.pWidth = vnode.context.pWidth / 2}px`
          vnode.context.pictureHeight = `${vnode.context.pHeight = vnode.context.pHeight / 2}px`
          vnode.context.pictureLeft = `${vnode.context.PLeft += vnode.context.pWidth / 2}px`
          vnode.context.pictureTop = `${vnode.context.PTop += vnode.context.pHeight / 2}px`
          if (vnode.context.PLeft + 150 > document.getElementById('pictureImgModal').offsetWidth) {
            if (vnode.context.pWidth > document.getElementById('pictureImgModal').offsetWidth) {
              vnode.context.pictureLeft = vnode.context.PLeft = 0
            } else {
              vnode.context.PLeft = (document.getElementById('pictureImgModal').offsetWidth - vnode.context.pictureWidth) / 2
              vnode.context.pictureLeft = `${vnode.context.PLeft}px`
            }
          } else if (vnode.context.PLeft + vnode.context.pWidth < 150) {
            vnode.context.PLeft = document.getElementById('pictureImgModal').offsetWidth - vnode.context.pWidth
            vnode.context.pictureLeft = `${vnode.context.PLeft}px`
          }
          if (vnode.context.PTop + 150 > document.getElementById('pictureImgModal').offsetHeight) {
            if (vnode.context.pHeight > document.getElementById('pictureImgModal').offsetHeight) {
              vnode.context.pictureTop = vnode.context.PTop = 0
            } else {
              vnode.context.PTop = (document.getElementById('pictureImgModal').offsetHeight - vnode.context.pictureHeight) / 2
              vnode.context.pictureTop = `${vnode.context.PTop}px`
            }
          } else if (vnode.context.PTop + vnode.context.pHeight < 150) {
            vnode.context.PTop = document.getElementById('pictureImgModal').offsetHeight - vnode.context.pHeight
            vnode.context.pictureTop = `${vnode.context.PTop}px`
          }
        }
      } else if (e.detail < 0) {
        if (vnode.context.pWidth - (vnode.context.initWidth * 3) < 0 && vnode.context.pHeight - (vnode.context.initHeight * 3) < 0) {
          vnode.context.pictureWidth = `${vnode.context.pWidth = vnode.context.pWidth * 2}px`
          vnode.context.pictureHeight = `${vnode.context.pHeight = vnode.context.pHeight * 2}px`
          vnode.context.pictureLeft = `${vnode.context.PLeft -= vnode.context.pWidth / 4}px`
          vnode.context.pictureTop = `${vnode.context.PTop -= vnode.context.pHeight / 4}px`
        }
      }
    })
  }
})

// 自定义指令-鼠标拖拽
Vue.directive('drag', {
  bind: (el, binding, vnode) => {
    let oDiv = el; // 当前元素
    oDiv.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      e = e || window.event
      e.preventDefault()
      let disX = e.clientX - oDiv.offsetLeft
      let disY = e.clientY - oDiv.offsetTop
      document.onmousemove = e => {
        // 通过事件委托，计算移动的距离
        e = e || window.event
        e.preventDefault()
        let obox = document.getElementById('pictureImgModal')
        // 移动当前元素
        vnode.context.PLeft = e.clientX - disX
        vnode.context.PTop = e.clientY - disY
        vnode.context.pictureLeft = `${e.clientX - disX}px`
        vnode.context.pictureTop = `${e.clientY - disY}px`
        let OWidth = vnode.context.pWidth - obox.offsetWidth
        if (vnode.context.PLeft > obox.clientWidth - oDiv.clientWidth) { // 右侧宽度
          if (OWidth > 0) { // 大图右侧宽度
            if (vnode.context.PLeft >= 0) {
              vnode.context.PLeft = 0
              vnode.context.pictureLeft = `${vnode.context.PLeft}px`
            }
          } else { // 小图右侧宽度
            vnode.context.PLeft = obox.clientWidth - oDiv.clientWidth
            vnode.context.pictureLeft = `${vnode.context.PLeft}px`
          }
        } else if (vnode.context.PLeft <= 0) { // 左侧宽度
          if (OWidth > 0) { // 大图左侧宽度
            vnode.context.PLeft = obox.clientWidth - oDiv.clientWidth
            vnode.context.pictureLeft = `${vnode.context.PLeft}px`
          } else { // 小图左侧宽度
            vnode.context.PLeft = 0
            vnode.context.pictureLeft = `${vnode.context.PLeft}px`
          }
        }
        let OHeight = vnode.context.pHeight - obox.offsetHeight
        if (vnode.context.PTop > obox.clientHeight - oDiv.clientHeight) { // 底层高度
          if (OHeight > 0) { // 大图底层高度
            if (vnode.context.PTop >= 0) {
              vnode.context.PTop = 0
              vnode.context.pictureTop = `${vnode.context.PTop}px`
            }
          } else { // 小图底层高度
            vnode.context.PTop = obox.clientHeight - oDiv.clientHeight
            vnode.context.pictureTop = `${vnode.context.PTop}px`
          }
        } else if (vnode.context.PTop <= 0) { // 上层高度
          if (OHeight > 0) { // 大图上层高度
            vnode.context.PTop = obox.clientHeight - oDiv.clientHeight
            vnode.context.pictureTop = `${vnode.context.PTop}px`
          } else { // 小图上层高度
            vnode.context.PTop = 0
            vnode.context.pictureTop = `${vnode.context.PTop}px`
          }
        }
      };
      document.onmouseup = e => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
</script>

<style>
#pictureImgModal {
  height: calc(100% - 200px);
  margin: auto;
  overflow: hidden;
  display: block;
  padding: 0 !important;
  text-align: center;
  top: 50px;
  width: 800px;
}
#pictureImgModal .background-modal {
  position: fixed;
  background-color: #000000;
  bottom: 0;
  left: 0;
  max-width: 40%;
  opacity: 0.5;
  right: 0;
  text-align: center;
  top: 0;
  z-index: 1040;
}
#pictureImgModal .pictureImgModal-button {
  background-color: #000000;
  border: 0px !important;
  opacity: 0.8;
  padding: 5px;
}
#pictureImgModal .pictureImgModal-button i {
  color: #ffffff;
  font-size: 30px;
}
#pictureImgModal .pictureImgModal-sideEdgeButton {
  background-color: #000000;
  border: 0px !important;
  opacity: 0.8;
  padding: 0;
}
#pictureImgModal .pictureImgModal-sideEdgeButton i {
  color: #ffffff;
  font-size: 50px;
}
#pictureImgModal .pictureImg-div {
  display: table;
  height: 100%;
  margin: 0;
  text-align: center;
  width: 100%;
}
#pictureImgModal .pictureImg-div img {
  position: absolute;
  cursor: pointer;
  display: inline-block;
  opacity: 1.8;
  text-align: center;
  transition: all 0s;
  z-index: 999998;
}
</style>
