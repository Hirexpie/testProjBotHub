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

interface config {
    http: http
    postgreaSQL: postgreaSQL
    redis: redis
}


const fileContent = fs.readFileSync('config.yml', 'utf8');
const config = yaml.load(fileContent) as config;


export const http:http = config.http
export const postgreaSQL:postgreaSQL = config.postgreaSQL
export const redis:redis = config.redis
