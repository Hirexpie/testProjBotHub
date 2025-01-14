"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../DB/index"));
class DiscussionController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const feedbackid = req.params.feedbackid.replace(':', '');
                const { text } = req.body;
                const { rows } = yield index_1.default.query(`select * from users where userid = ${userId} `);
                if (rows.length <= 0) {
                    res.status(401).json('не верны токен');
                    return;
                }
                // console.log('correct')
                index_1.default.query(`insert into 
                discussion(userid,feedbackid,text,createdat,updatedat)
                values(${userId},${feedbackid},'${text}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)    
            `);
                res.json({ message: 'коментари создан' });
            }
            catch (e) {
                console.log(e);
                res.status(400).json(e);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const discussionid = req.params.discussionid.replace(':', '');
                const { text } = req.body;
                const discussionData = yield index_1.default.query(`select * from discussion where discussionid = ${discussionid}`);
                if (discussionData.rows.length <= 0) {
                    res.status(400).json({ message: 'такого коментария не существует' });
                    return;
                }
                const { rows } = yield index_1.default.query(`select * from users where userid = ${userId} `);
                if (rows.length <= 0 || rows[0].userid != userId) {
                    res.status(401).json('не верны токен');
                    return;
                }
                if (text == '') {
                    res.status(400).json({ message: 'text пустое' });
                    return;
                }
                // const discussion:IDisussionSQL = discussionData.rows[0]
                console.log(discussionid);
                yield index_1.default.query(`update discussion set text = '${text}',updatedat = CURRENT_TIMESTAMP where discussionid = ${discussionid}`);
                res.json({ message: 'коментари обнвлен' });
            }
            catch (e) {
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const discussionid = req.params.discussionid.replace(':', '');
                const discussionData = yield index_1.default.query(`select * from discussion where discussionid = ${discussionid}`);
                if (discussionData.rows.length <= 0) {
                    res.status(400).json({ message: 'такого коментария не существует' });
                    return;
                }
                const { rows } = yield index_1.default.query(`select * from users where userid = ${userId} `);
                if (rows.length <= 0 || rows[0].userid != userId) {
                    res.status(401).json('не верны токен');
                    return;
                }
                console.log('correct');
                index_1.default.query(`delete from discussion where discussionid = ${discussionid}`);
                res.json({ message: 'коментари успешно удален' });
            }
            catch (e) {
                res.status(400).json(e);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbackid = req.params.feedbackid.replace(':', '');
                const { rows } = yield index_1.default.query(`select * from feedback where feedbackid = ${feedbackid} ORDER BY createdat desc`);
                if (rows.length <= 0) {
                    res.status(400).json({ message: 'такого фидбека не существует' });
                    return;
                }
                const discussionSqlData = yield index_1.default.query(`select * from discussion where feedbackid = ${feedbackid}`);
                const discussionDatas = discussionSqlData.rows;
                // console.log(discussiondata)
                const responsData = [];
                for (const discussionData of discussionDatas) {
                    const userSqlData = yield index_1.default.query(`select * from users where userid = ${discussionData.userid}`);
                    const user = userSqlData.rows[0];
                    responsData.push(Object.assign(Object.assign({}, discussionData), { nikname: user.nikname, avatar: user.avatar }));
                }
                res.json({ data: responsData });
            }
            catch (e) {
                res.status(400).json(e);
            }
        });
    }
}
exports.default = new DiscussionController();
