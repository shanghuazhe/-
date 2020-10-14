import Vue from 'vue'
import VueRouter from 'vue-router'

//引入页面组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'



//细节 : 项目中(模块化工程中) 必须使用 vue.use()安装一下,把路由当成插件来使用
Vue.use(VueRouter)

//实例化路由
const router = new VueRouter({
        routes: [{
                path: '/',
                redirect: '/login',
            },
            {
                path: '/login',
                name: 'login',
                component: Login,
            },
            {
                path: '/register',
                name: 'register',
                component: Register,
            },
            {
                path: '/user',
                name: 'user',
                component: User
            },
            {
                path: '/Edit',
                name: 'edit',
                component: Edit
            }, {
                path: '/my-follow',
                name: 'myfollow',
                component: MyFollow
            },
            {
                path: '/my-comment',
                name: 'mycomment',
                component: MyComment
            }, {
                path: '/my-star',
                name: 'mystar',
                component: MyStar
            }
        ],
    })
    //导航守卫  全局前置守卫
router.beforeEach((to, from, next) => {

        // /user /my-follow  /my-comments  /my-star
        const authPath = ['/user', '/my-follow', '/my-comments', '/my-star', '/edit']

        if (authPath.includes(to.path)) { // 未完待续

            let token = localStorage.getItem('token')
            if (token) {
                next()
            } else {
                next('/login')
            }
        } else { // 放行
            next()
        }
    })
    //导出
export default router