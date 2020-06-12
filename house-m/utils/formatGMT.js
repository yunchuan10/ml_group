export default {
  formatGET(time) {
    if (time === '' || time === null) {
      return '';
    };
    var T = new Date(time);
    var Y = T.getMonth() + 1;
    var M = T.getDate()
    if (Y <= 9) {
      Y = '0' + Y
    }
    if (M <= 9) {
      M = '0' + M
    }
    return T.getFullYear() + '-' + Y + '-' + M;
  }
}