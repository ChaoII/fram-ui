import {get, post, del, put} from "@/utils/service";
import type {GetFaceInfosInterface, SettingFormInterface} from "@/api/interface";

export const updateSettingApi = (data: SettingFormInterface) => {
    return post({
        url: "/update_settings",
        data: data
    })
}


export const getSettingsApi = () => {
    return get({
        url: "/get_settings",
    })
}

export const restartDeviceApi = () => {
    return get({
        url: "/restart_device",
    })
}

export const getFaceInfosApi = (data: GetFaceInfosInterface) => {
    return post({
        url: "/get_face_infos",
        data: data
    })
}

export const addFaceApi = async (data: any, headers: any) => {
    return put({
        url: "/add_face",
        headers: headers,
        data: data
    })
}

export const faceDeleteApi = (data: any) => {
    return del({
        url: "/delete_face",
        data: data
    })
}