import {userListApi} from "@/api/users";

export interface LoginReq {
    username: string,
    password: string
}

export interface QueryInterface {
    searchName: string,
    pageSize: number,
    pageIndex: number
}

export interface AddUserInterface {
    username: string,
    password: string,
    nickname: string
}

export interface EditUserInterface {
    id: string
    username: string,
    nickname: string
}

export interface DeleteUserInterface {
    id: string
}

export interface GetAttendsInterface {
    start_time: any,
    end_time: any,
    attend_name: string,
    pageSize: number,
    pageIndex: number
}

export interface SettingFormInterface {
    distanceSteel: number
    distanceCamera: number
    deviceName: string
    cameraAddress: string
    mediaAddress: string
    customParam: string
    currentDateTime: Date
    deviceVersion: string
    algorithmVersion: string
    systemVersion: string
}

export interface ModifyPasswordInterface {
    username: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface UpdateHistoryInterface {
    id: string,
    trainMode: string,
    trainNum: string,
    deadWeight: number,
    roughWeight: number,
    volume: number,
    length: number,
}

export interface GetFaceInfosInterface {
    query_name: string,
    pageSize: number,
    pageIndex: number
}
