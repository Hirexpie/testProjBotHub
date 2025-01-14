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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passResetQueue_1 = require("../../redis/passResetQueue");
const getToken = (userId) => {
    return jsonwebtoken_1.default.sign({
        id: userId
    }, 'privat', {
        expiresIn: '30m'
    });
};
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, nikname, password, email, avatar } = req.body;
                const { rows } = yield index_1.default.query(`select * from users where nikname = '${nikname}' or email = '${email}'`);
                if (rows.length >= 1) {
                    res.status(400).json({ message: 'такой ползаватель уже существует' });
                    return;
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const passHash = bcrypt_1.default.hashSync(password, salt);
                yield index_1.default.query(`insert into 
                users(username,nikname,passHash,email,avatar,createAt,updateAt) 
                values('${username}','${nikname}','${passHash}','${email}','${avatar}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`);
                res.json(rows);
            }
            catch (e) {
                // console.log(`register error | ${new Date} | ${e}`)
                res.status(400).json(e);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body; // ligin is email and nikname
                const { rows } = yield index_1.default.query(`select * from users where email = '${login}' or nikname = '${login}'`);
                if (rows.length <= 0) {
                    res.status(400).json({ message: 'пороль или логин не правельны' });
                    return;
                }
                const user = rows[0];
                // console.log(user.userid)
                if (!user.passhash) {
                    res.json(user.passhash);
                    console.log(user.passhash);
                    return;
                }
                const isPass = yield bcrypt_1.default.compare(password, user.passhash);
                // console.log(isPass)
                if (!isPass) {
                    res.status(400).json({ message: 'пороль или логин не правельны' });
                    return;
                }
                // console.log(user.userId)
                const token = getToken(user.userid);
                res.json({ token: token });
            }
            catch (e) {
                res.status(400).json(e);
                // console.log(`login error | ${new Date} | ${e}`)
                // console.log(e)
            }
        });
    }
    getCodeResetPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const { rows } = yield index_1.default.query(`select * from users where email = '${email}'`);
                if (rows.length <= 0) {
                    res.json({ message: 'не правельная почта' });
                    return;
                }
                const code = Math.floor(100000 + Math.random() * 900000);
                passResetQueue_1.passResetQueue.add({
                    code,
                    userid: rows[0].userid,
                    email
                });
                const transporter = nodemailer_1.default.createTransport({
                    // host: 'smtp.gmail.com',
                    // port: 465,
                    // secure: true,
                    service: 'gmail',
                    auth: {
                        user: 'feetback27@gmail.com',
                        pass: 'newpass888',
                    },
                });
                // transporter.verify((err) => {
                //     if (err) console.log(err)
                // })
                const mailOptions = {
                    from: '"feetback" <feetback27@gmail.com>',
                    to: 'bdrik61@gmail.com',
                    subject: 'смена пароля',
                    text: `здраствуте вот ваш код:${code}`,
                };
                transporter.sendMail(mailOptions);
                // console.log(info)
                res.json({ code: code });
            }
            catch (e) {
                console.log(e);
                res.status(400).json(e);
            }
        });
    }
    isCodeResetPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    ResetPass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new AuthController();
