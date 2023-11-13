import {get, post} from "@/utils/service";
import type {SettingFormInterface} from "@/api/interface";

export const updateSettingApi = (data: any) => {
    return post({
        url: "/settings/updateSettings",
        data: data
    })
}


export const getSettingsApi = () => {
    return get({
        url: "/settings/getSettings",
    })
}

export const restartDeviceApi = () => {
    return get({
        url: "/settings/restartDevice",
    })
}