import uploadPicture from './uploadPicture';

uploadPicture.install = Vue => {
  Vue.component(uploadPicture.name, uploadPicture);
};

export default uploadPicture;
