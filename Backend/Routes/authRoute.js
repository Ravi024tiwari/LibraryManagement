import express, { Router } from "express"
import { login,register,logout } from "../Controllers/auth.controller.js"


const authRouter =Router()

authRouter.post("/register",register);
authRouter.post("/login",login)
authRouter.post("/logout",logout)

export {authRouter}