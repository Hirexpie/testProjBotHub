export interface IFeedback {
    title:string
    description:string
    goodcount:number
    badcount:number
    categoryid:number
    statusid:number
    userid:number
    createadt:Date
    updateadt:Date
}

export interface IFeedbackSQL extends IFeedback {
    feedbackid:number

}

export interface IStatus {
    statusid:number
    val:string
}

export interface ICategory {
    categoryid:number
    val:string
}