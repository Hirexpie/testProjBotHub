import fs from 'fs';
import yaml from 'js-yaml'



interface http {
    host:string
    port:number
}

interface postgreaSQL {
    user:string
    host:string
    database:string
    password:string
    port:number
    filters: {
        status:string[]
        category:string[]
    }
}

interface redis {
    host: string
    port: number
}

interface resetPass {
    email:string
    password:string
}

interface config {
    http: http
    postgreaSQL: postgreaSQL
    redis: redis
    resetPass: resetPass
    jwt: string
}


const fileContent = fs.readFileSync('config.yml', 'utf8');
const config = yaml.load(fileContent) as config;


export const http:http = config.http
export const postgreaSQL:postgreaSQL = config.postgreaSQL
export const redis:redis = config.redis
export const jwtkey:string = config.jwt
export const emailConfig:resetPass = config.resetPass 