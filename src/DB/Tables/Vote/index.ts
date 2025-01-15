import connect from '../../index'
// import {  } from './interface'



export const checkVots = () => {
    connect.query('select * from vote').catch(() => {
        connect.query(`
            CREATE TABLE vote (
                voteid SERIAL PRIMARY KEY,         
                userid INTEGER NOT NULL,          
                feedbackid INTEGER NOT NULL,        
                isGood BOOLEAN NOT NULL            
            );
        `)
        console.log('vote table created')
        return  
    }) 
}