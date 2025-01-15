import Queue from 'bull'
import { redisConnect } from './index'


export const passResetQueue = new Queue('paswordResetQueue',redisConnect)
