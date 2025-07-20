import dotenv from "dotenv";
import { db } from "../db";
import cors from "cors"
import express, { Router } from "express"
import { v4 } from "uuid";

const router = Router()

router.post('/guest', async(req, res) => {
    const body = req.body
    let guestUuid = "guest- " + v4()
    try{
        const user = await db.user.create({
        data : {
            username: guestUuid,
            email: guestUuid + "@coolchess.com",
            name: body.name || guestUuid,
            provider: 'GUEST'
        }})

        res.json({
            message: "user created"
        })
    } catch (e) {
        console.log(e)
    }
})

export const authRoute = router