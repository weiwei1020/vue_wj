import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);

//语言设置（默认显示中文）
let lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'cn';
const messages = {
  'cn': require('./lang/cn'), //中文
  'us': require('./lang/us') //英文
};
const i18n = new VueI18n({
  locale: lang,
  messages
});

export default i18n
