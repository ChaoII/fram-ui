import {get, post} from "@/utils/service";
import type {SettingFormInterface} from "@/api/interface";

export const updateSettingApi = (data: any) => {
    return post({
        url: "/updateSettings",
        data: data
    })
}


export const getSettingsApi = () => {
    return get({
        url: "/getSettings",
    })
}

export const restartDeviceApi = () => {
    return get({
        url: "/restartDevice",
    })
}