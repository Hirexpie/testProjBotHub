import Bull from 'bull'
import { redisConnect } from './index'


export const passResetQueue = new Bull('paswordResetQueue',redisConnect)
