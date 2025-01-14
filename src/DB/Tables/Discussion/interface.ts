export interface IDisussion {
    userid:number
    feedbackid:number
    text:string
    createdat:Date
    updatedat:Date
}
export interface IDisussionSQL extends IDisussion {
    disussionid:number
}