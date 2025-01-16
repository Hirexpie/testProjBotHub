import { Request,Response } from 'express';
import connect from '../../DB/index';
import bcrypt from 'bcrypt';
import { IUserSQL } from '../../DB/Tables/users/interface';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { passResetQueue } from '../../redis/passResetQueue';
import { jwtkey,emailConfig } from '../../config/config';

const getToken = (userId:number):string => {
    return jwt.sign({
        id:userId
    },jwtkey,
    {
        expiresIn:'30m'
    })
}

interface IredisCode {
    userId:number
    code:number
    email:string
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
            res.json({message:'вы зарегестрировались'})
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
            res.json({token:token,
                user:user
            })

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
            let code = Math.floor(Math.random() * 900000) + 100000;

            const jobs = await passResetQueue.getJobs(['waiting', 'active', 'delayed', 'completed', 'failed']);

            for (let job of jobs) {
                while (job.data.code == code) {
                    code = Math.floor(Math.random() * 900000) + 100000;
                }
                if (job.data.email === email) {
                    await job.remove();
                }
            }
            passResetQueue.add({
                code,
                userid:rows[0].userid,
                email,
            })

            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465, // или 587
                secure: true,
                auth: {
                  user: emailConfig.email,
                  pass: emailConfig.password,       
                },
            });
            const mailOptions = {
                from: emailConfig.email,       
                to: email,    
                subject: 'смена пароля',      
                text: `здраствуте вот ваш код:${code}`,       
            };
            await transporter.sendMail(mailOptions).catch((e) => {
                console.log(e)
                console.log('почта не работает!!!')
            })
        
            res.json({code:code})
        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    } 

    public async isCodeResetPass(req:Request,res:Response) {
        try {
            const {code,email} = req.body
            const jobs = await passResetQueue.getJobs(['waiting', 'active', 'completed']);
            let data:IredisCode 
            for (let job of jobs) {
                if (job.data.email === email) {
                    data = job.data
                    if (data.code == code) {
                        // job.remove()
                        res.json({iscorect:true})
                    }
                    res.json({iscorect:false})

                    break;  
                }
            }
            res.json({message:'не правельная почта'})
            

        }
        catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
    }

    public async ResetPass(req:Request,res:Response) {
        try {
            const {code,email,newPass} = req.body
            const jobs = await passResetQueue.getJobs(['waiting', 'active', 'completed']);
            let data:IredisCode 
            for (let job of jobs) {
                if (job.data.email === email) {
                    data = job.data
                    if (data.code == code) {
                        const salt = bcrypt.genSaltSync(10)
                        const passhash = bcrypt.hashSync(newPass,salt)
                        connect.query(`update users set passhash = ${passhash}`)
                        job.remove()
                        res.json({message:'пароль успешно изменен'})
                        return;
                    }
                    res.json({message:'не правельны код'})
                }
            }
            res.json({message:'ошибка'})
        }
        catch (e) {
            res.status(400).json(e)
        }
    }
}

export default new AuthController();