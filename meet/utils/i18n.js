/**
 * 语言包引入
 */

const name = 'zl'; // 默认语言包
let messages = {};

for (let i = 0; i < assetsI18n.length; i++) {
  if (name === assetsI18n[i].name) {
    messages[name] = assetsI18n[i].value;
    break;
  }
}

const i18n = new VueI18n({
  locale: name,
  messages
})

global.$i18n = i18n;

export default i18n;
