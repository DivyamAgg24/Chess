import { authRoute } from "./routes/auth/auth";
import express from "express"
import cors from "cors"
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv"
import "./config/passport";
import { userStatsRoute } from "./routes/user/stats";

dotenv.config()

const app = express()
console.log(process.env.CLIENT_URL)
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL!]
  : ['http://localhost:5173'];

app.use(
    cors({
        origin: allowedOrigins,
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
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);
app.use('/user', userStatsRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});