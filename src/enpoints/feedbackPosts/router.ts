import { Router } from 'express';
import controller from './controller'
import { checkauth } from '../checkAuth';

const rout = Router();

// rout.post('/register', controller.)
// rout.post('/login', controller.login)


rout.post('/create',checkauth,controller.create)
rout.delete('/:id',checkauth,controller.delete)
rout.patch('/:id',checkauth,controller.update)


rout.get('/User',checkauth,controller.getOneUser)
rout.get('/all',controller.getAll)
rout.get('/:id',checkauth,controller.getOne)




export default rout