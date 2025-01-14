import { Request,Response } from 'express';
import connect from '../../DB/index';
import bcrypt from 'bcrypt';
import { IUserSQL } from '../../DB/Tables/users/interface';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { passResetQueue } from '../../redis/passResetQueue';
import { jwtkey } from '../../config/config';

const getToken = (userId:number):string => {
    return jwt.sign({
        id:userId
    },jwtkey,
    {
        expiresIn:'30m'
    })
}



class AuthController {
    public async register(req:Request,res:Response) {
        try {
            const {username,nikname,password,email,avatar} = req.body
            const {rows} = await connect.query(`select * from users where nikname = '${nikname}' or email = '${email}'`)
            if (rows.length >=1) {
                res.status(400).json({message:'такой ползаватель уже существует'})
                return 
            }

            const salt = await bcrypt.genSalt(10)
            const passHash = bcrypt.hashSync(password,salt)

            await connect.query(`insert into 
                users(username,nikname,passHash,email,avatar,createAt,updateAt) 
                values('${username}','${nikname}','${passHash}','${email}','${avatar}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`)
            res.json(rows)
        }
        catch (e) {
            // console.log(`register error | ${new Date} | ${e}`)
            res.status(400).json(e)
        }
    }

    public async login(req:Request,res:Response) {
        try {
            const {login,password} = req.body // ligin is email and nikname
            const {rows} = await connect.query(`select * from users where email = '${login}' or nikname = '${login}'`)
            if (rows.length <= 0) {
                res.status(400).json({message:'пороль или логин не правельны'})
                return
            }
            const user:IUserSQL = rows[0]
            // console.log(user.userid)
            if (!user.passhash) {
                res.json(user.passhash)
                console.log(user.passhash)
                return
            }
            const isPass = await bcrypt.compare(password,user.passhash)
            // console.log(isPass)
            if (!isPass) {
                res.status(400).json({message:'пороль или логин не правельны'})
                return
            }
            // console.log(user.userId)
            const token = getToken(user.userid)
            res.json({token:token})

        }
        catch (e) {
            res.status(400).json(e)
            // console.log(`login error | ${new Date} | ${e}`)
            // console.log(e)

        }
    }




    public async getCodeResetPass(req:Request,res:Response) {
        try {
            const {email} = req.body
            const {rows} = await connect.query(`select * from users where email = '${email}'`)
            if (rows.length <= 0) {
                res.json({message:'не правельная почта'})
                return
            }


            const code = Math.floor(100000 + Math.random() * 900000); 
            passResetQueue.add({
                code,
                userid:rows[0].userid,
                email
            })

            const transporter = nodemailer.createTransport({
                // host: 'smtp.gmail.com',
                // port: 465,
                // secure: true,
                service: 'gmail', 
                auth: {
                  user: 'feetback27@gmail.com',
                  pass: 'newpass888',       
                },
            });
            // transporter.verify((err) => {
            //     if (err) console.log(err)
            // })
            const mailOptions = {
                from: '"feetback" <feetback27@gmail.com>',       
                to: 'bdrik61@gmail.com',    
                subject: 'смена пароля',      
                text: `здраствуте вот ваш код:${code}`,       
            };
            
            transporter.sendMail(mailOptions)
            // console.log(info)
            res.json({code:code})
        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    } 

    public async isCodeResetPass(req:Request,res:Response) {

    }

    public async ResetPass(req:Request,res:Response) {
    
    }
}

export default new AuthController();