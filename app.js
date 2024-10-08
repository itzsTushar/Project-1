import express from "express"
import cors from "cors"
import cookieparser from "cookie-parser"
import 'dotenv/config'
const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))
app.use(cookieparser())
app.get('/', (req, res) => {
    res.sendFile(process.env.DIRNAME + '/public/index.html');
  });
import router from "./routes/user.routes.js"
app.use('/',router)
export {app}