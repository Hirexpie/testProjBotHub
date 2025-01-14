import connect from '../../index'
export const checkFeetbacs = () => {
    connect.query('select * from feedback').catch(() => {
        connect.query(`
            CREATE TABLE feedback (
                feedbackId SERIAL PRIMARY KEY,  
                title VARCHAR(255) NOT NULL,     
                description TEXT NOT NULL,       
                goodCount INTEGER DEFAULT 0,    
                badCount INTEGER DEFAULT 0,     
                categoryId INTEGER,    
                statusId INTEGER,      
                userId INTEGER NOT NULL,        
                createdAt TIMESTAMP DEFAULT NOW(), 
                updatedAt TIMESTAMP DEFAULT NOW()
            );
        `)
        console.log('feedback table created')
        return
    }) 
}

export const checkStatus = (statuses:string[]) => {
    connect.query('select * from status').catch((e) => {
        connect.query(`
            CREATE TABLE status (
                statusId SERIAL PRIMARY KEY, 
                val VARCHAR(255) NOT NULL   
            );
        `).then(() => {
            console.log('status table created')
            for (const status of statuses) {
                connect.query(`
                    INSERT INTO status(val) VALUES ('${status}');
                `)
            }
            console.log('status table inserted')
        }) 
        
    })
    
}

export const checkCategory = (categoryes:string[]) => {

    connect.query('select * from category').catch((e) => {
        connect.query(`
            CREATE TABLE category (
                categoryId SERIAL PRIMARY KEY, 
                val VARCHAR(255) NOT NULL     
            );
        `).then(()=> {
            console.log('category table created')

            for (const category of categoryes) {
                connect.query(`
                    insert into category(val) values('${category}')
                `)
            }
            console.log('category table inserted')
        })
        
    })
}