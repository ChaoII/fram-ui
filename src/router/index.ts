import {createRouter, createWebHashHistory} from 'vue-router'
import type {RouteRecordRaw} from "vue-router";
import {useUserInfo} from "@/stores/userInfo";

const routes: Array<RouteRecordRaw> = [
    {
        // 登录界面
        path: '/login',
        name: 'login',
        component: () => import("@/page/login.vue")
    },
    {
        path: "/",
        name: "home",
        component: () => import("@/layout/layout.vue"),
        redirect: "/index",
        children: [
            {
                path: "/index",
                name: "index",
                component: () => import("@/page/home/index.vue")
            },
            {
                path: "/users",
                name: "users",
                component: () => import("@/page/users/index.vue")
            },
            {
                path: "/setting",
                name: "setting",
                component: () => import("@/page/settings/index.vue")
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})


router.beforeEach((to, form, next) => {
    /**
     * to:从哪个页面
     * from:到哪个页面
     * next:只有执行next()页面才会进行跳转
     */
        // 判断用户是否登录
    const store = useUserInfo()
    if (!store.getToken()) {
        // 未登录,跳转到login
        if (to.path === "/login") {
            next()
            return
        }
        next("/login")
    } else {
        next()
    }
})

export default router