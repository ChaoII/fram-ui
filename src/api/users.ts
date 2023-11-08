import {post, get, put, del} from "@/utils/service"
import type {
    LoginReq,
    AddUserInterface,
    QueryInterface,
    EditUserInterface,
    DeleteUserInterface,
    ModifyPasswordInterface
} from "@/api/interface";

export const loginApi = (data: LoginReq) => {
    return post({
        url: "/user/login",
        data: data
    })
}
// 获取用户列表
export const userListApi = (data: QueryInterface) => {
    return get({
        url: "/user/getUser",
        data: data
    })
}

// 新增用户列表
export const userAddApi = (data: AddUserInterface) => {
    return put({
        url: "/user/addUser",
        data
    })
}
//  用户列表更改状态
export const userEditApi = (data: EditUserInterface) => {
    return post({
        url: "user/editUser",
        data
    })
}

// 删除用户
export const userDeleteApi = (data: DeleteUserInterface) => {
    return del({
        url: "user/delUser",
        data
    })
}

export const modifyPasswordApi = (data: ModifyPasswordInterface) => {
    return post({
        url: "user/modifyPassword",
        data
    })
}


