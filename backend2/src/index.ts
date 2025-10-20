import { authRoute } from "./routes/auth/auth";
import express from "express"
import cors from "cors"
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv"
import "./config/passport";

dotenv.config()

const app = express()

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        domain: 'localhost',
        path: '/',
        maxAge: 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});