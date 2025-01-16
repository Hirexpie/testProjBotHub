import { Router } from 'express'
import { checkToken } from '../checkAuth'
import controller from './controller'

const rout = Router()

rout.post('/:feedbackid',checkToken,controller.create)
rout.get('/:feedbackid',controller.getAll)
rout.patch('/:discussionid',checkToken,controller.update)
rout.delete('/:discussionid',checkToken,controller.delete)


// rout.get('/:id')





export default rout