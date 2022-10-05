export interface User{
    name: string,
    photoUrl: string,
    uid: string,
    inGroup: boolean
}

export interface Group{
    users: string[],
    invited: string[],
    name: string,
    owner_uid: string
}
