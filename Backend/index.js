import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDb } from "./db/db.js";
import { bookRouter } from "./Routes/bookRoute.js";
import { authRouter } from "./Routes/authRoute.js";
import { studentRouter } from "./Routes/studentRoute.js";
import { issueRouter } from "./Routes/issueRoute.js";
import adminDashboardRouter from "./Routes/dashboardRoute.js";

export const app =express();

dotenv.config()

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev")) //here its get all the request to the backend


app.listen(process.env.PORT,()=>{
    connectDb();//here we call that connection of database
    console.log(`Server is listing at the porrt:${process.env.PORT}`)
})

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/book",bookRouter)
app.use("/api/v1/students",studentRouter)
app.use("/api/v1/issue",issueRouter)
app.use("/api/v1/admin",adminDashboardRouter)

