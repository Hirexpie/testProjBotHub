import express from "express";
import { initDB } from "./DB/init";
import authRouter from './enpoints/auth/router'
import FeedbackRouter from './enpoints/feedbackPosts/router'
import discussionRouter from './enpoints/Discussion/router'
import { http } from "./config/config";
const PORT = http.port

initDB()
const app = express();
app.use(express.json());

app.use('/auth',authRouter)
app.use('/feedback',FeedbackRouter)
app.use('/discussion', discussionRouter)



const main = () => {

    app.listen(4040,() => {
        console.log(`server to start in port:${PORT}`)
    })
}




main()
