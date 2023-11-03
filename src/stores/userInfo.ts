import {defineStore} from 'pinia'
import type {AuthInfo, MediaInfo, UserInfo} from '@/stores/interface'

export const useUserInfo = defineStore('userInfo', {
    state: (): UserInfo => {
        return {
            username: '',
            nickname: '',
            token: '',
        }
    },
    actions: {
        removeToken() {
            this.username = ""
            this.token = ''
            this.nickname = ""
        },
        setUserInfo(data: UserInfo) {
            this.username = data.username
            this.nickname = data.nickname
            this.token = data.token
        },
        getToken() {
            return this.token
        },
    },
    persist: {
        key: "userInfo",
    },
})


export const useMediaAddress = defineStore('mediaAddress', {
    state: (): MediaInfo => {
        return {
            mediaAddress: ""
        }
    },
    actions: {
        setMediaAddress(data: MediaInfo) {
            this.mediaAddress = data.mediaAddress
        },

        removeMediaAddress() {
            this.mediaAddress = ""
        },
        getMediaAddress() {
            return this.mediaAddress
        },
    },
    persist: {
        key: "mediaAddress",
    },
})


export const useAuthStore = defineStore('authInfo', {
    state: (): AuthInfo => {
        return {
            isRemember: false,
            username: '',
            password: ''
        }
    },
    actions: {
        saveRememberedCredentials() {
            // 登录逻辑...
            if (this.isRemember) {
                // 将用户名和密码保存到本地存储
                localStorage.setItem('rememberedUsername', this.username);
                localStorage.setItem('rememberedPassword', this.password);
            } else {
                // 移除本地存储中的用户名和密码
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
            }
        },
        loadRememberedCredentials() {
            // 从本地存储中加载保存的用户名和密码
            const rememberedUsername = localStorage.getItem('rememberedUsername');
            const rememberedPassword = localStorage.getItem('rememberedPassword');
            if (rememberedUsername && rememberedPassword) {
                this.isRemember = true;
                this.username = rememberedUsername;
                this.password = rememberedPassword;
            }
        }
    },
    persist: {
        key: "authInfo",
    },
})


export default useUserInfo
