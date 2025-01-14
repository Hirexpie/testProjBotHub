export interface IUser {
    username:string
    nikname:string
    passhash:string
    email:string
    avatar:string
    createAt:Date 
    updateAt:Date
}
export interface IUserSQL extends IUser {
    userid:number
}