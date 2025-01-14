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
// import { title } from "process";
class FeedbackController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const userId = req.userId;
                console.log(userId);
                // for (let i = 0;i< 1000;i++){ // для теста
                index_1.default.query(`insert into 
                    feedback(title,description,categoryId,statusId,userId,createdAt,updatedAt)
                    values('${body.title}','${body.description}','${body.categoryId}','${body.statusId}',${userId},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
                `);
                // }
                res.json({ message: 'фидбек добавлен' });
            }
            catch (e) {
                console.log(e);
                res.status(400).json(e);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const feedbackId = req.params.id.replace(':', '');
                const { rows } = yield index_1.default.query(`select * from feedback where feedbackId = ${feedbackId}`);
                if (rows.length <= 0) {
                    res.status(404).json({ message: 'такого фидбека не существует' });
                    return;
                }
                console.log(rows[0].userid);
                if (rows[0].userid != userId) {
                    res.status(400).json({ message: 'пойзашла ошибка' });
                    return;
                }
                index_1.default.query(`delete from feedback where feedbackId = ${feedbackId}`);
                res.json({ message: 'фидбек успешно удален' });
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
                const body = req.body;
                const userId = req.userId;
                const feedbackId = req.params.id.replace(':', '');
                const { rows } = yield index_1.default.query(`select * from feedback where feedbackId = ${feedbackId}`);
                if (rows.length <= 0) {
                    res.status(404).json({ message: 'такого фидбека не существует' });
                    return;
                }
                if (rows[0].userid != userId) {
                    res.status(400).json({ message: 'пойзашла ошибка' });
                    return;
                }
                const old = rows[0];
                if (body.title == '') {
                    body.title = old.title;
                }
                if (body.description == '') {
                    body.description = old.description;
                }
                if (body.categoryid == 0) {
                    body.categoryid = parseInt(old.categoryid);
                }
                if (body.statusid == 0) {
                    body.statusid = parseInt(old.statusid);
                }
                index_1.default.query(`update feedback set title = '${body.title}',description = '${body.description}', categoryid = ${body.categoryid}, statusid = ${body.statusid}, updatedat = CURRENT_TIMESTAMP where feedbackid = ${feedbackId} `);
                res.json({ message: 'данные обнавлены' });
            }
            catch (e) {
                res.json(e);
                console.log(e);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page = req.query.page || 0;
                let status = req.query.status || 0;
                let category = req.query.category || 0;
                const statusData = yield index_1.default.query(`select * from status where statusid = ${status}`);
                const categoryData = yield index_1.default.query(`select * from category where categoryid = ${category}`);
                // if (typeof page != 'number') {
                //     console.log(typeof page)
                //     res.status(404).json({massage:'ошибка запроса'})
                //     return
                // }
                let sqlQuery = `select * from feedback `;
                if (statusData.rows.length >= 1) {
                    sqlQuery += `where statusid = ${status} `;
                    status = 1;
                }
                if (categoryData.rows.length >= 1) {
                    sqlQuery += status == 1 ? `and categoryid = ${category} ` : `where categoryid = ${category} `;
                    category = 1;
                }
                sqlQuery += `ORDER BY createdat desc LIMIT 100 offset ${100 * page}`;
                console.log(sqlQuery);
                const { rows } = yield index_1.default.query(sqlQuery);
                res.json({ data: rows });
            }
            catch (e) {
                console.log(e);
                res.json(e);
            }
        });
    }
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                // console.log("status="+status)
                // console.log("cat="+category)
                const { rows } = yield index_1.default.query(`select * from feedback where userid = ${userId}`);
                res.json(rows);
            }
            catch (e) {
                console.log(e);
                res.status(400).json(e);
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbackId = req.params.id.replace(':', '');
                const { rows } = yield index_1.default.query(`select * from feedback where feedbackid = ${feedbackId}`);
                if (rows.length <= 0) {
                    res.status(404).json({ message: 'такого фидбека не существует' });
                    return;
                }
                const feetback = rows[0];
                const statusData = yield index_1.default.query(`select * from status where statusid = ${feetback.statusid}`);
                const categoryData = yield index_1.default.query(`select * from category where categoryid = ${feetback.categoryid}`);
                let status = 'Не извесно';
                let category = 'Не извесно';
                if (statusData.rows.length >= 1) {
                    status = statusData.rows[0].val;
                }
                if (categoryData.rows.length >= 1) {
                    category = categoryData.rows[0].val;
                }
                const data = Object.assign(Object.assign({}, feetback), { status,
                    category });
                res.json({ data: data });
            }
            catch (e) {
                res.status(400).json(e);
            }
        });
    }
}
exports.default = new FeedbackController();
