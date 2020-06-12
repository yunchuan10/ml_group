
import Vue from 'vue';
import config from '@/utils/config'; // 公共常量
import utils from '@/utils/utils'; // 业务工具库

Vue.use(config);
Vue.use(utils);

global.CON = config.CON;
