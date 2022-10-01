export interface User{
    name: string,
    photoUrl: string,
    uid: string,
    inGroup: boolean
}

export interface Group{
    users: string[],
    invited: string[]
}
