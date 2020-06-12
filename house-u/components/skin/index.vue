<template>
  <div class="m-skin">
    <section class="m-main">
      <!--导航-->
      <Y-Breadcrumb title="皮肤设置" :item="['皮肤设置']"></Y-Breadcrumb>

      <div class="m-body">
        <section class="m-content">
          <!--最近使用-->
          <div class="basic-info">
            <span class="left-bordedr"></span>
            <span class="message">最近使用</span>
          </div>
          <div class="main-basic">
            <div class="u-skin" @click="switchSkin('default')">
              <el-card shadow="hover">
                <div class="u-skin-img" style="background-color: #467BFB;"></div>
                <div class="u-skin-text">默认</div>
              </el-card>
            </div>
            <div class="u-skin" @click="switchSkin('a')">
              <el-card shadow="hover">
                <img class="u-skin-img" src="//img.alicdn.com/imgextra/i3/48764807/TB2191BX_ZRMeJjSsplXXXeqXXa_!!0-saturn_solar.jpg_220x220.jpg_.webp" />
                <div class="u-skin-text">a</div>
              </el-card>
            </div>
          </div>

          <!-- 常用皮肤 -->
          <div class="basic-info">
            <span class="left-bordedr"></span>
            <span class="message">常用皮肤</span>
          </div>
          <div class="main-basic">
            <div class="u-skin" @click="switchSkin('default')">
              <el-card shadow="hover">
                <img class="u-skin-img" src="//img.alicdn.com/imgextra/i3/48764807/TB2191BX_ZRMeJjSsplXXXeqXXa_!!0-saturn_solar.jpg_220x220.jpg_.webp" />
                <div class="u-skin-text">默认</div>
              </el-card>
            </div>
          </div>

          <div class="u-text">
            <span>点击图片可自动切换皮肤，设置后，系统将自动保存。</span>
          </div>

        </section>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  activated() {
  },
  methods: {
    switchSkin(val) {
      document.getElementById('main-default').setAttribute('class', `main-${val}`);
    }
  }
};
</script>

<style lang="scss">
.m-content {
  padding-bottom: 30px;
}

.m-skin {
  .basic-info {
    display: table; height: 20px; padding: 40px 0 30px 20px;

    .left-bordedr {
      display: table-cell; width: 4px; height: 14px; vertical-align: middle; background-color: #467bfb;
    }

    .message {
      font-size: 14px; display: table-cell; height: 12px; padding-left: 6px; vertical-align: middle; color: #232323;
    }
  }

  .main-basic {overflow: hidden;

    padding: 0 0 0 30px; 

    .u-skin {float: left; 

      width: 103px; padding-right: 30px; padding-bottom: 30px;

      .el-card__body {
        padding: 0;
      }

      .u-skin-img {
        width: 100px; height: 100px; border-radius: 4px;
      }

      .u-skin-text {
        font-size: 14px; padding: 5px; text-align: center; color: #555; 
      }
    }
  }

  .u-text {display: table; width: calc(100% - 60px);height: 50px; margin: 30px; border-radius: 4px; 
    background-color: #f5f6fa; 

    span {font-size: 14px; display: table-cell; padding: 0 20px; vertical-align: middle; 

      color: #888; 
    }
  }
}

</style>
