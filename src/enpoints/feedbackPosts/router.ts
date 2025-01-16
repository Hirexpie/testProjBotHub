import { Router } from 'express';
import controller from './controller'
import { checkToken,checkAuth } from '../checkAuth';

const rout = Router();

// rout.post('/register', controller.)
// rout.post('/login', controller.login)


rout.post('/create',checkToken,controller.create)
rout.delete('/:feedbackId',checkToken,controller.delete)
rout.patch('/:feedbackId',checkToken,controller.update)

rout.post('/vote/:feedbackId',checkToken,controller.setVote)
rout.get('/User',checkToken,controller.getOneUser)
rout.get('/all',checkAuth,controller.getAll)
rout.get('/:feedbackId',checkAuth,controller.getOne)




export default rout