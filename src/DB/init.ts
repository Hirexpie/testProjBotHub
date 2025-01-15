import { checkDiscussion } from "./Tables/Discussion"
import { checkCategory, checkFeetbacs, checkStatus } from "./Tables/Feetback"
import { checkUsers } from "./Tables/users"
import { postgreaSQL } from "../config/config"
import { checkVots } from "./Tables/Vote"

export const initDB = () => {
    checkUsers()
    checkCategory(postgreaSQL.filters.category)
    checkStatus(postgreaSQL.filters.status)
    checkFeetbacs()
    checkDiscussion()
    checkVots()
}