
import {get, post} from "@/utils/service";
import type {SettingFormInterface} from "@/api/interface";

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