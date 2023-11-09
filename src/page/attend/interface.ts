export interface OptionsInterface {
    trainId: string,
    value: string,
    label: string,
    count: number,
}

export interface TableDataInterface {
    id: string,
    uid: string,
    name: string,
    pic_url: string,
    attend_time: string,
}

export interface PageInterface {
    pageSize: number,
    pageIndex: number
}