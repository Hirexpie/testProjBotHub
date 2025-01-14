import { query, Request,Response } from "express";
import { verifyRequest } from "../checkAuth";
import connect from '../../DB/index'
import { IFeedbackSQL } from '../../DB/Tables/Feetback/interface'
// import { title } from "process";
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
            const feedbackId = req.params.id.replace(':','')
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

    public async getAll(req:Request,res:Response) {

        try {
            let page:any = req.query.page || 0
            let status = req.query.status || 0
            let category = req.query.category || 0




            const statusData = await connect.query(`select * from status where statusid = ${status}`)
            const categoryData = await connect.query(`select * from category where categoryid = ${category}`)
            // if (typeof page != 'number') {
            //     console.log(typeof page)
            //     res.status(404).json({massage:'ошибка запроса'})
            //     return
            // }

            let sqlQuery = `select * from feedback `

            if (statusData.rows.length >= 1) {
                sqlQuery+= `where statusid = ${status} `
                status = 1
            }
            if (categoryData.rows.length >= 1) {
                sqlQuery+= status == 1 ? `and categoryid = ${category} ` :  `where categoryid = ${category} `
                category = 1
            }
            sqlQuery += `ORDER BY createdat desc LIMIT 100 offset ${100 * page}`
            console.log(sqlQuery)
            const { rows } = await connect.query(sqlQuery)
            
            res.json({data:rows})



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

            res.json(rows)
        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    public async getOne(req:Request,res:Response) {
        try {
            const feedbackId = req.params.id.replace(':','')
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

            const data = {
                ...feetback,
                status,
                category,
            }
            res.json({data:data})

        }
        catch (e) {
            res.status(400).json(e)
        } 
    }
}

export default new FeedbackController();