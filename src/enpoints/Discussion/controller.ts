import { Request,Response } from 'express'
import { verifyRequest } from '../checkAuth'
import connect from '../../DB/index'
import { IDisussionSQL } from '../../DB/Tables/Discussion/interface' 
import { IUserSQL } from '../../DB/Tables/users/interface'
 
class DiscussionController {
    public async create(req:verifyRequest,res:Response) {
        try {
            const userId = req.userId 
            const feedbackid = req.params.feedbackid.replace(':','')
            const {text} = req.body 
            const {rows} = await connect.query(`select * from users where userid = ${userId} `)
            if (rows.length <= 0) {
                res.status(401).json('не верны токен')
                return
            }
            // console.log('correct')
            connect.query(`insert into 
                discussion(userid,feedbackid,text,createdat,updatedat)
                values(${userId},${feedbackid},'${text}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)    
            `)
            res.json({message:'коментари создан'})

        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    } 

    public async update(req:verifyRequest,res:Response) {
        try {
            const userId = req.userId
            const discussionid = req.params.discussionid.replace(':','')
            const {text} = req.body 
            
            const discussionData = await connect.query(`select * from discussion where discussionid = ${discussionid}`)
            if (discussionData.rows.length <= 0) {
                res.status(400).json({message:'такого коментария не существует'})
                return
            }

            const {rows} = await connect.query(`select * from users where userid = ${userId} `)
            if (rows.length <= 0 || rows[0].userid != userId ) {
                res.status(401).json('не верны токен')
                return
            }

            if (text == '') {
                res.status(400).json({message:'text пустое'})
                return
            }

            
            // const discussion:IDisussionSQL = discussionData.rows[0]
            console.log(discussionid)
            await connect.query(`update discussion set text = '${text}',updatedat = CURRENT_TIMESTAMP where discussionid = ${discussionid}`)
            res.json({message:'коментари обнвлен'})
        }
        catch (e) {

        }
    }

    public async delete(req:verifyRequest,res:Response) {
        try {
            const userId = req.userId
            const discussionid = req.params.discussionid.replace(':','')
            
            const discussionData = await connect.query(`select * from discussion where discussionid = ${discussionid}`)
            if (discussionData.rows.length <= 0) {
                res.status(400).json({message:'такого коментария не существует'})
                return
            }
            const {rows} = await connect.query(`select * from users where userid = ${userId} `)
            if (rows.length <= 0 || rows[0].userid != userId ) {
                res.status(401).json('не верны токен')
                return
            }
            console.log('correct')
            connect.query(`delete from discussion where discussionid = ${discussionid}`)
            res.json({message:'коментари успешно удален'})
        }
        catch (e) {
            res.status(400).json(e)
        }
    }

    public async getAll(req:Request,res:Response) {
        try {
            interface IDisussionRespons extends IDisussionSQL {
                nikname:string   
                avatar:string
            }
            const feedbackid = req.params.feedbackid.replace(':','')
            const {rows} = await connect.query(`select * from feedback where feedbackid = ${feedbackid} ORDER BY createdat desc`)
            if (rows.length <= 0) {
                res.status(400).json({message:'такого фидбека не существует'})
                return
            }
            const discussionSqlData = await connect.query(`select * from discussion where feedbackid = ${feedbackid}`)
            const discussionDatas:IDisussionSQL[] = discussionSqlData.rows
            // console.log(discussiondata)
            const responsData:IDisussionRespons[] = []
            
            for (const discussionData of discussionDatas ) {
                
                const userSqlData = await connect.query(`select * from users where userid = ${discussionData.userid}`)
                const user:IUserSQL = userSqlData.rows[0]
                responsData.push({
                    ...discussionData,
                    nikname:user.nikname,
                    avatar:user.avatar
                })
            }

            res.json({data:responsData})

        }
        catch (e) {
            res.status(400).json(e)
        }
    }

}

export default new DiscussionController()