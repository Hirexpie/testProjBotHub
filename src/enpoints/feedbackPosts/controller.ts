import { query, Request,Response } from "express";
import { verifyRequest } from "../checkAuth";
import connect from '../../DB/index'
import { IFeedbackSQL } from '../../DB/Tables/Feetback/interface'
// import { title } from "process";
interface IResponsFeedback extends IFeedbackSQL {
    status:string
    category:string
    isGood: boolean | null
}


class FeedbackController {
    public async create(req:verifyRequest,res:Response) {
        try {
            interface reqBody {
                title:string
                description:string
                categoryId:number
                statusId:number
            }
            const body = req.body as reqBody
            const userId = req.userId   
            console.log(userId)
            
            // for (let i = 0;i< 1000;i++){ // для теста

                connect.query(`insert into 
                    feedback(title,description,categoryId,statusId,userId,createdAt,updatedAt)
                    values('${body.title}','${body.description}','${body.categoryId}','${body.statusId}',${userId},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
                `)
            // }
            
            res.json({message:'фидбек добавлен'})
        }    
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    public async delete(req:verifyRequest,res:Response) {
        try {
            const userId = req.userId 
            const feedbackId = req.params.feedbackId.replace(':','')
            const { rows } = await connect.query(`select * from feedback where feedbackId = ${feedbackId}`)
            if (rows.length <= 0) {
                res.status(404).json({message:'такого фидбека не существует'})
                return
            }
            console.log(rows[0].userid)
            if (rows[0].userid != userId) {
                res.status(400).json({message:'пойзашла ошибка'})
                return
            }

            connect.query(`delete from feedback where feedbackId = ${feedbackId}`)

            res.json({message:'фидбек успешно удален'})

        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    public async update(req:verifyRequest,res:Response) { // если передать пустые значение по типу к строкам '' или к числам 0 то он их не станет минять
        try {
            interface reqBody {
                title:string
                description:string
                categoryid:number
                statusid:number
            }
            const body = req.body as reqBody
            const userId = req.userId 
            const feedbackId = req.params.feedbackId.replace(':','')
            const { rows } = await connect.query(`select * from feedback where feedbackId = ${feedbackId}`)
            if (rows.length <= 0) {
                res.status(404).json({message:'такого фидбека не существует'})
                return
            }

            if (rows[0].userid != userId) {
                res.status(400).json({message:'пойзашла ошибка'})
                return
            }

            const old:IFeedbackSQL = rows[0]

            if (body.title == '') {
                body.title = old.title
            }
            if (body.description == '') {
                body.description = old.description
            }
            if (body.categoryid == 0) {
                body.categoryid = parseInt(old.categoryid)
            }
            if (body.statusid == 0) {
                body.statusid = parseInt(old.statusid)
            }
            
            connect.query(`update feedback set title = '${body.title}',description = '${body.description}', categoryid = ${body.categoryid}, statusid = ${body.statusid}, updatedat = CURRENT_TIMESTAMP where feedbackid = ${feedbackId} `)
            res.json({message:'данные обнавлены'})
        }
        catch (e) {
            res.json(e)
            console.log(e)
        }
    }

    public async getAll(req:verifyRequest,res:Response) {

        try {
            const page:any = req.query.page || 0
            const status = req.query.status || 0
            const category = req.query.category || 0
            const isGoodMore = req.query.isGoodMore || null
            const isOldDate = req.query.isOldDate || false


            const userId = req.userId


            const statusData = await connect.query(`select * from status where statusid = ${status}`)
            const categoryData = await connect.query(`select * from category where categoryid = ${category}`)
            // if (typeof page != 'number') {
            //     console.log(typeof page)
            //     res.status(404).json({massage:'ошибка запроса'})
            //     return
            // }

            let sqlQuery = `select * from feedback `
            let isFirstFilter = true
            if (statusData.rows.length >= 1) {
                sqlQuery+= `where statusid = ${status} `
                isFirstFilter = false
            }
            if (categoryData.rows.length >= 1) {
                sqlQuery+= isFirstFilter ? `and categoryid = ${category} ` :  `where categoryid = ${category} `
                isFirstFilter = false
            }
            isFirstFilter = true

            if (isOldDate) {
                sqlQuery+=`ORDER BY createdat asc `
                isFirstFilter = false
            }
            else {
                sqlQuery+=`ORDER BY createdat desc `
                isFirstFilter = false
            }

            if (isGoodMore) {
                sqlQuery+= isFirstFilter ? `ORDER BY goodcount desc ` : `, goodcount desc `
                isFirstFilter = false
            }
            else {
                sqlQuery+= isFirstFilter ? `ORDER BY badcount desc ` : `, badcount desc `
                isFirstFilter = false
            }

            sqlQuery += `LIMIT 100 offset ${100 * page}`
            console.log(sqlQuery)
            const { rows } = await connect.query(sqlQuery)
            const feedbacks:IFeedbackSQL[] = rows
            const data:IResponsFeedback[] = []



            for (const feedback of feedbacks) {
                const statusData = await connect.query(`select * from status where statusid = ${feedback.statusid}`)
                const categoryData = await connect.query(`select * from category where categoryid = ${feedback.categoryid}`)
                let status = 'Не извесно'
                let category = 'Не извесно'
                if (statusData.rows.length >= 1) {
                    status = statusData.rows[0].val
                }
                if (categoryData.rows.length >= 1) {
                    category = categoryData.rows[0].val
                }
                let isGood = null;
                if (userId) {
                    const voteData = await connect.query(`select * from vote where feedbackid = ${feedback.feedbackid} and userid = ${userId}`)
                    if (voteData.rows.length <= 0) {
                        isGood = voteData.rows[0].isGood
                    }
                }
                data.push({
                    ...feedback,
                    status,
                    category,
                    isGood:isGood
                })
            }

            
            res.json({data:data})



        }
        catch (e) {
            console.log(e)
            res.json(e)
        }
    }

    public async getOneUser(req:verifyRequest,res:Response) {
        try {

            const userId = req.userId
            // console.log("status="+status)
            // console.log("cat="+category)

            const { rows } = await connect.query(`select * from feedback where userid = ${userId}`)
            const feedbacks:IFeedbackSQL[] = rows
            const data:IResponsFeedback[] = []
            for (const feedback of feedbacks) {
                const statusData = await connect.query(`select * from status where statusid = ${feedback.statusid}`)
                const categoryData = await connect.query(`select * from category where categoryid = ${feedback.categoryid}`)
                let status = 'Не извесно'
                let category = 'Не извесно'
                if (statusData.rows.length >= 1) {
                    status = statusData.rows[0].val
                }
                if (categoryData.rows.length >= 1) {
                    category = categoryData.rows[0].val
                }
                const voteData = await connect.query(`select * from vote where feedbackid = ${feedback.feedbackid} and userid = ${userId}`)
                let isGood = null;
                if (voteData.rows.length <= 0) {
                    isGood = voteData.rows[0].isGood
                }
                data.push({
                    ...feedback,
                    status,
                    category,
                    isGood:isGood
                })
            }

            res.json(data)
        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    public async getOne(req:verifyRequest,res:Response) {
        try {
            const userId = req.userId
            const feedbackId = req.params.feedbackId.replace(':','')
            const {rows} = await connect.query(`select * from feedback where feedbackid = ${feedbackId}`)
            if (rows.length<=0) {
                res.status(404).json({message:'такого фидбека не существует'})
                return
            }
            const feetback:IFeedbackSQL = rows[0]
            const statusData = await connect.query(`select * from status where statusid = ${feetback.statusid}`)
            const categoryData = await connect.query(`select * from category where categoryid = ${feetback.categoryid}`)
            let status = 'Не извесно'
            let category = 'Не извесно'
            if (statusData.rows.length >= 1) {
                status = statusData.rows[0].val
            }
            if (categoryData.rows.length >= 1) {
                category = categoryData.rows[0].val
            }
            let isGood = null;
            if (userId) {

                const voteData = await connect.query(`select * from vote where feedbackid = ${feedbackId} and userid = ${userId}`)
                if (voteData.rows.length <= 0) {
                    isGood = voteData.rows[0].isGood
                }
            }
            const data:IResponsFeedback = {
                ...feetback,
                status,
                category,
                isGood:isGood
            }
            res.json({data:data})

        }
        catch (e) {
            res.status(400).json(e)
        } 
    }

    public async setVote(req:verifyRequest,res:Response) {
        try {
            const { isGood } = req.body
            const userId = req.userId 
            const feedbackId = req.params.id.replace(':','')
            const { rows } = await connect.query(`select * from feedback where feedbackId = ${feedbackId}`)
            if (rows.length <= 0) {
                res.status(404).json({message:'такого фидбека не существует'})
                return
            }
            console.log(rows[0].userid)
            if (rows[0].userid != userId) {
                res.status(400).json({message:'пойзашла ошибка'})
                return
            }
            const isVote = await connect.query(`select * from vote where userid = ${userId} and feedbackid = ${feedbackId}`)

            if (isVote.rows.length >= 1) {
                connect.query(`update table vote set isgood = ${isGood} where voteid = ${isVote.rows[0].voteid}`)
                if (isGood) {
                    connect.query(`update table feedback set goodcount = ${rows[0].goodcount++} where feedbackid = ${feedbackId}`)
                    connect.query(`update table feedback set badcount = ${rows[0].badcount--} where feedbackid = ${feedbackId}`)
                }
                else {
                    connect.query(`update table feedback set goodcount = ${rows[0].goodcount--} where feedbackid = ${feedbackId}`)
                    connect.query(`update table feedback set badcount = ${rows[0].badcount++} where feedbackid = ${feedbackId}`)
                }

                res.json({message:'голос обновлен'})
                return
            }

            connect.query(`insert into 
                vote(userid,feedbackid,isgood) 
                values(${userId},${feedbackId},${isGood})`)
            if (isGood) {
                connect.query(`update table feedback set goodcount = ${rows[0].goodcount++} where feedbackid = ${feedbackId}`)
            }
            else {
                connect.query(`update table feedback set badcount = ${rows[0].badcount++} where feedbackid = ${feedbackId}`)
            }

            res.json({message:'голос создан'})

        }
        catch (e) {

        }
    }
}

export default new FeedbackController();