import connect from '../../index'
import { IUser } from './interface'



export const checkUsers = () => {
    connect.query('select * from users').catch(() => {
        connect.query(`
            create table users (
                userId SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                nikname VARCHAR(100) NOT NULL UNIQUE,
                passHash VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                avatar BYTEA,
                createAt TIMESTAMP,
                updateAt TIMESTAMP
            )
        `)
        console.log('users table created')
        return  
    }) 
}