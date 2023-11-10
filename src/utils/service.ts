import axios from "axios"
// @ts-ignore
import {global_config} from "../../public/config";
import type {AxiosRequestConfig} from 'axios'
import {ElLoading, ElMessage} from 'element-plus'
import useUserInfo from "@/stores/userInfo"
import * as path from "path";
import router from "@/router";


declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}

export const host: string = global_config.api_host
const store = useUserInfo()
axios.defaults.headers.common['token'] = store.getToken()
// 使用create创建axios实例
const axiosInstance = axios.create({
    timeout: 8000,
    baseURL: host + "/api",
    headers: {
        "Content-type": "application/json;charset=utf-8",
        "token": store.getToken()
    },
    responseType: "json"
})
// 请求拦截-增加loading,对请求做统一处理
axiosInstance.interceptors.request.use(config => {

    return config
})

// 响应拦截-对返回值做统一处理
axiosInstance.interceptors.response.use(response => {
        const data = response.data
        if (data.code == -1) {
            console.log(data.msg)
            // 请求出错
            return data
        } else if (data.code == -2) {
            router.push("/login")
            return
        }
        return data
    },
    error => {
        ElMessage({
            message: "服务器错误",
            type: "error",
            duration: 2000
        })
    })

// post请求
export const post = (config: AxiosRequestConfig) => {
    return axiosInstance({
        ...config,
        method: "post",
        data: config.data
    })
}
// get请求
export const get = (config: AxiosRequestConfig) => {
    return axiosInstance({
        ...config,
        method: "get",
        params: config.data,
    })
}
// put请求
export const put = (config: AxiosRequestConfig) => {
    return axiosInstance({
        ...config,
        method: "put",
        data: config.data
    })
}// delete请求
export const del = (config: AxiosRequestConfig) => {
    return axiosInstance({
        ...config,
        method: "delete"
    })
}