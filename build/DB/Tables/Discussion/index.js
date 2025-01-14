"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDiscussion = void 0;
const index_1 = __importDefault(require("../../index"));
const checkDiscussion = () => {
    index_1.default.query('select * from discussion').catch(() => {
        index_1.default.query(`
            CREATE TABLE discussion (
                discussionId SERIAL PRIMARY KEY,
                userId INTEGER NOT NULL,        
                feedbackId INTEGER NOT NULL,    
                text TEXT NOT NULL,              
                createdAt TIMESTAMP,   
                updatedAt TIMESTAMP,   
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (feedbackId) REFERENCES feedback(feedbackId)
            );

        `);
        console.log('discussion table created');
        return;
    });
};
exports.checkDiscussion = checkDiscussion;
