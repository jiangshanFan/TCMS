// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './vuex/index'
import router from './router'
import ElementUI from 'element-ui'
import '../theme/index.css'

Vue.use(ElementUI)
Vue.use(store)
Vue.use(router)

Vue.config.devtools = true
Vue.config.productionTip = false

/* eslint-disable */
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

/*-- 日期和时间戳转换 --*/
function add0(m){return m<10?'0'+m:m }
Vue.prototype.$format = function format(shijianchuo)
{//shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+add0(m)+'-'+add0(d); //+' '+add0(h)+':'+add0(mm)+':'+add0(s)
};

// console.log('%c打印VM：','color:red;font-size:30px;',vm);

export default vm;
