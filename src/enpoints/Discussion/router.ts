import { Router } from 'express'
import { checkauth } from '../checkAuth'
import controller from './controller'

const rout = Router()

rout.post('/:feedbackid',checkauth,controller.create)
rout.patch('/:discussionid',checkauth,controller.update)
rout.delete('/:discussionid',checkauth,controller.delete)


rout.get('/:feedbackid',controller.getAll)
// rout.get('/:id')





export default rout