import connect from '../../index'
export const checkDiscussion = () => {
    connect.query('select * from discussion').catch(() => {
        connect.query(`
            CREATE TABLE discussion (
                discussionId SERIAL PRIMARY KEY,
                userId INTEGER NOT NULL,        
                feedbackId INTEGER NOT NULL,    
                text TEXT NOT NULL,              
                createdAt TIMESTAMP,   
                updatedAt TIMESTAMP
            );

        `)
        console.log('discussion table created')
        return  
    })
}