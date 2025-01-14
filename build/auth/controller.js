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
const index_1 = __importDefault(require("../DB/index"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getToken = (userId) => {
    return jsonwebtoken_1.default.sign({
        id: userId
    }, 'privat', { expiresIn: '30m' });
};
class AuthController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, nikname, password, email, avatar } = req.body;
                const { rows } = yield index_1.default.query(`select * from users where nikname = '${nikname}' or email = '${email}'`);
                if (rows.length >= 1) {
                    res.json({ message: 'такой ползаватель уже существует' });
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
                // res.status(400).json(e)
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body; // ligin is email and nikname
                const { rows } = yield index_1.default.query(`select * from users where email = '${login}' or nikname = '${login}'`);
                if (rows.length <= 0) {
                    res.json({ message: 'пороль или логин не правельны' });
                    return;
                }
                const user = rows[0];
                const isPass = bcrypt_1.default.compareSync(password, user.passHash);
                // console.log(isPass)
                if (!isPass) {
                    res.json({ message: 'пороль или логин не правельны' });
                    return;
                }
                const token = getToken(user.userId);
                res.json(user);
            }
            catch (e) {
                res.status(400).json(e);
                // console.log(`login error | ${new Date} | ${e}`)
                console.log(e);
            }
        });
    }
}
exports.default = new AuthController();
