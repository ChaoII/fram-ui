import {post, get, put, del} from "@/utils/service"
import type {GetAttendsInterface} from "@/api/interface";


export const getAttendInfosApi = (data: GetAttendsInterface) => {
    return post({
        url: "/attend/getAttendInfos",
        data: data
    })
}





