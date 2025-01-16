import { Router } from 'express';
import controller from './controller'

const rout = Router();

rout.post('/register', controller.register)
rout.post('/login', controller.login)



rout.post('/getCodeReset', controller.getCodeResetPass)
rout.post('/isCode', controller.isCodeResetPass)
rout.post('/resetPass', controller.ResetPass)


export default rout