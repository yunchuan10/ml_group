/**
 * 全局注册
 */

import uploadPicture from './uploadPicture';
import searchPopover from './vue-listSearch-popover.vue';
import baseUpload from './base-upload.vue';

const components = [
  uploadPicture,
  searchPopover,
  baseUpload,
];

const install = Vue => {
  components.map(component => {
    console.log(component.name,2222);
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...components
};
