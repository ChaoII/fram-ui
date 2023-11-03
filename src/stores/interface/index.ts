import {useAuthStore} from "@/stores/userInfo";

export interface UserInfo {
    username: string
    nickname: string
    token: string
}

export interface MediaInfo {
    mediaAddress: string
}

export interface AuthInfo {
    username: string
    password: string
    isRemember: boolean
}

