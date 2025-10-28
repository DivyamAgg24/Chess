import express, { Router } from "express"
import { v4 } from "uuid";
import { userService } from "../../services/userService";
import passport from "passport";

const router = Router()


router.post('/guest', async (req, res, next) => {
    const body = req.body
    let guestUuid = "guest-" + v4()
    try {
        const created = await userService.createUser({
            username: guestUuid,
            email: guestUuid + "@chessmaster.com",
            name: body.name || "Guest player",
            provider: 'GUEST',
            password: null
        })
        if (!created.success) {
            return res.status(500).json({ message: "Failed to create guest user" });
        }
        const user = created.user!;
        console.log(user);
        req.login(user, (err) => {
            if (err) return next(err);

            res.status(200).json({
                message: "Guest user created and logged in",
                user,
            });
        });
    } catch (e) {
        next(e);
    }
});

router.get('/google', (req, res, next) => {
    try {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            prompt: 'select_account'
        })(req, res, next);
    } catch (error) {
        next(error); // Pass errors to error-handling middleware
    }
});

router.get(
    "/google/callback",
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login`,
    }),
    (req, res) => {
        console.log("Google OAuth success for user:", req.user);
        res.redirect(`${process.env.CLIENT_URL}/game`);
    }
);

router.get("/me", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy(() => {
            res.clearCookie("connect.sid"); // default cookie name for express-session
            res.json({ message: "Logged out" });
        });
    });
});

export const authRoute = router