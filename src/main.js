import Vue from 'vue'

//根组件
import App from './App.vue'

//路由(简写了,会从router文件间中找index开头的文件)
import router from './router'

Vue.config.productionTip = false

//引入全局样式文件
import './styles/base.less'
//引入字体图标
import './styles/iconfont.css'

//引入lib-flexible
import 'lib-flexible'



//引入vant,按需加载
import { Field, Toast, Cell, CellGroup, Dialog, Radio, RadioGroup, Uploader, List } from 'vant'
Vue.use(Field)
Vue.use(Toast)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Uploader)
Vue.use(List);


//注册公共组件
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmPost from './components/HmPost.vue'
import HmComment from './components/HmComment.vue'
import HmFloor from './components/HmFloor.vue'
Vue.component('hm-floor', HmFloor)
Vue.component('hm-comment', HmComment)
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-post', HmPost)

//引入tab栏  下拉刷新
import { Tab, Tabs } from 'vant';
import { PullRefresh } from 'vant';
import { Sticky } from 'vant';
Vue.use(PullRefresh);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Sticky);



//引入字体图标
import { Icon } from 'vant';
Vue.use(Icon);



// 注册一个全局过滤器
//引入moment
import moment from 'moment'
import Axios from 'axios'
Vue.filter('date', function(val, format = 'YYYY-MM-DD') {
    return moment(val).format(format)
})

//处理axios
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios


//请求拦截器(作用:拦截所有axios请求,统一处理一些事情, 这里是统一添加token)
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = token
    }
    return config
})


//响应拦截器
axios.interceptors.response.use(res => {
    const { statusCode, message } = res.data
        //提示token失效了
    if (statusCode === 401 && message === "用户信息验证失败") {
        Toast.fail(message)
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        router.push('/login')
    }
    return res
})



// 事件总线  ==> bus
const bus = new Vue()
Vue.prototype.$bus = bus



new Vue({
    router,
    render: h => h(App),
}).$mount('#app')