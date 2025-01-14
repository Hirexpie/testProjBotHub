"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCategory = exports.checkStatus = exports.checkFeetbacs = void 0;
const index_1 = __importDefault(require("../../index"));
const checkFeetbacs = () => {
    index_1.default.query('select * from feedback').catch(() => {
        index_1.default.query(`
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
                updatedAt TIMESTAMP DEFAULT NOW(), 
                CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES category (categoryId),
                CONSTRAINT fk_status FOREIGN KEY (statusId) REFERENCES status (statusId)
            );
        `);
        console.log('feedback table created');
        return;
    });
};
exports.checkFeetbacs = checkFeetbacs;
const checkStatus = (statuses) => {
    index_1.default.query('select * from status').catch((e) => {
        index_1.default.query(`
            CREATE TABLE status (
                statusId SERIAL PRIMARY KEY, 
                val VARCHAR(255) NOT NULL   
            );
        `).then(() => {
            console.log('status table created');
            for (const status of statuses) {
                index_1.default.query(`
                    INSERT INTO status(val) VALUES ('${status}');
                `);
            }
            console.log('status table inserted');
        });
    });
};
exports.checkStatus = checkStatus;
const checkCategory = (categoryes) => {
    index_1.default.query('select * from category').catch((e) => {
        index_1.default.query(`
            CREATE TABLE category (
                categoryId SERIAL PRIMARY KEY, 
                val VARCHAR(255) NOT NULL     
            );
        `).then(() => {
            console.log('category table created');
            for (const category of categoryes) {
                index_1.default.query(`
                    insert into category(val) values('${category}')
                `);
            }
            console.log('category table inserted');
        });
    });
};
exports.checkCategory = checkCategory;
